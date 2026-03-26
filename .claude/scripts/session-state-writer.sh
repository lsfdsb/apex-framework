#!/bin/bash
# session-state-writer.sh — Writes session state to .apex/state/session.json
# Triggered by SessionStart hook
#
# by Bueno & Claude · São Paulo, 2026

set -uo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
STATE_DIR="$PROJECT_DIR/.apex/state"
SESSION_FILE="$STATE_DIR/session.json"

mkdir -p "$STATE_DIR"

# Get branch name
BRANCH=$(cd "$PROJECT_DIR" && git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

# Require jq — fallback to raw JSON if missing
if ! command -v jq &>/dev/null; then
  cat > "$SESSION_FILE" <<ENDJSON
{"active":true,"startedAt":"$(date -u +"%Y-%m-%dT%H:%M:%SZ")","branch":"${BRANCH}","model":"opus","contextUsed":0,"contextMax":1000000}
ENDJSON
  exit 0
fi

jq -n \
  --arg branch "$BRANCH" \
  --arg started "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
  '{
    active: true,
    startedAt: $started,
    branch: $branch,
    model: "opus",
    contextUsed: 0,
    contextMax: 1000000
  }' > "$SESSION_FILE"

exit 0
