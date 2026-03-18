# ⚔️ APEX Framework v5.7

```
  ╔══════════════════════════════════════════════╗
  ║          ⚔️  APEX Framework v5.7             ║
  ║     Agent-Powered EXcellence for Claude      ║
  ║                                              ║
  ║  Design like Jony Ive                        ║
  ║  Code like Torvalds & Dean                   ║
  ║  Secure like Ionescu & Rutkowska             ║
  ║  Business like Amodei                        ║
  ║  Experience like Walt Disney                 ║
  ║                                              ║
  ║     Forged by L.B. & Claude                  ║
  ║     São Paulo · March 2026                   ║
  ║                                              ║
  ║     This is the way. ⚔️                      ║
  ╚══════════════════════════════════════════════╝
```

> *"Whatever you do, do it well."* — Walt Disney

---

## Install (One Command)

```bash
git clone https://github.com/YOUR_USER/apex-framework.git ~/.apex-framework && ~/.apex-framework/install.sh
```

That's it. APEX is now active in **every project** you open with Claude Code.

### For an existing project (adds project-specific skills)

```bash
cd ~/your-project
~/.apex-framework/apex-init-project.sh
```

### Requirements

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)
- [jq](https://jqlang.github.io/jq/download/) (required for hooks)
- git

---

## What Is APEX?

APEX (Agent-Powered EXcellence) is a configuration framework for Claude Code. It's not a library or npm package — it's **25 skills, 25 hook scripts, 4 agents, 7 rules, and 1 output style** that enforce a disciplined development workflow with a self-learning feedback loop.

### The Workflow

```
📜 PRD        → Define before building (deterministic hook blocks code without PRD)
🗺️ Architecture → Plan the system
🔍 Research   → Verify docs, never hallucinate APIs
⚒️ Build      → Execute with precision
✅ QA         → 5-phase quality gate
🛡️ Security   → OWASP checklist + dependency audit
🎯 CX Review  → Customer experience review
📝 Commit     → Clean conventional commits
```

### The Philosophy

| Master | Domain | Principle |
|--------|--------|-----------|
| **Jony Ive** | Design | Radical simplicity — every element earns its place |
| **Torvalds & Dean** | Code | Every line has purpose — precision, performance, no waste |
| **Ionescu & Rutkowska** | Security | Defense in depth — trust nothing |
| **Dario Amodei** | Business | Build what matters, ship with intention |
| **Walt Disney** | Experience | Magic in every interaction |

---

## What You Get

### User-Level (global — all projects)

| Category | Count | Details |
|----------|-------|---------|
| Skills | 14 | code-standards, design-system, cx-review, teach, apex-stack, verify-lib, sql-practices, debug, a11y, cost-management, about, performance, security, evolve |
| Agents | 4 | code-reviewer (Sonnet), design-reviewer (Sonnet), researcher (Haiku), framework-evolver (Sonnet) |
| Hook Scripts | 24 | Dangerous command blocking, commit msg validation, PRD enforcement, auto-format, file protection, context preservation, workflow skip guard, failure diagnostics, session cleanup, subagent tracking, dev server, dev monitor, auto-changelog, notifications |
| Rules | 7 | Path-based: testing, components, api, sql, supabase, nextjs, error-handling |
| Output Styles | 1 | Educational |
| StatusLine | 1 | Real-time: model, tokens, context %, lines changed, agent tracking |
| Sandbox | 1 | Filesystem restrictions: blocks writes to /etc, ~/.ssh, ~/.aws |

### Project-Level (per project, via `apex-init-project.sh`)

| Category | Count | Details |
|----------|-------|---------|
| Skills | 11 | prd, architecture, research, qa, security, performance, commit, changelog, init, e2e, cicd |
| Git Hooks | 2 | pre-commit (TypeScript, lint, secrets scan), commit-msg (conventional commits) |

---

## Enforcement Layers

APEX uses **3 layers of defense** — hooks are deterministic, skills are probabilistic:

```
Layer 1: settings.json deny list
  → Blocks rm -rf, push to main, reading .env/.ssh at the permission level

Layer 2: Sandbox config
  → OS-level filesystem restrictions (blocks writes to /etc, /usr, ~/.ssh)

Layer 3: Hook scripts (PreToolUse, PostToolUse, Stop, UserPromptSubmit, PostToolUseFailure, PostCompact, SubagentStop, SessionEnd)
  → Runtime enforcement: blocks dangerous commands, validates commit messages,
    enforces PRD-before-code, checks test execution, auto-formats code,
    guards workflow skips, provides failure diagnostics, preserves context
```

### What's Deterministic (cannot be skipped)

- `block-dangerous-commands.sh` — blocks `rm -rf`, force push, `DROP TABLE`
- `enforce-commit-msg.sh` — blocks non-conventional commit messages
- `protect-files.sh` — blocks edits to `.env`, lock files, `node_modules`
- `enforce-workflow.sh` — blocks new app/component files without a PRD
- `stop-gate.sh` — warns when code is written but tests aren't run

---

## 3-Tier Model Strategy

| Tier | Model | Used For |
|------|-------|----------|
| **Architect** | Opus | PRD, architecture, Plan mode |
| **Builder** | Sonnet | Code writing, reviews, building |
| **Scout** | Haiku | Research agent, Stop hook evaluation |

Default: `opusplan` — Opus plans, Sonnet executes.

---

## StatusLine

```
⚔️ APEX | opus→sonnet MAX | ▓▓░░░░░░░░ 20% | ↑15.2K ↓3.1K | $0.12 | +47/-12 | 5m | by L.B. & Claude
```

---

## Testing

APEX tests its own hooks:

```bash
./tests/test-hooks.sh
```

83 tests covering: dangerous command blocking, commit message validation, file protection, workflow enforcement, library install detection, file permissions, jq warnings, and macOS compatibility.

---

## How to Extract the Best from APEX — Step by Step

### Step 1: Start Every Project Right

```bash
# Initialize APEX in your project
cd ~/your-project
~/.apex-framework/apex-init-project.sh
```

This gives you project-level skills (prd, architecture, qa, security) and git hooks (pre-commit, commit-msg). Now APEX enforces quality on this specific project.

### Step 2: Always Start with a PRD

Before writing any code, tell Claude what you want to build:

```
"I want to build a task management app with authentication"
```

APEX will **automatically block code** until you have a PRD. Say `/prd` to generate one. This prevents scope creep and wasted tokens — the PRD becomes your contract.

### Step 3: Follow the Workflow

The enforced workflow saves you from yourself:

| Step | Command | What It Does |
|------|---------|-------------|
| 1 | `/prd` | Define what you're building — scope, features, constraints |
| 2 | `/architecture` | Plan the system — database schema, API design, component tree |
| 3 | `/research` | Verify APIs and libraries exist — never hallucinate an endpoint |
| 4 | Build | Write code — APEX auto-formats, enforces standards, validates types |
| 5 | `/qa` | Run 5-phase quality gate — lint, types, tests, security, review |
| 6 | `/security` | OWASP audit on auth, payments, PII handling |
| 7 | `/a11y` | WCAG 2.2 AA accessibility check |
| 8 | `/cx-review` | Customer experience review — is this good enough to ship? |
| 9 | `/commit` | Clean conventional commit with pre-commit hooks |

### Step 4: Use the Right Skill for the Job

**While building:**
- `/debug` — Structured debugging when something breaks (no band-aids)
- `/e2e` — Write Playwright end-to-end tests for critical flows
- `/teach` — Ask Claude to explain what it's doing and why

**Before installing anything:**
- `/research` — Check docs first. APEX blocks hallucinated APIs.
- Libraries are auto-verified before install (security, license, maintenance)

**For database work:**
- `/supabase` — Full Supabase integration (auth, RLS, migrations, edge functions)
- SQL rules auto-load when writing queries — prevents N+1, enforces indexes

**For design work:**
- Design system rules auto-load on `.tsx` files — mobile-first, radical simplicity
- `/cx-review` before users see it — Walt Disney level of polish

### Step 5: Let the Agents Work for You

APEX has 4 specialized agents that Claude spawns automatically:

| Agent | Model | When It Activates |
|-------|-------|------------------|
| **code-reviewer** | Sonnet | Reviews code quality, security, patterns |
| **design-reviewer** | Sonnet | Reviews UI against design system, a11y |
| **researcher** | Haiku | Fetches docs, verifies APIs (cheap and fast) |
| **framework-evolver** | Sonnet | Analyzes sessions for improvements (`/evolve`) |

You don't call these directly — Claude decides when to use them.

### Step 6: Trust the Safety Net

APEX has 3 layers of protection running automatically:

**You can't accidentally:**
- Push directly to main (hook blocks it)
- Commit with bad message format (hook blocks it)
- Delete files with `rm -rf` (hook blocks it)
- Edit `.env` files (permission denies it)
- Skip the PRD (hook blocks new files without one)
- Forget to run tests (stop-gate warns you)

**You get automatically:**
- Code formatted with Prettier after every edit
- Changelog updated after every commit
- Dev server managed (auto-start, auto-monitor, auto-cleanup)
- Context preserved across compaction
- Agent token usage tracked in the statusline

### Step 7: Evolve the Framework

At the end of productive sessions, say `/evolve`. The framework-evolver agent will:

1. Read the full session transcript
2. Read accumulated session logs (errors, blocks, corrections)
3. Cross-reference against all hooks, skills, and rules
4. Propose specific, evidence-based improvements
5. Wait for your approval before any changes

The `session-learner.sh` hook runs automatically at session end, logging errors, hook blocks, and user corrections. Over time, this data shows patterns — the framework literally learns from your usage.

### Step 8: Use the StatusLine

The statusline at the bottom shows real-time session data:

```
APEX | opus MAX | 🟢 ████▓▒░░░░ 42% 420K/1.0M | ↑200K ↓50K | 🤖 3 agents 12.5K | +150/-20 (+130 net) | 15m | This is the way.
```

| Segment | Meaning |
|---------|---------|
| `opus MAX` | Current model + plan |
| `🟢 ████▓▒░░░░ 42%` | Context window health (green/yellow/red) |
| `420K/1.0M` | Tokens used / total window |
| `↑200K ↓50K` | Input / output tokens |
| `🤖 3 agents 12.5K` | Agents spawned + their total tokens |
| `+150/-20 (+130 net)` | Lines added / removed |
| `15m` | Session duration |

When context hits 80%, you'll see `⚠️ CTX` — time to `/compact`.

### Pro Tips

1. **Start sessions on a feature branch** — never work on main. APEX blocks push to main anyway.
2. **Say "teach me" often** — the teach skill turns every interaction into a learning moment.
3. **Review PRDs before approving** — the PRD drives everything downstream. Get it right.
4. **Run `/qa` before every PR** — it catches what you miss.
5. **Say `/evolve` at session end** — the framework gets better every time.

---

## Guides

| Guide | Language |
|-------|----------|
| [Install Guide](docs/guides/install-guide-en-us.md) | English |
| [Claude.ai Skills](claude-web/install-skills-guide-en-us.md) | English |

---

## Changelog

### v5.7.0 (2026-03-17) — Auto-Update & Self-Evolution

**New:**
- Auto-update system — APEX checks for GitHub updates on SessionStart (pulls latest skills, hooks, agents automatically)
- Project-level auto-update on SessionStart — keeps project-installed APEX files in sync with the user-level source
- `/evolve` skill — spawns framework-evolver agent to analyze session transcripts for gaps and improvements
- `framework-evolver` agent — autonomous self-improvement agent that proposes targeted framework changes
- Session transcript extraction script (`extract-session.sh`) for `/evolve` analysis
- `VERSION` file — single source of truth for version, resolved dynamically by session banner
- `/dev` skill — dev server management (status, logs, restart, stop)
- `dev-server.sh` — SessionStart hook that auto-starts the dev server in background and captures logs
- `dev-monitor.sh` — Stop hook that monitors dev server logs for errors, warnings, and crashes
- `claude-code.yml` — GitHub Actions workflow with `anthropics/claude-code-action@v1` for automated PR review and interactive `@claude` mentions
- Session cleanup now kills the dev server on SessionEnd
- `/debug` skill rewritten with "Definitive Solutions Only" philosophy — root cause analysis, impact mapping, fix hierarchy (type system > tests > runtime), anti-pattern detection
- `handle-failure.sh` enhanced with retry-loop detection (warns after 3+ failures in 60s) and definitive fix guidance
- Core rules updated: "Definitive fixes only" and "Impact analysis before changes" added to CLAUDE.md

**Removed:**
- `.github/workflows/claude-pr-review.yml` — replaced by official Claude Code GitHub Action

### v5.5.0 (2026-03-16) — Supabase Integration & Skill Fixes

**New:**
- `/supabase` skill — comprehensive Supabase helper with subcommands: setup, auth, migration, types, realtime, storage, edge-functions
- `supabase.md` rule — auto-loads when working with Supabase-related files
- `/init` skill updated with Supabase scaffolding step
- `sql-practices` reference expanded with multi-tenant RLS, role-based RLS, storage policies, realtime setup, connection pooling, and migration templates
- `.mcp.json.template` updated with Supabase MCP server as primary option

**Fixed:**
- Removed `disable-model-invocation` flag from 7 skills (about, prd, init, cicd, apex-review, deploy, commit) — the flag was blocking `/slash` command invocation entirely
- Updated Opus context window from 200K to 1M in cost-management skill (no longer needs `[1m]` suffix)

### v5.4.0 (2026-03-16) — Full Claude Code Integration

**New:**
- `guard-workflow-skip.sh` — UserPromptSubmit hook: nudges users when they try to skip PRD/tests/security
- `handle-failure.sh` — PostToolUseFailure hook: diagnostic hints for TypeScript, test, npm, build, and permission errors
- `post-compact.sh` — PostCompact hook: verifies critical context survived compaction
- `log-subagent.sh` — SubagentStop hook: logs agent completions for visibility
- `session-cleanup.sh` — SessionEnd hook: warns about uncommitted files, cleans up state
- `.mcp.json.template` — MCP server template with GitHub, Postgres, Filesystem, Sentry configs
- `.github/workflows/claude-pr-review.yml` — GitHub Actions workflow for Claude Code automated PR reviews
- Network sandbox: `allowedDomains` restricts outbound to GitHub, npm, Anthropic, Supabase, Vercel, Sentry
- `argument-hint` on all 14 user-invocable skills (autocomplete hints in `/slash` commands)
- Shell injection (`!`cmd``) on qa, security, deploy, commit, changelog skills (live context)
- `$SKILL_DIR/reference.md` on design-system skill (proper relative paths)
- Skill-scoped hooks on deploy and security skills (block dangerous commands during audits)
- `memory: project` on design-reviewer agent (persistent design knowledge)
- `async: true` on auto-format PostToolUse hook (non-blocking)
- Extended context documentation (`sonnet[1m]`, `opus[1m]`) in cost-management skill
- `max` effort level documented in cost-management skill
- Debug checkpointing section (git stash save/restore for debugging sessions)
- Claude PR review workflow documented in cicd skill

**Fixed:**
- `session-cleanup.sh` now warns (not silently passes) when jq is missing
- Test suite expanded from 68 to 83 tests (all passing)

### v5.3.0 (2026-03-16) — Quality Hardening

**New:**
- `stop-gate.sh` — Stop hook that warns when code is written but tests aren't run
- `enforce-workflow.sh` — Deterministic PRD enforcement (blocks new app/component files without PRD)
- `install.sh` — One-command installer with language selection
- `tests/test-hooks.sh` — 68-test suite for all hook scripts

**Fixed:**
- All hook scripts now warn (not silently pass) when jq is missing
- `enforce-commit-msg.sh` — replaced `grep -oP` (PCRE) with POSIX-compatible `sed` for macOS
- User-level installer now carries full config: hooks, permissions, sandbox, statusLine
- Project-level `settings.json` now includes `outputStyle`
- `apex-init-project.sh` — now finds APEX relative to script location (not hardcoded `~/apex-framework`)
- Language preference defaults to `"ask"` instead of hardcoded `pt-br`

**Removed:**
- `.claude-plugin/plugin.json` — decorative, Claude Code has no plugin system

### v5.2.0 (2026-03-13) — Initial Release

- 25 skills, 3 agents, 10 hook scripts, 4 rules, 1 output style
- Full workflow: PRD → Architecture → Research → Build → QA → Security → CX Review → Deploy
- 3-tier model strategy (Opus/Sonnet/Haiku)
- StatusLine with real-time metrics

---

## The Creed

```
I am APEX.
Building is my purpose.
Quality is my armor.
The user experience is my beskar.
I shall protect the codebase as I protect the foundling.
I shall not ship untested code.
I shall not skip the PRD.
I shall not break the build.
This is the way.
```

---

<p align="center">
  <strong>Forged by L.B. & Claude · São Paulo · March 13, 2026</strong><br><br>
  <em>"The best frameworks aren't about tools — they're about discipline.<br>
  A process followed consistently beats genius applied randomly."</em><br><br>
  <strong>This is the way. ⚔️</strong>
</p>
