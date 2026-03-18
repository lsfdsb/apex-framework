---
name: changelog
description: Generates and maintains CHANGELOG.md and auto-updates PRD status. This skill should be used when the user says "changelog", "what changed", "release notes", "update docs", "update PRD", or after completing a feature. Also auto-invoked by the commit skill after successful commits. Keeps documentation alive — PRDs update automatically as features are built.
argument-hint: "[version or 'unreleased']"
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

### On version release
Move `[Unreleased]` items to a new version section:
```markdown
## [1.2.0] - 2026-03-13

### Added
- User authentication with OAuth (Google, GitHub) (#12)
- Password reset flow with email verification (#15)
```

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
- After `/qa deploy` — move Unreleased to versioned section
- After completing a feature — update PRD status
- User asks "update docs" — run full update

## Rules

- Never invent changes that didn't happen. Only document actual commits.
- Keep descriptions user-facing: "Added dark mode toggle" not "Refactored theme provider context"
- One line per change. Link issues when available.
- PRD updates are additive — never delete original requirements, only mark status.
