#!/bin/bash
# Requires jq — warn and allow if missing (hooks should not silently degrade)
if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — library install verification disabled. Install: https://jqlang.github.io/jq/download/" >&2
  exit 0
fi
# verify-install.sh — PreToolUse hook on Bash
# Catches package install commands and injects a reminder to verify the lib.
# Doesn't block — uses additionalContext to add context for Claude.

deny() {
  local reason="$1"
  jq -n --arg reason "$reason" '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$reason}}'
  exit 0
}

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Detect package install commands with an explicit package argument.
# Strategy: split on command separators (&&, ||, ;, |, newline) and check each
# segment independently. This avoids matching "npm install" buried inside
# quoted strings (e.g., git commit messages or echo statements).
PKG=""

# Extract individual command segments (split on &&, ||, ;, |, newlines)
SEGMENTS=$(echo "$COMMAND" | tr ';&|\n' '\n' | sed 's/^[[:space:]]*//')

while IFS= read -r SEG; do
  [ -z "$SEG" ] && continue

  # pnpm add <pkg> / yarn add <pkg> — segment must START with the install command
  if echo "$SEG" | grep -qE '^(pnpm add|yarn add)\s+[^-]'; then
    PKG=$(echo "$SEG" | grep -oE '^(pnpm add|yarn add)\s+[^-][^\s]+' | awk '{print $NF}')
    break
  fi

  # npm install <pkg> / npm i <pkg> — segment must START with npm
  if echo "$SEG" | grep -qE '^npm (install|i)\s+[^-]'; then
    PKG=$(echo "$SEG" | grep -oE '^npm (install|i)\s+[^-][^\s]+' | awk '{print $NF}')
    break
  fi

  # pnpm install <pkg> — segment must START with pnpm install + package name
  if echo "$SEG" | grep -qE '^pnpm install\s+[^-]'; then
    PKG=$(echo "$SEG" | grep -oE '^pnpm install\s+[^-][^\s]+' | awk '{print $NF}')
    break
  fi
done <<< "$SEGMENTS"

if [ -n "$PKG" ]; then
  echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"additionalContext\":\"APEX REMINDER: Before installing '$PKG', verify it using the verify-lib skill. Check: official publisher, no critical CVEs, proper license (MIT/Apache/BSD), TypeScript support, and bundle size. Run 'npm view $PKG' to check details.\"}}"
fi

exit 0
