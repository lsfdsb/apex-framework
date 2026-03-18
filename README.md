# ⚔️ APEX Framework v5.8

```
  ╔══════════════════════════════════════════════╗
  ║          ⚔️  APEX Framework v5.8             ║
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

## Install

Three steps. Each one teaches you something.

### Step 1: Clone the framework (once, ever)

```bash
git clone https://github.com/lsfdsb/apex-framework.git ~/.apex-framework
```

**What this does:** Downloads the APEX source code into a hidden folder (`~/.apex-framework`) in your home directory. The `~` means "my home folder" — this is where your personal tools live. The `.` prefix makes it hidden (won't clutter your Finder). You only do this once.

### Step 2: Go into your project

```bash
cd ~/my-project
```

**What this does:** `cd` means "change directory" — you're telling the terminal where to work. APEX installs per-project, so you need to be inside the project you want to set up. If you don't have a project yet: `mkdir ~/my-project && cd ~/my-project && git init`

### Step 3: Run the installer

```bash
~/.apex-framework/install.sh
```

**What this does:** Copies APEX's skills, hooks, agents, and rules into your project's `.claude/` folder. It also installs git hooks that enforce code quality, creates doc directories for your PRDs, and sets up the safety net. Each project gets its own complete copy — no shared state, no conflicts.

### For additional projects

Repeat steps 2-3 for each new project:

```bash
cd ~/another-project
~/.apex-framework/install.sh
```

### Verify it worked

```bash
.claude/scripts/health-check.sh
```

This runs a diagnostic that checks every component. If everything is green, you're ready. If something is yellow, it tells you exactly what to fix and why.

### Requirements

| Tool | Why you need it | Install |
|------|----------------|---------|
| **git** | Version control — tracks every change you make | Comes with macOS (`xcode-select --install`) |
| **jq** | JSON parser — APEX hooks use it to read Claude's tool data | [jqlang.github.io/jq](https://jqlang.github.io/jq/download/) |
| **Claude Code** | The AI coding assistant that APEX configures | [docs.anthropic.com/claude-code](https://docs.anthropic.com/en/docs/claude-code) |

---

## What Is APEX?

APEX (Agent-Powered EXcellence) is a configuration framework for Claude Code. It's not a library or npm package — it's **25 skills, 26 scripts, 4 agents, 7 rules, and 1 output style** that enforce a disciplined development workflow with a self-learning feedback loop.

**Built for leaders and PMs who want to learn engineering while building.** Every action explains What, Why, and How. Over weeks of use, you'll go from "what is a branch?" to reviewing PRs and debugging issues independently.

### The Workflow

```
📜 /prd         → Define what you're building (APEX blocks code without one)
🗺️ /architecture → Plan the system design
🔍 /research    → Verify APIs exist before using them
⚒️  Build       → Write code (APEX auto-formats, enforces standards)
✅ /qa          → 6-phase quality gate
🛡️ /security    → OWASP checklist on sensitive code
♿ /a11y        → Accessibility audit (WCAG 2.2 AA)
🎯 /cx-review   → Customer experience review
📝 /commit      → Clean conventional commit
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

Everything installs into your project's `.claude/` directory:

| Category | Count | What it does |
|----------|-------|-------------|
| **Skills** | 25 | Slash commands (`/prd`, `/qa`, `/security`, `/teach`, etc.) — each is a specialized knowledge module |
| **Scripts** | 26 | Hook scripts + utilities — the automation layer (auto-format, dangerous command blocking, etc.) |
| **Agents** | 4 | Autonomous sub-agents: code-reviewer, design-reviewer, researcher, framework-evolver |
| **Rules** | 7 | Path-based rules that auto-load when you edit certain file types (React, SQL, API, etc.) |
| **Output Style** | 1 | Educational — explains What/Why/How for every action |
| **Git Hooks** | 2 | pre-commit (type check + lint + format) and commit-msg (conventional format) |
| **StatusLine** | 1 | Real-time dashboard: model, context %, tokens, agents, lines changed |
| **Sandbox** | 1 | OS-level protection: blocks writes to /etc, ~/.ssh, ~/.aws |

---

## Safety Net — 3 Layers of Defense

APEX uses **3 layers** so you can build confidently:

```
Layer 1: Permission deny list (settings.json)
  → "You can't even ASK to do these things"
  → Blocks: rm -rf, push to main, reading .env/.ssh

Layer 2: OS Sandbox (filesystem restrictions)
  → "The operating system won't let you"
  → Blocks writes to: /etc, /usr, ~/.ssh, ~/.aws, ~/.gnupg

Layer 3: Hook scripts (runtime enforcement)
  → "APEX catches it and explains why"
  → Blocks: dangerous commands, bad commit messages, code without PRD
  → Warns: code without tests, workflow shortcuts
```

**What's deterministic (cannot be bypassed):**

| Hook | What it catches | Why it matters |
|------|----------------|----------------|
| `block-dangerous-commands.sh` | `rm -rf`, force push, `DROP TABLE` | Prevents irreversible data loss |
| `enforce-commit-msg.sh` | Non-conventional commit messages | Keeps git history readable |
| `protect-files.sh` | Direct edits to `.env`, lock files, `node_modules` | Protects secrets and generated files |
| `enforce-workflow.sh` | New app/component files without a PRD | Prevents building without a plan |
| `stop-gate.sh` | Code written but tests not run | Reminds you to verify your work |

---

## 3-Tier Model Strategy

| Tier | Model | Used For |
|------|-------|----------|
| **Architect** | Opus | PRD, architecture, planning — the deep thinker |
| **Builder** | Sonnet | Code writing, reviews — fast and precise |
| **Scout** | Haiku | Research — cheap and quick for doc lookups |

---

## StatusLine

The bar at the bottom of your terminal shows real-time session data:

```
⚔️ APEX ┃ opus MAX ┃ 🟢 ████▓▒░░░░ 42% 420K/1.0M ┃ ↑200K ↓50K ┃ 🤖 3 agents 12.5K ┃ +150/-20 (+130 net) ┃ 15m ┃ This is the way.
```

| Segment | What it means |
|---------|--------------|
| `opus MAX` | Which AI model is active + your plan tier |
| `🟢 ████▓▒░░░░ 42%` | How full the context window is (green = plenty of room) |
| `420K/1.0M` | Tokens used / total available |
| `🤖 3 agents` | How many sub-agents were spawned this session |
| `+150/-20` | Lines of code added / removed |

When context hits 80%, you'll see `⚠️ CTX` — that means type `/compact` to free up space.

---

## Testing

APEX tests itself with two test suites:

```bash
./tests/test-hooks.sh      # 105 tests — validates every hook script
./tests/test-framework.sh  # 278 tests — validates the entire framework structure
```

---

## Learning to Code with APEX

APEX is designed to teach you engineering while you build. Here's how to get the most out of it:

### Week 1: Get Comfortable

- Let Claude do the coding while you learn the terminal (`cd`, `ls`, `git status`)
- Say `/teach` whenever you don't understand something
- Watch what Claude does — it explains every command before running it

### Week 2: Understand Git

- Learn branches (`git checkout -b feat/my-feature`), commits, and push/pull
- Review the diffs Claude shows you — start noticing patterns
- Run `/qa` yourself to see what quality checks look like

### Week 3: Start Contributing

- Edit small things yourself (copy text, fix typos, adjust styling)
- Run `npm run dev` to see your changes in real-time
- Read error messages with Claude's help (`/debug`)

### Month 2: Review and Debug

- Review PRs on GitHub — look at the diff, understand what changed
- Debug issues using `/debug` — follow the root cause, not band-aids
- Run `/security` on your auth code — understand why each check matters

### Month 3+: Independence

- Write features with less hand-holding
- Set up CI/CD pipelines (`/cicd`)
- Run `/evolve` to improve the framework itself

---

## Step-by-Step Guide

### Starting a New Feature

```bash
# 1. Create a feature branch (isolates your work from main)
git checkout -b feat/my-feature

# 2. Start Claude Code
claude

# 3. Define what you're building
/prd

# 4. Plan the architecture
/architecture

# 5. Build it (Claude writes code, APEX enforces quality)

# 6. Quality check before shipping
/qa

# 7. Commit with a clean message
/commit
```

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

### v5.8.0 (2026-03-18) — Gold Standard

**New:**
- Health-check script (`health-check.sh`) — validates all components with educational explanations
- `/teach` skill expanded to 8-level learning progression (terminal → git → debugging → architecture)
- README rewritten with educational install instructions — explains What/Why for every step
- Install guide rewritten for v5.8 one-command flow

**Fixed:**
- Self-learning loop: `session-learner.sh` now extracts `session_id` from JSON payload (env var didn't exist)
- Self-learning loop: `extract-session.sh` now correctly resolves `~/.claude/projects/` session paths
- `protect-files.sh` no longer blocks `vite.config.ts`, `tsconfig.json`, `.d.ts` (false positives)
- `auto-update.sh` no longer overwrites customized `settings.json`
- Framework test suite: fixed `set -e` abort on block-dangerous-commands test
- `install.sh` now checks prerequisites (git, jq, claude) with helpful error messages
- About skill stats updated to match reality (25 skills, 26 scripts, 4 agents, 383 tests)
- README counts fact-checked and corrected

**Performance:**
- StatusLine consolidated from 10+ jq calls to 1 (process overhead reduced ~90%)

**Testing:**
- Hook test suite: 99 → 105 tests (added session-learner and extract-session coverage)
- Framework test suite: 278 tests (fixed exit code bug)
- Total: 387 tests across 2 suites

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
