#!/usr/bin/env bash
# setup.sh — One-command Supabase RAG setup for APEX Framework
#
# Usage:
#   export SUPABASE_URL="https://your-project.supabase.co"
#   export SUPABASE_SECRET_KEY="sb_secret_..."
#   bash docs/supabase-rag/setup.sh
#
# What this does:
#   1. Validates env vars
#   2. Runs migration (creates tables, indexes, RLS)
#   3. Generates manifest and does initial sync
#   4. Verifies data landed correctly
#
# Prerequisites: bash, curl, jq
# by Bueno & Claude · São Paulo, 2026

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║    APEX Supabase RAG — One-Command Setup     ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""

# ── Step 1: Validate env vars ──
SB_KEY="${SUPABASE_SB_SECRET_KEY:-${SUPABASE_SECRET_KEY:-}}"

MISSING=""
if [ -z "${SUPABASE_URL:-}" ]; then
  MISSING="${MISSING}SUPABASE_URL "
fi
if [ -z "$SB_KEY" ]; then
  MISSING="${MISSING}SUPABASE_SB_SECRET_KEY "
fi

if [ -n "$MISSING" ]; then
  echo "  Missing environment variables: $MISSING"
  echo ""
  echo "  Set them first:"
  echo "    export SUPABASE_URL=\"https://your-project.supabase.co\""
  echo "    export SUPABASE_SB_SECRET_KEY=\"sb_secret_...\""
  echo ""
  echo "  Get these from: Supabase Dashboard → Settings → API"
  echo "  (Use the new format: sb_secret_... not the old JWT service_role key)"
  exit 1
fi

# Validate URL format
if ! echo "$SUPABASE_URL" | grep -q "supabase.co"; then
  echo "  Warning: SUPABASE_URL doesn't contain 'supabase.co' — is this correct?"
  echo "  URL: $SUPABASE_URL"
  echo ""
fi

# Validate key format
if echo "$SB_KEY" | grep -q "^eyJ"; then
  echo "  Warning: SUPABASE_SECRET_KEY looks like a legacy JWT key (starts with 'eyJ')."
  echo "  New projects use 'sb_secret_...' format. Legacy keys still work but are deprecated."
  echo ""
fi

echo "  Project: $SUPABASE_URL"
echo "  Key: ${SB_KEY:0:12}..."
echo ""

# ── Step 2: Test connection ──
echo "  Testing connection..."
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" \
  "${SUPABASE_URL}/rest/v1/" \
  -H "apikey: ${SB_KEY}" 2>/dev/null || echo "000")

if [ "$HEALTH" = "000" ]; then
  echo "  Connection failed. Check your SUPABASE_URL."
  exit 1
elif [ "$HEALTH" = "401" ]; then
  echo "  Authentication failed (401). Check your SUPABASE_SECRET_KEY."
  exit 1
elif [ "$HEALTH" != "200" ]; then
  echo "  Unexpected response: HTTP $HEALTH. Proceeding anyway..."
else
  echo "  Connected successfully."
fi
echo ""

# ── Step 3: Run migration ──
echo "  Running migration..."
MIGRATION_FILE="$SCRIPT_DIR/migration.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
  echo "  Migration file not found: $MIGRATION_FILE"
  exit 1
fi

# Execute migration via Supabase REST SQL endpoint
MIGRATION_SQL=$(cat "$MIGRATION_FILE")
RESULT=$(curl -s -X POST "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SB_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$MIGRATION_SQL" | jq -Rs .)}" 2>/dev/null || echo "FALLBACK")

if [ "$RESULT" = "FALLBACK" ] || echo "$RESULT" | grep -qi "error"; then
  echo "  Note: REST SQL execution may not be available."
  echo "  Please run the migration manually:"
  echo ""
  echo "  Option A: Supabase Dashboard → SQL Editor → paste migration.sql → Run"
  echo "  Option B: psql \"\$DATABASE_URL\" -f $MIGRATION_FILE"
  echo "  Option C: supabase db push (if using Supabase CLI)"
  echo ""
  echo "  After running the migration, re-run this script to continue setup."
  echo ""
  read -p "  Press Enter after running the migration (or Ctrl+C to abort)..."
fi

echo "  Migration complete (or manual — verify in dashboard)."
echo ""

# ── Step 4: Generate manifest and sync ──
echo "  Generating framework manifest..."
CLAUDE_PROJECT_DIR="$PROJECT_DIR" bash "$PROJECT_DIR/.claude/scripts/manifest-generate.sh" > /dev/null 2>&1

echo "  Syncing manifest to Supabase..."
bash "$SCRIPT_DIR/sync.sh"
echo ""

# ── Step 5: Verify ──
echo "  Verifying data..."
COMPONENT_COUNT=$(curl -s "${SUPABASE_URL}/rest/v1/components?select=id" \
  -H "apikey: ${SB_KEY}" 2>/dev/null | jq 'length' 2>/dev/null || echo "0")

REF_COUNT=$(curl -s "${SUPABASE_URL}/rest/v1/cross_references?select=id" \
  -H "apikey: ${SB_KEY}" 2>/dev/null | jq 'length' 2>/dev/null || echo "0")

echo "  Components synced: $COMPONENT_COUNT"
echo "  Cross-references synced: $REF_COUNT"
echo ""

if [ "$COMPONENT_COUNT" -gt 0 ]; then
  echo "  ╔══════════════════════════════════════════════╗"
  echo "  ║    Supabase RAG is LIVE                      ║"
  echo "  ╚══════════════════════════════════════════════╝"
  echo ""
  echo "  Query: bash docs/supabase-rag/query.sh search \"watcher agent\""
  echo "  Sync:  bash docs/supabase-rag/sync.sh"
  echo ""
  echo "  Add to your shell profile for persistence:"
  echo "    export SUPABASE_URL=\"$SUPABASE_URL\""
  echo "    export SUPABASE_SB_SECRET_KEY=\"${SB_KEY:0:12}...\""
else
  echo "  No components found. The migration may not have run yet."
  echo "  Run the migration manually, then: bash docs/supabase-rag/sync.sh"
fi
