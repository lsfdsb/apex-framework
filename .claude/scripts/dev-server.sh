#!/bin/bash
# dev-server.sh — SessionStart hook
# Auto-starts the dev server in background and captures logs for monitoring.
# Only activates if a package.json with a "dev" script exists in the project.
# by L.B. & Claude · São Paulo, 2026

# Skip if not in a project directory
if [ -z "${CLAUDE_PROJECT_DIR:-}" ]; then
  exit 0
fi

PROJECT_DIR="$CLAUDE_PROJECT_DIR"
PACKAGE_JSON="$PROJECT_DIR/package.json"
LOG_DIR="$PROJECT_DIR/.claude"
LOG_FILE="$LOG_DIR/dev-server.log"
PID_FILE="$LOG_DIR/.dev-server.pid"

# Skip if no package.json
if [ ! -f "$PACKAGE_JSON" ]; then
  exit 0
fi

# Skip if no jq
if ! command -v jq &> /dev/null; then
  exit 0
fi

# Skip if no "dev" script in package.json
DEV_SCRIPT=$(jq -r '.scripts.dev // empty' "$PACKAGE_JSON" 2>/dev/null)
if [ -z "$DEV_SCRIPT" ]; then
  exit 0
fi

# Skip if dev server is already running
if [ -f "$PID_FILE" ]; then
  OLD_PID=$(cat "$PID_FILE" 2>/dev/null)
  if [ -n "$OLD_PID" ] && kill -0 "$OLD_PID" 2>/dev/null; then
    # Already running — report status
    PORT=$(grep -oE 'localhost:[0-9]+' "$LOG_FILE" 2>/dev/null | tail -1 || echo "")
    echo "🟢 Dev server running (PID $OLD_PID${PORT:+ · http://$PORT}) ━ forge is hot!"
    exit 0
  fi
  # Stale PID file — clean up
  rm -f "$PID_FILE" 2>/dev/null
fi

# Detect package manager
if [ -f "$PROJECT_DIR/pnpm-lock.yaml" ]; then
  PKG_MGR="pnpm"
elif [ -f "$PROJECT_DIR/yarn.lock" ]; then
  PKG_MGR="yarn"
elif [ -f "$PROJECT_DIR/bun.lockb" ]; then
  PKG_MGR="bun"
else
  PKG_MGR="npm"
fi

# Clear previous log
> "$LOG_FILE" 2>/dev/null

# Start dev server in background
cd "$PROJECT_DIR" || exit 0
nohup $PKG_MGR run dev > "$LOG_FILE" 2>&1 &
DEV_PID=$!

# Save PID
echo "$DEV_PID" > "$PID_FILE"

# Wait briefly for server to start (up to 5s)
STARTED=false
for i in $(seq 1 10); do
  sleep 0.5
  # Check if process died
  if ! kill -0 "$DEV_PID" 2>/dev/null; then
    ERRORS=$(tail -5 "$LOG_FILE" 2>/dev/null)
    echo "🔴 Dev server failed to start."
    if [ -n "$ERRORS" ]; then
      echo "  Last output:"
      echo "$ERRORS"
    fi
    rm -f "$PID_FILE" 2>/dev/null
    exit 0
  fi
  # Check if server is ready (common patterns from Next.js, Vite, etc.)
  if grep -qiE '(ready|started|listening|localhost:[0-9]+|Local:)' "$LOG_FILE" 2>/dev/null; then
    STARTED=true
    break
  fi
done

if [ "$STARTED" = true ]; then
  # Extract URL
  URL=$(grep -oE 'https?://localhost:[0-9]+' "$LOG_FILE" 2>/dev/null | head -1)
  if [ -z "$URL" ]; then
    URL=$(grep -oE 'https?://127\.0\.0\.1:[0-9]+' "$LOG_FILE" 2>/dev/null | head -1)
  fi
  echo "┌──────────────────────────────────────────────┐"
  echo "│  🟢 Dev server started                        │"
  echo "│     PID $DEV_PID${URL:+ · $URL}"
  echo "│     Logs: .claude/dev-server.log              │"
  echo "│     Use /dev to check status or restart       │"
  echo "│                                               │"
  echo "│  🔥 The forge is hot. Ready to build.         │"
  echo "└──────────────────────────────────────────────┘"
else
  echo "🟡 Dev server starting (PID $DEV_PID) — forge is heating up..."
  echo "   Logs: .claude/dev-server.log"
  echo "   Use /dev to check status."
fi

exit 0
