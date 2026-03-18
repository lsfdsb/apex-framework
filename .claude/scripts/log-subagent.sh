#!/bin/bash
# log-subagent.sh — SubagentStop hook
# Tracks subagent token usage for statusline display.
# Accumulates totals in /tmp/apex-agents-$SESSION_ID.json
# by L.B. & Claude · São Paulo, 2026

if ! command -v jq &> /dev/null; then
  exit 0
fi

INPUT=$(cat)

# Extract agent data
AGENT_NAME=$(echo "$INPUT" | jq -r '.agent_name // .agent_type // "unknown"' 2>/dev/null)
STATUS=$(echo "$INPUT" | jq -r '.status // "completed"' 2>/dev/null)

# Extract token counts (try multiple possible field paths)
TOKENS=$(echo "$INPUT" | jq -r '
  (.total_tokens // .usage.total_tokens // .tokens // 0)
' 2>/dev/null || echo "0")
TOOL_USES=$(echo "$INPUT" | jq -r '
  (.tool_uses // .usage.tool_uses // 0)
' 2>/dev/null || echo "0")
DURATION=$(echo "$INPUT" | jq -r '
  (.duration_ms // .usage.duration_ms // 0)
' 2>/dev/null || echo "0")

# Accumulate to session file
SESSION_ID="${CLAUDE_SESSION_ID:-default}"
AGENT_FILE="/tmp/apex-agents-${SESSION_ID}.json"

if [ ! -f "$AGENT_FILE" ]; then
  echo '{"count":0,"total_tokens":0,"total_tool_uses":0,"total_duration_ms":0}' > "$AGENT_FILE"
fi

# Atomic update
PREV=$(cat "$AGENT_FILE" 2>/dev/null || echo '{"count":0,"total_tokens":0,"total_tool_uses":0,"total_duration_ms":0}')
echo "$PREV" | jq --argjson tok "$TOKENS" --argjson tools "$TOOL_USES" --argjson dur "$DURATION" '
  .count += 1 |
  .total_tokens += $tok |
  .total_tool_uses += $tools |
  .total_duration_ms += $dur
' > "$AGENT_FILE" 2>/dev/null

# Dump full payload for schema discovery (first 5 agents only, then stop)
DEBUG_FILE="/tmp/apex-subagent-schema-${SESSION_ID}.log"
DUMP_COUNT=$(wc -l < "$DEBUG_FILE" 2>/dev/null || echo "0")
if [ "$DUMP_COUNT" -lt 50 ]; then
  echo "--- $AGENT_NAME ($STATUS) ---" >> "$DEBUG_FILE"
  echo "$INPUT" | jq '.' >> "$DEBUG_FILE" 2>/dev/null
fi

exit 0
