#!/bin/bash
# helpers.sh — Shared test utilities for APEX test suites
RED='\033[0;31m'; GREEN='\033[0;32m'; DIM='\033[0;90m'; BOLD='\033[1m'; NC='\033[0m'
PASS=0; FAIL=0; TOTAL=0; S_COUNT=0; B_COUNT=0; I_COUNT=0; R_COUNT=0

pass() { TOTAL=$((TOTAL+1)); PASS=$((PASS+1)); echo -e "  ${GREEN}✓${NC} $1"; }
fail() { TOTAL=$((TOTAL+1)); FAIL=$((FAIL+1)); echo -e "  ${RED}✗${NC} $1"; }
section() { echo ""; echo -e "  ${BOLD}$1${NC}"; echo -e "  ${DIM}──────────────────────────────────────${NC}"; }

assert_file_exists() { S_COUNT=$((S_COUNT+1)); [ -f "$1" ] && pass "${2:-$(basename "$1") exists}" || fail "${2:-$(basename "$1") missing}"; }
assert_dir_exists() { S_COUNT=$((S_COUNT+1)); [ -d "$1" ] && pass "${2:-$1/ exists}" || fail "${2:-$1/ missing}"; }
assert_file_executable() { S_COUNT=$((S_COUNT+1)); [ -x "$1" ] && pass "${2:-$(basename "$1") executable}" || fail "${2:-$(basename "$1") not executable}"; }
assert_file_contains() { S_COUNT=$((S_COUNT+1)); grep -q "$2" "$1" 2>/dev/null && pass "${3:-contains pattern}" || fail "${3:-missing: $2}"; }

assert_exit() {
  local name="$1" expected="$2" actual="$3"; B_COUNT=$((B_COUNT+1)); TOTAL=$((TOTAL+1))
  [ "$actual" -eq "$expected" ] && { PASS=$((PASS+1)); echo -e "  ${GREEN}✓${NC} $name"; } || { FAIL=$((FAIL+1)); echo -e "  ${RED}✗${NC} $name (expected $expected, got $actual)"; }
}
assert_output_contains() {
  local name="$1" pattern="$2" output="$3"; B_COUNT=$((B_COUNT+1)); TOTAL=$((TOTAL+1))
  echo "$output" | grep -qi "$pattern" 2>/dev/null && { PASS=$((PASS+1)); echo -e "  ${GREEN}✓${NC} $name"; } || { FAIL=$((FAIL+1)); echo -e "  ${RED}✗${NC} $name (missing: $pattern)"; }
}
assert_valid_json() {
  local name="$1" json="$2"; B_COUNT=$((B_COUNT+1)); TOTAL=$((TOTAL+1))
  echo "$json" | jq . >/dev/null 2>&1 && { PASS=$((PASS+1)); echo -e "  ${GREEN}✓${NC} $name"; } || { FAIL=$((FAIL+1)); echo -e "  ${RED}✗${NC} $name (invalid JSON)"; }
}

assert_http_ok() {
  local name="$1" url="$2"; R_COUNT=$((R_COUNT+1)); TOTAL=$((TOTAL+1))
  local s; s=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
  [ "$s" = "200" ] && { PASS=$((PASS+1)); echo -e "  ${GREEN}✓${NC} $name"; } || { FAIL=$((FAIL+1)); echo -e "  ${RED}✗${NC} $name (HTTP $s)"; }
}
assert_http_json_field() {
  local name="$1" url="$2" field="$3"; R_COUNT=$((R_COUNT+1)); TOTAL=$((TOTAL+1))
  local b; b=$(curl -s "$url" 2>/dev/null)
  echo "$b" | jq -e "$field" >/dev/null 2>&1 && { PASS=$((PASS+1)); echo -e "  ${GREEN}✓${NC} $name"; } || { FAIL=$((FAIL+1)); echo -e "  ${RED}✗${NC} $name (missing: $field)"; }
}
assert_integration() {
  local name="$1" result="$2"; I_COUNT=$((I_COUNT+1)); TOTAL=$((TOTAL+1))
  [ "$result" = "0" ] || [ "$result" = "true" ] && { PASS=$((PASS+1)); echo -e "  ${GREEN}✓${NC} $name"; } || { FAIL=$((FAIL+1)); echo -e "  ${RED}✗${NC} $name"; }
}

print_summary() {
  echo ""; echo -e "  ${DIM}──────────────────────────────────────${NC}"; echo ""
  [ "$S_COUNT" -gt 0 ] && echo -e "  ${DIM}Structural${NC}    $S_COUNT"
  [ "$B_COUNT" -gt 0 ] && echo -e "  ${DIM}Behavioral${NC}    $B_COUNT"
  [ "$I_COUNT" -gt 0 ] && echo -e "  ${DIM}Integration${NC}   $I_COUNT"
  [ "$R_COUNT" -gt 0 ] && echo -e "  ${DIM}Runtime${NC}       $R_COUNT"
  ([ "$S_COUNT" -gt 0 ] || [ "$B_COUNT" -gt 0 ] || [ "$I_COUNT" -gt 0 ] || [ "$R_COUNT" -gt 0 ]) && echo ""
  if [ "$FAIL" -gt 0 ]; then
    echo -e "  ${GREEN}$PASS passed${NC}  ${RED}$FAIL failed${NC}"; echo ""; echo -e "  ${RED}Some tests failed.${NC}"
  else
    echo -e "  ${GREEN}$PASS passed${NC}"; echo ""; echo -e "  ${GREEN}All tests passed.${NC}"
  fi
  echo ""
}
