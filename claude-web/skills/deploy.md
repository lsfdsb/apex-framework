---
name: deploy
description: Pre-deployment verification checklist. Use when the user says deploy, ship, release, go live, push to production, staging, or pre-deploy. Ensures nothing broken reaches users.
disable-model-invocation: true
context: fork
allowed-tools: Read, Grep, Glob, Bash
---

# Deployment Gate — Ship with Confidence

ultrathink

Run all gates. Report results. Block if any gate fails.

## Gates

### 1. Code Quality
```bash
npx tsc --noEmit            # Zero TS errors
npx eslint . --max-warnings=0  # Zero lint warnings
npx prettier --check .       # Format clean
```
Grep for: console.log, debugger, TODO without issue links.

### 2. Tests
```bash
npm test -- --coverage       # All pass, ≥80% lines
npx playwright test          # E2E critical paths (if available)
```

### 3. Security
```bash
npm audit --audit-level=high  # No critical/high CVEs
```
Grep for hardcoded secrets. Verify .env.example is current.

### 4. Performance
Check bundle size against budget. No new unoptimized images.

### 5. Environment
All required env vars set in target? Migrations ready? SSL valid?

### 6. Rollback
Previous version restorable in ≤5 min? Down migrations exist? Feature flags available?

## Output

```markdown
## Deploy Report: v[X.Y.Z] → [target]
**Status**: ✅ GO / 🛑 NO-GO

| Gate | Status | Notes |
|------|--------|-------|
| Code Quality | ✅/❌ | |
| Tests | ✅/❌ | coverage % |
| Security | ✅/❌ | audit results |
| Performance | ✅/❌ | bundle size |
| Environment | ✅/❌ | |
| Rollback | ✅/❌ | |

### NO-GO if ANY: failing tests, critical CVEs, missing env vars, no rollback plan.
```
