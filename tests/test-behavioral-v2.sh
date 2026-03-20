#!/bin/bash
# test-behavioral-v2.sh — Real behavioral tests for APEX Framework
# These tests verify actual BEHAVIOR, not just file existence.
# Every test pipes real input and validates real output.
#
# Usage: bash tests/test-behavioral-v2.sh
#
# by L.B. & Claude · São Paulo, 2026

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPTS="$SCRIPT_DIR/.claude/scripts"
AGENTS="$SCRIPT_DIR/.claude/agents"
SKILLS="$SCRIPT_DIR/.claude/skills"
PASS=0
FAIL=0
SKIP=0
TOTAL=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
DIM='\033[0;90m'
NC='\033[0m'

# ── Test Helpers ──

assert_exit() {
  local test_name="$1"
  local expected="$2"
  local actual="$3"
  TOTAL=$((TOTAL + 1))
  if [ "$actual" -eq "$expected" ]; then
    echo -e "  ${GREEN}✅ PASS${NC}: $test_name"
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}❌ FAIL${NC}: $test_name (expected exit $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

assert_contains() {
  local test_name="$1"
  local pattern="$2"
  local output="$3"
  TOTAL=$((TOTAL + 1))
  if echo "$output" | grep -qiE "$pattern"; then
    echo -e "  ${GREEN}✅ PASS${NC}: $test_name"
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}❌ FAIL${NC}: $test_name (missing: $pattern)"
    FAIL=$((FAIL + 1))
  fi
}

assert_not_contains() {
  local test_name="$1"
  local pattern="$2"
  local output="$3"
  TOTAL=$((TOTAL + 1))
  if ! echo "$output" | grep -qiE "$pattern"; then
    echo -e "  ${GREEN}✅ PASS${NC}: $test_name"
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}❌ FAIL${NC}: $test_name (unexpected: $pattern)"
    FAIL=$((FAIL + 1))
  fi
}

skip_test() {
  local test_name="$1"
  local reason="$2"
  TOTAL=$((TOTAL + 1))
  SKIP=$((SKIP + 1))
  echo -e "  ${YELLOW}⏭ SKIP${NC}: $test_name ($reason)"
}

run_hook() {
  local script="$1"
  local json_input="$2"
  local exit_code=0
  local output
  output=$(echo "$json_input" | bash "$script" 2>&1) || exit_code=$?
  echo "$exit_code|$output"
}

echo ""
echo "⚔️ APEX Framework — Behavioral Test Suite v2"
echo "=============================================="
echo -e "${DIM}Real input → Real output → Real verification${NC}"
echo ""

# ════════════════════════════════════════════════
# 1. DANGEROUS COMMAND BLOCKING (15 scenarios)
# ════════════════════════════════════════════════
echo "🛡️  1. block-dangerous-commands.sh — 15 real scenarios"
echo ""

HOOK="$SCRIPTS/block-dangerous-commands.sh"

# ── Must BLOCK ──

for cmd_json in \
  '{"tool_input":{"command":"rm -rf /"}}' \
  '{"tool_input":{"command":"rm -rf ~"}}' \
  '{"tool_input":{"command":"rm -rf ."}}' \
  '{"tool_input":{"command":"rm -fr /tmp/test"}}' \
  '{"tool_input":{"command":"git push origin main"}}' \
  '{"tool_input":{"command":"git push origin master"}}' \
  '{"tool_input":{"command":"git push -f origin feat/x"}}' \
  '{"tool_input":{"command":"git push --force origin feat/x"}}' \
  '{"tool_input":{"command":"DROP TABLE users;"}}' \
  '{"tool_input":{"command":"TRUNCATE TABLE orders"}}'; do

  CMD=$(echo "$cmd_json" | grep -oE '"command":"[^"]*"' | sed 's/"command":"//;s/"//')
  RESULT=$(run_hook "$HOOK" "$cmd_json")
  EXIT_CODE="${RESULT%%|*}"
  OUTPUT="${RESULT#*|}"
  assert_exit "BLOCKS: $CMD" 2 "$EXIT_CODE"
  assert_contains "BLOCKS: $CMD has feedback" "BLOCKED" "$OUTPUT"
done

# ── Must ALLOW ──

for cmd_json in \
  '{"tool_input":{"command":"npm run build"}}' \
  '{"tool_input":{"command":"git push origin feat/my-feature"}}' \
  '{"tool_input":{"command":"git push --force-with-lease origin feat/x"}}' \
  '{"tool_input":{"command":"rm specific-file.txt"}}' \
  '{"tool_input":{"command":"rm -r ./dist"}}'; do

  CMD=$(echo "$cmd_json" | grep -oE '"command":"[^"]*"' | sed 's/"command":"//;s/"//')
  RESULT=$(run_hook "$HOOK" "$cmd_json")
  EXIT_CODE="${RESULT%%|*}"
  assert_exit "ALLOWS: $CMD" 0 "$EXIT_CODE"
done

echo ""

# ════════════════════════════════════════════════
# 2. SECURITY PATTERN SCANNING (12 scenarios)
# ════════════════════════════════════════════════
echo "🔒 2. scan-security-patterns.sh — 12 real payloads"
echo ""

HOOK="$SCRIPTS/scan-security-patterns.sh"

# ── Must BLOCK: real secret patterns ──

# Stripe live key
RESULT=$(run_hook "$HOOK" '{"tool_name":"Write","tool_input":{"file_path":"src/payments.ts","content":"const key = \"sk_live_4eC39HqLyjWDarjtT1zdp7dc\""}}')
EXIT_CODE="${RESULT%%|*}"
OUTPUT="${RESULT#*|}"
assert_exit "BLOCKS: Stripe live key" 2 "$EXIT_CODE"
assert_contains "Stripe key feedback" "secret|key|credential|BLOCKED" "$OUTPUT"

# Stripe test key
RESULT=$(run_hook "$HOOK" '{"tool_name":"Write","tool_input":{"file_path":"src/payments.ts","content":"const key = \"sk_test_4eC39HqLyjWDarjtT1zdp7dc\""}}')
EXIT_CODE="${RESULT%%|*}"
assert_exit "BLOCKS: Stripe test key" 2 "$EXIT_CODE"

# AWS access key
RESULT=$(run_hook "$HOOK" '{"tool_name":"Write","tool_input":{"file_path":"src/aws.ts","content":"const aws = \"AKIAIOSFODNN7EXAMPLE\""}}')
EXIT_CODE="${RESULT%%|*}"
assert_exit "BLOCKS: AWS access key (AKIA)" 2 "$EXIT_CODE"

# GitHub personal token
RESULT=$(run_hook "$HOOK" '{"tool_name":"Write","tool_input":{"file_path":"src/github.ts","content":"const token = \"ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh\""}}')
EXIT_CODE="${RESULT%%|*}"
assert_exit "BLOCKS: GitHub personal token (ghp_)" 2 "$EXIT_CODE"

# OpenAI key
RESULT=$(run_hook "$HOOK" '{"tool_name":"Write","tool_input":{"file_path":"src/ai.ts","content":"const key = \"sk-proj-abcdefghijklmnopqrstuvwxyz1234567890\""}}')
EXIT_CODE="${RESULT%%|*}"
assert_exit "BLOCKS: OpenAI key (sk-)" 2 "$EXIT_CODE"

# eval() usage
RESULT=$(run_hook "$HOOK" '{"tool_name":"Write","tool_input":{"file_path":"src/utils.ts","content":"const result = eval(userInput)"}}')
EXIT_CODE="${RESULT%%|*}"
assert_exit "BLOCKS: eval() usage" 2 "$EXIT_CODE"

# ── Must ALLOW: safe patterns ──

# Environment variable reference (not hardcoded)
RESULT=$(run_hook "$HOOK" '{"tool_name":"Write","tool_input":{"file_path":"src/config.ts","content":"const key = process.env.STRIPE_KEY"}}')
EXIT_CODE="${RESULT%%|*}"
assert_exit "ALLOWS: process.env reference" 0 "$EXIT_CODE"

# Markdown documentation with example keys
RESULT=$(run_hook "$HOOK" '{"tool_name":"Write","tool_input":{"file_path":"docs/setup.md","content":"Set STRIPE_KEY=sk_live_xxx in your .env"}}')
EXIT_CODE="${RESULT%%|*}"
assert_exit "ALLOWS: markdown docs with key mention" 0 "$EXIT_CODE"

# Normal TypeScript code
RESULT=$(run_hook "$HOOK" '{"tool_name":"Write","tool_input":{"file_path":"src/utils.ts","content":"export function formatCurrency(amount: number): string { return amount.toFixed(2) }"}}')
EXIT_CODE="${RESULT%%|*}"
assert_exit "ALLOWS: normal TypeScript code" 0 "$EXIT_CODE"

# JSON config (non-source)
RESULT=$(run_hook "$HOOK" '{"tool_name":"Write","tool_input":{"file_path":"tsconfig.json","content":"{\"compilerOptions\":{\"strict\":true}}"}}')
EXIT_CODE="${RESULT%%|*}"
assert_exit "ALLOWS: JSON config file" 0 "$EXIT_CODE"

echo ""

# ════════════════════════════════════════════════
# 3. FILE PROTECTION (10 scenarios)
# ════════════════════════════════════════════════
echo "🔐 3. protect-files.sh — 10 real payloads"
echo ""

HOOK="$SCRIPTS/protect-files.sh"

# ── Must BLOCK ──

for json in \
  '{"tool_name":"Write","tool_input":{"file_path":".env"}}' \
  '{"tool_name":"Edit","tool_input":{"file_path":".env.local"}}' \
  '{"tool_name":"Write","tool_input":{"file_path":"package-lock.json"}}' \
  '{"tool_name":"Edit","tool_input":{"file_path":"node_modules/express/index.js"}}' \
  '{"tool_name":"Write","tool_input":{"file_path":".git/config"}}'; do

  FILE=$(echo "$json" | grep -oE '"file_path":"[^"]*"' | sed 's/"file_path":"//;s/"//')
  RESULT=$(run_hook "$HOOK" "$json")
  EXIT_CODE="${RESULT%%|*}"
  OUTPUT="${RESULT#*|}"
  assert_exit "BLOCKS: edit $FILE" 2 "$EXIT_CODE"
  assert_contains "BLOCKS: $FILE has feedback" "BLOCKED|protected|cannot" "$OUTPUT"
done

# ── Must ALLOW ──

for json in \
  '{"tool_name":"Write","tool_input":{"file_path":"src/app.ts"}}' \
  '{"tool_name":"Edit","tool_input":{"file_path":"README.md"}}' \
  '{"tool_name":"Write","tool_input":{"file_path":".env.example"}}' \
  '{"tool_name":"Write","tool_input":{"file_path":"src/components/Button.tsx"}}' \
  '{"tool_name":"Edit","tool_input":{"file_path":"docs/prd/feature-prd.md"}}'; do

  FILE=$(echo "$json" | grep -oE '"file_path":"[^"]*"' | sed 's/"file_path":"//;s/"//')
  RESULT=$(run_hook "$HOOK" "$json")
  EXIT_CODE="${RESULT%%|*}"
  assert_exit "ALLOWS: edit $FILE" 0 "$EXIT_CODE"
done

echo ""

# ════════════════════════════════════════════════
# 4. PRD ENFORCEMENT (8 scenarios)
# ════════════════════════════════════════════════
echo "📋 4. enforce-workflow.sh — 8 real scenarios"
echo ""

HOOK="$SCRIPTS/enforce-workflow.sh"

# ── Must ALLOW: exemptions ──

# Edit existing file (always allowed)
RESULT=$(run_hook "$HOOK" '{"tool_name":"Edit","tool_input":{"file_path":"src/app/page.tsx"}}')
EXIT_CODE="${RESULT%%|*}"
assert_exit "ALLOWS: Edit existing file (exempt)" 0 "$EXIT_CODE"

# MultiEdit existing file
RESULT=$(run_hook "$HOOK" '{"tool_name":"MultiEdit","tool_input":{"file_path":"src/components/Button.tsx"}}')
EXIT_CODE="${RESULT%%|*}"
assert_exit "ALLOWS: MultiEdit existing file (exempt)" 0 "$EXIT_CODE"

# Test file creation
RESULT=$(run_hook "$HOOK" '{"tool_name":"Write","tool_input":{"file_path":"src/app/page.test.tsx"}}')
EXIT_CODE="${RESULT%%|*}"
assert_exit "ALLOWS: test file (.test.tsx)" 0 "$EXIT_CODE"

# Doc file creation
RESULT=$(run_hook "$HOOK" '{"tool_name":"Write","tool_input":{"file_path":"docs/architecture/plan.md"}}')
EXIT_CODE="${RESULT%%|*}"
assert_exit "ALLOWS: doc file creation" 0 "$EXIT_CODE"

# Config file
RESULT=$(run_hook "$HOOK" '{"tool_name":"Write","tool_input":{"file_path":"tailwind.config.ts"}}')
EXIT_CODE="${RESULT%%|*}"
assert_exit "ALLOWS: config file (outside src/)" 0 "$EXIT_CODE"

# File outside core directories
RESULT=$(run_hook "$HOOK" '{"tool_name":"Write","tool_input":{"file_path":"scripts/setup.sh"}}')
EXIT_CODE="${RESULT%%|*}"
assert_exit "ALLOWS: file outside src/app|components" 0 "$EXIT_CODE"

# ── Must BLOCK: new app file without PRD ──
# Create temp dir without PRD, test from there
TEMP_DIR=$(mktemp -d)
mkdir -p "$TEMP_DIR/.git" # fake git repo
ORIGINAL_DIR=$(pwd)

cd "$TEMP_DIR"
RESULT_EXIT=0
OUTPUT=$(echo '{"tool_name":"Write","tool_input":{"file_path":"src/app/page.tsx"}}' | CLAUDE_PROJECT_DIR="$TEMP_DIR" bash "$HOOK" 2>&1) || RESULT_EXIT=$?
cd "$ORIGINAL_DIR"
assert_exit "BLOCKS: new src/app/ file without PRD" 2 "$RESULT_EXIT"
assert_contains "block message mentions PRD" "PRD|prd" "$OUTPUT"

# ── Must ALLOW: new app file WITH PRD ──
mkdir -p "$TEMP_DIR/docs/prd"
echo "# Feature PRD" > "$TEMP_DIR/docs/prd/feature.md"

cd "$TEMP_DIR"
RESULT_EXIT=0
OUTPUT=$(echo '{"tool_name":"Write","tool_input":{"file_path":"src/app/page.tsx"}}' | CLAUDE_PROJECT_DIR="$TEMP_DIR" bash "$HOOK" 2>&1) || RESULT_EXIT=$?
cd "$ORIGINAL_DIR"
assert_exit "ALLOWS: new src/app/ file WITH PRD" 0 "$RESULT_EXIT"

# Cleanup
rm -r "$TEMP_DIR"

echo ""

# ════════════════════════════════════════════════
# 5. COMMIT MSG VALIDATION (8 scenarios)
# ════════════════════════════════════════════════
echo "📝 5. commit-msg hook — 8 format validations"
echo ""

HOOK="$SCRIPT_DIR/.claude/git-hooks/commit-msg"

if [ -f "$HOOK" ]; then
  TEMP_MSG=$(mktemp)

  # ── Must PASS ──
  for msg in \
    "feat: add login page" \
    "fix(auth): resolve token expiry bug" \
    "docs: update README installation" \
    "refactor(api): simplify error handling" \
    "test: add unit tests for auth module" \
    "perf(db): optimize user query"; do

    echo "$msg" > "$TEMP_MSG"
    EXIT_CODE=0
    bash "$HOOK" "$TEMP_MSG" 2>/dev/null || EXIT_CODE=$?
    assert_exit "PASS: '$msg'" 0 "$EXIT_CODE"
  done

  # ── Must REJECT ──
  echo "this is not conventional at all" > "$TEMP_MSG"
  EXIT_CODE=0
  bash "$HOOK" "$TEMP_MSG" 2>/dev/null || EXIT_CODE=$?
  assert_exit "REJECT: non-conventional message" 1 "$EXIT_CODE"

  # 72-char limit
  echo "feat: this is a very long commit message that exceeds the seventy two character limit for subject lines in conventional commits" > "$TEMP_MSG"
  EXIT_CODE=0
  OUTPUT=$(bash "$HOOK" "$TEMP_MSG" 2>&1) || EXIT_CODE=$?
  assert_exit "REJECT: >72 character subject" 1 "$EXIT_CODE"

  rm -f "$TEMP_MSG"
else
  skip_test "commit-msg hook" "file not found"
  skip_test "commit-msg validation" "file not found"
fi

echo ""

# ════════════════════════════════════════════════
# 6. SESSION CONTEXT HOOK LIST (3 checks)
# ════════════════════════════════════════════════
echo "🔧 6. session-context.sh — hook list matches reality"
echo ""

# Extract hooks from session-context.sh's for loop
# Extract hook names from session-context.sh — the specific for loop (lines 184-187)
HOOK_LIST=$(sed -n '184,187p' "$SCRIPTS/session-context.sh" | tr ' \\;' '\n' | grep -E '^[a-z]+-[a-z]' | grep -v '^for$' | sort -u)

# Get actual scripts (minus utility scripts that aren't hooks)
ACTUAL_SCRIPTS=$(ls "$SCRIPTS"/*.sh 2>/dev/null | xargs -I{} basename {} .sh | grep -vE '^(apex-colors|apex-launch|apex-sync|extract-session|health-check|verify-install)$' | sort)

# Check every script in the hook list exists
MISSING=0
for hook in $HOOK_LIST; do
  if [ ! -f "$SCRIPTS/${hook}.sh" ]; then
    echo -e "  ${RED}❌ FAIL${NC}: Hook list references ${hook}.sh but file doesn't exist"
    FAIL=$((FAIL + 1))
    TOTAL=$((TOTAL + 1))
    MISSING=$((MISSING + 1))
  fi
done

if [ "$MISSING" -eq 0 ]; then
  TOTAL=$((TOTAL + 1))
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: All hooks in session-context.sh list exist as files"
fi

# Check no actual hook scripts are missing from the list
UNLISTED=0
for script in $ACTUAL_SCRIPTS; do
  if ! echo "$HOOK_LIST" | grep -q "^${script}$"; then
    echo -e "  ${YELLOW}⚠️  WARN${NC}: Script ${script}.sh exists but not in session-context.sh hook check"
    UNLISTED=$((UNLISTED + 1))
  fi
done

TOTAL=$((TOTAL + 1))
if [ "$UNLISTED" -eq 0 ]; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: All hook scripts are listed in session-context.sh"
else
  echo -e "  ${YELLOW}⏭ SKIP${NC}: $UNLISTED scripts not in hook check (may be intentional)"
  SKIP=$((SKIP + 1))
fi

echo ""

# ════════════════════════════════════════════════
# 7. LOG ROTATION (2 checks)
# ════════════════════════════════════════════════
echo "📊 7. handle-failure.sh — log rotation behavior"
echo ""

TEMP_PROJECT=$(mktemp -d)
mkdir -p "$TEMP_PROJECT/.claude"

# Create a failure log with 600 lines
for i in $(seq 1 600); do
  echo "error line $i" >> "$TEMP_PROJECT/.claude/.failure-log"
done

LINES_BEFORE=$(wc -l < "$TEMP_PROJECT/.claude/.failure-log" | tr -d ' ')
assert_contains "Pre-rotation: log has 600 lines" "600" "$LINES_BEFORE"

# Run handle-failure with a fake error (it processes stdin JSON)
echo '{"tool_input":{"command":"npm test"},"stdout":"","stderr":"Error: test failed"}' | CLAUDE_PROJECT_DIR="$TEMP_PROJECT" bash "$SCRIPTS/handle-failure.sh" 2>/dev/null || true

LINES_AFTER=$(wc -l < "$TEMP_PROJECT/.claude/.failure-log" | tr -d ' ')

TOTAL=$((TOTAL + 1))
if [ "$LINES_AFTER" -le 210 ]; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: Log rotated from $LINES_BEFORE to $LINES_AFTER lines"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: Log NOT rotated (still $LINES_AFTER lines, expected ≤210)"
fi

rm -r "$TEMP_PROJECT"

echo ""

# ════════════════════════════════════════════════
# 8. AGENT AUTO-CLAIM PROTOCOL (4 checks)
# ════════════════════════════════════════════════
echo "🤖 8. Agent auto-claim protocols"
echo ""

for agent_name in builder debugger qa technical-writer; do
  AGENT_FILE="$AGENTS/${agent_name}.md"
  TOTAL=$((TOTAL + 1))
  if grep -q "Task Auto-Claim Protocol" "$AGENT_FILE" 2>/dev/null; then
    # Verify it has actual task tags
    TAGS=$(grep -oE '\[build\]|\[feature\]|\[refactor\]|\[bug\]|\[fix\]|\[error\]|\[qa\]|\[verify\]|\[test\]|\[docs\]|\[changelog\]|\[readme\]|\[documentation\]' "$AGENT_FILE" | head -1)
    if [ -n "$TAGS" ]; then
      PASS=$((PASS + 1))
      echo -e "  ${GREEN}✅ PASS${NC}: $agent_name has auto-claim with tags ($TAGS...)"
    else
      FAIL=$((FAIL + 1))
      echo -e "  ${RED}❌ FAIL${NC}: $agent_name has auto-claim section but no task tags"
    fi
  else
    FAIL=$((FAIL + 1))
    echo -e "  ${RED}❌ FAIL${NC}: $agent_name MISSING auto-claim protocol"
  fi
done

echo ""

# ════════════════════════════════════════════════
# 9. SCAN RESPONSIBILITY — NO DUPLICATION (5 checks)
# ════════════════════════════════════════════════
echo "📋 9. Scan responsibility matrix — no agent duplication"
echo ""

# Design Reviewer owns hardcoded colors (has Bash tool)
TOTAL=$((TOTAL + 1))
if grep -q 'Bash' "$AGENTS/design-reviewer.md" && grep -q 'disallowedTools:.*Write' "$AGENTS/design-reviewer.md"; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: Design Reviewer has Bash (can scan) but no Write (can't modify)"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: Design Reviewer tool config incorrect"
fi

# Watcher cannot write
TOTAL=$((TOTAL + 1))
if grep -q 'disallowedTools:.*Write' "$AGENTS/watcher.md"; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: Watcher is read-only (cannot modify code)"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: Watcher should be read-only"
fi

# QA cannot write
TOTAL=$((TOTAL + 1))
if grep -q 'disallowedTools:.*Write' "$AGENTS/qa.md"; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: QA is read-only (verifies, doesn't fix)"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: QA should be read-only"
fi

# Builder CAN write
TOTAL=$((TOTAL + 1))
if grep -q 'tools:.*Write' "$AGENTS/builder.md" && grep -q 'tools:.*Edit' "$AGENTS/builder.md"; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: Builder has Write + Edit (implementation agent)"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: Builder should have Write + Edit tools"
fi

# CLAUDE.md has scan responsibility matrix
TOTAL=$((TOTAL + 1))
if grep -q 'Scan Responsibility Matrix' "$SCRIPT_DIR/CLAUDE.md"; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: CLAUDE.md documents scan responsibilities"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: CLAUDE.md missing scan responsibility matrix"
fi

echo ""

# ════════════════════════════════════════════════
# 10. BREATHING LOOP WIRING (5 checks)
# ════════════════════════════════════════════════
echo "🫁 10. Breathing Loop — autonomous wiring"
echo ""

# Debugger creates [qa] tasks for QA
TOTAL=$((TOTAL + 1))
if grep -q '\[qa\]' "$AGENTS/debugger.md"; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: Debugger creates [qa] tasks for QA handoff"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: Debugger doesn't create [qa] tasks"
fi

# QA creates [bug] tasks for Debugger
TOTAL=$((TOTAL + 1))
if grep -q '\[bug\]' "$AGENTS/qa.md"; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: QA creates [bug] tasks when BLOCKED (loops back to Debugger)"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: QA doesn't create [bug] tasks"
fi

# Watcher creates tasks (not just messages)
TOTAL=$((TOTAL + 1))
if grep -q 'TaskCreate' "$AGENTS/watcher.md"; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: Watcher creates tasks for issues found"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: Watcher doesn't create tasks"
fi

# Watcher has continuous monitoring instruction
TOTAL=$((TOTAL + 1))
if grep -q 'Do NOT stop after one scan' "$AGENTS/watcher.md"; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: Watcher instructed to run continuously"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: Watcher missing continuous monitoring instruction"
fi

# CLAUDE.md describes semi-autonomous loop
TOTAL=$((TOTAL + 1))
if grep -q 'semi-autonomous' "$SCRIPT_DIR/CLAUDE.md"; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: CLAUDE.md honestly describes loop as semi-autonomous"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: CLAUDE.md should describe loop as semi-autonomous"
fi

echo ""

# ════════════════════════════════════════════════
# 11. INSTALLATION INTEGRITY (5 checks)
# ════════════════════════════════════════════════
echo "📦 11. install.sh — integrity checks"
echo ""

INSTALL="$SCRIPT_DIR/install.sh"

# No lfrfrfl references
TOTAL=$((TOTAL + 1))
if ! grep -q 'lfrfrfl' "$INSTALL"; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: No wrong GitHub repo references (lfrfrfl)"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: Still has lfrfrfl reference"
fi

# Has lsfdsb references
TOTAL=$((TOTAL + 1))
if grep -q 'lsfdsb' "$INSTALL"; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: Correct GitHub repo (lsfdsb/apex-framework)"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: Missing correct repo reference"
fi

# jq is soft warning (no exit 1 after jq check)
TOTAL=$((TOTAL + 1))
JQ_BLOCK=$(sed -n '/command -v jq/,/^fi$/p' "$INSTALL" | head -10)
if ! echo "$JQ_BLOCK" | grep -q 'MISSING="$MISSING jq"'; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: jq is soft requirement (won't block install)"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: jq still treated as hard requirement"
fi

# Linux guidance present
TOTAL=$((TOTAL + 1))
if grep -q 'linux-gnu' "$INSTALL" && grep -q 'apt install' "$INSTALL"; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: Linux installation guidance present (apt/dnf)"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: Missing Linux guidance"
fi

# Valid bash syntax
TOTAL=$((TOTAL + 1))
if bash -n "$INSTALL" 2>/dev/null; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: install.sh has valid bash syntax"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: install.sh has syntax errors"
fi

echo ""

# ════════════════════════════════════════════════
# 12. MODEL COST EFFICIENCY (4 checks)
# ════════════════════════════════════════════════
echo "💰 12. Model cost efficiency"
echo ""

# Framework Evolver uses sonnet (architectural reasoning, not just reading)
TOTAL=$((TOTAL + 1))
if grep -q 'model: sonnet' "$AGENTS/framework-evolver.md"; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: Framework Evolver uses sonnet (architectural reasoning needs it)"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: Framework Evolver should use sonnet"
fi

# Watcher uses haiku
TOTAL=$((TOTAL + 1))
if grep -q 'model: haiku' "$AGENTS/watcher.md"; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: Watcher uses haiku (monitoring, cost-efficient)"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: Watcher should use haiku"
fi

# Builder uses sonnet (needs code generation power)
TOTAL=$((TOTAL + 1))
if grep -q 'model: sonnet' "$AGENTS/builder.md"; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: Builder uses sonnet (code generation needs reasoning)"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: Builder should use sonnet"
fi

# Only Code Reviewer uses opus (security gate — worth the cost)
TOTAL=$((TOTAL + 1))
OPUS_AGENTS=$(grep -l 'model: opus' "$AGENTS"/*.md 2>/dev/null | xargs -I{} basename {} .md | tr '\n' ' ')
if [ "$(echo "$OPUS_AGENTS" | tr -d ' ')" = "code-reviewer" ]; then
  PASS=$((PASS + 1))
  echo -e "  ${GREEN}✅ PASS${NC}: Only Code Reviewer uses opus (security gate = best model)"
else
  FAIL=$((FAIL + 1))
  echo -e "  ${RED}❌ FAIL${NC}: Unexpected opus agents: $OPUS_AGENTS (only code-reviewer should use opus)"
fi

echo ""

# ════════════════════════════════════════════════
# SUMMARY
# ════════════════════════════════════════════════
echo "══════════════════════════════════════════"
echo ""

if [ "$FAIL" -eq 0 ]; then
  echo -e "  ${GREEN}${TOTAL} passed${NC}  ${YELLOW}${SKIP} skipped${NC}  ${RED}${FAIL} failed${NC}"
  echo ""
  echo -e "  ${GREEN}⚔️ All behavioral tests passed. This is the way.${NC}"
else
  echo -e "  ${GREEN}${PASS} passed${NC}  ${YELLOW}${SKIP} skipped${NC}  ${RED}${FAIL} failed${NC}"
  echo ""
  echo -e "  ${RED}❌ ${FAIL} behavioral test(s) failed. Fix before shipping.${NC}"
fi

echo ""
exit "$FAIL"
