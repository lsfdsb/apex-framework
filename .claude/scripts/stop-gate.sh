#!/bin/bash
# stop-gate.sh — Stop hook
# Fires when Claude finishes responding. Checks if code was written
# but tests were not run. Uses visual nudges to remind about testing.
#
# Exit 0 = allow. Stdout is added to Claude's context as a reminder.
# by Bueno & Claude · São Paulo, 2026

set -uo pipefail  # no -e because hook must not crash Claude Code

# jq is required to parse the transcript
if ! command -v jq &> /dev/null; then
  echo '{"systemMessage":"⚠️ APEX: jq not installed — test enforcement DISABLED. Install: brew install jq"}'
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

if [ "$WROTE_CODE" = true ] && [ "$TESTS_RAN" = false ] && [ "$EXEMPT" = false ]; then
  echo ""
  echo "┌──────────────────────────────────────────────────────────────┐"
  echo "│  APEX STOP GATE                                              │"
  echo "│                                                              │"
  echo "│  Code was written but no tests were run.                     │"
  echo "│  Our rule: no code ships without tests.                      │"
  echo "│                                                              │"
  echo "│  Run 'npm run test' or '/qa' before continuing.              │"
  echo "│  If tests aren't applicable, mention why explicitly.         │"
  echo "└──────────────────────────────────────────────────────────────┘"
  echo ""
fi

# Check if .claude/ files were changed but CHANGELOG was not updated
if [ "$WROTE_CODE" = true ]; then
  CLAUDE_FILES_CHANGED=$(echo "$WRITTEN_PATHS" | grep -c '\.claude/' 2>/dev/null || echo "0")
  CHANGELOG_TOUCHED=false

  if echo "$WRITTEN_PATHS" | grep -q "CHANGELOG"; then
    CHANGELOG_TOUCHED=true
  fi
  if echo "$RESPONSE" | grep -qiE '(changelog|technical.writer|tech.writer)'; then
    CHANGELOG_TOUCHED=true
  fi

  if [ "$CLAUDE_FILES_CHANGED" -gt 0 ] && [ "$CHANGELOG_TOUCHED" = false ]; then
    echo '{"systemMessage":"APEX: Framework files were modified but CHANGELOG was not updated. Spawn Technical Writer before committing: Agent({ subagent_type: \"technical-writer\", run_in_background: true, prompt: \"Update CHANGELOG.md for recent framework changes.\" })"}'
  fi
fi

# ── Mark Lead agent as idle in agents.json ─────────────────────────────────────
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
AGENTS_FILE="$PROJECT_DIR/.apex/state/agents.json"
if [ -f "$AGENTS_FILE" ]; then
  STOP_TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  jq --arg ts "$STOP_TS" \
    'if (.agents | map(.name) | index("Lead")) then
      (.agents[] | select(.name == "Lead")) |= (
        .status = "idle"
        | .currentTask = null
        | .completedAt = $ts
        | .thoughtStream = (
            (.thoughtStream // []) + [{"timestamp": $ts, "action": "Response complete", "explanation": "Lead paused — waiting for input"}]
          )[-5:]
      )
    else . end' \
    "$AGENTS_FILE" > "${AGENTS_FILE}.tmp" && mv "${AGENTS_FILE}.tmp" "$AGENTS_FILE" 2>/dev/null || true
fi

exit 0
