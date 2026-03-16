#!/bin/bash
# apex-init-project.sh — Apply APEX Framework to any project
# Usage: ~/apex-framework/apex-init-project.sh
# Run from inside your project directory (where .git/ is)
#
# by L.B. & Claude · São Paulo, 2026

set -e

APEX_DIR="$HOME/apex-framework"
PROJECT_DIR="$(pwd)"

# ── Verify we're in a git repo ──
if [ ! -d ".git" ]; then
  echo "❌ Not a git repository. Run 'git init' first, or cd into your project."
  exit 1
fi

# ── Verify apex-framework exists ──
if [ ! -d "$APEX_DIR" ]; then
  echo "❌ ~/apex-framework not found. Extract the APEX package first."
  exit 1
fi

echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║     ⚔️  APEX Framework v5.2 — Project Setup  ║"
echo "  ║     by L.B. & Claude · São Paulo, 2026      ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""
echo "📁 Project: $PROJECT_DIR"
echo ""

# ── Project-level skills ──
echo "📦 Installing project skills..."
mkdir -p .claude/skills
PROJECT_SKILLS=(prd architecture research qa security performance deploy commit changelog init e2e cicd)
for skill in "${PROJECT_SKILLS[@]}"; do
  if [ -d "$APEX_DIR/.claude/skills/$skill" ]; then
    cp -r "$APEX_DIR/.claude/skills/$skill" .claude/skills/
    echo "   ✅ $skill"
  else
    echo "   ⚠️  $skill not found"
  fi
done

# ── Scripts (hooks) ──
echo ""
echo "🔧 Installing hook scripts..."
cp -r "$APEX_DIR/.claude/scripts" .claude/
chmod +x .claude/scripts/*.sh
echo "   ✅ $(ls .claude/scripts/*.sh | wc -l | tr -d ' ') scripts installed"

# ── Rules (path-based) ──
echo ""
echo "📏 Installing rules..."
if [ -d "$APEX_DIR/.claude/rules" ]; then
  cp -r "$APEX_DIR/.claude/rules" .claude/
  echo "   ✅ $(ls .claude/rules/*.md 2>/dev/null | wc -l | tr -d ' ') rules installed"
fi

# ── Settings ──
echo ""
echo "⚙️  Installing settings..."
cp "$APEX_DIR/.claude/settings.json" .claude/settings.json
cp "$APEX_DIR/.claude/settings.local.json" .claude/settings.local.json 2>/dev/null || true
echo "   ✅ settings.json (hooks, permissions, sandbox, statusLine)"

# ── Git hooks ──
echo ""
echo "🪝 Installing git hooks..."
if [ -d "$APEX_DIR/.claude/git-hooks" ]; then
  cp -r "$APEX_DIR/.claude/git-hooks" .claude/
  mkdir -p .git/hooks
  cp .claude/git-hooks/pre-commit .git/hooks/pre-commit 2>/dev/null || true
  cp .claude/git-hooks/commit-msg .git/hooks/commit-msg 2>/dev/null || true
  chmod +x .claude/git-hooks/* .git/hooks/* 2>/dev/null || true
  echo "   ✅ pre-commit + commit-msg"
fi

# ── CLAUDE.md ──
echo ""
echo "📄 Installing CLAUDE.md..."
if [ ! -f "CLAUDE.md" ]; then
  cp "$APEX_DIR/CLAUDE.md" .
  echo "   ✅ CLAUDE.md (project constitution)"
else
  echo "   ⚠️  CLAUDE.md already exists, keeping yours"
fi

# ── .gitignore additions ──
echo ""
echo "📝 Checking .gitignore..."
if [ -f ".gitignore" ]; then
  if ! grep -q "settings.local.json" .gitignore 2>/dev/null; then
    echo "" >> .gitignore
    echo "# APEX Framework" >> .gitignore
    echo ".claude/settings.local.json" >> .gitignore
    echo ".claude/.apex-state.json" >> .gitignore
    echo "   ✅ Added APEX entries to .gitignore"
  else
    echo "   ✅ .gitignore already has APEX entries"
  fi
else
  cp "$APEX_DIR/.gitignore" . 2>/dev/null || true
  echo "   ✅ .gitignore created"
fi

# ── Docs directories ──
mkdir -p docs/prd docs/architecture docs/research docs/reviews

# ── Summary ──
echo ""
echo "═══════════════════════════════════════════════════"
echo "✅ APEX installed in $(basename "$PROJECT_DIR")!"
echo ""
echo "   ${#PROJECT_SKILLS[@]} project skills"
echo "   $(ls .claude/scripts/*.sh | wc -l | tr -d ' ') hook scripts"
echo "   $(ls .claude/rules/*.md 2>/dev/null | wc -l | tr -d ' ') path-based rules"
echo "   2 git hooks (pre-commit + commit-msg)"
echo "   StatusLine + Sandbox + Permissions configured"
echo ""
echo "Now run:"
echo "   claude"
echo ""
echo "⚔️ This is the way."
echo ""
