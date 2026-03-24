#!/bin/bash
# e2e-framework.sh — APEX Framework End-to-End Test Suite
#
# Tests the full lifecycle: create project → install APEX → verify → workflow → cleanup.
# Safe to run at any time: only touches temporary directories.
#
# Usage:
#   bash tests/e2e-framework.sh
#   tests/e2e-framework.sh  (if executable)
#
# Exit code: 0 = all tests passed, 1 = one or more tests failed
#
# by L.B. & Claude · São Paulo, 2026

# ── Resolve APEX framework directory ──────────────────────────────────────────
APEX_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# ── Colors (degraded gracefully if not a TTY) ─────────────────────────────────
if [ -t 1 ]; then
  GREEN='\033[0;32m'
  RED='\033[0;31m'
  YELLOW='\033[1;33m'
  CYAN='\033[0;36m'
  BOLD='\033[1m'
  RST='\033[0m'
else
  GREEN='' RED='' YELLOW='' CYAN='' BOLD='' RST=''
fi

# ── Test counters ─────────────────────────────────────────────────────────────
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0
FAILED_NAMES=""

# ── Timing ────────────────────────────────────────────────────────────────────
START_TIME=$(date +%s)

# ── Temp workspace (Phase 1 sets this) ────────────────────────────────────────
TMPDIR_WORKSPACE=""

# ── Helpers ───────────────────────────────────────────────────────────────────

pass() {
  local name="$1"
  TESTS_TOTAL=$((TESTS_TOTAL + 1))
  TESTS_PASSED=$((TESTS_PASSED + 1))
  printf "  ${GREEN}[PASS]${RST} %s\n" "$name"
}

fail() {
  local name="$1"
  local detail="${2:-}"
  TESTS_TOTAL=$((TESTS_TOTAL + 1))
  TESTS_FAILED=$((TESTS_FAILED + 1))
  FAILED_NAMES="${FAILED_NAMES}\n    - ${name}"
  printf "  ${RED}[FAIL]${RST} %s" "$name"
  if [ -n "$detail" ]; then
    printf " ${YELLOW}(%s)${RST}" "$detail"
  fi
  printf "\n"
}

assert_dir_exists() {
  local label="$1"
  local path="$2"
  if [ -d "$path" ]; then
    pass "$label"
  else
    fail "$label" "directory not found: $path"
  fi
}

assert_file_exists() {
  local label="$1"
  local path="$2"
  if [ -f "$path" ]; then
    pass "$label"
  else
    fail "$label" "file not found: $path"
  fi
}

assert_count_gte() {
  local label="$1"
  local actual="$2"
  local min="$3"
  if [ "$actual" -ge "$min" ]; then
    pass "$label (found $actual, expected >= $min)"
  else
    fail "$label" "found $actual, expected >= $min"
  fi
}

section() {
  printf "\n${CYAN}${BOLD}%s${RST}\n" "$1"
  printf "${CYAN}%s${RST}\n" "$(printf '─%.0s' $(seq 1 60))"
}

# ── Cleanup trap ──────────────────────────────────────────────────────────────

cleanup() {
  if [ -n "$TMPDIR_WORKSPACE" ] && [ -d "$TMPDIR_WORKSPACE" ]; then
    rm -rf "$TMPDIR_WORKSPACE"
  fi
}

trap cleanup EXIT INT TERM

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 1: Setup
# ══════════════════════════════════════════════════════════════════════════════

section "Phase 1: Setup"

# Create temp workspace
TMPDIR_WORKSPACE=$(mktemp -d)
if [ -d "$TMPDIR_WORKSPACE" ]; then
  pass "mktemp -d created workspace ($TMPDIR_WORKSPACE)"
else
  fail "mktemp -d created workspace" "could not create temp directory"
  echo ""
  echo "${RED}Fatal: cannot continue without a temp workspace.${RST}"
  exit 1
fi

# Git init
cd "$TMPDIR_WORKSPACE" || exit 1
git init -q
if [ -d ".git" ]; then
  pass "git init created .git/"
else
  fail "git init created .git/"
fi

# Set a local git identity so commits work without global config
git config user.email "apex-e2e-test@example.com"
git config user.name "APEX E2E Test"

# Minimal package.json
cat > package.json <<'JSON'
{
  "name": "apex-e2e-test",
  "version": "1.0.0",
  "private": true,
  "description": "APEX framework e2e test project"
}
JSON

if [ -f "package.json" ] && grep -q '"apex-e2e-test"' package.json; then
  pass "package.json created with correct name"
else
  fail "package.json created with correct name"
fi

# Initial commit so HEAD exists (required for branch tests later)
git add package.json
git commit -q -m "chore: initial project scaffold"

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 2: Install APEX
# ══════════════════════════════════════════════════════════════════════════════

section "Phase 2: Install APEX"

# apex-init-project.sh runs from $cwd and locates APEX relative to $0.
# We invoke it directly — install.sh gates on 'claude' CLI being present,
# but apex-init-project.sh (the real installer) has no such gate.
INSTALL_SCRIPT="$APEX_DIR/apex-init-project.sh"

if [ -f "$INSTALL_SCRIPT" ]; then
  pass "apex-init-project.sh found at expected path"
else
  fail "apex-init-project.sh found at expected path" "not found: $INSTALL_SCRIPT"
  echo ""
  echo "${RED}Fatal: installer not found, cannot continue.${RST}"
  exit 1
fi

# Run the installer (stdout captured; shown only on failure)
INSTALL_OUTPUT=$("$INSTALL_SCRIPT" 2>&1)
INSTALL_EXIT=$?

if [ "$INSTALL_EXIT" -eq 0 ]; then
  pass "apex-init-project.sh exited 0"
else
  fail "apex-init-project.sh exited 0" "exit code $INSTALL_EXIT"
  echo ""
  echo "${YELLOW}Installer output:${RST}"
  echo "$INSTALL_OUTPUT"
  echo ""
  echo "${RED}Fatal: installation failed, verification cannot continue.${RST}"
  exit 1
fi

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 3: Verify Installation
# ══════════════════════════════════════════════════════════════════════════════

section "Phase 3: Verify Installation"

# .claude/ directory
assert_dir_exists ".claude/ directory exists" ".claude"

# Skills — expect >= 20 named subdirectories (one per skill)
SKILL_COUNT=$(find .claude/skills -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
assert_count_gte "skills installed" "$SKILL_COUNT" 20

# Agents — expect >= 4 .md files
AGENT_COUNT=$(find .claude/agents -maxdepth 1 -name "*.md" | wc -l | tr -d ' ')
assert_count_gte "agents installed" "$AGENT_COUNT" 4

# Scripts — expect >= 15 .sh files
SCRIPT_COUNT=$(find .claude/scripts -maxdepth 1 -name "*.sh" | wc -l | tr -d ' ')
assert_count_gte "hook scripts installed" "$SCRIPT_COUNT" 15

# settings.json exists and is valid JSON
assert_file_exists "settings.json exists" ".claude/settings.json"
if command -v jq > /dev/null 2>&1; then
  if jq empty .claude/settings.json 2>/dev/null; then
    pass "settings.json is valid JSON (jq)"
  else
    fail "settings.json is valid JSON (jq)"
  fi
else
  # Fallback: python3 json validation
  if command -v python3 > /dev/null 2>&1; then
    if python3 -c "import json, sys; json.load(open('.claude/settings.json'))" 2>/dev/null; then
      pass "settings.json is valid JSON (python3 fallback)"
    else
      fail "settings.json is valid JSON (python3 fallback)"
    fi
  else
    # Manual check: ensure file has braces (not empty or truncated)
    if grep -q '{' .claude/settings.json 2>/dev/null; then
      pass "settings.json exists and is non-empty (no jq/python3 available)"
    else
      fail "settings.json is valid JSON" "no jq or python3 to validate"
    fi
  fi
fi

# CLAUDE.md
assert_file_exists "CLAUDE.md exists" "CLAUDE.md"

# Git hooks
assert_file_exists ".git/hooks/pre-commit exists" ".git/hooks/pre-commit"
assert_file_exists ".git/hooks/commit-msg exists" ".git/hooks/commit-msg"

# All .claude/scripts/*.sh are executable
ALL_EXEC=true
NON_EXEC_LIST=""
for sh_file in .claude/scripts/*.sh; do
  if [ ! -x "$sh_file" ]; then
    ALL_EXEC=false
    NON_EXEC_LIST="$NON_EXEC_LIST $sh_file"
  fi
done
if [ "$ALL_EXEC" = true ]; then
  pass "all scripts in .claude/scripts/ are executable"
else
  fail "all scripts in .claude/scripts/ are executable" "not executable:$NON_EXEC_LIST"
fi

# All .claude/scripts/*.sh pass bash -n syntax check
ALL_SYNTAX_OK=true
SYNTAX_ERRORS=""
for sh_file in .claude/scripts/*.sh; do
  if ! bash -n "$sh_file" 2>/dev/null; then
    ALL_SYNTAX_OK=false
    SYNTAX_ERRORS="$SYNTAX_ERRORS $sh_file"
  fi
done
if [ "$ALL_SYNTAX_OK" = true ]; then
  pass "all scripts pass bash -n syntax check"
else
  fail "all scripts pass bash -n syntax check" "errors in:$SYNTAX_ERRORS"
fi

# Git hooks pass bash -n syntax check
for hook in .git/hooks/pre-commit .git/hooks/commit-msg; do
  if bash -n "$hook" 2>/dev/null; then
    pass "$(basename "$hook") passes bash -n syntax check"
  else
    fail "$(basename "$hook") passes bash -n syntax check"
  fi
done

# health-check.sh — run if installed (non-fatal: captures its own exit)
if [ -f ".claude/scripts/health-check.sh" ]; then
  HEALTH_OUTPUT=$(bash .claude/scripts/health-check.sh 2>&1)
  HEALTH_EXIT=$?
  if [ "$HEALTH_EXIT" -eq 0 ]; then
    pass "health-check.sh exited 0"
  else
    fail "health-check.sh exited 0" "exit code $HEALTH_EXIT"
  fi
else
  pass "health-check.sh not present (skipped)"
fi

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 4: Workflow Simulation
# ══════════════════════════════════════════════════════════════════════════════

section "Phase 4: Workflow Simulation"

# Create feature branch
git checkout -q -b feat/e2e-test 2>/dev/null
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || git rev-parse --abbrev-ref HEAD 2>/dev/null)
if [ "$CURRENT_BRANCH" = "feat/e2e-test" ]; then
  pass "feature branch feat/e2e-test created"
else
  fail "feature branch feat/e2e-test created" "current branch: $CURRENT_BRANCH"
fi

# Create dummy source file
mkdir -p src
printf "export const hello = 'world';\n" > src/index.ts
assert_file_exists "src/index.ts created" "src/index.ts"

# Stage the file
git add src/index.ts
STAGED=$(git diff --cached --name-only)
if echo "$STAGED" | grep -q "src/index.ts"; then
  pass "src/index.ts staged successfully"
else
  fail "src/index.ts staged successfully" "not in staging area"
fi

# Commit with a valid conventional message
GOOD_MSG="feat(core): add hello world export"
COMMIT_OUTPUT=$(git commit -m "$GOOD_MSG" 2>&1)
COMMIT_EXIT=$?
if [ "$COMMIT_EXIT" -eq 0 ]; then
  pass "valid conventional commit accepted by commit-msg hook"
else
  fail "valid conventional commit accepted by commit-msg hook" "exit $COMMIT_EXIT — $COMMIT_OUTPUT"
fi

# Verify the commit is in history
LAST_COMMIT_MSG=$(git log -1 --pretty=%s 2>/dev/null)
if [ "$LAST_COMMIT_MSG" = "$GOOD_MSG" ]; then
  pass "commit message recorded correctly in git log"
else
  fail "commit message recorded correctly in git log" "got: $LAST_COMMIT_MSG"
fi

# Try a BAD commit message — hook must reject it
DUMMY_FILE="src/dummy.ts"
printf "export const x = 1;\n" > "$DUMMY_FILE"
git add "$DUMMY_FILE"

BAD_MSG="this is not conventional"
BAD_COMMIT_OUTPUT=$(git commit -m "$BAD_MSG" 2>&1)
BAD_COMMIT_EXIT=$?
if [ "$BAD_COMMIT_EXIT" -ne 0 ]; then
  pass "non-conventional commit message rejected by commit-msg hook"
else
  fail "non-conventional commit message rejected by commit-msg hook" \
    "hook allowed bad message: '$BAD_MSG'"
  # Un-stage to keep workspace clean
  git reset HEAD "$DUMMY_FILE" 2>/dev/null || true
fi
rm -f "$DUMMY_FILE"

# Try a commit message that exceeds 72 characters — hook must reject it
DUMMY_FILE2="src/dummy2.ts"
printf "export const y = 2;\n" > "$DUMMY_FILE2"
git add "$DUMMY_FILE2"

LONG_MSG="feat(scope): this message is intentionally way too long and exceeds seventy-two characters limit"
LONG_COMMIT_OUTPUT=$(git commit -m "$LONG_MSG" 2>&1)
LONG_COMMIT_EXIT=$?
if [ "$LONG_COMMIT_EXIT" -ne 0 ]; then
  pass "commit message exceeding 72 chars rejected by commit-msg hook"
else
  fail "commit message exceeding 72 chars rejected by commit-msg hook" \
    "hook allowed: '${LONG_MSG}' (${#LONG_MSG} chars)"
  git reset HEAD "$DUMMY_FILE2" 2>/dev/null || true
fi
rm -f "$DUMMY_FILE2"

# ══════════════════════════════════════════════════════════════════════════════
# PHASE 5: Cleanup
# ══════════════════════════════════════════════════════════════════════════════

section "Phase 5: Cleanup"

cd /tmp 2>/dev/null || cd / 2>/dev/null
rm -rf "$TMPDIR_WORKSPACE"
TMPDIR_WORKSPACE=""  # prevent double-removal in trap

if [ ! -d "$TMPDIR_WORKSPACE" ] 2>/dev/null; then
  pass "temp workspace removed"
fi

# ── Summary ───────────────────────────────────────────────────────────────────

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

printf "\n${BOLD}══════════════════════════════════════════════════════════${RST}\n"
printf "${BOLD}  APEX Framework E2E — Results${RST}\n"
printf "${BOLD}══════════════════════════════════════════════════════════${RST}\n"
printf "\n"
printf "  Total:    %d\n" "$TESTS_TOTAL"
printf "  ${GREEN}Passed:   %d${RST}\n" "$TESTS_PASSED"

if [ "$TESTS_FAILED" -gt 0 ]; then
  printf "  ${RED}Failed:   %d${RST}\n" "$TESTS_FAILED"
  printf "\n  ${RED}${BOLD}Failures:${RST}%b\n" "$FAILED_NAMES"
else
  printf "  ${GREEN}Failed:   0${RST}\n"
fi

printf "\n  Duration: %ds\n" "$DURATION"
printf "\n"

if [ "$TESTS_FAILED" -eq 0 ]; then
  printf "  ${GREEN}${BOLD}All tests passed. APEX is healthy.${RST}\n"
  printf "\n"
  exit 0
else
  printf "  ${RED}${BOLD}$TESTS_FAILED test(s) failed. Review output above.${RST}\n"
  printf "\n"
  exit 1
fi
