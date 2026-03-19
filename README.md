# ⚔️ APEX Framework v5.11

```
  ╔══════════════════════════════════════════════╗
  ║          ⚔️  APEX Framework v5.11            ║
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

### Split Panes (iTerm2)

For agent teams with visual split panes:

```bash
brew install tmux    # one-time
apex                 # opens Claude Code with auto split panes
```

Or specify a project: `apex ~/Projects/myapp`

Requires iTerm2 with **Settings → General → Magic → Enable Python API** enabled. Falls back to regular `claude` if tmux or iTerm2 aren't available.

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

APEX (Agent-Powered EXcellence) is a configuration framework for Claude Code. It's not a library or npm package — it's **29 skills, 29 scripts, 10 agents, 7 rules, and 1 output style** that enforce a disciplined development workflow with a self-learning, self-testing feedback loop.

**Built for leaders and PMs who want to learn engineering while building.** Every action explains What, Why, and How. Over weeks of use, you'll go from "what is a branch?" to reviewing PRs and debugging issues independently.

### The Workflow

```
📜 /prd          → Define what you're building (APEX blocks code without one)
🗺️ /architecture  → Plan the system design
🔍 /research     → Verify APIs exist before using them
🤖 /teams        → Auto-spawn agent team (Watcher, Builder, QA, Debugger)
⚒️  Build         → Write code (agents work in parallel, APEX enforces standards)
✅ /qa           → 6-phase quality gate (or QA agent runs automatically)
🛡️ /security     → OWASP checklist on sensitive code
♿ /a11y         → Accessibility audit (WCAG 2.2 AA)
🎯 /cx-review    → Customer experience review
📝 /commit       → Clean conventional commit
🦇 /batman       → Summon the Sentinel — full framework self-test
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
| **Scripts** | 23 | Hook scripts + utilities — the automation layer (auto-format, dangerous command blocking, etc.) |
| **Agents** | 10 | Championship roster: watcher, builder, debugger, qa, code-reviewer, design-reviewer, technical-writer, researcher, sentinel (Batman), framework-evolver |
| **Rules** | 7 | Path-based rules that auto-load when you edit certain file types (React, SQL, API, etc.) |
| **Output Style** | 1 | Educational — explains What/Why/How for every action |
| **Git Hooks** | 2 | pre-commit (type check + lint + format) and commit-msg (conventional format) |
| **StatusLine** | 1 | Real-time dashboard: model, context %, tokens, agents, lines changed |
| **Sandbox** | 1 | OS-level protection: blocks writes to /etc, ~/.ssh, ~/.aws |
| **Tests** | 3 suites | framework (288 tests), hooks (115 tests), agents (137 tests) |

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
⚔️ APEX ┃ opus MAX ┃ 🟢 ████░░░░░░ 42% 420.0K/1.0M ┃ +150/-20 (+130) ┃ 15m
```

| Segment | What it means |
|---------|--------------|
| `opus MAX` | Which AI model is active + your plan tier (MAX shown only after first API call) |
| `🟢 ████░░░░░░ 42%` | How full the context window is (🟢 green / 🟡 yellow >60% / 🔴 red >80%) |
| `420.0K/1.0M` | Tokens used / total available |
| `+150/-20 (+130)` | Lines of code added / removed (hidden until first change) |
| `15m` | Session duration |

When context hits 80%, you'll see `⚠️ CTX` — that means type `/compact` to free up space. At cold start (before first API call), context shows `🟢 ready` instead of zeros.

---

## Testing

APEX tests itself with three test suites:

```bash
./tests/test-framework.sh  # 288 tests — validates the entire framework structure
./tests/test-hooks.sh      # 115 tests — validates every hook script
./tests/test-agents.sh     # 137 tests — validates agents, skills, tools, isolation, and model fitness
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

APEX has 10 specialized agents — a championship roster. Use `/teams` for parallel work, `/batman` to verify everything:

| Agent | Model | Role |
|-------|-------|------|
| **watcher** | Haiku | Continuous monitoring — catches errors, security, drift |
| **builder** | Sonnet | Implements features in isolated worktrees |
| **debugger** | Sonnet | Root-cause bug fixes — no band-aids |
| **qa** | Sonnet | 6-phase quality gate — blocks bad code |
| **code-reviewer** | Sonnet | Deep code review with severity ratings |
| **design-reviewer** | Sonnet | UI/UX review against design system |
| **technical-writer** | Haiku | Keeps CHANGELOG, README, docs in sync |
| **researcher** | Haiku | Verifies APIs, libraries, best practices |
| **sentinel** | Sonnet | The Dark Knight — `/batman` for full self-test |
| **framework-evolver** | Sonnet | Analyzes sessions for improvements (`/evolve`) |

Use `/teams` and Claude auto-selects the right roster. Use `/batman` when you need proof everything works.

### The Observatory

Visual framework health dashboard at localhost:3000:

```bash
node dashboard/server.js
```

Shows agents, skills, hooks, workflow chain, live test runner, cross-reference matrix, and agent activity — all in a Gotham-themed dark UI. Zero dependencies.

### Design DNA

Premium UI pattern library with 14 pages, 5 palettes, dark/light mode, and 22 background options:

```bash
node -e "require('http').createServer((q,s)=>{let f=q.url.split('?')[0];if(f==='/')f='/index.html';if(!require('path').extname(f))f+='.html';const p=require('path').join(__dirname,'docs/design-dna',f);if(!require('fs').existsSync(p)){s.writeHead(404);s.end();return}s.writeHead(200,{'Content-Type':require('path').extname(p)==='.js'?'text/javascript':'text/html'});require('fs').createReadStream(p).pipe(s)}).listen(3001)"
```

Open `http://localhost:3001` — 14 pattern pages for Landing, CRM (15 patterns), E-Commerce, SaaS, Blog, Portfolio, Social, LMS, Presentation, E-Book, Email Templates, Backoffice, plus Design System tokens and SVG Patterns library (14 static + 8 animated). Unified design widget on every page — palette, dark/light mode, backgrounds from one icon.

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
⚔️ APEX ┃ opus MAX ┃ 🟢 ████░░░░░░ 42% 420.0K/1.0M ┃ +150/-20 (+130) ┃ 15m
```

| Segment | Meaning |
|---------|---------|
| `opus MAX` | Current model + plan |
| `🟢 ████░░░░░░ 42%` | Context window health (green/yellow/red) |
| `420.0K/1.0M` | Tokens used / total window |
| `+150/-20 (+130)` | Lines added / removed (net change) |
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

### v5.11.0 (2026-03-18) — Agent Teams: The Championship Roster

- **10 championship-grade agents** — Watcher, Builder, Debugger, QA, Code Reviewer, Design Reviewer, Technical Writer, Researcher, Sentinel (Batman), Framework Evolver
- **`/teams` skill** — orchestrated parallelism with 4 presets: build, fix, review, full
- **`/batman` (`/self-test`)** — summons the Sentinel for complete framework verification
- **Breathing Loop** — autonomous Watcher→Debugger→QA→Builder cycle
- **559 tests** across 3 suites (structural, hooks, integration)
- **100% Claude Code docs compliant** — verified against official specs

See [CHANGELOG.md](CHANGELOG.md) for full version history.

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
