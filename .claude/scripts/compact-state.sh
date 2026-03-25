#!/bin/bash
# compact-state.sh — PreCompact/PostCompact hook
# Logs compaction events for session auditing.
# by L.B. & Claude · São Paulo, 2026

set -uo pipefail

# Read hook input from stdin
INPUT=$(cat)

EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // empty' 2>/dev/null)
TRIGGER=$(echo "$INPUT" | jq -r '.trigger // "unknown"' 2>/dev/null)

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
LOG_DIR="$PROJECT_DIR/.claude/session-logs"

# Ensure log dir exists
mkdir -p "$LOG_DIR" 2>/dev/null

case "$EVENT" in
  PreCompact)
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] COMPACT: $TRIGGER — context compaction starting" \
      >> "$LOG_DIR/compaction.log" 2>/dev/null
    ;;
  PostCompact)
    SUMMARY=$(echo "$INPUT" | jq -r '.compact_summary // "no summary"' 2>/dev/null | head -5)
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] COMPACT: $TRIGGER — completed. Summary: $SUMMARY" \
      >> "$LOG_DIR/compaction.log" 2>/dev/null
    ;;
esac

exit 0
