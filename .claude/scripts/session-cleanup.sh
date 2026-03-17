#!/bin/bash
# session-cleanup.sh — SessionEnd hook
# Runs when the session terminates. Warns about uncommitted work.
# Timeout: 1.5s default for SessionEnd hooks (keep this fast).
# by L.B. & Claude · São Paulo, 2026

if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — session cleanup limited. Install: https://jqlang.github.io/jq/download/" >&2
  exit 0
fi
if ! command -v git &> /dev/null; then exit 0; fi

# Check for uncommitted changes
if git rev-parse --is-inside-work-tree &>/dev/null 2>&1; then
  CHANGES=$(git status --short 2>/dev/null | wc -l | tr -d ' ')
  if [ "$CHANGES" -gt 0 ]; then
    echo ""
    echo "┌──────────────────────────────────────────────────────┐"
    echo "│  ⚠️ APEX: Session ending with $CHANGES uncommitted file(s)."
    echo "│  Remember to commit your work!"
    echo "│"
    echo "│  👶 Grogu says: \"*tugs your robe*\" (don't forget!)"
    echo "└──────────────────────────────────────────────────────┘"
  else
    echo ""
    echo "✅ APEX: All clean. Good session! 👶 Grogu waves goodbye."
  fi
fi

# Stop dev server if running
DEV_PID_FILE="$CLAUDE_PROJECT_DIR/.claude/.dev-server.pid"
if [ -f "$DEV_PID_FILE" ]; then
  DEV_PID=$(cat "$DEV_PID_FILE" 2>/dev/null)
  if [ -n "$DEV_PID" ] && kill -0 "$DEV_PID" 2>/dev/null; then
    kill "$DEV_PID" 2>/dev/null
    sleep 0.5
    kill -9 "$DEV_PID" 2>/dev/null
  fi
  rm -f "$DEV_PID_FILE" 2>/dev/null
  rm -f "$CLAUDE_PROJECT_DIR/.claude/.dev-monitor-cursor" 2>/dev/null
fi

# Clean up temporary state file
STATE_FILE="$CLAUDE_PROJECT_DIR/.claude/.apex-state.json"
if [ -f "$STATE_FILE" ]; then
  rm -f "$STATE_FILE" 2>/dev/null
fi

exit 0
