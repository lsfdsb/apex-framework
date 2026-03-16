#!/bin/bash
# Requires jq — warn and allow if missing (hooks should not silently degrade)
if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — file protection disabled. Install: https://jqlang.github.io/jq/download/" >&2
  exit 0
fi
# protect-files.sh — PreToolUse hook
# Blocks edits to protected files. Exit 2 = block. Exit 0 = allow.
# Claude receives stderr as feedback to adjust its approach.

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=""

# Extract file path based on tool type
if [ "$TOOL_NAME" = "Write" ] || [ "$TOOL_NAME" = "Edit" ] || [ "$TOOL_NAME" = "MultiEdit" ]; then
  FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')
fi

# No file path means this isn't a file operation we care about
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Protected patterns — NEVER edit these directly
PROTECTED_PATTERNS=(
  "\.env$"
  "\.env\.local$"
  "\.env\.production$"
  "package-lock\.json$"
  "yarn\.lock$"
  "pnpm-lock\.yaml$"
  "\.git/"
  "node_modules/"
  "vite\.config\.ts$"
  "tsconfig.*\.json$"
  "\.skip\.config\.json$"
  "\.d\.ts$"
)

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if echo "$FILE_PATH" | grep -qE "$pattern"; then
    echo "BLOCKED: Cannot directly edit $FILE_PATH. This is a protected file." >&2
    echo "For .env files: edit .env.example instead and document the variable." >&2
    echo "For lock files: use the package manager (npm install, yarn add, etc)." >&2
    echo "For .git/: use git commands instead." >&2
    exit 2
  fi
done

exit 0
