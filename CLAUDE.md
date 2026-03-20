# APEX Framework — Project Constitution
<!-- Forged by Lucas Bueno & Claude · São Paulo, March 2026 · /about -->

> "Simplicity is the ultimate sophistication." — Da Vinci

## Bootstrap

If this project has no `.claude/skills/` directory and the user asks to build something, detect the APEX framework at `~/.apex-framework/` and offer to run `/init` to set it up. Explain what it installs (skills, hooks, agents, rules, safety net) and why (enforced quality, security scanning, educational workflow). If `~/.apex-framework/` doesn't exist, show the one-line clone command:

```
git clone https://github.com/lsfdsb/apex-framework.git ~/.apex-framework && ~/.apex-framework/install.sh
```

## Identity

**APEX** (Agent-Powered EXcellence) — our Claude Code framework for building world-class apps. Design like Ive, code like Torvalds & Dean, secure like Ionescu & Rutkowska, business like Amodei, experience like Disney.

## Core Rules

1. **PRD before code** — `/prd` before any new app or major feature. Block if missing.
2. **Research before integration** — `/research` before any new API or library. When the PRD mentions external services (Twilio, Stripe, WhatsApp, etc.), research is MANDATORY before the builder touches integration code.
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
16. **Design DNA before UI** — Before building ANY user-facing page, read the matching pattern from `docs/design-dna/`.
17. **Reuse before create** — Before creating ANY new component, search for existing ones. If a pattern appears on 2+ pages, it MUST be a shared component in `src/components/`. Three similar files doing the same thing = architectural failure.
18. **Mobile-first + dual theme** — ALL layouts start at 320px and scale up. Dark AND light mode must work from day one. No raw colors — semantic tokens only. This is architecture, not polish.
19. **Performance by default** — Lazy load routes, virtualize lists 100+ items, no N+1 queries, paginate at 20+ items. Our apps have zero lag — non-negotiable. This is our visual quality bar. Landing→`landing.html`, SaaS→`saas.html`, CRM→`crm.html`, E-commerce→`ecommerce.html`, Blog→`blog.html`, Portfolio→`portfolio.html`, Social→`social.html`, LMS→`lms.html`, Email→`email.html`, Slides→`presentation.html`, E-book→`ebook.html`, Backoffice→`backoffice.html`, SVG patterns→`patterns.html`+`svg-backgrounds.js`. The Design Reviewer will BLOCK pages that don't match DNA quality.
13. **Branding sweep** — After any project init or template scaffolding, grep for template branding (ACME, Doppel, "My App", boilerplate names) and replace ALL instances with the actual project name. No template branding ships to production.
14. **Persona→page alignment** — Every page serves ONE primary persona. Never mix management views (dashboards, KPIs) with operational views (queues, kanban, forms) on the same page unless the PRD explicitly calls for it.
15. **Verify worktree output** — After any builder agent completes in a worktree, verify files exist in the main project before proceeding. Worktree cleanup can delete files silently.

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
- `bash tests/test-framework.sh` — 288 structural and functional tests
- `bash tests/test-hooks.sh` — 115 hook behavior tests
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

## Workflow

`/prd` → `/architecture` (includes component audit) → `/research` → build → `/qa` → `/security` → `/a11y` → `/cx-review` → `/commit`

Skills load on-demand. Hooks are deterministic. Both are enforced.
When in doubt, ask the user. Don't assume.

## Agent Teams

Teams are the APEX force multiplier. The Lead (main session) auto-spawns coordinated teams when a task warrants it — no manual `/teams` required for complex work.

### Always-On Agents

These agents run in EVERY coding session, even without `/teams`:

1. **Watcher** — Spawn as background agent at the START of any session that involves code changes. No team required. Use `Agent` with `subagent_type: "watcher"` and `run_in_background: true`.
2. **Technical Writer** — Spawn BEFORE creating any PR or commit that changes code. Updates CHANGELOG.md and README.md automatically. Use `Agent` with `subagent_type: "technical-writer"` and `run_in_background: true`. **Nothing ships undocumented.**

   **How to spawn the Technical Writer properly:**
   ```
   Agent({
     subagent_type: "technical-writer",
     run_in_background: true,
     prompt: "Audit and update docs for this session. Changes: [DESCRIBE CHANGES]. PRs: [LIST PR NUMBERS AND TITLES]. Run gap detection first — verify CHANGELOG covers all recent PRs."
   })
   ```
   Always tell the writer WHAT changed and WHICH PRs were merged. Vague prompts = missed entries.

These are NOT optional. The Lead MUST spawn them. If you forget, you are failing the framework.

### Autonomous Team Spawn Rules

When the user gives a task, evaluate complexity and **auto-invoke `/teams`** if:
- Task touches 3+ files or 2+ concerns (frontend + backend, etc.)
- Task is a new feature, major refactor, or production bug
- Task explicitly mentions "team", "parallel", "agents", or "swarm"
- User says "build", "implement", "create" for non-trivial features
- Task involves building UI components (auto-include Design Reviewer in the team)
- Task involves external API integrations (auto-include Researcher in the team)

Do NOT spawn a full team for:
- Single-file edits, quick fixes, questions, or explanations
- Tasks completable in < 5 turns
- Research-only or documentation tasks

**But ALWAYS spawn Watcher + Technical Writer regardless of task size.**

### Enforcement: What Failed in Past Sessions

These rules exist because they were violated in real builds. Do NOT repeat these mistakes:

1. **Team orchestration is NOT optional for multi-file work** — If the task creates 5+ files, you MUST use `/teams`. Ad-hoc builder subagents without Watcher/QA is a framework violation.
2. **QA must run after every build phase** — Not just before commit. After each builder completes a milestone, QA verifies. This is the Breathing Loop.
3. **Design Reviewer must review UI** — If .tsx/.jsx files are created, Design Reviewer checks design token compliance, persona alignment, and branding. This is part of the `build` preset now.
4. **Worktree output must be verified** — After any builder in a worktree reports "done", the lead MUST verify files exist in the main project. Do NOT trust "success" messages from worktree agents without checking.
5. **Research before integration code** — If the PRD lists external APIs, `/research` runs BEFORE the builder writes integration code. Never design against an API you haven't read the docs for.
6. **Lead never does builder work** — If a builder fails (worktree file loss, stuck, etc.), do NOT rewrite files as the lead. Re-spawn a builder with `isolation: none` instead. Lead writes code only for single-file quick fixes. This prevents burning Opus context on Sonnet-level work.
7. **Builders MUST commit in worktree** — Before reporting "done", builders run `git add -A && git commit`. Without a commit, worktree cleanup deletes all files. The lead merges from the branch. This rule exists because file loss has occurred in 4+ sessions.

### The Roster
| Role | Agent | Model | Purpose |
|------|-------|-------|---------|
| Lead | main session | opus | Orchestrates, decides, ships |
| Watcher | watcher | haiku | Continuous error monitoring |
| Builder | builder | sonnet | Feature implementation |
| Debugger | debugger | sonnet | Root cause bug fixes |
| QA | qa | sonnet | Quality gate enforcement |
| Code Reviewer | code-reviewer | sonnet | Code quality and security |
| Design Reviewer | design-reviewer | sonnet | UI/UX and accessibility |
| Technical Writer | technical-writer | haiku | CHANGELOG, README, docs |
| Researcher | researcher | haiku | API/docs investigation |
| Sentinel | sentinel | sonnet | The Dark Knight — /self-test, /batman |
| Framework Evolver | framework-evolver | sonnet | Self-improvement — /evolve |

### Presets
- `build` — Watcher + Builder + Design Reviewer + QA + Technical Writer (features, refactoring — Design Reviewer auto-included when task creates UI)
- `fix` — Watcher + Debugger + QA + Technical Writer (bugs, errors)
- `review` — Code Reviewer + Design Reviewer + QA + Technical Writer (PR review)
- `full` — All roles (major features, critical paths)

### The Breathing Loop
```
Builder creates → Watcher monitors → Debugger fixes → QA verifies → loop
```
The team operates autonomously. No human intervention needed in the loop.

### Split Panes (iTerm2)
Prerequisites (one-time setup):
```bash
brew install tmux                                          # split pane engine
```
Then enable: **iTerm2 → Settings → General → Magic → Enable Python API**

Launch with split panes (one command):
```bash
apex                              # current directory
apex ~/Projects/myapp             # specific project
```

The `apex` command (installed to `~/.local/bin/` by `install.sh`) auto-detects iTerm2 + tmux and launches `tmux -CC` + `claude --teammate-mode tmux`. Falls back to regular `claude` if tmux/iTerm2 aren't available.

**Note**: If using tmux, Ctrl+B conflicts (tmux prefix = Ctrl+B = Claude Code background shortcut). Fix: remap tmux prefix with `set -g prefix C-a` in `~/.tmux.conf`.

### Principles
1. **Always use TeamCreate** — Never spawn regular subagents for team work. Use TeamCreate + Agent with team_name
2. **Smart spawn** — Right-size the team. Don't over-staff simple tasks
3. **Watcher always first** — Monitoring starts before any code changes
4. **Aggressive parallelism** — QA auto-starts when Builder/Debugger finishes
5. **Tasks are source of truth** — TaskCreate/TaskUpdate coordinate work
6. **Auto-handoff** — Builder→QA→Reviewer chain runs without manual triggers
7. **Always shutdown** — Clean up teammates and teams when done
