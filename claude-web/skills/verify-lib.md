---
name: verify-lib
description: Verify any library or package before installing it. Auto-invoked before any npm install, pip install, or dependency addition. Checks official status, security, maintenance, and license. We only use official, verified libraries — no exceptions. Triggers on install, add package, add dependency, npm install, pip install, or any new library reference.
allowed-tools: Read, Bash, Grep, Glob
---

# Library Verification Gate

Before installing ANY new dependency, verify:

## Verification Checklist

1. **Official?** — Is this from the official publisher?
   ```bash
   npm view [package] --json | jq '{name, publisher: .maintainers, repository, homepage}'
   ```
   Check: npm verified publisher badge, repository matches official org.

2. **Maintained?** — Last publish date, open issues, contributors?
   ```bash
   npm view [package] time --json | jq 'to_entries | last'
   ```
   BLOCK if: last publish >12 months ago with open security issues.

3. **Secure?** — Any known vulnerabilities?
   ```bash
   npm audit [package] 2>/dev/null || echo "Run after install to check"
   ```
   BLOCK if: critical or high severity CVEs.

4. **Sized?** — What's the bundle impact?
   Report the minified + gzipped size. Flag if >50KB for a utility library.

5. **Licensed?** — Compatible license?
   ```bash
   npm view [package] license
   ```
   ALLOW: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC
   WARN: LGPL, MPL (copyleft concerns)
   BLOCK: GPL, AGPL, unlicensed, WTFPL

6. **Typed?** — TypeScript support?
   Check for built-in types or @types/ package.

7. **Necessary?** — Can we achieve this with what we already have?
   Check if Next.js, React, or existing deps already solve this.

## Output

```markdown
## Library Verification: [package@version]
**Verdict**: ✅ APPROVED / ⚠️ CONDITIONAL / 🛑 BLOCKED

| Check | Status | Detail |
|-------|--------|--------|
| Official | ✅/❌ | [publisher info] |
| Maintained | ✅/❌ | [last publish date] |
| Secure | ✅/❌ | [audit results] |
| Size | ✅/⚠️ | [XKB gzipped] |
| License | ✅/❌ | [license type] |
| TypeScript | ✅/⚠️ | [built-in / @types / none] |
| Necessary | ✅/⚠️ | [alternatives if any] |
```

## If BLOCKED
Explain why and suggest alternatives. Never install a blocked package.
