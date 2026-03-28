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
     ║   Version:    5.23.0                                    ║
     ║                                                           ║
     ║   "Simplicity is the ultimate sophistication"             ║
     ║                                    — Leonardo da Vinci    ║
     ║                                                           ║
     ╚═══════════════════════════════════════════════════════════╝
```

## What is APEX?

**APEX** (Agent-Powered EXcellence) is a Claude Code framework that turns "build me X" into a shipped, tested, documented application — autonomously. You tell it WHAT to build, it handles HOW.

Product vision like Jobs. Design like Ive. Code like Torvalds & Dean. Secure like Ionescu & Rutkowska. Experience like Disney.

**Stats**: 32 skills · 6 agents · 25 scripts · 7 rules · 28 hooks

---

## How It Works — The Autonomous Pipeline

You say "build me X". APEX runs the entire pipeline. You approve at 3 gates:

```
"Build me X"
  │
  ├─ PHASE 1: DISCOVER ── /brainstorm → /prd (iterative design + PRD)
  │   ⏸ GATE: Approve the PRD
  │
  ├─ PHASE 2: ARCHITECT ─ /architecture + /verify-api + /verify-lib
  │   ⏸ GATE: Approve the blueprint
  │
  ├─ PHASE 3: PLAN ────── /plan (bite-sized TDD tasks) + PM agent
  │
  ├─ PHASE 4: VERIFY ──── Final API/lib checks + Design DNA extraction
  │
  ├─ PHASE 5: BUILD ───── /execute or /teams (SDD) + /tdd + /debug + /verify
  │   (Watcher monitors, Builders code with TDD, QA verifies)
  │
  ├─ PHASE 6: QUALITY ─── /qa + /request-review + /code-review
  │   + /security + /a11y + /cx-review (auto-fix and re-run)
  │
  ├─ PHASE 7: SHIP ────── /verify + Technical Writer + PR
  │   Auto-version: [Unreleased] → semver after merge
  │   ⏸ GATE: Approve the merge
  │
  └─ DONE ─────────────── "The beskar is forged."
```

**Cross-cutting skills** (active in all phases): `/debug` · `/tdd` · `/verify` · `/code-review`

For quick fixes and bugs — `/debug` → `/tdd` → fix → `/verify` → `/ship`.

---

## What's in the Box

### Skills

**Pipeline Skills** (drive the 7-phase workflow):
| Skill | Purpose |
|-------|---------|
| `/brainstorm` | Iterative design exploration — Q&A, 2-3 approaches, spec writing |
| `/prd` | Product Requirements Document — full product spec |
| `/architecture` | System design — stack, schema, API contracts |
| `/plan` | Implementation plan — bite-sized TDD tasks, no placeholders |
| `/execute` | Plan execution — task-by-task with checkpoints |
| `/teams` | Agent team orchestration — SDD mode, breathing loop |
| `/ship` | Branch → commit → push → PR → merge |

**Discipline Skills** (cross-cutting, active in ALL phases):
| Skill | Purpose |
|-------|---------|
| `/tdd` | RED-GREEN-REFACTOR — no production code without failing test |
| `/debug` | Systematic root cause investigation — 4-phase methodology |
| `/verify` | Evidence before claims — run command, read output, THEN claim |
| `/code-review` | Technical rigor on feedback — verify, don't blindly agree |
| `/request-review` | Dispatch code-reviewer agent for fresh-eyes review |

**Quality Gates** (enforce standards):
| Skill | Purpose |
|-------|---------|
| `/qa` | 7-phase quality gate + Apple-grade polish |
| `/security` | OWASP audit on auth, payments, PII |
| `/a11y` | WCAG 2.2 AA accessibility audit |
| `/cx-review` | Customer Experience review |
| `/performance` | Bundle size, rendering, Core Web Vitals |
| `/e2e` | End-to-end Playwright tests |

**Integration & Tooling:**
| Skill | Purpose |
|-------|---------|
| `/verify-api` | Verify external APIs against live docs |
| `/verify-lib` | Verify packages before installing |
| `/supabase` | Supabase setup, auth, migrations, realtime |
| `/claude-api` | Build with Claude API / Anthropic SDK |
| `/cicd` | GitHub Actions + Vercel pipelines |
| `/dev` | Dev server management |
| `/worktree` | Git worktree isolation with safety checks |

**Framework & Docs:**
| Skill | Purpose |
|-------|---------|
| `/changelog` | CHANGELOG.md generation + PRD status |
| `/write-skill` | Create new APEX skills (TDD for docs) |
| `/teach` | Explain concepts and commands |
| `/design-system` | UI/UX guidelines + Design DNA |
| `/update` | Update APEX to latest version |
| `/about` | This page |

**You never need to type these.** The pipeline invokes them automatically.

### Agents

| Agent | Model | Role |
|-------|-------|------|
| **Builder** | Sonnet | Full-capability implementation agent for parallel coding wor... |
| **Design Reviewer** | Sonnet | Design quality agent that validates UI implementations again... |
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
- **v5.22**: Design DNA showcase — tokens page, 14 templates, ops hub, Canvas
- **v5.23**: **Superpowers integration** — 10 new skills (TDD, debug, verify, brainstorm, plan, execute, code-review, request-review, worktree, write-skill). Methodology merged: 7-phase pipeline with cross-cutting discipline skills. 22→32 skills.

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
