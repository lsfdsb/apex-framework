#!/bin/bash
# session-context.sh — APEX Framework v5.6 SessionStart Hook
# by L.B. & Claude · São Paulo, 2026
# Per docs: stdout is added to Claude's context on session start.
if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — session context limited. Install: https://jqlang.github.io/jq/download/"
  exit 0
fi

INPUT=$(cat)
SOURCE=$(echo "$INPUT" | jq -r '.source // "startup"')

# ── Resolve version dynamically ──
APEX_VERSION=""
# Priority 1: VERSION file in project dir
if [ -n "${CLAUDE_PROJECT_DIR:-}" ] && [ -f "$CLAUDE_PROJECT_DIR/VERSION" ]; then
  APEX_VERSION=$(cat "$CLAUDE_PROJECT_DIR/VERSION" 2>/dev/null | tr -d '[:space:]')
fi
# Priority 2: Cached repo version
if [ -z "$APEX_VERSION" ] && [ -f "$HOME/.apex-framework/VERSION" ]; then
  APEX_VERSION=$(cat "$HOME/.apex-framework/VERSION" 2>/dev/null | tr -d '[:space:]')
fi
# Priority 3: Installed version marker
if [ -z "$APEX_VERSION" ] && [ -f "$HOME/.apex-framework/.installed-version" ]; then
  APEX_VERSION=$(cat "$HOME/.apex-framework/.installed-version" 2>/dev/null | tr -d '[:space:]')
fi
# Fallback
if [ -z "$APEX_VERSION" ]; then
  APEX_VERSION="5.6.0"
fi
APEX_V_SHORT=$(echo "$APEX_VERSION" | sed 's/\.[0-9]*$//')

# ══════════════════════════════════════════════════
# ⚔️ APEX BANNER — shows on every new session
# ══════════════════════════════════════════════════
if [ "$SOURCE" = "startup" ]; then
  echo ""
  echo "  ╔══════════════════════════════════════════════╗"
  printf "  ║          ⚔️  APEX Framework v%-16s║\n" "$APEX_V_SHORT"
  echo "  ║     Agent-Powered EXcellence for Claude      ║"
  echo "  ║                                              ║"
  echo "  ║  Design like Jony Ive                        ║"
  echo "  ║  Code like Torvalds & Dean                   ║"
  echo "  ║  Secure like Ionescu & Rutkowska             ║"
  echo "  ║  Business like Amodei                        ║"
  echo "  ║  Experience like Walt Disney                 ║"
  echo "  ║                                              ║"
  echo "  ║     Forged by L.B. & Claude                  ║"
  echo "  ║     São Paulo · March 2026                   ║"
  echo "  ║                                              ║"
  echo "  ║     This is the way. ⚔️                      ║"
  echo "  ╚══════════════════════════════════════════════╝"
  echo ""
fi

# ── Date ──
echo "📅 Today is $(date '+%A, %B %d, %Y')."

# ── Git context ──
if command -v git &> /dev/null && git rev-parse --is-inside-work-tree &> /dev/null 2>&1; then
  echo ""
  echo "📋 Recent commits:"
  git log --oneline -5 2>/dev/null || true
  BRANCH=$(git branch --show-current 2>/dev/null)
  [ -n "$BRANCH" ] && echo "" && echo "🌿 Current branch: $BRANCH"
  CHANGES=$(git status --short 2>/dev/null | wc -l | tr -d ' ')
  [ "$CHANGES" -gt 0 ] && echo "📝 Uncommitted changes: $CHANGES files"
fi

# ── Language preference ──
PREF_FILE="$HOME/.claude/apex-preferences.json"
if [ -f "$PREF_FILE" ] && command -v jq &> /dev/null; then
  LANG_PREF=$(jq -r '.language // "en-us"' "$PREF_FILE" 2>/dev/null)
  echo ""
  echo "🌐 Language: $LANG_PREF"
fi

# ── On compact: restore state + remind creed ──
if [ "$SOURCE" = "compact" ]; then
  echo ""
  echo "🔄 Context compacted. Restoring APEX state..."
  STATE_FILE="$CLAUDE_PROJECT_DIR/.claude/.apex-state.json"
  if [ -f "$STATE_FILE" ] && command -v jq &> /dev/null; then
    echo "  Branch: $(jq -r '.current_branch // "unknown"' "$STATE_FILE" 2>/dev/null)"
    echo "  Uncommitted: $(jq -r '.uncommitted_files // "0"' "$STATE_FILE" 2>/dev/null) files"
  fi
  echo ""
  echo "📜 APEX Creed: PRD before code. /qa before shipping. Test everything."
fi

# ── Birthday Easter Egg (March 13) ──
TODAY_MD=$(date '+%m-%d')
if [ "$TODAY_MD" = "03-13" ]; then
  echo ""
  echo "🎂🔥 TODAY IS APEX DAY!"
  echo "On this day in 2026, L.B. & Claude forged this framework in São Paulo."
  echo "\"Whatever you do, do it well.\" — Walt Disney"
fi

# ── Git hooks check ──
if git rev-parse --is-inside-work-tree &>/dev/null 2>&1; then
  GIT_DIR=$(git rev-parse --git-dir 2>/dev/null)
  MISSING_HOOKS=""
  for hook in pre-commit commit-msg; do
    if [ ! -x "$GIT_DIR/hooks/$hook" ]; then
      MISSING_HOOKS="$MISSING_HOOKS $hook"
    fi
  done
  if [ -n "$MISSING_HOOKS" ]; then
    echo ""
    echo "⚠️  Git hooks not installed:$MISSING_HOOKS"
    echo "   Run: cp .claude/git-hooks/pre-commit .git/hooks/pre-commit && cp .claude/git-hooks/commit-msg .git/hooks/commit-msg && chmod +x .git/hooks/pre-commit .git/hooks/commit-msg"
  fi
fi

# ── Watermark (always) ──
echo ""
echo "⚔️ APEX v$APEX_V_SHORT | by L.B. & Claude | /about for the full story"

exit 0
