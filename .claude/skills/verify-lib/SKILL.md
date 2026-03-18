---
name: verify-lib
description: Verify any library or package before installing it. Auto-invoked before any npm install, pip install, or dependency addition. Checks official status, security, maintenance, and license. We only use official, verified libraries — no exceptions. Triggers on install, add package, add dependency, npm install, pip install, or any new library reference.
allowed-tools: Read, Bash, Grep, Glob, WebFetch, WebSearch
---

# Library Verification Gate

Before installing ANY new dependency, verify it using REAL data from official sources. You have WebFetch — use it to check npmjs.com and bundlephobia directly.

## Verification Protocol

### 1. Official Publisher

```bash
npm view [package] --json | jq '{name, version, publisher: .maintainers, repository, homepage, license}'
```

Then **WebFetch the npm page** to verify the publisher badge:
```
WebFetch("https://www.npmjs.com/package/[package]")
```

Check: npm verified publisher badge, repository matches official org, not a typosquat.

**BLOCK if:** publisher doesn't match official org, or package name is suspiciously similar to a popular package.

### 2. Maintenance & Activity

```bash
npm view [package] time --json | jq 'to_entries | sort_by(.value) | last(3)'
```

Check: last publish date, release frequency, whether the project is actively maintained.

**BLOCK if:** last publish >12 months ago AND has open critical issues.
**WARN if:** last publish >6 months ago.

### 3. Security — CVEs

```bash
# Check npm audit for known vulnerabilities
npm audit --json 2>/dev/null | jq '.vulnerabilities | to_entries[] | select(.value.severity == "critical" or .value.severity == "high")'
```

Also WebSearch for recent CVEs:
```
WebSearch("[package] CVE vulnerability 2025 2026")
```

**BLOCK if:** critical or high severity CVEs with no fix available.

### 4. Bundle Size

**WebFetch bundlephobia** to get real size data:
```
WebFetch("https://bundlephobia.com/package/[package]@[version]")
```

Also check via CLI as backup:
```bash
npm view [package] --json | jq '.dist.unpackedSize'
```

| Category | Acceptable | Warning | Block |
|----------|-----------|---------|-------|
| Utility (lodash-like) | <10KB gzip | 10-50KB | >50KB |
| UI component lib | <30KB gzip | 30-100KB | >100KB |
| Framework | <50KB gzip | 50-150KB | >150KB |
| Full SDK | <100KB gzip | 100-300KB | >300KB |

### 5. License

```bash
npm view [package] license
```

| License | Status | Reason |
|---------|--------|--------|
| MIT, Apache-2.0, BSD-2, BSD-3, ISC | ALLOW | Permissive, no restrictions |
| LGPL, MPL | WARN | Copyleft concerns, may require disclosure |
| GPL, AGPL | BLOCK | Viral license, forces open-source on your code |
| Unlicensed, WTFPL, no license | BLOCK | No legal protection |

### 6. TypeScript Support

```bash
# Check if types are built-in
npm view [package] types typings --json
# Check if @types/ exists
npm view @types/[package] version 2>/dev/null
```

**WARN if:** no TypeScript types available (built-in or @types/).

### 7. Necessity Check

Before approving, check if the functionality already exists:
- Does the project already have a dependency that does this?
- Can this be done with native Web APIs or Node built-ins?
- Is the library a thin wrapper around something we could use directly?

**WARN if:** there's a simpler alternative already in the project.

## Output Format

```markdown
## Library Verification: [package@version]
**Verdict**: ✅ APPROVED / ⚠️ CONDITIONAL / 🛑 BLOCKED

| Check | Status | Detail |
|-------|--------|--------|
| Official | ✅/❌ | [publisher info, verified on npmjs.com] |
| Maintained | ✅/❌ | [last publish: date, from npm registry] |
| Secure | ✅/❌ | [audit results, CVE check] |
| Size | ✅/⚠️ | [XKB min+gzip, from bundlephobia] |
| License | ✅/❌ | [license type, from npm registry] |
| TypeScript | ✅/⚠️ | [built-in / @types / none] |
| Necessary | ✅/⚠️ | [alternatives if any] |

**Sources checked:**
- npmjs.com/package/[name] (fetched)
- bundlephobia.com/package/[name] (fetched)
- npm audit (ran)
```

## If BLOCKED

Explain why, suggest alternatives, and **never install** a blocked package. The user can override with explicit acknowledgment of the risk.
