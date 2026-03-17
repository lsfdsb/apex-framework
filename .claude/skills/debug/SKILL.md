---
name: debug
description: Structured debugging workflow for any error. Auto-loads when Claude encounters an error, build failure, test failure, runtime exception, or when the user says "error", "bug", "broken", "not working", "fix this", "debug", "crash", "fails", "undefined", "null", "TypeError", "500 error". Teaches the user to debug like a senior engineer.
allowed-tools: Read, Grep, Glob, Bash
---

# Debug — Definitive Solutions Only

> "Debugging is twice as hard as writing the code in the first place." — Brian Kernighan
> "Fix it right, or don't fix it at all." — APEX Philosophy

## Core Principle: No Band-Aids

Every fix must be **definitive**. We never:
- Silence an error without understanding it
- Add a `try/catch` just to hide a crash
- Use `any` to bypass a type error
- Add `// @ts-ignore` or `eslint-disable` as a "fix"
- Apply workarounds that leave the root cause alive
- Fix a symptom in one place while the same bug exists in 10 others

**If a fix doesn't eliminate the root cause, it's not a fix — it's debt.**

## The APEX Debug Protocol

### Step 1: UNDERSTAND the error (don't guess, don't rush)

```
📺 ERROR: [full error message — never truncate]
📖 PLAIN LANGUAGE: [what this error actually means]
🧠 ROOT CAUSE: [the actual underlying problem, not the symptom]
📍 ORIGIN: [file:line from stack trace — YOUR code, not node_modules]
🔗 CHAIN: [what called what → trace the full execution path]
```

**Rules:**
- Read the FULL error. The answer is usually in the last 3 lines of a stack trace.
- Find the FIRST file that's YOUR code.
- If the error is vague, add temporary logging to expose the real state.
- **Never guess the cause. Read the code. Read the data. Know the cause.**

### Step 2: REPRODUCE (confirm you can trigger it)

- Can you trigger this error consistently?
- What's the minimal input that causes it?
- Does it happen in dev, prod, or both?
- Does the dev server log show related errors? (`/dev errors`)

### Step 3: ANALYZE scope (how deep does this go?)

Before writing a single line of fix:

```bash
# How many places does this pattern exist?
# Search the entire codebase for the same anti-pattern
grep -rn "PATTERN" src/

# When was this introduced?
git log --oneline --all -20

# What else depends on this code?
grep -rn "functionName\|ClassName" src/
```

**Critical questions:**
- Is this a **one-off mistake** or a **systemic pattern**?
- If I fix it here, will it break somewhere else?
- Are there 5 other files with the same bug waiting to happen?
- Does this reveal a **missing abstraction** or **missing validation**?

### Step 4: DESIGN the definitive fix

Before coding, write the fix plan:

```
🎯 FIX PLAN:
- Root cause: [what's actually wrong]
- Fix approach: [how we'll eliminate it permanently]
- Scope: [all files/functions affected — not just the one that crashed]
- Side effects: [what could break, what we need to verify]
- Prevention: [type/test/validation that makes recurrence impossible]
```

**The fix must address ALL instances, not just the one that triggered the error.**

### Step 5: IMPLEMENT (fix right, fix everywhere)

1. Fix the root cause in the origin file
2. Search for and fix ALL instances of the same pattern across the codebase
3. Add TypeScript types that make this class of error **impossible at compile time**
4. Add runtime validation at system boundaries (user input, API responses, env vars)
5. Add a test that reproduces the original bug and proves it's fixed

**Fix hierarchy (strongest to weakest):**
| Level | Method | Example |
|-------|--------|---------|
| 1 | **Type system** | Make invalid states unrepresentable |
| 2 | **Compile-time check** | Strict mode, exhaustive switch |
| 3 | **Automated test** | Unit test that catches this exact case |
| 4 | **Runtime validation** | Zod schema, guard clause at boundary |
| 5 | **Defensive code** | Optional chaining, fallback — last resort |

Always aim for Level 1-2. Level 5 alone is never a definitive fix.

### Step 6: VERIFY (prove it's dead)

- [ ] Original error no longer reproducible
- [ ] New test passes and would catch regression
- [ ] `grep` confirms no other instances of the pattern remain
- [ ] Full test suite passes
- [ ] Dev server shows no new errors (`/dev errors`)
- [ ] TypeScript compiles clean (`npx tsc --noEmit`)

### Step 7: PREVENT (make it impossible to recur)

- Add the regression test (if not added in Step 5)
- Tighten TypeScript types to catch this class of error at compile time
- Add validation at the input boundary (not deep in business logic)
- Update the PRD if this revealed a missing requirement
- If this was a systemic pattern, consider a lint rule or code standard update

## Common Error Patterns — Definitive Fixes

| Error | Symptom Fix (DON'T) | Definitive Fix (DO) |
|-------|---------------------|---------------------|
| `Cannot read property of undefined` | Add `?.` at crash point | Find why data is undefined. Fix the source. Add type that forbids undefined. |
| `404 Not Found` | Hardcode the URL | Centralize routes in a constants file. Type-check route params. |
| `CORS error` | Add `*` to allowed origins | Configure exact origins from env var. Add to deployment checklist. |
| `Hydration mismatch` | Add `suppressHydrationWarning` | Move browser-only code to `useEffect` or `'use client'` boundary. |
| `Type 'any' is not assignable` | Cast with `as any` | Define proper interface. Fix the data flow end-to-end. |
| `ECONNREFUSED` | Add retry loop | Fix connection config. Add health check. Fail fast with clear error. |
| `JWT expired` | Extend token TTL to 30 days | Implement proper refresh token rotation flow. |
| `Module not found` | Relative path hacks `../../..` | Fix path aliases in tsconfig. Use `@/` imports. |
| Test flaky/intermittent | Skip the test | Fix the race condition or timing dependency. Use proper async/await. |
| `console.error` in production | Remove the console.log | Fix the underlying issue. Errors are signals, not noise. |

## Anti-Patterns (Red Flags)

If you catch yourself doing any of these, **stop and rethink**:

- `// TODO: fix this properly later` → Fix it now or document WHY it can't be fixed now
- `catch (e) { /* ignore */ }` → Never swallow errors silently
- `as any` or `@ts-ignore` → Fix the type, don't bypass the compiler
- `eslint-disable-next-line` → Fix the code, not the linter
- `if (x) { ... } // sometimes x is null but idk why` → Understand WHY before coding
- Retry loops without understanding the failure → Find the root cause first
- Fixing one file when the same bug exists in 10 others → Fix ALL instances

## Checkpointing (Save/Restore State)

When debugging complex issues, use git checkpoints:

```bash
# Save before a risky fix attempt
git stash push -m "debug-checkpoint: before fix attempt 1"

# If it didn't work, restore
git stash pop

# Or branch for multi-approach debugging
git checkout -b debug/issue-description
git commit -am "debug: checkpoint before approach 2"
git checkout -
```

## Output Format

```markdown
## 🔍 Debug Report

**Error**: [one-line description]
**Root cause**: [what's actually wrong, not the symptom]
**Scope**: [N files affected, M instances of the pattern]
**Fix**: [what was changed, why it's definitive]
**Prevention**: [type/test/validation added to prevent recurrence]
**Verification**: [tests passed, grep clean, dev server clean]
**Lesson**: [what the user can learn from this]
```
