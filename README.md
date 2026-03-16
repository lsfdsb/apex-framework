# ⚔️ APEX Framework v5.5

```
  ╔══════════════════════════════════════════════╗
  ║          ⚔️  APEX Framework v5.5             ║
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

APEX (Agent-Powered EXcellence) is a configuration framework for Claude Code. It's not a library or npm package — it's **26 skills, 16 hooks, 3 agents, 5 rules, and 2 output styles** that enforce a disciplined development workflow.

### The Workflow

```
📜 PRD        → Define before building (deterministic hook blocks code without PRD)
🗺️ Architecture → Plan the system
🔍 Research   → Verify docs, never hallucinate APIs
⚒️ Build      → Execute with precision
✅ QA         → 5-phase quality gate
🛡️ Security   → OWASP checklist + dependency audit
🎯 CX Review  → Customer experience review
🚀 Deploy     → Pre-deployment checklist
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
| Skills | 17 | code-standards, design-system, security, a11y, verify-lib, teach, debug, supabase, and more |
| Agents | 3 | code-reviewer (Sonnet), design-reviewer (Sonnet), researcher (Haiku) |
| Hook Scripts | 16 | Dangerous command blocking, commit msg validation, PRD enforcement, test gate, auto-format, file protection, context preservation, workflow skip guard, failure diagnostics, session cleanup, subagent logging |
| Rules | 5 | Path-based: testing, components, api, sql, supabase |
| Output Styles | 2 | Educational + Mandalorian |
| StatusLine | 1 | Real-time: model, tokens, cost, context %, lines changed |
| Sandbox | 1 | Filesystem restrictions: blocks writes to /etc, ~/.ssh, ~/.aws |

### Project-Level (per project, via `apex-init-project.sh`)

| Category | Count | Details |
|----------|-------|---------|
| Skills | 12 | prd, architecture, research, qa, security, performance, deploy, commit, changelog, init, e2e, cicd |
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

## Guides

| Guide | Language |
|-------|----------|
| [Install Guide EN-US](docs/guides/install-guide-en-us.md) | English |
| [Install Guide PT-BR](docs/guides/install-guide-pt-br.md) | Português |
| [Claude.ai Skills EN-US](claude-web/install-skills-guide-en-us.md) | English |
| [Claude.ai Skills PT-BR](claude-web/install-skills-guide-pt-br.md) | Português |

---

## Changelog

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

- 25 skills, 3 agents, 10 hook scripts, 4 rules, 2 output styles
- Full workflow: PRD → Architecture → Research → Build → QA → Security → CX Review → Deploy
- 3-tier model strategy (Opus/Sonnet/Haiku)
- Bilingual support (en-us / pt-br)
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
