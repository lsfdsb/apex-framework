#!/bin/bash
# PostToolUse hook: auto-clean worktrees after merge or worktree remove
# Fires on Bash commands containing gh pr merge, git worktree, or git branch -D

INPUT=$(cat)

if ! command -v jq &>/dev/null; then
  echo "⚠️ jq not installed — worktree cleanup skipped" >&2
  exit 0
fi

COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)
[ -z "$COMMAND" ] && exit 0

# Only act on merge/worktree commands
echo "$COMMAND" | grep -qE '(gh pr merge|git worktree|git branch -[dD])' || exit 0

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR" || exit 0

# Prune worktrees that no longer exist on disk
git worktree prune 2>/dev/null

# Find and remove stale agent worktree directories
WORKTREE_DIR="$PROJECT_DIR/.claude/worktrees"
if [ -d "$WORKTREE_DIR" ]; then
  for wt in "$WORKTREE_DIR"/agent-*; do
    [ -d "$wt" ] || continue
    # If git doesn't know about this worktree, remove it
    if ! git worktree list 2>/dev/null | grep -q "$wt"; then
      rm -r "$wt" 2>/dev/null
    fi
  done
fi

# Clean up orphaned worktree branches
for branch in $(git branch --list 'worktree-agent-*' 2>/dev/null); do
  branch=$(echo "$branch" | tr -d ' *')
  # If no worktree uses this branch, delete it
  if ! git worktree list 2>/dev/null | grep -q "$branch"; then
    git branch -D "$branch" 2>/dev/null
  fi
done

exit 0
