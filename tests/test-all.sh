#!/bin/bash
# test-all.sh — Run all APEX test suites with categorized summary
#
# by L.B. & Claude · São Paulo, 2026

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RED='\033[0;31m'; GREEN='\033[0;32m'; DIM='\033[0;90m'; BOLD='\033[1m'; NC='\033[0m'

echo ""
echo -e "  ${BOLD}APEX Full Test Suite${NC}"
echo -e "  ${DIM}──────────────────────────────────────${NC}"
echo ""

TOTAL_PASS=0
TOTAL_FAIL=0
SUITE_RESULTS=""
START_TIME=$(date +%s)

run_suite() {
  local name="$1" script="$2"
  if [ ! -f "$script" ]; then
    echo -e "  ${DIM}· $name${NC} (not found)"
    return
  fi

  local output exit_code
  output=$(bash "$script" 2>&1)
  exit_code=$?

  # Extract pass/fail counts from output
  local passed failed
  passed=$(echo "$output" | grep -oE '[0-9]+ passed|Pass: [0-9]+' | head -1 | grep -oE '[0-9]+')
  failed=$(echo "$output" | grep -oE '[0-9]+ failed|Fail: [0-9]+' | head -1 | grep -oE '[0-9]+')
  [ -z "$passed" ] && passed=0
  [ -z "$failed" ] && failed=0

  TOTAL_PASS=$((TOTAL_PASS + passed))
  TOTAL_FAIL=$((TOTAL_FAIL + failed))

  if [ "$exit_code" -eq 0 ]; then
    echo -e "  ${GREEN}✓${NC} $name  ${DIM}${passed} passed${NC}"
  else
    echo -e "  ${RED}✗${NC} $name  ${GREEN}${passed} passed${NC}  ${RED}${failed} failed${NC}"
  fi

  SUITE_RESULTS="${SUITE_RESULTS}${name}:${passed}:${failed}:${exit_code}\n"
}

# Run all suites
run_suite "Framework"    "$SCRIPT_DIR/test-framework.sh"
run_suite "Hooks"        "$SCRIPT_DIR/test-hooks.sh"
run_suite "Agents"       "$SCRIPT_DIR/test-agents.sh"
run_suite "Behavioral"   "$SCRIPT_DIR/test-behavioral-v2.sh"

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

TOTAL=$((TOTAL_PASS + TOTAL_FAIL))

echo ""
echo -e "  ${DIM}──────────────────────────────────────${NC}"
echo ""
echo -e "  ${DIM}Total${NC}  $TOTAL tests across $(echo -e "$SUITE_RESULTS" | grep -c ':') suites"
echo -e "  ${DIM}Time${NC}   ${DURATION}s"
echo ""

if [ "$TOTAL_FAIL" -gt 0 ]; then
  echo -e "  ${GREEN}$TOTAL_PASS passed${NC}  ${RED}$TOTAL_FAIL failed${NC}"
  echo ""
  echo -e "  ${RED}Some tests failed.${NC}"
  echo ""
  exit 1
else
  echo -e "  ${GREEN}$TOTAL_PASS passed${NC}"
  echo ""
  echo -e "  ${GREEN}All tests passed.${NC}"
  echo ""
  exit 0
fi
