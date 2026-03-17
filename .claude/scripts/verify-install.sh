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

# Detect package install commands with an explicit package argument.
# Use word-boundary anchoring to avoid matching "npm install" inside "pnpm install".
# Only warn when a real package name follows the command (not bare install/flags only).
PKG=""

# pnpm add <pkg> / yarn add <pkg>
if echo "$COMMAND" | grep -qE '\b(pnpm add|yarn add)\s+[^-]'; then
  PKG=$(echo "$COMMAND" | grep -oE '\b(pnpm add|yarn add)\s+[^-][^\s]+' | awk '{print $NF}')
fi

# npm install <pkg> / npm i <pkg> — require explicit non-flag argument
if [ -z "$PKG" ] && echo "$COMMAND" | grep -qE '\bnpm (install|i)\s+[^-]'; then
  PKG=$(echo "$COMMAND" | grep -oE '\bnpm (install|i)\s+[^-][^\s]+' | awk '{print $NF}')
fi

# pnpm install <pkg> — only when a package name follows (not bare pnpm install)
if [ -z "$PKG" ] && echo "$COMMAND" | grep -qE '\bpnpm install\s+[^-]'; then
  PKG=$(echo "$COMMAND" | grep -oE '\bpnpm install\s+[^-][^\s]+' | awk '{print $NF}')
fi

if [ -n "$PKG" ]; then
  echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"additionalContext\":\"APEX REMINDER: Before installing '$PKG', verify it using the verify-lib skill. Check: official publisher, no critical CVEs, proper license (MIT/Apache/BSD), TypeScript support, and bundle size. Run 'npm view $PKG' to check details.\"}}"
fi

exit 0
