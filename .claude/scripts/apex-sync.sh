#!/bin/bash
# apex-sync.sh — Sync framework improvements back to the apex-framework repo
#
# When you use APEX in any project and /evolve makes improvements,
# those changes live in the project's .claude/. This script
# detects what changed and creates a PR on the apex-framework repo.
#
# Usage: bash .claude/scripts/apex-sync.sh
#   or:  Claude invokes it via the /evolve skill after user approves changes
#
# Flow:
#   1. Find the apex-framework source repo
#   2. Diff current project's .claude/ against the repo's .claude/
#   3. Copy changed files to a new branch
#   4. Create a PR with a summary of improvements
#
# by L.B. & Claude · São Paulo, 2026

set -e

# ── Find apex-framework repo ──
APEX_REPO="${APEX_FRAMEWORK_REPO:-$HOME/.apex-framework}"

if [ ! -d "$APEX_REPO/.git" ]; then
  # Try common locations
  for candidate in "$HOME/.apex-framework" "$HOME/apex-framework" "$HOME/dev/apex-framework" "$HOME/projects/apex-framework"; do
    if [ -d "$candidate/.git" ]; then
      APEX_REPO="$candidate"
      break
    fi
  done
fi

if [ ! -d "$APEX_REPO/.git" ]; then
  echo '{"systemMessage":"APEX sync: Cannot find apex-framework repo. Set APEX_FRAMEWORK_REPO env var."}'
  exit 0
fi

# ── Check for changes ──
# Use current project's .claude/ as the source (not ~/.claude/)
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
USER_CLAUDE="$PROJECT_DIR/.claude"
REPO_CLAUDE="$APEX_REPO/.claude"
CHANGED_FILES=()

# Compare skills
for skill_dir in "$USER_CLAUDE"/skills/*/; do
  skill_name=$(basename "$skill_dir")
  if [ -f "$skill_dir/SKILL.md" ]; then
    repo_skill="$REPO_CLAUDE/skills/$skill_name/SKILL.md"
    if [ -f "$repo_skill" ]; then
      if ! diff -q "$skill_dir/SKILL.md" "$repo_skill" > /dev/null 2>&1; then
        CHANGED_FILES+=(".claude/skills/$skill_name/SKILL.md")
      fi
    else
      # New skill not in repo
      CHANGED_FILES+=(".claude/skills/$skill_name/SKILL.md")
    fi
  fi
done

# Compare scripts
for script in "$USER_CLAUDE"/scripts/*.sh; do
  script_name=$(basename "$script")
  repo_script="$REPO_CLAUDE/scripts/$script_name"
  if [ -f "$repo_script" ]; then
    if ! diff -q "$script" "$repo_script" > /dev/null 2>&1; then
      CHANGED_FILES+=(".claude/scripts/$script_name")
    fi
  else
    CHANGED_FILES+=(".claude/scripts/$script_name")
  fi
done

# Compare agents
for agent in "$USER_CLAUDE"/agents/*.md; do
  agent_name=$(basename "$agent")
  repo_agent="$REPO_CLAUDE/agents/$agent_name"
  if [ -f "$repo_agent" ]; then
    if ! diff -q "$agent" "$repo_agent" > /dev/null 2>&1; then
      CHANGED_FILES+=(".claude/agents/$agent_name")
    fi
  fi
done

# Compare rules
for rule in "$USER_CLAUDE"/rules/*.md; do
  rule_name=$(basename "$rule")
  repo_rule="$REPO_CLAUDE/rules/$rule_name"
  if [ -f "$repo_rule" ]; then
    if ! diff -q "$rule" "$repo_rule" > /dev/null 2>&1; then
      CHANGED_FILES+=(".claude/rules/$rule_name")
    fi
  fi
done

# Compare output styles
for style in "$USER_CLAUDE"/output-styles/*.md; do
  style_name=$(basename "$style")
  repo_style="$REPO_CLAUDE/output-styles/$style_name"
  if [ -f "$repo_style" ]; then
    if ! diff -q "$style" "$repo_style" > /dev/null 2>&1; then
      CHANGED_FILES+=(".claude/output-styles/$style_name")
    fi
  fi
done

if [ ${#CHANGED_FILES[@]} -eq 0 ]; then
  echo '{"systemMessage":"APEX sync: No changes detected between project .claude/ and the repo. Framework is up to date."}'
  exit 0
fi

# ── Create branch and copy changes ──
BRANCH="evolve/auto-sync-$(date +%Y%m%d-%H%M%S)"
cd "$APEX_REPO"

git fetch origin main 2>/dev/null
git checkout -b "$BRANCH" origin/main 2>/dev/null

for file in "${CHANGED_FILES[@]}"; do
  src="$USER_CLAUDE/${file#.claude/}"
  dest="$APEX_REPO/$file"
  mkdir -p "$(dirname "$dest")"
  cp "$src" "$dest"
done

git add "${CHANGED_FILES[@]}"

# Generate commit message from changed files
CHANGE_SUMMARY=""
for file in "${CHANGED_FILES[@]}"; do
  CHANGE_SUMMARY="$CHANGE_SUMMARY\n- $file"
done

git commit -m "$(cat <<EOF
evolve: sync framework improvements from usage

Auto-synced ${#CHANGED_FILES[@]} files from project .claude/ to the repo.
Changes detected by apex-sync.sh after /evolve improvements.

Files changed:
$(printf '%s\n' "${CHANGED_FILES[@]}" | sed 's/^/- /')

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"

git push -u origin "$BRANCH" 2>/dev/null

# ── Create PR ──
if command -v gh &> /dev/null; then
  PR_URL=$(gh pr create \
    --title "evolve: auto-sync ${#CHANGED_FILES[@]} framework improvements" \
    --body "$(cat <<EOF
## Auto-Sync from Framework Usage

This PR was created automatically by \`apex-sync.sh\` after framework improvements were made during a session in another project.

### Changed Files (${#CHANGED_FILES[@]})

$(printf '%s\n' "${CHANGED_FILES[@]}" | sed 's/^/- `/' | sed 's/$/`/')

### How this happened

1. User ran \`/evolve\` in a project using APEX
2. Framework-evolver proposed improvements
3. User approved changes (applied to project \`.claude/\`)
4. \`apex-sync.sh\` detected drift between project \`.claude/\` and this repo
5. This PR was created to sync improvements back

### Review checklist

- [ ] Changes are genuine improvements (not project-specific overrides)
- [ ] No secrets or project-specific paths leaked
- [ ] Changes align with APEX philosophy

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)" 2>/dev/null)

  echo "{\"systemMessage\":\"APEX sync: PR created with ${#CHANGED_FILES[@]} improvements → $PR_URL\"}"
else
  echo "{\"systemMessage\":\"APEX sync: Branch '$BRANCH' pushed with ${#CHANGED_FILES[@]} changes. Create PR manually (gh not installed).\"}"
fi

# Return to previous branch
git checkout - 2>/dev/null

exit 0
