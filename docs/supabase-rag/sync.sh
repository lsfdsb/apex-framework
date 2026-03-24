#!/usr/bin/env bash
# sync.sh — Sync .claude/.manifest.json to Supabase
#
# Usage:
#   ./docs/supabase-rag/sync.sh
#   ./docs/supabase-rag/sync.sh --dry-run
#
# Required env vars:
#   SUPABASE_URL          e.g. https://xyzabc.supabase.co
#   SUPABASE_SECRET_KEY  secret key (sb_secret_... format, never the publishable key)
#
# Dependencies: bash, curl, jq
# Idempotent: safe to run multiple times (upsert on unique constraints)

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
MANIFEST="$PROJECT_DIR/.claude/.manifest.json"
DRY_RUN=false

# ── Argument parsing ──────────────────────────────────────────────────────────

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

if [[ -z "${SUPABASE_URL:-}" ]]; then
  echo "ERROR: SUPABASE_URL is not set." >&2
  exit 1
fi

if [[ -z "${SUPABASE_SECRET_KEY:-}" ]]; then
  echo "ERROR: SUPABASE_SECRET_KEY is not set." >&2
  exit 1
fi

if [[ ! -f "$MANIFEST" ]]; then
  echo "ERROR: Manifest not found at $MANIFEST" >&2
  echo "Run: bash .claude/scripts/manifest-generate.sh" >&2
  exit 1
fi

SUPABASE_URL="${SUPABASE_URL%/}"  # strip trailing slash
REST_URL="$SUPABASE_URL/rest/v1"
VERSION="$(cat "$PROJECT_DIR/VERSION" 2>/dev/null || echo "unknown")"

echo "APEX Framework — Supabase Sync"
echo "  Manifest : $MANIFEST"
echo "  Target   : $SUPABASE_URL"
echo "  Version  : $VERSION"
[[ "$DRY_RUN" == "true" ]] && echo "  Mode     : DRY RUN (no writes)"
echo ""

# ── Helpers ───────────────────────────────────────────────────────────────────

# upsert_component <json-object>
# Upserts a single row into the components table via PostgREST.
upsert_component() {
  local payload="$1"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "  [dry-run] UPSERT component: $(echo "$payload" | jq -r '.name')"
    return
  fi

  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$REST_URL/components" \
    -H "apikey: $SUPABASE_SECRET_KEY" \
    -H "Authorization: Bearer $SUPABASE_SECRET_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: resolution=merge-duplicates,return=minimal" \
    -d "$payload")

  if [[ "$http_code" -lt 200 || "$http_code" -ge 300 ]]; then
    echo "  WARN: upsert_component returned HTTP $http_code for: $(echo "$payload" | jq -r '.name')" >&2
  fi
}

# upsert_ref <json-object>
# Upserts a single row into the cross_references table.
upsert_ref() {
  local payload="$1"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "  [dry-run] UPSERT ref: $(echo "$payload" | jq -r '.source_name') -> $(echo "$payload" | jq -r '.target_name')"
    return
  fi

  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$REST_URL/cross_references" \
    -H "apikey: $SUPABASE_SECRET_KEY" \
    -H "Authorization: Bearer $SUPABASE_SECRET_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: resolution=merge-duplicates,return=minimal" \
    -d "$payload")

  if [[ "$http_code" -lt 200 || "$http_code" -ge 300 ]]; then
    echo "  WARN: upsert_ref returned HTTP $http_code for payload: $payload" >&2
  fi
}

# ── Load manifest ─────────────────────────────────────────────────────────────

MANIFEST_JSON="$(cat "$MANIFEST")"
GENERATED="$(echo "$MANIFEST_JSON" | jq -r '.generated')"
REPO_TYPE="$(echo "$MANIFEST_JSON" | jq -r '.repo_type')"

echo "Manifest generated: $GENERATED (repo_type: $REPO_TYPE)"
echo ""

# ── Sync agents ───────────────────────────────────────────────────────────────

echo "Syncing agents..."
while IFS= read -r name; do
  [[ -z "$name" ]] && continue
  file="$PROJECT_DIR/.claude/agents/${name}.md"
  description=""
  if [[ -f "$file" ]]; then
    description="$(grep -m1 '^description:' "$file" 2>/dev/null | sed 's/^description: *//' || echo "")"
  fi
  payload="$(jq -n \
    --arg type "agent" \
    --arg name "$name" \
    --arg description "$description" \
    --argjson metadata "{\"version\":\"$VERSION\",\"file\":\"${name}.md\"}" \
    '{type: $type, name: $name, description: $description, metadata: $metadata}')"
  echo "  agent: $name"
  upsert_component "$payload"
done < <(echo "$MANIFEST_JSON" | jq -r '.components.agents[]')

# ── Sync skills ───────────────────────────────────────────────────────────────

echo "Syncing skills..."
while IFS= read -r name; do
  [[ -z "$name" ]] && continue
  skill_file="$PROJECT_DIR/.claude/skills/${name}/SKILL.md"
  description=""
  if [[ -f "$skill_file" ]]; then
    description="$(grep -m1 '^description:' "$skill_file" 2>/dev/null | sed 's/^description: *//' || echo "")"
  fi
  payload="$(jq -n \
    --arg type "skill" \
    --arg name "$name" \
    --arg description "$description" \
    --argjson metadata "{\"version\":\"$VERSION\",\"dir\":\"skills/$name\"}" \
    '{type: $type, name: $name, description: $description, metadata: $metadata}')"
  echo "  skill: $name"
  upsert_component "$payload"
done < <(echo "$MANIFEST_JSON" | jq -r '.components.skills[]')

# ── Sync scripts ──────────────────────────────────────────────────────────────

echo "Syncing scripts..."
while IFS= read -r name; do
  [[ -z "$name" ]] && continue
  script_file="$PROJECT_DIR/.claude/scripts/$name"
  description=""
  if [[ -f "$script_file" ]]; then
    description="$(grep -m1 '^#.*—' "$script_file" 2>/dev/null | sed 's/^# *//' || echo "")"
  fi
  payload="$(jq -n \
    --arg type "script" \
    --arg name "$name" \
    --arg description "$description" \
    --argjson metadata "{\"version\":\"$VERSION\",\"file\":\"scripts/$name\"}" \
    '{type: $type, name: $name, description: $description, metadata: $metadata}')"
  echo "  script: $name"
  upsert_component "$payload"
done < <(echo "$MANIFEST_JSON" | jq -r '.components.scripts[]')

# ── Sync cross-references (agent → skill) ────────────────────────────────────

echo ""
echo "Syncing cross-references..."
while IFS= read -r agent_name; do
  [[ -z "$agent_name" ]] && continue
  while IFS= read -r skill_name; do
    [[ -z "$skill_name" ]] && continue
    payload="$(jq -n \
      --arg source_type "agent" \
      --arg source_name "$agent_name" \
      --arg target_type "skill" \
      --arg target_name "$skill_name" \
      --arg relationship "uses" \
      '{source_type: $source_type, source_name: $source_name, target_type: $target_type, target_name: $target_name, relationship: $relationship}')"
    echo "  ref: agent/$agent_name -> skill/$skill_name (uses)"
    upsert_ref "$payload"
  done < <(echo "$MANIFEST_JSON" | jq -r --arg a "$agent_name" '.cross_references.agent_skills[$a] // [] | .[]')
done < <(echo "$MANIFEST_JSON" | jq -r '.cross_references.agent_skills | keys[]')

# ── Done ──────────────────────────────────────────────────────────────────────

echo ""
echo "Sync complete."
