#!/bin/bash
# enforce-workflow.sh — PreToolUse hook on Write|Edit|MultiEdit
# Deterministic PRD enforcement: blocks new file creation in src/app/
# if no PRD exists in docs/prd/. This makes "PRD before code" a RULE,
# not a suggestion.
#
# Uses official JSON deny format. Exit 0 = allow.
#
# Exemptions:
# - Editing existing files (bug fixes, refactoring)
# - Test files, docs, config, migrations
# - Files outside src/app/ and src/components/
# - When docs/prd/ has at least one PRD file

# jq is required to parse hook input
if ! command -v jq &> /dev/null; then
  echo '{"systemMessage":"⚠️ APEX: jq not installed — PRD enforcement DISABLED. Install: brew install jq"}'
  exit 0
fi

deny() {
  local reason="$1"
  echo "$reason" >&2
  exit 2
}

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

# Look for PRD files in multiple locations (project root, CLAUDE_PROJECT_DIR, CWD)
prd_exists() {
  local dir="$1/docs/prd"
  [ -d "$dir" ] && [ "$(find "$dir" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' ')" -gt 0 ]
}

# Check CLAUDE_PROJECT_DIR first, then CWD, then relative path
if [ -n "${CLAUDE_PROJECT_DIR:-}" ] && prd_exists "$CLAUDE_PROJECT_DIR"; then exit 0; fi
if prd_exists "$(pwd)"; then exit 0; fi
if prd_exists "."; then exit 0; fi
# Also accept PRD files anywhere in docs/ as a fallback
if [ -d "docs" ] && find docs -name "*prd*" -o -name "*PRD*" -o -name "*requirements*" 2>/dev/null | grep -qE '\.(md|txt)$'; then exit 0; fi

# --- BLOCK: No PRD found ---
deny "BLOCKED: No PRD found in docs/prd/. APEX enforces: PRD before code. Creating new app/component files requires a Product Requirements Document first. To unblock: (1) Run /prd [feature name] to generate a PRD, or (2) create docs/prd/your-feature-prd.md manually. Exemptions (these always pass): editing existing files, test files, docs, config, migrations, scripts, files outside src/app/, src/components/, app/, components/."
