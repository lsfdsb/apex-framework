#!/bin/bash
# post-compact.sh — PostCompact hook
# Verifies critical context survived compaction by checking the saved state.
# Informational only (cannot block). Stdout added to context.

if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — post-compact verification disabled. Install: https://jqlang.github.io/jq/download/" >&2
  exit 0
fi

STATE_FILE="$CLAUDE_PROJECT_DIR/.claude/.apex-state.json"

if [ -f "$STATE_FILE" ]; then
  BRANCH=$(jq -r '.current_branch // "unknown"' "$STATE_FILE" 2>/dev/null)
  UNCOMMITTED=$(jq -r '.uncommitted_files // "0"' "$STATE_FILE" 2>/dev/null)
  LAST_COMPACT=$(jq -r '.last_compact // "unknown"' "$STATE_FILE" 2>/dev/null)

  echo "APEX POST-COMPACT: State restored from $LAST_COMPACT."
  echo "  Branch: $BRANCH | Uncommitted files: $UNCOMMITTED"

  if [ "$UNCOMMITTED" -gt 0 ] 2>/dev/null; then
    echo "  ⚠️ There are uncommitted changes. Consider committing before continuing."
  fi
else
  echo "APEX POST-COMPACT: No saved state found. Run /compact manually if context is low."
fi

exit 0
