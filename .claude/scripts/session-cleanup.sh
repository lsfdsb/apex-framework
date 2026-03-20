#!/bin/bash
# session-cleanup.sh — SessionEnd hook
# Runs when the session terminates. Kills dev servers, warns about uncommitted work.
# Timeout: 1.5s default for SessionEnd hooks (keep this fast).
# by L.B. & Claude · São Paulo, 2026

if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — session cleanup limited." >&2
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# ── Kill ALL dev servers started by this project ──

# 1. Kill tracked dev server (PID file)
for pidfile in "$PROJECT_DIR/.claude/.dev-server.pid" "$PROJECT_DIR/.claude/.dna-server.pid"; do
  if [ -f "$pidfile" ]; then
    PID=$(cat "$pidfile" 2>/dev/null)
    if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
      kill "$PID" 2>/dev/null
      sleep 0.3
      kill -9 "$PID" 2>/dev/null
    fi
    rm -f "$pidfile" 2>/dev/null
  fi
done

# 2. Kill any next dev / vite dev servers running from this project directory
#    This catches servers started manually (npx next dev &) without PID tracking
if command -v lsof &>/dev/null; then
  for port in 3000 3001 3002 3003 8080; do
    PID=$(lsof -ti :$port -sTCP:LISTEN 2>/dev/null)
    if [ -n "$PID" ]; then
      # Only kill if the process is running from our project directory
      PROC_CWD=$(lsof -p "$PID" -Fn 2>/dev/null | grep "^n$PROJECT_DIR" | head -1)
      if [ -n "$PROC_CWD" ]; then
        kill "$PID" 2>/dev/null
      fi
    fi
  done
fi

# 3. Clean up stale worktrees
if command -v git &>/dev/null && git rev-parse --is-inside-work-tree &>/dev/null 2>&1; then
  git worktree prune 2>/dev/null
fi

# ── Clean up temporary files ──
rm -f "$PROJECT_DIR/.claude/.dev-monitor-cursor" 2>/dev/null
rm -f "$PROJECT_DIR/.claude/.apex-state.json" 2>/dev/null

# ── Warn about uncommitted changes ──
if command -v git &>/dev/null && git rev-parse --is-inside-work-tree &>/dev/null 2>&1; then
  CHANGES=$(git status --short 2>/dev/null | wc -l | tr -d ' ')
  if [ "$CHANGES" -gt 0 ]; then
    echo ""
    echo "⚠️ APEX: Session ending with $CHANGES uncommitted file(s). Remember to commit! 👶 Grogu tugs your robe."
  else
    echo "✅ APEX: All clean. 👶 Grogu waves goodbye."
  fi
fi

exit 0
