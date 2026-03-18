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
    # Format with available formatter
    if command -v npx &> /dev/null; then
      if [ -f "node_modules/.bin/biome" ]; then
        npx biome format --write "$FILE_PATH" 2>/dev/null || true
      elif [ -f "node_modules/.bin/prettier" ]; then
        npx prettier --write "$FILE_PATH" 2>/dev/null
      fi
    fi
    # Lint fix with available linter
    if command -v npx &> /dev/null; then
      if [ -f "node_modules/.bin/biome" ]; then
        npx biome check --fix "$FILE_PATH" 2>/dev/null || true
      elif [ -f "node_modules/.bin/oxlint" ]; then
        npx oxlint --fix "$FILE_PATH" 2>/dev/null || true
      elif [ -f "node_modules/.bin/eslint" ]; then
        npx eslint --fix "$FILE_PATH" 2>/dev/null || true
      fi
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

# ── TypeScript type-check warning (educational, non-blocking) ──
# If a .ts/.tsx file was edited and tsc is available, run a quick check.
# This teaches the user about type safety without blocking their work.
case "$FILE_PATH" in
  *.ts|*.tsx)
    if [ -f "node_modules/.bin/tsc" ] && [ -f "tsconfig.json" ]; then
      TSC_OUTPUT=$(npx tsc --noEmit --pretty 2>&1 | head -20)
      TSC_EXIT=$?
      if [ "$TSC_EXIT" -ne 0 ] && [ -n "$TSC_OUTPUT" ]; then
        # Count errors
        ERR_COUNT=$(echo "$TSC_OUTPUT" | grep -c 'error TS' || echo "0")
        echo ""
        echo "📚 APEX Type Check: $ERR_COUNT TypeScript error(s) detected."
        echo "   TypeScript catches bugs before they reach users."
        echo "   First error:"
        echo "$TSC_OUTPUT" | grep 'error TS' | head -3 | sed 's/^/   /'
        echo ""
      fi
    fi
    ;;
esac

exit 0
