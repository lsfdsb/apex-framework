#!/bin/bash
# handle-failure.sh — PostToolUseFailure hook on Bash
# Provides diagnostic context when a Bash command fails.
# Reinforces the APEX "definitive fix" philosophy: understand before fixing.
# Cannot block (informational only). Stdout added to Claude's context.
# by L.B. & Claude · São Paulo, 2026

if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — failure handler disabled. Install: https://jqlang.github.io/jq/download/" >&2
  exit 0
fi

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)
ERROR=$(echo "$INPUT" | jq -r '.error // empty' 2>/dev/null)

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Track consecutive failures on similar commands
FAILURE_LOG="$CLAUDE_PROJECT_DIR/.claude/.failure-log"
TIMESTAMP=$(date +%s)

# Log this failure
echo "$TIMESTAMP|$COMMAND" >> "$FAILURE_LOG" 2>/dev/null

# Count recent failures (last 60 seconds) to detect loops
RECENT_FAILURES=0
if [ -f "$FAILURE_LOG" ]; then
  CUTOFF=$((TIMESTAMP - 60))
  RECENT_FAILURES=$(awk -F'|' -v cutoff="$CUTOFF" '$1 >= cutoff' "$FAILURE_LOG" 2>/dev/null | wc -l | tr -d ' ')
fi

# Detect common failure patterns and provide definitive fix guidance
SUGGESTIONS=""

# TypeScript compilation errors
if echo "$COMMAND" | grep -qE '(tsc|type-check)' && echo "$ERROR" | grep -qiE '(error TS|type.*error)'; then
  SUGGESTIONS="🔥 APEX DEBUG ━ TypeScript error. Read the file:line. DO NOT use 'as any' or '@ts-ignore'. Fix the type definition at the source. Check if other files have the same pattern (grep the codebase)."
fi

# Test failures
if echo "$COMMAND" | grep -qiE '(vitest|jest|test|playwright)' && echo "$ERROR" | grep -qiE '(fail|assert|expect|error)'; then
  SUGGESTIONS="🧪 APEX DEBUG ━ Test failure. Read the assertion carefully — is the test wrong or the implementation? Check: what data does the function actually receive vs what's expected? Fix the root cause, not the test assertion."
fi

# npm install failures
if echo "$COMMAND" | grep -qE '(npm install|pnpm install|yarn add)' && echo "$ERROR" | grep -qiE '(ERESOLVE|peer dep|conflict|404)'; then
  SUGGESTIONS="📦 APEX DEBUG ━ Dependency conflict. Read the conflict tree. Check the library's official docs for compatible versions. Don't use --force or --legacy-peer-deps without understanding why."
fi

# Build failures
if echo "$COMMAND" | grep -qE '(npm run build|next build)' && echo "$ERROR" | grep -qiE '(build.*fail|module not found|cannot find)'; then
  SUGGESTIONS="🏗️ APEX DEBUG ━ Build failure. Check: missing imports, environment variables, or server-only code in client components. Read the FULL error — the first error is usually the root cause, the rest are cascading."
fi

# Permission errors
if echo "$ERROR" | grep -qiE '(EACCES|permission denied|EPERM)'; then
  SUGGESTIONS="🔒 APEX DEBUG ━ Permission error. Understand WHY the permission is denied. Do NOT use sudo or chmod 777. Fix file ownership or run from the correct directory."
fi

# Port already in use
if echo "$ERROR" | grep -qiE '(EADDRINUSE|address already in use)'; then
  SUGGESTIONS="🔌 APEX DEBUG ━ Port in use. Find what's using it: lsof -i :PORT. Kill the process or use a different port. Check if the dev server is already running (/dev status)."
fi

# Connection refused
if echo "$ERROR" | grep -qiE '(ECONNREFUSED|connection refused)'; then
  SUGGESTIONS="🌐 APEX DEBUG ━ Connection refused. The target service is not running. Check: is the database/API server started? Is the URL correct? Don't add retry loops — fix the connection config."
fi

# Detect retry loops (3+ failures in 60 seconds)
if [ "$RECENT_FAILURES" -ge 5 ]; then
  # Grogu concern at 5 failures
  echo ""
  echo "┌──────────────────────────────────────────────────────────────┐"
  echo "│  ⚠️ APEX DEBUG: ${RECENT_FAILURES} failures in the last 60 seconds.                │"
  echo "│                                                              │"
  echo "│  👶 \"Ehh...\" — Grogu is worried about you.                   │"
  echo "│                                                              │"
  echo "│  STOP and rethink:                                           │"
  echo "│   1. Read the FULL error from the first failure              │"
  echo "│   2. Understand the root cause before trying again           │"
  echo "│   3. Check if the approach itself is wrong                   │"
  echo "│   4. Consider a completely different approach                │"
  echo "└──────────────────────────────────────────────────────────────┘"
  echo ""
  # Reset the log to avoid spamming
  tail -3 "$FAILURE_LOG" > "$FAILURE_LOG.tmp" 2>/dev/null && mv "$FAILURE_LOG.tmp" "$FAILURE_LOG" 2>/dev/null
elif [ "$RECENT_FAILURES" -ge 3 ]; then
  echo ""
  echo "⚠️ APEX DEBUG: ${RECENT_FAILURES} failures in the last 60 seconds. Slow down and rethink."
  echo "  1. Read the FULL error from the first failure"
  echo "  2. Understand the root cause before trying again"
  echo "  3. Consider a completely different approach"
  echo ""
fi

if [ -n "$SUGGESTIONS" ]; then
  echo "$SUGGESTIONS"
fi

exit 0
