---
name: changelog
description: Generates and maintains CHANGELOG.md and auto-updates PRD status. This skill should be used when the user says "changelog", "what changed", "release notes", "update docs", "update PRD", or after completing a feature. Also auto-invoked by the commit skill after successful commits. Keeps documentation alive — PRDs update automatically as features are built.
argument-hint: "[version or 'promote' or 'unreleased']"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# Changelog & Documentation Keeper

> **NOTE:** The auto-changelog hook captures commits made during Claude sessions. GitHub squash merges happen server-side and don't trigger hooks. After merging a PR, run `/changelog` to sync the CHANGELOG with merged commits.

## Current Context

Recent commits: !`git log --oneline -10 2>/dev/null`
Tags: !`git tag --sort=-v:refname 2>/dev/null | head -5`

## What This Skill Does

Two jobs, one skill:
1. **Maintains CHANGELOG.md** — keeps a running record of every meaningful change
2. **Auto-updates PRDs** — marks user stories as completed, updates status, tracks implementation progress

## Changelog Generation

### Format (Keep a Changelog standard)
```markdown
# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- New feature description (#issue)

### Changed
- Modification description (#issue)

### Fixed
- Bug fix description (#issue)

### Security
- Security improvement (#issue)

### Removed
- Removed feature description
```

### Process
1. Run `git log --oneline` since the last changelog entry
2. Group commits by type (feat→Added, fix→Fixed, security→Security, etc.)
3. Write human-readable descriptions (not raw commit messages)
4. Link to relevant issues/PRs if available
5. Place under `[Unreleased]` until a version is tagged

### On version release / `promote` argument

When invoked with `promote` (or after `/ship` merge), run the **Version Promotion Algorithm**:

#### Step 1: Check if promotion is needed
```bash
# Read [Unreleased] section — if empty (no bullet entries), skip
head -20 CHANGELOG.md
```
If `[Unreleased]` has no `- **` entries, skip promotion and report "Nothing to release."

#### Step 2: Determine version bump from merged commits
```bash
# Get commits since last version tag
git log $(git describe --tags --abbrev=0 2>/dev/null || echo HEAD~50)..HEAD --format='%s'
```
Apply semver rules (highest wins):
- `BREAKING CHANGE` in body or `!` after type → **MAJOR** (X+1.0.0)
- `feat:` or `feat(scope):` → **MINOR** (X.Y+1.0)
- `fix:`, `refactor:`, `perf:`, `docs:`, `security:` → **PATCH** (X.Y.Z+1)
- Default: PATCH

Read current version from `VERSION` file, calculate next version.

#### Step 3: Generate release title
- Scan `[Unreleased]` entries for a theme
- Use the most prominent bold feature names to create a short title
- Examples: "Responsive Nav + Auto-Versioning", "Pipeline Improvements"
- Fallback: "Maintenance Release"

#### Step 4: Promote CHANGELOG.md
Replace the `[Unreleased]` block:
```markdown
## [Unreleased]

## [X.Y.Z] — YYYY-MM-DD — Release Title

### Changed
- ...entries from old [Unreleased]...

### Fixed
- ...entries from old [Unreleased]...
```
- Date is today in ISO format (YYYY-MM-DD)
- Remove empty category headers (### Added with no entries)
- The new `[Unreleased]` is empty (no subsections)

#### Step 5: Update VERSION file
Write the bare version number (e.g., `5.16.0`) to `VERSION`.

#### Step 6: Update README.md version references
```bash
# Replace old version with new in README
sed -i '' "s/OLD_VERSION/NEW_VERSION/g" README.md
```

#### Step 7: Commit and push via micro-PR
```bash
git checkout -b chore/release-X.Y.Z
git add CHANGELOG.md VERSION README.md
git commit -m "chore(release): vX.Y.Z — Release Title"
git push -u origin chore/release-X.Y.Z
gh pr create --title "chore(release): vX.Y.Z" --body "Auto-version bump"
gh pr merge --squash --delete-branch
git checkout main && git pull origin main
```

#### Step 8: Report
Tell the user: "Released vX.Y.Z — [title]. VERSION, CHANGELOG, and README updated."

#### Safety checks
- Verify `[Unreleased]` has entries before promoting
- Verify new version > current version
- Verify new version doesn't already exist in CHANGELOG
- Never modify released version sections

## PRD Auto-Update

After implementing any feature:

1. Find the relevant PRD in `docs/prd/`
2. In the User Stories section, mark completed stories:
   - `- [x] ~~As a user, I want to login~~ ✅ Implemented in v1.2.0`
3. Update the PRD status field:
   - `**Status**: Draft → In Progress → Partially Complete → Complete`
4. Add an Implementation Notes section at the bottom:
   ```markdown
   ## Implementation Notes (Auto-Updated)
   **Last Updated**: [date]
   
   ### Completed
   - [Story] — Implemented in [file(s)] — [date]
   
   ### In Progress
   - [Story] — Started, [what remains]
   
   ### Deferred
   - [Story] — Reason for deferral
   ```

## When to Run

- After `/commit` — update changelog with new commits
- After `/ship` merge — auto-promote `[Unreleased]` to versioned release (`promote`)
- After completing a feature — update PRD status
- User asks "update docs", "changelog", "release notes" — run full update
- User asks "release", "cut a version", "bump version" — run version promotion

## Rules

- Never invent changes that didn't happen. Only document actual commits.
- Keep descriptions user-facing: "Added dark mode toggle" not "Refactored theme provider context"
- One line per change. Link issues when available.
- PRD updates are additive — never delete original requirements, only mark status.
