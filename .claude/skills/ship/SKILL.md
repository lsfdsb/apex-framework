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

### Step 5: Auto-Review (Code Review Plugin + Technical Writer)

**MANDATORY** — After PR is created, run both in parallel:

```
# 1. Official Code Review Plugin — multi-agent PR review (posts GitHub comment)
#    Spawns 5 parallel Sonnet agents: CLAUDE.md compliance, bug scan,
#    git history context, previous PR comments, code comment compliance.
#    Confidence-scored (80+ threshold). Posts findings to GitHub.
Skill("code-review:code-review", args: "[NUMBER]")

# 2. Technical Writer — update docs
Agent({
  subagent_type: "technical-writer",
  run_in_background: true,
  prompt: "Update CHANGELOG and README for PR #[NUMBER]: [TITLE]. Run gap detection first."
})
```

**Show the PR URL to the user while reviews run.** Don't ask to merge yet — wait for the plugin's verdict.

### Step 6: Review Gate

Wait for the plugin to complete:
- **No issues (score < 80)** → posts "No issues found" comment → proceed to merge
- **Issues found (score 80+)** → posts findings as GitHub comment → fix, push, re-review

The plugin is the single review gate. It covers CLAUDE.md compliance (which includes all APEX rules), bugs, git history, and code comments — all confidence-scored to filter false positives.

### Step 7: Merge (only with user approval)

**NEVER merge without explicit user approval.** Show the PR URL and Code Reviewer verdict first.

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
