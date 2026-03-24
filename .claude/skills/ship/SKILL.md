---
name: ship
description: Fast-track branch → commit → push → PR → merge workflow. Use when the user says "ship", "push and merge", "push pr merge", "ship it", or when changes are ready to go. Spawns Technical Writer automatically. Requires explicit user approval for merge.
argument-hint: "[commit message or description of changes]"
allowed-tools: Read, Grep, Glob, Bash, Agent, Skill, TaskCreate, TaskUpdate, TaskList, SendMessage
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
- **Dependency verification** — if `/qa` was run and Phase 0 reported any BLOCKING dependency failures (missing packages, env vars, or internal imports), `/ship` will not proceed. Fix the dependency gaps and re-run `/qa` until Phase 0 is clean before shipping.

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

### Step 5: Docs Consistency Check + Code Review

**MANDATORY** — After PR is created, run these checks:

**5a. Docs consistency (inline — no separate agent needed):**
```bash
# VERSION matches README header?
VERSION=$(cat VERSION 2>/dev/null | tr -d '[:space:]')
grep -q "$VERSION" README.md 2>/dev/null || echo "README version mismatch"

# CHANGELOG has [Unreleased] entries for this PR?
grep -q "\[Unreleased\]" CHANGELOG.md && grep -A5 "\[Unreleased\]" CHANGELOG.md | grep -q "###" || echo "CHANGELOG empty"

# About skill reads dynamically from agents/ — no check needed

# Manifest is current?
CLAUDE_PROJECT_DIR=. bash .claude/scripts/manifest-generate.sh 2>/dev/null
```

If README version is stale, update it now. If CHANGELOG is empty, the /commit skill missed Step 3 — add entries now.

**5b. Code Review Plugin:**
```
Skill("code-review:code-review", args: "[PR NUMBER]")
```

**Show the PR URL to the user while review runs.** Don't ask to merge yet.

### Step 6: Review Gate

Wait for the plugin to complete:
- **No issues (score < 80)** → posts "No issues found" comment → proceed to merge
- **Issues found (score 80+)** → posts findings as GitHub comment → fix, push, re-review

The plugin is the single review gate. It covers CLAUDE.md compliance (which includes all APEX rules), bugs, git history, and code comments — all confidence-scored to filter false positives.

### Step 7: Merge (only with user approval)

**NEVER merge without explicit user approval.** Show the PR URL and QA verdict first.

If user says "merge", "merge it", "ship it":
```bash
gh pr merge <number> --squash --delete-branch
```

Then commit and push any Technical Writer changes as a follow-up.

### Step 8: Version Promotion (automatic after merge)

After successful merge, auto-version the release:

1. Switch to main and pull:
   ```bash
   git checkout main && git pull origin main
   ```

2. Check if `[Unreleased]` in CHANGELOG.md has entries. If empty, skip.

3. Invoke the changelog skill for version promotion:
   ```
   Skill("changelog", args: "promote")
   ```

   This will automatically:
   - Scan commits for version bump type (feat→MINOR, fix→PATCH)
   - Promote `[Unreleased]` → `[X.Y.Z] — YYYY-MM-DD — Title`
   - Update VERSION file
   - Update README.md version refs
   - Create a micro-PR (`chore/release-X.Y.Z`), auto-merge it

4. Report the new version to the user.

## Rules

1. **Never push to main directly** — always branch first
2. **Never merge without approval** — show PR URL, ask user
3. **Technical Writer runs on every ship** — nothing ships undocumented
4. **Conventional commits** — `type(scope): description`
5. **72-char subject lines** — enforced by commit-msg hook
6. **Squash merge** — clean history, delete branch
7. **Auto-version after merge** — `chore(release):` micro-PR promotes [Unreleased] to semver
