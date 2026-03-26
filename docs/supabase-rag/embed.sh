#!/usr/bin/env bash
# embed.sh — Generate vector embeddings for all APEX components
#
# Usage:
#   ./docs/supabase-rag/embed.sh                  # Embed all components without embeddings
#   ./docs/supabase-rag/embed.sh --all             # Re-embed everything (force)
#   ./docs/supabase-rag/embed.sh --learnings       # Also embed session_learnings
#   ./docs/supabase-rag/embed.sh --dry-run         # Show what would be embedded
#
# Required env vars:
#   SUPABASE_URL          e.g. https://xyzabc.supabase.co
#   SUPABASE_SECRET_KEY   secret key (sb_secret_... format)
#   OPENAI_API_KEY        OpenAI API key for text-embedding-3-small
#
# Dependencies: bash, curl, jq
# Model: text-embedding-3-small (1536 dimensions, $0.02/MTok)
#
# by Bueno & Claude · São Paulo, 2026

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────

EMBEDDING_MODEL="text-embedding-3-small"
EMBEDDING_DIM=1536
BATCH_SIZE=20  # OpenAI supports up to 2048 inputs per batch
DRY_RUN=false
FORCE_ALL=false
INCLUDE_LEARNINGS=false

# ── Argument parsing ──────────────────────────────────────────────────────────

for arg in "$@"; do
  case "$arg" in
    --dry-run)    DRY_RUN=true ;;
    --all)        FORCE_ALL=true ;;
    --learnings)  INCLUDE_LEARNINGS=true ;;
    --help|-h)
      echo "Usage: $0 [--all] [--learnings] [--dry-run]"
      echo "  --all        Re-embed everything (including already embedded)"
      echo "  --learnings  Also embed session_learnings table"
      echo "  --dry-run    Show what would be embedded without calling APIs"
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

if [[ -z "${SUPABASE_URL:-}" ]]; then
  echo "ERROR: SUPABASE_URL is not set." >&2
  exit 1
fi

if [[ -z "${SUPABASE_SECRET_KEY:-}" ]]; then
  echo "ERROR: SUPABASE_SECRET_KEY is not set." >&2
  exit 1
fi

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "ERROR: OPENAI_API_KEY is not set." >&2
  echo ""
  echo "Vector embeddings require an OpenAI API key for $EMBEDDING_MODEL."
  echo "Set it: export OPENAI_API_KEY='sk-...'"
  echo ""
  echo "Without embeddings, query.sh falls back to text search (ilike)."
  echo "Text search works fine — embeddings add semantic matching."
  exit 1
fi

SUPABASE_URL="${SUPABASE_URL%/}"
REST_URL="$SUPABASE_URL/rest/v1"

echo "APEX Framework — Embedding Generator"
echo "  Model     : $EMBEDDING_MODEL ($EMBEDDING_DIM dimensions)"
echo "  Target    : $SUPABASE_URL"
echo "  Force all : $FORCE_ALL"
echo "  Learnings : $INCLUDE_LEARNINGS"
[[ "$DRY_RUN" == "true" ]] && echo "  Mode      : DRY RUN"
echo ""

# ── Helpers ───────────────────────────────────────────────────────────────────

# Fetch rows needing embeddings from a table
fetch_unembedded() {
  local table="$1"
  local select_cols="$2"
  local filter=""

  if [[ "$FORCE_ALL" == "false" ]]; then
    filter="&embedding=is.null"
  fi

  curl -sf \
    "$REST_URL/${table}?select=${select_cols}${filter}&order=name.asc" \
    -H "apikey: $SUPABASE_SECRET_KEY" \
    -H "Authorization: Bearer $SUPABASE_SECRET_KEY" \
    -H "Accept: application/json" 2>/dev/null || echo "[]"
}

# Generate embedding for a single text via OpenAI
generate_embedding() {
  local text="$1"
  local payload
  payload=$(jq -n --arg input "$text" --arg model "$EMBEDDING_MODEL" \
    '{input: $input, model: $model}')

  local response
  response=$(curl -sf \
    "https://api.openai.com/v1/embeddings" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$payload" 2>/dev/null)

  if [[ $? -ne 0 ]] || [[ -z "$response" ]]; then
    echo "ERROR" >&2
    return 1
  fi

  # Extract the embedding array
  echo "$response" | jq -c '.data[0].embedding'
}

# Update a row's embedding in Supabase
update_embedding() {
  local table="$1"
  local id="$2"
  local embedding="$3"

  local payload
  payload=$(jq -n --argjson embedding "$embedding" '{embedding: $embedding}')

  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" \
    -X PATCH "$REST_URL/${table}?id=eq.${id}" \
    -H "apikey: $SUPABASE_SECRET_KEY" \
    -H "Authorization: Bearer $SUPABASE_SECRET_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=minimal" \
    -d "$payload")

  if [[ "$http_code" -lt 200 || "$http_code" -ge 300 ]]; then
    echo "  WARN: PATCH returned HTTP $http_code for $table id=$id" >&2
    return 1
  fi
  return 0
}

# ── Embed components ──────────────────────────────────────────────────────────

echo "Fetching components..."
COMPONENTS=$(fetch_unembedded "components" "id,type,name,description")
COMP_COUNT=$(echo "$COMPONENTS" | jq 'length')

echo "  $COMP_COUNT component(s) to embed"
echo ""

if [[ "$COMP_COUNT" -gt 0 ]]; then
  EMBEDDED=0
  FAILED=0

  echo "$COMPONENTS" | jq -c '.[]' | while IFS= read -r row; do
    id=$(echo "$row" | jq -r '.id')
    type=$(echo "$row" | jq -r '.type')
    name=$(echo "$row" | jq -r '.name')
    desc=$(echo "$row" | jq -r '.description // ""')

    # Build embedding text: combine type, name, and description
    embed_text="[$type] $name: $desc"

    if [[ "$DRY_RUN" == "true" ]]; then
      echo "  [dry-run] Would embed: [$type] $name (${#embed_text} chars)"
      continue
    fi

    printf "  Embedding [$type] %-30s " "$name..."

    embedding=$(generate_embedding "$embed_text")
    if [[ "$embedding" == "ERROR" ]] || [[ -z "$embedding" ]] || [[ "$embedding" == "null" ]]; then
      echo "FAILED"
      FAILED=$((FAILED + 1))
      continue
    fi

    if update_embedding "components" "$id" "$embedding"; then
      echo "OK"
      EMBEDDED=$((EMBEDDED + 1))
    else
      echo "WRITE FAILED"
      FAILED=$((FAILED + 1))
    fi

    # Rate limit: OpenAI allows 3000 RPM for text-embedding-3-small
    sleep 0.1
  done

  echo ""
  echo "Components: embedded $EMBEDDED, failed $FAILED"
fi

# ── Embed session learnings (optional) ────────────────────────────────────────

if [[ "$INCLUDE_LEARNINGS" == "true" ]]; then
  echo ""
  echo "Fetching session learnings..."

  FILTER=""
  [[ "$FORCE_ALL" == "false" ]] && FILTER="&embedding=is.null"

  LEARNINGS=$(curl -sf \
    "$REST_URL/session_learnings?select=id,session_id,learning_type,content${FILTER}&order=created_at.desc&limit=100" \
    -H "apikey: $SUPABASE_SECRET_KEY" \
    -H "Authorization: Bearer $SUPABASE_SECRET_KEY" \
    -H "Accept: application/json" 2>/dev/null || echo "[]")

  LEARN_COUNT=$(echo "$LEARNINGS" | jq 'length')
  echo "  $LEARN_COUNT learning(s) to embed"

  if [[ "$LEARN_COUNT" -gt 0 ]]; then
    echo "$LEARNINGS" | jq -c '.[]' | while IFS= read -r row; do
      id=$(echo "$row" | jq -r '.id')
      ltype=$(echo "$row" | jq -r '.learning_type')
      content=$(echo "$row" | jq -r '.content // ""')

      if [[ "$DRY_RUN" == "true" ]]; then
        echo "  [dry-run] Would embed: [$ltype] ${content:0:60}..."
        continue
      fi

      printf "  Embedding [$ltype] %s... " "${content:0:40}"

      embedding=$(generate_embedding "$content")
      if [[ "$embedding" == "ERROR" ]] || [[ -z "$embedding" ]] || [[ "$embedding" == "null" ]]; then
        echo "FAILED"
        continue
      fi

      if update_embedding "session_learnings" "$id" "$embedding"; then
        echo "OK"
      else
        echo "WRITE FAILED"
      fi

      sleep 0.1
    done
  fi
fi

echo ""
echo "Embedding complete."
