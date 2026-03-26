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

This runs a 7-phase quality gate (Phase 0 verifies dependencies, Phases 1-6 check code quality, logic, test coverage, UX, and performance). Every issue is categorized by severity so you know exactly what must be fixed before shipping.

## Repo Type Detection

Before running any phase, detect the repo type:
```bash
# If .manifest.json exists, read repo_type
jq -r '.repo_type' .claude/.manifest.json 2>/dev/null || echo "unknown"
# Fallback: framework repos have VERSION + install.sh, projects have package.json
```

**If repo_type=framework** (APEX Framework itself):
- Phase 0: Skip package.json dependency checks — validate shell script syntax instead (`bash -n .claude/scripts/*.sh`)
- Phase 1: Replace TypeScript checks with shell script and markdown frontmatter validation
- Phase 3: Replace test suite checks with JSON validation and agent frontmatter checks
- Phase 4-5: Skip UX and performance (not applicable to CLI framework)
- Focus on: script syntax, JSON validity, agent frontmatter, cross-references, hook wiring

**If repo_type=project** (default): Run all phases as documented below.

## Phase 0: Dependency Verification

Look for an architecture doc containing a "Dependencies Manifest" section:
```bash
grep -rl "Dependencies Manifest" docs/architecture/ 2>/dev/null | head -1
```

If found, verify each section of the manifest:

**Packages** — for each listed package, check it is present in `package.json`:
```bash
grep -E '"<package>"' package.json
```
Missing package = BLOCKING issue.

**Environment Variables** — for each listed variable, check it appears in `.env.example` or `.env.local`:
```bash
grep "VARIABLE_NAME" .env.example .env.local 2>/dev/null
```
Required variable absent from both files = BLOCKING issue.

**Internal Dependencies** — for each listed component/hook/module, verify the file exists:
```bash
# e.g., src/hooks/useAuth.ts or src/components/AuthPage.tsx
ls <path> 2>/dev/null
```
Missing file = BLOCKING issue.

If the manifest is absent, add a warning: "No Dependencies Manifest found — run /architecture first or create docs/architecture/*.md with a Dependencies Manifest section."

Report all dependency failures under a dedicated section **before** the Phase 1 findings.

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
- API calls deduplicated/cached?

**Bundle Size Gate** — BLOCKING check:
```bash
# Build and check output size
npm run build 2>&1
# Check main bundle size (gzip estimate)
du -sh dist/assets/*.js 2>/dev/null | sort -rh | head -5
```
- Main JS bundle must be < 250KB uncompressed (~80KB gzip)
- If larger: check for missing code splitting (lazy routes), unnecessary dependencies, or barrel imports pulling entire libraries
- Each route chunk should be < 100KB uncompressed
- CSS bundle should be < 50KB uncompressed
- Flag any single dependency that contributes > 50KB to the bundle

**Component Duplication Check**:
```bash
# Find potentially duplicated components
grep -rn "export function\|export default function" src/components/ 2>/dev/null | awk -F'[ (]' '{print $NF}' | sort | uniq -d
```
- If duplicate component names exist across different directories, flag as WARNING

## Phase 6: Deployment Readiness (when deploying)

Only run this phase if deploying (`/qa deploy` or `/qa production`):

- All required env vars set in target? Run: `grep -oE '[A-Z_]+' .env.example | sort`
- Database migrations ready and tested?
- Rollback plan exists? Previous version restorable in ≤5 min?
- Feature flags available for risky changes?
- SSL valid? CORS configured? Security headers set?

## Phase 7: Apple-Grade Polish

Run these checks on every PR, regardless of type. These catch quality failures that pass all other gates:

**Version consistency** — all version surfaces must agree:
```bash
# Extract version from each surface and compare
cat VERSION 2>/dev/null
grep -m1 "^## \[" CHANGELOG.md 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+'
grep -m1 '"version"' package.json 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+'
grep -m1 'v[0-9]' README.md 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+'
```
Mismatch across VERSION, README, CHANGELOG, or package.json = WARNING (BLOCKING if this is a release PR).

**Dead reference scan** — grep for names that no longer exist:
```bash
# Agent names referenced in docs but not present as agent files
grep -rn "subagent_type:" .claude/ 2>/dev/null | grep -oE '"[^"]+"' | sort -u
ls .claude/agents/ 2>/dev/null

# Skill names referenced in agent frontmatter but not present as skill dirs
grep -rn "^skills:" .claude/agents/ 2>/dev/null
ls .claude/skills/ 2>/dev/null

# File paths referenced in docs that don't exist
grep -rnoE '`[^`]+\.(md|sh|ts|json)`' docs/ .claude/ 2>/dev/null | \
  grep -oE '[^`]+\.(md|sh|ts|json)' | while read f; do [ -f "$f" ] || echo "DEAD: $f"; done
```
Any dead reference = WARNING.

**Truncation check** — no strings cut off mid-word in generated or static content:
```bash
# Look for lines that end suspiciously (common truncation patterns)
grep -rn '\.\.\.$\|…$' docs/ .claude/ 2>/dev/null | grep -v "CHANGELOG\|\.min\." | head -10
```
Review any matches — legitimate ellipsis is fine, truncated sentences are not.

**Cross-file count consistency** — hardcoded numbers must match reality:
```bash
# Count agents and verify any hardcoded "N agents" claims
agent_count=$(ls .claude/agents/*.md 2>/dev/null | wc -l | tr -d ' ')
skill_count=$(ls -d .claude/skills/*/ 2>/dev/null | wc -l | tr -d ' ')
echo "Agents: $agent_count  Skills: $skill_count"
grep -rn "[0-9]* agent\|[0-9]* skill" docs/ README.md 2>/dev/null | head -10
```
Any count claim that differs from the actual file count = WARNING.

**First-try usability** — verify the critical path works without tribal knowledge:
- Does `README.md` describe installation completely from scratch?
- Are all commands in docs runnable without undocumented prerequisites?
- Does every error message in scripts tell the user what to do next?

## Output

```markdown
## QA Report: [Feature/PR Name]
**Status**: 🔴 BLOCKED / 🟡 CONDITIONAL / 🟢 APPROVED

### Phase 0: Dependency Verification
- Packages: [count] verified / [count] missing
- Env vars: [count] verified / [count] missing
- Internal deps: [count] verified / [count] missing

### Phase 7: Apple-Grade Polish
- Version consistency: [all match / mismatch: list surfaces]
- Dead references: [none / list dead paths]
- Truncation: [clean / list suspicious lines]
- Count consistency: [verified / list mismatches]

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
