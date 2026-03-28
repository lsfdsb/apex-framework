---
name: commit
description: Creates a clean, conventional commit with pre-commit checks. This skill should be used when the user says "commit", "save my work", "checkpoint", or wants to commit changes. Runs lint, type check, and tests before committing. Claude should never auto-commit — the user decides when to save.
argument-hint: '[commit message or leave blank for auto-generate]'
disable-model-invocation: true
allowed-tools: Read, Bash, Grep, Glob, Agent
---

# Commit — Ship Clean Code

## Step 0: Branch Check (before anything else)

Current branch: !`git rev-parse --abbrev-ref HEAD 2>/dev/null`

**If you are on `main` or `master`: STOP.** Do not stage or commit anything.
Tell the user: "You're on main. Let me create a branch for this work first."
Create the branch: `git checkout -b feat/[description-of-work]`
Then proceed with the commit flow from that branch.

## Current Context

Staged files: !`git diff --cached --stat 2>/dev/null || echo "Nothing staged"`
Unstaged changes: !`git status --short 2>/dev/null | head -15`
Recent commits: !`git log --oneline -5 2>/dev/null`

## Pre-Commit Checklist (run all before committing)

Detect the project's actual tools — never assume a specific package manager or linter:

```bash
# 1. Detect package manager (check lock files)
#    pnpm-lock.yaml → pnpm
#    yarn.lock      → yarn
#    bun.lockb      → bun
#    default        → npm
PKG=$(if [ -f pnpm-lock.yaml ]; then echo pnpm; elif [ -f yarn.lock ]; then echo yarn; elif [ -f bun.lockb ]; then echo bun; else echo npm; fi)

# 2. Type check (if tsconfig exists)
$PKG exec tsc --noEmit 2>/dev/null || true

# 3. Lint (detect what's available)
#    biome.json / biome.jsonc → biome
#    oxlint config or node_modules/.bin/oxlint → oxlint
#    .eslintrc* / eslint.config.* → eslint
if [ -f biome.json ] || [ -f biome.jsonc ]; then
  $PKG exec biome check .
elif [ -f node_modules/.bin/oxlint ]; then
  $PKG exec oxlint .
elif ls .eslintrc* eslint.config.* 2>/dev/null | head -1 > /dev/null; then
  $PKG exec eslint .
fi

# 4. Format check (detect what's available)
if [ -f biome.json ] || [ -f biome.jsonc ]; then
  $PKG exec biome format --check .
elif [ -f node_modules/.bin/prettier ]; then
  $PKG exec prettier --check .
fi

# 5. Tests (at minimum, related tests)
$PKG test 2>/dev/null || $PKG run test 2>/dev/null || true
```

If ANY check fails → **STOP**. Fix the issue first. Show the user the error and explain it.

## Commit Process

### Step 1: Stage changes

Run `git status` and `git diff --staged` to see what's being committed.
If nothing is staged, run `git add .` (or ask user what to stage).

### Step 2: Generate commit message

**Format**: `type(scope): description`

**Types**: feat, fix, docs, refactor, test, perf, security, chore
**Scope**: the module or area changed (auth, cart, api, ui)
**Description**: imperative mood, ≤72 chars, no period

```
feat(auth): add OAuth login with Google provider
fix(cart): prevent negative quantities in cart items
refactor(api): extract pagination into shared utility
```

### Step 3: Update CHANGELOG (BEFORE committing — not after)

**This is the critical step.** The #1 recurring failure in APEX's history is commits shipping without CHANGELOG updates. The fix: do it INLINE, right here, before the commit happens. No separate agent, no "I'll do it later."

1. Read `CHANGELOG.md`
2. Determine the correct category based on commit type:
   - `feat:` → `### Added`
   - `fix:` → `### Fixed`
   - `refactor:`, `perf:`, `security:`, `chore:` → `### Changed`
   - `docs:` → Skip (pure docs commits don't need a CHANGELOG entry about themselves)
3. Add a one-line entry under `## [Unreleased]` in the right category:
   ```
   - **Bold Feature Name** — description (#PR or commit ref)
   ```
4. Stage the CHANGELOG: `git add CHANGELOG.md`

**If CHANGELOG.md doesn't exist**, create it with the Keep a Changelog header.
**If this is a docs-only change** (commit type `docs:`), skip the CHANGELOG update.

### Step 4: Commit

Show the proposed commit message to the user for approval, then commit.

### Step 5: Post-commit

- Show: `git log --oneline -3`
- Remind about pushing: "Your changes are saved locally. Run `git push` when ready."
- For multi-file changes or PRs, spawn Technical Writer for README updates:
  ```
  Agent({ subagent_type: "technical-writer", run_in_background: true,
    prompt: "Verify README.md is current with latest changes." })
  ```

## Multi-File Commits

If changes span multiple concerns, suggest splitting into multiple commits. Each commit gets its own CHANGELOG entry.

📚 _Teaching_: CHANGELOG updates happen BEFORE the commit, not after. This eliminates the "forgot to update docs" failure that has plagued 3+ APEX versions. The entry is staged alongside the code, committed together, and can never be forgotten.
