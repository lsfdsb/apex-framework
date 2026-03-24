#!/bin/bash
# validate-framework.sh — PostToolUse hook on Edit|Write|MultiEdit
# Validates framework integrity when .claude/ files are modified
# Checks cross-references, broken skill refs, orphaned files

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

# Only validate .claude/ directory changes
if ! echo "$FILE_PATH" | grep -q "\.claude/"; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
ERRORS=""

# If an agent was modified, verify its skill references
if echo "$FILE_PATH" | grep -q "\.claude/agents/"; then
  if [ -f "$FILE_PATH" ]; then
    SKILLS_LINE=$(grep "^skills:" "$FILE_PATH" 2>/dev/null | sed 's/^skills: *//' | tr -d ' ')
    if [ -n "$SKILLS_LINE" ]; then
      IFS=',' read -ra SKILL_ARRAY <<< "$SKILLS_LINE"
      for skill in "${SKILL_ARRAY[@]}"; do
        skill=$(echo "$skill" | tr -d ' ')
        if [ -n "$skill" ] && [ ! -d "$PROJECT_DIR/.claude/skills/$skill" ]; then
          ERRORS="${ERRORS}Agent '$(basename "$FILE_PATH" .md)' references missing skill '$skill'. "
        fi
      done
    fi
  fi
fi

# If a hook script was modified, verify it's executable
if echo "$FILE_PATH" | grep -q "\.claude/scripts/.*\.sh$"; then
  if [ -f "$FILE_PATH" ] && [ ! -x "$FILE_PATH" ]; then
    ERRORS="${ERRORS}Script '$(basename "$FILE_PATH")' is not executable (run: chmod +x). "
  fi
fi

# If settings.json was modified, verify it's valid JSON
if echo "$FILE_PATH" | grep -q "settings.*\.json$"; then
  if [ -f "$FILE_PATH" ] && ! jq empty "$FILE_PATH" 2>/dev/null; then
    ERRORS="${ERRORS}settings.json is invalid JSON. "
  fi
fi

# Report errors or pass
if [ -n "$ERRORS" ]; then
  echo "{\"additionalContext\": \"Framework validation warning: ${ERRORS}\"}"
fi

exit 0
