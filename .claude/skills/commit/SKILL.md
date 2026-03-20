---
name: commit
description: Creates a clean, conventional commit with pre-commit checks. This skill should be used when the user says "commit", "save my work", "checkpoint", or wants to commit changes. Runs lint, type check, and tests before committing. Claude should never auto-commit — the user decides when to save.
argument-hint: "[commit message or leave blank for auto-generate]"
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

1. Run `git status` and `git diff --staged` to see what's being committed
2. If nothing is staged, run `git add .` (or ask user what to stage)
3. Generate a conventional commit message:

**Format**: `type(scope): description`

**Types**: feat, fix, docs, refactor, test, perf, security, chore
**Scope**: the module or area changed (auth, cart, api, ui)
**Description**: imperative mood, ≤72 chars, no period

**Examples**:

```
feat(auth): add OAuth login with Google provider
fix(cart): prevent negative quantities in cart items
refactor(api): extract pagination into shared utility
test(user): add integration tests for registration flow
perf(images): implement lazy loading for product gallery
security(auth): add rate limiting to login endpoint
```

4. Show the proposed commit message to the user for approval
5. After committing, invoke the changelog skill to update docs

## Multi-File Commits

If changes span multiple concerns, suggest splitting into multiple commits:

```
git add src/auth/
git commit -m "feat(auth): add OAuth login flow"

git add src/components/
git commit -m "feat(ui): add login page component"
```

📚 _Teaching_: Each commit should be one logical change. If you can't describe it in one line, it's probably doing too much.

## After Commit — Docs Gate (MANDATORY)

**Nothing ships undocumented.** After committing, you MUST update docs. This is deterministic, not optional.

### Option A: Spawn Technical Writer (recommended for multi-file changes)
```
Agent({
  subagent_type: "technical-writer",
  run_in_background: true,
  prompt: "Update CHANGELOG.md and README.md for this session.
    Recent commit: [PASTE git log --oneline -1 OUTPUT HERE]
    Changes: [DESCRIBE WHAT CHANGED IN 1-2 SENTENCES]
    Run gap detection first — verify CHANGELOG covers this commit."
})
```

### Option B: Update CHANGELOG inline (for small changes)
Run the changelog skill: add an entry under `## [Unreleased]` in the correct category (Added/Changed/Fixed).

### Always do:
- Show the user: `git log --oneline -3` (last 3 commits for context)
- Remind about pushing: "Your changes are saved locally. Run `git push` when ready to share."

📚 _Teaching_: The Technical Writer exists so you never ship without docs. If you commit code and forget to update CHANGELOG, the next person who reads the repo won't know what changed. Documentation is a love letter to your future self.
