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

`/prd` → `/architecture` → `/research` → build → `/qa` → `/security` → `/a11y` → `/cx-review` → `/commit`

Skills load on-demand. Hooks are deterministic. Both are enforced.
When in doubt, ask the user. Don't assume.

## Agent Teams

Teams are the APEX force multiplier. The Lead (main session) auto-spawns coordinated teams when a task warrants it — no manual `/teams` required for complex work.

### Always-On Agents

These agents run in EVERY coding session, even without `/teams`:

1. **Watcher** — Spawn as background agent at the START of any session that involves code changes. No team required. Use `Agent` with `subagent_type: "watcher"` and `run_in_background: true`.
2. **Technical Writer** — Spawn BEFORE creating any PR or commit that changes code. Updates CHANGELOG.md and README.md automatically. Use `Agent` with `subagent_type: "technical-writer"` and `run_in_background: true`. **Nothing ships undocumented.**

These are NOT optional. The Lead MUST spawn them. If you forget, you are failing the framework.

### Autonomous Team Spawn Rules

When the user gives a task, evaluate complexity and **auto-invoke `/teams`** if:
- Task touches 3+ files or 2+ concerns (frontend + backend, etc.)
- Task is a new feature, major refactor, or production bug
- Task explicitly mentions "team", "parallel", "agents", or "swarm"
- User says "build", "implement", "create" for non-trivial features

Do NOT spawn a full team for:
- Single-file edits, quick fixes, questions, or explanations
- Tasks completable in < 5 turns
- Research-only or documentation tasks

**But ALWAYS spawn Watcher + Technical Writer regardless of task size.**

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

### Presets
- `build` — Watcher + Builder + QA + Technical Writer (features, refactoring)
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

### Principles
1. **Always use TeamCreate** — Never spawn regular subagents for team work. Use TeamCreate + Agent with team_name
2. **Smart spawn** — Right-size the team. Don't over-staff simple tasks
3. **Watcher always first** — Monitoring starts before any code changes
4. **Aggressive parallelism** — QA auto-starts when Builder/Debugger finishes
5. **Tasks are source of truth** — TaskCreate/TaskUpdate coordinate work
6. **Auto-handoff** — Builder→QA→Reviewer chain runs without manual triggers
7. **Always shutdown** — Clean up teammates and teams when done
