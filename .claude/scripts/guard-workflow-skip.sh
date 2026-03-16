#!/bin/bash
# guard-workflow-skip.sh — UserPromptSubmit hook
# Catches user prompts that try to skip the APEX workflow.
# Injects a reminder into context (doesn't block — the user is boss).
# Exit 0 = allow. Stdout added to context as additional context.

if ! command -v jq &> /dev/null; then
  echo "⚠️ APEX: jq not installed — prompt guard disabled. Install: https://jqlang.github.io/jq/download/" >&2
  exit 0
fi

INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty' 2>/dev/null)

if [ -z "$PROMPT" ]; then
  exit 0
fi

# Detect workflow-skip patterns (case-insensitive)
PROMPT_LOWER=$(echo "$PROMPT" | tr '[:upper:]' '[:lower:]')

# Skip PRD requests
if echo "$PROMPT_LOWER" | grep -qE '(skip (the )?prd|no prd|without (a )?prd|just (build|code|do) it|don.t need (a )?prd|forget (the )?prd)'; then
  echo '{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"APEX REMINDER: The user wants to skip the PRD. Our philosophy is PRD-before-code, but the user is the boss. If this is a quick fix, bug fix, or small change — proceed. If it is a new feature or app — gently remind them that /prd takes 5 minutes and saves 10 hours, then proceed with their decision."}}'
  exit 0
fi

# Skip testing requests
if echo "$PROMPT_LOWER" | grep -qE '(skip (the )?test|no test|without test|don.t (need to )?test|don.t run test)'; then
  echo '{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"APEX REMINDER: The user wants to skip tests. Our philosophy is test everything, but the user decides. Gently note that untested code is a liability, then proceed with their decision."}}'
  exit 0
fi

# Skip security requests
if echo "$PROMPT_LOWER" | grep -qE '(skip (the )?security|no security|without security|don.t (need )?security)'; then
  echo '{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"APEX REMINDER: The user wants to skip the security review. If the code handles auth, payments, or PII, strongly recommend running /security first. Otherwise, proceed."}}'
  exit 0
fi

exit 0
