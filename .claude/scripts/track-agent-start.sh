#!/bin/bash
# track-agent-start.sh — SubagentStart hook
# Tracks currently running agents for statusline display.
# Writes to /tmp/apex-agents-running.json so statusline can show active agents.
#
# by L.B. & Claude · São Paulo, 2026

if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — agent tracking disabled." >&2
  exit 0
fi

INPUT=$(cat)

AGENT_ID=$(echo "$INPUT" | jq -r '.agent_id // "unknown"' 2>/dev/null)
AGENT_TYPE=$(echo "$INPUT" | jq -r '.agent_type // "unknown"' 2>/dev/null)

# Track running agents
RUNNING_FILE="/tmp/apex-agents-running.json"

if [ ! -f "$RUNNING_FILE" ]; then
  echo '{"running":[]}' > "$RUNNING_FILE"
fi

# Add this agent to running list (dedup by agent_id)
jq --arg id "$AGENT_ID" --arg type "$AGENT_TYPE" '
  if (.running | map(.id) | index($id)) == null
  then .running += [{"id": $id, "type": $type}]
  else .
  end
' "$RUNNING_FILE" > "${RUNNING_FILE}.tmp" 2>/dev/null && mv "${RUNNING_FILE}.tmp" "$RUNNING_FILE"

echo "{\"systemMessage\":\"🤖 Agent spawned: ${AGENT_TYPE}\"}"
exit 0
