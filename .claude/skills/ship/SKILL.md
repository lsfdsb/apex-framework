---
name: ship
description: Fast-track branch → commit → push → PR → merge workflow. Use when the user says "ship", "push and merge", "push pr merge", "ship it", or when changes are ready to go. Spawns Technical Writer automatically. Requires explicit user approval for merge.
argument-hint: '[commit message or description of changes]'
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

**5b. Code Review:**

Code review happens through two channels — no separate code-review skill is needed:

1. **QA agent review** — If a QA agent is active in the team, message it with the PR number. It will run the full 7-phase quality gate and report APPROVED / BLOCKED.
2. **GitHub native PR review** — Show the PR URL to the user and ask them to review it in GitHub. GitHub's native review tools (diff, comments, approval) are the primary review mechanism.

**Show the PR URL to the user.** Don't ask to merge yet.

### Step 6: Review Gate

Wait for review to complete:

- **QA APPROVED + user approves** → proceed to merge
- **QA BLOCKED or reviewer requests changes** → fix, push, re-review

The QA agent covers APEX convention compliance, security, type safety, and test coverage. GitHub native review covers product logic and business correctness.

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

## Pre-Ship Verification

Before offering ship options, use `/verify`:

1. **Run test suite** — all tests must pass. No exceptions.
2. **Run linter** — zero errors.
3. **Run build** — exits 0.
4. If ANY check fails: fix first, don't proceed.

## Branch Completion Options

When implementation is complete and verified, present exactly these options:

```
Implementation complete and verified. What would you like to do?

1. Push and create a Pull Request (recommended)
2. Merge back to <base-branch> locally
3. Keep the branch as-is (you'll handle it)
4. Discard this work
```

**Option 4 requires typed confirmation:** "This will permanently delete branch and all commits. Type 'discard' to confirm."

## Rules

1. **Never push to main directly** — always branch first
2. **Never merge without approval** — show PR URL, ask user
3. **Technical Writer runs on every ship** — nothing ships undocumented
4. **Conventional commits** — `type(scope): description`
5. **72-char subject lines** — enforced by commit-msg hook
6. **Squash merge** — clean history, delete branch
7. **Auto-version after merge** — `chore(release):` micro-PR promotes [Unreleased] to semver
8. **Verify before ship** — use `/verify` to prove tests pass, build succeeds. Evidence before claims.
9. **Review before merge** — use `/request-review` for code review on significant changes

## Integration

- **Preceded by** `/execute` or `/teams` build completion, then `/request-review`
- **Uses** `/verify` for pre-ship verification
- **Uses** `/code-review` when handling PR feedback
- **Cleans up** `/worktree` if isolation was used
