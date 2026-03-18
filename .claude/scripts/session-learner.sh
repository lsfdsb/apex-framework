#!/bin/bash
# session-learner.sh — SessionEnd hook
# Automatically analyzes session for mistakes, errors, and improvement opportunities.
# Writes a lightweight report to .claude/session-logs/ for the framework-evolver to consume.
#
# This is the "learning" half of the self-evolution loop:
#   1. session-learner.sh (this) — captures what went wrong
#   2. framework-evolver agent — proposes fixes (triggered by /evolve)
#
# by L.B. & Claude · São Paulo, 2026

if ! command -v jq &> /dev/null; then
  exit 0
fi

INPUT=$(cat)
SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
LOG_DIR="${PROJECT_DIR}/.claude/session-logs"
mkdir -p "$LOG_DIR"

REPORT="${LOG_DIR}/session-${SESSION_ID}.md"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
BRANCH=$(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null || echo "unknown")

# Find session transcript
TRANSCRIPT_DIR="$HOME/.claude/projects"
SANITIZED=$(echo "$PROJECT_DIR" | sed 's|/|-|g')
TRANSCRIPT="${TRANSCRIPT_DIR}/${SANITIZED}/${SESSION_ID}.jsonl"

if [ ! -f "$TRANSCRIPT" ]; then
  # Try alternate transcript path
  TRANSCRIPT=$(find "$TRANSCRIPT_DIR" -name "${SESSION_ID}.jsonl" 2>/dev/null | head -1)
fi

if [ ! -f "$TRANSCRIPT" ]; then
  exit 0
fi

# Count metrics from transcript
TOOL_ERRORS=$(grep -c '"is_error":true' "$TRANSCRIPT" 2>/dev/null || echo "0")
HOOK_BLOCKS=$(grep -c 'BLOCKED' "$TRANSCRIPT" 2>/dev/null || echo "0")
USER_MESSAGES=$(grep -c '"role":"user"' "$TRANSCRIPT" 2>/dev/null || echo "0")
ASSISTANT_MESSAGES=$(grep -c '"role":"assistant"' "$TRANSCRIPT" 2>/dev/null || echo "0")
TOOL_USES=$(grep -c '"type":"tool_use"' "$TRANSCRIPT" 2>/dev/null || echo "0")

# Extract error messages (unique, last 20)
ERRORS=$(grep -o '"is_error":true.*"content":"[^"]*"' "$TRANSCRIPT" 2>/dev/null | \
  sed 's/.*"content":"//' | sed 's/"//' | sort -u | tail -20)

# Extract blocked actions
BLOCKS=$(grep -o 'BLOCKED[^"]*' "$TRANSCRIPT" 2>/dev/null | sort -u | tail -10)

# Extract user corrections (messages starting with "no", "don't", "stop", "wrong")
CORRECTIONS=$(grep -o '"content":\[{"type":"text","text":"[^"]*"}' "$TRANSCRIPT" 2>/dev/null | \
  sed 's/.*"text":"//' | sed 's/"}.*//' | \
  grep -iE '^(no[, ]|don.t|stop |wrong|not that|actually|wait)' | tail -10)

# Only write report if there's something interesting
if [ "$TOOL_ERRORS" -eq 0 ] && [ "$HOOK_BLOCKS" -eq 0 ] && [ -z "$CORRECTIONS" ]; then
  # Clean session — just log a one-liner
  echo "# Session $SESSION_ID — $TIMESTAMP — Clean ✅" > "$REPORT"
  echo "Branch: $BRANCH | Messages: $USER_MESSAGES | Tools: $TOOL_USES | Errors: 0 | Blocks: 0" >> "$REPORT"
  exit 0
fi

# Write detailed report
cat > "$REPORT" << REPORT_EOF
# Session Report — $TIMESTAMP
- **Session ID:** $SESSION_ID
- **Branch:** $BRANCH
- **Messages:** $USER_MESSAGES user / $ASSISTANT_MESSAGES assistant
- **Tool uses:** $TOOL_USES
- **Errors:** $TOOL_ERRORS
- **Hook blocks:** $HOOK_BLOCKS

## Errors
$(if [ -n "$ERRORS" ]; then echo "$ERRORS" | while read -r line; do echo "- $line"; done; else echo "None"; fi)

## Blocked Actions
$(if [ -n "$BLOCKS" ]; then echo "$BLOCKS" | while read -r line; do echo "- $line"; done; else echo "None"; fi)

## User Corrections
$(if [ -n "$CORRECTIONS" ]; then echo "$CORRECTIONS" | while read -r line; do echo "- $line"; done; else echo "None"; fi)

## Improvement Signals
$([ "$TOOL_ERRORS" -gt 5 ] && echo "- HIGH: $TOOL_ERRORS tool errors — investigate root causes")
$([ "$HOOK_BLOCKS" -gt 3 ] && echo "- MEDIUM: $HOOK_BLOCKS hook blocks — check for false positives")
$([ -n "$CORRECTIONS" ] && echo "- HIGH: User corrections detected — framework missed something")
REPORT_EOF

# Keep only last 30 session logs (prevent unbounded growth)
ls -t "$LOG_DIR"/session-*.md 2>/dev/null | tail -n +31 | xargs rm -f 2>/dev/null

exit 0
