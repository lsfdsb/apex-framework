#!/bin/bash
# enforce-workflow.sh — PreToolUse hook on Write|Edit|MultiEdit
# Deterministic PRD enforcement: blocks new file creation in src/app/
# if no PRD exists in docs/prd/. This makes "PRD before code" a RULE,
# not a suggestion.
#
# Exit 2 = block with feedback. Exit 0 = allow.
#
# Exemptions:
# - Editing existing files (bug fixes, refactoring)
# - Test files, docs, config, migrations
# - Files outside src/app/ and src/components/
# - When docs/prd/ has at least one PRD file

# jq is required to parse hook input
if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — workflow enforcement disabled. Install jq: https://jqlang.github.io/jq/download/" >&2
  exit 0
fi

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')

# No file path = not a file operation we care about
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# --- Exemptions ---

# Allow edits to existing files (bug fixes, refactoring)
if [ "$TOOL_NAME" = "Edit" ] || [ "$TOOL_NAME" = "MultiEdit" ]; then
  exit 0
fi

# Only enforce on Write (new file creation)
if [ "$TOOL_NAME" != "Write" ]; then
  exit 0
fi

# Allow test files
if echo "$FILE_PATH" | grep -qE '\.(test|spec)\.(ts|tsx|js|jsx)$'; then
  exit 0
fi
if echo "$FILE_PATH" | grep -qE '(/__tests__/|/tests/|/test/)'; then
  exit 0
fi

# Allow docs, config, migrations, scripts
if echo "$FILE_PATH" | grep -qE '(docs/|\.md$|\.json$|\.yaml$|\.yml$|\.config\.|migrations/|scripts/|\.sh$|\.env)'; then
  exit 0
fi

# Allow files outside core app directories
if ! echo "$FILE_PATH" | grep -qE '(src/app/|src/components/|src/pages/|src/features/|app/|components/|pages/)'; then
  exit 0
fi

# --- PRD Check ---

# Look for PRD files in docs/prd/ (project root relative)
PRD_DIR="docs/prd"
if [ -n "$CLAUDE_PROJECT_DIR" ]; then
  PRD_DIR="$CLAUDE_PROJECT_DIR/docs/prd"
fi

# If docs/prd/ exists and has at least one .md file, allow
if [ -d "$PRD_DIR" ]; then
  PRD_COUNT=$(find "$PRD_DIR" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')
  if [ "$PRD_COUNT" -gt 0 ]; then
    exit 0
  fi
fi

# --- BLOCK: No PRD found ---
echo "BLOCKED: No PRD found in docs/prd/." >&2
echo "" >&2
echo "APEX enforces: PRD before code. Creating new app/component files" >&2
echo "requires a Product Requirements Document first." >&2
echo "" >&2
echo "To unblock:" >&2
echo "  1. Run /prd [feature name] to generate a PRD" >&2
echo "  2. Or create docs/prd/your-feature-prd.md manually" >&2
echo "" >&2
echo "Exemptions (these always pass):" >&2
echo "  - Editing existing files (bug fixes, refactoring)" >&2
echo "  - Test files, docs, config, migrations, scripts" >&2
echo "  - Files outside src/app/, src/components/, app/, components/" >&2
exit 2
