#!/bin/bash
# block-dangerous-commands.sh — PreToolUse hook on Bash tool
# Blocks destructive commands before they execute.
# Uses official hookSpecificOutput JSON format per Claude Code docs.
# by L.B. & Claude · São Paulo, 2026

if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX Safety: jq not installed — dangerous command blocking disabled. Install: https://jqlang.github.io/jq/download/"
  exit 0
fi

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Helper: block with exit code 2 (per Claude Code docs, exit 2 = block in PreToolUse)
deny() {
  local reason="$1"
  echo "$reason" >&2
  exit 2
}

# Block rm -rf (suggest trash or specific paths instead)
if echo "$COMMAND" | grep -qE 'rm\s+(-[a-zA-Z]*r[a-zA-Z]*f|--recursive\s+--force|-[a-zA-Z]*f[a-zA-Z]*r)\s'; then
  deny "BLOCKED: rm -rf is not allowed. Use 'trash' or remove specific files individually. Use 'rm -r <specific-path>' without -f."
fi

# Block committing directly to main/master
if echo "$COMMAND" | grep -qE '^git\s+commit'; then
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
  if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
    deny "BLOCKED: You are on $CURRENT_BRANCH. Do not commit directly to main/master.

Recovery:
  git checkout -b feat/your-description
  (then commit from the new branch)

The APEX workflow requires all changes to go through feature branches and PRs."
  fi
fi

# Block direct push to main/master
if echo "$COMMAND" | grep -qE 'git\s+push\s+.*\b(main|master)\b'; then
  deny "BLOCKED: Direct push to main/master is not allowed.

Recovery (if you already committed to main):
  git branch feat/your-description
  git reset --hard origin/main
  git checkout feat/your-description
  git push -u origin feat/your-description

Then open a PR: gh pr create --title \"...\" --body \"...\""
fi

# NOTE: gh pr merge is NOT blocked here. The merge approval rule lives in
# CLAUDE.md where Claude can follow it contextually (checking if the user
# said "merge it"). A deterministic shell hook can't read conversation
# context, so blocking here just forces workarounds (gh api) that bypass
# the safety entirely. Defense in depth: the rule is in CLAUDE.md + the
# pre-commit hook blocks commits to main as a backstop.

# Block force push (but allow --force-with-lease which is safe)
if echo "$COMMAND" | grep -qE 'git\s+push\s+.*(-f\b|--force($|\s))' && ! echo "$COMMAND" | grep -q 'force-with-lease'; then
  deny "BLOCKED: Force push is not allowed. It rewrites history and can cause data loss. Use --force-with-lease if you must, or create a new commit."
fi

# Block drop table/database
if echo "$COMMAND" | grep -qiE '\b(DROP\s+(TABLE|DATABASE)|TRUNCATE)\b'; then
  deny "BLOCKED: Destructive database operations are not allowed via bash. Use a migration file with a proper down migration instead."
fi

exit 0
