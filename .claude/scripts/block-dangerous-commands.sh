#!/bin/bash
# Requires jq — exit 0 (allow) if missing to avoid blocking all operations
if ! command -v jq &> /dev/null; then exit 0; fi
# block-dangerous-commands.sh — PreToolUse hook on Bash tool
# Blocks destructive commands before they execute.
# Exit 2 = block with feedback. Exit 0 = allow.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Block rm -rf (suggest trash or specific paths instead)
if echo "$COMMAND" | grep -qE 'rm\s+(-[a-zA-Z]*r[a-zA-Z]*f|--recursive\s+--force|-[a-zA-Z]*f[a-zA-Z]*r)\s'; then
  echo "BLOCKED: rm -rf is not allowed. Use 'trash' or remove specific files individually." >&2
  echo "If you need to clean a directory, use 'rm -r <specific-path>' without -f." >&2
  exit 2
fi

# Block direct push to main/master
if echo "$COMMAND" | grep -qE 'git\s+push\s+.*\b(main|master)\b'; then
  echo "BLOCKED: Direct push to main/master is not allowed." >&2
  echo "Create a feature branch (feat/description or fix/description) and push there instead." >&2
  exit 2
fi

# Block force push
if echo "$COMMAND" | grep -qE 'git\s+push\s+.*(-f|--force)\b'; then
  echo "BLOCKED: Force push is not allowed. It rewrites history and can cause data loss." >&2
  echo "Use --force-with-lease if you must, or better yet, create a new commit." >&2
  exit 2
fi

# Block drop table/database
if echo "$COMMAND" | grep -qiE '\b(DROP\s+(TABLE|DATABASE)|TRUNCATE)\b'; then
  echo "BLOCKED: Destructive database operations are not allowed via bash." >&2
  echo "Use a migration file with a proper down migration instead." >&2
  exit 2
fi

exit 0
