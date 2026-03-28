# PRD: APEX Ops

**Version**: 1.0 | **Date**: 2026-03-28 | **Status**: Draft

---

## 1. Vision & Purpose

APEX Ops is a full operations platform and public showcase for the APEX Framework, built as a next-forge monorepo. It serves two purposes simultaneously: the **control plane** for managing APEX-powered projects (monitoring agents, configuring skills, viewing pipeline activity) and the **proof** that APEX + next-forge integration produces world-class software. The monorepo lives in the same repository as the framework itself -- eating our own cooking -- with `apps/` and `packages/` sitting alongside the existing `.claude/` directory.

---

## 2. Problem Statement

**Pain**: APEX is invisible. The framework has 33 skills, 9 agents, 26 hooks, and a 7-phase pipeline -- but everything lives in terminal output and Markdown files. There is no way to manage multiple APEX-powered projects from a single interface, no way for visitors to explore the framework interactively, and no way to configure skills or monitor agent activity without reading JSON files.

**Who is affected**:

- **Developers** who use APEX on multiple projects have no portfolio view, no configuration UI, and no monitoring dashboard.
- **Visitors** evaluating APEX get a 490-line README and a CLI. No interactive docs, no browsable catalog.

**Cost of inaction**: Adoption friction (competitors have visual interfaces), operational overhead (N projects = N config files), no public face.

---

## 3. Competitive Landscape

| Competitor                   | Strengths                            | Our Differentiator                                                  |
| ---------------------------- | ------------------------------------ | ------------------------------------------------------------------- |
| **Cursor**                   | Polished IDE, inline AI              | Full autonomous pipeline, multi-project management, quality gates   |
| **Devin**                    | Autonomous agent, plan/execute       | Transparent reasoning, multi-project portfolio, quality enforcement |
| **Windsurf**                 | Step-by-step preview, clean UX       | Apple EPM task board, multi-agent coordination, 7-phase QA          |
| **GitHub Copilot Workspace** | Plan-review flow, GitHub integration | Live team coordination, Design DNA, visual config editor            |
| **bolt.new / v0**            | Fast scaffold, component preview     | Full-stack pipeline from PRD to PR with enforced quality gates      |

---

## 4. User Personas

### Alex -- The APEX Developer

- Uses APEX on 2-5 projects
- Wants: portfolio view, config UI, pipeline monitoring, agent logs
- Frustration: switching directories to check status, editing JSON by hand

### Jordan -- The Visitor / Evaluator

- Technical PM or developer evaluating AI coding frameworks
- Wants: understand APEX in < 3 minutes, browse skill catalog, read docs
- Frustration: wall of text README, no interactive exploration

---

## 5. User Stories & Acceptance Criteria

### P0 -- Must Have (MVP)

**US-1**: As Alex, I see all my APEX projects in a portfolio view with name, status, last run, quality score.

**US-2**: As Alex, I register a project by connecting a GitHub repo. APEX Ops reads its `.claude/` directory.

**US-3**: As Jordan, I read interactive framework docs without installing APEX.

**US-4**: As Jordan, I browse a searchable catalog of all 33 skills and 9 agents.

**US-5**: As Alex, I see real-time pipeline activity (phase, agents, tasks, quality gates) updated within 2 seconds.

### P1 -- Should Have

**US-6**: Visual configuration editor for settings.json and CLAUDE.md.

**US-7**: Agent activity logs (actions, token usage, duration, errors).

**US-8**: Quality gate history with trend charts.

**US-9**: Design DNA gallery with palette switching and dark/light toggle.

### P2 -- Nice to Have

**US-10**: Outdated APEX version detection with one-click update PR.

**US-11**: Webhook-based real-time updates (sub-500ms).

---

## 6. Persona -> Page Mapping

| Page                  | Route                             | App  | Primary Persona |
| --------------------- | --------------------------------- | ---- | --------------- |
| Landing Page          | /                                 | web  | Jordan          |
| Framework Docs        | /docs                             | docs | Jordan          |
| Skill Catalog         | /docs/skills                      | docs | Jordan          |
| Agent Reference       | /docs/agents                      | docs | Jordan          |
| Design DNA Gallery    | /dna                              | web  | Jordan          |
| Pipeline Explainer    | /pipeline                         | web  | Jordan          |
| Dashboard / Portfolio | /dashboard                        | app  | Alex            |
| Project Overview      | /dashboard/[projectId]            | app  | Alex            |
| Task Board            | /dashboard/[projectId]/tasks      | app  | Alex            |
| Monitoring            | /dashboard/[projectId]/monitoring | app  | Alex            |
| Configuration         | /dashboard/[projectId]/config     | app  | Alex            |
| Quality History       | /dashboard/[projectId]/quality    | app  | Alex            |

---

## 7. Functional Requirements

1. **Project Portfolio** (app/) -- Central dashboard with project cards, status, quality scores
2. **Framework Management** (app/) -- View/manage APEX installation per project, version comparison
3. **Pipeline Monitoring** (app/) -- Real-time pipeline visualization, agent status, task board
4. **Configuration UI** (app/) -- Visual editor for settings.json, CLAUDE.md, output styles
5. **Framework Docs** (web/ + docs/) -- Interactive documentation, install guide, philosophy
6. **Skill/Agent Catalog** (docs/) -- Browsable, searchable catalog with metadata
7. **Agent Reporting API** (api/) -- REST endpoint receiving pipeline events from APEX hooks

---

## 8. Integration Requirements

| Integration     | Purpose                          | Priority |
| --------------- | -------------------------------- | -------- |
| GitHub API      | Read repo config, commit changes | P0       |
| Clerk           | Authentication                   | P0       |
| Neon (Postgres) | Store projects, sessions, events | P0       |
| Vercel          | Deployment, edge, analytics      | P0       |
| Resend          | Transactional emails             | P1       |
| Stripe          | Paid tiers (future)              | P2       |

---

## 9. Non-Functional Requirements

- **Performance**: Page load < 2s, API < 200ms, Lighthouse > 90
- **Security**: Clerk RBAC, API keys per project, secrets in env vars, CSRF
- **Accessibility**: WCAG 2.2 AA, keyboard nav, screen reader support
- **Scalability**: 50 users/6mo, 500/12mo, 5000/24mo. Neon auto-scaling.

---

## 10. Data Model

| Entity             | Key Fields                                                     |
| ------------------ | -------------------------------------------------------------- |
| **User**           | id, clerk_id, email, name, avatar_url                          |
| **Project**        | id, name, github_repo_url, apex_version, last_sync_at          |
| **Membership**     | id, user_id, project_id, role (owner/collaborator/viewer)      |
| **Session**        | id, project_id, started_at, ended_at, model, context_used      |
| **PipelineRun**    | id, session_id, project_id, phase, status, quality_score       |
| **GateResult**     | id, pipeline_run_id, gate_name, passed, score, details (jsonb) |
| **AgentActivity**  | id, session_id, agent_name, action, tokens_used                |
| **ConfigSnapshot** | id, project_id, config_type, content (jsonb), changed_by       |

---

## 11. API Contract

| Method | Endpoint                      | Auth                 |
| ------ | ----------------------------- | -------------------- |
| POST   | /api/v1/events                | API key (X-Apex-Key) |
| GET    | /api/v1/projects/:id/status   | Clerk JWT            |
| GET    | /api/v1/projects/:id/sessions | Clerk JWT            |
| GET    | /api/v1/projects/:id/quality  | Clerk JWT            |
| PUT    | /api/v1/projects/:id/config   | Clerk JWT (owner)    |

---

## 12. Design Direction

- **Dashboard**: SaaS-blue palette (bg: #09090b, accent: #3b82f6, zinc neutrals), dark by default
- **Public site**: Warmer palette, inviting for visitors
- **Typography**: Geist Sans (body), Geist Mono (code/metrics)
- **Animation**: Subtle, purposeful. 200-300ms transitions. `prefers-reduced-motion` respected.
- **Breakpoints**: Mobile-first. 320px, 768px, 1024px.

---

## 13. Technical Architecture

```
apex-framework/ (monorepo root)
├── .claude/           ← APEX Framework (unchanged)
│   hooks → POST /api/v1/events (agent reporting)
├── apps/
│   ├── web/           ← Public showcase (Next.js 16)
│   ├── app/           ← Dashboard (Next.js 16)
│   ├── api/           ← Backend (Next.js 16 API routes)
│   ├── docs/          ← Documentation
│   ├── email/         ← Transactional emails
│   ├── storybook/     ← Component workshop
│   └── studio/        ← Database viz
├── packages/
│   ├── @apex/ui       ← Design system (shadcn/ui + DNA tokens)
│   ├── @apex/db       ← Prisma + service layer
│   ├── @apex/auth     ← Clerk abstraction
│   ├── @apex/config   ← Shared config
│   └── @apex/analytics
└── turbo.json         ← Turborepo orchestration
```

**Stack**: Next.js 16, Turbopack, Turborepo, shadcn/ui, Clerk, Prisma + Neon, Vercel.

---

## 14. Milestones

### Phase 1: Integration (2-3 weeks)

APEX scaffolds next-forge, injects `.claude/`, generates app-level CLAUDE.md, wires Design DNA.

### Phase 2: Refactor (1-2 weeks)

Migrate `apex-framework` to monorepo. All existing functionality preserved. CI/CD pipeline.

### Phase 3: Apps (8-12 weeks)

- **3a**: web/ + docs/ (public showcase, skill catalog) -- 2-3 weeks
- **3b**: app/ + api/ (dashboard, reporting) -- 3-4 weeks
- **3c**: storybook/ + email/ -- 1-2 weeks
- **3d**: studio/ + config UI + quality history -- 2-3 weeks

---

## 15. Risks & Mitigations

| Risk                                 | Mitigation                                                     |
| ------------------------------------ | -------------------------------------------------------------- |
| Monorepo migration breaks `.claude/` | Phase 2 on feature branch; full hook validation post-migration |
| GitHub API rate limits               | Cache with 5 min TTL; conditional requests (ETags)             |
| Agent reporting adds latency         | Fire-and-forget hooks (`nohup curl &`); never block pipeline   |
| Scope creep from 7 apps              | Strict phasing; each app ships independently                   |

---

## 16. Testing Strategy

- **Unit**: 80% coverage for packages/ (Vitest)
- **Integration**: API routes tested with Next.js test client
- **E2E** (Playwright): 5 critical flows (visitor docs, sign in, register project, view pipeline, edit config)
- **Performance**: Lighthouse CI on every PR
- **Accessibility**: axe-core in E2E tests

---

## 17. Open Questions

1. Agent reporting: REST (V1) or WebSocket (V2)? -- Recommend REST V1
2. Git sync: Webhooks or polling? -- Recommend webhooks
3. Multi-repo auth: GitHub App or per-repo OAuth? -- Recommend GitHub App
4. Design DNA to @apex/ui mapping: CSS vars or build-time? -- Recommend CSS vars
5. @apex/create-app: Fork or wrapper? -- Recommend wrapper around next-forge CLI
6. Existing HUB: Absorb into apps/web/ or keep separate? -- Recommend absorb
