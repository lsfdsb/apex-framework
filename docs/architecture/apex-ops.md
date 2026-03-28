# APEX Ops — System Architecture

**Version**: 1.0 | **Date**: 2026-03-28 | **Status**: Draft
**APEX Version**: 6.0 (major — framework repo becomes monorepo)

---

## 1. Requirements Extraction

| Dimension           | Value                    | Source   |
| ------------------- | ------------------------ | -------- |
| Target users (6mo)  | 50                       | PRD S9   |
| Target users (12mo) | 500                      | PRD S9   |
| Target users (24mo) | 5,000                    | PRD S9   |
| Read/write ratio    | ~90/10 (dashboard-heavy) | Inferred |
| Latency target      | Page < 2s, API < 200ms   | PRD S9   |
| Availability        | 99.5%+                   | PRD S9   |

**Architecture tier**: Modular monolith (next-forge monorepo). PostgreSQL (Neon). No Redis at launch.

---

## 2. Architecture Decisions

### ADR-001: Turborepo Monorepo via next-forge

- **Decision**: All apps are independent Next.js 16 deployments. Shared code in `packages/`.
- **Rejected**: Nx (heavier), single Next.js app (violates persona separation)

### ADR-002: Prisma + Neon PostgreSQL

- **Decision**: Prisma ORM, Neon serverless driver, built-in connection pooling.
- **Rejected**: Drizzle (less mature ecosystem), Supabase (extra layer)

### ADR-003: Clerk for Auth

- **Decision**: JWT via `@clerk/nextjs`. GitHub OAuth for repo access.
- **Trade-off**: Vendor lock-in accepted for zero custom auth code.

### ADR-004: REST Fire-and-Forget for Agent Reporting

- **Decision**: `POST /api/v1/events` with API key. Hooks fire `nohup curl &`.
- **Upgrade path**: WebSocket/SSE for real-time push in P1.

### ADR-005: Two Palettes, One Component Library

- **Decision**: `saas-blue` for dashboard, `creative-warm` for public site. Palette at app level via CSS vars.

---

## 3. Database Schema (9 tables)

```sql
-- users: Clerk-linked accounts
-- projects: Registered APEX projects (github_repo_url unique)
-- memberships: User-project roles (owner/collaborator/viewer)
-- sessions: APEX pipeline sessions (project_id, started_at, model, context_used)
-- pipeline_runs: Execution records (session_id, phase, status, quality_score)
-- gate_results: Quality gate outcomes (pipeline_run_id, gate_name, passed, details jsonb)
-- agent_activities: Agent action logs (session_id, agent_name, action, tokens_used)
-- config_snapshots: Configuration history (project_id, config_type, content jsonb)
-- api_keys: Per-project keys for event ingestion (key_hash, prefix, revoked_at)
```

All tables: UUID PKs, created_at/updated_at, soft deletes where applicable.

---

## 4. API Design

Base: `/api/v1/`. Response format: `{ data: T, meta?: {...} }` or `{ error: { code, message } }`.

| Method | Endpoint                         | Auth              | Rate Limit  |
| ------ | -------------------------------- | ----------------- | ----------- |
| POST   | /api/v1/events                   | X-Apex-Key        | 100/min/key |
| GET    | /api/v1/projects                 | Clerk JWT         | 60/min      |
| POST   | /api/v1/projects                 | Clerk JWT         | 10/min      |
| GET    | /api/v1/projects/:id             | Clerk JWT         | 60/min      |
| GET    | /api/v1/projects/:id/sessions    | Clerk JWT         | 60/min      |
| GET    | /api/v1/projects/:id/quality     | Clerk JWT         | 60/min      |
| GET    | /api/v1/projects/:id/agents      | Clerk JWT         | 60/min      |
| PUT    | /api/v1/projects/:id/config      | Clerk JWT (owner) | 20/min      |
| POST   | /api/v1/projects/:id/keys        | Clerk JWT (owner) | 5/min       |
| DELETE | /api/v1/projects/:id/keys/:keyId | Clerk JWT (owner) | 10/min      |
| GET    | /api/health                      | None              | Unlimited   |

Pagination: `?page=1&limit=20` (max 100).

---

## 5. Integration Architecture

| Integration | Auth                          | Service Layer  | Mock Mode                     |
| ----------- | ----------------------------- | -------------- | ----------------------------- |
| GitHub API  | GitHub App installation token | `@apex/github` | `GITHUB_MOCK=true` → fixtures |
| Clerk       | JWT + API key                 | `@apex/auth`   | Clerk test mode               |
| Neon        | Connection string             | `@apex/db`     | Neon branch                   |
| Resend (P1) | API key                       | `@apex/email`  | Test mode                     |
| Stripe (P2) | API key + webhooks            | Deferred       | Deferred                      |

---

## 6. Component Architecture

### Reuse from Design DNA (30 components promoted)

**Primitives**: Button, Card, Badge, StatCard, DataTable, EmptyState, Input, Skeleton, SectionHeader, ChartCard, Avatar, ProgressBar, ProgressRing, ThemeToggle, Tooltip, LoadingSpinner, NotificationDot, PageReveal, Toggle, AnimatedCheckmark

**Patterns**: KanbanColumn, Tabs, Modal, Pagination, Accordion, DnaBackground

**Layout**: PageShell, Sidebar, Header, MobileNav

### New Components (16 to build)

**Shared**: FilterBar

**Page-specific**: Hero, FeatureGrid, PipelineDiagram, SkillCard, AgentCard, ProjectCard, TaskKanban, ConfigEditor, SessionTimeline, GateResultRow, PaletteSwitcher, ComponentPreview, MDXRenderer, DocsSidebar, TOC, QuickActions, RecentActivity

**Reuse rate**: 65% (30 reused / 46 total)

---

## 7. Page → Persona Map

| Route                        | App  | Persona | Key Components                         |
| ---------------------------- | ---- | ------- | -------------------------------------- |
| `/`                          | web  | Jordan  | Hero, FeatureGrid, Header              |
| `/dna`                       | web  | Jordan  | PaletteSwitcher, ComponentPreview      |
| `/pipeline`                  | web  | Jordan  | PipelineDiagram, PhaseCard             |
| `/docs`                      | docs | Jordan  | MDXRenderer, DocsSidebar, TOC          |
| `/docs/skills`               | docs | Jordan  | SkillCard, FilterBar                   |
| `/docs/agents`               | docs | Jordan  | AgentCard, FilterBar                   |
| `/dashboard`                 | app  | Alex    | ProjectCard, StatCard, EmptyState      |
| `/dashboard/[id]`            | app  | Alex    | StatCard, RecentActivity, QuickActions |
| `/dashboard/[id]/tasks`      | app  | Alex    | TaskKanban, FilterBar                  |
| `/dashboard/[id]/monitoring` | app  | Alex    | DataTable, ChartCard, SessionTimeline  |
| `/dashboard/[id]/config`     | app  | Alex    | ConfigEditor, Tabs, Modal              |
| `/dashboard/[id]/quality`    | app  | Alex    | ChartCard, GateResultRow, DataTable    |

---

## 8. Monorepo Structure

```
apex-framework/
├── .claude/                    ← APEX Framework (unchanged)
├── CLAUDE.md                   ← Project constitution
├── docs/                       ← Specs, Design DNA, guides (existing)
├── apps/
│   ├── web/                    ← Public showcase (creative-warm palette)
│   ├── app/                    ← Control plane (saas-blue palette)
│   ├── api/                    ← Backend API routes
│   ├── docs/                   ← Documentation (MDX)
│   ├── email/                  ← React Email templates
│   ├── storybook/              ← Component workshop
│   └── studio/                 ← Database visualization
├── packages/
│   ├── @apex/ui/               ← Design system (promoted DNA starters + tokens)
│   ├── @apex/db/               ← Prisma + service layer
│   ├── @apex/auth/             ← Clerk abstraction
│   ├── @apex/config/           ← Env validation (zod) + constants
│   ├── @apex/github/           ← GitHub API service + fixtures
│   ├── @apex/logger/           ← Structured logging (pino)
│   └── @apex/analytics/        ← Usage tracking
└── turbo.json                  ← Turborepo pipeline config
```

Each app gets its own ~45-line CLAUDE.md (per Mastery Guide).

---

## 9. Mobile-First + Dark/Light

- 320px baseline, breakpoints at 640/768/1024/1280px
- Dark default (saas-blue `--bg: #09090b`), light mode designed simultaneously
- Semantic tokens only — never raw hex in components
- `prefers-reduced-motion` respected

---

## 10. Observability

| Concern        | Tool                                      |
| -------------- | ----------------------------------------- |
| Error tracking | Sentry (`@sentry/nextjs`)                 |
| Analytics      | Vercel Analytics (zero-config)            |
| Performance    | Vercel Speed Insights                     |
| Logging        | pino (structured JSON) via `@apex/logger` |
| Uptime         | `/api/health` endpoint                    |

---

## 11. Dependencies

### Core

next ^16, react ^19, typescript ^5.7, turborepo ^2, tailwindcss ^4, @clerk/nextjs ^6, prisma ^6, @neondatabase/serverless ^1, @sentry/nextjs ^9, zod ^3.23, lucide-react ^1.6, pino ^9

### Vercel

@vercel/analytics ^1.4, @vercel/speed-insights ^1.1

### P1

resend ^4, @react-email/components ^0.0.30

### P2

stripe ^17

---

## 12. Environment Variables

| Variable                          | Required | Description                       |
| --------------------------------- | -------- | --------------------------------- |
| DATABASE_URL                      | yes      | Neon connection string            |
| CLERK_SECRET_KEY                  | yes      | Clerk backend key                 |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | yes      | Clerk frontend key                |
| NEXT_PUBLIC_CLERK_SIGN_IN_URL     | yes      | `/sign-in`                        |
| NEXT_PUBLIC_CLERK_SIGN_UP_URL     | yes      | `/sign-up`                        |
| GITHUB_APP_ID                     | yes      | GitHub App ID                     |
| GITHUB_PRIVATE_KEY                | yes      | GitHub App private key (base64)   |
| GITHUB_CLIENT_ID                  | yes      | GitHub OAuth client ID            |
| GITHUB_CLIENT_SECRET              | yes      | GitHub OAuth client secret        |
| SENTRY_DSN                        | yes      | Sentry project DSN                |
| SENTRY_AUTH_TOKEN                 | yes      | Sentry source maps auth           |
| GITHUB_MOCK                       | no       | Use fixture data (`true`/`false`) |
| RESEND_API_KEY                    | no       | Email API key (P1)                |
| STRIPE_SECRET_KEY                 | no       | Payments (P2)                     |

---

## 13. Trade-offs Accepted

- **Prisma over Drizzle**: Heavier bundle, better next-forge ecosystem fit
- **Clerk lock-in**: Zero custom auth code, Vercel Marketplace native
- **No Redis at launch**: Neon pooling sufficient; add for pub/sub if needed
- **Event loss tolerance**: Fire-and-forget acceptable for observability data
- **Separate API app**: Cleaner separation, independent scaling vs. co-located routes
