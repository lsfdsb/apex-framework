#!/bin/bash
# Requires jq — exit 0 (allow) if missing to avoid blocking all operations
if ! command -v jq &> /dev/null; then exit 0; fi
# notify.sh — Notification hook
# Sends desktop notification when Claude needs your attention.
# Works on macOS (osascript) and Linux (notify-send).

INPUT=$(cat)
TITLE=$(echo "$INPUT" | jq -r '.title // "Claude Code"')
MESSAGE=$(echo "$INPUT" | jq -r '.message // "Needs your attention"')

# macOS
if command -v osascript &> /dev/null; then
  osascript -e "display notification \"$MESSAGE\" with title \"$TITLE\"" 2>/dev/null
# Linux
elif command -v notify-send &> /dev/null; then
  notify-send "$TITLE" "$MESSAGE" 2>/dev/null
fi

exit 0
