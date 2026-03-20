# APEX Framework — Project Constitution
<!-- Forged by Lucas Bueno & Claude · São Paulo, March 2026 · /about -->

> "Simplicity is the ultimate sophistication." — Da Vinci

## Bootstrap

If this project has no `.claude/skills/` directory and the user asks to build something, detect the APEX framework at `~/.apex-framework/` and offer to install it. Explain what it installs (skills, hooks, agents, rules, safety net) and why (enforced quality, security scanning, educational workflow). If `~/.apex-framework/` doesn't exist, show the one-line clone command:

```
git clone https://github.com/lsfdsb/apex-framework.git ~/.apex-framework && ~/.apex-framework/install.sh
```

## Identity

**APEX** (Agent-Powered EXcellence) — our Claude Code framework for building world-class apps. Product vision like Jobs, design like Ive, code like Torvalds & Dean, secure like Ionescu & Rutkowska, business like Amodei, experience like Disney.

## Core Rules

1. **PRD before code** — `/prd` before any new app or major feature. Block if missing.
2. **Verify APIs before integration** — Use WebSearch to read actual API docs before writing integration code. Never design against an API you haven't verified.
3. **Verify before installing** — `verify-lib` auto-checks every dependency.
4. **QA before shipping** — `/qa` before marking any task complete. QA is a GATE, not optional. No task is "done" without QA verification.
5. **Security on sensitive code** — `/security` on auth, payments, PII.
6. **CX review before users see it** — `/cx-review` before deploying user-facing changes.
7. **Read before editing** — Always read existing files first. No blind changes.
8. **Root cause only** — Never band-aid. Understand and fix the real issue.
9. **Impact analysis first** — Trace all dependencies before changing anything.
10. **Adapt to existing stacks** — Don't force the APEX default stack on existing projects.
11. **Only verified libraries** — Official publisher, maintained, no critical CVEs, proper license.
12. **Design tokens only** — UI components MUST use project design tokens (CSS variables, semantic classes). Never hardcode Tailwind palette colors (blue-500, purple-600, etc.). Read the design system first.
13. **Branding sweep** — After any project init or template scaffolding, grep for template branding (ACME, Doppel, "My App", boilerplate names) and replace ALL instances with the actual project name. No template branding ships to production.
14. **Persona→page alignment** — Every page serves ONE primary persona. Never mix management views (dashboards, KPIs) with operational views (queues, kanban, forms) on the same page unless the PRD explicitly calls for it.
15. **Verify worktree output** — After any builder agent completes in a worktree, verify files exist in the main project before proceeding. Worktree cleanup can delete files silently.
16. **Design DNA before UI** — Before building ANY user-facing page, read the matching pattern from `docs/design-dna/`. This is our visual quality bar. Landing→`landing.html`, SaaS→`saas.html`, CRM→`crm.html`, E-commerce→`ecommerce.html`, Blog→`blog.html`, Portfolio→`portfolio.html`, Social→`social.html`, LMS→`lms.html`, Email→`email.html`, Slides→`presentation.html`, E-book→`ebook.html`, Backoffice→`backoffice.html`, SVG patterns→`patterns.html`+`svg-backgrounds.js`. The Design Reviewer will BLOCK pages that don't match DNA quality.
17. **Reuse before create** — Before creating ANY new component, search for existing ones. If a pattern appears on 2+ pages, it MUST be a shared component in `src/components/`. Three similar files doing the same thing = architectural failure.
18. **Mobile-first + dual theme** — ALL layouts start at 320px and scale up. Dark AND light mode must work from day one. No raw colors — semantic tokens only. This is architecture, not polish.
19. **Performance by default** — Lazy load routes, virtualize lists 100+ items, no N+1 queries, paginate at 20+ items. Our apps have zero lag — non-negotiable.

## Code Standards

- TypeScript strict. No `any`. No `console.log` in production.
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `perf:`, `security:`
- Functions ≤ 30 lines. Files ≤ 300 lines. Components ≤ 200 lines.
- ESLint + Prettier enforced via hooks.

## Git Workflow

- Never push to `main`/`master` directly.
- Feature branches: `feat/description`, `fix/description`
- Squash merge. Clean history.
- **Merge approval**: Never run `gh pr merge` unless the user explicitly says "merge", "merge it", "yes merge", or similar. Show the PR URL first and ask. This is a conversation-level rule — Claude can read context and follow it.

## Build Commands

For projects using APEX:
- `npm run dev` / `npm run build` / `npm run test` / `npm run lint` / `npm run format`

For the APEX Framework itself:
- `bash -n .claude/scripts/*.sh` — syntax validation for all scripts

## Commit Message Rules

- Subject line max **72 characters** (enforced by commit-msg hook)
- Format: `type(scope): description` (e.g., `feat(statusline): add PR link`)
- Use the commit body for details — keep subject concise
- When using `gh pr edit`, use REST API (`gh api repos/OWNER/REPO/pulls/N -X PATCH`) if GraphQL fails

## Update

When the user says "update apex", "update framework", "pull latest", or `/update`:

```bash
# Step 1: Pull latest from GitHub (gh works inside Claude Code sandbox)
if [ -d ~/.apex-framework/.git ]; then
  cd ~/.apex-framework && git fetch origin main --depth=1 && git reset --hard origin/main
else
  gh repo clone lsfdsb/apex-framework ~/.apex-framework -- --depth=1 --branch main
fi

# Step 2: Install into current project
~/.apex-framework/install.sh
```

This works even if the project has an outdated APEX version without the `/update` skill.

## Workflow — Autonomous Pipeline

When the user asks to build something new, APEX drives the full pipeline autonomously. The user makes decisions at 3 gates only:

1. **Approve PRD** — auto-generated, presented for review
2. **Approve Architecture** — auto-designed, presented for review
3. **Approve Ship** — PR created, user says "merge"

Everything between gates is autonomous: API verification (WebSearch), Design DNA loading, team spawning, building, QA, security, accessibility, CX review, and documentation. If a quality gate fails, fix and re-run — no user intervention needed.

**Do NOT ask the user to type slash commands.** The pipeline invokes skills internally. The user just says what they want and approves at gates.

For quick fixes, bugs, and questions — skip the pipeline entirely. Just do it.

## Agent Teams

Use `/teams` for full orchestration details, presets, and the Breathing Loop.

### Always-On Agents

These run in EVERY coding session, even without `/teams`:

1. **Watcher** — Background agent at session START. `subagent_type: "watcher"`, `run_in_background: true`.
2. **Technical Writer** — BEFORE any PR or commit. `subagent_type: "technical-writer"`, `run_in_background: true`. Tell it WHAT changed and WHICH PRs. Nothing ships undocumented.

### When to Spawn Teams

Auto-invoke `/teams` if task touches 3+ files, 2+ concerns, or user says "build/implement/create". Don't spawn for single-file edits or tasks completable in < 5 turns.

### Critical Rules (from real failures)

1. **Verify worktree output** — After builder completes, verify files exist in main project. Don't trust "done" messages.
2. **Builders MUST commit in worktree** — `git add --all -- ':!node_modules' ':!.next' ':!.cache' && git commit`. File loss has occurred in 6+ sessions.
3. **Use `git checkout` to merge** — Not `git merge`. Avoids untracked file conflicts.
4. **Single-builder tasks use `isolation: none`** — Worktrees only for parallel builders on conflicting files.
5. **Inject DNA into builder prompts** — Include palette, fonts, patterns from `docs/design-dna/`. Generic prompts = generic cold UI.
6. **Escalation** — Builder fails once: re-spawn with `isolation: none`. Fails twice: Lead writes code directly.
