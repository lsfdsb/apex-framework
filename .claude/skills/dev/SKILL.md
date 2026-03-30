---
name: dev
description: Manage the dev server — check status, view logs, restart, or stop. Auto-started on SessionStart when a project has a "dev" script in package.json. Use when the user says "dev server", "start server", "restart server", "server status", "server logs", "dev logs", "stop server", or "/dev".
---

# Dev Server Management

The APEX dev server runs in the background during your session, with logs captured for monitoring.

## Subcommands

Parse the user's intent and execute the matching subcommand:

### `/dev` or `/dev status`

Check if the dev server is running and show recent output.

```bash
# Check PID
PID_FILE="$CLAUDE_PROJECT_DIR/.claude/.dev-server.pid"
LOG_FILE="$CLAUDE_PROJECT_DIR/.claude/dev-server.log"

if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "🟢 Running (PID $PID)"
    tail -5 "$LOG_FILE"
  else
    echo "🔴 Crashed (PID $PID was not found)"
    tail -15 "$LOG_FILE"
  fi
else
  echo "⚪ Not running"
fi
```

### `/dev logs` or `/dev errors`

Show recent dev server output. Focus on errors and warnings.

```bash
LOG_FILE="$CLAUDE_PROJECT_DIR/.claude/dev-server.log"

# For /dev logs — show last 30 lines
tail -30 "$LOG_FILE"

# For /dev errors — filter errors only
grep -iE '(error|Error:|failed|TypeError|SyntaxError|Cannot find)' "$LOG_FILE" | tail -20
```

### `/dev restart`

Stop the current server and start a fresh one.

```bash
PID_FILE="$CLAUDE_PROJECT_DIR/.claude/.dev-server.pid"
LOG_FILE="$CLAUDE_PROJECT_DIR/.claude/dev-server.log"

# Kill existing
if [ -f "$PID_FILE" ]; then
  OLD_PID=$(cat "$PID_FILE")
  kill "$OLD_PID" 2>/dev/null
  sleep 1
  kill -9 "$OLD_PID" 2>/dev/null
  rm -f "$PID_FILE"
fi

# Clear logs and cursor
> "$LOG_FILE"
rm -f "$CLAUDE_PROJECT_DIR/.claude/.dev-monitor-cursor"

# Detect package manager
if [ -f "pnpm-lock.yaml" ]; then PKG="pnpm"
elif [ -f "yarn.lock" ]; then PKG="yarn"
elif [ -f "bun.lockb" ]; then PKG="bun"
else PKG="npm"; fi

# Start fresh
nohup $PKG run dev > "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"

# Wait for ready
sleep 3
if grep -qiE '(ready|started|listening|localhost)' "$LOG_FILE" 2>/dev/null; then
  URL=$(grep -oE 'https?://localhost:[0-9]+' "$LOG_FILE" | head -1)
  echo "🟢 Restarted${URL:+ · $URL}"
else
  echo "🟡 Restarting... check /dev status in a moment"
fi
```

### `/dev stop`

Stop the dev server.

```bash
PID_FILE="$CLAUDE_PROJECT_DIR/.claude/.dev-server.pid"
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  kill "$PID" 2>/dev/null
  sleep 1
  kill -9 "$PID" 2>/dev/null
  rm -f "$PID_FILE"
  echo "⚪ Dev server stopped"
else
  echo "⚪ No dev server running"
fi
```

## How It Works

1. **SessionStart** → `dev-server.sh` detects `package.json` with a `dev` script, starts the server in background
2. **Stop hook** → `dev-monitor.sh` checks logs after each Claude response for errors/warnings/crashes
3. **SessionEnd** → `session-cleanup.sh` kills the dev server process
4. **Logs** → All output is captured in `.claude/dev-server.log`

## Important

- Always read the actual error from `.claude/dev-server.log` before suggesting fixes
- When the monitor reports errors, address them immediately — a broken dev server blocks the user
- After fixing code, check if the server auto-recovered (hot reload) or needs `/dev restart`
- The log file and PID file are gitignored (`.claude/` is typically not tracked per-project)
