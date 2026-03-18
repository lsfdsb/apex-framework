---
name: init
description: Initialize the APEX Framework in the current project. Sets up project-level skills, hooks, scripts, docs structure, and CLAUDE.md. Use when starting a new project or when the user says "init", "initialize", "setup APEX", "start project", "new project", or "scaffold".
disable-model-invocation: true
allowed-tools: Read, Write, Bash, Glob, Edit, Grep
---

# Initialize APEX in This Project

## What This Does

Installs the full APEX Framework into the current project by running the official init script. This copies skills, hooks, scripts, rules, settings, git hooks, and CLAUDE.md from the APEX source. Then it customizes CLAUDE.md for the project's specific stack.

## CRITICAL: Use the Init Script

The APEX framework ships with `apex-init-project.sh` which handles ALL file copying. **You MUST run this script** — do NOT manually recreate files.

### Step 1: Find the APEX Framework Source

Look for the APEX framework in these locations (in order):
1. `~/apex-framework/` (git clone / development)
2. `~/.apex-framework/` (installed via auto-update)

Verify by checking for the `VERSION` file and `apex-init-project.sh` in that directory.

If neither exists, tell the user:
```
APEX Framework source not found. Please clone it first:
  git clone https://github.com/lsfdsb/apex-framework.git ~/apex-framework
```

### Step 2: Run the Init Script

```bash
# Run from the PROJECT directory (current working directory)
bash ~/apex-framework/apex-init-project.sh
# OR if installed via auto-update:
bash ~/.apex-framework/apex-init-project.sh
```

This script will:
- Copy 12+ project skills (prd, architecture, research, qa, security, etc.)
- Copy hook scripts and make them executable
- Copy path-based rules
- Copy output styles
- Copy settings.json (hooks, permissions, sandbox, statusLine)
- Install git hooks (pre-commit, commit-msg)
- Copy CLAUDE.md (or preserve existing one)
- Update .gitignore with APEX entries
- Create docs directories (docs/prd, docs/architecture, docs/research, docs/reviews)

**Wait for the script to finish and show its output to the user.**

### Step 3: Detect Existing Stack

After the script runs, read the project's config files to detect the stack:
- `package.json` → framework, dependencies, scripts
- `requirements.txt` / `pyproject.toml` → Python stack
- `Cargo.toml` → Rust stack
- `go.mod` → Go stack
- `tsconfig.json` → TypeScript config
- Existing `src/` structure

Detect:
- Framework (Next.js, Remix, Vite, Django, Rails, etc.)
- Language (TypeScript, Python, Rust, Go, etc.)
- Database (Supabase, Prisma, Drizzle, etc.)
- Testing (Vitest, Jest, Pytest, etc.)
- Package manager (npm, pnpm, yarn, bun)
- Dev/build/test/lint commands from package.json scripts

### Step 4: Customize CLAUDE.md for This Project

The init script copies the generic APEX CLAUDE.md. Now **edit it** to add project-specific information. Use the Edit tool to prepend or append project-specific sections:

```markdown
# [Project Name]

> Powered by APEX Framework v[version from VERSION file]

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

## Project-Specific Rules

- Use `[detected package manager]` (not npm) for all commands
- [Any detected conventions from existing code]
- [Path aliases from tsconfig, if any]
```

**IMPORTANT:** Merge with existing CLAUDE.md content if one already existed. Never lose project-specific information.

### Step 5: Supabase Setup (if applicable)

If Supabase is detected in package.json dependencies, ask the user if they want to set it up:

1. **Create client files** — Run `/supabase setup`
2. **Create `.env.local.example`** with Supabase vars
3. **Add db scripts** to `package.json`
4. **Offer to link** — Ask if they want to run `npx supabase link`
5. **Ensure `.env.local` is in `.gitignore`**

### Step 6: First Commit

```bash
git add .claude/ CLAUDE.md docs/ .gitignore
git commit -m "chore: initialize APEX Framework v[version]"
```

### Step 7: Welcome Message

Show the APEX version and what was installed:

```
⚔️ APEX Framework v[version] initialized!

Your project now has:
  📋 /prd — Generate PRDs before building
  🏗️ /architecture — Design before coding
  🔍 /research — Research before integrating
  ✅ /qa — Quality gate before shipping
  🔒 /security — Security audit on sensitive code
  🎯 /cx-review — Customer experience review
  🚀 /qa deploy — Deployment readiness check
  📝 /commit — Clean conventional commits
  🔄 /changelog — Auto-maintain docs
  🐛 /debug — Structured debugging
  🧪 /e2e — Playwright E2E tests

Stack detected: [framework] + [language] + [database]
Package manager: [detected pm]

Start with: /prd [your first feature]

This is the way. ⚔️
```
