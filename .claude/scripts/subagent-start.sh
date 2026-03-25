#!/bin/bash
# subagent-start.sh — SubagentStart hook
# Auto-injects Design DNA context into builder agents before they start work.
# by Bueno & Claude · São Paulo, 2026

set -uo pipefail

# Read hook input from stdin
INPUT=$(cat)

AGENT_TYPE=$(echo "$INPUT" | jq -r '.agent_type // empty' 2>/dev/null)

# Only inject DNA for builder agents
case "$AGENT_TYPE" in
  builder)
    PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
    DNA_DIR="$PROJECT_DIR/docs/design-dna"
    CONTEXT=""

    # Check if Design DNA exists in project
    if [ -d "$DNA_DIR" ]; then
      CONTEXT="DESIGN DNA AVAILABLE: Read the matching pattern from docs/design-dna/ before writing ANY UI component. This is mandatory."
    elif [ -d "$HOME/.apex-framework/docs/design-dna" ]; then
      CONTEXT="DESIGN DNA AVAILABLE at ~/.apex-framework/docs/design-dna/. Read the matching pattern before writing ANY UI component."
    fi

    if [ -n "$CONTEXT" ]; then
      echo "{\"hookSpecificOutput\":{\"additionalContext\":\"$CONTEXT\"}}"
    fi
    ;;
  *)
    # No injection for other agent types
    ;;
esac

exit 0
