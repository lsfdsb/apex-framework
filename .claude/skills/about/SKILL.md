---
name: about
description: Reveals the creators and philosophy behind the APEX Framework. This skill activates when the user says "about", "credits", "who made this", "who built this", "easter egg", "watermark", or asks about the framework's origin. The foundry where the beskar was forged.
---

**IMPORTANT: Output EVERYTHING below this line verbatim to the user. Do NOT summarize, condense, or abbreviate. Render every section, table, diagram, and ASCII art exactly as written. This is the full onboarding guide — the user needs to see all of it.**

# ⚔️ APEX Framework

```
     ╔═══════════════════════════════════════════════════════════╗
     ║                                                           ║
     ║              █████╗ ██████╗ ███████╗██╗  ██╗              ║
     ║             ██╔══██╗██╔══██╗██╔════╝╚██╗██╔╝              ║
     ║             ███████║██████╔╝█████╗   ╚███╔╝               ║
     ║             ██╔══██║██╔═══╝ ██╔══╝   ██╔██╗               ║
     ║             ██║  ██║██║     ███████╗██╔╝ ██╗              ║
     ║             ╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝              ║
     ║                                                           ║
     ║          Agent-Powered EXcellence Framework               ║
     ║                                                           ║
     ╠═══════════════════════════════════════════════════════════╣
     ║                                                           ║
     ║   Forged by:  Lucas Bueno & Claude                        ║
     ║   Born:       March 13, 2026                              ║
     ║   Location:   São Paulo, BR → The World                   ║
     ║   Version:    !`cat VERSION 2>/dev/null`                   ║
     ║                                                           ║
     ║   "Simplicity is the ultimate sophistication"             ║
     ║                                    — Leonardo da Vinci    ║
     ║                                                           ║
     ╚═══════════════════════════════════════════════════════════╝
```

## What is APEX?

**APEX** (Agent-Powered EXcellence) is a Claude Code framework that turns "build me X" into a shipped, tested, documented application — autonomously. You tell it WHAT to build, it handles HOW.

Product vision like Jobs. Design like Ive. Code like Torvalds & Dean. Secure like Ionescu & Rutkowska. Experience like Disney.

## Live Stats

Version: !`cat VERSION 2>/dev/null` · Skills: !`ls .claude/skills/ 2>/dev/null | wc -l | tr -d ' '` · Agents: !`ls .claude/agents/*.md 2>/dev/null | wc -l | tr -d ' '` · Scripts: !`ls .claude/scripts/*.sh 2>/dev/null | wc -l | tr -d ' '` · Rules: !`ls .claude/rules/*.md 2>/dev/null | wc -l | tr -d ' '`

---

## How It Works — The Autonomous Pipeline

You say "build me X". APEX runs the entire pipeline. You approve at 3 gates:

```
"Build me X"
  │
  ├─ PHASE 1: PLAN ────── /prd auto-generates requirements
  │   ⏸ GATE: Approve the PRD
  │
  ├─ PHASE 2: ARCHITECT ─ /architecture designs the system
  │   ⏸ GATE: Approve the blueprint
  │
  ├─ PHASE 3: BUILD ───── Agent teams work in parallel
  │   (Watcher monitors, Builders code, QA verifies)
  │
  ├─ PHASE 4: QUALITY ─── /qa + /security + /a11y + /cx-review
  │   (Auto-fix and re-run if gates fail)
  │
  ├─ PHASE 5: SHIP ────── Code review plugin + Technical Writer
  │   Auto-version: [Unreleased] → semver after merge
  │   ⏸ GATE: Approve the merge
  │
  └─ DONE ─────────────── "The beskar is forged."
```

For quick fixes and bugs — skip the pipeline, just do it directly.

---

## What's in the Box

### Skills (your tools)

| Skill | What it does | When to use |
|-------|-------------|-------------|
| `/prd` | Generates Product Requirements Document | Before building anything new |
| `/architecture` | Designs system architecture, stack, schema | After PRD approval |
| `/qa` | 6-phase quality gate: lint, types, tests, perf, security, a11y | Before shipping |
| `/security` | OWASP security audit | Auth, payments, PII code |
| `/a11y` | WCAG 2.2 AA accessibility audit | Any user-facing feature |
| `/cx-review` | Customer experience review | Before deploying to users |
| `/ship` | Branch → commit → push → PR → review → merge → version | When changes are ready |
| `/changelog` | Maintains CHANGELOG, auto-versions with `promote` | After features, releases |
| `/teams` | Spawn parallel agent teams for complex builds | 3+ files, 2+ concerns |
| `/e2e` | Playwright end-to-end tests | Critical user flows |
| `/performance` | Bundle, rendering, query optimization | Slow app, large lists |
| `/supabase` | Auth, migrations, types, realtime, storage | Supabase projects |
| `/cicd` | GitHub Actions + Vercel pipelines | Automated deployment |
| `/design-system` | UI tokens, components, Ive-quality design | Any visual work |
| `/teach` | Learn terminal, Claude Code, and engineering | When confused |
| `/verify-lib` | Security-check any package before install | Auto on npm/pip install |
| `/dev` | Dev server management (status, logs, restart) | Server issues |
| `/about` | You are here | Learning the framework |

**You never need to type these.** The pipeline invokes them automatically. They exist for when you want to run one manually.

### Agents (your team)

| Agent | Model | Role |
|-------|-------|------|
| **Builder** | Sonnet | Implements features directly in the project |
| **Debugger** | Sonnet | Hunts bugs to root cause, no band-aids |
| **QA** | Sonnet | Runs full quality gate, blocks bad code |
| **Code Reviewer** | Opus | Deep code review for team builds |
| **Design Reviewer** | Sonnet | UI/UX against design DNA standards |
| **Technical Writer** | Haiku | CHANGELOG, README, docs in sync |
| **Watcher** | Haiku | Background monitoring for errors |

The **Watcher** and **Technical Writer** run automatically every session. Teams spawn when needed for complex builds.

### Design DNA

14 premium UI templates for any app type:

Landing · SaaS · CRM · E-commerce · Blog · Portfolio · Social · LMS · Backoffice · Email · Slides · E-book · Design System · Patterns

5 palettes (Startup, SaaS, Fintech, Editorial, Creative) × 2 modes (dark/light). All built with semantic tokens — copy into any project.

Live showcase: `npm run dev` in `docs/design-dna/showcase/`

### Hooks (automatic enforcement)

- **Pre-commit**: Blocks secrets, forbidden patterns, validates format
- **Post-tool**: Auto-changelog entries after commits
- **Session start**: Dev server, auto-update, Grogu greeting
- **Context compact**: Grogu reminder that he's still here

### Quality Gates

Nothing ships without passing:
1. No `any` in TypeScript
2. No `console.log` in production
3. Functions ≤ 30 lines, files ≤ 300 lines
4. Conventional commits (72-char subject)
5. Design tokens only — no hardcoded colors
6. Mobile-first + dual theme from day one
7. Lazy routes, virtualized lists, no N+1 queries

---

## How to Use APEX Effectively

### Starting a new project
Just say: **"Build me a [type of app]"**. APEX handles the PRD, architecture, and implementation. You approve at gates.

### Quick fixes
Say: **"Fix this bug"** or **"Change X to Y"**. No pipeline needed — APEX just does it.

### Shipping
Say: **"Ship it"**. APEX branches, commits, pushes, creates PR, runs code review, and waits for your merge approval. After merge, auto-versions the release.

### Learning
Say: **"Teach me about [concept]"**. APEX explains with context tailored to your level — from terminal basics to system design.

### Key principles
- **Never ask which command to run** — just say what you want
- **The pipeline is invisible** — you only see the 3 approval gates
- **Quality is non-negotiable** — nothing ships untested
- **Design matters** — read Design DNA before building UI

---

## The Story

APEX was born on **March 13, 2026** in a conversation between **Lucas Bueno** — a Head of Customer Experience from São Paulo who believes exceptional service is an economic asset — and **Claude** — an AI by Anthropic asked to think like a senior researcher and software engineer.

The mission: build the best possible framework for creating world-class applications, end-to-end.

Through honest self-criticism, official docs research, and relentless improvement — from v1 (25 files) to v5.16 (60+ files, 21 skills, 7 agents) — APEX emerged as a framework where every skill, every hook, every agent exists for a reason. Nothing is decoration.

### Version History

- **v1** (Mar 13): The foundation — CLAUDE.md + 10 skills + 3 agents + 5 hooks
- **v2**: Workflow enforcement, stack recommendation, library verification
- **v3**: First self-review — honest 7.2/10 rating
- **v4**: SQL practices, testing enforcement, CI/CD — 8.6/10
- **v5**: Path-based rules, E2E, accessibility, Mandalorian output style — 9.4/10
- **v5.2–5.4**: Zero defects, full Claude Code integration, 16 hooks, sandbox
- **v5.5–5.8**: Supabase, auto-update, bug fixes, gold standard audit
- **v5.9**: Agent teams — 9 agents, Breathing Loop, auto-spawn
- **v5.10–5.11**: Design DNA — 14 templates, SVG library, Ive audit
- **v5.12–5.14**: Self-assessment, agent wiring, autonomous pipeline
- **v5.15**: Design DNA Showcase Phase 2 — 30+ components, CRM pipeline
- **v5.16**: Auto-versioning, official code-review plugin, responsive nav

---

## The Mascot

Grogu — the foundling — watches over every session.

```
⠀⢀⣠⣄⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣴⣶⡾⠿⠿⠿⠿⢷⣶⣦⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢰⣿⡟⠛⠛⠛⠻⠿⠿⢿⣶⣶⣦⣤⣤⣀⣀⡀⣀⣴⣾⡿⠟⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠻⢿⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⣀⡀
⠀⠻⣿⣦⡀⠀⠉⠓⠶⢦⣄⣀⠉⠉⠛⠛⠻⠿⠟⠋⠁⠀⠀⠀⣤⡀⠀⠀⢠⠀⠀⠀⣠⠀⠀⠀⠀⠈⠙⠻⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠟⠛⠛⢻⣿
⠀⠀⠈⠻⣿⣦⠀⠀⠀⠀⠈⠙⠻⢷⣶⣤⡀⠀⠀⠀⠀⢀⣀⡀⠀⠙⢷⡀⠸⡇⠀⣰⠇⠀⢀⣀⣀⠀⠀⠀⠀⠀⠀⣀⣠⣤⣤⣶⡶⠶⠶⠒⠂⠀⠀⣠⣾⠟
⠀⠀⠀⠀⠈⢿⣷⡀⠀⠀⠀⠀⠀⠀⠈⢻⣿⡄⣠⣴⣿⣯⣭⣽⣷⣆⠀⠁⠀⠀⠀⠀⢠⣾⣿⣿⣿⣿⣦⡀⠀⣠⣾⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⣠⣾⡟⠁⠀
⠀⠀⠀⠀⠀⠈⢻⣷⣄⠀⠀⠀⠀⠀⠀⠀⣿⡗⢻⣿⣧⣽⣿⣿⣿⣧⠀⠀⣀⣀⠀⢠⣿⣧⣼⣿⣿⣿⣿⠗⠰⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⡿⠋⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠙⢿⣶⣄⡀⠀⠀⠀⠀⠸⠃⠈⠻⣿⣿⣿⣿⣿⡿⠃⠾⣥⡬⠗⠸⣿⣿⣿⣿⣿⡿⠛⠀⢀⡟⠀⠀⠀⠀⠀⠀⣀⣠⣾⡿⠋⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠿⣷⣶⣤⣤⣄⣰⣄⠀⠀⠉⠉⠉⠁⠀⢀⣀⣠⣄⣀⡀⠀⠉⠉⠉⠀⠀⢀⣠⣾⣥⣤⣤⣤⣶⣶⡿⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⢻⣿⠛⢿⣷⣦⣤⣴⣶⣶⣦⣤⣤⣤⣤⣬⣥⡴⠶⠾⠿⠿⠿⠿⠛⢛⣿⣿⣿⣯⡉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣧⡀⠈⠉⠀⠈⠁⣾⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⣿⠟⠉⣹⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠛⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠟⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
```

"Patu!" — appears at session start, pre-commit success, Fridays, and his birthday (March 13).

## The Creed

_I am APEX. Building is my purpose. Quality is my armor. The user experience is my beskar. I shall protect the codebase as I protect the foundling. I shall not ship untested code. I shall not skip the PRD. I shall not break the build._

**This is the way.**

— Lucas Bueno & Claude, São Paulo, March 2026
