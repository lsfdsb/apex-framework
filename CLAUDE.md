# APEX Framework — Project Constitution
<!-- Forged by Lucas Bueno & Claude · São Paulo, March 2026 · /about -->

> "Simplicity is the ultimate sophistication." — Da Vinci

## Identity & Philosophy

**APEX** (Agent-Powered EXcellence) is our Claude Code framework for building world-class apps, end-to-end. Every interaction carries our full philosophy:

- **Design** like Jony Ive — radical simplicity, every element earns its place
- **Code** like Linus Torvalds & Jeff Dean — clean, performant, zero waste
- **Secure** like Alex Ionescu & Joanna Rutkowska — defense in depth, trust nothing
- **Business** like Dario Amodei — long-term thinking, build what matters

Our CX philosophy: understand users holistically, view exceptional service as an economic asset, create experiences people remember and share.

## Core Rules (Enforced — see workflow-enforcer skill)

1. **PRD before code** — Run `/prd` before building any new app or major feature. **BLOCK implementation if no PRD exists.**
2. **Research before integration** — Run `/research` before using any new API or library. Never hallucinate an API.
3. **Verify before installing** — The `verify-lib` skill auto-checks every new dependency for security, maintenance, and license.
4. **QA before shipping** — Run `/qa` before marking any task complete.
5. **Security on sensitive code** — Run `/security` on auth, payments, or PII handling.
6. **CX review before users see it** — Run `/cx-review` before deploying user-facing changes.
7. **Full context always** — Read existing files before editing. No blind changes.
8. **Explain every decision** — Our output style is educational. Teach the user what you're building and why.
9. **Adapt to existing stacks** — If the user already has a project, adapt to their stack. Don't force ours.
10. **Only official libraries** — Every dependency must be verified: official publisher, maintained, no critical CVEs, proper license.

## Tech Stack (see `apex-stack` skill for full details)

If you already have a project with a stack, we adapt to it. For new projects:
- Frontend: Next.js 15+ + TypeScript + Tailwind CSS + shadcn/ui
- Database: Supabase (PostgreSQL + Auth + Storage)
- ORM: Drizzle ORM
- Testing: Vitest + Playwright + Testing Library
- Deploy: Vercel (auto-preview per PR)
- Dev: VS Code + Claude Code + iTerm2

## Code Standards

- TypeScript strict mode. No `any`. No `console.log` in production.
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `perf:`, `security:`
- Functions ≤ 30 lines. Files ≤ 300 lines. Components ≤ 200 lines.
- Every public function has JSDoc. Every component has prop types.
- ESLint + Prettier enforced via hooks (deterministic, not probabilistic).

## Git Workflow

- Never push to `main` or `master` directly.
- Feature branches: `feat/description`, `fix/description`
- PRs require: passing tests, clean lint, security scan.
- Squash merge. Clean history.

## File Organization

```
src/
├── app/          # Routes and pages
├── components/   # Atomic design (atoms, molecules, organisms)
├── lib/          # Utilities, config, helpers
├── hooks/        # Custom React hooks
├── services/     # API calls and business logic
├── types/        # TypeScript definitions
└── tests/        # Mirror src/ structure
```

## Build Commands

- `npm run dev` — development server
- `npm run build` — production build
- `npm run test` — run tests
- `npm run lint` — lint check
- `npm run format` — format code

## Available Skills

**Workflow**: `/prd` → `/architecture` → `/research` → build → `/qa` → `/security` → `/a11y` → `/cx-review` → `/commit` → `/deploy`
**Testing**: `/e2e` (Playwright E2E tests), testing rules auto-load for *.test.ts
**DevOps**: `/cicd` (GitHub Actions), `/deploy` (pre-deploy gate)
**DevServer**: `/dev` (auto-starts on SessionStart, monitors logs, detects errors/crashes)
**Utilities**: `/init` (setup APEX), `/changelog` (update docs), `/debug` (structured debugging), `/apex-review` (audit framework), `/evolve` (self-improve from session)
**Auto-loading**: design-system, code-standards, sql-practices, apex-stack, workflow-enforcer, verify-lib, teach, accessibility
**Path-based rules**: testing.md, sql.md, api.md, components.md — load only when touching matching files

## Key Reminders

- Skills load on-demand. Hooks are deterministic. Both are enforced.
- After code changes → tests run automatically (Stop hook). After commits → changelog updates.
- PRDs update automatically as features are built. Documentation stays alive.
- When in doubt, ask the user. Don't assume. Explain everything.

