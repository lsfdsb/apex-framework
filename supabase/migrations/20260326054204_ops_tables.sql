-- APEX Framework — Supabase OPS Migration v3
-- Adds operational tables for sessions, tasks, agents, pipeline, quality, changelog.
-- Run AFTER migration-v2.sql. Safe to run multiple times (IF NOT EXISTS).
--
-- These tables persist all OPS data that was previously local-only (.apex/state/*.json).
-- Hook scripts dual-write: local JSON first, then background curl to Supabase.
--
-- by Bueno & Claude · São Paulo, 2026

-- ══════════════════════════════════════════════════════════════════════════════
-- Prerequisite: updated_at trigger function (idempotent — safe if already exists from v1)
-- ══════════════════════════════════════════════════════════════════════════════

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ══════════════════════════════════════════════════════════════════════════════
-- Enums
-- ══════════════════════════════════════════════════════════════════════════════

do $$ begin
  create type task_tag as enum ('feat','fix','refactor','docs','chore','perf','a11y','security','test');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type task_column as enum ('backlog','todo','in-progress','review','done');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type task_phase as enum ('P0','P1','P2');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type agent_status as enum ('idle','active','completed','failed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type pipeline_status as enum ('idle','active','complete','failed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type changelog_category as enum ('added','changed','fixed','removed');
exception when duplicate_object then null;
end $$;

-- ══════════════════════════════════════════════════════════════════════════════
-- Table: sessions
-- Tracks Claude Code sessions. Created by session-state-writer.sh on SessionStart.
-- ══════════════════════════════════════════════════════════════════════════════

create table if not exists public.sessions (
  id            uuid primary key default gen_random_uuid(),
  started_at    timestamptz not null default now(),
  ended_at      timestamptz,
  branch        text,
  model         text not null default 'opus',
  context_used  int not null default 0,
  context_max   int not null default 1000000,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.sessions is
  'Claude Code sessions — one row per session, created by session-state-writer.sh hook.';

-- ══════════════════════════════════════════════════════════════════════════════
-- Table: tasks
-- Tasks survive sessions (SET NULL not CASCADE).
-- ══════════════════════════════════════════════════════════════════════════════

create table if not exists public.tasks (
  id                  uuid primary key default gen_random_uuid(),
  project_name        text not null default 'APEX Session',
  task_id             text not null,
  title               text not null,
  description         text not null default '',
  tag                 task_tag,
  "column"            task_column not null default 'todo',
  phase               task_phase not null default 'P0',
  dri                 text not null default 'builder',
  acceptance_criteria jsonb not null default '[]',
  files               text[] not null default '{}',
  blocked_by          text[] not null default '{}',
  blocks              text[] not null default '{}',
  session_id          uuid references public.sessions(id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint tasks_project_task_unique unique (project_name, task_id)
);

comment on table public.tasks is
  'APEX task board — tasks persist across sessions (session_id SET NULL on session delete).';

-- ══════════════════════════════════════════════════════════════════════════════
-- Table: agents
-- One agent per name per session.
-- ══════════════════════════════════════════════════════════════════════════════

create table if not exists public.agents (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references public.sessions(id) on delete cascade,
  name            text not null,
  status          agent_status not null default 'idle',
  model           text not null default 'sonnet',
  current_task    text,
  thought_stream  jsonb not null default '[]',
  started_at      timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint agents_session_name_unique unique (session_id, name)
);

comment on table public.agents is
  'Agent activity per session — one row per agent per session, upserted by agent-state-writer.sh.';

-- ══════════════════════════════════════════════════════════════════════════════
-- Table: pipeline_phases
-- 7 phases per session, upserted by pipeline-state-writer.sh.
-- ══════════════════════════════════════════════════════════════════════════════

create table if not exists public.pipeline_phases (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references public.sessions(id) on delete cascade,
  phase_id        int not null,
  name            text not null,
  status          pipeline_status not null default 'idle',
  started_at      timestamptz,
  completed_at    timestamptz,
  gate_approved   boolean,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint pipeline_session_phase_unique unique (session_id, phase_id)
);

comment on table public.pipeline_phases is
  'Pipeline phase state per session — 7 rows per session, upserted by pipeline-state-writer.sh.';

-- ══════════════════════════════════════════════════════════════════════════════
-- Table: quality_gates
-- One row per session with score and gate details.
-- ══════════════════════════════════════════════════════════════════════════════

create table if not exists public.quality_gates (
  id                uuid primary key default gen_random_uuid(),
  session_id        uuid not null references public.sessions(id) on delete cascade,
  score             int not null default 0,
  phases            jsonb not null default '[]',
  additional_gates  jsonb not null default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint quality_session_unique unique (session_id)
);

comment on table public.quality_gates is
  'QA quality gate results per session — score, phase timings, and gate statuses.';

-- ══════════════════════════════════════════════════════════════════════════════
-- Table: changelog_entries
-- Structured changelog for automated sync.
-- ══════════════════════════════════════════════════════════════════════════════

create table if not exists public.changelog_entries (
  id          uuid primary key default gen_random_uuid(),
  version     text not null,
  category    changelog_category not null,
  title       text not null,
  description text not null default '',
  pr_number   int,
  pr_url      text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.changelog_entries is
  'Structured CHANGELOG entries — synced by commit hooks for automated release notes.';

-- ══════════════════════════════════════════════════════════════════════════════
-- updated_at triggers (reuse set_updated_at from migration v1)
-- ══════════════════════════════════════════════════════════════════════════════

create or replace trigger sessions_updated_at
  before update on public.sessions
  for each row execute function public.set_updated_at();

create or replace trigger tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

create or replace trigger agents_updated_at
  before update on public.agents
  for each row execute function public.set_updated_at();

create or replace trigger pipeline_phases_updated_at
  before update on public.pipeline_phases
  for each row execute function public.set_updated_at();

create or replace trigger quality_gates_updated_at
  before update on public.quality_gates
  for each row execute function public.set_updated_at();

create or replace trigger changelog_entries_updated_at
  before update on public.changelog_entries
  for each row execute function public.set_updated_at();

-- ══════════════════════════════════════════════════════════════════════════════
-- Indexes
-- ══════════════════════════════════════════════════════════════════════════════

-- Sessions
create index if not exists sessions_active_idx on public.sessions (active) where active = true;

-- Tasks
create index if not exists tasks_session_idx on public.tasks (session_id);
create index if not exists tasks_column_idx on public.tasks ("column");
create index if not exists tasks_phase_idx on public.tasks (phase);
create index if not exists tasks_dri_idx on public.tasks (dri);

-- Agents
create index if not exists agents_session_idx on public.agents (session_id);
create index if not exists agents_status_idx on public.agents (status);

-- Pipeline phases
create index if not exists pipeline_session_idx on public.pipeline_phases (session_id);

-- Quality gates
create index if not exists quality_session_idx on public.quality_gates (session_id);

-- Changelog
create index if not exists changelog_version_idx on public.changelog_entries (version);

-- ══════════════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ══════════════════════════════════════════════════════════════════════════════

alter table public.sessions         enable row level security;
alter table public.tasks            enable row level security;
alter table public.agents           enable row level security;
alter table public.pipeline_phases  enable row level security;
alter table public.quality_gates    enable row level security;
alter table public.changelog_entries enable row level security;

-- anon / authenticated: read-only
create policy "anon_read_sessions"
  on public.sessions for select to anon, authenticated using (true);

create policy "anon_read_tasks"
  on public.tasks for select to anon, authenticated using (true);

create policy "anon_read_agents"
  on public.agents for select to anon, authenticated using (true);

create policy "anon_read_pipeline_phases"
  on public.pipeline_phases for select to anon, authenticated using (true);

create policy "anon_read_quality_gates"
  on public.quality_gates for select to anon, authenticated using (true);

create policy "anon_read_changelog_entries"
  on public.changelog_entries for select to anon, authenticated using (true);

-- service_role: full CRUD (used by hook scripts and edge functions)
create policy "service_write_sessions"
  on public.sessions for all to service_role using (true) with check (true);

create policy "service_write_tasks"
  on public.tasks for all to service_role using (true) with check (true);

create policy "service_write_agents"
  on public.agents for all to service_role using (true) with check (true);

create policy "service_write_pipeline_phases"
  on public.pipeline_phases for all to service_role using (true) with check (true);

create policy "service_write_quality_gates"
  on public.quality_gates for all to service_role using (true) with check (true);

create policy "service_write_changelog_entries"
  on public.changelog_entries for all to service_role using (true) with check (true);

-- ══════════════════════════════════════════════════════════════════════════════
-- RPC Functions
-- ══════════════════════════════════════════════════════════════════════════════

-- Get active session with all related data in one call
create or replace function public.get_active_session()
returns json
language sql stable
as $$
  select json_build_object(
    'session', row_to_json(s),
    'agents', coalesce(
      (select json_agg(row_to_json(a) order by a.started_at desc)
       from public.agents a where a.session_id = s.id),
      '[]'::json
    ),
    'pipeline', coalesce(
      (select json_agg(row_to_json(p) order by p.phase_id)
       from public.pipeline_phases p where p.session_id = s.id),
      '[]'::json
    ),
    'quality', (
      select row_to_json(q)
      from public.quality_gates q where q.session_id = s.id
      limit 1
    )
  )
  from public.sessions s
  where s.active = true
  order by s.started_at desc
  limit 1;
$$;

-- Get tasks for a specific session
create or replace function public.get_session_tasks(p_session_id uuid)
returns json
language sql stable
as $$
  select coalesce(
    json_agg(row_to_json(t) order by t.created_at),
    '[]'::json
  )
  from public.tasks t
  where t.session_id = p_session_id;
$$;
