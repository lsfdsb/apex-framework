#!/bin/bash
# stop-gate.sh — Stop hook
# Fires when Claude finishes responding. Checks if code was written
# but tests were not run. Uses visual nudges to remind about testing.
#
# Exit 0 = allow. Stdout is added to Claude's context as a reminder.
# by L.B. & Claude · São Paulo, 2026

# jq is required to parse the transcript
if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — stop-gate cannot verify test execution. Install jq: https://jqlang.github.io/jq/download/"
  exit 0
fi

INPUT=$(cat)

# Extract the assistant's last response content
RESPONSE=$(echo "$INPUT" | jq -r '.assistant_response // empty' 2>/dev/null)

# If no response to analyze, skip
if [ -z "$RESPONSE" ]; then
  exit 0
fi

# Detect if code was written or edited
WROTE_CODE=false
if echo "$RESPONSE" | grep -qiE '(Write|Edit|MultiEdit|created file|wrote file|updated file|modified file)'; then
  WROTE_CODE=true
fi

# Also check tool_uses in the response
TOOL_USES=$(echo "$INPUT" | jq -r '.tool_uses[]?.tool_name // empty' 2>/dev/null)
if echo "$TOOL_USES" | grep -qE '^(Write|Edit|MultiEdit)$'; then
  WROTE_CODE=true
fi

if [ "$WROTE_CODE" = false ]; then
  exit 0
fi

# Exempt shell scripts, config files, and docs — no JS/TS tests applicable
WRITTEN_PATHS=$(echo "$INPUT" | jq -r '.tool_uses[]? | select(.tool_name | test("Write|Edit|MultiEdit")) | .tool_input.file_path // empty' 2>/dev/null)
if [ -n "$WRITTEN_PATHS" ]; then
  if ! echo "$WRITTEN_PATHS" | grep -qvE '\.(sh|json|yaml|yml|md|env|toml|cfg)$'; then
    exit 0  # All changes are scripts/config — test nudge doesn't apply
  fi
fi

# Detect if tests were run
TESTS_RAN=false
if echo "$RESPONSE" | grep -qiE '(vitest|jest|playwright|npm test|npm run test|npx vitest|npx playwright|test.*pass|tests? (passed|failed|running)|✅.*test)'; then
  TESTS_RAN=true
fi
if echo "$TOOL_USES" | grep -qE '^Bash$'; then
  BASH_COMMANDS=$(echo "$INPUT" | jq -r '.tool_uses[]? | select(.tool_name == "Bash") | .tool_input.command // empty' 2>/dev/null)
  if echo "$BASH_COMMANDS" | grep -qiE '(vitest|jest|playwright|npm test|npm run test)'; then
    TESTS_RAN=true
  fi
fi

# Detect if this is a test-exempt change (docs, config, minor edit)
EXEMPT=false
if echo "$RESPONSE" | grep -qiE '(documentation|readme|changelog|\.md|comment|typo|formatting|lint fix)'; then
  EXEMPT=true
fi

# ── Proactive /evolve suggestion — track errors across the session ──
ERROR_COUNTER="/tmp/apex-session-errors.count"
TOOL_ERRORS=$(echo "$INPUT" | jq '[.tool_uses[]? | select(.is_error == true)] | length' 2>/dev/null || echo "0")
if [ "$TOOL_ERRORS" -gt 0 ] 2>/dev/null; then
  PREV_COUNT=0
  [ -f "$ERROR_COUNTER" ] && PREV_COUNT=$(cat "$ERROR_COUNTER" 2>/dev/null || echo "0")
  NEW_COUNT=$((PREV_COUNT + TOOL_ERRORS))
  echo "$NEW_COUNT" > "$ERROR_COUNTER"
  # Suggest /evolve at thresholds: 5, 10, 20 errors
  if { [ "$NEW_COUNT" -ge 5 ] && [ "$PREV_COUNT" -lt 5 ]; } || \
     { [ "$NEW_COUNT" -ge 10 ] && [ "$PREV_COUNT" -lt 10 ]; } || \
     { [ "$NEW_COUNT" -ge 20 ] && [ "$PREV_COUNT" -lt 20 ]; }; then
    echo ""
    echo "🔧 APEX detected $NEW_COUNT errors this session. Consider running /evolve to analyze and fix recurring patterns."
    echo ""
  fi
fi

if [ "$WROTE_CODE" = true ] && [ "$TESTS_RAN" = false ] && [ "$EXEMPT" = false ]; then
  echo ""
  echo "┌──────────────────────────────────────────────────────────────┐"
  echo "│  ⚠️ APEX STOP GATE                                          │"
  echo "│                                                              │"
  echo "│  Code was written but no tests were run.                     │"
  echo "│  Our rule: no code ships without tests.                      │"
  echo "│                                                              │"
  echo "│  ➤ Run 'npm run test' or '/qa' before continuing.           │"
  echo "│  ➤ If tests aren't applicable, mention why explicitly.      │"
  echo "│                                                              │"
  echo "│  👶 Grogu says: \"Baba!\" (he wants you to test your code)    │"
  echo "└──────────────────────────────────────────────────────────────┘"
  echo ""
fi

exit 0
