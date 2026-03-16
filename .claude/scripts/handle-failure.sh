#!/bin/bash
# handle-failure.sh — PostToolUseFailure hook on Bash
# Provides diagnostic context when a Bash command fails.
# Cannot block (informational only). Stdout added to Claude's context.

if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — failure handler disabled. Install: https://jqlang.github.io/jq/download/" >&2
  exit 0
fi

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)
ERROR=$(echo "$INPUT" | jq -r '.error // empty' 2>/dev/null)

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Detect common failure patterns and suggest fixes
SUGGESTIONS=""

# TypeScript compilation errors
if echo "$COMMAND" | grep -qE '(tsc|type-check)' && echo "$ERROR" | grep -qiE '(error TS|type.*error)'; then
  SUGGESTIONS="APEX DEBUG HINT: TypeScript error. Read the error file:line. Common fixes: add missing types, check import paths, fix generic constraints."
fi

# Test failures
if echo "$COMMAND" | grep -qiE '(vitest|jest|test|playwright)' && echo "$ERROR" | grep -qiE '(fail|assert|expect|error)'; then
  SUGGESTIONS="APEX DEBUG HINT: Test failure. Read the failing test name and assertion. Check: was the test correct or is the implementation wrong? Run only the failing test first."
fi

# npm install failures
if echo "$COMMAND" | grep -qE '(npm install|pnpm install|yarn add)' && echo "$ERROR" | grep -qiE '(ERESOLVE|peer dep|conflict|404)'; then
  SUGGESTIONS="APEX DEBUG HINT: Dependency conflict. Try: --legacy-peer-deps, check package version compatibility, or use the exact version from the library's docs."
fi

# Build failures
if echo "$COMMAND" | grep -qE '(npm run build|next build)' && echo "$ERROR" | grep -qiE '(build.*fail|module not found|cannot find)'; then
  SUGGESTIONS="APEX DEBUG HINT: Build failure. Check: missing imports, environment variables not set, or server-only code in client components."
fi

# Permission errors
if echo "$ERROR" | grep -qiE '(EACCES|permission denied|EPERM)'; then
  SUGGESTIONS="APEX DEBUG HINT: Permission error. Check file ownership and permissions. Do NOT use sudo — fix the root cause."
fi

if [ -n "$SUGGESTIONS" ]; then
  echo "$SUGGESTIONS"
fi

exit 0
