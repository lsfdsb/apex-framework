---
name: init
description: Initialize the APEX Framework in the current project. Sets up project-level skills, hooks, scripts, docs structure, and CLAUDE.md. Use when starting a new project or when the user says "init", "initialize", "setup APEX", "start project", "new project", or "scaffold".
allowed-tools: Read, Write, Bash, Glob
---

# Initialize APEX in This Project

## What This Does

Sets up the project-level APEX files that aren't covered by user-level installation. After running this, the project has the full APEX workflow.

## Process

### Step 1: Check What Exists

- Does `.claude/` exist? Don't overwrite existing config.
- Does `CLAUDE.md` exist? Merge, don't replace.
- Does `package.json` exist? Detect existing stack and adapt.
- Does `.git/` exist? If not, initialize git.

### Step 2: Detect Existing Stack

Read `package.json`, `requirements.txt`, `Cargo.toml`, etc. to detect:

- Framework (Next.js, Remix, Django, Rails, etc.)
- Language (TypeScript, Python, Rust, etc.)
- Database (Supabase, Prisma, Drizzle, etc.)
- Testing (Vitest, Jest, Pytest, etc.)

Adapt CLAUDE.md and settings to match the detected stack. **Never force our defaults on an existing project.**

### Step 3: Create Project Structure

```bash
# Project-level skills (not in user-level)
mkdir -p .claude/skills/{prd,architecture,research,qa-gate,security-audit,performance,deploy}
mkdir -p .claude/scripts
mkdir -p docs/{prd,architecture,research,reviews}

# Copy project-level skill files
# (Content comes from the APEX framework source)
```

### Step 4: Create Project CLAUDE.md

Generate a CLAUDE.md tailored to THIS project:

```markdown
# [Project Name]

> Part of the APEX Framework

## Stack

- [Detected or chosen stack]

## Build Commands

- `[detected dev command]`
- `[detected build command]`
- `[detected test command]`
- `[detected lint command]`

## Project-Specific Rules

- [Any detected conventions from existing code]
```

### Step 5: Supabase Setup (if applicable)

If the project uses Supabase (detected in package.json or user confirms):

1. **Create client files** — Run `/supabase setup` to scaffold:
   - `src/lib/supabase/client.ts` (browser client)
   - `src/lib/supabase/server.ts` (server client, for Next.js)
   - `src/lib/supabase/middleware.ts` (session refresh, for Next.js)
   - `middleware.ts` (root middleware, for Next.js)
   - For Vite projects: `src/lib/supabase.ts` (single client)

2. **Create `.env.local.example`** with Supabase vars:
   ```bash
   # Supabase — get from https://supabase.com/dashboard/project/_/settings/api
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Add db scripts** to `package.json`:
   ```json
   {
     "db:types": "supabase gen types typescript --linked > src/types/supabase.ts",
     "db:push": "supabase db push",
     "db:diff": "supabase db diff --linked",
     "db:migration": "supabase migration new"
   }
   ```

4. **Offer to link** — Ask the user if they want to run `npx supabase link` now.

5. **Ensure `.env.local` is in `.gitignore`**.

### Step 6: Install Git Hooks (outside Claude Code enforcement)

Install APEX git hooks for quality enforcement even outside Claude Code:

```bash
# Copy pre-commit and commit-msg hooks
cp .claude/git-hooks/pre-commit .git/hooks/pre-commit
cp .claude/git-hooks/commit-msg .git/hooks/commit-msg
chmod +x .git/hooks/pre-commit .git/hooks/commit-msg
```

These hooks run on EVERY commit — even manual ones from terminal — checking for console.log, hardcoded secrets, TypeScript errors, lint issues, and conventional commit format.

### Step 7: Create Hook Scripts

Copy and make executable:

```bash
chmod +x .claude/scripts/*.sh
```

### Step 8: Create .gitignore additions

Ensure `.claude/settings.local.json` is gitignored.

### Step 9: First Commit

```bash
git add .claude/ CLAUDE.md docs/ .gitignore
git commit -m "chore: initialize APEX Framework"
```

### Step 10: Welcome Message

Tell the user what was set up and what's available:

```
🚀 APEX Framework initialized!

Your project now has:
  📋 /prd — Generate PRDs before building
  🔍 /research — Research before integrating
  🗄️ /supabase — Database setup, auth, migrations, types
  ✅ /qa — Quality gate before shipping
  🔒 /security — Security audit on sensitive code
  🎯 /cx-review — Customer experience review
  🚀 /deploy — Pre-deployment checklist
  📝 /commit — Clean conventional commits
  🔄 /changelog — Auto-maintain docs

Start with: /prd [your first feature]

💡 Tip: Your APEX skills at ~/.claude/ (design-system, code-standards, etc.) are already active globally!
```
