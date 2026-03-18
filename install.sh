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

# ── Help ──
if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
  echo "⚔️ APEX Framework Installer"
  echo ""
  echo "Usage: cd your-project && /path/to/install.sh"
  echo ""
  echo "Installs APEX into the current project's .claude/ directory."
  echo "Each project gets its own complete copy — no global install."
  echo ""
  echo "Requirements: git, jq, Claude Code CLI"
  exit 0
fi

# ── Prerequisite checks ──
MISSING=""
if ! command -v git &>/dev/null; then
  MISSING="$MISSING git"
fi
if ! command -v jq &>/dev/null; then
  MISSING="$MISSING jq"
fi
if ! command -v claude &>/dev/null; then
  MISSING="$MISSING claude"
fi

if [ -n "$MISSING" ]; then
  echo "❌ Missing required tools:$MISSING"
  echo ""
  [ -z "$(command -v git 2>/dev/null)" ] && echo "  git    → comes with macOS (xcode-select --install)"
  [ -z "$(command -v jq 2>/dev/null)" ] && echo "  jq     → https://jqlang.github.io/jq/download/"
  [ -z "$(command -v claude 2>/dev/null)" ] && echo "  claude → https://docs.anthropic.com/en/docs/claude-code"
  echo ""
  echo "Install the missing tools, then run this script again."
  exit 1
fi

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

# ── Install global CLI tools ──
if [ -d "$APEX_DIR/bin" ]; then
  mkdir -p "$HOME/.local/bin"
  for cmd in "$APEX_DIR/bin/"*; do
    [ -x "$cmd" ] || continue
    ln -sf "$cmd" "$HOME/.local/bin/$(basename "$cmd")"
  done
  # Ensure ~/.local/bin is in PATH (via .zprofile)
  if ! grep -q '.local/bin' "$HOME/.zprofile" 2>/dev/null; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.zprofile"
    echo "  ✅ Added ~/.local/bin to PATH (restart shell or: source ~/.zprofile)"
  fi
  echo "  ✅ CLI: $(ls "$APEX_DIR/bin/" | tr '\n' ' ')"
fi

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
