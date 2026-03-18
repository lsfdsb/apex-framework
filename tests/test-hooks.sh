#!/bin/bash
# test-hooks.sh — Test suite for APEX Framework hook scripts
# Validates that all hooks behave correctly with mocked inputs.
#
# Usage: ./tests/test-hooks.sh
# Exit 0 = all tests pass. Exit 1 = failures found.
#
# by L.B. & Claude · São Paulo, 2026

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPTS="$SCRIPT_DIR/.claude/scripts"
PASS=0
FAIL=0
TOTAL=0

# Colors (if terminal supports them)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

assert_exit() {
  local test_name="$1"
  local expected_exit="$2"
  local actual_exit="$3"
  TOTAL=$((TOTAL + 1))
  if [ "$actual_exit" -eq "$expected_exit" ]; then
    echo -e "  ${GREEN}✅ PASS${NC}: $test_name (exit $actual_exit)"
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}❌ FAIL${NC}: $test_name (expected exit $expected_exit, got $actual_exit)"
    FAIL=$((FAIL + 1))
  fi
}

assert_output_contains() {
  local test_name="$1"
  local pattern="$2"
  local output="$3"
  TOTAL=$((TOTAL + 1))
  if echo "$output" | grep -qE "$pattern"; then
    echo -e "  ${GREEN}✅ PASS${NC}: $test_name"
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}❌ FAIL${NC}: $test_name (output missing pattern: $pattern)"
    FAIL=$((FAIL + 1))
  fi
}

assert_output_not_contains() {
  local test_name="$1"
  local pattern="$2"
  local output="$3"
  TOTAL=$((TOTAL + 1))
  if ! echo "$output" | grep -qE "$pattern"; then
    echo -e "  ${GREEN}✅ PASS${NC}: $test_name"
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}❌ FAIL${NC}: $test_name (output unexpectedly contains: $pattern)"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "⚔️ APEX Framework — Hook Test Suite"
echo "======================================"
echo ""

# ────────────────────────────────────────────
# TEST: block-dangerous-commands.sh
# ────────────────────────────────────────────
echo "🧪 block-dangerous-commands.sh"

# Should block rm -rf
OUTPUT=$(echo '{"tool_input":{"command":"rm -rf /"}}' | "$SCRIPTS/block-dangerous-commands.sh" 2>&1 || true)
LAST_EXIT=$?
# The script exits 2 for blocks, but set -e may catch it. Use subshell.
LAST_EXIT=$(echo '{"tool_input":{"command":"rm -rf /"}}' | bash "$SCRIPTS/block-dangerous-commands.sh" 2>/dev/null; echo $?)
# Actually we need both stdout and stderr
LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"rm -rf /"}}' | bash "$SCRIPTS/block-dangerous-commands.sh" 2>&1) || LAST_EXIT=$?
assert_exit "blocks rm -rf" 2 "$LAST_EXIT"
assert_output_contains "rm -rf feedback message" "BLOCKED" "$OUTPUT"

# Should block git push to main
LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"git push origin main"}}' | bash "$SCRIPTS/block-dangerous-commands.sh" 2>&1) || LAST_EXIT=$?
assert_exit "blocks git push to main" 2 "$LAST_EXIT"

# Should block git push to master
LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"git push origin master"}}' | bash "$SCRIPTS/block-dangerous-commands.sh" 2>&1) || LAST_EXIT=$?
assert_exit "blocks git push to master" 2 "$LAST_EXIT"

# Should block force push
LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"git push origin feature -f"}}' | bash "$SCRIPTS/block-dangerous-commands.sh" 2>&1) || LAST_EXIT=$?
assert_exit "blocks force push (-f)" 2 "$LAST_EXIT"

LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"git push origin feature --force"}}' | bash "$SCRIPTS/block-dangerous-commands.sh" 2>&1) || LAST_EXIT=$?
assert_exit "blocks force push (--force)" 2 "$LAST_EXIT"

# Should block DROP TABLE
LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"psql -c \"DROP TABLE users\""}}' | bash "$SCRIPTS/block-dangerous-commands.sh" 2>&1) || LAST_EXIT=$?
assert_exit "blocks DROP TABLE" 2 "$LAST_EXIT"

# Should allow safe commands
LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"git push origin feat/my-feature"}}' | bash "$SCRIPTS/block-dangerous-commands.sh" 2>&1) || LAST_EXIT=$?
assert_exit "allows git push to feature branch" 0 "$LAST_EXIT"

LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"npm run build"}}' | bash "$SCRIPTS/block-dangerous-commands.sh" 2>&1) || LAST_EXIT=$?
assert_exit "allows npm run build" 0 "$LAST_EXIT"

LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"rm specific-file.txt"}}' | bash "$SCRIPTS/block-dangerous-commands.sh" 2>&1) || LAST_EXIT=$?
assert_exit "allows rm without -rf" 0 "$LAST_EXIT"

echo ""

# ────────────────────────────────────────────
# TEST: enforce-commit-msg.sh
# ────────────────────────────────────────────
echo "🧪 enforce-commit-msg.sh"

# Should allow conventional commits
LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"git commit -m \"feat: add login page\""}}' | bash "$SCRIPTS/enforce-commit-msg.sh" 2>&1) || LAST_EXIT=$?
assert_exit "allows feat: commit" 0 "$LAST_EXIT"

LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"git commit -m \"fix(auth): resolve token expiry bug\""}}' | bash "$SCRIPTS/enforce-commit-msg.sh" 2>&1) || LAST_EXIT=$?
assert_exit "allows fix(scope): commit" 0 "$LAST_EXIT"

LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"git commit -m \"docs: update README\""}}' | bash "$SCRIPTS/enforce-commit-msg.sh" 2>&1) || LAST_EXIT=$?
assert_exit "allows docs: commit" 0 "$LAST_EXIT"

# Should block non-conventional commits
LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"git commit -m \"updated stuff\""}}' | bash "$SCRIPTS/enforce-commit-msg.sh" 2>&1) || LAST_EXIT=$?
assert_exit "blocks non-conventional commit" 2 "$LAST_EXIT"
assert_output_contains "shows conventional format help" "conventional format" "$OUTPUT"

# Should allow non-commit git commands
LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"git status"}}' | bash "$SCRIPTS/enforce-commit-msg.sh" 2>&1) || LAST_EXIT=$?
assert_exit "allows git status" 0 "$LAST_EXIT"

# Should allow editor-based commits (no -m flag)
LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"git commit"}}' | bash "$SCRIPTS/enforce-commit-msg.sh" 2>&1) || LAST_EXIT=$?
assert_exit "allows editor-based commit" 0 "$LAST_EXIT"

echo ""

# ────────────────────────────────────────────
# TEST: protect-files.sh
# ────────────────────────────────────────────
echo "🧪 protect-files.sh"

# Should block .env edits
LAST_EXIT=0
OUTPUT=$(echo '{"tool_name":"Write","tool_input":{"file_path":".env"}}' | bash "$SCRIPTS/protect-files.sh" 2>&1) || LAST_EXIT=$?
assert_exit "blocks .env write" 2 "$LAST_EXIT"

# Should block .env.local edits
LAST_EXIT=0
OUTPUT=$(echo '{"tool_name":"Edit","tool_input":{"file_path":".env.local"}}' | bash "$SCRIPTS/protect-files.sh" 2>&1) || LAST_EXIT=$?
assert_exit "blocks .env.local edit" 2 "$LAST_EXIT"

# Should block package-lock.json edits
LAST_EXIT=0
OUTPUT=$(echo '{"tool_name":"Write","tool_input":{"file_path":"package-lock.json"}}' | bash "$SCRIPTS/protect-files.sh" 2>&1) || LAST_EXIT=$?
assert_exit "blocks package-lock.json write" 2 "$LAST_EXIT"

# Should block node_modules edits
LAST_EXIT=0
OUTPUT=$(echo '{"tool_name":"Write","tool_input":{"file_path":"node_modules/foo/index.js"}}' | bash "$SCRIPTS/protect-files.sh" 2>&1) || LAST_EXIT=$?
assert_exit "blocks node_modules write" 2 "$LAST_EXIT"

# Should allow normal file edits
LAST_EXIT=0
OUTPUT=$(echo '{"tool_name":"Write","tool_input":{"file_path":"src/app/page.tsx"}}' | bash "$SCRIPTS/protect-files.sh" 2>&1) || LAST_EXIT=$?
assert_exit "allows src/app/page.tsx write" 0 "$LAST_EXIT"

# Should allow .env.example
LAST_EXIT=0
OUTPUT=$(echo '{"tool_name":"Write","tool_input":{"file_path":".env.example"}}' | bash "$SCRIPTS/protect-files.sh" 2>&1) || LAST_EXIT=$?
assert_exit "allows .env.example write" 0 "$LAST_EXIT"

echo ""

# ────────────────────────────────────────────
# TEST: enforce-workflow.sh
# ────────────────────────────────────────────
echo "🧪 enforce-workflow.sh"

# Should allow Edit tool (existing files exempt)
LAST_EXIT=0
OUTPUT=$(echo '{"tool_name":"Edit","tool_input":{"file_path":"src/app/page.tsx"}}' | bash "$SCRIPTS/enforce-workflow.sh" 2>&1) || LAST_EXIT=$?
assert_exit "allows Edit (existing file exempt)" 0 "$LAST_EXIT"

# Should allow test file creation
LAST_EXIT=0
OUTPUT=$(echo '{"tool_name":"Write","tool_input":{"file_path":"src/app/login.test.tsx"}}' | bash "$SCRIPTS/enforce-workflow.sh" 2>&1) || LAST_EXIT=$?
assert_exit "allows test file write" 0 "$LAST_EXIT"

# Should allow docs creation
LAST_EXIT=0
OUTPUT=$(echo '{"tool_name":"Write","tool_input":{"file_path":"docs/prd/my-feature.md"}}' | bash "$SCRIPTS/enforce-workflow.sh" 2>&1) || LAST_EXIT=$?
assert_exit "allows docs write" 0 "$LAST_EXIT"

# Should allow files outside app directories
LAST_EXIT=0
OUTPUT=$(echo '{"tool_name":"Write","tool_input":{"file_path":"src/lib/utils.ts"}}' | bash "$SCRIPTS/enforce-workflow.sh" 2>&1) || LAST_EXIT=$?
assert_exit "allows src/lib write (not app/components)" 0 "$LAST_EXIT"

# Should block new app file when no PRD exists (only if docs/prd doesn't have .md files)
# This test depends on the actual filesystem, so we test the logic carefully
if [ ! -d "docs/prd" ] || [ "$(find docs/prd -name '*.md' -type f 2>/dev/null | wc -l | tr -d ' ')" = "0" ]; then
  LAST_EXIT=0
  OUTPUT=$(echo '{"tool_name":"Write","tool_input":{"file_path":"src/app/dashboard/page.tsx"}}' | bash "$SCRIPTS/enforce-workflow.sh" 2>&1) || LAST_EXIT=$?
  assert_exit "blocks new app file without PRD" 2 "$LAST_EXIT"
  assert_output_contains "shows PRD guidance" "PRD" "$OUTPUT"
else
  echo -e "  ${YELLOW}⏭️ SKIP${NC}: PRD exists in docs/prd/, cannot test PRD blocking"
fi

echo ""

# ────────────────────────────────────────────
# TEST: verify-install.sh
# ────────────────────────────────────────────
echo "🧪 verify-install.sh"

# Should inject reminder for npm install
LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"npm install lodash"}}' | bash "$SCRIPTS/verify-install.sh" 2>&1) || LAST_EXIT=$?
assert_exit "allows npm install (reminder only)" 0 "$LAST_EXIT"
assert_output_contains "injects verify-lib reminder" "APEX REMINDER" "$OUTPUT"

# Should not trigger for npm run
LAST_EXIT=0
OUTPUT=$(echo '{"tool_input":{"command":"npm run build"}}' | bash "$SCRIPTS/verify-install.sh" 2>&1) || LAST_EXIT=$?
assert_exit "no reminder for npm run" 0 "$LAST_EXIT"
assert_output_not_contains "no reminder for npm run" "APEX REMINDER" "$OUTPUT"

echo ""

# ────────────────────────────────────────────
# TEST: All scripts are executable
# ────────────────────────────────────────────
echo "🧪 File permissions"
for script in "$SCRIPTS"/*.sh; do
  TOTAL=$((TOTAL + 1))
  if [ -x "$script" ]; then
    echo -e "  ${GREEN}✅ PASS${NC}: $(basename "$script") is executable"
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}❌ FAIL${NC}: $(basename "$script") is NOT executable"
    FAIL=$((FAIL + 1))
  fi
done

echo ""

# ────────────────────────────────────────────
# TEST: All scripts have jq warning
# ────────────────────────────────────────────
echo "🧪 jq dependency warnings"
for script in "$SCRIPTS"/*.sh; do
  BASENAME=$(basename "$script")
  # Skip scripts that don't use jq or intentionally degrade silently (exit 0)
  case "$BASENAME" in
    apex-statusline.sh|apex-colors.sh|apex-launch.sh|apex-sync.sh|auto-update.sh|dev-monitor.sh|extract-session.sh|auto-approve-safe.sh|auto-changelog.sh|dev-server.sh|log-subagent.sh|session-learner.sh) continue ;;
  esac
  TOTAL=$((TOTAL + 1))
  if grep -q "jq not installed" "$script"; then
    echo -e "  ${GREEN}✅ PASS${NC}: $BASENAME warns about missing jq"
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}❌ FAIL${NC}: $BASENAME silently degrades without jq"
    FAIL=$((FAIL + 1))
  fi
done

echo ""

# ────────────────────────────────────────────
# TEST: No grep -oP (macOS incompatible)
# ────────────────────────────────────────────
echo "🧪 macOS compatibility (no grep -oP)"
for script in "$SCRIPTS"/*.sh; do
  BASENAME=$(basename "$script")
  TOTAL=$((TOTAL + 1))
  if grep -v '^  #\|^#' "$script" | grep -q 'grep -oP'; then
    echo -e "  ${RED}❌ FAIL${NC}: $BASENAME uses grep -oP (PCRE, not available on macOS)"
    FAIL=$((FAIL + 1))
  else
    echo -e "  ${GREEN}✅ PASS${NC}: $BASENAME is macOS-compatible"
    PASS=$((PASS + 1))
  fi
done

echo ""

# ────────────────────────────────────────────
# SUMMARY
# ────────────────────────────────────────────
echo "======================================"
echo -e "Total: $TOTAL | ${GREEN}Pass: $PASS${NC} | ${RED}Fail: $FAIL${NC}"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo -e "${RED}⚔️ Some tests failed. Fix issues above.${NC}"
  exit 1
else
  echo -e "${GREEN}⚔️ All tests passed. This is the way.${NC}"
  exit 0
fi
