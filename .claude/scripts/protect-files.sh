#!/bin/bash
# protect-files.sh — PreToolUse hook
# Requires jq — blocks if missing (file protection must be enforced)

set -uo pipefail  # no -e because hook must not crash Claude Code

if ! command -v jq &> /dev/null; then
  echo '{"systemMessage":"⚠️ APEX: jq not installed — file protection DISABLED. Install: brew install jq"}' >&2
  exit 1
fi
# Blocks edits to protected files using the official JSON deny format.

deny() {
  local reason="$1"
  echo "$reason" >&2
  exit 2
}

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

# Protected patterns — secrets and generated files that should not be directly edited.
# Config files (vite.config.ts, tsconfig.json, .d.ts) are NOT protected — developers
# legitimately need to edit them. Only protect what is truly dangerous or generated.
PROTECTED_PATTERNS=(
  "\.env$"
  "\.env\.local$"
  "\.env\.production$"
  "package-lock\.json$"
  "yarn\.lock$"
  "pnpm-lock\.yaml$"
  "\.git/"
  "node_modules/"
)

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if echo "$FILE_PATH" | grep -qE "$pattern"; then
    deny "BLOCKED: Cannot directly edit $FILE_PATH. This is a protected file. For .env files: edit .env.example instead and document the variable. For lock files: use the package manager (npm install, yarn add, etc). For .git/: use git commands instead."
  fi
done

exit 0
