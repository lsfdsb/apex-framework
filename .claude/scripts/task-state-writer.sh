#!/bin/bash
# task-state-writer.sh — Writes task state to .apex/state/tasks.json
# Triggered by PostToolUse hooks for TaskCreate and TaskUpdate
#
# by Bueno & Claude · São Paulo, 2026

set -uo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
STATE_DIR="$PROJECT_DIR/.apex/state"
TASKS_FILE="$STATE_DIR/tasks.json"

mkdir -p "$STATE_DIR"

# Initialize tasks file if missing
if [ ! -f "$TASKS_FILE" ]; then
  echo '{"projectName":"APEX Session","tasks":[],"meta":{"p0Count":0,"p1Count":0,"p2Count":0,"completedCount":0,"velocity":0}}' > "$TASKS_FILE"
fi

TOOL_NAME="${CLAUDE_TOOL_NAME:-}"
TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"
TOOL_OUTPUT="${CLAUDE_TOOL_OUTPUT:-}"

# Only process task tools
case "$TOOL_NAME" in
  TaskCreate|TaskUpdate) ;;
  *) exit 0 ;;
esac

# Require jq
if ! command -v jq &>/dev/null; then
  exit 0
fi

if [ "$TOOL_NAME" = "TaskCreate" ] && [ -n "$TOOL_INPUT" ]; then
  SUBJECT=$(echo "$TOOL_INPUT" | jq -r '.subject // empty' 2>/dev/null || true)
  TASK_ID=$(echo "$TOOL_OUTPUT" | jq -r '.taskId // .id // empty' 2>/dev/null || true)
  [ -z "$TASK_ID" ] && TASK_ID="task-$(date +%s)"

  if [ -n "$SUBJECT" ]; then
    # Extract tag from conventional prefix (feat:, fix:, refactor:, etc.)
    TAG=$(echo "$SUBJECT" | sed -n 's/^\(feat\|fix\|refactor\|docs\|chore\|perf\|a11y\|security\|test\):.*/\1/p')
    TAG_JSON="null"
    [ -n "$TAG" ] && TAG_JSON="\"$TAG\""

    jq --arg id "$TASK_ID" --arg title "$SUBJECT" --argjson tag "$TAG_JSON" \
      '.tasks += [{"id":$id,"title":$title,"tag":$tag,"description":"","column":"todo","phase":"P0","dri":"builder","acceptanceCriteria":[],"files":[],"blockedBy":[],"blocks":[],"createdAt":(now|todate),"updatedAt":(now|todate)}]' \
      "$TASKS_FILE" > "${TASKS_FILE}.tmp" && mv "${TASKS_FILE}.tmp" "$TASKS_FILE" 2>/dev/null || true
  fi
fi

if [ "$TOOL_NAME" = "TaskUpdate" ] && [ -n "$TOOL_INPUT" ]; then
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
  fi
fi

# Update meta
if [ -f "$TASKS_FILE" ]; then
  jq '.meta.completedCount = ([.tasks[] | select(.column == "done")] | length)' \
    "$TASKS_FILE" > "${TASKS_FILE}.tmp" && mv "${TASKS_FILE}.tmp" "$TASKS_FILE" 2>/dev/null || true
fi

exit 0
