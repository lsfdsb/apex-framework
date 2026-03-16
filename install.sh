#!/bin/bash
# install.sh — One-command APEX Framework installer
#
# Usage (from anywhere):
#   git clone https://github.com/YOUR_USER/apex-framework.git ~/.apex-framework
#   ~/.apex-framework/install.sh
#
# Or with curl (after repo is public):
#   curl -fsSL https://raw.githubusercontent.com/YOUR_USER/apex-framework/main/install.sh | bash
#
# What it does:
#   1. Installs APEX at user level (~/.claude/) — works in ALL projects
#   2. Asks your language preference (English or Portuguese)
#   3. Optionally initializes APEX in the current project
#
# Requirements: git, jq (recommended), Claude Code CLI

set -e

# ── Find APEX source ──
# If running from the repo directly
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
if [ -f "$SCRIPT_DIR/CLAUDE.md" ] && [ -d "$SCRIPT_DIR/.claude/skills" ]; then
  APEX_DIR="$SCRIPT_DIR"
# If running via curl (download to temp)
elif [ ! -d "$HOME/.apex-framework" ]; then
  echo "Cloning APEX Framework..."
  git clone --depth 1 https://github.com/YOUR_USER/apex-framework.git "$HOME/.apex-framework" 2>/dev/null || {
    echo "❌ Could not clone. Download manually:"
    echo "   git clone https://github.com/YOUR_USER/apex-framework.git ~/.apex-framework"
    echo "   ~/.apex-framework/install.sh"
    exit 1
  }
  APEX_DIR="$HOME/.apex-framework"
else
  APEX_DIR="$HOME/.apex-framework"
fi

echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║          ⚔️  APEX Framework Installer         ║"
echo "  ║     One command. Every project. Forever.     ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""

# ── Step 1: Language ──
echo "🌐 Choose your language:"
echo "   1) English (en-us)"
echo "   2) Português (pt-br)"
echo ""
read -p "Select (1/2): " -n 1 -r LANG_CHOICE
echo ""

case "$LANG_CHOICE" in
  2) LANG_PREF="pt-br" ;;
  *) LANG_PREF="en-us" ;;
esac

# ── Step 2: Run user-level install ──
echo ""
"$APEX_DIR/install-user-level.sh"

# ── Step 3: Set language preference ──
PREF_FILE="$HOME/.claude/apex-preferences.json"
if command -v jq &> /dev/null && [ -f "$PREF_FILE" ]; then
  TMP=$(jq --arg lang "$LANG_PREF" '.language = $lang' "$PREF_FILE")
  echo "$TMP" > "$PREF_FILE"
elif [ -f "$PREF_FILE" ]; then
  # Fallback without jq
  cat > "$PREF_FILE" << EOF
{
  "language": "$LANG_PREF",
  "cost_alert_threshold_usd": 5.00
}
EOF
fi

echo ""
echo "🌐 Language set to: $LANG_PREF"

# ── Step 4: Optional project init ──
if [ -d ".git" ] && [ "$(pwd)" != "$APEX_DIR" ]; then
  echo ""
  read -p "📁 Initialize APEX in this project ($(basename "$(pwd)"))? (Y/n) " -n 1 -r INIT_CHOICE
  echo ""
  if [[ ! $INIT_CHOICE =~ ^[Nn]$ ]]; then
    "$APEX_DIR/apex-init-project.sh"
  fi
fi

echo ""
echo "═══════════════════════════════════════════════"
echo "✅ Done! APEX is ready."
echo ""
echo "Quick start:"
echo "  claude              # Start Claude Code (APEX loads automatically)"
echo "  /prd my-app         # Create a Product Requirements Document"
echo "  /research next-auth # Research a library before using it"
echo ""
echo "For new projects:"
echo "  cd my-project && $APEX_DIR/apex-init-project.sh"
echo ""
echo "⚔️ This is the way."
