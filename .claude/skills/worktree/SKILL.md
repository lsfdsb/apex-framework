---
name: worktree
description: Use when starting feature work that needs isolation from current workspace, or before executing implementation plans in a separate branch. Also use when the user says "worktree", "isolated branch", "separate workspace", or when parallel work could conflict.
argument-hint: "[branch-name]"
allowed-tools: Read, Grep, Glob, Bash
---

# Git Worktree Isolation

> "No living thing has seen me without my helmet." — and no worktree ships without safety checks.

Create isolated workspaces sharing the same repository. Work on multiple branches simultaneously without switching.

**APEX policy reminder:** Default isolation is `none` — agents write directly to the project. Only use worktrees when 2+ builders modify the SAME files in parallel. This skill is for when you genuinely need isolation.

## Directory Selection Priority

### 1. Check Existing Directories

```bash
ls -d .worktrees 2>/dev/null     # Preferred (hidden)
ls -d worktrees 2>/dev/null      # Alternative
```

If found, use it. If both exist, `.worktrees` wins.

### 2. Check CLAUDE.md

```bash
grep -i "worktree.*director" CLAUDE.md 2>/dev/null
```

If preference specified, use it without asking.

### 3. Ask User

```
No worktree directory found. Where should I create worktrees?

1. .worktrees/ (project-local, hidden)
2. ~/worktrees/<project-name>/ (global location)

Which?
```

## Safety Verification

**For project-local directories — MUST verify ignored before creating:**

```bash
git check-ignore -q .worktrees 2>/dev/null
```

**If NOT ignored:** Add to `.gitignore`, commit, then proceed.

**Why critical:** Prevents accidentally committing worktree contents.

## Creation Steps

```bash
# 1. Detect project name
project=$(basename "$(git rev-parse --show-toplevel)")

# 2. Create worktree with new branch
git worktree add "$path" -b "$BRANCH_NAME"
cd "$path"

# 3. Run project setup (auto-detect)
[ -f package.json ] && npm install
[ -f Cargo.toml ] && cargo build
[ -f requirements.txt ] && pip install -r requirements.txt
[ -f go.mod ] && go mod download

# 4. Verify clean baseline
npm test  # or appropriate test command
```

**If tests fail:** Report failures, ask whether to proceed or investigate.
**If tests pass:** Report ready.

### Report Location

```
Worktree ready at <full-path>
Tests passing (<N> tests, 0 failures)
Ready to implement <feature-name>
```

## Cleanup

After work completes (via `/ship`):

```bash
git worktree remove <worktree-path>
git worktree prune
```

## Quick Reference

| Situation | Action |
|-----------|--------|
| `.worktrees/` exists | Use it (verify ignored) |
| `worktrees/` exists | Use it (verify ignored) |
| Neither exists | Check CLAUDE.md → Ask user |
| Directory not ignored | Add to .gitignore + commit |
| Tests fail baseline | Report failures + ask |

## Integration

- **Called by** `/execute` or `/teams` when isolation needed
- **Cleaned up by** `/ship` after work completes
- **Policy:** APEX default is `isolation: none`. Only use worktrees for parallel conflicting builders.
