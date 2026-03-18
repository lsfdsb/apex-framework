#!/bin/bash
# block-dangerous-commands.sh — PreToolUse hook on Bash tool
# Blocks destructive commands before they execute.
# Uses official hookSpecificOutput JSON format per Claude Code docs.
# by L.B. & Claude · São Paulo, 2026

if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — dangerous command blocking disabled." >&2
  exit 0
fi

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Helper: block with exit code 2 (per Claude Code docs, exit 2 = block in PreToolUse)
deny() {
  local reason="$1"
  echo "$reason" >&2
  exit 2
}

# Block rm -rf (suggest trash or specific paths instead)
if echo "$COMMAND" | grep -qE 'rm\s+(-[a-zA-Z]*r[a-zA-Z]*f|--recursive\s+--force|-[a-zA-Z]*f[a-zA-Z]*r)\s'; then
  deny "BLOCKED: rm -rf is not allowed. Use 'trash' or remove specific files individually. Use 'rm -r <specific-path>' without -f."
fi

# Block direct push to main/master
if echo "$COMMAND" | grep -qE 'git\s+push\s+.*\b(main|master)\b'; then
  deny "BLOCKED: Direct push to main/master is not allowed. Create a feature branch (feat/description or fix/description) and push there instead."
fi

# Block force push (but allow --force-with-lease which is safe)
if echo "$COMMAND" | grep -qE 'git\s+push\s+.*(-f\b|--force($|\s))' && ! echo "$COMMAND" | grep -q 'force-with-lease'; then
  deny "BLOCKED: Force push is not allowed. It rewrites history and can cause data loss. Use --force-with-lease if you must, or create a new commit."
fi

# Block drop table/database
if echo "$COMMAND" | grep -qiE '\b(DROP\s+(TABLE|DATABASE)|TRUNCATE)\b'; then
  deny "BLOCKED: Destructive database operations are not allowed via bash. Use a migration file with a proper down migration instead."
fi

exit 0
