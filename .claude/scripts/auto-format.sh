#!/bin/bash
# Requires jq — warn and allow if missing (hooks should not silently degrade)
if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — auto-format disabled. Install: https://jqlang.github.io/jq/download/" >&2
  exit 0
fi
# auto-format.sh — PostToolUse hook on Write|Edit|MultiEdit
# Runs formatter on files Claude just wrote/edited.
# PostToolUse receives tool_input with the file path.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')

if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# Format based on file extension
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.css|*.json|*.md|*.html)
    if command -v npx &> /dev/null && [ -f "node_modules/.bin/prettier" ]; then
      npx prettier --write "$FILE_PATH" 2>/dev/null
    fi
    # Run linter fix after formatting (oxlint for APEX projects, eslint fallback)
    if [ -f "node_modules/.bin/oxlint" ]; then
      npx oxlint --fix "$FILE_PATH" 2>/dev/null || true
    elif [ -f "node_modules/.bin/eslint" ]; then
      npx eslint --fix "$FILE_PATH" 2>/dev/null || true
    fi
    ;;
  *.py)
    if command -v black &> /dev/null; then
      black --quiet "$FILE_PATH" 2>/dev/null
    elif command -v ruff &> /dev/null; then
      ruff format "$FILE_PATH" 2>/dev/null
    fi
    ;;
esac

exit 0
