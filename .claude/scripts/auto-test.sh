#!/bin/bash
# auto-test.sh — PostToolUse hook (Edit|Write|MultiEdit)
# Runs related tests after every file edit to create a tight TDD feedback loop.
# The Mastery Guide calls this "the TDD multiplier" — Claude sees test results
# after every edit, driving the RED-GREEN-REFACTOR cycle naturally.
#
# Exit 0 always — informational only. The Stop gate is where tests are mandatory.
# by Bueno & Claude · São Paulo, 2026

set -uo pipefail

INPUT=$(cat)

# Extract file path from tool input
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only run for TS/TSX/JS/JSX files
if ! echo "$FILE_PATH" | grep -qE '\.(ts|tsx|js|jsx)$'; then
  exit 0
fi

# Skip if the project has no test runner
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
if [ ! -f "$PROJECT_DIR/package.json" ]; then
  exit 0
fi

# Check for test script in package.json
if ! grep -q '"test"' "$PROJECT_DIR/package.json" 2>/dev/null; then
  exit 0
fi

# Determine the test file to run
BASENAME=$(basename "$FILE_PATH")
DIR=$(dirname "$FILE_PATH")

# If we edited a test file, run it directly
if echo "$BASENAME" | grep -qE '\.(test|spec)\.(ts|tsx|js|jsx)$'; then
  TEST_FILE="$FILE_PATH"
else
  # Look for a related test file
  NAME_NO_EXT="${BASENAME%.*}"
  EXT="${BASENAME##*.}"

  # Check common test file patterns
  TEST_FILE=""
  for pattern in \
    "$DIR/${NAME_NO_EXT}.test.${EXT}" \
    "$DIR/${NAME_NO_EXT}.spec.${EXT}" \
    "$DIR/__tests__/${NAME_NO_EXT}.test.${EXT}" \
    "$DIR/__tests__/${NAME_NO_EXT}.spec.${EXT}" \
    "$DIR/../__tests__/${NAME_NO_EXT}.test.${EXT}" \
    "$DIR/../__tests__/${NAME_NO_EXT}.spec.${EXT}"; do
    if [ -f "$pattern" ]; then
      TEST_FILE="$pattern"
      break
    fi
  done
fi

# No test file found — skip silently
if [ -z "$TEST_FILE" ]; then
  exit 0
fi

# Detect test runner
if grep -q '"vitest"' "$PROJECT_DIR/package.json" 2>/dev/null || \
   [ -f "$PROJECT_DIR/vitest.config.ts" ] || [ -f "$PROJECT_DIR/vitest.config.js" ]; then
  RUNNER="npx vitest --run --reporter=verbose"
elif grep -q '"jest"' "$PROJECT_DIR/package.json" 2>/dev/null; then
  RUNNER="npx jest --verbose --no-coverage"
else
  # Fallback to npm test
  RUNNER="npm test --"
fi

# Run tests (timeout 30s, capture output)
RESULT=$(cd "$PROJECT_DIR" && timeout 30 $RUNNER "$TEST_FILE" 2>&1 | tail -25) || true

# Output results as system message for Claude to see
if [ -n "$RESULT" ]; then
  # Escape for JSON
  ESCAPED=$(echo "$RESULT" | jq -Rs .)
  echo "{\"systemMessage\": \"🧪 Auto-test ($TEST_FILE):\\n${ESCAPED}\"}"
fi

exit 0
