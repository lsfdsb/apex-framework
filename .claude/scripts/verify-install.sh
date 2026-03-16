#!/bin/bash
# Requires jq — warn and allow if missing (hooks should not silently degrade)
if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — library install verification disabled. Install: https://jqlang.github.io/jq/download/" >&2
  exit 0
fi
# verify-install.sh — PreToolUse hook on Bash
# Catches package install commands and injects a reminder to verify the lib.
# Doesn't block (exit 0) but adds context via stdout for Claude.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Detect package install commands (not npx build tools like tsc, prettier, playwright)
if echo "$COMMAND" | grep -qE '(npm install|npm i |yarn add|pnpm add|pnpm install)\s'; then
  # Extract package name (rough heuristic)
  PKG=$(echo "$COMMAND" | grep -oE '(npm i|npm install|yarn add|pnpm add)\s+[^-][^\s]+' | awk '{print $NF}')
  
  if [ -n "$PKG" ]; then
    echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"additionalContext\":\"APEX REMINDER: Before installing '$PKG', verify it using the verify-lib skill. Check: official publisher, no critical CVEs, proper license (MIT/Apache/BSD), TypeScript support, and bundle size. Run 'npm view $PKG' to check details.\"}}" 
  fi
fi

exit 0
