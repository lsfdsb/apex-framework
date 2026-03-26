#!/usr/bin/env bash
# rag-sync.sh — Unified RAG sync: detect changes, chunk, embed
#
# Usage:
#   ./docs/supabase-rag/rag-sync.sh --full             # Full re-sync (all files)
#   ./docs/supabase-rag/rag-sync.sh --changed           # Only files changed since last sync
#   ./docs/supabase-rag/rag-sync.sh --file path/to/file # Re-sync one specific file
#   ./docs/supabase-rag/rag-sync.sh --status            # Show sync status
#
# This is the single entry point for RAG updates. Called by:
#   - SessionStart hook (--changed, background)
#   - PostToolUse hook (--file, after Edit/Write on .claude/ files)
#   - install.sh (--full, after framework update)
#
# Required env vars:
#   SUPABASE_URL          e.g. https://xyzabc.supabase.co
#   SUPABASE_SECRET_KEY   secret key (sb_secret_... format)
#
# Dependencies: bash, curl, jq, git
#
# by Bueno & Claude · São Paulo, 2026

set -eo pipefail

# ── Config ────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
STATE_DIR="$PROJECT_DIR/.apex/state"
SYNC_HASH_FILE="$STATE_DIR/rag-sync-hash"
SYNC_LOG="$STATE_DIR/rag-sync.log"

MODE=""
TARGET_FILE=""
QUIET=false

# ── Argument parsing ──────────────────────────────────────────────────────────

for arg in "$@"; do
  case "$arg" in
    --full)    MODE="full" ;;
    --changed) MODE="changed" ;;
    --file)    MODE="file" ;;
    --status)  MODE="status" ;;
    --quiet)   QUIET=true ;;
    --help|-h)
      echo "Usage: $0 [--full|--changed|--file <path>|--status] [--quiet]"
      exit 0
      ;;
    *)
      # If mode is "file", next arg is the path
      if [[ "$MODE" == "file" && -z "$TARGET_FILE" ]]; then
        TARGET_FILE="$arg"
      fi
      ;;
  esac
done

if [[ -z "$MODE" ]]; then
  echo "Usage: $0 [--full|--changed|--file <path>|--status]" >&2
  exit 1
fi

log() {
  [[ "$QUIET" == "true" ]] && return
  echo "$@"
}

# ── Validation ────────────────────────────────────────────────────────────────

SB_KEY="${SUPABASE_SB_SECRET_KEY:-${SUPABASE_SECRET_KEY:-}}"

if [[ "$MODE" != "status" ]]; then
  if [[ -z "${SUPABASE_URL:-}" || -z "$SB_KEY" ]]; then
    # Silently skip if Supabase not configured (graceful degradation)
    [[ "$QUIET" == "false" ]] && echo "RAG sync: Supabase not configured, skipping."
    exit 0
  fi

  for cmd in curl jq; do
    if ! command -v "$cmd" &>/dev/null; then
      [[ "$QUIET" == "false" ]] && echo "RAG sync: '$cmd' not installed, skipping."
      exit 0
    fi
  done
fi

mkdir -p "$STATE_DIR"

SUPABASE_URL="${SUPABASE_URL%/}"
REST_URL="$SUPABASE_URL/rest/v1"
EMBED_URL="$SUPABASE_URL/functions/v1/apex-embed"

# ── Status ────────────────────────────────────────────────────────────────────

if [[ "$MODE" == "status" ]]; then
  echo "RAG Sync Status"
  echo ""
  if [[ -f "$SYNC_HASH_FILE" ]]; then
    LAST_HASH=$(cat "$SYNC_HASH_FILE")
    LAST_DATE=$(git log -1 --format="%ci" "$LAST_HASH" 2>/dev/null || echo "unknown")
    echo "  Last sync: $LAST_HASH ($LAST_DATE)"

    CURRENT_HASH=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
    echo "  Current:   $CURRENT_HASH"

    if [[ "$LAST_HASH" == "$CURRENT_HASH" ]]; then
      echo "  Status:    UP TO DATE"
    else
      CHANGED=$(git diff --name-only "$LAST_HASH"..HEAD -- '.claude/' 'CLAUDE.md' 'docs/design-dna/principles.md' 2>/dev/null | wc -l | tr -d ' ')
      echo "  Status:    $CHANGED framework file(s) changed since last sync"
    fi
  else
    echo "  Last sync: NEVER (no sync hash recorded)"
    echo "  Status:    NEEDS FULL SYNC"
  fi

  if [[ -f "$SYNC_LOG" ]]; then
    echo ""
    echo "  Last log entry:"
    tail -1 "$SYNC_LOG" | sed 's/^/    /'
  fi
  exit 0
fi

# ── Helpers ───────────────────────────────────────────────────────────────────

# Determine component type and name from file path
classify_file() {
  local file="$1"
  case "$file" in
    .claude/agents/*.md|*/.claude/agents/*.md)
      echo "agent $(basename "$file" .md)"
      ;;
    .claude/skills/*/SKILL.md|*/.claude/skills/*/SKILL.md)
      local dir
      dir=$(dirname "$file")
      echo "skill $(basename "$dir")"
      ;;
    .claude/scripts/*.sh|*/.claude/scripts/*.sh)
      echo "script $(basename "$file" .sh)"
      ;;
    .claude/rules/*.md|*/.claude/rules/*.md)
      local name
      name=$(basename "$file" .md)
      [[ "$name" == "README" ]] && return 1
      echo "rule $name"
      ;;
    CLAUDE.md|*/CLAUDE.md)
      echo "rule constitution"
      ;;
    docs/design-dna/principles.md|*/docs/design-dna/principles.md)
      echo "rule design-principles"
      ;;
    *)
      return 1
      ;;
  esac
}

# Check if file is a framework file we track
is_framework_file() {
  local file="$1"
  classify_file "$file" &>/dev/null
}

# Chunk a single markdown file and upsert to Supabase
chunk_and_embed_file() {
  local file="$1"
  local comp_type="$2"
  local comp_name="$3"

  local abs_file="$PROJECT_DIR/$file"
  [[ -f "$abs_file" ]] || abs_file="$file"
  [[ -f "$abs_file" ]] || { log "  WARN: File not found: $file"; return; }

  log "  Chunking [$comp_type] $comp_name..."

  # Delete existing chunks for this component (clean re-chunk)
  curl -sf -o /dev/null \
    -X DELETE "$REST_URL/chunks?component_type=eq.${comp_type}&component_name=eq.${comp_name}" \
    -H "apikey: $SB_KEY" 2>/dev/null || true

  # Chunk the file using the appropriate strategy
  local chunk_idx=0
  local in_frontmatter=false
  local frontmatter_done=false
  local current_heading=""
  local current_content=""
  local is_shell=false

  [[ "$abs_file" == *.sh ]] && is_shell=true

  while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ "$is_shell" == "false" ]]; then
      # Markdown: handle frontmatter
      if [[ "$line" == "---" && "$frontmatter_done" == "false" ]]; then
        if [[ "$in_frontmatter" == "false" ]]; then
          in_frontmatter=true; continue
        else
          in_frontmatter=false; frontmatter_done=true; continue
        fi
      fi
      [[ "$in_frontmatter" == "true" ]] && continue

      # Split on ## headings
      if [[ "$line" =~ ^##[[:space:]]+(.*) ]]; then
        if [[ -n "$current_content" ]]; then
          _upsert_chunk "$comp_type" "$comp_name" "$chunk_idx" "$current_heading" "$current_content" "$file"
          chunk_idx=$((chunk_idx + 1))
        fi
        current_heading="${BASH_REMATCH[1]}"
        current_content=""
        continue
      fi
    else
      # Shell: split on # ── Section ── markers
      if [[ "$line" =~ ^#[[:space:]]*──[[:space:]]*(.*)[[:space:]]*── ]]; then
        if [[ -n "$current_content" ]]; then
          _upsert_chunk "$comp_type" "$comp_name" "$chunk_idx" "$current_heading" "$current_content" "$file"
          chunk_idx=$((chunk_idx + 1))
        fi
        current_heading="${BASH_REMATCH[1]}"
        current_content=""
        continue
      fi
    fi

    current_content+="$line"$'\n'
  done < "$abs_file"

  # Flush last chunk
  if [[ -n "$current_content" ]]; then
    _upsert_chunk "$comp_type" "$comp_name" "$chunk_idx" "$current_heading" "$current_content" "$file"
    chunk_idx=$((chunk_idx + 1))
  fi

  log "    → $chunk_idx chunk(s) synced"

  # Now embed the new chunks
  _embed_chunks "$comp_type" "$comp_name"
}

_upsert_chunk() {
  local comp_type="$1" comp_name="$2" chunk_idx="$3" heading="$4" content="$5" file_path="$6"

  local heading_json
  if [[ -n "$heading" ]]; then
    heading_json=$(jq -n --arg h "$heading" '[$h]')
  else
    heading_json='["main"]'
  fi

  local content_json
  content_json=$(printf '%s' "$content" | jq -Rs '.')
  local tokens
  tokens=$(echo "$content" | wc -w | tr -d ' ')
  tokens=$(( tokens * 13 / 10 ))

  local payload
  payload=$(jq -n \
    --arg ct "$comp_type" \
    --arg cn "$comp_name" \
    --argjson ci "$chunk_idx" \
    --argjson hp "$heading_json" \
    --argjson content "$content_json" \
    --arg fp "$file_path" \
    --argjson tc "$tokens" \
    '{
      component_type: $ct,
      component_name: $cn,
      chunk_index: $ci,
      heading_path: $hp,
      content: $content,
      metadata: {file_path: $fp},
      token_count: $tc
    }')

  curl -sf -o /dev/null \
    -X POST "$REST_URL/chunks?on_conflict=component_type,component_name,chunk_index" \
    -H "apikey: $SB_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: resolution=merge-duplicates,return=minimal" \
    -d "$payload" 2>/dev/null || true
}

_embed_chunks() {
  local comp_type="$1" comp_name="$2"

  # Fetch unembedded chunks for this component
  local chunks
  chunks=$(curl -sf \
    "$REST_URL/chunks?component_type=eq.${comp_type}&component_name=eq.${comp_name}&embedding=is.null&select=id,heading_path,content" \
    -H "apikey: $SB_KEY" \
    -H "Accept: application/json" 2>/dev/null || echo "[]")

  local count
  count=$(echo "$chunks" | jq 'length')
  [[ "$count" -eq 0 ]] && return

  log "    → Embedding $count chunk(s)..."

  echo "$chunks" | jq -c '.[]' | while IFS= read -r row; do
    local id
    id=$(echo "$row" | jq -r '.id')
    local text
    text=$(echo "$row" | jq -r '"[" + "'"$comp_type"'" + "] " + "'"$comp_name"'" + ": " + (.heading_path | join(" > ")) + " — " + .content[:400]')

    # Generate embedding via Edge Function
    local embed_payload
    embed_payload=$(jq -n --arg input "$text" '{input: $input}')

    local embedding
    embedding=$(curl -sf "$EMBED_URL" \
      -H "apikey: $SB_KEY" \
      -H "Content-Type: application/json" \
      -d "$embed_payload" 2>/dev/null | jq -c '.embedding // empty' 2>/dev/null)

    if [[ -n "$embedding" && "$embedding" != "null" ]]; then
      local update_payload
      update_payload=$(jq -n --argjson e "$embedding" '{embedding: $e}')

      curl -sf -o /dev/null \
        -X PATCH "$REST_URL/chunks?id=eq.${id}" \
        -H "apikey: $SB_KEY" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=minimal" \
        -d "$update_payload" 2>/dev/null || true
    fi

    sleep 0.05  # Rate limit
  done
}

# Save sync marker
save_sync_hash() {
  local hash
  hash=$(git -C "$PROJECT_DIR" rev-parse HEAD 2>/dev/null || echo "manual")
  echo "$hash" > "$SYNC_HASH_FILE"
  echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') synced=$MODE hash=$hash" >> "$SYNC_LOG"
}

# ── Mode: --full ──────────────────────────────────────────────────────────────

run_full() {
  log "RAG Sync: FULL"
  log ""

  # Step 1: Sync metadata
  log "Step 1/3: Syncing metadata..."
  bash "$SCRIPT_DIR/sync.sh" 2>/dev/null | tail -1

  # Step 2: Chunk all files
  log ""
  log "Step 2/3: Chunking all framework files..."

  for f in "$PROJECT_DIR"/.claude/agents/*.md; do
    [[ -f "$f" ]] || continue
    local name=$(basename "$f" .md)
    chunk_and_embed_file ".claude/agents/$name.md" "agent" "$name"
  done

  for f in "$PROJECT_DIR"/.claude/skills/*/SKILL.md; do
    [[ -f "$f" ]] || continue
    local name=$(basename "$(dirname "$f")")
    chunk_and_embed_file ".claude/skills/$name/SKILL.md" "skill" "$name"
  done

  for f in "$PROJECT_DIR"/.claude/scripts/*.sh; do
    [[ -f "$f" ]] || continue
    local name=$(basename "$f" .sh)
    chunk_and_embed_file ".claude/scripts/$name.sh" "script" "$name"
  done

  for f in "$PROJECT_DIR"/.claude/rules/*.md; do
    [[ -f "$f" ]] || continue
    local name=$(basename "$f" .md)
    [[ "$name" == "README" ]] && continue
    chunk_and_embed_file ".claude/rules/$name.md" "rule" "$name"
  done

  [[ -f "$PROJECT_DIR/CLAUDE.md" ]] && \
    chunk_and_embed_file "CLAUDE.md" "rule" "constitution"

  [[ -f "$PROJECT_DIR/docs/design-dna/principles.md" ]] && \
    chunk_and_embed_file "docs/design-dna/principles.md" "rule" "design-principles"

  log ""
  log "Step 3/3: Saving sync marker..."
  save_sync_hash

  log ""
  log "RAG Sync complete (full)."
}

# ── Mode: --changed ───────────────────────────────────────────────────────────

run_changed() {
  log "RAG Sync: CHANGED"

  if [[ ! -f "$SYNC_HASH_FILE" ]]; then
    log "  No previous sync — running full sync."
    MODE="full"
    run_full
    return
  fi

  local last_hash
  last_hash=$(cat "$SYNC_HASH_FILE")
  local current_hash
  current_hash=$(git -C "$PROJECT_DIR" rev-parse HEAD 2>/dev/null || echo "")

  if [[ "$last_hash" == "$current_hash" ]]; then
    log "  Already up to date ($current_hash)."
    exit 0
  fi

  # Find framework files that changed
  local changed_files
  changed_files=$(git -C "$PROJECT_DIR" diff --name-only "$last_hash"..HEAD -- \
    '.claude/agents/' '.claude/skills/' '.claude/scripts/' '.claude/rules/' \
    'CLAUDE.md' 'docs/design-dna/principles.md' 2>/dev/null || echo "")

  if [[ -z "$changed_files" ]]; then
    log "  No framework files changed."
    save_sync_hash
    exit 0
  fi

  local count
  count=$(echo "$changed_files" | wc -l | tr -d ' ')
  log "  $count file(s) changed since last sync."
  log ""

  # First re-sync metadata
  bash "$SCRIPT_DIR/sync.sh" 2>/dev/null | tail -1

  # Re-chunk and embed each changed file
  while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    local classified
    classified=$(classify_file "$file" 2>/dev/null) || continue
    local comp_type comp_name
    comp_type=$(echo "$classified" | cut -d' ' -f1)
    comp_name=$(echo "$classified" | cut -d' ' -f2-)
    chunk_and_embed_file "$file" "$comp_type" "$comp_name"
  done <<< "$changed_files"

  save_sync_hash
  log ""
  log "RAG Sync complete (incremental: $count files)."
}

# ── Mode: --file ──────────────────────────────────────────────────────────────

run_file() {
  if [[ -z "$TARGET_FILE" ]]; then
    echo "Usage: $0 --file <path>" >&2
    exit 1
  fi

  local classified
  classified=$(classify_file "$TARGET_FILE" 2>/dev/null) || {
    log "  Not a tracked framework file: $TARGET_FILE"
    exit 0
  }

  local comp_type comp_name
  comp_type=$(echo "$classified" | cut -d' ' -f1)
  comp_name=$(echo "$classified" | cut -d' ' -f2-)

  log "RAG Sync: FILE [$comp_type] $comp_name"
  chunk_and_embed_file "$TARGET_FILE" "$comp_type" "$comp_name"
  log "RAG Sync complete (1 file)."
}

# ── Dispatch ──────────────────────────────────────────────────────────────────

case "$MODE" in
  full)    run_full ;;
  changed) run_changed ;;
  file)    run_file ;;
esac
