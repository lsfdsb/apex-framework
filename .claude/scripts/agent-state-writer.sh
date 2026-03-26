#!/bin/bash
# agent-state-writer.sh — Writes agent state to .apex/state/agents.json
# Triggered by PostToolUse hooks for Agent and SendMessage tools
# Dual-write: local JSON first, then Supabase (non-blocking background curl).
#
# Hook input: JSON via stdin with tool_name, tool_input fields.
#
# by Bueno & Claude · São Paulo, 2026

set -uo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
STATE_DIR="$PROJECT_DIR/.apex/state"
AGENTS_FILE="$STATE_DIR/agents.json"
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

# Only process agent-related tools
case "$TOOL_NAME" in
  Agent|SendMessage) ;;
  *) exit 0 ;;
esac

# Initialize agents file if missing
if [ ! -f "$AGENTS_FILE" ]; then
  echo '{"agents":[]}' > "$AGENTS_FILE"
fi

# Read session_id for Supabase dual-write
SESSION_ID=""
if [ -f "$SESSION_FILE" ]; then
  SESSION_ID=$(jq -r '.sessionId // empty' "$SESSION_FILE" 2>/dev/null || true)
fi

# ── Helper: Supabase dual-write (non-blocking) ────────────────────────────────
# Uses sb_secret_ key (new Supabase API keys, post-Nov 2025).
# apikey header only — Authorization: Bearer does NOT work with sb_secret_ keys.
SB_KEY="${SUPABASE_SB_SECRET_KEY:-${SUPABASE_SECRET_KEY:-}}"
supabase_upsert_agent() {
  local payload="$1"
  if [ -n "${SUPABASE_URL:-}" ] && [ -n "$SB_KEY" ] && [ -n "$payload" ] && [ -n "$SESSION_ID" ]; then
    curl -sf -X POST "${SUPABASE_URL}/rest/v1/agents" \
      -H "apikey: ${SB_KEY}" \
      -H "Content-Type: application/json" \
      -H "Prefer: resolution=merge-duplicates" \
      -d "$payload" --max-time 3 &>/dev/null &
  fi
}

if [ "$TOOL_NAME" = "Agent" ]; then
  AGENT_NAME=$(echo "$TOOL_INPUT" | jq -r '.name // .subagent_type // "agent"' 2>/dev/null || echo "agent")
  AGENT_DESC=$(echo "$TOOL_INPUT" | jq -r '.description // ""' 2>/dev/null || true)
  AGENT_TYPE=$(echo "$TOOL_INPUT" | jq -r '.subagent_type // "general-purpose"' 2>/dev/null || echo "general-purpose")

  # Map subagent_type to model
  case "$AGENT_TYPE" in
    builder|qa|design-reviewer|project-manager) MODEL="sonnet" ;;
    watcher|technical-writer) MODEL="haiku" ;;
    *) MODEL="sonnet" ;;
  esac

  # Upsert agent entry (local)
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  jq --arg name "$AGENT_NAME" --arg desc "$AGENT_DESC" --arg model "$MODEL" --arg ts "$TIMESTAMP" \
    'if (.agents | map(.name) | index($name)) then
      (.agents[] | select(.name == $name)) |= (
        .status = "active"
        | .currentTask = $desc
        | .model = $model
        | .startedAt = $ts
        | .thoughtStream = (
            (.thoughtStream // []) + [{"timestamp": $ts, "action": $desc, "explanation": "Agent spawned"}]
          )[-5:]
      )
    else
      .agents += [{
        "name": $name,
        "status": "active",
        "model": $model,
        "currentTask": $desc,
        "thoughtStream": [{"timestamp": $ts, "action": $desc, "explanation": "Agent spawned"}],
        "startedAt": $ts
      }]
    end' \
    "$AGENTS_FILE" > "${AGENTS_FILE}.tmp" && mv "${AGENTS_FILE}.tmp" "$AGENTS_FILE" 2>/dev/null || true

  # Supabase dual-write
  if [ -n "$SESSION_ID" ]; then
    SB_PAYLOAD=$(jq -n \
      --arg session_id "$SESSION_ID" \
      --arg name "$AGENT_NAME" \
      --arg model "$MODEL" \
      --arg desc "$AGENT_DESC" \
      --arg ts "$TIMESTAMP" \
      '{
        session_id: $session_id,
        name: $name,
        status: "active",
        model: $model,
        current_task: $desc,
        thought_stream: [{"timestamp": $ts, "action": $desc, "explanation": "Agent spawned"}],
        started_at: $ts
      }' 2>/dev/null)
    supabase_upsert_agent "$SB_PAYLOAD"
  fi
fi

if [ "$TOOL_NAME" = "SendMessage" ]; then
  AGENT_TO=$(echo "$TOOL_INPUT" | jq -r '.to // ""' 2>/dev/null || true)

  if [ -n "$AGENT_TO" ] && [ "$AGENT_TO" != "*" ]; then
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    jq --arg name "$AGENT_TO" --arg ts "$TIMESTAMP" \
      'if (.agents | map(.name) | index($name)) then
        (.agents[] | select(.name == $name)).thoughtStream = (
          ((.agents[] | select(.name == $name)).thoughtStream // [])
          + [{"timestamp": $ts, "action": "Received message", "explanation": "Communication from lead"}]
        )[-5:]
      else . end' \
      "$AGENTS_FILE" > "${AGENTS_FILE}.tmp" && mv "${AGENTS_FILE}.tmp" "$AGENTS_FILE" 2>/dev/null || true

    # Supabase dual-write
    if [ -n "$SESSION_ID" ] && [ -n "${SUPABASE_URL:-}" ] && [ -n "$SB_KEY" ]; then
      THOUGHT_STREAM=$(jq -r --arg name "$AGENT_TO" \
        '(.agents[] | select(.name == $name)).thoughtStream // []' \
        "$AGENTS_FILE" 2>/dev/null || echo "[]")
      SB_PAYLOAD=$(jq -n \
        --arg session_id "$SESSION_ID" \
        --arg name "$AGENT_TO" \
        --argjson stream "$THOUGHT_STREAM" \
        '{
          session_id: $session_id,
          name: $name,
          thought_stream: $stream
        }' 2>/dev/null)
      supabase_upsert_agent "$SB_PAYLOAD"
    fi
  fi
fi

exit 0
