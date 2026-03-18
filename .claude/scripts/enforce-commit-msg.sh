#!/bin/bash
# enforce-commit-msg.sh — PreToolUse hook on Bash
# Validates git commit messages match conventional commit format.
# Uses official hookSpecificOutput JSON format per Claude Code docs.
# by L.B. & Claude · São Paulo, 2026

if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — commit message enforcement disabled." >&2
  exit 0
fi

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

deny() {
  local reason="$1"
  jq -n --arg reason "$reason" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $reason
    }
  }'
  exit 0
}

# Only check git commit commands
if echo "$COMMAND" | grep -qE '^git\s+commit'; then
  # Extract the commit message — handles three patterns:
  # 1. -m "message"  or  -m 'message'
  # 2. HEREDOC: -m "$(cat <<'EOF'\nmessage\nEOF\n)"
  # 3. No -m flag (editor-based) — skip
  MSG=$(echo "$COMMAND" | sed -n 's/^[^-]*-m ["\x27]\([^"\x27]*\)["\x27].*/\1/p' | head -1)

  # If simple -m extraction failed, try HEREDOC pattern
  if [ -z "$MSG" ]; then
    if echo "$COMMAND" | grep -qE '-m\s+"\$\(cat\s+<<'; then
      MSG=$(echo "$COMMAND" | grep -oE '(feat|fix|docs|refactor|test|perf|security|chore)(\([a-z0-9._-]+\))?: .+' | head -1 || echo "")
    fi
  fi

  if [ -z "$MSG" ]; then
    # No -m flag and no heredoc — might be using editor, allow
    exit 0
  fi

  # Validate conventional commit format: type(scope): description
  if ! echo "$MSG" | grep -qE '^(feat|fix|docs|refactor|test|perf|security|chore)(\([a-z0-9._-]+\))?: .+'; then
    deny "⚔️ APEX: Commit message doesn't follow conventional format. Required: type(scope): description. Types: feat, fix, docs, refactor, test, perf, security, chore. Example: feat(auth): add OAuth login with Google"
  fi

  # Check message length
  if [ ${#MSG} -gt 72 ]; then
    deny "⚔️ APEX: Commit message too long (${#MSG} chars, max 72). Keep the subject line concise. Add details in the body."
  fi
fi

exit 0
