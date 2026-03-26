#!/usr/bin/env bash
# embed.sh — Generate vector embeddings via Supabase gte-small Edge Function
#
# Usage:
#   ./docs/supabase-rag/embed.sh                  # Embed all unembedded items
#   ./docs/supabase-rag/embed.sh --all             # Re-embed everything (force)
#   ./docs/supabase-rag/embed.sh --chunks          # Embed chunks table (default)
#   ./docs/supabase-rag/embed.sh --components      # Embed components table
#   ./docs/supabase-rag/embed.sh --learnings       # Embed session_learnings table
#   ./docs/supabase-rag/embed.sh --dry-run         # Show what would be embedded
#
# Required env vars:
#   SUPABASE_URL          e.g. https://xyzabc.supabase.co
#   SUPABASE_SECRET_KEY   secret key (sb_secret_... format)
#
# NO external API keys needed. Uses Supabase built-in gte-small (384 dimensions).
#
# Dependencies: bash, curl, jq
#
# by Bueno & Claude · São Paulo, 2026

set -eo pipefail

# ── Config ────────────────────────────────────────────────────────────────────

EMBEDDING_MODEL="gte-small"
EMBEDDING_DIM=384
DRY_RUN=false
FORCE_ALL=false
DO_CHUNKS=true
DO_COMPONENTS=false
DO_LEARNINGS=false

# ── Argument parsing ──────────────────────────────────────────────────────────

for arg in "$@"; do
  case "$arg" in
    --dry-run)      DRY_RUN=true ;;
    --all)          FORCE_ALL=true ;;
    --chunks)       DO_CHUNKS=true ;;
    --components)   DO_COMPONENTS=true ;;
    --learnings)    DO_LEARNINGS=true ;;
    --everything)   DO_CHUNKS=true; DO_COMPONENTS=true; DO_LEARNINGS=true ;;
    --help|-h)
      echo "Usage: $0 [--all] [--chunks] [--components] [--learnings] [--everything] [--dry-run]"
      echo "  --chunks      Embed chunks table (default)"
      echo "  --components  Embed components table"
      echo "  --learnings   Embed session_learnings table"
      echo "  --everything  Embed all three tables"
      echo "  --all         Re-embed even if embedding already exists"
      echo "  --dry-run     Show what would be embedded"
      exit 0
      ;;
    *) echo "Unknown argument: $arg" >&2; exit 1 ;;
  esac
done

# ── Validation ────────────────────────────────────────────────────────────────

for cmd in curl jq; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "ERROR: '$cmd' is required but not installed." >&2
    exit 1
  fi
done

SB_KEY="${SUPABASE_SB_SECRET_KEY:-${SUPABASE_SECRET_KEY:-}}"

if [[ -z "${SUPABASE_URL:-}" ]]; then
  echo "ERROR: SUPABASE_URL is not set." >&2
  exit 1
fi
if [[ -z "$SB_KEY" ]]; then
  echo "ERROR: SUPABASE_SB_SECRET_KEY (or SUPABASE_SECRET_KEY) is not set." >&2
  exit 1
fi

SUPABASE_URL="${SUPABASE_URL%/}"
REST_URL="$SUPABASE_URL/rest/v1"
EMBED_URL="$SUPABASE_URL/functions/v1/apex-embed"

echo "APEX Framework — Embedding Generator"
echo "  Model     : $EMBEDDING_MODEL ($EMBEDDING_DIM dimensions)"
echo "  Endpoint  : $EMBED_URL"
echo "  Force all : $FORCE_ALL"
[[ "$DRY_RUN" == "true" ]] && echo "  Mode      : DRY RUN"
echo ""

# ── Test Edge Function ────────────────────────────────────────────────────────

if [[ "$DRY_RUN" == "false" ]]; then
  echo "Testing Edge Function..."
  HEALTH=$(curl -sf "$EMBED_URL" \
    -H "apikey: $SB_KEY" 2>/dev/null || echo "FAIL")

  if [[ "$HEALTH" == "FAIL" ]] || ! echo "$HEALTH" | jq -e '.status == "ok"' &>/dev/null; then
    echo "ERROR: Edge Function not responding at $EMBED_URL" >&2
    echo "" >&2
    echo "Deploy it first:" >&2
    echo "  supabase functions deploy apex-embed --no-verify-jwt" >&2
    echo "" >&2
    echo "See docs/supabase-rag/edge-function-embed.ts for the source." >&2
    exit 1
  fi
  echo "  Edge Function OK ($EMBEDDING_MODEL, ${EMBEDDING_DIM}d)"
  echo ""
fi

# ── Helpers ───────────────────────────────────────────────────────────────────

# Generate embedding via our Edge Function
generate_embedding() {
  local text="$1"
  local payload
  payload=$(jq -n --arg input "$text" '{input: $input}')

  local response
  response=$(curl -sf \
    "$EMBED_URL" \
    -H "apikey: $SB_KEY" \
    -H "Content-Type: application/json" \
    -d "$payload" 2>/dev/null)

  if [[ $? -ne 0 ]] || [[ -z "$response" ]]; then
    echo "ERROR" >&2
    return 1
  fi

  echo "$response" | jq -c '.embedding'
}

# Update a row's embedding
update_embedding() {
  local table="$1"
  local id="$2"
  local embedding="$3"
  local id_type="${4:-uuid}"  # uuid for components/learnings, bigint for chunks

  local payload
  payload=$(jq -n --argjson embedding "$embedding" '{embedding: $embedding}')

  local filter="id=eq.${id}"

  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" \
    -X PATCH "$REST_URL/${table}?${filter}" \
    -H "apikey: $SB_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=minimal" \
    -d "$payload")

  [[ "$http_code" -ge 200 && "$http_code" -lt 300 ]]
}

# Embed a table
embed_table() {
  local table="$1"
  local text_expr="$2"   # jq expression to build embed text from row
  local id_field="$3"    # "id" for all tables
  local select="$4"      # columns to select
  local label="$5"       # display label

  echo "Embedding $label..."

  local filter=""
  [[ "$FORCE_ALL" == "false" ]] && filter="&embedding=is.null"

  local rows
  rows=$(curl -sf \
    "$REST_URL/${table}?select=${select}${filter}&limit=500" \
    -H "apikey: $SB_KEY" \
    -H "Accept: application/json" 2>/dev/null || echo "[]")

  local count
  count=$(echo "$rows" | jq 'length')
  echo "  $count row(s) to embed"

  if [[ "$count" -eq 0 ]]; then
    return
  fi

  local embedded=0
  local failed=0

  echo "$rows" | jq -c '.[]' | while IFS= read -r row; do
    local id
    id=$(echo "$row" | jq -r ".$id_field")
    local text
    text=$(echo "$row" | eval "$text_expr")

    if [[ "$DRY_RUN" == "true" ]]; then
      echo "  [dry-run] ${text:0:80}..."
      continue
    fi

    printf "  Embedding %-50s " "${text:0:50}..."

    local embedding
    embedding=$(generate_embedding "$text")
    if [[ -z "$embedding" ]] || [[ "$embedding" == "null" ]] || [[ "$embedding" == "ERROR" ]]; then
      echo "FAILED"
      continue
    fi

    if update_embedding "$table" "$id" "$embedding"; then
      echo "OK"
    else
      echo "WRITE FAILED"
    fi

    # Small delay to avoid overwhelming Edge Function
    sleep 0.05
  done

  echo ""
}

# ── Embed chunks ──────────────────────────────────────────────────────────────

if [[ "$DO_CHUNKS" == "true" ]]; then
  embed_table "chunks" \
    'jq -r "\"[\" + .component_type + \"] \" + .component_name + \": \" + (.heading_path | join(\" > \")) + \" — \" + .content[:400]"' \
    "id" \
    "id,component_type,component_name,heading_path,content" \
    "chunks"
fi

# ── Embed components ──────────────────────────────────────────────────────────

if [[ "$DO_COMPONENTS" == "true" ]]; then
  embed_table "components" \
    'jq -r "\"[\" + .type + \"] \" + .name + \": \" + (.description // \"\")"' \
    "id" \
    "id,type,name,description" \
    "components"
fi

# ── Embed session learnings ───────────────────────────────────────────────────

if [[ "$DO_LEARNINGS" == "true" ]]; then
  embed_table "session_learnings" \
    'jq -r ".content"' \
    "id" \
    "id,content" \
    "session learnings"
fi

echo "Embedding complete."
