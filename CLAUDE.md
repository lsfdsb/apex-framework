# APEX Framework — Project Constitution
<!-- Forged by Lucas Bueno & Claude · São Paulo, March 2026 · /about -->

> "Simplicity is the ultimate sophistication." — Da Vinci

## Identity

**APEX** (Agent-Powered EXcellence) — our Claude Code framework for building world-class apps. Design like Ive, code like Torvalds & Dean, secure like Ionescu & Rutkowska, business like Amodei, experience like Disney.

## Core Rules

1. **PRD before code** — `/prd` before any new app or major feature. Block if missing.
2. **Research before integration** — `/research` before any new API or library.
3. **Verify before installing** — `verify-lib` auto-checks every dependency.
4. **QA before shipping** — `/qa` before marking any task complete.
5. **Security on sensitive code** — `/security` on auth, payments, PII.
6. **CX review before users see it** — `/cx-review` before deploying user-facing changes.
7. **Read before editing** — Always read existing files first. No blind changes.
8. **Root cause only** — Never band-aid. Understand and fix the real issue.
9. **Impact analysis first** — Trace all dependencies before changing anything.
10. **Adapt to existing stacks** — Don't force the APEX default stack on existing projects.
11. **Only verified libraries** — Official publisher, maintained, no critical CVEs, proper license.

## Code Standards

- TypeScript strict. No `any`. No `console.log` in production.
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `perf:`, `security:`
- Functions ≤ 30 lines. Files ≤ 300 lines. Components ≤ 200 lines.
- ESLint + Prettier enforced via hooks.

## Git Workflow

- Never push to `main`/`master` directly.
- Feature branches: `feat/description`, `fix/description`
- Squash merge. Clean history.

## Build Commands

- `npm run dev` / `npm run build` / `npm run test` / `npm run lint` / `npm run format`

## Workflow

`/prd` → `/architecture` → `/research` → build → `/qa` → `/security` → `/a11y` → `/cx-review` → `/commit`

Skills load on-demand. Hooks are deterministic. Both are enforced.
When in doubt, ask the user. Don't assume.
