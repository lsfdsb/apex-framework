# APEX Framework — Supabase RAG Integration

The APEX Framework works fully offline. This integration is **optional** — it adds a persistent, queryable knowledge layer: semantic search across framework components, cross-session learning retrieval, and an audit trail for pipeline gate decisions.

## What You Get

| Feature | Without Supabase | With Supabase |
|---|---|---|
| Framework awareness | `.manifest.json` (session-scoped) | Persistent DB, queryable via REST |
| Component search | `grep` on local files | Text + vector similarity search |
| Cross-references | `manifest.json` snapshot | Live graph, queryable by component |
| Session learnings | Agent memory files (per-machine) | Shared, searchable across machines |
| Gate audit trail | None | Logged to `session_learnings` |

---

## Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Wait for provisioning (about 1 minute).
3. Note your **Project URL** and **API keys** from Settings → API.

### 2. Enable pgvector

pgvector is available on all Supabase projects. The migration enables it automatically. No manual step needed.

### 3. Run the Migration

In the Supabase dashboard, open the **SQL Editor** and paste the contents of `migration.sql`, then click **Run**.

Alternatively, using the Supabase CLI:

```bash
supabase db push --db-url "postgresql://postgres:<password>@<host>:5432/postgres"
```

Or with `psql`:

```bash
psql "$DATABASE_URL" -f docs/supabase-rag/migration.sql
```

### 4. Configure Environment Variables

Add these to your shell profile (`~/.zshrc`, `~/.bashrc`) or a `.env` file that you source before running APEX scripts:

```bash
# Required for sync.sh (write access)
export SUPABASE_URL="https://xyzabcdef.supabase.co"
export SUPABASE_SECRET_KEY="sb_secret_..."    # secret key — keep secure, bypasses RLS

# Required for query.sh (read-only)
export SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."  # publishable key — read-only, safe to expose
```

> **Important (Nov 2025+)**: Supabase deprecated the legacy JWT-based `anon`/`service_role` keys. New projects use `sb_publishable_...` (replaces anon) and `sb_secret_...` (replaces service_role). These are NOT JWTs — they cannot be used in Authorization headers directly. The SDK handles this transparently. See [Supabase API Keys docs](https://supabase.com/docs/guides/api/api-keys) for details.
>
> **Security**: `SUPABASE_SECRET_KEY` must never be committed to git or exposed to clients. It bypasses RLS. The `SUPABASE_PUBLISHABLE_KEY` is safe to expose — it respects RLS policies.

---

## Syncing the Manifest

After any change to agents, skills, or scripts, regenerate the manifest and sync:

```bash
# 1. Regenerate the local manifest
bash .claude/scripts/manifest-generate.sh

# 2. Sync to Supabase
bash docs/supabase-rag/sync.sh

# Dry-run (no writes — useful for verification)
bash docs/supabase-rag/sync.sh --dry-run
```

The sync script is **idempotent** — running it multiple times is safe.

---

## Querying the Knowledge Base

```bash
# Search components by name or description
bash docs/supabase-rag/query.sh search "watcher agent"

# Find all cross-references for a component
bash docs/supabase-rag/query.sh refs "builder"

# Search session learnings
bash docs/supabase-rag/query.sh learnings "file loss"

# List all components (optionally filter by type)
bash docs/supabase-rag/query.sh list
bash docs/supabase-rag/query.sh list skill
```

Without `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`, all commands fall back to local `grep`/`find` — no Supabase dependency at runtime.

---

## Auto-Sync on Session Start

To sync automatically when a Claude Code session starts, add this to `.claude/settings.json` in the hooks section:

```json
"hooks": {
  "SessionStart": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "bash .claude/scripts/manifest-generate.sh && bash docs/supabase-rag/sync.sh 2>/dev/null || true",
          "timeout": 30
        }
      ]
    }
  ]
}
```

The `|| true` ensures a Supabase outage never blocks a session from starting.

---

## Storing Session Learnings

Learnings can be inserted directly via the Supabase REST API from any script or agent:

```bash
SESSION_ID="$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d)"

curl -s -X POST "$SUPABASE_URL/rest/v1/session_learnings" \
  -H "apikey: $SUPABASE_SECRET_KEY" \
  -H "Authorization: Bearer $SUPABASE_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"session_id\": \"$SESSION_ID\",
    \"learning_type\": \"correction\",
    \"content\": \"Always commit per file in worktree mode — uncommitted files are deleted on cleanup.\"
  }"
```

Learning types: `error`, `correction`, `success`, `pattern`.

---

## Semantic Search with Embeddings

The migration creates vector columns (`embedding vector(1536)`) and HNSW indexes. To populate embeddings:

1. Generate embeddings using the OpenAI Embeddings API (`text-embedding-3-small`, 1536 dimensions).
2. Update the `embedding` column via the REST API:

```bash
curl -s -X PATCH "$SUPABASE_URL/rest/v1/components?name=eq.builder&type=eq.agent" \
  -H "apikey: $SUPABASE_SECRET_KEY" \
  -H "Authorization: Bearer $SUPABASE_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"embedding\": [0.123, 0.456, ...]}"
```

3. Call the `match_components` RPC for vector similarity search:

```bash
curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/match_components" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_PUBLISHABLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query_embedding\": [...], \"match_threshold\": 0.7, \"match_count\": 5}"
```

---

## Edge Function — Pipeline Gate Server

`edge-function.ts` is a Supabase Edge Function that handles structured approval requests for the three APEX pipeline gates (PRD, Architecture, Ship). It logs each gate event to `session_learnings` for audit purposes.

### Deploy

```bash
# From your project root
supabase functions deploy apex-gates --no-verify-jwt
```

### Invoke

```bash
curl -X POST "https://<project>.supabase.co/functions/v1/apex-gates" \
  -H "Content-Type: application/json" \
  -d '{"gate": "prd", "summary": "Build a contact management CRM", "session_id": "abc123"}'
```

Response:

```json
{
  "gate": "prd",
  "decision": "approve",
  "notes": "Auto-approved by apex-gates edge function."
}
```

The default implementation auto-approves all gates and logs the events. For human-in-the-loop approval with a native Claude Code form, see `docs/mcp-elicitation-gates.md` for the full MCP Elicitation pattern.

---

## Schema Reference

### `components`

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| type | enum | `agent`, `skill`, `script`, `hook`, `rule` |
| name | text | Unique per type |
| description | text | From frontmatter or first comment |
| metadata | jsonb | Arbitrary — version, file path, tags |
| embedding | vector(1536) | Optional — for semantic search |
| created_at | timestamptz | Auto-set |
| updated_at | timestamptz | Auto-updated on change |

### `cross_references`

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| source_type | enum | Component type of the source |
| source_name | text | Component name of the source |
| target_type | enum | Component type of the target |
| target_name | text | Component name of the target |
| relationship | enum | `uses`, `references`, `depends_on` |

### `session_learnings`

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| session_id | text | Caller-supplied (git hash, date, UUID) |
| learning_type | enum | `error`, `correction`, `success`, `pattern` |
| content | text | The learning |
| embedding | vector(1536) | Optional — for semantic retrieval |
| created_at | timestamptz | Auto-set |

---

## Why This Is Optional

APEX is a local-first CLI framework. Every feature works without a network connection:

- Manifest → `.claude/.manifest.json` (generated on session start)
- Agent memory → `.claude/agent-memory/` (markdown files)
- Component search → `grep` across `.claude/agents/`, `.claude/skills/`

Supabase adds persistence across machines, semantic search, and an audit trail — useful for teams, useful as a showcase of the `/supabase` skill, but never required for solo use.
