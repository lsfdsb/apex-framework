#!/bin/bash
# install.sh — One-command APEX Framework installer
#
# Usage:
#   git clone https://github.com/lfrfrfl/apex-framework.git ~/.apex-framework
#   cd my-project
#   ~/.apex-framework/install.sh
#
# Each project gets its own complete copy of the framework in .claude/.
# No user-level (~/.claude/) install — avoids config conflicts.
#
# Requirements: git, jq (recommended), Claude Code CLI

set -e

# ── Find APEX source ──
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
if [ -f "$SCRIPT_DIR/CLAUDE.md" ] && [ -d "$SCRIPT_DIR/.claude/skills" ]; then
  APEX_DIR="$SCRIPT_DIR"
elif [ -d "$HOME/.apex-framework/.claude" ]; then
  APEX_DIR="$HOME/.apex-framework"
else
  echo "❌ APEX Framework not found. Clone it first:"
  echo "   git clone https://github.com/lfrfrfl/apex-framework.git ~/.apex-framework"
  exit 1
fi

echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║          ⚔️  APEX Framework Installer         ║"
echo "  ║     One command. Per project. Self-contained.║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""

# ── Run project init ──
if [ -d ".git" ]; then
  "$APEX_DIR/apex-init-project.sh"
else
  echo "⚠️  Not in a git repository. Please cd into your project first:"
  echo "   cd my-project"
  echo "   $APEX_DIR/install.sh"
  echo ""
  echo "Or initialize a new one:"
  echo "   mkdir my-project && cd my-project && git init"
  echo "   $APEX_DIR/install.sh"
  exit 1
fi
