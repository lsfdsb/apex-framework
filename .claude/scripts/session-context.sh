#!/bin/bash
# session-context.sh — APEX Framework SessionStart Hook
# by L.B. & Claude · São Paulo, 2026
# Per docs: stdout is added to Claude's context on session start.
if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — session context limited. Install: https://jqlang.github.io/jq/download/"
  exit 0
fi

INPUT=$(cat)
SOURCE=$(echo "$INPUT" | jq -r '.source // "startup"')

# ── Bootstrap detection: is APEX installed in this project? ──
# If .claude/skills/ doesn't exist, this project hasn't been initialized.
# Show a helpful hint and skip the full banner.
if [ "$SOURCE" = "startup" ]; then
  PROJECT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
  if [ ! -d "$PROJECT/.claude/skills" ]; then
    echo ""
    echo "⚔️  APEX Framework is not installed in this project."
    echo ""
    echo "Type /init to set it up, or just tell me what you want to build"
    echo "and I'll guide you through setup."
    echo ""
    # Check if the framework source exists so we can give a better hint
    if [ -d "$HOME/.apex-framework/apex-init-project.sh" ] || [ -f "$HOME/.apex-framework/apex-init-project.sh" ]; then
      echo "   (APEX source found at ~/.apex-framework/ — /init will use it)"
    else
      echo "   Quick install: git clone https://github.com/lsfdsb/apex-framework.git ~/.apex-framework && ~/.apex-framework/install.sh"
    fi
    echo ""
    exit 0
  fi
fi

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
# Priority 4: VERSION file in framework source
if [ -z "$APEX_VERSION" ] && [ -f "$HOME/.apex-framework/VERSION" ]; then
  APEX_VERSION=$(cat "$HOME/.apex-framework/VERSION" 2>/dev/null | tr -d '[:space:]')
fi
# Fallback
if [ -z "$APEX_VERSION" ]; then
  APEX_VERSION="5.11.1"
fi
APEX_V_SHORT=$(echo "$APEX_VERSION" | sed 's/\.[0-9]*$//')

# ── Random Grogu poses (animated variety — different pose each time) ──
GROGU_POSES=(
  # Pose 0: Normal — curious look
  "         ╭───╮\n    ╭───( • • )───╮\n         ╰─┬─╯\n          ╭┴╮\n          ╰─╯"
  # Pose 1: Happy — eyes up, celebrating
  "         ╭───╮\n   ╭────( ◠ ◠ )────╮\n         ╰─┬─╯\n          ╭┴╮\n          ╰─╯"
  # Pose 2: Sleepy — zzz
  "         ╭───╮     z\n    ╭───( - - )───╮  z\n         ╰─┬─╯\n          ╭┴╮\n          ╰─╯"
  # Pose 3: Surprised — wide eyes
  "         ╭───╮\n   ╭────( ◉ ◉ )────╮  !\n         ╰─┬─╯\n          ╭┴╮\n          ╰─╯"
  # Pose 4: Using the Force
  "         ╭───╮    *\n    ╭───( • • )───╮ ~*\n         ╰─┬─╯   ~\n          ╭┴╮\n          ╰─╯"
)
GROGU_QUOTES=(
  "\"Patu!\" — Grogu (approving your commit)"
  "\"Baba!\" — Grogu (wants you to write tests)"
  "\"Ehh...\" — Grogu (skeptical about that any type)"
  "\"*reaches for frog*\" — Grogu (hungry, but your code looks tasty)"
  "\"*waves tiny hand*\" — Grogu (Force-pushing... wait, not that kind)"
  "\"*giggles*\" — Grogu (your code made him happy)"
  "\"*ears perk up*\" — Grogu (detected a new feature!)"
  "\"*sips soup*\" — Grogu (reviewing your PR calmly)"
)

# Pick random Grogu quote
GROGU_IDX=$((RANDOM % ${#GROGU_QUOTES[@]}))
GROGU_QUOTE="${GROGU_QUOTES[$GROGU_IDX]}"

# ══════════════════════════════════════════════════
# ⚔️ APEX BANNER — shows on every new session
# ══════════════════════════════════════════════════
if [ "$SOURCE" = "startup" ]; then

  # ── Reset session state for new session ──
  rm -f /tmp/apex-pr-cache-*.json /tmp/apex-session-errors.count 2>/dev/null

  # ── Prune stale agent worktree branches ──
  if git rev-parse --is-inside-work-tree &>/dev/null 2>&1; then
    git worktree prune 2>/dev/null
    for branch in $(git branch --list 'agent-*' 2>/dev/null | tr -d ' *'); do
      if ! git worktree list 2>/dev/null | grep -q "$branch"; then
        git branch -D "$branch" 2>/dev/null
      fi
    done
  fi

  # ── Animated banner (stderr → terminal) ──
  # Detect if stderr is a terminal for animations
  # Override with APEX_ANIMATE=1 for testing
  ANIMATE=false
  if [ -t 2 ] || [ "${APEX_ANIMATE:-}" = "1" ]; then
    ANIMATE=true
  fi

  # Animation helper: typewriter effect on stderr (prints chars one by one)
  _tt() {
    local text="$1" delay="${2:-0.006}"
    if [ "$ANIMATE" = true ]; then
      for ((i=0; i<${#text}; i++)); do
        printf "%s" "${text:$i:1}" >&2
        sleep "$delay"
      done
      echo "" >&2
    fi
  }

  # Animation helper: print line with brief pause on stderr
  _reveal() {
    local text="$1" delay="${2:-0.015}"
    if [ "$ANIMATE" = true ]; then
      printf "%s\n" "$text" >&2
      sleep "$delay"
    fi
  }

  # Animation helper: fade-in line on stderr (grayscale sweep)
  _fade() {
    local text="$1"
    if [ "$ANIMATE" = true ]; then
      local shades=(238 245 252 255)
      for shade in "${shades[@]}"; do
        printf "\r\033[38;5;%dm%s\033[0m" "$shade" "$text" >&2
        sleep 0.015
      done
      echo "" >&2
    fi
  }

  # ── Animated banner (stderr → terminal) ──
  if [ "$ANIMATE" = true ]; then
    echo "" >&2
    printf "  \033[1mAPEX\033[0m v%s\n" "$APEX_V_SHORT" >&2
    printf "  \033[38;5;245m──────────────────────────────────────\033[0m\n" >&2
    _fade   "  Design like Ive · Code like Torvalds"
    _fade   "  Secure like Ionescu · Ship like Jobs"
    printf "  \033[38;5;245m──────────────────────────────────────\033[0m\n" >&2
    printf "  \033[38;5;245mby L.B. & Claude · São Paulo\033[0m\n" >&2
    echo "" >&2
  fi

  # ── Plain banner for Claude's context (stdout) ──
  printf "\nAPEX Framework v%s\n" "$APEX_V_SHORT"
  echo "──────────────────────────────────────"
  echo "Agent-Powered EXcellence for Claude"
  echo "by L.B. & Claude · São Paulo · 2026"
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
  if [ "$CHANGES" -gt 0 ]; then
    echo "📝 Uncommitted changes: $CHANGES files"
    if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
      echo "   ⚠️  You have uncommitted changes on $BRANCH — create a branch before committing!"
    fi
  fi
fi

# ── Hook status (verify all hooks are present and executable) ──
if [ "$SOURCE" = "startup" ]; then
  echo ""
  echo "🔧 Hooks status:"
  HOOK_OK=0
  HOOK_MISSING=0
  HOOK_LIST=""
  for hook in auto-update session-context dev-server session-learner session-cleanup \
              block-dangerous-commands enforce-workflow stop-gate \
              handle-failure guard-workflow-skip protect-files track-agent-start \
              scan-security-patterns auto-changelog auto-format dev-monitor; do
    SCRIPT="$PROJECT/.claude/scripts/${hook}.sh"
    if [ -x "$SCRIPT" ]; then
      HOOK_OK=$((HOOK_OK + 1))
    elif [ -f "$SCRIPT" ]; then
      HOOK_LIST="${HOOK_LIST}   ⚠️  ${hook}.sh exists but not executable\n"
      HOOK_MISSING=$((HOOK_MISSING + 1))
    else
      HOOK_LIST="${HOOK_LIST}   ❌ ${hook}.sh missing\n"
      HOOK_MISSING=$((HOOK_MISSING + 1))
    fi
  done
  if [ "$HOOK_MISSING" -eq 0 ]; then
    echo "   ✅ All ${HOOK_OK} hooks installed and executable"
  else
    echo "   ✅ ${HOOK_OK} hooks OK | ⚠️ ${HOOK_MISSING} issues:"
    printf "%b" "$HOOK_LIST"
  fi
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
  echo "Workflow: PRD before code. /qa before shipping. Test everything."
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

# ── Lessons from recent sessions (close the learning loop) ──
# Reads the last 3 session-learner reports that had errors/corrections
# and injects a brief summary so Claude starts each session informed.
if [ "$SOURCE" = "startup" ]; then
  LOG_DIR="${CLAUDE_PROJECT_DIR:-.}/.claude/session-logs"
  if [ -d "$LOG_DIR" ]; then
    # Get last 3 non-clean reports (those with Errors or Corrections sections with content)
    LESSONS=""
    while IFS= read -r report; do
      [ -z "$report" ] && continue
      # Skip clean sessions (one-liner reports)
      if grep -q "Clean ✅" "$report" 2>/dev/null; then
        continue
      fi
      # Extract key info
      R_DATE=$(grep -m1 'Session Report' "$report" 2>/dev/null | sed 's/# Session Report — //')
      R_ERRORS=$(grep -A20 '^## Errors' "$report" 2>/dev/null | grep '^- ' | head -3)
      R_CORRECTIONS=$(grep -A20 '^## User Corrections' "$report" 2>/dev/null | grep '^- ' | head -3)
      R_SIGNALS=$(grep -A10 '^## Improvement Signals' "$report" 2>/dev/null | grep '^- ' | head -3)
      if [ -n "$R_ERRORS" ] || [ -n "$R_CORRECTIONS" ]; then
        LESSONS="${LESSONS}Session ${R_DATE:-(unknown date)}:"
        [ -n "$R_ERRORS" ] && LESSONS="${LESSONS}\n  Errors: $(echo "$R_ERRORS" | head -2 | tr '\n' '; ')"
        [ -n "$R_CORRECTIONS" ] && LESSONS="${LESSONS}\n  User said: $(echo "$R_CORRECTIONS" | head -2 | tr '\n' '; ')"
        [ -n "$R_SIGNALS" ] && LESSONS="${LESSONS}\n  Signal: $(echo "$R_SIGNALS" | head -1)"
        LESSONS="${LESSONS}\n"
      fi
    done < <(ls -t "$LOG_DIR"/session-*.md 2>/dev/null | head -5)

    if [ -n "$LESSONS" ]; then
      echo ""
      echo "📖 Lessons from recent sessions:"
      printf "%b" "$LESSONS"
      echo "  (Use /evolve to address recurring patterns)"
    fi
  fi
fi

# ── Watermark (always) ──
echo ""
echo "⚔️ APEX v$APEX_V_SHORT | by L.B. & Claude | /about for the full story"

exit 0
