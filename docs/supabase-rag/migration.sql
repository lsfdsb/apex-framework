-- APEX Framework — Supabase RAG Migration
-- Run this in your Supabase project via the SQL Editor or `supabase db push`
-- Requires: pgvector extension (available on all Supabase projects)

-- ============================================================
-- Extensions
-- ============================================================

create extension if not exists vector with schema extensions;

-- ============================================================
-- Enums
-- ============================================================

create type component_type as enum ('agent', 'skill', 'script', 'hook', 'rule');

create type relationship_type as enum ('uses', 'references', 'depends_on');

create type learning_type as enum ('error', 'correction', 'success', 'pattern');

-- ============================================================
-- Table: components
-- Stores framework component metadata with embeddings
-- ============================================================

create table if not exists public.components (
  id           uuid primary key default gen_random_uuid(),
  type         component_type not null,
  name         text not null,
  description  text,
  metadata     jsonb not null default '{}',
  embedding    vector(1536),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint components_name_type_unique unique (name, type)
);

comment on table public.components is
  'APEX framework components (agents, skills, scripts, hooks, rules) with optional embeddings for semantic search.';

comment on column public.components.metadata is
  'Arbitrary JSON metadata — e.g., {"file":"builder.md","skills":["design-system","supabase"],"version":"5.17.0"}';

comment on column public.components.embedding is
  'text-embedding-3-small (1536-dim) of name + description + metadata summary.';

-- ============================================================
-- Table: cross_references
-- Tracks which components use / reference / depend on others
-- ============================================================

create table if not exists public.cross_references (
  id           uuid primary key default gen_random_uuid(),
  source_type  component_type not null,
  source_name  text not null,
  target_type  component_type not null,
  target_name  text not null,
  relationship relationship_type not null,
  created_at   timestamptz not null default now(),

  constraint cross_references_unique unique (source_name, source_type, target_name, target_type, relationship)
);

comment on table public.cross_references is
  'Directed edges in the APEX component dependency graph.';

-- ============================================================
-- Table: session_learnings
-- Persists per-session learnings with embeddings for RAG
-- ============================================================

create table if not exists public.session_learnings (
  id           uuid primary key default gen_random_uuid(),
  session_id   text not null,
  learning_type learning_type not null,
  content      text not null,
  embedding    vector(1536),
  created_at   timestamptz not null default now()
);

comment on table public.session_learnings is
  'Agent learnings captured during sessions — errors, corrections, successes, and reusable patterns.';

comment on column public.session_learnings.session_id is
  'Caller-supplied identifier, e.g. git commit hash, ISO date, or UUID.';

-- ============================================================
-- updated_at trigger for components
-- ============================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger components_updated_at
  before update on public.components
  for each row execute function public.set_updated_at();

-- ============================================================
-- Indexes
-- ============================================================

-- Vector similarity indexes (HNSW — fast approximate nearest neighbour)
create index if not exists components_embedding_hnsw
  on public.components
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

create index if not exists session_learnings_embedding_hnsw
  on public.session_learnings
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- Conventional indexes
create index if not exists components_type_idx        on public.components (type);
create index if not exists components_name_idx        on public.components (name);
create index if not exists cross_references_source_idx on public.cross_references (source_name, source_type);
create index if not exists cross_references_target_idx on public.cross_references (target_name, target_type);
create index if not exists session_learnings_session_idx on public.session_learnings (session_id);
create index if not exists session_learnings_type_idx   on public.session_learnings (learning_type);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.components        enable row level security;
alter table public.cross_references  enable row level security;
alter table public.session_learnings enable row level security;

-- anon / authenticated: read-only
create policy "anon_read_components"
  on public.components for select
  to anon, authenticated
  using (true);

create policy "anon_read_cross_references"
  on public.cross_references for select
  to anon, authenticated
  using (true);

create policy "anon_read_session_learnings"
  on public.session_learnings for select
  to anon, authenticated
  using (true);

-- service_role: full write access (used by sync.sh and edge functions)
create policy "service_write_components"
  on public.components for all
  to service_role
  using (true)
  with check (true);

create policy "service_write_cross_references"
  on public.cross_references for all
  to service_role
  using (true)
  with check (true);

create policy "service_write_session_learnings"
  on public.session_learnings for all
  to service_role
  using (true)
  with check (true);

-- ============================================================
-- Semantic search helper functions
-- ============================================================

-- Match components by embedding similarity
create or replace function public.match_components(
  query_embedding vector(1536),
  match_threshold float  default 0.7,
  match_count     int    default 10
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
    c.id,
    c.type,
    c.name,
    c.description,
    c.metadata,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.components c
  where c.embedding is not null
    and 1 - (c.embedding <=> query_embedding) > match_threshold
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

-- Match session learnings by embedding similarity
create or replace function public.match_learnings(
  query_embedding vector(1536),
  match_threshold float  default 0.7,
  match_count     int    default 10
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
    l.id,
    l.session_id,
    l.learning_type,
    l.content,
    1 - (l.embedding <=> query_embedding) as similarity
  from public.session_learnings l
  where l.embedding is not null
    and 1 - (l.embedding <=> query_embedding) > match_threshold
  order by l.embedding <=> query_embedding
  limit match_count;
$$;
