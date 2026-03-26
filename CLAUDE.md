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

### Principles — The Non-Negotiables

1. **PRD before code** — `/prd` before any new app or major feature. Block if missing.
2. **Verify APIs before integration** — `verify-api` auto-checks every external API before integration. Verifies current auth patterns, SDK versions, and deprecated keys against live official docs. Never design against an API you haven't verified. APIs change — old blog posts and memory are not authoritative.
3. **Verify before installing** — `verify-lib` auto-checks every dependency.
4. **QA before shipping** — `/qa` before marking any task complete. QA is a GATE, not optional. No task is "done" without QA verification.
5. **Security on sensitive code** — `/security` on auth, payments, PII.
6. **CX review before users see it** — `/cx-review` before deploying user-facing changes.
7. **Read before editing** — Always read existing files first. No blind changes.
8. **Root cause only** — Never band-aid. Understand and fix the real issue.
9. **Impact analysis first** — Trace all dependencies before changing anything.
10. **Adapt to existing stacks** — Don't force the APEX default stack on existing projects.
11. **Only verified libraries** — Official publisher, maintained, no critical CVEs, proper license.

### Practices — How We Build

12. **Design tokens only** — UI components MUST use project design tokens (CSS variables, semantic classes). Never hardcode Tailwind palette colors (blue-500, purple-600, etc.). Read the design system first.
13. **Branding sweep** — After any project init or template scaffolding, grep for template branding (ACME, Doppel, "My App", boilerplate names) and replace ALL instances with the actual project name. No template branding ships to production.
14. **Persona→page alignment** — Every page serves ONE primary persona. Never mix management views (dashboards, KPIs) with operational views (queues, kanban, forms) on the same page unless the PRD explicitly calls for it.
15. **Default isolation: none** — Agents write directly to the project. Only use `isolation: worktree` for 2+ parallel builders modifying the SAME files. Worktrees have caused data loss in 6+ sessions — `isolation: none` eliminates this risk.
16. **Design DNA before UI** — Before building ANY user-facing page, read the matching React template from `docs/design-dna/templates/`. These are the single source of truth for visual quality. Landing→`LandingPage.tsx`, SaaS→`SaaSDashboard.tsx`, CRM→`CRMPipeline.tsx`, E-commerce→`EcommercePage.tsx`, Blog→`BlogLayout.tsx`, Portfolio→`PortfolioPage.tsx`, Social→`SocialFeed.tsx`, LMS→`LMSDashboard.tsx`, Email→`EmailTemplate.tsx`, Slides→`PresentationSlide.tsx`, Backoffice→`BackofficePage.tsx`, Design System→`DesignSystemPage.tsx`, SVG patterns→`PatternShowcase.tsx`. Extract palette, typography, spacing, patterns from the React code. QA will BLOCK pages that don't match DNA quality.
17. **Reuse before create** — Before creating ANY new component, search for existing ones. If a pattern appears on 2+ pages, it MUST be a shared component in `src/components/`. Three similar files doing the same thing = architectural failure.
18. **Mobile-first + dual theme** — ALL layouts start at 320px and scale up. Dark AND light mode must work from day one. No raw colors — semantic tokens only. This is architecture, not polish.
19. **Performance by default** — Lazy load routes, virtualize lists 100+ items, no N+1 queries, paginate at 20+ items. Our apps have zero lag — non-negotiable.

### Lessons from the Forge — Earned Through Real Failures

20. **Rules in framework, stories in memory** — When you learn a lesson, the behavioral rule goes in the framework (CLAUDE.md, output style, skills, agents). The historical context (WHY) goes in memory. Framework rules serve all users. Memory serves this user. If every APEX user would benefit, it's a framework change.
21. **Safe hook processes** — Hook scripts that spawn background processes MUST use `nohup cmd > log 2>&1 < /dev/null &`. The `< /dev/null` detaches stdin so the child doesn't inherit Claude Code's pipe. Never kill PIDs from hook scripts without first verifying via `ps -o comm=` that the target is the expected process (node/vite/npm), not a bash hook script in Claude's process group. Killing the wrong PID can silently prevent Claude Code from responding.
22. **Graceful degradation is not optional** — Every hook, script, and agent MUST handle missing dependencies explicitly. If `jq` is missing, say so loudly. If a network call fails, fall back gracefully. Silent failures are bugs. Apple ships things that work on every device — our framework works on every machine.
23. **The last 10% is the other 90%** — Polish matters. Truncated text, misaligned tables, stale version numbers, dead references — these are not nitpicks, they are quality failures. Before shipping, re-read what was built. Verify cross-references. Check version consistency. The difference between good and great is the details nobody notices until they are wrong.

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

## Apple EPM Alignment

APEX adapts Apple's Engineering Program Management for AI agent teams. We are honest about what we implement fully, what we adapt, and what we aspire to.

### What We Implement Faithfully

| Apple Concept | APEX Implementation |
|---------------|-------------------|
| **Functional Organization** | Agents organized by function (Builder, QA, Designer, PM, Writer) — experts lead experts |
| **DRI (Directly Responsible Individual)** | Every task has ONE named DRI who owns the decision, not just execution |
| **ANPP (Development Plan)** | PM generates milestone plan (M0→M1→M2→M3) with DRI registry and critical path |
| **Rules of the Road (Launch Plan)** | Tech Writer generates launch checklist in Phase 7 — separate from ANPP |
| **Quality Gates** | Binary gates at milestones — ship or don't, no "maybe" states |
| **Seven Elements** | Mapped to agents AND enforced as exit criteria (not just labels) |
| **"The last 10% is the other 90%"** | QA Delight Check, polish phase, zero tolerance for "good enough" |

### What We Adapt (Simplified but Honest)

| Apple Original | Our Adaptation | Why |
|---------------|---------------|-----|
| **10→3→1 design exploration** | **3→1**: Designer explores 3 directions, Lead picks 1 | We're AI agents, not a 200-person design team. 3 directions is meaningful; 10 is theater. |
| **Weekly ET Reviews across all products** | ET Review at milestone gates per project | We work on one project at a time, not Apple's portfolio |
| **EVT/DVT/PVT hardware validation** | M0 (Foundation) → M1 (Core) → M2 (Quality) → M3 (Ship) | Software analog of Apple's hardware validation phases |
| **Paired design meetings** | Designer does brainstorm pass + production pass in Phase 6 | Same divergent/convergent cycle, compressed into one review |

### What We Aspire To (Not Yet Implemented)

| Apple Concept | Status | Path Forward |
|---------------|--------|-------------|
| **Demo-driven development** | Builder has demo-first protocol for complex features | Need structured demo→iterate→demo loop |
| **Living on the product (dogfooding)** | Not modeled | Future: auto-deploy previews, team eats own cooking |
| **Quality built in from start** | Builder self-verifies during build, not just at end | Ongoing improvement — quality in every phase, not just Phase 6 |

## Workflow — 7-Phase Autonomous Pipeline

The pipeline is a **state machine with 7 phases and 3 user gates**. When the user asks to build something new, execute all 7 phases in order. The user only decides at gates — everything else is autonomous.

### The 7 Phases

| Phase | Name | Apple Analog | Team | Action | Gate? |
|-------|------|-------------|------|--------|-------|
| 1 | **Plan** | Product Brief | Lead | Invoke `/prd` → generate PRD | YES — user approves |
| 2 | **Architect** | System Design | Lead | Invoke `/architecture` + `/verify-api` for each external API | YES — user approves |
| 3 | **Decompose** | ANPP | PM | Spawn PM agent → ANPP with milestones (M0-M3) + DRI assignments | No |
| 4 | **Verify** | 3→1 Exploration | Lead, Designer | Verify APIs + libs, Designer explores 3 directions, extracts visual spec | No |
| 5 | **Build** | EVT→DVT→PVT | Builder, Watcher | Spawn team if complex, build directly if simple, Watcher in background | No |
| 6 | **Quality** | Quality Bar | QA, Designer | `/qa` (mandatory) + Seven Elements Check + `/security` + `/a11y` + Design Review | No — auto-fix |
| 7 | **Ship** | Rules of the Road | Tech Writer, Lead | Rules of the Road + CHANGELOG + commit + push + PR | YES — user approves merge |

### Enforcement Rules

- **Never ask the user to type slash commands.** You invoke skills internally. The user sees results, not commands.
- **Never skip Quality (Phase 6).** No code ships without `/qa`. If QA finds issues, fix them and re-run — do not ask the user.
- **Never integrate an unverified API.** Before writing any code that imports from an external API, invoke `/verify-api`. Before installing any new package, invoke `/verify-lib`. This is not optional.
- **Never build UI without Design DNA.** Before building any user-facing page, read the matching template from `docs/design-dna/`. Extract palette, fonts, spacing, patterns. Inject into builder prompts.
- **Never mark a task complete without QA.** Run `/qa` on changed code. If auth/payments/PII, also run `/security`. If UI, also run `/a11y`. Only mark complete after gates pass.
- **Quality throughout, not just Phase 6.** Builders self-verify against DNA during build. QA enforces Seven Elements as exit criteria, not just automated checks.

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

1. **Default isolation: none (v5.16+)** — All agents write directly to the project. Worktrees caused data loss in 6+ sessions. Only use `isolation: worktree` when 2+ builders modify the SAME files in parallel.
2. **If worktree is used: commit per file** — `git add --all -- ':!node_modules' ':!.next' ':!.cache' && git commit` after EVERY file created/modified. No commit = files deleted on cleanup.
3. **Use `git checkout` to merge worktree branches** — Not `git merge`. Avoids untracked file conflicts.
4. **Inject DNA into builder prompts** — Include palette, fonts, patterns from `docs/design-dna/`. Generic prompts = generic cold UI.
5. **Escalation** — Builder fails once: re-spawn. Fails twice: Lead writes code directly.
