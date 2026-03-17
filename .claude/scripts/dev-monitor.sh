#!/bin/bash
# dev-monitor.sh — Stop hook (runs after Claude responds)
# Checks dev server logs for new errors/warnings since last check.
# Injects findings into Claude's context so issues get addressed proactively.
# by L.B. & Claude · São Paulo, 2026

if [ -z "${CLAUDE_PROJECT_DIR:-}" ]; then
  exit 0
fi

LOG_FILE="$CLAUDE_PROJECT_DIR/.claude/dev-server.log"
PID_FILE="$CLAUDE_PROJECT_DIR/.claude/.dev-server.pid"
CURSOR_FILE="$CLAUDE_PROJECT_DIR/.claude/.dev-monitor-cursor"

# Skip if no dev server running
if [ ! -f "$PID_FILE" ]; then
  exit 0
fi

PID=$(cat "$PID_FILE" 2>/dev/null)
if [ -z "$PID" ]; then
  exit 0
fi

# Check if server crashed
if ! kill -0 "$PID" 2>/dev/null; then
  LAST_LINES=$(tail -10 "$LOG_FILE" 2>/dev/null)
  echo ""
  echo "🔴 APEX DEV MONITOR: Dev server (PID $PID) has crashed."
  if [ -n "$LAST_LINES" ]; then
    echo "Last output:"
    echo "$LAST_LINES"
  fi
  echo "Run /dev restart to start it again."
  echo ""
  rm -f "$PID_FILE" 2>/dev/null
  exit 0
fi

# Skip if no log file
if [ ! -f "$LOG_FILE" ]; then
  exit 0
fi

# Read from where we left off (line-based cursor)
LAST_LINE=0
if [ -f "$CURSOR_FILE" ]; then
  LAST_LINE=$(cat "$CURSOR_FILE" 2>/dev/null | tr -d '[:space:]')
  if ! [[ "$LAST_LINE" =~ ^[0-9]+$ ]]; then
    LAST_LINE=0
  fi
fi

TOTAL_LINES=$(wc -l < "$LOG_FILE" 2>/dev/null | tr -d '[:space:]')

# Nothing new
if [ "$TOTAL_LINES" -le "$LAST_LINE" ]; then
  exit 0
fi

# Extract new lines
NEW_CONTENT=$(tail -n +"$((LAST_LINE + 1))" "$LOG_FILE" 2>/dev/null)

# Update cursor
echo "$TOTAL_LINES" > "$CURSOR_FILE"

# Look for errors and warnings in new content
# Common patterns: Next.js, Vite, Webpack, TypeScript, ESLint
ERRORS=$(echo "$NEW_CONTENT" | grep -iE \
  '(error|Error:|ERROR|failed to compile|Module not found|SyntaxError|TypeError|ReferenceError|Cannot find module|ENOENT|EADDRINUSE|unhandled rejection|fatal|panic)' \
  2>/dev/null | head -20)

WARNINGS=$(echo "$NEW_CONTENT" | grep -iE \
  '(warning|Warning:|WARN|deprecat|unused|⚠)' \
  2>/dev/null | grep -viE '(error|Error:)' | head -10)

# Compilation success after previous errors
RECOVERED=$(echo "$NEW_CONTENT" | grep -iE \
  '(compiled successfully|compiled client|ready in|✓ ready|build completed|no issues found)' \
  2>/dev/null | tail -1)

# Report findings
OUTPUT=""

if [ -n "$ERRORS" ]; then
  OUTPUT="${OUTPUT}\n🔴 APEX DEV MONITOR: Dev server errors detected:\n"
  OUTPUT="${OUTPUT}${ERRORS}\n"
  OUTPUT="${OUTPUT}\nFix these errors before continuing. Check .claude/dev-server.log for full context.\n"
fi

if [ -n "$WARNINGS" ] && [ -z "$ERRORS" ]; then
  # Only show warnings when no errors (errors take priority)
  WARNING_COUNT=$(echo "$WARNINGS" | wc -l | tr -d '[:space:]')
  if [ "$WARNING_COUNT" -gt 3 ]; then
    OUTPUT="${OUTPUT}\n🟡 APEX DEV MONITOR: ${WARNING_COUNT} warnings in dev server. Check .claude/dev-server.log\n"
  fi
fi

if [ -n "$RECOVERED" ] && [ -z "$ERRORS" ]; then
  OUTPUT="${OUTPUT}\n🟢 Dev server: ${RECOVERED}\n"
fi

if [ -n "$OUTPUT" ]; then
  echo -e "$OUTPUT"
fi

exit 0
