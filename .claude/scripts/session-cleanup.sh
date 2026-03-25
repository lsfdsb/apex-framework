#!/bin/bash
# session-cleanup.sh — SessionEnd hook
# Runs when the session terminates. Kills dev servers, cleans temp files.
# SAFETY: Only kills PIDs that are actual node/vite processes, never hook scripts.
#         Previous bug: PID file contained the hook script's PID, and killing it
#         disrupted Claude Code's process group, preventing next session responses.
# by L.B. & Claude · São Paulo, 2026

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# ── Kill tracked dev servers (safe: verify it's a node process first) ──
for pidfile in "$PROJECT_DIR/.claude/.dev-server.pid" "$PROJECT_DIR/.claude/.dna-server.pid"; do
  if [ -f "$pidfile" ]; then
    PID=$(head -1 "$pidfile" 2>/dev/null | tr -d '[:space:]')
    if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
      # SAFETY: only kill if it's a node/vite process, NOT a bash/hook script
      PROC_CMD=$(ps -p "$PID" -o comm= 2>/dev/null)
      case "$PROC_CMD" in
        node|vite|esbuild|next|npm|pnpm|yarn|bun)
          kill "$PID" 2>/dev/null
          ;;
        *)
          # Not a dev server — leave it alone (could be a Claude hook process)
          ;;
      esac
    fi
    rm -f "$pidfile" 2>/dev/null
  fi
done

# ── Clean up stale worktrees ──
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
    echo "⚠️ APEX: Session ending with $CHANGES uncommitted file(s). Remember to commit!"
  else
    echo "✅ APEX: All clean."
  fi
fi

exit 0
