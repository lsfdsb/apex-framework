#!/usr/bin/env bash
# query.sh — Query the APEX Framework knowledge base
#
# Usage:
#   ./docs/supabase-rag/query.sh search   "watcher agent"
#   ./docs/supabase-rag/query.sh refs     "builder"
#   ./docs/supabase-rag/query.sh learnings "file loss"
#   ./docs/supabase-rag/query.sh list     [agent|skill|script|hook|rule]
#
# Optional env vars (falls back to local grep if not set):
#   SUPABASE_URL         e.g. https://xyzabc.supabase.co
#   SUPABASE_PUBLISHABLE_KEY    publishable key (sb_publishable_... format, read-only)
#
# Dependencies: bash, curl, jq (for Supabase mode)
#               grep, find (always available for local fallback)

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
AGENTS_DIR="$PROJECT_DIR/.claude/agents"
SKILLS_DIR="$PROJECT_DIR/.claude/skills"
SCRIPTS_DIR="$PROJECT_DIR/.claude/scripts"

SUPABASE_URL="${SUPABASE_URL:-}"
# Prefer publishable key for reads; fall back to secret key (framework tool, not client-facing)
SUPABASE_PUBLISHABLE_KEY="${SUPABASE_PUBLISHABLE_KEY:-${SUPABASE_SECRET_KEY:-}}"
[[ -n "$SUPABASE_URL" ]] && SUPABASE_URL="${SUPABASE_URL%/}"
REST_URL="${SUPABASE_URL}/rest/v1"

# ── Helpers ───────────────────────────────────────────────────────────────────

has_supabase() {
  [[ -n "$SUPABASE_URL" && -n "$SUPABASE_PUBLISHABLE_KEY" ]]
}

require_jq() {
  if ! command -v jq &>/dev/null; then
    echo "ERROR: 'jq' is required for Supabase queries. Falling back to local grep." >&2
    return 1
  fi
  return 0
}

rest_get() {
  local path="$1"
  curl -sf \
    "$REST_URL/$path" \
    -H "apikey: $SUPABASE_PUBLISHABLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_PUBLISHABLE_KEY" \
    -H "Accept: application/json"
}

# ── Subcommand: search ────────────────────────────────────────────────────────
# Search across components. Uses vector similarity when embeddings + OpenAI key
# are available. Falls back to text ilike, then to local grep.

_vector_search() {
  local query="$1"

  # Generate embedding for query
  local payload
  payload=$(jq -n --arg input "$query" --arg model "text-embedding-3-small" \
    '{input: $input, model: $model}')

  local embedding
  embedding=$(curl -sf \
    "https://api.openai.com/v1/embeddings" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$payload" 2>/dev/null | jq -c '.data[0].embedding' 2>/dev/null)

  if [[ -z "$embedding" ]] || [[ "$embedding" == "null" ]]; then
    return 1
  fi

  # Call match_components RPC via PostgREST
  local rpc_payload
  rpc_payload=$(jq -n \
    --argjson query_embedding "$embedding" \
    --argjson match_threshold 0.5 \
    --argjson match_count 10 \
    '{query_embedding: $query_embedding, match_threshold: $match_threshold, match_count: $match_count}')

  local results
  results=$(curl -sf \
    "$REST_URL/rpc/match_components" \
    -H "apikey: $SUPABASE_PUBLISHABLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_PUBLISHABLE_KEY" \
    -H "Content-Type: application/json" \
    -d "$rpc_payload" 2>/dev/null || echo "[]")

  local count
  count="$(echo "$results" | jq 'length')"
  if [[ "$count" -eq 0 ]]; then
    return 1
  fi

  echo "$results" | jq -r '.[] | "[\(.type)] \(.name) (similarity: \(.similarity | . * 100 | floor)%)\n  \(.description // "(no description)")\n"'
  echo "$count result(s) via semantic search."
  return 0
}

cmd_search() {
  local query="${1:-}"
  if [[ -z "$query" ]]; then
    echo "Usage: $0 search <query>" >&2
    exit 1
  fi

  if has_supabase && require_jq 2>/dev/null; then
    # Try vector search first (requires OPENAI_API_KEY + embeddings in DB)
    if [[ -n "${OPENAI_API_KEY:-}" ]]; then
      echo "Searching components (semantic): \"$query\""
      echo ""
      if _vector_search "$query"; then
        return
      fi
      echo "Vector search returned no results — falling back to text search..."
      echo ""
    fi

    # Text search fallback
    echo "Searching components (text match): \"$query\""
    echo ""

    local encoded_query
    encoded_query="$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$query" 2>/dev/null || echo "$query")"

    local results
    results="$(rest_get "components?or=(name.ilike.*${encoded_query}*,description.ilike.*${encoded_query}*)&select=type,name,description&order=type.asc,name.asc" 2>/dev/null || echo "[]")"

    local count
    count="$(echo "$results" | jq 'length')"
    if [[ "$count" -eq 0 ]]; then
      echo "No components found. Falling back to local grep..."
      echo ""
      _local_search "$query"
      return
    fi

    echo "$results" | jq -r '.[] | "[\(.type)] \(.name)\n  \(.description // "(no description)")\n"'
    echo "$count result(s) found in Supabase."
  else
    echo "Supabase not configured — searching locally..."
    echo ""
    _local_search "$query"
  fi
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

# ── Subcommand: refs ──────────────────────────────────────────────────────────
# Find all cross-references for a named component.

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

    echo "-- As source (things $name uses/depends on) --"
    local as_source
    as_source="$(rest_get "cross_references?source_name=eq.${encoded_name}&select=target_type,target_name,relationship&order=relationship.asc,target_name.asc" 2>/dev/null || echo "[]")"
    if [[ "$(echo "$as_source" | jq 'length')" -gt 0 ]]; then
      echo "$as_source" | jq -r '.[] | "  \(.relationship) -> [\(.target_type)] \(.target_name)"'
    else
      echo "  (none)"
    fi

    echo ""
    echo "-- As target (things that use/reference $name) --"
    local as_target
    as_target="$(rest_get "cross_references?target_name=eq.${encoded_name}&select=source_type,source_name,relationship&order=relationship.asc,source_name.asc" 2>/dev/null || echo "[]")"
    if [[ "$(echo "$as_target" | jq 'length')" -gt 0 ]]; then
      echo "$as_target" | jq -r '.[] | "  [\(.source_type)] \(.source_name) -> \(.relationship)"'
    else
      echo "  (none)"
    fi
  else
    echo "Supabase not configured — scanning locally for: \"$name\""
    echo ""
    echo "=== Files that reference '$name' ==="
    grep -rl "$name" \
      "$AGENTS_DIR" "$SKILLS_DIR" "$SCRIPTS_DIR" 2>/dev/null \
      | grep -v "__pycache__" \
      | while read -r f; do
          echo "  $f"
        done || echo "  (none)"
  fi
}

# ── Subcommand: learnings ─────────────────────────────────────────────────────
# Search session learnings by text match.

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
    results="$(rest_get "session_learnings?content.ilike.*${encoded_query}*&select=session_id,learning_type,content,created_at&order=created_at.desc&limit=20" 2>/dev/null || echo "[]")"

    local count
    count="$(echo "$results" | jq 'length')"
    if [[ "$count" -eq 0 ]]; then
      echo "No learnings found matching: \"$query\""
      return
    fi

    echo "$results" | jq -r '.[] | "[\(.learning_type)] \(.created_at | split("T")[0]) (session: \(.session_id))\n  \(.content)\n"'
    echo "$count result(s) found."
  else
    echo "Supabase not configured — searching agent memory locally..."
    echo ""
    local memory_dir="$PROJECT_DIR/.claude/agent-memory"
    if [[ -d "$memory_dir" ]]; then
      grep -rl "$query" "$memory_dir" 2>/dev/null | while read -r f; do
        echo "  $f"
        grep -n "$query" "$f" | head -3 | sed 's/^/    /'
        echo ""
      done || echo "  (none)"
    else
      echo "  No agent-memory directory found at $memory_dir"
    fi
  fi
}

# ── Subcommand: list ──────────────────────────────────────────────────────────
# List all components, optionally filtered by type.

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
    echo "Supabase not configured — listing local components..."
    echo ""

    if [[ -z "$type_filter" || "$type_filter" == "agent" ]]; then
      echo "=== Agents ==="
      ls "$AGENTS_DIR"/*.md 2>/dev/null | while read -r f; do echo "  $(basename "$f" .md)"; done || echo "  (none)"
      echo ""
    fi

    if [[ -z "$type_filter" || "$type_filter" == "skill" ]]; then
      echo "=== Skills ==="
      find "$SKILLS_DIR" -maxdepth 1 -mindepth 1 -type d 2>/dev/null | while read -r d; do echo "  $(basename "$d")"; done || echo "  (none)"
      echo ""
    fi

    if [[ -z "$type_filter" || "$type_filter" == "script" ]]; then
      echo "=== Scripts ==="
      ls "$SCRIPTS_DIR"/*.sh 2>/dev/null | while read -r f; do echo "  $(basename "$f")"; done || echo "  (none)"
      echo ""
    fi
  fi
}

# ── Dispatch ──────────────────────────────────────────────────────────────────

SUBCOMMAND="${1:-}"
shift || true

case "$SUBCOMMAND" in
  search)    cmd_search    "${1:-}" ;;
  refs)      cmd_refs      "${1:-}" ;;
  learnings) cmd_learnings "${1:-}" ;;
  list)      cmd_list      "${1:-}" ;;
  *)
    echo "APEX Framework — Knowledge Base Query"
    echo ""
    echo "Usage:"
    echo "  $0 search   <query>     Semantic/text search across all components"
    echo "  $0 refs     <name>      Cross-references for a named component"
    echo "  $0 learnings <query>    Search session learnings"
    echo "  $0 list     [type]      List components (type: agent|skill|script|hook|rule)"
    echo ""
    echo "Set SUPABASE_URL + SUPABASE_PUBLISHABLE_KEY for Supabase queries."
    echo "Without those, all commands fall back to local grep/find."
    exit 0
    ;;
esac
