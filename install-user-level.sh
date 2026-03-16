#!/bin/bash
# install-user-level.sh — Makes APEX standard across ALL projects
#
# 📚 WHY: Per Claude Code docs, ~/.claude/ is the USER scope.
# "User scope is best for: Personal preferences you want everywhere."
# Skills in ~/.claude/skills/ and agents in ~/.claude/agents/ are available
# in every project without copying.
#
# WHAT THIS DOES:
# 1. Copies universal skills to ~/.claude/skills/ (available everywhere)
# 2. Copies agents to ~/.claude/agents/ (available everywhere)
# 3. Copies output style to ~/.claude/output-styles/
# 4. Creates ~/.claude/CLAUDE.md (user-level constitution)
# 5. Leaves project-specific settings in .claude/ (committed to git)
#
# RUN: chmod +x install-user-level.sh && ./install-user-level.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APEX_DIR="$SCRIPT_DIR"
USER_CLAUDE="$HOME/.claude"

echo "🚀 APEX Framework — User-Level Installation"
echo "============================================="
echo ""
echo "This will install APEX into $USER_CLAUDE"
echo "Making it available in ALL your projects."
echo ""

# Create directories
mkdir -p "$USER_CLAUDE/skills"
mkdir -p "$USER_CLAUDE/agents"
mkdir -p "$USER_CLAUDE/output-styles"

# --- Universal Skills (useful in every project) ---
UNIVERSAL_SKILLS=(
  "code-standards"
  "design-system"
  "cx-review"
  "teach"
  "workflow-enforcer"
  "apex-stack"
  "verify-lib"
  "sql-practices"
  "debug"
  "apex-review"
  "a11y"
  "set-language"
  "cost-management"
)

echo "📦 Installing universal skills..."
for skill in "${UNIVERSAL_SKILLS[@]}"; do
  if [ -d "$APEX_DIR/.claude/skills/$skill" ]; then
    cp -r "$APEX_DIR/.claude/skills/$skill" "$USER_CLAUDE/skills/"
    echo "   ✅ $skill"
  else
    echo "   ⚠️  $skill not found, skipping"
  fi
done

# --- Project-scoped skills (stay in .claude/ per project) ---
echo ""
echo "📋 These skills stay PROJECT-level (copy to each project's .claude/):"
echo "   - prd (creates project-specific docs)"
echo "   - architecture (creates project-specific docs)"
echo "   - research (creates project-specific docs)"
echo "   - qa (needs project context)"
echo "   - security (needs project context)"
echo "   - performance (needs project context)"
echo "   - deploy (needs project context)"
echo "   - commit (needs git context)"
echo "   - changelog (needs project docs)"
echo "   - init (project setup)"
echo "   - e2e (Playwright E2E tests)"
echo "   - cicd (GitHub Actions pipeline)"

# --- Agents ---
echo ""
echo "🤖 Installing agents..."
for agent in "$APEX_DIR"/.claude/agents/*.md; do
  if [ -f "$agent" ]; then
    cp "$agent" "$USER_CLAUDE/agents/"
    echo "   ✅ $(basename "$agent" .md)"
  fi
done

# --- Output Style ---
echo ""
echo "🎨 Installing output styles..."
for style in "$APEX_DIR"/.claude/output-styles/*.md; do
  if [ -f "$style" ]; then
    cp "$style" "$USER_CLAUDE/output-styles/"
    echo "   ✅ $(grep '^name:' "$style" | sed 's/name: //')"
  fi
done

# --- Scripts (statusline + hooks available globally) ---
echo ""
echo "🔧 Installing scripts (statusline, hooks)..."
mkdir -p "$USER_CLAUDE/scripts"
for script in "$APEX_DIR"/.claude/scripts/*.sh; do
  if [ -f "$script" ]; then
    cp "$script" "$USER_CLAUDE/scripts/"
    chmod +x "$USER_CLAUDE/scripts/$(basename "$script")"
    echo "   ✅ $(basename "$script")"
  fi
done

# --- Preferences file (language + cost threshold) ---
if [ ! -f "$USER_CLAUDE/apex-preferences.json" ]; then
  echo ""
  echo "🌐 Creating preferences file..."
  cat > "$USER_CLAUDE/apex-preferences.json" << 'PREFJSON'
{
  "language": "pt-br",
  "cost_alert_threshold_usd": 5.00
}
PREFJSON
  echo "   ✅ ~/.claude/apex-preferences.json (pt-br default)"
else
  echo ""
  echo "🌐 Preferences file already exists, keeping current settings."
fi

# --- User CLAUDE.md ---
echo ""
echo "📄 Installing user-level CLAUDE.md..."
cat > "$USER_CLAUDE/CLAUDE.md" << 'CLAUDEMD'
# APEX Framework — User Constitution

> "Simplicity is the ultimate sophistication." — Da Vinci

## I Am

A Head of Customer Experience building world-class applications with Claude Code. I follow the APEX philosophy: design like Ive, code like Torvalds, secure like Ionescu, business like Amodei.

## Always

- Explain what you're building and why (educational output)
- Ask my language preference (en-us or pt-br) at session start
- Check for a PRD before implementing new features
- Run tests after writing code
- Verify libraries before installing (security, license, maintenance)
- Adapt to my project's existing stack

## Never

- Skip steps in the workflow (PRD → Architecture → Research → Build → QA → Deploy)
- Install unverified dependencies
- Push directly to main
- Leave code untested
- Use console.log in production
CLAUDEMD
echo "   ✅ ~/.claude/CLAUDE.md"

# --- User Settings ---
echo ""
echo "⚙️  Installing user settings..."
if [ -f "$USER_CLAUDE/settings.json" ]; then
  echo "   ⚠️  ~/.claude/settings.json already exists."
  echo "   Backing up to ~/.claude/settings.json.backup"
  cp "$USER_CLAUDE/settings.json" "$USER_CLAUDE/settings.json.backup"
fi

cat > "$USER_CLAUDE/settings.json" << 'SETTINGSJSON'
{
  "outputStyle": "~/.claude/output-styles/apex-educational.md",
  "model": "opusplan",
  "preferences": {
    "teammateMode": "tmux"
  }
}
SETTINGSJSON
echo "   ✅ ~/.claude/settings.json (opusplan model, APEX output style)"

echo ""
echo "============================================="
echo "✅ APEX installed at user level!"
echo ""
echo "What's available everywhere now:"
echo "  - ${#UNIVERSAL_SKILLS[@]} universal skills"
echo "  - 3 subagents (code-reviewer, researcher, design-reviewer)"
echo "  - APEX Educational output style"
echo "  - User CLAUDE.md with core philosophy"
echo ""
echo "For each new project, copy the project-level files:"
echo "  cp -r /path/to/apex-framework/.claude/skills/{prd,architecture,research,qa-gate,security-audit,performance,deploy} .claude/skills/"
echo "  cp -r /path/to/apex-framework/.claude/scripts .claude/"
echo "  cp /path/to/apex-framework/.claude/settings.json .claude/"
echo "  cp /path/to/apex-framework/CLAUDE.md ."
echo "  chmod +x .claude/scripts/*.sh"
echo ""
echo "Or just start Claude Code and say: 'Initialize APEX for this project'"
echo ""
echo "This is the way. 🚀"
