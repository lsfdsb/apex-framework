#!/bin/bash
# agent-state-writer.sh — Writes agent state to .apex/state/agents.json
# Triggered by PostToolUse hooks for Agent and SendMessage tools
#
# by Bueno & Claude · São Paulo, 2026

set -uo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
STATE_DIR="$PROJECT_DIR/.apex/state"
AGENTS_FILE="$STATE_DIR/agents.json"

mkdir -p "$STATE_DIR"

# Initialize agents file if missing
if [ ! -f "$AGENTS_FILE" ]; then
  echo '{"agents":[]}' > "$AGENTS_FILE"
fi

TOOL_NAME="${CLAUDE_TOOL_NAME:-}"
TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"

# Only process agent-related tools
case "$TOOL_NAME" in
  Agent|SendMessage) ;;
  *) exit 0 ;;
esac

# Require jq
if ! command -v jq &>/dev/null; then
  exit 0
fi

if [ "$TOOL_NAME" = "Agent" ] && [ -n "$TOOL_INPUT" ]; then
  AGENT_NAME=$(echo "$TOOL_INPUT" | jq -r '.name // .subagent_type // "agent"' 2>/dev/null || echo "agent")
  AGENT_DESC=$(echo "$TOOL_INPUT" | jq -r '.description // ""' 2>/dev/null || true)
  AGENT_TYPE=$(echo "$TOOL_INPUT" | jq -r '.subagent_type // "general-purpose"' 2>/dev/null || echo "general-purpose")

  # Map subagent_type to model
  case "$AGENT_TYPE" in
    builder|qa|design-reviewer|project-manager) MODEL="sonnet" ;;
    watcher|technical-writer) MODEL="haiku" ;;
    *) MODEL="sonnet" ;;
  esac

  # Upsert agent entry
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
fi

if [ "$TOOL_NAME" = "SendMessage" ] && [ -n "$TOOL_INPUT" ]; then
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
  fi
fi

exit 0
