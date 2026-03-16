#!/bin/bash
# enforce-commit-msg.sh — PreToolUse hook on Bash
# Validates git commit messages match conventional commit format.
# Exit 2 = block with feedback. Exit 0 = allow.
# Requires jq — warn and allow if missing (hooks should not silently degrade)
if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — commit message enforcement disabled. Install: https://jqlang.github.io/jq/download/" >&2
  exit 0
fi

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Only check git commit commands
if echo "$COMMAND" | grep -qE '^git\s+commit'; then
  # Extract the commit message — handles three patterns:
  # 1. -m "message"  or  -m 'message'
  # 2. HEREDOC: -m "$(cat <<'EOF'\nmessage\nEOF\n)"
  # 3. No -m flag (editor-based) — skip
  # Note: Uses sed instead of grep -oP for macOS/BSD compatibility
  MSG=$(echo "$COMMAND" | sed -n 's/^[^-]*-m ["\x27]\([^"\x27]*\)["\x27].*/\1/p' | head -1)

  # If simple -m extraction failed, try HEREDOC pattern
  if [ -z "$MSG" ]; then
    if echo "$COMMAND" | grep -qE '-m\s+"\$\(cat\s+<<'; then
      # Extract any conventional commit line inside the heredoc (POSIX-compatible)
      MSG=$(echo "$COMMAND" | grep -oE '(feat|fix|docs|refactor|test|perf|security|chore)(\([a-z0-9-]+\))?: .+' | head -1 || echo "")
    fi
  fi

  if [ -z "$MSG" ]; then
    # No -m flag and no heredoc — might be using editor, allow
    exit 0
  fi
  
  # Validate conventional commit format: type(scope): description
  if ! echo "$MSG" | grep -qE '^(feat|fix|docs|refactor|test|perf|security|chore)(\([a-z0-9-]+\))?: .+'; then
    echo "BLOCKED: Commit message doesn't follow conventional format." >&2
    echo "Required: type(scope): description" >&2
    echo "Types: feat, fix, docs, refactor, test, perf, security, chore" >&2
    echo "Example: feat(auth): add OAuth login with Google" >&2
    exit 2
  fi
  
  # Check message length
  if [ ${#MSG} -gt 72 ]; then
    echo "BLOCKED: Commit message too long (${#MSG} chars, max 72)." >&2
    echo "Keep the subject line under 72 characters. Add details in the body." >&2
    exit 2
  fi
fi

exit 0
