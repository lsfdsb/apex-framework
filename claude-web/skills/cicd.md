---
name: cicd
description: Sets up CI/CD pipelines with GitHub Actions and Vercel. This skill should be used when the user says "CI", "CD", "pipeline", "GitHub Actions", "automate deploy", "continuous integration", "automated tests", or when setting up deployment workflows. Fast shipping needs automated quality gates.
disable-model-invocation: true
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
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci

      - name: Type Check
        run: npx tsc --noEmit

      - name: Lint
        run: npx eslint . --max-warnings=0

      - name: Format Check
        run: npx prettier --check .

      - name: Unit Tests
        run: npm test -- --coverage

      - name: Security Audit
        run: npm audit --audit-level=high

  e2e:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
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
