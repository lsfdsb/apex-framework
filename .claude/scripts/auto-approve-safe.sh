#!/bin/bash
# auto-approve-safe.sh — PermissionRequest hook
# Auto-approves safe, read-only operations that don't need user confirmation.
# Uses official hookSpecificOutput JSON format per Claude Code docs.
# by L.B. & Claude · São Paulo, 2026

if ! command -v jq &> /dev/null; then
  exit 0
fi

INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // ""' 2>/dev/null)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""' 2>/dev/null)

# Auto-approve read-only tools
case "$TOOL" in
  Read|Glob|Grep)
    jq -n '{hookSpecificOutput:{hookEventName:"PermissionRequest",decision:{behavior:"allow"}}}'
    exit 0
    ;;
esac

# Auto-approve safe bash commands
if [ "$TOOL" = "Bash" ] && [ -n "$COMMAND" ]; then
  # Block command chaining — never auto-approve commands with pipes, semicolons, or logical operators
  if echo "$COMMAND" | grep -qE '[;&|`\$\(]'; then
    exit 0
  fi
  # Read-only commands (only simple, unchained commands reach here)
  if echo "$COMMAND" | grep -qE '^(ls|cat|head|tail|wc|find|grep|echo|sort|diff|basename|dirname|realpath|test|tr|cut|uniq|git (status|log|diff|branch|show|remote)|npm (run|test|audit|view)|npx (tsc|eslint|prettier|vitest|playwright))(\s|$)'; then
    jq -n '{hookSpecificOutput:{hookEventName:"PermissionRequest",decision:{behavior:"allow"}}}'
    exit 0
  fi
fi

# Everything else: let the normal permission dialog show
exit 0
