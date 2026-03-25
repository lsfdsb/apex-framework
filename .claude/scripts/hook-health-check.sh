#!/bin/bash
# hook-health-check.sh — APEX Hook Anti-Pattern Detector
# Scans all .claude/scripts/*.sh files for patterns that can hang or crash Claude Code.
#
# Background: Two bugs broke sessions silently:
#   1. nohup ... & without < /dev/null — child inherits Claude's stdout pipe, hook never closes
#   2. kill $PID without checking process type — killed Claude's own hook scripts
#
# Usage (standalone):  bash .claude/scripts/hook-health-check.sh
# Usage (from agent):  bash "$CLAUDE_DIR/scripts/hook-health-check.sh"
# Called by:           /self-test skill, sentinel agent
#
# Exit: 0 if clean, 1 if any warnings or errors found
# by L.B. & Claude · São Paulo, 2026

# ── Locate scripts dir ──
if [ -n "${CLAUDE_PROJECT_DIR:-}" ]; then
  PROJECT_DIR="$CLAUDE_PROJECT_DIR"
elif git rev-parse --show-toplevel &>/dev/null 2>&1; then
  PROJECT_DIR="$(git rev-parse --show-toplevel)"
else
  PROJECT_DIR="$(pwd)"
fi

SCRIPTS_DIR="$PROJECT_DIR/.claude/scripts"
SETTINGS_FILE="$PROJECT_DIR/.claude/settings.json"

# ── Colors (only when writing to a terminal) ──
if [ -t 1 ]; then
  GREEN='\033[0;32m' YELLOW='\033[1;33m' RED='\033[0;31m'
  BOLD='\033[1m' DIM='\033[2m' NC='\033[0m'
else
  GREEN='' YELLOW='' RED='' BOLD='' DIM='' NC=''
fi

WARNINGS=0
ERRORS=0
CLEAN=0

# ── Helpers ──
emit_ok()   { echo -e "  ${GREEN}ok${NC}  $1"; CLEAN=$((CLEAN + 1)); }
emit_warn() { echo -e "  ${YELLOW}WARN${NC} $1"; WARNINGS=$((WARNINGS + 1)); }
emit_err()  { echo -e "  ${RED}ERR${NC}  $1"; ERRORS=$((ERRORS + 1)); }

echo ""
echo -e "  ${BOLD}Hook Health Check${NC}"
echo "  ────────────────────────────────────────────────"

# ── Bail early if scripts dir is missing ──
if [ ! -d "$SCRIPTS_DIR" ]; then
  echo -e "  ${RED}scripts/ directory not found: $SCRIPTS_DIR${NC}"
  exit 1
fi

SCRIPT_FILES=("$SCRIPTS_DIR"/*.sh)
TOTAL=${#SCRIPT_FILES[@]}
echo -e "  ${DIM}Scanning $TOTAL scripts in $SCRIPTS_DIR${NC}"
echo ""

# ── Collect SessionEnd/Stop hook scripts for Pattern D ──
STDIN_HOOKS=""
if [ -f "$SETTINGS_FILE" ] && command -v jq &>/dev/null; then
  # Extract script paths wired to SessionStop or PostToolUse (Stop) events
  STDIN_HOOKS=$(jq -r '
    .hooks // {} |
    to_entries[] |
    select(.key | test("SessionStop|Stop|SessionEnd"; "i")) |
    .value[].hooks[]? |
    select(type == "string")
  ' "$SETTINGS_FILE" 2>/dev/null | xargs -I{} basename {} 2>/dev/null || true)
fi

# ── Scan each script ──
for script_path in "${SCRIPT_FILES[@]}"; do
  [ -f "$script_path" ] || continue
  name=$(basename "$script_path")
  issues=0

  # ── Pattern A: background process without stdin drain ──
  # Match lines ending in & (backgrounded) that contain nohup or a command
  # but do NOT have < /dev/null before the &
  while IFS= read -r match; do
    lineno=$(echo "$match" | cut -d: -f1)
    content=$(echo "$match" | cut -d: -f2-)
    # Skip comment lines
    trimmed="${content#"${content%%[! ]*}"}"
    [[ "$trimmed" == \#* ]] && continue
    # Check if < /dev/null is present anywhere on the same line
    if ! echo "$content" | grep -q '< /dev/null'; then
      emit_warn "${name}:${lineno} — background process without \`< /dev/null\` (Pattern A)"
      emit_warn "         Child will inherit Claude's stdout pipe, keeping hook open forever"
      emit_warn "         Fix: add \`< /dev/null\` before the \`&\`"
      issues=$((issues + 1))
    fi
  done < <(grep -n '&[[:space:]]*$\|nohup.*&' "$script_path" 2>/dev/null | grep -v '^\s*#\|emit_\|echo\|printf')

  # ── Pattern B: kill without process type guard ──
  # Look for bare kill "$PID" or kill $PID lines
  while IFS= read -r match; do
    lineno=$(echo "$match" | cut -d: -f1)
    content=$(echo "$match" | cut -d: -f2-)
    trimmed="${content#"${content%%[! ]*}"}"
    [[ "$trimmed" == \#* ]] && continue
    # Acceptable if the script has a ps -o comm= guard anywhere in the 10 lines above
    # We check the whole file for a ps guard near any kill — a coarse but fast heuristic
    if ! grep -q 'ps.*-o.*comm\|ps.*-p.*-o\|PROC_CMD\|proc_cmd' "$script_path" 2>/dev/null; then
      emit_err "${name}:${lineno} — kill without process-type verification (Pattern B)"
      emit_err "         Killing an unknown PID may terminate Claude's own hook processes"
      emit_err "         Fix: check PROC_CMD=\$(ps -p \"\$PID\" -o comm=) before kill"
      issues=$((issues + 1))
    fi
  done < <(grep -n 'kill[[:space:]]\+"\?\$[A-Z_]*PID\b' "$script_path" 2>/dev/null)

  # ── Pattern C: long sleep in hook scripts ──
  while IFS= read -r match; do
    lineno=$(echo "$match" | cut -d: -f1)
    content=$(echo "$match" | cut -d: -f2-)
    trimmed="${content#"${content%%[! ]*}"}"
    [[ "$trimmed" == \#* ]] && continue
    # Extract the sleep value
    sleep_val=$(echo "$content" | grep -oE 'sleep[[:space:]]+([0-9]+)' | grep -oE '[0-9]+$')
    if [ -n "$sleep_val" ] && [ "$sleep_val" -gt 3 ] 2>/dev/null; then
      emit_warn "${name}:${lineno} — sleep ${sleep_val}s may cause hook timeout (Pattern C)"
      emit_warn "         Hooks must complete quickly; long sleeps block Claude Code responses"
      emit_warn "         Fix: reduce to \`sleep 0.5\` polling loops or background the wait"
      issues=$((issues + 1))
    fi
  done < <(grep -n 'sleep[[:space:]]\+[0-9]' "$script_path" 2>/dev/null)

  # ── Pattern D: SessionEnd/Stop hooks that may not drain stdin ──
  if echo "$STDIN_HOOKS" | grep -q "^${name}$" 2>/dev/null; then
    if ! grep -qE 'cat[[:space:]]|read[[:space:]]|/dev/stdin|<&0' "$script_path" 2>/dev/null; then
      emit_warn "${name} — wired to Stop/SessionEnd hook but may not drain stdin (Pattern D)"
      emit_warn "         Large tool payloads on stdin can accumulate and delay shutdown"
      emit_warn "         Fix: add \`cat > /dev/null\` at top if stdin is not needed"
      issues=$((issues + 1))
    fi
  fi

  [ "$issues" -eq 0 ] && emit_ok "$name"
done

# ── Summary ──
echo ""
echo "  ────────────────────────────────────────────────"
TOTAL_ISSUES=$((WARNINGS + ERRORS))
if [ "$TOTAL_ISSUES" -eq 0 ]; then
  echo -e "  ${GREEN}${BOLD}All $CLEAN scripts clean — no hook anti-patterns detected.${NC}"
  echo ""
  exit 0
else
  echo -e "  ${BOLD}Summary: $CLEAN clean · $WARNINGS warning(s) · $ERRORS error(s)${NC}"
  if [ "$ERRORS" -gt 0 ]; then
    echo -e "  ${RED}Errors must be fixed — they will hang or crash Claude Code sessions.${NC}"
  fi
  if [ "$WARNINGS" -gt 0 ]; then
    echo -e "  ${YELLOW}Warnings are high-risk patterns; fix before next deploy.${NC}"
  fi
  echo ""
  exit 1
fi
