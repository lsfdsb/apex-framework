#!/bin/bash
# test-framework.sh — APEX Framework Comprehensive Self-Test
# Tests ALL framework components: scripts, skills, hooks, colors, structure.
#
# Usage: ./tests/test-framework.sh
# Exit 0 = all tests pass. Exit 1 = failures found.
#
# by L.B. & Claude · São Paulo, 2026

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPTS="$SCRIPT_DIR/.claude/scripts"
SKILLS="$SCRIPT_DIR/.claude/skills"
AGENTS="$SCRIPT_DIR/.claude/agents"
RULES="$SCRIPT_DIR/.claude/rules"
OUTPUT_STYLES="$SCRIPT_DIR/.claude/output-styles"
GIT_HOOKS="$SCRIPT_DIR/.claude/git-hooks"
SETTINGS="$SCRIPT_DIR/.claude/settings.json"
PASS=0
FAIL=0
SKIP=0
TOTAL=0

# ── Source color library for beautiful output ──
if [ -f "$SCRIPTS/apex-colors.sh" ]; then
  FORCE_COLOR=1 source "$SCRIPTS/apex-colors.sh"
fi

# ── Test helpers ──
assert_true() {
  local test_name="$1"
  local condition="$2"
  TOTAL=$((TOTAL + 1))
  if eval "$condition"; then
    if [ "$APEX_COLORS" = true ]; then
      printf "    ${OK}✓${RST} %s\n" "$test_name"
    else
      echo "    ✅ $test_name"
    fi
    PASS=$((PASS + 1))
  else
    if [ "$APEX_COLORS" = true ]; then
      printf "    ${ERR}✗${RST} %s\n" "$test_name"
    else
      echo "    ❌ $test_name"
    fi
    FAIL=$((FAIL + 1))
  fi
}

assert_file_exists() {
  local file="$1"
  local label="${2:-$(basename "$file")}"
  assert_true "$label exists" "[ -f '$file' ]"
}

assert_file_executable() {
  local file="$1"
  local label="${2:-$(basename "$file")}"
  assert_true "$label is executable" "[ -x '$file' ]"
}

assert_file_contains() {
  local file="$1"
  local pattern="$2"
  local label="${3:-$(basename "$file") contains '$pattern'}"
  assert_true "$label" "grep -qE '$pattern' '$file' 2>/dev/null"
}

assert_dir_exists() {
  local dir="$1"
  local label="${2:-$(basename "$dir")/}"
  assert_true "$label exists" "[ -d '$dir' ]"
}

skip_test() {
  local test_name="$1"
  local reason="$2"
  TOTAL=$((TOTAL + 1))
  SKIP=$((SKIP + 1))
  if [ "$APEX_COLORS" = true ]; then
    printf "    ${STEEL}○${RST} ${STEEL}%s (skip: %s)${RST}\n" "$test_name" "$reason"
  else
    echo "    ○ $test_name (skip: $reason)"
  fi
}

section() {
  local title="$1"
  if [ "$APEX_COLORS" = true ]; then
    echo ""
    printf "  ${GOLD_BOLD}━━━ %s ━━━${RST}\n" "$title"
    echo ""
  else
    echo ""
    echo "  ━━━ $title ━━━"
    echo ""
  fi
}

# ══════════════════════════════════════════════════
# HEADER
# ══════════════════════════════════════════════════
echo ""
if [ "$APEX_COLORS" = true ]; then
  printf "  ${GOLD_BOLD}╔══════════════════════════════════════════════╗${RST}\n"
  printf "  ${GOLD_BOLD}║${RST}   ${EMBER}⚔️  APEX Framework Self-Test Suite${RST}       ${GOLD_BOLD}║${RST}\n"
  printf "  ${GOLD_BOLD}║${RST}   ${STEEL}Testing all components...${RST}                ${GOLD_BOLD}║${RST}\n"
  printf "  ${GOLD_BOLD}╚══════════════════════════════════════════════╝${RST}\n"
else
  echo "  ╔══════════════════════════════════════════════╗"
  echo "  ║   ⚔️  APEX Framework Self-Test Suite         ║"
  echo "  ║   Testing all components...                  ║"
  echo "  ╚══════════════════════════════════════════════╝"
fi

# ══════════════════════════════════════════════════
# 1. DIRECTORY STRUCTURE
# ══════════════════════════════════════════════════
section "1. Directory Structure"

assert_dir_exists "$SCRIPT_DIR/.claude" ".claude/"
assert_dir_exists "$SCRIPTS" "scripts/"
assert_dir_exists "$SKILLS" "skills/"
assert_dir_exists "$AGENTS" "agents/"
assert_dir_exists "$RULES" "rules/"
assert_dir_exists "$OUTPUT_STYLES" "output-styles/"
assert_dir_exists "$GIT_HOOKS" "git-hooks/"
assert_file_exists "$SETTINGS" "settings.json"
assert_file_exists "$SCRIPT_DIR/CLAUDE.md"
assert_file_exists "$SCRIPT_DIR/VERSION"
assert_file_exists "$SCRIPT_DIR/README.md"

# ══════════════════════════════════════════════════
# 2. COLOR LIBRARY
# ══════════════════════════════════════════════════
section "2. Color Library (apex-colors.sh)"

assert_file_exists "$SCRIPTS/apex-colors.sh"
assert_file_executable "$SCRIPTS/apex-colors.sh"

# Test color variables are defined
assert_file_contains "$SCRIPTS/apex-colors.sh" "GOLD=" "GOLD color defined"
assert_file_contains "$SCRIPTS/apex-colors.sh" "EMBER=" "EMBER color defined"
assert_file_contains "$SCRIPTS/apex-colors.sh" "OK=" "OK (success) color defined"
assert_file_contains "$SCRIPTS/apex-colors.sh" "ERR=" "ERR (error) color defined"
assert_file_contains "$SCRIPTS/apex-colors.sh" "RST=" "RST (reset) defined"

# Test functions exist
assert_file_contains "$SCRIPTS/apex-colors.sh" "apex_spinner_start" "spinner_start function"
assert_file_contains "$SCRIPTS/apex-colors.sh" "apex_spinner_stop" "spinner_stop function"
assert_file_contains "$SCRIPTS/apex-colors.sh" "apex_progress" "progress bar function"
assert_file_contains "$SCRIPTS/apex-colors.sh" "apex_header" "header function"
assert_file_contains "$SCRIPTS/apex-colors.sh" "apex_divider" "divider function"
assert_file_contains "$SCRIPTS/apex-colors.sh" "apex_status" "status function"
assert_file_contains "$SCRIPTS/apex-colors.sh" "apex_blocked" "blocked banner function"
assert_file_contains "$SCRIPTS/apex-colors.sh" "apex_success" "success banner function"
assert_file_contains "$SCRIPTS/apex-colors.sh" "apex_typewriter" "typewriter function"
assert_file_contains "$SCRIPTS/apex-colors.sh" "apex_fade_in" "fade_in function"

# Test color detection logic
assert_file_contains "$SCRIPTS/apex-colors.sh" "APEX_COLORS" "color detection variable"
assert_file_contains "$SCRIPTS/apex-colors.sh" "tput colors" "terminal color detection"

# Test functional execution
COLORS_OUTPUT=$(FORCE_COLOR=1 bash -c 'source "'$SCRIPTS'/apex-colors.sh" && echo "LOADED:$APEX_COLORS"' 2>&1)
assert_true "color library loads without error" "echo '$COLORS_OUTPUT' | grep -q 'LOADED:true'"

# ══════════════════════════════════════════════════
# 3. SCRIPTS — Existence & Permissions
# ══════════════════════════════════════════════════
section "3. Scripts — Existence & Permissions"

EXPECTED_SCRIPTS=(
  "apex-colors.sh"
  "apex-statusline.sh"
  "auto-format.sh"
  "auto-update.sh"
  "block-dangerous-commands.sh"
  "dev-monitor.sh"
  "dev-server.sh"
  "enforce-commit-msg.sh"
  "enforce-workflow.sh"
  "extract-session.sh"
  "guard-workflow-skip.sh"
  "handle-failure.sh"
  "language-preference.sh"
  "log-subagent.sh"
  "notify.sh"
  "post-compact.sh"
  "pre-compact.sh"
  "protect-files.sh"
  "session-cleanup.sh"
  "session-context.sh"
  "stop-gate.sh"
  "verify-install.sh"
)

for script in "${EXPECTED_SCRIPTS[@]}"; do
  assert_file_exists "$SCRIPTS/$script"
  assert_file_executable "$SCRIPTS/$script"
done

# ══════════════════════════════════════════════════
# 4. SCRIPTS — Bash Syntax Check
# ══════════════════════════════════════════════════
section "4. Scripts — Syntax Validation"

for script in "$SCRIPTS"/*.sh; do
  BASENAME=$(basename "$script")
  TOTAL=$((TOTAL + 1))
  if bash -n "$script" 2>/dev/null; then
    if [ "$APEX_COLORS" = true ]; then
      printf "    ${OK}✓${RST} %s syntax OK\n" "$BASENAME"
    else
      echo "    ✅ $BASENAME syntax OK"
    fi
    PASS=$((PASS + 1))
  else
    if [ "$APEX_COLORS" = true ]; then
      printf "    ${ERR}✗${RST} %s has syntax errors\n" "$BASENAME"
    else
      echo "    ❌ $BASENAME has syntax errors"
    fi
    FAIL=$((FAIL + 1))
  fi
done

# ══════════════════════════════════════════════════
# 5. SCRIPTS — jq Dependency Warnings
# ══════════════════════════════════════════════════
section "5. Scripts — jq Dependency Handling"

SCRIPTS_NEEDING_JQ=(
  "session-context.sh"
  "session-cleanup.sh"
  "stop-gate.sh"
  "handle-failure.sh"
  "dev-server.sh"
  "language-preference.sh"
  "block-dangerous-commands.sh"
  "enforce-commit-msg.sh"
  "enforce-workflow.sh"
  "protect-files.sh"
  "notify.sh"
)

for script in "${SCRIPTS_NEEDING_JQ[@]}"; do
  if [ -f "$SCRIPTS/$script" ]; then
    assert_file_contains "$SCRIPTS/$script" "jq" "$script handles jq dependency"
  fi
done

# ══════════════════════════════════════════════════
# 6. SCRIPTS — macOS Compatibility (no grep -oP)
# ══════════════════════════════════════════════════
section "6. Scripts — macOS Compatibility"

for script in "$SCRIPTS"/*.sh; do
  BASENAME=$(basename "$script")
  TOTAL=$((TOTAL + 1))
  # Check for grep -oP outside comments
  if grep -v '^\s*#' "$script" | grep -q 'grep.*-oP'; then
    if [ "$APEX_COLORS" = true ]; then
      printf "    ${ERR}✗${RST} %s uses grep -oP (not available on macOS)\n" "$BASENAME"
    else
      echo "    ❌ $BASENAME uses grep -oP (not available on macOS)"
    fi
    FAIL=$((FAIL + 1))
  else
    if [ "$APEX_COLORS" = true ]; then
      printf "    ${OK}✓${RST} %s macOS-compatible\n" "$BASENAME"
    else
      echo "    ✅ $BASENAME macOS-compatible"
    fi
    PASS=$((PASS + 1))
  fi
done

# ══════════════════════════════════════════════════
# 7. GIT HOOKS
# ══════════════════════════════════════════════════
section "7. Git Hooks"

assert_file_exists "$GIT_HOOKS/pre-commit"
assert_file_executable "$GIT_HOOKS/pre-commit"
assert_file_contains "$GIT_HOOKS/pre-commit" "apex-colors.sh" "pre-commit sources color library"
assert_file_contains "$GIT_HOOKS/pre-commit" "APEX" "pre-commit has APEX branding"

assert_file_exists "$GIT_HOOKS/commit-msg"
assert_file_executable "$GIT_HOOKS/commit-msg"
assert_file_contains "$GIT_HOOKS/commit-msg" "apex-colors.sh" "commit-msg sources color library"
assert_file_contains "$GIT_HOOKS/commit-msg" "conventional" "commit-msg validates conventional format"

# Syntax check
for hook in "$GIT_HOOKS"/*; do
  BASENAME=$(basename "$hook")
  TOTAL=$((TOTAL + 1))
  if bash -n "$hook" 2>/dev/null; then
    if [ "$APEX_COLORS" = true ]; then
      printf "    ${OK}✓${RST} %s syntax OK\n" "$BASENAME"
    else
      echo "    ✅ $BASENAME syntax OK"
    fi
    PASS=$((PASS + 1))
  else
    if [ "$APEX_COLORS" = true ]; then
      printf "    ${ERR}✗${RST} %s has syntax errors\n" "$BASENAME"
    else
      echo "    ❌ $BASENAME has syntax errors"
    fi
    FAIL=$((FAIL + 1))
  fi
done

# ══════════════════════════════════════════════════
# 8. SKILLS
# ══════════════════════════════════════════════════
section "8. Skills"

EXPECTED_SKILLS=(
  "about" "a11y" "apex-stack" "architecture" "changelog"
  "cicd" "code-standards" "commit" "cost-management" "cx-review" "debug"
  "design-system" "dev" "e2e" "evolve" "init" "performance"
  "prd" "qa" "research" "security" "set-language"
  "sql-practices" "supabase" "teach" "verify-lib"
)

for skill in "${EXPECTED_SKILLS[@]}"; do
  if [ -d "$SKILLS/$skill" ]; then
    assert_file_exists "$SKILLS/$skill/SKILL.md" "skills/$skill/SKILL.md"
  else
    # Some skills might be in claude-web only
    if [ -f "$SCRIPT_DIR/claude-web/skills/$skill.md" ]; then
      assert_file_exists "$SCRIPT_DIR/claude-web/skills/$skill.md" "claude-web/skills/$skill.md"
    else
      TOTAL=$((TOTAL + 1))
      FAIL=$((FAIL + 1))
      if [ "$APEX_COLORS" = true ]; then
        printf "    ${ERR}✗${RST} skill '%s' not found\n" "$skill"
      else
        echo "    ❌ skill '$skill' not found"
      fi
    fi
  fi
done

# Check skill frontmatter (name and description)
for skill_dir in "$SKILLS"/*/; do
  SKILL_FILE="$skill_dir/SKILL.md"
  if [ -f "$SKILL_FILE" ]; then
    SKILL_NAME=$(basename "$skill_dir")
    assert_file_contains "$SKILL_FILE" "^---" "$SKILL_NAME has frontmatter"
    assert_file_contains "$SKILL_FILE" "description:" "$SKILL_NAME has description"
  fi
done

# ══════════════════════════════════════════════════
# 9. AGENTS
# ══════════════════════════════════════════════════
section "9. Agents"

EXPECTED_AGENTS=("code-reviewer.md" "design-reviewer.md" "researcher.md" "framework-evolver.md")
for agent in "${EXPECTED_AGENTS[@]}"; do
  assert_file_exists "$AGENTS/$agent"
  assert_file_contains "$AGENTS/$agent" "^---" "$agent has frontmatter"
done

# ══════════════════════════════════════════════════
# 10. RULES
# ══════════════════════════════════════════════════
section "10. Rules"

EXPECTED_RULES=("testing.md" "components.md" "api.md" "sql.md" "supabase.md" "nextjs.md" "error-handling.md")
for rule in "${EXPECTED_RULES[@]}"; do
  assert_file_exists "$RULES/$rule"
done

# ══════════════════════════════════════════════════
# 11. OUTPUT STYLES
# ══════════════════════════════════════════════════
section "11. Output Styles"

assert_file_exists "$OUTPUT_STYLES/apex-educational.md"
assert_file_contains "$OUTPUT_STYLES/apex-educational.md" "keep-coding-instructions: true" "educational preserves coding"
assert_file_exists "$OUTPUT_STYLES/apex-mandalorian.md"
assert_file_contains "$OUTPUT_STYLES/apex-mandalorian.md" "keep-coding-instructions: true" "mandalorian preserves coding"
assert_file_contains "$OUTPUT_STYLES/apex-mandalorian.md" "This is the way" "mandalorian has creed"

# ══════════════════════════════════════════════════
# 12. SETTINGS.JSON
# ══════════════════════════════════════════════════
section "12. Settings Configuration"

assert_file_exists "$SETTINGS"

if command -v jq &>/dev/null; then
  # Validate JSON syntax
  TOTAL=$((TOTAL + 1))
  if jq empty "$SETTINGS" 2>/dev/null; then
    if [ "$APEX_COLORS" = true ]; then
      printf "    ${OK}✓${RST} settings.json is valid JSON\n"
    else
      echo "    ✅ settings.json is valid JSON"
    fi
    PASS=$((PASS + 1))
  else
    if [ "$APEX_COLORS" = true ]; then
      printf "    ${ERR}✗${RST} settings.json has invalid JSON\n"
    else
      echo "    ❌ settings.json has invalid JSON"
    fi
    FAIL=$((FAIL + 1))
  fi

  # Check critical settings exist
  assert_true "has hooks config" "jq -e '.hooks' '$SETTINGS' >/dev/null 2>&1"
  assert_true "has permissions config" "jq -e '.permissions' '$SETTINGS' >/dev/null 2>&1"
  assert_true "has status line config" "jq -e '.statusLine' '$SETTINGS' >/dev/null 2>&1"
else
  skip_test "settings.json validation" "jq not installed"
fi

# ══════════════════════════════════════════════════
# 13. GROGU EASTER EGGS
# ══════════════════════════════════════════════════
section "13. Grogu Easter Eggs"

assert_file_contains "$SCRIPTS/session-context.sh" "Grogu" "Grogu in session banner"
assert_file_contains "$SCRIPTS/session-context.sh" "GROGU_QUOTES" "Grogu quotes array"
assert_file_contains "$SCRIPTS/session-context.sh" "03-13" "Birthday easter egg"
assert_file_contains "$SCRIPTS/session-context.sh" "Friday" "Friday easter egg"
assert_file_contains "$SCRIPTS/handle-failure.sh" "Grogu" "Grogu in failure handler"
assert_file_contains "$SCRIPTS/stop-gate.sh" "Grogu" "Grogu in stop gate"
assert_file_contains "$SCRIPTS/session-cleanup.sh" "Grogu" "Grogu in session cleanup"
assert_file_contains "$GIT_HOOKS/pre-commit" "Grogu" "Grogu in pre-commit"
assert_file_contains "$SKILLS/about/SKILL.md" "Grogu" "Grogu in about page"

# ══════════════════════════════════════════════════
# 14. ANIMATION FEATURES
# ══════════════════════════════════════════════════
section "14. Animation & Visual Features"

assert_file_contains "$SCRIPTS/apex-colors.sh" "APEX_SPINNER_FRAMES" "Spinner animation frames"
assert_file_contains "$SCRIPTS/apex-colors.sh" "apex_typewriter" "Typewriter effect"
assert_file_contains "$SCRIPTS/apex-colors.sh" "apex_fade_in" "Fade-in effect"
assert_file_contains "$SCRIPTS/apex-colors.sh" "apex_progress" "Progress bar"
assert_file_contains "$GIT_HOOKS/pre-commit" "apex_spinner" "Pre-commit uses spinners"
assert_file_contains "$GIT_HOOKS/pre-commit" "apex_progress" "Pre-commit uses progress bar"
assert_file_contains "$GIT_HOOKS/commit-msg" "ICON" "Commit-msg has type icons"
assert_file_contains "$SCRIPTS/apex-statusline.sh" "AGENT_STR" "Status line has agent tracking"

# ══════════════════════════════════════════════════
# 15. WATERMARK & BRANDING
# ══════════════════════════════════════════════════
section "15. Watermark & Branding"

assert_file_contains "$SCRIPTS/session-context.sh" "L.B. & Claude" "Session has watermark"
assert_file_contains "$SCRIPTS/apex-statusline.sh" "L.B. & Claude" "Status line has watermark"
assert_file_contains "$SCRIPTS/session-context.sh" "This is the way" "Session has creed"
assert_file_contains "$SCRIPT_DIR/CLAUDE.md" "APEX" "CLAUDE.md has APEX identity"

# ══════════════════════════════════════════════════
# 16. FUNCTIONAL TESTS — Script Execution
# ══════════════════════════════════════════════════
section "16. Functional Tests"

# Test session-context.sh (startup mode)
TOTAL=$((TOTAL + 1))
CTX_OUTPUT=$(echo '{"source":"startup"}' | bash "$SCRIPTS/session-context.sh" 2>&1)
CTX_EXIT=$?
if [ $CTX_EXIT -eq 0 ] && echo "$CTX_OUTPUT" | grep -q "APEX"; then
  if [ "$APEX_COLORS" = true ]; then
    printf "    ${OK}✓${RST} session-context.sh runs correctly (startup)\n"
  else
    echo "    ✅ session-context.sh runs correctly (startup)"
  fi
  PASS=$((PASS + 1))
else
  if [ "$APEX_COLORS" = true ]; then
    printf "    ${ERR}✗${RST} session-context.sh failed (exit $CTX_EXIT)\n"
  else
    echo "    ❌ session-context.sh failed (exit $CTX_EXIT)"
  fi
  FAIL=$((FAIL + 1))
fi

# Test session-context.sh (compact mode)
TOTAL=$((TOTAL + 1))
COMPACT_OUTPUT=$(echo '{"source":"compact"}' | bash "$SCRIPTS/session-context.sh" 2>&1)
if echo "$COMPACT_OUTPUT" | grep -q "compacted"; then
  if [ "$APEX_COLORS" = true ]; then
    printf "    ${OK}✓${RST} session-context.sh handles compact mode\n"
  else
    echo "    ✅ session-context.sh handles compact mode"
  fi
  PASS=$((PASS + 1))
else
  if [ "$APEX_COLORS" = true ]; then
    printf "    ${ERR}✗${RST} session-context.sh compact mode broken\n"
  else
    echo "    ❌ session-context.sh compact mode broken"
  fi
  FAIL=$((FAIL + 1))
fi

# Test status line
TOTAL=$((TOTAL + 1))
STATUS_INPUT='{"model":{"display_name":"Claude Opus","id":"claude-opus-4-20260301"},"context_window":{"used_percentage":45,"total_input_tokens":50000,"total_output_tokens":10000},"cost":{"total_cost_usd":0,"total_duration_ms":300000,"total_lines_added":100,"total_lines_removed":20}}'
STATUS_OUTPUT=$(echo "$STATUS_INPUT" | bash "$SCRIPTS/apex-statusline.sh" 2>&1)
if echo "$STATUS_OUTPUT" | grep -q "APEX"; then
  if [ "$APEX_COLORS" = true ]; then
    printf "    ${OK}✓${RST} apex-statusline.sh generates output\n"
  else
    echo "    ✅ apex-statusline.sh generates output"
  fi
  PASS=$((PASS + 1))
else
  if [ "$APEX_COLORS" = true ]; then
    printf "    ${ERR}✗${RST} apex-statusline.sh failed\n"
  else
    echo "    ❌ apex-statusline.sh failed"
  fi
  FAIL=$((FAIL + 1))
fi

# Test block-dangerous-commands
TOTAL=$((TOTAL + 1))
BLOCK_EXIT=0
echo '{"tool_input":{"command":"rm -rf /"}}' | bash "$SCRIPTS/block-dangerous-commands.sh" >/dev/null 2>&1 || BLOCK_EXIT=$?
if [ "$BLOCK_EXIT" -eq 2 ]; then
  if [ "$APEX_COLORS" = true ]; then
    printf "    ${OK}✓${RST} block-dangerous-commands blocks rm -rf\n"
  else
    echo "    ✅ block-dangerous-commands blocks rm -rf"
  fi
  PASS=$((PASS + 1))
else
  if [ "$APEX_COLORS" = true ]; then
    printf "    ${ERR}✗${RST} block-dangerous-commands failed to block (exit $BLOCK_EXIT)\n"
  else
    echo "    ❌ block-dangerous-commands failed to block (exit $BLOCK_EXIT)"
  fi
  FAIL=$((FAIL + 1))
fi

# Test safe command passes
TOTAL=$((TOTAL + 1))
SAFE_EXIT=0
echo '{"tool_input":{"command":"npm run build"}}' | bash "$SCRIPTS/block-dangerous-commands.sh" >/dev/null 2>&1 || SAFE_EXIT=$?
if [ "$SAFE_EXIT" -eq 0 ]; then
  if [ "$APEX_COLORS" = true ]; then
    printf "    ${OK}✓${RST} block-dangerous-commands allows safe commands\n"
  else
    echo "    ✅ block-dangerous-commands allows safe commands"
  fi
  PASS=$((PASS + 1))
else
  if [ "$APEX_COLORS" = true ]; then
    printf "    ${ERR}✗${RST} block-dangerous-commands incorrectly blocked safe command\n"
  else
    echo "    ❌ block-dangerous-commands incorrectly blocked safe command"
  fi
  FAIL=$((FAIL + 1))
fi

# ══════════════════════════════════════════════════
# SUMMARY
# ══════════════════════════════════════════════════
echo ""
if [ "$APEX_COLORS" = true ]; then
  printf "  ${SHADOW}══════════════════════════════════════════════${RST}\n"
else
  echo "  ══════════════════════════════════════════════"
fi
echo ""

if [ "$FAIL" -gt 0 ]; then
  if [ "$APEX_COLORS" = true ]; then
    printf "  ${ERR_BOLD}╔══════════════════════════════════════════════╗${RST}\n"
    printf "  ${ERR_BOLD}║${RST}  Results: ${OK}%d passed${RST} · ${ERR}%d failed${RST} · ${STEEL}%d skipped${RST} ${ERR_BOLD}║${RST}\n" "$PASS" "$FAIL" "$SKIP"
    printf "  ${ERR_BOLD}║${RST}  Total: %d tests                            ${ERR_BOLD}║${RST}\n" "$TOTAL"
    printf "  ${ERR_BOLD}║${RST}                                              ${ERR_BOLD}║${RST}\n"
    printf "  ${ERR_BOLD}║${RST}  ${STEEL}Some tests failed. Fix issues above.${RST}       ${ERR_BOLD}║${RST}\n"
    printf "  ${ERR_BOLD}╚══════════════════════════════════════════════╝${RST}\n"
  else
    echo "  Results: $PASS passed · $FAIL failed · $SKIP skipped"
    echo "  Total: $TOTAL tests"
    echo "  Some tests failed. Fix issues above."
  fi
  echo ""
  exit 1
else
  if [ "$APEX_COLORS" = true ]; then
    printf "  ${OK_BOLD}╔══════════════════════════════════════════════╗${RST}\n"
    printf "  ${OK_BOLD}║${RST}  Results: ${OK_BOLD}%d passed${RST} · ${STEEL}%d skipped${RST}            ${OK_BOLD}║${RST}\n" "$PASS" "$SKIP"
    printf "  ${OK_BOLD}║${RST}  Total: %d tests                            ${OK_BOLD}║${RST}\n" "$TOTAL"
    printf "  ${OK_BOLD}║${RST}                                              ${OK_BOLD}║${RST}\n"
    printf "  ${OK_BOLD}║${RST}  ${OK_BOLD}⚔️  All tests passed. This is the way.${RST}    ${OK_BOLD}║${RST}\n"
    # Grogu celebrates
    printf "  ${OK_BOLD}║${RST}  ${CREED}👶 \"Patu!\" — Grogu is proud of you${RST}       ${OK_BOLD}║${RST}\n"
    printf "  ${OK_BOLD}╚══════════════════════════════════════════════╝${RST}\n"
  else
    echo "  Results: $PASS passed · $SKIP skipped"
    echo "  Total: $TOTAL tests"
    echo "  ⚔️  All tests passed. This is the way."
    echo "  👶 \"Patu!\" — Grogu is proud of you"
  fi
  echo ""
  exit 0
fi
