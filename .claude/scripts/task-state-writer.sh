#!/bin/bash
# task-state-writer.sh — Writes task state to .apex/state/tasks.json
# Triggered by PostToolUse hooks for TaskCreate and TaskUpdate
# Dual-write: local JSON first, then Supabase (non-blocking background curl).
#
# Hook input: JSON via stdin with tool_name, tool_input, tool_output fields.
#
# by Bueno & Claude · São Paulo, 2026

set -uo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
STATE_DIR="$PROJECT_DIR/.apex/state"
TASKS_FILE="$STATE_DIR/tasks.json"
SESSION_FILE="$STATE_DIR/session.json"

mkdir -p "$STATE_DIR"

# Require jq
if ! command -v jq &>/dev/null; then
  exit 0
fi

# Read hook input from stdin (Claude Code passes JSON via stdin)
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null || true)
TOOL_INPUT=$(echo "$INPUT" | jq -c '.tool_input // {}' 2>/dev/null || true)
TOOL_OUTPUT=$(echo "$INPUT" | jq -c '.tool_output // {}' 2>/dev/null || true)

# Only process task tools
case "$TOOL_NAME" in
  TaskCreate|TaskUpdate) ;;
  *) exit 0 ;;
esac

# Initialize tasks file if missing
if [ ! -f "$TASKS_FILE" ]; then
  echo '{"projectName":"APEX Session","tasks":[],"meta":{"p0Count":0,"p1Count":0,"p2Count":0,"completedCount":0,"velocity":0}}' > "$TASKS_FILE"
fi

# Read session_id for Supabase dual-write
SESSION_ID=""
if [ -f "$SESSION_FILE" ]; then
  SESSION_ID=$(jq -r '.sessionId // empty' "$SESSION_FILE" 2>/dev/null || true)
fi

# ── Helper: Supabase dual-write (non-blocking) ────────────────────────────────
supabase_upsert_task() {
  local payload="$1"
  if [ -n "${SUPABASE_URL:-}" ] && [ -n "${SUPABASE_SECRET_KEY:-}" ] && [ -n "$payload" ]; then
    curl -sf -X POST "${SUPABASE_URL}/rest/v1/tasks" \
      -H "apikey: ${SUPABASE_SECRET_KEY}" \
      -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}" \
      -H "Content-Type: application/json" \
      -H "Prefer: resolution=merge-duplicates" \
      -d "$payload" --max-time 3 &>/dev/null &
  fi
}

if [ "$TOOL_NAME" = "TaskCreate" ]; then
  SUBJECT=$(echo "$TOOL_INPUT" | jq -r '.subject // empty' 2>/dev/null || true)
  # Task ID comes from tool_output (Claude Code assigns it)
  TASK_ID=$(echo "$TOOL_OUTPUT" | jq -r '.taskId // .id // empty' 2>/dev/null || true)
  # Also check tool_output as string (sometimes it's just the ID)
  if [ -z "$TASK_ID" ]; then
    TASK_ID=$(echo "$TOOL_OUTPUT" | jq -r 'if type == "string" then . else empty end' 2>/dev/null || true)
  fi
  [ -z "$TASK_ID" ] && TASK_ID="task-$(date +%s)"

  if [ -n "$SUBJECT" ]; then
    # Extract tag from conventional prefix (feat:, fix:, refactor:, etc.)
    TAG=""
    case "$SUBJECT" in
      feat:*)     TAG="feat" ;;
      fix:*)      TAG="fix" ;;
      refactor:*) TAG="refactor" ;;
      docs:*)     TAG="docs" ;;
      chore:*)    TAG="chore" ;;
      perf:*)     TAG="perf" ;;
      a11y:*)     TAG="a11y" ;;
      security:*) TAG="security" ;;
      test:*)     TAG="test" ;;
    esac
    TAG_JSON="null"
    [ -n "$TAG" ] && TAG_JSON="\"$TAG\""

    jq --arg id "$TASK_ID" --arg title "$SUBJECT" --argjson tag "$TAG_JSON" \
      '.tasks += [{"id":$id,"title":$title,"tag":$tag,"description":"","column":"todo","phase":"P0","dri":"builder","acceptanceCriteria":[],"files":[],"blockedBy":[],"blocks":[],"createdAt":(now|todate),"updatedAt":(now|todate)}]' \
      "$TASKS_FILE" > "${TASKS_FILE}.tmp" && mv "${TASKS_FILE}.tmp" "$TASKS_FILE" 2>/dev/null || true

    # Supabase dual-write
    if [ -n "$SESSION_ID" ]; then
      SB_PAYLOAD=$(jq -n \
        --arg task_id "$TASK_ID" \
        --arg title "$SUBJECT" \
        --argjson tag "$TAG_JSON" \
        --arg session_id "$SESSION_ID" \
        '{
          task_id: $task_id,
          title: $title,
          tag: $tag,
          "column": "todo",
          phase: "P0",
          dri: "builder",
          session_id: $session_id
        }' 2>/dev/null)
      supabase_upsert_task "$SB_PAYLOAD"
    fi
  fi
fi

if [ "$TOOL_NAME" = "TaskUpdate" ]; then
  STATUS=$(echo "$TOOL_INPUT" | jq -r '.status // empty' 2>/dev/null || true)
  TASK_ID_INPUT=$(echo "$TOOL_INPUT" | jq -r '.taskId // empty' 2>/dev/null || true)

  if [ -n "$STATUS" ] && [ -n "$TASK_ID_INPUT" ]; then
    case "$STATUS" in
      pending) COLUMN="todo" ;;
      in_progress) COLUMN="in-progress" ;;
      completed) COLUMN="done" ;;
      *) COLUMN="todo" ;;
    esac

    jq --arg id "$TASK_ID_INPUT" --arg col "$COLUMN" \
      '(.tasks[] | select(.id == $id)).column = $col | (.tasks[] | select(.id == $id)).updatedAt = (now|todate)' \
      "$TASKS_FILE" > "${TASKS_FILE}.tmp" && mv "${TASKS_FILE}.tmp" "$TASKS_FILE" 2>/dev/null || true

    # Supabase dual-write — update column
    if [ -n "${SUPABASE_URL:-}" ] && [ -n "${SUPABASE_SECRET_KEY:-}" ]; then
      SB_PAYLOAD=$(jq -n --arg col "$COLUMN" "{\"column\": \$col}" 2>/dev/null)
      if [ -n "$SB_PAYLOAD" ]; then
        curl -sf -X PATCH "${SUPABASE_URL}/rest/v1/tasks?task_id=eq.${TASK_ID_INPUT}" \
          -H "apikey: ${SUPABASE_SECRET_KEY}" \
          -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}" \
          -H "Content-Type: application/json" \
          -d "$SB_PAYLOAD" --max-time 3 &>/dev/null &
      fi
    fi
  fi
fi

# Update meta
if [ -f "$TASKS_FILE" ]; then
  jq '.meta.completedCount = ([.tasks[] | select(.column == "done")] | length)' \
    "$TASKS_FILE" > "${TASKS_FILE}.tmp" && mv "${TASKS_FILE}.tmp" "$TASKS_FILE" 2>/dev/null || true
fi

exit 0
