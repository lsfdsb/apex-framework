#!/bin/bash
# log-subagent.sh — SubagentStop hook
# Logs when subagents complete for visibility. Informational only.

if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — subagent logging disabled. Install: https://jqlang.github.io/jq/download/" >&2
  exit 0
fi

INPUT=$(cat)
AGENT_NAME=$(echo "$INPUT" | jq -r '.agent_name // .agent_type // "unknown"' 2>/dev/null)
STATUS=$(echo "$INPUT" | jq -r '.status // "completed"' 2>/dev/null)

echo "APEX: Subagent '$AGENT_NAME' finished (status: $STATUS)."

exit 0
