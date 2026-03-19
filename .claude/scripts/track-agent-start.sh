#!/bin/bash
# track-agent-start.sh — SubagentStart hook
# Shows a system message when an agent spawns.
#
# by L.B. & Claude · São Paulo, 2026

INPUT=$(cat)

AGENT_TYPE="unknown"
if command -v jq &> /dev/null; then
  AGENT_TYPE=$(echo "$INPUT" | jq -r '.agent_type // "unknown"' 2>/dev/null)
fi

echo "{\"systemMessage\":\"🤖 Agent spawned: ${AGENT_TYPE}\"}"
exit 0
