#!/bin/bash
# perf-hooks.sh — APEX Hook System Performance Profiler
# Measures the runtime of every hook script with representative mock input.
# Runs each script 3 times, reports average, and flags slow scripts.
#
# Usage: bash tests/perf-hooks.sh
# by L.B. & Claude · São Paulo, 2026

set -euo pipefail

# ── Resolve project root ──
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SCRIPTS_DIR="$PROJECT_DIR/.claude/scripts"

export CLAUDE_PROJECT_DIR="$PROJECT_DIR"

# ── Timing precision: nanoseconds on macOS (gdate) or Linux (date) ──
# Falls back to millisecond precision if neither is available.
if command -v gdate &>/dev/null; then
  _now_ns() { gdate +%s%N; }
  _ns_to_ms() { echo "$(( ($1) / 1000000 ))"; }
elif date +%s%N 2>/dev/null | grep -qE '^[0-9]{18,}'; then
  _now_ns() { date +%s%N; }
  _ns_to_ms() { echo "$(( ($1) / 1000000 ))"; }
else
  # Fallback: millisecond precision via python3 or perl
  if command -v python3 &>/dev/null; then
    _now_ns() { python3 -c 'import time; print(int(time.time() * 1e9))'; }
  elif command -v perl &>/dev/null; then
    _now_ns() { perl -MTime::HiRes=time -e 'printf "%d\n", time() * 1e9'; }
  else
    # Last resort: second precision * 1e9
    _now_ns() { echo "$(( $(date +%s) * 1000000000 ))"; }
  fi
  _ns_to_ms() { echo "$(( ($1) / 1000000 ))"; }
fi

# ── Colors (only if terminal) ──
if [ -t 1 ]; then
  BOLD='\033[1m'
  DIM='\033[2m'
  RED='\033[0;31m'
  YELLOW='\033[0;33m'
  GREEN='\033[0;32m'
  CYAN='\033[0;36m'
  NC='\033[0m'
else
  BOLD='' DIM='' RED='' YELLOW='' GREEN='' CYAN='' NC=''
fi

# ── Thresholds (ms) ──
THRESHOLD_INDIVIDUAL=50
THRESHOLD_PER_TOOL=100
THRESHOLD_SESSION_START=500

# ── Temporary dir for mock artifacts ──
TMPDIR_PERF=$(mktemp -d)
trap 'rm -rf "$TMPDIR_PERF"' EXIT

# ── Pre-create files needed by some hooks ──
# handle-failure.sh writes to .claude/.failure-log
mkdir -p "$PROJECT_DIR/.claude"

# Mock JSON payloads ─────────────────────────────────────────────────────────

MOCK_SESSION_START='{"session_id":"perf-test-001","source":"startup"}'

MOCK_BASH_SAFE='{"tool_name":"Bash","tool_input":{"command":"ls -la"}}'

MOCK_BASH_GIT_STATUS='{"tool_name":"Bash","tool_input":{"command":"git status"}}'

MOCK_EDIT_TS='{"tool_name":"Edit","tool_input":{"file_path":"/tmp/perf-test.ts","old_string":"const x = 1","new_string":"const x = 2"}}'

MOCK_WRITE_TS='{"tool_name":"Write","tool_input":{"file_path":"/tmp/perf-test.ts","content":"export const x = 1;"}}'

MOCK_STOP='{"assistant_response":"I have updated the file.","tool_uses":[{"tool_name":"Edit","tool_input":{"file_path":"/tmp/perf-test.ts"}}]}'

MOCK_FAILURE='{"tool_name":"Bash","tool_input":{"command":"npm run build"},"error":"Module not found: Error: Cannot resolve module ./missing"}'

# ── Core timing function ─────────────────────────────────────────────────────
# time_script <script_path> <mock_json> <runs>
# Prints average ms to stdout. Runs script in subshell, discards output.
time_script() {
  local script="$1"
  local input="$2"
  local runs="${3:-3}"
  local total_ns=0
  local i

  for ((i=0; i<runs; i++)); do
    local t0 t1
    t0=$(_now_ns)
    echo "$input" | bash "$script" >/dev/null 2>/dev/null || true
    t1=$(_now_ns)
    total_ns=$(( total_ns + t1 - t0 ))
  done

  local avg_ns=$(( total_ns / runs ))
  _ns_to_ms "$avg_ns"
}

# ── Result formatting ────────────────────────────────────────────────────────
# format_row <name> <ms> — prints a padded row with color warning
format_row() {
  local name="$1"
  local ms="$2"
  local pad=38
  local spaces
  spaces=$(printf '%*s' $(( pad - ${#name} )) '')

  local color="$GREEN"
  local suffix=""
  if [ "$ms" -ge "$THRESHOLD_INDIVIDUAL" ]; then
    color="$RED"
    suffix=" ⚠ SLOW"
  elif [ "$ms" -ge 25 ]; then
    color="$YELLOW"
  fi

  printf "  ${CYAN}%-38s${NC} ${color}%4dms${NC}%s\n" "$name" "$ms" "$suffix"
}

# ── Subtotal formatting ──────────────────────────────────────────────────────
format_subtotal() {
  local ms="$1"
  local threshold="$2"
  local label="${3:-subtotal}"
  local color="$GREEN"
  local suffix=""

  if [ "$ms" -ge "$threshold" ]; then
    color="$RED"
    suffix=" ⚠ EXCEEDS BUDGET"
  fi

  printf "  ${DIM}───────────────────────────────────────────────${NC}\n"
  printf "  ${BOLD}%-38s${NC} ${color}${BOLD}%4dms${NC}%s\n" "--- $label:" "$ms" "$suffix"
  echo ""
}

# ── Section header ───────────────────────────────────────────────────────────
section() {
  printf "\n${BOLD}${CYAN}%s${NC}\n" "$1"
}

# ════════════════════════════════════════════════════════════════════════════
# MAIN — run the profile
# ════════════════════════════════════════════════════════════════════════════

echo ""
printf "${BOLD}⚔  APEX Hook Performance Profile${NC}\n"
printf "${DIM}═══════════════════════════════════════════════════${NC}\n"
printf "${DIM}Runs per script: 3 (average reported)${NC}\n"
printf "${DIM}Project: %s${NC}\n" "$PROJECT_DIR"
echo ""

# ── SessionStart hooks ───────────────────────────────────────────────────────
section "SessionStart hooks:"

# auto-update.sh: expects no stdin but reads CLAUDE_PROJECT_DIR.
# The update check skips early if checked recently (LAST_CHECK_FILE).
# We mock by providing empty stdin — the script handles this gracefully.
T_AUTO_UPDATE=$(time_script "$SCRIPTS_DIR/auto-update.sh" "" 3)
format_row "auto-update.sh" "$T_AUTO_UPDATE"

# session-context.sh: reads JSON with .source field
T_SESSION_CTX=$(time_script "$SCRIPTS_DIR/session-context.sh" "$MOCK_SESSION_START" 3)
format_row "session-context.sh" "$T_SESSION_CTX"

# dev-server.sh: checks for package.json, exits early if no project.
# Pass empty stdin.
T_DEV_SERVER=$(time_script "$SCRIPTS_DIR/dev-server.sh" "" 3)
format_row "dev-server.sh" "$T_DEV_SERVER"

# manifest-generate.sh: reads CLAUDE_PROJECT_DIR, outputs JSON.
T_MANIFEST=$(time_script "$SCRIPTS_DIR/manifest-generate.sh" "" 3)
format_row "manifest-generate.sh" "$T_MANIFEST"

SESSION_TOTAL=$(( T_AUTO_UPDATE + T_SESSION_CTX + T_DEV_SERVER + T_MANIFEST ))
format_subtotal "$SESSION_TOTAL" "$THRESHOLD_SESSION_START" "subtotal"

# ── PreToolUse hooks — Bash ──────────────────────────────────────────────────
section "PreToolUse hooks (Bash):"

# block-dangerous-commands.sh: parses .tool_input.command
T_BLOCK=$(time_script "$SCRIPTS_DIR/block-dangerous-commands.sh" "$MOCK_BASH_SAFE" 3)
format_row "block-dangerous-commands.sh" "$T_BLOCK"

BASH_PRE_TOTAL=$T_BLOCK
format_subtotal "$BASH_PRE_TOTAL" "$THRESHOLD_PER_TOOL" "subtotal"

# ── PreToolUse hooks — Edit|Write|MultiEdit ──────────────────────────────────
section "PreToolUse hooks (Edit/Write):"

# protect-files.sh: parses .tool_name and .tool_input.file_path
T_PROTECT=$(time_script "$SCRIPTS_DIR/protect-files.sh" "$MOCK_EDIT_TS" 3)
format_row "protect-files.sh" "$T_PROTECT"

# enforce-workflow.sh: parses .tool_name and .tool_input.file_path
T_ENFORCE=$(time_script "$SCRIPTS_DIR/enforce-workflow.sh" "$MOCK_WRITE_TS" 3)
format_row "enforce-workflow.sh" "$T_ENFORCE"

# scan-security-patterns.sh: parses .tool_name, .tool_input.file_path, .tool_input.new_string
T_SCAN=$(time_script "$SCRIPTS_DIR/scan-security-patterns.sh" "$MOCK_EDIT_TS" 3)
format_row "scan-security-patterns.sh" "$T_SCAN"

EDIT_PRE_TOTAL=$(( T_PROTECT + T_ENFORCE + T_SCAN ))
format_subtotal "$EDIT_PRE_TOTAL" "$THRESHOLD_PER_TOOL" "subtotal"

# ── PostToolUse hooks — Bash ─────────────────────────────────────────────────
section "PostToolUse hooks (Bash):"

# auto-changelog.sh: parses .tool_input.command; exits early on non-commit
T_CHANGELOG=$(time_script "$SCRIPTS_DIR/auto-changelog.sh" "$MOCK_BASH_SAFE" 3)
format_row "auto-changelog.sh" "$T_CHANGELOG"

# worktree-cleanup.sh: parses .tool_input.command; exits early on non-worktree cmd
T_WORKTREE=$(time_script "$SCRIPTS_DIR/worktree-cleanup.sh" "$MOCK_BASH_SAFE" 3)
format_row "worktree-cleanup.sh" "$T_WORKTREE"

BASH_POST_TOTAL=$(( T_CHANGELOG + T_WORKTREE ))
format_subtotal "$BASH_POST_TOTAL" "$THRESHOLD_PER_TOOL" "subtotal"

# ── PostToolUse hooks — Edit|Write ───────────────────────────────────────────
section "PostToolUse hooks (Edit/Write):"

# validate-framework.sh: parses .tool_input.file_path; exits early on non-.claude/ paths
T_VALIDATE=$(time_script "$SCRIPTS_DIR/validate-framework.sh" "$MOCK_EDIT_TS" 3)
format_row "validate-framework.sh" "$T_VALIDATE"

EDIT_POST_TOTAL=$T_VALIDATE
format_subtotal "$EDIT_POST_TOTAL" "$THRESHOLD_PER_TOOL" "subtotal"

# ── Stop hooks ───────────────────────────────────────────────────────────────
section "Stop hooks:"

# stop-gate.sh: parses .assistant_response and .tool_uses[]
T_STOP_GATE=$(time_script "$SCRIPTS_DIR/stop-gate.sh" "$MOCK_STOP" 3)
format_row "stop-gate.sh" "$T_STOP_GATE"

# dev-monitor.sh: reads CLAUDE_PROJECT_DIR for PID/log files; exits early if no server
T_DEV_MONITOR=$(time_script "$SCRIPTS_DIR/dev-monitor.sh" "" 3)
format_row "dev-monitor.sh" "$T_DEV_MONITOR"

STOP_TOTAL=$(( T_STOP_GATE + T_DEV_MONITOR ))
format_subtotal "$STOP_TOTAL" "$THRESHOLD_PER_TOOL" "subtotal"

# ── PostToolUseFailure hooks ─────────────────────────────────────────────────
section "PostToolUseFailure hooks (Bash):"

# handle-failure.sh: parses .tool_input.command and .error
T_FAILURE=$(time_script "$SCRIPTS_DIR/handle-failure.sh" "$MOCK_FAILURE" 3)
format_row "handle-failure.sh" "$T_FAILURE"

FAILURE_TOTAL=$T_FAILURE
format_subtotal "$FAILURE_TOTAL" "$THRESHOLD_PER_TOOL" "subtotal"

# ── SessionEnd hooks ─────────────────────────────────────────────────────────
section "SessionEnd hooks:"

# session-cleanup.sh: reads CLAUDE_PROJECT_DIR; kills dev servers, prunes worktrees
T_CLEANUP=$(time_script "$SCRIPTS_DIR/session-cleanup.sh" "$MOCK_SESSION_START" 3)
format_row "session-cleanup.sh" "$T_CLEANUP"

# session-learner.sh: reads .session_id; exits early if transcript not found
T_LEARNER=$(time_script "$SCRIPTS_DIR/session-learner.sh" "$MOCK_SESSION_START" 3)
format_row "session-learner.sh" "$T_LEARNER"

SESSION_END_TOTAL=$(( T_CLEANUP + T_LEARNER ))
format_subtotal "$SESSION_END_TOTAL" "$THRESHOLD_SESSION_START" "subtotal"

# ── Composite costs ──────────────────────────────────────────────────────────
BASH_CALL_TOTAL=$(( BASH_PRE_TOTAL + BASH_POST_TOTAL ))
EDIT_CALL_TOTAL=$(( EDIT_PRE_TOTAL + EDIT_POST_TOTAL ))

printf "${BOLD}${CYAN}Summary:${NC}\n"
printf "  ${DIM}─────────────────────────────────────────────────────${NC}\n"

_summary_row() {
  local label="$1"
  local ms="$2"
  local budget="$3"
  local color="$GREEN"
  local verdict="OK"
  if [ "$ms" -ge "$budget" ]; then
    color="$RED"
    verdict="OVER BUDGET"
  fi
  printf "  ${BOLD}%-36s${NC} ${color}${BOLD}%4dms${NC}  %s\n" "$label" "$ms" "$verdict"
}

_summary_row "Session startup cost:"    "$SESSION_TOTAL"    "$THRESHOLD_SESSION_START"
_summary_row "Per-Bash-call overhead:"  "$BASH_CALL_TOTAL"  "$THRESHOLD_PER_TOOL"
_summary_row "Per-Edit-call overhead:"  "$EDIT_CALL_TOTAL"  "$THRESHOLD_PER_TOOL"
_summary_row "Stop overhead:"           "$STOP_TOTAL"       "$THRESHOLD_PER_TOOL"
_summary_row "Failure handler cost:"    "$FAILURE_TOTAL"    "$THRESHOLD_PER_TOOL"
_summary_row "Session end cost:"        "$SESSION_END_TOTAL" "$THRESHOLD_SESSION_START"

echo ""
printf "  ${DIM}Budgets: SessionStart <${THRESHOLD_SESSION_START}ms  |  Per-tool-call <${THRESHOLD_PER_TOOL}ms  |  Individual script <${THRESHOLD_INDIVIDUAL}ms${NC}\n"
echo ""

# ── Exit code: 0 if all within budget, 1 if any overage ─────────────────────
OVER_BUDGET=0
[ "$SESSION_TOTAL"    -ge "$THRESHOLD_SESSION_START" ] && OVER_BUDGET=1
[ "$BASH_CALL_TOTAL"  -ge "$THRESHOLD_PER_TOOL"      ] && OVER_BUDGET=1
[ "$EDIT_CALL_TOTAL"  -ge "$THRESHOLD_PER_TOOL"      ] && OVER_BUDGET=1
[ "$STOP_TOTAL"       -ge "$THRESHOLD_PER_TOOL"      ] && OVER_BUDGET=1
[ "$FAILURE_TOTAL"    -ge "$THRESHOLD_PER_TOOL"      ] && OVER_BUDGET=1

if [ "$OVER_BUDGET" -eq 0 ]; then
  printf "  ${GREEN}${BOLD}Budget: <${THRESHOLD_PER_TOOL}ms per tool call  All within budget${NC}\n\n"
else
  printf "  ${RED}${BOLD}Budget exceeded — investigate slow scripts above${NC}\n\n"
fi

exit "$OVER_BUDGET"
