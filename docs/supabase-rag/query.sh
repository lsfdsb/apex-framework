#!/usr/bin/env bash
# query.sh — Query the APEX Framework knowledge base
#
# Usage:
#   ./docs/supabase-rag/query.sh search   "how does quality work"
#   ./docs/supabase-rag/query.sh search   "worktree safety" --type agent
#   ./docs/supabase-rag/query.sh refs     "builder"
#   ./docs/supabase-rag/query.sh learnings "file loss"
#   ./docs/supabase-rag/query.sh list     [agent|skill|script|hook|rule]
#
# Search modes (automatic selection):
#   1. Hybrid search (keyword + semantic) — when embeddings exist
#   2. Text search (keyword only) — when no embeddings
#   3. Local grep — when no Supabase configured
#
# Required env vars for Supabase mode:
#   SUPABASE_URL                e.g. https://xyzabc.supabase.co
#   SUPABASE_PUBLISHABLE_KEY    or SUPABASE_SECRET_KEY (fallback)
#
# Dependencies: bash, curl, jq (for Supabase mode)
#               grep, find (always available for local fallback)
#
# by Bueno & Claude · São Paulo, 2026

set -eo pipefail

# ── Config ────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
AGENTS_DIR="$PROJECT_DIR/.claude/agents"
SKILLS_DIR="$PROJECT_DIR/.claude/skills"
SCRIPTS_DIR="$PROJECT_DIR/.claude/scripts"

SUPABASE_URL="${SUPABASE_URL:-}"
SUPABASE_PUBLISHABLE_KEY="${SUPABASE_PUBLISHABLE_KEY:-${SUPABASE_SECRET_KEY:-}}"
[[ -n "$SUPABASE_URL" ]] && SUPABASE_URL="${SUPABASE_URL%/}"
REST_URL="${SUPABASE_URL}/rest/v1"
EMBED_URL="${SUPABASE_URL}/functions/v1/apex-embed"

FILTER_TYPE=""

# ── Helpers ───────────────────────────────────────────────────────────────────

has_supabase() {
  [[ -n "$SUPABASE_URL" && -n "$SUPABASE_PUBLISHABLE_KEY" ]]
}

require_jq() {
  if ! command -v jq &>/dev/null; then
    echo "ERROR: 'jq' required for Supabase queries." >&2
    return 1
  fi
}

rest_get() {
  local path="$1"
  curl -sf \
    "$REST_URL/$path" \
    -H "apikey: $SUPABASE_PUBLISHABLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_PUBLISHABLE_KEY" \
    -H "Accept: application/json"
}

rest_post() {
  local path="$1"
  local data="$2"
  curl -sf \
    "$REST_URL/$path" \
    -H "apikey: $SUPABASE_PUBLISHABLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_PUBLISHABLE_KEY" \
    -H "Content-Type: application/json" \
    -d "$data"
}

# Generate embedding via our Edge Function (for hybrid search)
get_embedding() {
  local text="$1"
  local payload
  payload=$(jq -n --arg input "$text" '{input: $input}')

  curl -sf "$EMBED_URL" \
    -H "Authorization: Bearer $SUPABASE_PUBLISHABLE_KEY" \
    -H "Content-Type: application/json" \
    -d "$payload" 2>/dev/null | jq -c '.embedding // empty' 2>/dev/null
}

# ── Subcommand: search ────────────────────────────────────────────────────────

_hybrid_search() {
  local query="$1"

  # Generate embedding for the query
  local embedding
  embedding=$(get_embedding "$query")

  if [[ -z "$embedding" ]] || [[ "$embedding" == "null" ]]; then
    return 1  # Fall back to text search
  fi

  # Build RPC payload
  local payload
  if [[ -n "$FILTER_TYPE" ]]; then
    payload=$(jq -n \
      --arg qt "$query" \
      --argjson qe "$embedding" \
      --argjson mc 10 \
      --arg ft "$FILTER_TYPE" \
      '{query_text: $qt, query_embedding: $qe, match_count: $mc, filter_type: $ft}')
  else
    payload=$(jq -n \
      --arg qt "$query" \
      --argjson qe "$embedding" \
      --argjson mc 10 \
      '{query_text: $qt, query_embedding: $qe, match_count: $mc}')
  fi

  local results
  results=$(rest_post "rpc/hybrid_search_chunks" "$payload" 2>/dev/null || echo "[]")

  local count
  count=$(echo "$results" | jq 'length')
  [[ "$count" -eq 0 ]] && return 1

  echo "$results" | jq -r '.[] | "[\(.component_type)] \(.component_name) > \(.heading_path | join(" > "))\n  \(.content[:200] | gsub("\n"; " "))...\n  (score: \(.rank_score | . * 1000 | floor / 1000))\n"'
  echo "$count result(s) via hybrid search (keyword + semantic)."
  return 0
}

_text_search() {
  local query="$1"

  # Try chunks text search first (richer content)
  local payload
  if [[ -n "$FILTER_TYPE" ]]; then
    payload=$(jq -n \
      --arg qt "$query" \
      --argjson mc 10 \
      --arg ft "$FILTER_TYPE" \
      '{query_text: $qt, match_count: $mc, filter_type: $ft}')
  else
    payload=$(jq -n \
      --arg qt "$query" \
      --argjson mc 10 \
      '{query_text: $qt, match_count: $mc}')
  fi

  local results
  results=$(rest_post "rpc/search_chunks_text" "$payload" 2>/dev/null || echo "[]")

  local count
  count=$(echo "$results" | jq 'length')

  if [[ "$count" -gt 0 ]]; then
    echo "$results" | jq -r '.[] | "[\(.component_type)] \(.component_name) > \(.heading_path | join(" > "))\n  \(.content[:200] | gsub("\n"; " "))...\n"'
    echo "$count result(s) via keyword search."
    return 0
  fi

  # Fall back to components table ilike
  local encoded_query
  encoded_query="$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$query" 2>/dev/null || echo "$query")"

  results=$(rest_get "components?or=(name.ilike.*${encoded_query}*,description.ilike.*${encoded_query}*)&select=type,name,description&order=type.asc,name.asc" 2>/dev/null || echo "[]")
  count=$(echo "$results" | jq 'length')

  if [[ "$count" -gt 0 ]]; then
    echo "$results" | jq -r '.[] | "[\(.type)] \(.name)\n  \(.description // "(no description)")\n"'
    echo "$count result(s) via component text search."
    return 0
  fi

  return 1
}

_local_search() {
  local query="$1"
  echo "=== Agents ==="
  grep -rli "$query" "$AGENTS_DIR" 2>/dev/null | while read -r f; do
    echo "  $(basename "$f" .md)"
  done || echo "  (none)"

  echo ""
  echo "=== Skills ==="
  grep -rli "$query" "$SKILLS_DIR" 2>/dev/null | while read -r f; do
    echo "  $(basename "$(dirname "$f")")/$(basename "$f")"
  done || echo "  (none)"

  echo ""
  echo "=== Scripts ==="
  grep -li "$query" "$SCRIPTS_DIR"/*.sh 2>/dev/null | while read -r f; do
    echo "  $(basename "$f")"
  done || echo "  (none)"
}

cmd_search() {
  local query="${1:-}"
  if [[ -z "$query" ]]; then
    echo "Usage: $0 search <query> [--type agent|skill|script|rule]" >&2
    exit 1
  fi

  if has_supabase && require_jq 2>/dev/null; then
    # Try hybrid search first (keyword + semantic)
    echo "Searching: \"$query\"${FILTER_TYPE:+ (type: $FILTER_TYPE)}"
    echo ""

    if _hybrid_search "$query"; then
      return
    fi

    # Fall back to text search
    if _text_search "$query"; then
      return
    fi

    echo "No Supabase results. Falling back to local grep..."
    echo ""
    _local_search "$query"
  else
    echo "Supabase not configured — searching locally..."
    echo ""
    _local_search "$query"
  fi
}

# ── Subcommand: refs ──────────────────────────────────────────────────────────

cmd_refs() {
  local name="${1:-}"
  if [[ -z "$name" ]]; then
    echo "Usage: $0 refs <component-name>" >&2
    exit 1
  fi

  if has_supabase && require_jq 2>/dev/null; then
    echo "Cross-references for: \"$name\""
    echo ""

    local encoded_name
    encoded_name="$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$name" 2>/dev/null || echo "$name")"

    echo "-- Uses (dependencies) --"
    local as_source
    as_source=$(rest_get "cross_references?source_name=eq.${encoded_name}&select=target_type,target_name,relationship&order=relationship.asc,target_name.asc" 2>/dev/null || echo "[]")
    if [[ "$(echo "$as_source" | jq 'length')" -gt 0 ]]; then
      echo "$as_source" | jq -r '.[] | "  \(.relationship) → [\(.target_type)] \(.target_name)"'
    else
      echo "  (none)"
    fi

    echo ""
    echo "-- Used by (dependents) --"
    local as_target
    as_target=$(rest_get "cross_references?target_name=eq.${encoded_name}&select=source_type,source_name,relationship&order=relationship.asc,source_name.asc" 2>/dev/null || echo "[]")
    if [[ "$(echo "$as_target" | jq 'length')" -gt 0 ]]; then
      echo "$as_target" | jq -r '.[] | "  [\(.source_type)] \(.source_name) → \(.relationship)"'
    else
      echo "  (none)"
    fi
  else
    echo "Supabase not configured — scanning locally for: \"$name\""
    echo ""
    grep -rl "$name" "$AGENTS_DIR" "$SKILLS_DIR" "$SCRIPTS_DIR" 2>/dev/null \
      | while read -r f; do echo "  $f"; done || echo "  (none)"
  fi
}

# ── Subcommand: learnings ─────────────────────────────────────────────────────

cmd_learnings() {
  local query="${1:-}"
  if [[ -z "$query" ]]; then
    echo "Usage: $0 learnings <query>" >&2
    exit 1
  fi

  if has_supabase && require_jq 2>/dev/null; then
    echo "Searching session learnings: \"$query\""
    echo ""

    local encoded_query
    encoded_query="$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$query" 2>/dev/null || echo "$query")"

    local results
    results=$(rest_get "session_learnings?content.ilike.*${encoded_query}*&select=session_id,learning_type,content,created_at&order=created_at.desc&limit=20" 2>/dev/null || echo "[]")

    local count
    count=$(echo "$results" | jq 'length')
    if [[ "$count" -eq 0 ]]; then
      echo "No learnings found."
      return
    fi

    echo "$results" | jq -r '.[] | "[\(.learning_type)] \(.created_at | split("T")[0])\n  \(.content)\n"'
    echo "$count result(s)."
  else
    echo "Supabase not configured — searching local agent memory..."
    echo ""
    local memory_dir="$PROJECT_DIR/.claude/agent-memory"
    if [[ -d "$memory_dir" ]]; then
      grep -rl "$query" "$memory_dir" 2>/dev/null | while read -r f; do
        echo "  $f"
        grep -n "$query" "$f" | head -3 | sed 's/^/    /'
        echo ""
      done || echo "  (none)"
    else
      echo "  No agent-memory directory."
    fi
  fi
}

# ── Subcommand: list ──────────────────────────────────────────────────────────

cmd_list() {
  local type_filter="${1:-}"

  if has_supabase && require_jq 2>/dev/null; then
    local path="components?select=type,name,description&order=type.asc,name.asc"
    [[ -n "$type_filter" ]] && path="components?type=eq.${type_filter}&select=type,name,description&order=name.asc"

    echo "Components${type_filter:+ (type: $type_filter)} in Supabase:"
    echo ""
    rest_get "$path" 2>/dev/null \
      | jq -r '.[] | "[\(.type)] \(.name)\n  \(.description // "(no description)")\n"'
  else
    echo "Listing local components..."
    echo ""
    if [[ -z "$type_filter" || "$type_filter" == "agent" ]]; then
      echo "=== Agents ==="
      ls "$AGENTS_DIR"/*.md 2>/dev/null | while read -r f; do echo "  $(basename "$f" .md)"; done
      echo ""
    fi
    if [[ -z "$type_filter" || "$type_filter" == "skill" ]]; then
      echo "=== Skills ==="
      find "$SKILLS_DIR" -maxdepth 1 -mindepth 1 -type d 2>/dev/null | while read -r d; do echo "  $(basename "$d")"; done
      echo ""
    fi
    if [[ -z "$type_filter" || "$type_filter" == "script" ]]; then
      echo "=== Scripts ==="
      ls "$SCRIPTS_DIR"/*.sh 2>/dev/null | while read -r f; do echo "  $(basename "$f")"; done
      echo ""
    fi
  fi
}

# ── Dispatch ──────────────────────────────────────────────────────────────────

# Parse global flags
ARGS=()
for arg in "$@"; do
  case "$arg" in
    --type) shift; FILTER_TYPE="${1:-}"; shift || true ;;
    *) ARGS+=("$arg") ;;
  esac
done

SUBCOMMAND="${ARGS[0]:-}"

case "$SUBCOMMAND" in
  search)    cmd_search    "${ARGS[1]:-}" ;;
  refs)      cmd_refs      "${ARGS[1]:-}" ;;
  learnings) cmd_learnings "${ARGS[1]:-}" ;;
  list)      cmd_list      "${ARGS[1]:-}" ;;
  *)
    echo "APEX Framework — Knowledge Base Query"
    echo ""
    echo "Usage:"
    echo "  $0 search   <query>     Hybrid search (keyword + semantic) across chunks"
    echo "  $0 refs     <name>      Cross-references for a named component"
    echo "  $0 learnings <query>    Search session learnings"
    echo "  $0 list     [type]      List components (type: agent|skill|script|hook|rule)"
    echo ""
    echo "Options:"
    echo "  --type <type>           Filter search by component type"
    echo ""
    echo "Search priority: hybrid (vector+keyword) → text (keyword) → local grep"
    exit 0
    ;;
esac
