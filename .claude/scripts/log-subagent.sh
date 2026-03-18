#!/bin/bash
# log-subagent.sh — SubagentStop hook
# Tracks subagent token usage for statusline display.
# Accumulates totals in /tmp/apex-agents-$SESSION_ID.json
#
# SubagentStop payload has NO token fields — only agent_type, agent_id,
# last_assistant_message, and agent_transcript_path. We extract tokens
# by scanning the agent transcript for usage data.
#
# by L.B. & Claude · São Paulo, 2026

if ! command -v jq &> /dev/null; then
  exit 0
fi

INPUT=$(cat)

AGENT_TYPE=$(echo "$INPUT" | jq -r '.agent_type // "unknown"' 2>/dev/null)
TRANSCRIPT=$(echo "$INPUT" | jq -r '.agent_transcript_path // ""' 2>/dev/null)

# Extract token usage from agent transcript
TOKENS=0
TOOL_COUNT=0
if [ -n "$TRANSCRIPT" ] && [ -f "$TRANSCRIPT" ]; then
  # Sum all output_tokens from assistant messages (= tokens the agent generated)
  TOKENS=$(grep -o '"output_tokens":[0-9]*' "$TRANSCRIPT" 2>/dev/null | \
    awk -F: '{s+=$2} END {print s+0}')
  # Count tool uses
  TOOL_COUNT=$(grep -c '"type":"tool_use"' "$TRANSCRIPT" 2>/dev/null || echo "0")
fi

# Accumulate to session file
SESSION_ID="${CLAUDE_SESSION_ID:-default}"
AGENT_FILE="/tmp/apex-agents-${SESSION_ID}.json"

if [ ! -f "$AGENT_FILE" ]; then
  echo '{"count":0,"total_tokens":0,"total_tool_uses":0}' > "$AGENT_FILE"
fi

PREV=$(cat "$AGENT_FILE" 2>/dev/null || echo '{"count":0,"total_tokens":0,"total_tool_uses":0}')
echo "$PREV" | jq \
  --argjson tok "$TOKENS" \
  --argjson tools "$TOOL_COUNT" '
  .count += 1 |
  .total_tokens += $tok |
  .total_tool_uses += $tools
' > "${AGENT_FILE}.tmp" 2>/dev/null && mv "${AGENT_FILE}.tmp" "$AGENT_FILE"

exit 0
