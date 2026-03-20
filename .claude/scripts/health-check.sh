#!/bin/bash
# health-check.sh — APEX Framework Health Check
# Validates that all components are correctly installed and working.
# Output is educational — explains what each check means, not just pass/fail.
#
# Usage: .claude/scripts/health-check.sh
#   or:  bash .claude/scripts/health-check.sh
#
# by L.B. & Claude · São Paulo, 2026

# ── Find project root ──
if [ -n "${CLAUDE_PROJECT_DIR:-}" ]; then
  PROJECT_DIR="$CLAUDE_PROJECT_DIR"
elif git rev-parse --show-toplevel &>/dev/null; then
  PROJECT_DIR="$(git rev-parse --show-toplevel)"
else
  PROJECT_DIR="$(pwd)"
fi

CLAUDE_DIR="$PROJECT_DIR/.claude"
PASS=0
WARN=0
FAIL=0

# ── Colors ──
if [ -t 1 ]; then
  GREEN='\033[0;32m'
  YELLOW='\033[0;33m'
  RED='\033[0;31m'
  BOLD='\033[1m'
  DIM='\033[2m'
  NC='\033[0m'
else
  GREEN='' YELLOW='' RED='' BOLD='' DIM='' NC=''
fi

ok() {
  local check="$1" explain="$2"
  echo -e "  ${GREEN}✅${NC} ${BOLD}$check${NC}"
  [ -n "$explain" ] && echo -e "     ${DIM}$explain${NC}"
  PASS=$((PASS + 1))
}

warn() {
  local check="$1" explain="$2" fix="$3"
  echo -e "  ${YELLOW}⚠️${NC}  ${BOLD}$check${NC}"
  [ -n "$explain" ] && echo -e "     ${DIM}$explain${NC}"
  [ -n "$fix" ] && echo -e "     ${YELLOW}Fix:${NC} $fix"
  WARN=$((WARN + 1))
}

fail() {
  local check="$1" explain="$2" fix="$3"
  echo -e "  ${RED}❌${NC} ${BOLD}$check${NC}"
  [ -n "$explain" ] && echo -e "     ${DIM}$explain${NC}"
  [ -n "$fix" ] && echo -e "     ${RED}Fix:${NC} $fix"
  FAIL=$((FAIL + 1))
}

echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║       ⚔️  APEX Framework Health Check         ║"
echo "  ║    Checking all components in your project   ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""
echo "  📁 Project: $PROJECT_DIR"
echo ""

# ══════════════════════════════════════════════
# 1. PREREQUISITES
# ══════════════════════════════════════════════
echo -e "  ${BOLD}━━━ 1. Prerequisites ━━━${NC}"
echo -e "  ${DIM}Tools that APEX needs to function properly${NC}"
echo ""

# git
if command -v git &>/dev/null; then
  GIT_VER=$(git --version | sed 's/git version //')
  ok "git ($GIT_VER)" "Version control — tracks every change to your code"
else
  fail "git not found" "Git is the version control system that tracks your code history" "Comes with macOS: xcode-select --install"
fi

# jq
if command -v jq &>/dev/null; then
  JQ_VER=$(jq --version 2>/dev/null)
  ok "jq ($JQ_VER)" "JSON parser — APEX hooks use it to read Claude's tool data"
else
  fail "jq not found" "Without jq, most APEX hooks silently degrade (won't block dangerous commands)" "https://jqlang.github.io/jq/download/"
fi

# claude
if command -v claude &>/dev/null; then
  ok "Claude Code CLI" "The AI coding assistant that APEX configures"
else
  warn "Claude Code CLI not found" "APEX works inside Claude Code sessions — you need it installed" "npm install -g @anthropic-ai/claude-code"
fi

# node
if command -v node &>/dev/null; then
  NODE_VER=$(node --version)
  ok "Node.js ($NODE_VER)" "JavaScript runtime — needed for npm, Next.js, and build tools"
else
  warn "Node.js not found" "You'll need it to run dev servers and build projects" "https://nodejs.org (download LTS)"
fi

echo ""

# ══════════════════════════════════════════════
# 2. FRAMEWORK STRUCTURE
# ══════════════════════════════════════════════
echo -e "  ${BOLD}━━━ 2. Framework Structure ━━━${NC}"
echo -e "  ${DIM}Core directories and files that make up APEX${NC}"
echo ""

# .claude directory
if [ -d "$CLAUDE_DIR" ]; then
  ok ".claude/ directory exists" "This is where all APEX components live in your project"
else
  fail ".claude/ directory missing" "APEX isn't installed in this project" "Run: ~/.apex-framework/install.sh"
  echo ""
  echo "  Cannot continue without .claude/ — install APEX first."
  exit 1
fi

# Skills
SKILL_COUNT=0
if [ -d "$CLAUDE_DIR/skills" ]; then
  SKILL_COUNT=$(find "$CLAUDE_DIR/skills" -name "SKILL.md" -type f 2>/dev/null | wc -l | tr -d ' ')
  if [ "$SKILL_COUNT" -ge 20 ]; then
    ok "$SKILL_COUNT skills installed" "Slash commands like /prd, /qa, /security — each is a specialized knowledge module"
  else
    warn "Only $SKILL_COUNT skills (expected 25)" "Some skills may be missing" "Re-run: ~/.apex-framework/install.sh"
  fi
else
  fail "skills/ directory missing" "Skills are the slash commands that drive the APEX workflow" "Re-run: ~/.apex-framework/install.sh"
fi

# Agents
AGENT_COUNT=0
if [ -d "$CLAUDE_DIR/agents" ]; then
  AGENT_COUNT=$(ls "$CLAUDE_DIR/agents/"*.md 2>/dev/null | wc -l | tr -d ' ')
  if [ "$AGENT_COUNT" -ge 4 ]; then
    ok "$AGENT_COUNT agents installed" "Autonomous sub-agents: builder, watcher, qa, debugger, and more"
  else
    warn "Only $AGENT_COUNT agents (expected 4)" "Some agents may be missing" "Re-run: ~/.apex-framework/install.sh"
  fi
else
  fail "agents/ directory missing" "Agents handle specialized tasks like code review and research" "Re-run: ~/.apex-framework/install.sh"
fi

# Scripts
SCRIPT_COUNT=0
if [ -d "$CLAUDE_DIR/scripts" ]; then
  SCRIPT_COUNT=$(ls "$CLAUDE_DIR/scripts/"*.sh 2>/dev/null | wc -l | tr -d ' ')
  if [ "$SCRIPT_COUNT" -ge 20 ]; then
    ok "$SCRIPT_COUNT scripts installed" "Hook scripts — the automation layer (auto-format, safety blocks, etc.)"
  else
    warn "Only $SCRIPT_COUNT scripts (expected 26)" "Some hook scripts may be missing" "Re-run: ~/.apex-framework/install.sh"
  fi
else
  fail "scripts/ directory missing" "Scripts are the hooks that enforce safety and automate tasks" "Re-run: ~/.apex-framework/install.sh"
fi

# Rules
RULE_COUNT=0
if [ -d "$CLAUDE_DIR/rules" ]; then
  RULE_COUNT=$(ls "$CLAUDE_DIR/rules/"*.md 2>/dev/null | wc -l | tr -d ' ')
  if [ "$RULE_COUNT" -ge 5 ]; then
    ok "$RULE_COUNT rules installed" "Path-based rules that auto-load for React, SQL, API, etc."
  else
    warn "Only $RULE_COUNT rules (expected 7)" "Some rules may be missing" "Re-run: ~/.apex-framework/install.sh"
  fi
else
  warn "rules/ directory missing" "Rules auto-load when you edit certain file types" "Re-run: ~/.apex-framework/install.sh"
fi

# Output styles — verify file exists AND matches settings.json reference
if [ -d "$CLAUDE_DIR/output-styles" ] && ls "$CLAUDE_DIR/output-styles/"*.md &>/dev/null; then
  ok "Output style file(s) installed" "The 'APEX Educational' style — explains What/Why/How for every action"
  # Cross-reference: check that settings.json outputStyle points to an existing style
  if command -v jq &>/dev/null && [ -f "$CLAUDE_DIR/settings.json" ]; then
    STYLE_REF=$(jq -r '.outputStyle // empty' "$CLAUDE_DIR/settings.json" 2>/dev/null)
    if [ -n "$STYLE_REF" ]; then
      # The outputStyle can be a name (matched against frontmatter) or a path
      STYLE_FOUND=false
      for style_file in "$CLAUDE_DIR/output-styles/"*.md; do
        STYLE_NAME=$(grep -m1 '^name:' "$style_file" 2>/dev/null | sed 's/^name: *//')
        if [ "$STYLE_NAME" = "$STYLE_REF" ] || [ "$(basename "$style_file" .md)" = "$STYLE_REF" ]; then
          STYLE_FOUND=true
          break
        fi
      done
      if [ "$STYLE_FOUND" = true ]; then
        ok "Output style '$STYLE_REF' matches installed file" "settings.json references a style that exists"
      else
        warn "Output style '$STYLE_REF' referenced in settings.json but no matching file" "The style name in settings.json doesn't match any file in output-styles/" ""
      fi
    fi
  fi
else
  warn "Output style missing" "Without it, Claude won't teach as you build" "Re-run: ~/.apex-framework/install.sh"
fi

echo ""

# ══════════════════════════════════════════════
# 3. SETTINGS & CONFIGURATION
# ══════════════════════════════════════════════
echo -e "  ${BOLD}━━━ 3. Settings & Configuration ━━━${NC}"
echo -e "  ${DIM}Configuration files that control APEX behavior${NC}"
echo ""

# settings.json
if [ -f "$CLAUDE_DIR/settings.json" ]; then
  if command -v jq &>/dev/null && jq empty "$CLAUDE_DIR/settings.json" 2>/dev/null; then
    ok "settings.json is valid JSON" "Controls hooks, permissions, sandbox, and statusline"

    # Check hooks are configured
    HOOK_COUNT=$(jq '[.hooks | to_entries[] | .value[].hooks[]?] | length' "$CLAUDE_DIR/settings.json" 2>/dev/null || echo "0")
    if [ "$HOOK_COUNT" -gt 10 ]; then
      ok "$HOOK_COUNT hooks configured" "Hooks fire automatically on events (tool use, session start, errors, etc.)"
    else
      warn "Only $HOOK_COUNT hooks configured" "Expected 20+ hooks for full APEX enforcement" ""
    fi

    # Check permissions
    if jq -e '.permissions.deny | length > 0' "$CLAUDE_DIR/settings.json" &>/dev/null; then
      ok "Permission deny list active" "Blocks dangerous operations like rm -rf and push to main"
    else
      warn "No permission deny list" "APEX's first line of defense is missing" ""
    fi

    # Check sandbox
    if jq -e '.sandbox.filesystem' "$CLAUDE_DIR/settings.json" &>/dev/null; then
      ok "Filesystem sandbox active" "OS-level protection against writes to /etc, ~/.ssh, ~/.aws"
    else
      warn "Filesystem sandbox not configured" "Second layer of defense is missing" ""
    fi

    # Check statusline
    if jq -e '.statusLine' "$CLAUDE_DIR/settings.json" &>/dev/null; then
      ok "StatusLine configured" "Real-time dashboard showing model, tokens, context, and progress"
    else
      warn "StatusLine not configured" "You won't see the real-time session dashboard" ""
    fi

    # Check output style
    if jq -e '.outputStyle' "$CLAUDE_DIR/settings.json" &>/dev/null; then
      ok "Output style configured" "Educational mode — Claude explains as it builds"
    else
      warn "Output style not set" "Claude won't use the teaching tone" ""
    fi
  else
    fail "settings.json is invalid JSON" "Broken JSON means no hooks, no permissions, no safety net" "Re-run: ~/.apex-framework/install.sh"
  fi
else
  fail "settings.json missing" "This is the central config — without it, APEX has no hooks or permissions" "Re-run: ~/.apex-framework/install.sh"
fi

# CLAUDE.md
if [ -f "$PROJECT_DIR/CLAUDE.md" ]; then
  ok "CLAUDE.md exists" "The project constitution — rules and philosophy that guide Claude's behavior"
else
  warn "CLAUDE.md missing" "Claude won't know about APEX rules without it" "cp ~/.apex-framework/CLAUDE.md ."
fi

echo ""

# ══════════════════════════════════════════════
# 4. GIT CONFIGURATION
# ══════════════════════════════════════════════
echo -e "  ${BOLD}━━━ 4. Git Configuration ━━━${NC}"
echo -e "  ${DIM}Git hooks that enforce code quality before commits${NC}"
echo ""

if git rev-parse --is-inside-work-tree &>/dev/null 2>&1; then
  GIT_DIR=$(git rev-parse --git-dir 2>/dev/null)
  BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
  ok "Git repository initialized (branch: $BRANCH)" "Your code changes are being tracked"

  # Check git hooks
  if [ -x "$GIT_DIR/hooks/pre-commit" ]; then
    ok "pre-commit hook installed" "Runs type check, lint, and format before every commit"
  else
    warn "pre-commit hook missing" "Commits won't be checked for type errors or style issues" "cp .claude/git-hooks/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit"
  fi

  if [ -x "$GIT_DIR/hooks/commit-msg" ]; then
    ok "commit-msg hook installed" "Enforces conventional commit format (feat:, fix:, docs:, etc.)"
  else
    warn "commit-msg hook missing" "Commit messages won't follow the standard format" "cp .claude/git-hooks/commit-msg .git/hooks/commit-msg && chmod +x .git/hooks/commit-msg"
  fi

  # Check git user identity
  GIT_USER=$(git config user.name 2>/dev/null)
  GIT_EMAIL=$(git config user.email 2>/dev/null)
  if [ -n "$GIT_USER" ] && [ -n "$GIT_EMAIL" ]; then
    ok "Git identity: $GIT_USER <$GIT_EMAIL>" "Your commits will be attributed to this identity"
  else
    warn "Git identity not configured" "Commits need a name and email to identify who made them" "git config user.name \"Your Name\" && git config user.email \"you@example.com\""
  fi

  # Check if on main/master
  if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
    warn "You're on the $BRANCH branch" "APEX philosophy: never work directly on main. Create a feature branch." "git checkout -b feat/your-feature-name"
  fi
else
  warn "Not a git repository" "Git tracks your code changes — initialize it first" "git init"
fi

echo ""

# ══════════════════════════════════════════════
# 5. SCRIPT HEALTH
# ══════════════════════════════════════════════
echo -e "  ${BOLD}━━━ 5. Script Health ━━━${NC}"
echo -e "  ${DIM}Checking that critical scripts are executable and have valid syntax${NC}"
echo ""

CRITICAL_SCRIPTS=(
  "block-dangerous-commands.sh"
  "protect-files.sh"
  "enforce-workflow.sh"
  "session-context.sh"
  "stop-gate.sh"
  "handle-failure.sh"
)

for script in "${CRITICAL_SCRIPTS[@]}"; do
  SCRIPT_PATH="$CLAUDE_DIR/scripts/$script"
  if [ -f "$SCRIPT_PATH" ]; then
    if [ -x "$SCRIPT_PATH" ]; then
      if bash -n "$SCRIPT_PATH" 2>/dev/null; then
        ok "$script" ""
      else
        fail "$script has syntax errors" "This script won't run correctly" "bash -n $SCRIPT_PATH"
      fi
    else
      warn "$script is not executable" "The script exists but can't run" "chmod +x $SCRIPT_PATH"
    fi
  else
    fail "$script is missing" "This is a critical safety script" "Re-run: ~/.apex-framework/install.sh"
  fi
done

echo ""

# ══════════════════════════════════════════════
# 6. DOC STRUCTURE
# ══════════════════════════════════════════════
echo -e "  ${BOLD}━━━ 6. Documentation Structure ━━━${NC}"
echo -e "  ${DIM}Directories where your PRDs, architecture docs, and reviews live${NC}"
echo ""

for dir in docs/prd docs/architecture docs/research docs/reviews; do
  if [ -d "$PROJECT_DIR/$dir" ]; then
    FILE_COUNT=$(find "$PROJECT_DIR/$dir" -type f 2>/dev/null | wc -l | tr -d ' ')
    ok "$dir/ ($FILE_COUNT files)" ""
  else
    warn "$dir/ missing" "This directory is part of the APEX workflow" "mkdir -p $dir"
  fi
done

echo ""

# ══════════════════════════════════════════════
# SUMMARY
# ══════════════════════════════════════════════
TOTAL=$((PASS + WARN + FAIL))
echo "  ══════════════════════════════════════════════"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo -e "  ${RED}${BOLD}Results: $PASS passed · $WARN warnings · $FAIL failed${NC}"
  echo ""
  echo -e "  ${RED}Some critical issues found. Fix the ❌ items above.${NC}"
  echo "  Most issues can be fixed by re-running the installer:"
  echo "    ~/.apex-framework/install.sh"
elif [ "$WARN" -gt 0 ]; then
  echo -e "  ${YELLOW}${BOLD}Results: $PASS passed · $WARN warnings${NC}"
  echo ""
  echo "  APEX is functional but could be improved."
  echo "  The ⚠️ items above are optional but recommended."
else
  echo -e "  ${GREEN}${BOLD}Results: $PASS passed · 0 warnings · 0 failures${NC}"
  echo ""
  echo -e "  ${GREEN}⚔️ APEX is fully operational. This is the way.${NC}"
fi

echo ""
echo "  Framework: $SKILL_COUNT skills · $AGENT_COUNT agents · $SCRIPT_COUNT scripts · $RULE_COUNT rules"

# Version
VERSION_FILE="$CLAUDE_DIR/.apex-version"
if [ -f "$VERSION_FILE" ]; then
  echo "  Version: $(cat "$VERSION_FILE" | tr -d '[:space:]')"
elif [ -f "$PROJECT_DIR/VERSION" ]; then
  echo "  Version: $(cat "$PROJECT_DIR/VERSION" | tr -d '[:space:]')"
fi

echo ""
exit $FAIL
