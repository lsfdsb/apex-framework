#!/bin/bash
# pre-compact.sh — PreCompact hook
# Saves critical workflow state before context compaction.
# Per docs: stdout content from PreCompact isn't added to context,
# but we can save state to a file that SessionStart reads back.
# Requires jq — warn and allow if missing (hooks should not silently degrade)
if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — pre-compact state saving disabled. Install: https://jqlang.github.io/jq/download/" >&2
  exit 0
fi

STATE_FILE="$CLAUDE_PROJECT_DIR/.claude/.apex-state.json"

# Read the transcript to extract current workflow state
INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
CWD=$(echo "$INPUT" | jq -r '.cwd // "."')

# Save what we know about the current state
cat > "$STATE_FILE" << EOF
{
  "last_compact": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "session_id": "$SESSION_ID",
  "cwd": "$CWD",
  "recent_commits": "$(git log --oneline -3 2>/dev/null | tr '\n' ' ' || echo 'none')",
  "current_branch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
  "uncommitted_files": "$(git status --short 2>/dev/null | wc -l | tr -d ' ')"
}
EOF

exit 0
