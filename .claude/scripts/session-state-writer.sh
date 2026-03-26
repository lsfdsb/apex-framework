#!/bin/bash
# session-state-writer.sh — Writes session state to .apex/state/session.json
# Triggered by SessionStart hook
# Dual-write: local JSON first, then Supabase (non-blocking background curl).
#
# by Bueno & Claude · São Paulo, 2026

set -uo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
STATE_DIR="$PROJECT_DIR/.apex/state"
SESSION_FILE="$STATE_DIR/session.json"

mkdir -p "$STATE_DIR"

# Get branch name
BRANCH=$(cd "$PROJECT_DIR" && git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

# Generate a stable session UUID (reuse if session.json already exists and is active)
if [ -f "$SESSION_FILE" ] && command -v jq &>/dev/null; then
  EXISTING_ID=$(jq -r '.sessionId // empty' "$SESSION_FILE" 2>/dev/null || true)
  EXISTING_ACTIVE=$(jq -r '.active // false' "$SESSION_FILE" 2>/dev/null || true)
  if [ -n "$EXISTING_ID" ] && [ "$EXISTING_ACTIVE" = "true" ]; then
    SESSION_ID="$EXISTING_ID"
  fi
fi

# Generate new UUID if needed
if [ -z "${SESSION_ID:-}" ]; then
  if command -v uuidgen &>/dev/null; then
    SESSION_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')
  else
    SESSION_ID=$(cat /proc/sys/kernel/random/uuid 2>/dev/null || python3 -c 'import uuid; print(uuid.uuid4())' 2>/dev/null || echo "$(date +%s)-$(od -An -N4 -tx4 /dev/urandom | tr -d ' ')")
  fi
fi

STARTED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Require jq — fallback to raw JSON if missing
if ! command -v jq &>/dev/null; then
  cat > "$SESSION_FILE" <<ENDJSON
{"sessionId":"${SESSION_ID}","active":true,"startedAt":"${STARTED_AT}","branch":"${BRANCH}","model":"opus","contextUsed":0,"contextMax":1000000}
ENDJSON
else
  jq -n \
    --arg id "$SESSION_ID" \
    --arg branch "$BRANCH" \
    --arg started "$STARTED_AT" \
    '{
      sessionId: $id,
      active: true,
      startedAt: $started,
      branch: $branch,
      model: "opus",
      contextUsed: 0,
      contextMax: 1000000
    }' > "$SESSION_FILE"
fi

# ── Supabase dual-write (non-blocking) ────────────────────────────────────────
if [ -n "${SUPABASE_URL:-}" ] && [ -n "${SUPABASE_SECRET_KEY:-}" ]; then
  PAYLOAD=$(jq -n \
    --arg id "$SESSION_ID" \
    --arg started "$STARTED_AT" \
    --arg branch "$BRANCH" \
    '{
      id: $id,
      started_at: $started,
      branch: $branch,
      model: "opus",
      context_used: 0,
      context_max: 1000000,
      active: true
    }' 2>/dev/null)

  if [ -n "$PAYLOAD" ]; then
    curl -sf -X POST "${SUPABASE_URL}/rest/v1/sessions" \
      -H "apikey: ${SUPABASE_SECRET_KEY}" \
      -H "Authorization: Bearer ${SUPABASE_SECRET_KEY}" \
      -H "Content-Type: application/json" \
      -H "Prefer: resolution=merge-duplicates" \
      -d "$PAYLOAD" --max-time 3 &>/dev/null &
  fi
fi

exit 0
