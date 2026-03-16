#!/bin/bash
# stop-gate.sh — Stop hook
# Fires when Claude finishes responding. Checks if code was written
# but tests were not run. Uses Haiku by default (prompt hook behavior
# is simulated here via stdout feedback to Claude's context).
#
# Exit 0 = allow. Stdout is added to Claude's context as a reminder.
# This is a "nudge" hook — it can't block (Stop hooks don't support exit 2),
# but it injects strong reminders into context when tests are missing.

# jq is required to parse the transcript
if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — stop-gate cannot verify test execution. Install jq: https://jqlang.github.io/jq/download/"
  exit 0
fi

INPUT=$(cat)

# Extract the assistant's last response content
# The Stop hook receives the full conversation turn
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

if [ "$WROTE_CODE" = true ] && [ "$TESTS_RAN" = false ] && [ "$EXEMPT" = false ]; then
  echo ""
  echo "⚠️ APEX STOP GATE: Code was written but no tests were run."
  echo "Our rule: no code ships without tests. Run 'npm run test' or '/qa' before continuing."
  echo "If tests aren't applicable (docs, config), mention why explicitly."
  echo ""
fi

exit 0
