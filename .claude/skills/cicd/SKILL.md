---
name: cicd
description: Sets up CI/CD pipelines with GitHub Actions and Vercel. This skill should be used when the user says "CI", "CD", "pipeline", "GitHub Actions", "automate deploy", "continuous integration", "automated tests", or when setting up deployment workflows. Fast shipping needs automated quality gates.
argument-hint: '[setup|review|claude-pr]'
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# CI/CD — Automate the Boring Parts

## GitHub Actions Pipeline

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: latest
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile

      - name: Type Check
        run: pnpm exec tsc --noEmit

      - name: Lint
        run: pnpm exec oxlint . --deny-warnings

      - name: Format Check
        run: pnpm exec prettier --check .

      - name: Unit Tests
        run: pnpm test -- --coverage

      - name: Security Audit
        run: pnpm audit --audit-level=high

  e2e:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: latest
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: npx playwright install --with-deps
      - name: E2E Tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Vercel Integration

Vercel auto-deploys when connected to GitHub:

- Every push to `main` → production deploy
- Every PR → preview deploy (unique URL per PR)
- No manual deployment needed

Setup: Connect repo at vercel.com/new → Import → Deploy.

## Branch Protection Rules

On GitHub: Settings → Branches → Add rule for `main`:

- ✅ Require status checks (quality, e2e)
- ✅ Require PR review
- ✅ No direct pushes
- ✅ Require up-to-date branches

## The APEX Pipeline

```
Code → Push → CI runs (lint + type + test + audit + e2e)
  ↓ fail → Fix and push again
  ↓ pass → PR gets preview URL from Vercel
  ↓ review approved → Squash merge to main
  ↓ → Vercel auto-deploys to production
```

Every step is automated. No human can skip the quality gates.

## Claude Code Automated PR Review

Create `.github/workflows/claude-pr-review.yml` to get AI-powered code reviews on every PR:

```yaml
name: Claude PR Review
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  claude-review:
    runs-on: ubuntu-latest
    if: github.event.pull_request.draft == false
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code
      - name: Run Claude Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          DIFF=$(git diff origin/${{ github.base_ref }}...HEAD)
          claude -p "Review this PR diff for bugs, security, performance, and quality: $DIFF" \
            --output-format text > review.txt
      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.txt', 'utf8');
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: review
            });
```

**Setup**: Add `ANTHROPIC_API_KEY` to your repo's Settings → Secrets → Actions.

A full version of this workflow is available at `.github/workflows/claude-pr-review.yml`.
