---
name: about
description: Reveals the creators and philosophy behind the APEX Framework. Activates on "about", "credits", "who made this", "who built this", "easter egg", "watermark", or questions about the framework's origin.
---

**IMPORTANT: Output EVERYTHING below this line verbatim to the user. Do NOT summarize, condense, or abbreviate. Render every section, table, diagram, and ASCII art exactly as written.**

# APEX Framework

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
     ║   Version:    5.22.0                                    ║
     ║                                                           ║
     ║   "Simplicity is the ultimate sophistication"             ║
     ║                                    — Leonardo da Vinci    ║
     ║                                                           ║
     ╚═══════════════════════════════════════════════════════════╝
```

## What is APEX?

**APEX** (Agent-Powered EXcellence) is a Claude Code framework that turns "build me X" into a shipped, tested, documented application — autonomously. You tell it WHAT to build, it handles HOW.

Product vision like Jobs. Design like Ive. Code like Torvalds & Dean. Secure like Ionescu & Rutkowska. Experience like Disney.

**Stats**: 21 skills (+1 internal) · 5 agents · 24 scripts · 7 rules · 23 hooks

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
  ├─ PHASE 5: SHIP ────── Code review + Technical Writer
  │   Auto-version: [Unreleased] → semver after merge
  │   ⏸ GATE: Approve the merge
  │
  └─ DONE ─────────────── "The beskar is forged."
```

For quick fixes and bugs — skip the pipeline, just do it directly.

---

## What's in the Box

### Skills

| Skill | Description |
|-------|-------------|
| `/a11y` | Runs an accessibility audit against WCAG 2.2 AA standards. This s... |
| `/about` | Reveals the creators and philosophy behind the APEX Framework. Ac... |
| `/architecture` | Design or review system architecture. Use when the user asks to a... |
| `/changelog` | Generates and maintains CHANGELOG.md and auto-updates PRD status.... |
| `/cicd` | Sets up CI/CD pipelines with GitHub Actions and Vercel. This skil... |
| `/claude-api` | "Build apps with the Claude API or Anthropic SDK. TRIGGER when: c... |
| `/cx-review` | Review any user-facing feature from a Customer Experience perspec... |
| `/design-system` | Our design system standards and UI/UX guidelines. Auto-loads when... |
| `/dev` | Manage the dev server — check status, view logs, restart, or stop... |
| `/e2e` | Write and run end-to-end tests with Playwright. Use when the user... |
| `/performance` | Analyze and optimize application performance. Use when the user m... |
| `/prd` | Generates a comprehensive Product Requirements Document before bu... |
| `/qa` | Runs comprehensive quality assurance on any feature, PR, or code ... |
| `/security` | Runs a security audit on code handling authentication, authorizat... |
| `/ship` | Fast-track branch → commit → push → PR → merge workflow. Use when... |
| `/supabase` | Supabase integration helper — setup, auth, migrations, types, rea... |
| `/teach` | Teach the user terminal commands, Claude Code usage, and software... |
| `/teams` | Spawn and manage agent teams for parallel work. Auto-selects team... |
| `/update` | Manually update the APEX Framework to the latest version. Use whe... |
| `/verify-api` | Verify any external API before integration. Auto-invoked when cod... |
| `/verify-lib` | Verify any library or package before installing it. Auto-invoked ... |

**You never need to type these.** The pipeline invokes them automatically.

### Agents

| Agent | Model | Role |
|-------|-------|------|
| **Builder** | Sonnet | Full-capability implementation agent for parallel coding wor... |
| **Project Manager** | Sonnet | Project management agent that breaks PRD+Architecture into p... |
| **QA** | Sonnet | Quality assurance agent that runs comprehensive tests, valid... |
| **Technical Writer** | Haiku | Documentation specialist that keeps README, CHANGELOG, PRD s... |
| **Watcher** | Haiku | Continuous monitoring agent that watches for errors, test fa... |

Watcher and Technical Writer run in background. Teams spawn for complex builds via `/teams`.

### Design DNA

14 premium UI templates: Landing · SaaS · CRM · E-commerce · Blog · Portfolio · Social · LMS · Backoffice · Email · Slides · E-book · Design System · Patterns

5 palettes (Startup, SaaS, Fintech, Editorial, Creative) × 2 modes (dark/light). Semantic tokens only.

### Quality Gates

Nothing ships without passing:
1. No `any` in TypeScript, no `console.log` in production
2. Functions ≤ 30 lines, files ≤ 300 lines, components ≤ 200 lines
3. Conventional commits (72-char subject)
4. Design tokens only — no hardcoded colors
5. Mobile-first + dark/light from day one
6. Lazy routes, virtualized lists, no N+1 queries
7. Bundle size < 250KB, no component duplication

---

## Version History

- **v1** (Mar 13): Foundation — CLAUDE.md + 10 skills + 3 agents + 5 hooks
- **v2**: Workflow enforcement, stack recommendation, library verification
- **v3**: First self-review — honest 7.2/10 rating
- **v4**: SQL practices, testing enforcement, CI/CD — 8.6/10
- **v5.0**: Path-based rules, E2E, accessibility, Mandalorian output style — 9.4/10
- **v5.2–5.4**: Zero defects, full Claude Code integration, 16 hooks, sandbox
- **v5.5–5.7**: Supabase, auto-update, bug fixes, gold standard audit
- **v5.9**: Agent teams — Breathing Loop, auto-spawn
- **v5.10–5.11**: Design DNA — 14 templates, SVG library, Ive audit
- **v5.12–5.14**: Self-assessment, agent wiring, autonomous pipeline
- **v5.15**: Showcase Phase 2 — 30+ components, CRM pipeline, Phoenix V3 P0
- **v5.16**: Auto-versioning, code-review plugin, responsive nav
- **v5.17**: Onboarding guide, worktree safety (isolation: none default)
- **v5.18**: Self-awareness, Kanban task chaining, Supabase RAG, CI/CD pipeline
- **v5.19**: Reliability — 47 tests, statusline v3, tech writer sharpened
- **v5.20**: Production readiness — 16 hooks, Oscar animations, E2E suite
- **v5.21**: Quality gates — design principles, Prettier, icon strategy, safe processes

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
