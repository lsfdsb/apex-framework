---
name: qa
description: Runs comprehensive quality assurance on any feature, PR, or code change. Also handles deployment readiness checks (replaces /deploy). Use when the user says "test", "QA", "quality check", "review code", "is this ready", "check for bugs", "verify", "deploy", "ship", "release", "go live", or before any merge/deploy. Claude should also invoke this after completing any implementation task — no code ships without QA.
argument-hint: "[feature or PR name]"
allowed-tools: Read, Grep, Glob, Bash
---

# QA Gate — Zero Defect Tolerance

> "Quality is not an act, it is a habit." — Aristotle

## Current Context

Git status: !`git status --short 2>/dev/null | head -20`
Recent commits: !`git log --oneline -5 2>/dev/null`
Changed files: !`git diff --name-only HEAD~1 2>/dev/null | head -20`

## What This Skill Does

This runs a 6-phase quality gate. It checks code quality, logic, test coverage, UX, and performance. Every issue is categorized by severity so you know exactly what must be fixed before shipping.

## Phase 1: Static Analysis

Scan changed files for:

- **TypeScript**: No `any`, no `!` non-null assertions, explicit return types on public functions
- **Hygiene**: No `console.log`, `debugger`, commented-out code, or hardcoded secrets
- **Standards**: Functions ≤30 lines, files ≤300 lines, descriptive naming
- **Imports**: Organized (external → internal → types → styles), no unused imports

## Phase 2: Logic Review

- Does implementation match PRD requirements?
- All edge cases handled? (empty, error, loading, overflow, null)
- Data validated at input boundaries?
- Race conditions prevented? (debounce, abort controllers)
- No N+1 queries?

## Phase 3: Test Coverage

Check existing tests and identify gaps. Suggest missing tests as:
```
TEST: [What to test]
WHY: [Why it matters]
SCENARIO: Setup → Action → Expected Result
```

## Phase 4: UX Review

- User understands purpose within 3 seconds?
- Primary action in ≤3 clicks?
- Error messages helpful? (what happened, why, how to fix)
- Loading states exist for async operations?
- Keyboard navigation works?

## Phase 5: Performance

- Images optimized and lazy-loaded?
- No unnecessary re-renders?
- Bundle impact reasonable?
- API calls deduplicated/cached?

## Phase 6: Deployment Readiness (when deploying)

Only run this phase if deploying (`/qa deploy` or `/qa production`):

- All required env vars set in target? Run: `grep -oE '[A-Z_]+' .env.example | sort`
- Database migrations ready and tested?
- Rollback plan exists? Previous version restorable in ≤5 min?
- Feature flags available for risky changes?
- SSL valid? CORS configured? Security headers set?

## Output

```markdown
## QA Report: [Feature/PR Name]
**Status**: 🔴 BLOCKED / 🟡 CONDITIONAL / 🟢 APPROVED

### 🔴 Critical (must fix)
- [Issue] → [Fix]

### 🟡 Warnings (should fix)
- [Issue] → [Fix]

### 🟢 Suggestions
- [Improvement]

### Test Coverage
- Existing: [count] passing
- Missing: [suggested tests]

### Verdict
[Summary and recommendation]
```
