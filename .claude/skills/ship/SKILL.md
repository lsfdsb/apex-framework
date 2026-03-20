---
name: ship
description: Fast-track branch → commit → push → PR → merge workflow. Use when the user says "ship", "push and merge", "push pr merge", "ship it", or when changes are ready to go. Spawns Technical Writer automatically. Requires explicit user approval for merge.
argument-hint: "[commit message or description of changes]"
allowed-tools: Read, Grep, Glob, Bash, Agent, TaskCreate, TaskUpdate, TaskList, SendMessage
---

# Ship — Fast-Track Delivery

> "Real artists ship." — Steve Jobs

## What This Skill Does

Automates the repetitive `branch → commit → push → PR → merge` cycle while enforcing APEX quality gates. No shortcuts — just speed.

## Current Context

Branch: !`git branch --show-current 2>/dev/null`
Status: !`git status --short 2>/dev/null | head -10`
Recent: !`git log --oneline -3 2>/dev/null`

## Workflow

### Step 1: Pre-flight Check

Before shipping, verify:
```bash
git status --short
git diff --stat
```

- If on `main` → create a feature branch first (`feat/`, `fix/`, `docs/`)
- If no changes → nothing to ship
- If uncommitted changes → stage and commit first

### Step 2: Branch (if needed)

If on `main`, create a branch based on the change type:
- `feat/description` for new features
- `fix/description` for bug fixes
- `docs/description` for documentation
- `refactor/description` for refactoring

### Step 3: Commit

Stage changed files (specific files, never `git add -A` blindly) and commit with conventional format:
```
type(scope): description (≤72 chars)

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
```

### Step 4: Push + PR

```bash
git push -u origin <branch>
gh pr create --title "<commit subject>" --body "<summary + test plan>"
```

### Step 5: Auto-Review (Code Reviewer + Technical Writer)

**MANDATORY** — After PR is created, spawn both in parallel:

```
# Code Reviewer (Opus) — security gate, quality analysis
Agent({
  subagent_type: "code-reviewer",
  run_in_background: true,
  prompt: "Review PR #[NUMBER]: [TITLE]. Run full code review:
    1. Read every changed file (git diff main..HEAD)
    2. Check security (auth, injection, secrets, OWASP)
    3. Check performance (N+1, bundle impact, unnecessary renders)
    4. Check code quality (naming, complexity, DRY)
    5. Report: APPROVED or BLOCKED with specific issues."
})

# Technical Writer — update docs
Agent({
  subagent_type: "technical-writer",
  run_in_background: true,
  prompt: "Update CHANGELOG and README for PR #[NUMBER]: [TITLE]. Run gap detection first."
})
```

**Show the PR URL to the user while reviews run.** Don't ask to merge yet — wait for the Code Reviewer's verdict.

### Step 6: Review Gate

Wait for the Code Reviewer to report:
- **APPROVED** → proceed to merge
- **BLOCKED** → show the issues, fix them, push again, re-review

This is the quality gate. The Code Reviewer uses Opus — the best model — specifically for this moment. It catches what QA misses: subtle security issues, architectural concerns, performance traps.

### Step 7: Merge (only with user approval)

**NEVER merge without explicit user approval.** Show the PR URL and Code Reviewer verdict first.

If user says "merge", "merge it", "ship it":
```bash
gh pr merge <number> --squash --delete-branch
```

Then commit and push any Technical Writer changes as a follow-up.

## Rules

1. **Never push to main directly** — always branch first
2. **Never merge without approval** — show PR URL, ask user
3. **Technical Writer runs on every ship** — nothing ships undocumented
4. **Conventional commits** — `type(scope): description`
5. **72-char subject lines** — enforced by commit-msg hook
6. **Squash merge** — clean history, delete branch
