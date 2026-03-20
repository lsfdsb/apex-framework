---
name: init
description: Initialize the APEX Framework in the current project. Sets up project-level skills, hooks, scripts, docs structure, and CLAUDE.md. Use when starting a new project or when the user says "init", "initialize", "setup APEX", "start project", "new project", or "scaffold".
disable-model-invocation: true
allowed-tools: Read, Write, Bash, Glob, Edit, Grep
---

# Initialize APEX in This Project

## Step 0: Check If Already Installed

First, check if APEX is already installed:

```bash
ls .claude/skills/ 2>/dev/null | head -5
```

**If `.claude/skills/` exists and has files:**
Tell the user: "APEX is already installed in this project! You have [count] skills ready. Just start building — your safety net is active."
Then STOP — do not reinstall.

## Step 1: Find the APEX Framework Source

Look for `apex-init-project.sh` in these locations (in order):

```bash
# Check each location
for dir in "${APEX_FRAMEWORK_REPO:-}" "$HOME/.apex-framework" "$HOME/apex-framework" "$HOME/projects/apex-framework"; do
  [ -f "$dir/apex-init-project.sh" ] && echo "Found: $dir" && break
done
```

**If found:** Confirm with the user before running:

```
📚 I found the APEX Framework at [path]. Here's what /init will install:

  📋 Skills — slash commands like /prd, /qa, /security, /commit
     These are knowledge modules that guide each phase of building.

  🔧 Hooks — automated safety gates that run on every action
     They block dangerous commands, enforce PRDs, validate commits,
     and auto-format your code. You can't accidentally break things.

  🤖 Agents — 9 autonomous agents (watcher, builder, debugger, qa, code-reviewer, design-reviewer, technical-writer, researcher)
     Claude spawns these automatically as championship teams when needed.

  📏 Rules — auto-load when you edit certain file types (React, SQL, etc.)

  🎨 Output Style — educational mode (explains What/Why/How)

  🪝 Git Hooks — pre-commit (type check + lint) and commit-msg (format)

Shall I install it? (This copies files into .claude/ — safe and reversible)
```

**If NOT found:** Show the user exactly what to do:

```
⚔️ APEX Framework not found on this machine.

📚 WHAT IS APEX?
APEX is a configuration framework for Claude Code. It adds 26 skills,
safety hooks, and an educational workflow so you can build world-class
apps while learning engineering.

To install:

  Step 1 — Clone the framework (once, ever):
  git clone https://github.com/lsfdsb/apex-framework.git ~/.apex-framework

  Step 2 — Run the installer (from your project directory):
  ~/.apex-framework/install.sh

Then come back and start building!
```

## Step 2: Run the Init Script

Once the user confirms, run the installer:

```bash
bash [path-to-apex]/apex-init-project.sh
```

**Show the output to the user** — it explains what's being installed. Wait for it to complete.

## Step 3: Detect Existing Stack

After install, read the project's config files to detect the stack:
- `package.json` → framework, dependencies, scripts
- `tsconfig.json` → TypeScript config
- Lock files → package manager (pnpm-lock.yaml, yarn.lock, bun.lockb)
- `src/` structure, `app/` directory

Detect: framework, language, database, testing, package manager, build commands.

## Step 4: Customize CLAUDE.md for This Project

The init script copies the generic APEX CLAUDE.md. Now **edit it** to add project-specific info:

```markdown
## Stack

- [Detected framework + version]
- [Detected language]
- [Detected database, if any]
- [Detected testing framework]

## Build Commands

- `[package-manager] dev` — development server
- `[package-manager] build` — production build
- `[package-manager] test` — run tests
- `[package-manager] lint` — lint check
```

**IMPORTANT:** Merge with existing CLAUDE.md if one already existed. Never lose project-specific information.

## Step 5: First Commit

```bash
git add .claude/ CLAUDE.md docs/ .gitignore
git commit -m "chore: initialize APEX Framework v[version]"
```

## Step 6: Welcome Message

Show the user what they now have:

```
⚔️ APEX Framework v[version] installed!

Your project now has:

  📋 /prd         — Define what you're building before writing code
  🏗️ /architecture — Plan the system design
  🔍 /research    — Verify APIs and docs before integrating
  ✅ /qa          — 6-phase quality gate before shipping
  🔒 /security    — OWASP audit on sensitive code
  📝 /commit      — Clean conventional commits
  🐛 /debug       — Structured debugging (root cause, not band-aids)
  📚 /teach       — Ask me to explain anything

Your safety net is active:
  🛡️ Dangerous commands are blocked (rm -rf, force push)
  📄 Code without a PRD is blocked (new app/component files)
  ✅ Commits are validated (conventional format required)
  🔐 Secrets in code are blocked (API keys, tokens)
  📐 Code is auto-formatted after every edit

Stack detected: [framework] + [language] + [database]
Package manager: [detected pm]

📚 WHAT'S NEXT?
Tell me what you want to build! I'll guide you through:
  /prd → /architecture → build → /qa → /commit

What are we building? ⚔️
```
