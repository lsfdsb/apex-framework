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
  echo "⚠️ APEX: jq not installed — subagent tracking disabled."
  exit 0
fi

INPUT=$(cat)

AGENT_ID=$(echo "$INPUT" | jq -r '.agent_id // "unknown"' 2>/dev/null)
AGENT_TYPE=$(echo "$INPUT" | jq -r '.agent_type // "unknown"' 2>/dev/null)
TRANSCRIPT=$(echo "$INPUT" | jq -r '.agent_transcript_path // ""' 2>/dev/null)

# Remove from running agents list
RUNNING_FILE="/tmp/apex-agents-running.json"
if [ -f "$RUNNING_FILE" ]; then
  jq --arg id "$AGENT_ID" '.running = [.running[] | select(.id != $id)]' \
    "$RUNNING_FILE" > "${RUNNING_FILE}.tmp" 2>/dev/null && mv "${RUNNING_FILE}.tmp" "$RUNNING_FILE"
fi

# Get session_id from the hook input JSON (CLAUDE_SESSION_ID env var doesn't exist)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "default"' 2>/dev/null)

# Dedup: hook fires from both global and project settings.
# Use a lock file per agent_id to prevent double-counting.
LOCK_FILE="/tmp/apex-agent-${AGENT_ID}.done"
if [ -f "$LOCK_FILE" ]; then
  exit 0
fi
touch "$LOCK_FILE"

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
AGENT_FILE="/tmp/apex-agents.json"

if [ ! -f "$AGENT_FILE" ]; then
  echo '{"count":0,"types":[],"total_tokens":0,"total_tool_uses":0}' > "$AGENT_FILE"
fi

PREV=$(cat "$AGENT_FILE" 2>/dev/null || echo '{"count":0,"types":[],"total_tokens":0,"total_tool_uses":0}')
echo "$PREV" | jq \
  --argjson tok "$TOKENS" \
  --argjson tools "$TOOL_COUNT" \
  --arg atype "$AGENT_TYPE" '
  .count += 1 |
  .total_tokens += $tok |
  .total_tool_uses += $tools |
  if (.types // [] | index($atype)) == null then .types = ((.types // []) + [$atype]) else . end
' > "${AGENT_FILE}.tmp" 2>/dev/null && mv "${AGENT_FILE}.tmp" "$AGENT_FILE"

exit 0
