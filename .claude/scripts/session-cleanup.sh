#!/bin/bash
# session-cleanup.sh — SessionEnd hook
# Runs when the session terminates. Warns about uncommitted work.
# Timeout: 1.5s default for SessionEnd hooks (keep this fast).

if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — session cleanup limited. Install: https://jqlang.github.io/jq/download/" >&2
  exit 0
fi
if ! command -v git &> /dev/null; then exit 0; fi

# Check for uncommitted changes
if git rev-parse --is-inside-work-tree &>/dev/null 2>&1; then
  CHANGES=$(git status --short 2>/dev/null | wc -l | tr -d ' ')
  if [ "$CHANGES" -gt 0 ]; then
    echo "⚠️ APEX: Session ending with $CHANGES uncommitted files. Remember to commit your work."
  fi
fi

# Clean up temporary state file
STATE_FILE="$CLAUDE_PROJECT_DIR/.claude/.apex-state.json"
if [ -f "$STATE_FILE" ]; then
  rm -f "$STATE_FILE" 2>/dev/null
fi

exit 0
