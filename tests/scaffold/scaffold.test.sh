#!/usr/bin/env bash
# APEX Scaffold Integration Test
# Runs the scaffold script and verifies all expected files exist.
#
# Usage: tests/scaffold/scaffold.test.sh
#
# NOTE: This test runs `npx next-forge@latest init` which requires
# network access and takes 30-60 seconds. Skip in offline CI.
set -euo pipefail

TEST_DIR="/tmp/apex-scaffold-test-$$"
SCRIPT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
PASS=0
FAIL=0

assert_file() {
  if [ -f "$1" ]; then
    echo "  ✓ $1"
    ((PASS++))
  else
    echo "  ✗ $1 NOT FOUND"
    ((FAIL++))
  fi
}

assert_dir() {
  if [ -d "$1" ]; then
    echo "  ✓ $1/"
    ((PASS++))
  else
    echo "  ✗ $1/ NOT FOUND"
    ((FAIL++))
  fi
}

assert_no_match() {
  local pattern="$1"
  local dir="$2"
  local matches
  matches=$(grep -r "$pattern" "$dir" --include="*.ts" --include="*.tsx" --include="*.json" -l 2>/dev/null | grep -v node_modules | grep -v package-lock.json | grep -v bun.lock | wc -l | tr -d ' ')
  if [ "$matches" -eq 0 ]; then
    echo "  ✓ No '$pattern' references in $dir"
    ((PASS++))
  else
    echo "  ✗ Found $matches files with '$pattern' in $dir"
    ((FAIL++))
  fi
}

cleanup() {
  rm -rf "$TEST_DIR"
}
trap cleanup EXIT

echo "⚔️  APEX Scaffold Integration Test"
echo "  Test dir: $TEST_DIR"
echo "  Framework: $SCRIPT_DIR"
echo ""

# Run scaffold
cd /tmp
"$SCRIPT_DIR/bin/apex-scaffold" "$(basename "$TEST_DIR")"

cd "$TEST_DIR"

# Verify APEX framework files
echo ""
echo "📋 Checking APEX framework injection..."
assert_dir ".claude"
assert_dir ".claude/skills"
assert_dir ".claude/agents"
assert_file "CLAUDE.md"

# Verify app-level CLAUDE.md
echo ""
echo "📋 Checking app-level CLAUDE.md..."
for dir in apps/*/; do
  assert_file "${dir}CLAUDE.md"
done

# Verify CLAUDE.md line count (all under 45 lines)
echo ""
echo "📋 Checking CLAUDE.md sizes..."
for f in apps/*/CLAUDE.md; do
  LINES=$(wc -l < "$f")
  if [ "$LINES" -le 45 ]; then
    echo "  ✓ $f ($LINES lines ≤ 45)"
    ((PASS++))
  else
    echo "  ✗ $f ($LINES lines > 45)"
    ((FAIL++))
  fi
done

# Verify Design DNA tokens
echo ""
echo "📋 Checking Design DNA wiring..."
assert_dir "packages/design-system/tokens"
assert_dir "packages/design-system/tokens/palettes"
assert_file "packages/design-system/tokens/foundation.css"
assert_file "packages/design-system/tokens/bridge.css"
assert_file "packages/design-system/tokens/index.ts"

# Verify @repo/ → @apex/ rename
echo ""
echo "📋 Checking @apex/ namespace..."
assert_no_match "@repo/" "apps"
assert_no_match "@repo/" "packages"

# Results
echo ""
echo "═══════════════════════════════════════════"
echo "  PASS: $PASS  FAIL: $FAIL"
echo "═══════════════════════════════════════════"

[ "$FAIL" -eq 0 ] && echo "✓ All tests passed — This is the Way." || { echo "✗ $FAIL tests failed"; exit 1; }
