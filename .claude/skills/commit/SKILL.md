---
name: commit
description: Creates a clean, conventional commit with pre-commit checks. This skill should be used when the user says "commit", "save my work", "checkpoint", or wants to commit changes. Runs lint, type check, and tests before committing. Claude should never auto-commit — the user decides when to save.
disable-model-invocation: true
allowed-tools: Read, Bash, Grep, Glob
---

# Commit — Ship Clean Code

## Pre-Commit Checklist (run all before committing)

```bash
# 1. Type check
pnpm exec tsc --noEmit

# 2. Lint
pnpm exec oxlint . --deny-warnings

# 3. Format check
pnpm exec prettier --check .

# 4. Tests (at minimum, related tests)
pnpm test
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

## After Commit

- Update CHANGELOG.md (invoke changelog skill)
- Show the user: `git log --oneline -3` (last 3 commits for context)
- Remind about pushing: "Your changes are saved locally. Run `git push` when ready to share."
