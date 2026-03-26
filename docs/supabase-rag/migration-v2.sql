-- APEX Framework — RAG Migration v2
-- Adds: chunks table, hybrid search (tsvector + pgvector), gte-small (384-dim)
--
-- Run AFTER migration.sql (v1). Safe to run multiple times (IF NOT EXISTS).
--
-- Changes from v1:
--   - components.embedding: vector(1536) → vector(384) (gte-small, not OpenAI)
--   - session_learnings.embedding: vector(1536) → vector(384)
--   - NEW: chunks table for heading-based semantic chunks
--   - NEW: fts (tsvector) columns on components, session_learnings, chunks
--   - NEW: hybrid_search_chunks() and hybrid_search_components() RPCs with RRF
--
-- by Bueno & Claude · São Paulo, 2026

-- ══════════════════════════════════════════════════════════════════════════════
-- Step 1: Alter existing embedding columns from 1536 → 384
-- Safe if columns are currently empty (no data loss)
-- ══════════════════════════════════════════════════════════════════════════════

-- Drop dependent functions first (they reference the old vector size)
drop function if exists public.match_components(vector(1536), float, int);
drop function if exists public.match_learnings(vector(1536), float, int);

-- Drop old HNSW indexes (will recreate for 384-dim)
drop index if exists public.components_embedding_hnsw;
drop index if exists public.session_learnings_embedding_hnsw;

-- Alter column types
alter table public.components
  alter column embedding type vector(384) using null;

alter table public.session_learnings
  alter column embedding type vector(384) using null;

-- Recreate HNSW indexes for 384-dim
create index if not exists components_embedding_hnsw
  on public.components using hnsw (embedding vector_cosine_ops);

create index if not exists session_learnings_embedding_hnsw
  on public.session_learnings using hnsw (embedding vector_cosine_ops);

-- ══════════════════════════════════════════════════════════════════════════════
-- Step 2: Add full-text search columns to existing tables
-- Note: to_tsvector() is STABLE, not IMMUTABLE — cannot use generated columns.
-- We use triggers instead (standard Supabase pattern).
-- ══════════════════════════════════════════════════════════════════════════════

-- Components: weighted FTS (name=A, description=B)
alter table public.components
  add column if not exists fts tsvector;

create index if not exists components_fts_idx
  on public.components using gin (fts);

create or replace function public.components_fts_update() returns trigger
language plpgsql as $$
begin
  new.fts :=
    setweight(to_tsvector('english', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'B');
  return new;
end;
$$;

drop trigger if exists components_fts_trigger on public.components;
create trigger components_fts_trigger
  before insert or update on public.components
  for each row execute function public.components_fts_update();

-- Backfill existing rows
update public.components set fts =
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B');

-- Session learnings: FTS on content
alter table public.session_learnings
  add column if not exists fts tsvector;

create index if not exists session_learnings_fts_idx
  on public.session_learnings using gin (fts);

create or replace function public.session_learnings_fts_update() returns trigger
language plpgsql as $$
begin
  new.fts := to_tsvector('english', coalesce(new.content, ''));
  return new;
end;
$$;

drop trigger if exists session_learnings_fts_trigger on public.session_learnings;
create trigger session_learnings_fts_trigger
  before insert or update on public.session_learnings
  for each row execute function public.session_learnings_fts_update();

-- Backfill existing rows
update public.session_learnings set fts =
  to_tsvector('english', coalesce(content, ''))
where fts is null;

-- ══════════════════════════════════════════════════════════════════════════════
-- Step 3: Create chunks table
-- ══════════════════════════════════════════════════════════════════════════════

create table if not exists public.chunks (
  id            bigint primary key generated always as identity,
  component_type component_type not null,
  component_name text not null,
  chunk_index   int not null default 0,
  heading_path  text[] not null default '{}',
  content       text not null,
  metadata      jsonb not null default '{}',
  token_count   int,
  fts           tsvector,
  embedding     vector(384),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint chunks_unique unique (component_type, component_name, chunk_index)
);

-- FTS trigger for chunks
create or replace function public.chunks_fts_update() returns trigger
language plpgsql as $$
begin
  new.fts :=
    setweight(to_tsvector('english', coalesce(array_to_string(new.heading_path, ' '), '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.content, '')), 'B');
  return new;
end;
$$;

drop trigger if exists chunks_fts_trigger on public.chunks;
create trigger chunks_fts_trigger
  before insert or update on public.chunks
  for each row execute function public.chunks_fts_update();

-- Indexes
create index if not exists chunks_fts_idx
  on public.chunks using gin (fts);

create index if not exists chunks_embedding_hnsw
  on public.chunks using hnsw (embedding vector_cosine_ops);

create index if not exists chunks_component_idx
  on public.chunks (component_type, component_name);

-- Updated_at trigger
create or replace trigger chunks_updated_at
  before update on public.chunks
  for each row execute function set_updated_at();

-- RLS
alter table public.chunks enable row level security;

drop policy if exists "chunks_read_anon" on public.chunks;
create policy "chunks_read_anon"
  on public.chunks for select
  to anon, authenticated
  using (true);

drop policy if exists "chunks_write_service" on public.chunks;
create policy "chunks_write_service"
  on public.chunks for all
  to service_role
  using (true)
  with check (true);

-- ══════════════════════════════════════════════════════════════════════════════
-- Step 4: Hybrid search functions (RRF = Reciprocal Rank Fusion)
-- ══════════════════════════════════════════════════════════════════════════════

-- Hybrid search on chunks: keyword (tsvector) + semantic (pgvector) + RRF
create or replace function public.hybrid_search_chunks(
  query_text text,
  query_embedding vector(384) default null,
  match_count int default 10,
  full_text_weight float default 1.0,
  semantic_weight float default 1.0,
  rrf_k int default 50,
  filter_type component_type default null
)
returns table (
  id            bigint,
  component_type component_type,
  component_name text,
  heading_path  text[],
  content       text,
  metadata      jsonb,
  rank_score    float
)
language sql stable
as $$
  with full_text as (
    select
      c.id,
      row_number() over (
        order by ts_rank_cd(c.fts, websearch_to_tsquery('english', query_text)) desc
      ) as rank_ix
    from public.chunks c
    where c.fts @@ websearch_to_tsquery('english', query_text)
      and (filter_type is null or c.component_type = filter_type)
    order by rank_ix
    limit least(match_count, 30) * 2
  ),
  semantic as (
    select
      c.id,
      row_number() over (
        order by c.embedding <=> query_embedding
      ) as rank_ix
    from public.chunks c
    where c.embedding is not null
      and query_embedding is not null
      and (filter_type is null or c.component_type = filter_type)
    order by rank_ix
    limit least(match_count, 30) * 2
  )
  select
    c.id,
    c.component_type,
    c.component_name,
    c.heading_path,
    c.content,
    c.metadata,
    (
      coalesce(1.0 / (rrf_k + ft.rank_ix), 0.0) * full_text_weight +
      coalesce(1.0 / (rrf_k + s.rank_ix), 0.0) * semantic_weight
    ) as rank_score
  from full_text ft
    full outer join semantic s on ft.id = s.id
    join public.chunks c on coalesce(ft.id, s.id) = c.id
  order by rank_score desc
  limit least(match_count, 30);
$$;

-- Hybrid search on components (structured metadata)
create or replace function public.hybrid_search_components(
  query_text text,
  query_embedding vector(384) default null,
  match_count int default 10,
  full_text_weight float default 1.0,
  semantic_weight float default 1.0,
  rrf_k int default 50,
  filter_type component_type default null
)
returns table (
  id          uuid,
  type        component_type,
  name        text,
  description text,
  metadata    jsonb,
  rank_score  float
)
language sql stable
as $$
  with full_text as (
    select
      c.id,
      row_number() over (
        order by ts_rank_cd(c.fts, websearch_to_tsquery('english', query_text)) desc
      ) as rank_ix
    from public.components c
    where c.fts @@ websearch_to_tsquery('english', query_text)
      and (filter_type is null or c.type = filter_type)
    order by rank_ix
    limit least(match_count, 30) * 2
  ),
  semantic as (
    select
      c.id,
      row_number() over (
        order by c.embedding <=> query_embedding
      ) as rank_ix
    from public.components c
    where c.embedding is not null
      and query_embedding is not null
      and (filter_type is null or c.type = filter_type)
    order by rank_ix
    limit least(match_count, 30) * 2
  )
  select
    c.id,
    c.type,
    c.name,
    c.description,
    c.metadata,
    (
      coalesce(1.0 / (rrf_k + ft.rank_ix), 0.0) * full_text_weight +
      coalesce(1.0 / (rrf_k + s.rank_ix), 0.0) * semantic_weight
    ) as rank_score
  from full_text ft
    full outer join semantic s on ft.id = s.id
    join public.components c on coalesce(ft.id, s.id) = c.id
  order by rank_score desc
  limit least(match_count, 30);
$$;

-- Simple keyword-only search for chunks (no embedding needed)
create or replace function public.search_chunks_text(
  query_text text,
  match_count int default 10,
  filter_type component_type default null
)
returns table (
  id            bigint,
  component_type component_type,
  component_name text,
  heading_path  text[],
  content       text,
  metadata      jsonb,
  rank          float
)
language sql stable
as $$
  select
    c.id,
    c.component_type,
    c.component_name,
    c.heading_path,
    c.content,
    c.metadata,
    ts_rank_cd(c.fts, websearch_to_tsquery('english', query_text)) as rank
  from public.chunks c
  where c.fts @@ websearch_to_tsquery('english', query_text)
    and (filter_type is null or c.component_type = filter_type)
  order by rank desc
  limit match_count;
$$;

-- Replaced match_components for new 384-dim vectors
create or replace function public.match_components(
  query_embedding vector(384),
  match_threshold float default 0.5,
  match_count int default 10
)
returns table (
  id          uuid,
  type        component_type,
  name        text,
  description text,
  metadata    jsonb,
  similarity  float
)
language sql stable
as $$
  select
    c.id, c.type, c.name, c.description, c.metadata,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.components c
  where c.embedding is not null
    and 1 - (c.embedding <=> query_embedding) > match_threshold
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

-- Replaced match_learnings for new 384-dim vectors
create or replace function public.match_learnings(
  query_embedding vector(384),
  match_threshold float default 0.5,
  match_count int default 10
)
returns table (
  id            uuid,
  session_id    text,
  learning_type learning_type,
  content       text,
  similarity    float
)
language sql stable
as $$
  select
    l.id, l.session_id, l.learning_type, l.content,
    1 - (l.embedding <=> query_embedding) as similarity
  from public.session_learnings l
  where l.embedding is not null
    and 1 - (l.embedding <=> query_embedding) > match_threshold
  order by l.embedding <=> query_embedding
  limit match_count;
$$;
