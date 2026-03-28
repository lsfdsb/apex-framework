# APEX Ops — Design Spec

> Date: 2026-03-28 | Status: Approved
> Branch: `feat/mastery-guide-audit` (pre-implementation)

---

## What It Is

A full ops platform + public showcase for the APEX Framework, built as a next-forge monorepo. Serves as both the control plane for APEX-powered projects AND the proof that APEX + next-forge integration works.

## Two Audiences

- **Developers** — Manage APEX projects, configure skills/agents/hooks, monitor pipeline activity
- **Visitors** — Discover APEX, read docs, understand the philosophy

## Architecture

```
apex-framework/ (monorepo root — IS the APEX Framework)
├── .claude/              ← APEX Framework (skills, agents, hooks, scripts)
├── CLAUDE.md             ← Project constitution
├── apps/
│   ├── web/              ← Public showcase + docs (Next.js)
│   ├── app/              ← Control plane dashboard (Next.js)
│   ├── api/              ← Backend services (agent reporting, Git sync)
│   ├── docs/             ← Full framework documentation
│   ├── email/            ← Transactional emails (welcome, alerts)
│   ├── storybook/        ← Design system workshop
│   └── studio/           ← Database visualization
├── packages/
│   ├── @apex/ui          ← Design system (shadcn/ui + Design DNA tokens)
│   ├── @apex/db          ← Database (Prisma, project/session/gate models)
│   ├── @apex/auth        ← Authentication (Clerk)
│   ├── @apex/analytics   ← Usage tracking
│   ├── @apex/config      ← Shared Next.js + APEX config
│   └── ...               ← Other next-forge packages as needed
├── docs/                 ← Specs, design DNA, guides (existing)
└── turbo.json            ← Turborepo orchestration
```

## Data Flow (Hybrid)

- **Agent reporting** — APEX hooks phone home to `/api` with pipeline status, gate results, agent activity
- **Git-based** — GitHub API reads project config, commit history, branch status
- **Manual** — Users register projects, set overrides via dashboard

## Control Plane Features (app/)

1. **Project portfolio** — All APEX-powered projects, pipeline status, quality gate history
2. **Framework management** — Install/update APEX on projects, see what's configured
3. **Monitoring** — Agent activity, hook execution logs, context usage, session history
4. **Configuration UI** — Visual editor for settings.json, CLAUDE.md, output styles, skills

## Showcase Features (web/)

1. **Framework docs** — What APEX is, how to install, philosophy
2. **Skill/agent reference** — Browsable catalog of all 33 skills, 9 agents
3. **The Creed** — Mandalorian engineering philosophy, the pipeline explained

## Scaffold Integration (Reusable for All APEX Projects)

When APEX scaffolds ANY new project, the user chooses:

- **Quick start** — `npx next-forge@latest init` + APEX injection (opinionated defaults, app-level CLAUDE.md per app, Design DNA wired, hooks connected to Turborepo)
- **Full APEX** — `npx @apex/create-app` (custom template with everything pre-configured)

## MVP Sequence

### Phase 1: Integration

APEX learns to scaffold next-forge, inject `.claude/`, generate app-level CLAUDE.md files, wire Design DNA to next-forge's design system.

### Phase 2: Refactor

Migrate `apex-framework` repo to next-forge monorepo structure. apps/ + packages/ alongside existing .claude/ directory.

### Phase 3: Apps

Build out the 7 apps incrementally:

1. web (showcase + docs) — public face
2. app (control plane) — dashboard
3. api (backend services) — agent reporting, Git sync
4. storybook (design system) — component workshop
5. docs (full documentation)
6. email (transactional)
7. studio (database viz)

## Stack

- Next.js 16 + Turbopack
- Turborepo (monorepo orchestration)
- shadcn/ui + Geist (design system base)
- Clerk (auth)
- Prisma + Neon (database)
- Stripe (future — if APEX goes paid)
- Vercel (deployment)

## Design Decisions

| Decision                  | Choice                        | Why                                                     |
| ------------------------- | ----------------------------- | ------------------------------------------------------- |
| Monorepo tool             | Turborepo (via next-forge)    | Battle-tested, Vercel-native, remote caching            |
| Design system             | shadcn/ui + Design DNA tokens | Matches APEX's existing design system                   |
| Auth                      | Clerk                         | next-forge default, Vercel Marketplace native           |
| Database                  | Prisma + Neon                 | next-forge default, serverless Postgres                 |
| All 7 apps                | Keep all                      | Full platform from day one, nothing stripped            |
| Framework repo = monorepo | Yes                           | Eat our own cooking, .claude/ lives alongside apps/     |
| Scaffold as default       | Yes                           | next-forge becomes APEX's standard for all new projects |

## Open Questions

1. **Agent reporting protocol** — REST API? WebSocket? What data structure for pipeline events?
2. **Git sync frequency** — Real-time webhooks or periodic polling?
3. **Multi-project auth** — How does a user connect multiple GitHub repos to APEX Ops?
4. **Design DNA mapping** — How do Design DNA templates map to @apex/ui tokens?
5. **@apex/create-app** — Custom next-forge fork or wrapper around their CLI?

These will be resolved during /architecture.
