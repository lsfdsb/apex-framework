#!/usr/bin/env bash
# chunk.sh — Split APEX framework files into semantic chunks for RAG
#
# Usage:
#   ./docs/supabase-rag/chunk.sh              # Chunk all framework files
#   ./docs/supabase-rag/chunk.sh --dry-run    # Show chunks without uploading
#
# Required env vars:
#   SUPABASE_URL          e.g. https://xyzabc.supabase.co
#   SUPABASE_SECRET_KEY   secret key (sb_secret_... format)
#
# Dependencies: bash, curl, jq
#
# Chunking strategy:
#   Markdown files: split on ## headings (300-500 tokens per chunk)
#   Shell scripts: split on # ── Section ── markers or function boundaries
#   YAML frontmatter: stored as metadata, not as a chunk
#
# by Bueno & Claude · São Paulo, 2026

set -eo pipefail

# ── Config ────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
DRY_RUN=false
CHUNK_COUNT=0
UPSERT_COUNT=0

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
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

if [[ "$DRY_RUN" == "false" ]]; then
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
fi

echo "APEX Framework — Chunk Generator"
[[ "$DRY_RUN" == "true" ]] && echo "  Mode: DRY RUN"
echo ""

# ── Helpers ───────────────────────────────────────────────────────────────────

# Rough token count (words * 1.3)
estimate_tokens() {
  local text="$1"
  local words
  words=$(echo "$text" | wc -w | tr -d ' ')
  echo $(( words * 13 / 10 ))
}

# Upsert a chunk to Supabase
upsert_chunk() {
  local comp_type="$1"
  local comp_name="$2"
  local chunk_idx="$3"
  local heading_path="$4"  # JSON array string
  local content="$5"
  local metadata="$6"      # JSON object string
  local tokens
  tokens=$(estimate_tokens "$content")

  CHUNK_COUNT=$((CHUNK_COUNT + 1))

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "  [$comp_type] $comp_name #$chunk_idx (${tokens}t) — $(echo "$heading_path" | jq -r 'join(" > ")')"
    return
  fi

  local content_json
  content_json=$(printf '%s' "$content" | jq -Rs '.')

  local payload
  payload=$(jq -n \
    --arg ct "$comp_type" \
    --arg cn "$comp_name" \
    --argjson ci "$chunk_idx" \
    --argjson hp "$heading_path" \
    --argjson content "$content_json" \
    --argjson metadata "$metadata" \
    --argjson tc "$tokens" \
    '{
      component_type: $ct,
      component_name: $cn,
      chunk_index: $ci,
      heading_path: $hp,
      content: $content,
      metadata: $metadata,
      token_count: $tc
    }')

  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$REST_URL/chunks?on_conflict=component_type,component_name,chunk_index" \
    -H "apikey: $SB_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: resolution=merge-duplicates,return=minimal" \
    -d "$payload")

  if [[ "$http_code" -ge 200 && "$http_code" -lt 300 ]]; then
    UPSERT_COUNT=$((UPSERT_COUNT + 1))
  else
    echo "  WARN: HTTP $http_code for [$comp_type] $comp_name #$chunk_idx" >&2
  fi
}

# ── Markdown Chunker ──────────────────────────────────────────────────────────
# Splits on ## headings. Frontmatter becomes metadata, not a chunk.

chunk_markdown() {
  local file="$1"
  local comp_type="$2"
  local comp_name="$3"
  local file_path="$4"

  local in_frontmatter=false
  local frontmatter_done=false
  local chunk_idx=0
  local current_heading=""
  local current_content=""
  local heading_stack=()

  while IFS= read -r line || [[ -n "$line" ]]; do
    # Handle YAML frontmatter
    if [[ "$line" == "---" && "$frontmatter_done" == "false" ]]; then
      if [[ "$in_frontmatter" == "false" ]]; then
        in_frontmatter=true
        continue
      else
        in_frontmatter=false
        frontmatter_done=true
        continue
      fi
    fi
    [[ "$in_frontmatter" == "true" ]] && continue

    # Detect ## headings (chunk boundary)
    if [[ "$line" =~ ^##[[:space:]]+(.*) ]]; then
      # Save previous chunk if it has content
      if [[ -n "$current_content" ]]; then
        local hp
        hp=$(printf '%s\n' "${heading_stack[@]}" | jq -R . | jq -s .)
        local meta
        meta=$(jq -n --arg fp "$file_path" '{file_path: $fp}')
        upsert_chunk "$comp_type" "$comp_name" "$chunk_idx" "$hp" "$current_content" "$meta"
        chunk_idx=$((chunk_idx + 1))
      fi

      current_heading="${BASH_REMATCH[1]}"
      heading_stack=("$current_heading")
      current_content=""
      continue
    fi

    # Detect ### sub-headings (add to heading path)
    if [[ "$line" =~ ^###[[:space:]]+(.*) ]]; then
      heading_stack=("$current_heading" "${BASH_REMATCH[1]}")
    fi

    # Accumulate content
    current_content+="$line"$'\n'
  done < "$file"

  # Flush last chunk
  if [[ -n "$current_content" ]]; then
    local hp
    hp=$(printf '%s\n' "${heading_stack[@]}" | jq -R . | jq -s .)
    [[ "${#heading_stack[@]}" -eq 0 ]] && hp='["main"]'
    local meta
    meta=$(jq -n --arg fp "$file_path" '{file_path: $fp}')
    upsert_chunk "$comp_type" "$comp_name" "$chunk_idx" "$hp" "$current_content" "$meta"
  fi
}

# ── Shell Script Chunker ─────────────────────────────────────────────────────
# Splits on # ── Section ── markers. Header comment = chunk 0.

chunk_shell() {
  local file="$1"
  local comp_type="$2"
  local comp_name="$3"
  local file_path="$4"

  local chunk_idx=0
  local current_section="header"
  local current_content=""

  while IFS= read -r line || [[ -n "$line" ]]; do
    # Detect section markers: # ── Name ──
    if [[ "$line" =~ ^#[[:space:]]*──[[:space:]]*(.*)[[:space:]]*── ]]; then
      # Save previous chunk
      if [[ -n "$current_content" ]]; then
        local hp
        hp=$(jq -n --arg s "$current_section" '[$s]')
        local meta
        meta=$(jq -n --arg fp "$file_path" '{file_path: $fp}')
        upsert_chunk "$comp_type" "$comp_name" "$chunk_idx" "$hp" "$current_content" "$meta"
        chunk_idx=$((chunk_idx + 1))
      fi

      current_section="${BASH_REMATCH[1]}"
      current_content=""
      continue
    fi

    current_content+="$line"$'\n'
  done < "$file"

  # Flush last chunk
  if [[ -n "$current_content" ]]; then
    local hp
    hp=$(jq -n --arg s "$current_section" '[$s]')
    local meta
    meta=$(jq -n --arg fp "$file_path" '{file_path: $fp}')
    upsert_chunk "$comp_type" "$comp_name" "$chunk_idx" "$hp" "$current_content" "$meta"
  fi
}

# ── Process Framework Files ───────────────────────────────────────────────────

# Agents
echo "Chunking agents..."
for f in "$PROJECT_DIR"/.claude/agents/*.md; do
  [[ -f "$f" ]] || continue
  name=$(basename "$f" .md)
  echo "  $name"
  chunk_markdown "$f" "agent" "$name" ".claude/agents/$name.md"
done

# Skills
echo ""
echo "Chunking skills..."
for f in "$PROJECT_DIR"/.claude/skills/*/SKILL.md; do
  [[ -f "$f" ]] || continue
  skill_dir=$(dirname "$f")
  name=$(basename "$skill_dir")
  echo "  $name"
  chunk_markdown "$f" "skill" "$name" ".claude/skills/$name/SKILL.md"
done

# Scripts
echo ""
echo "Chunking scripts..."
for f in "$PROJECT_DIR"/.claude/scripts/*.sh; do
  [[ -f "$f" ]] || continue
  name=$(basename "$f" .sh)
  echo "  $name"
  chunk_shell "$f" "script" "$name" ".claude/scripts/$name.sh"
done

# Rules
echo ""
echo "Chunking rules..."
for f in "$PROJECT_DIR"/.claude/rules/*.md; do
  [[ -f "$f" ]] || continue
  name=$(basename "$f" .md)
  [[ "$name" == "README" ]] && continue  # skip index
  echo "  $name"
  chunk_markdown "$f" "rule" "$name" ".claude/rules/$name.md"
done

# CLAUDE.md (constitution)
echo ""
echo "Chunking CLAUDE.md..."
if [[ -f "$PROJECT_DIR/CLAUDE.md" ]]; then
  chunk_markdown "$PROJECT_DIR/CLAUDE.md" "rule" "constitution" "CLAUDE.md"
fi

# Design DNA principles
echo ""
echo "Chunking design principles..."
if [[ -f "$PROJECT_DIR/docs/design-dna/principles.md" ]]; then
  chunk_markdown "$PROJECT_DIR/docs/design-dna/principles.md" "rule" "design-principles" "docs/design-dna/principles.md"
fi

# ── Summary ───────────────────────────────────────────────────────────────────

echo ""
echo "Chunking complete."
echo "  Total chunks: $CHUNK_COUNT"
[[ "$DRY_RUN" == "false" ]] && echo "  Upserted: $UPSERT_COUNT"
