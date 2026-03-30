---
name: debug
description: Use when encountering any bug, test failure, unexpected behavior, or error — before proposing fixes. Also use when the user says "debug", "broken", "not working", "investigate", "root cause", "flaky", or when previous fixes haven't worked.
argument-hint: '[error description or symptom]'
allowed-tools: Read, Grep, Glob, Bash
---

# Systematic Debugging — Track the Bounty

> "I can bring you in warm, or I can bring you in cold." — applies to bugs too.

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes. Symptom fixes are failure.

**Violating the letter of this process is violating the spirit of debugging.**

## Current Context

Branch: !`git branch --show-current 2>/dev/null`
Recent changes: !`git log --oneline -5 2>/dev/null`
Test status: !`npm test 2>&1 | tail -5 2>/dev/null || echo "No test runner found"`

## When to Use

Use for ANY technical issue: test failures, bugs, unexpected behavior, performance problems, build failures, integration issues, flaky tests.

**Use ESPECIALLY when:**

- Under time pressure (emergencies make guessing tempting)
- "Just one quick fix" seems obvious
- You've already tried multiple fixes
- You don't fully understand the issue

## The Four Phases

Complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read Error Messages Carefully**
   - Don't skip past errors or warnings
   - Read stack traces completely
   - Note line numbers, file paths, error codes

2. **Reproduce Consistently**
   - Can you trigger it reliably?
   - What are the exact steps?
   - If not reproducible → gather more data, don't guess

3. **Check Recent Changes**
   - `git diff`, recent commits, new dependencies
   - Environmental differences, config changes

4. **Gather Evidence in Multi-Component Systems**

   For each component boundary:
   - Log what data enters / exits the component
   - Verify environment/config propagation
   - Check state at each layer
   - Run once to gather evidence showing WHERE it breaks
   - THEN investigate the failing component

5. **Trace Data Flow (Root Cause Tracing)**

   When error is deep in call stack:
   - Where does the bad value originate?
   - What called this with the bad value?
   - Keep tracing up until you find the SOURCE
   - Fix at source, not at symptom

   ```
   Symptom: git init in wrong directory
   → cwd parameter is empty
   → createWorkspace called with empty projectDir
   → Session.create passed empty string
   → Test accessed variable before beforeEach
   ROOT CAUSE: Top-level initialization accessing empty value
   ```

   **NEVER fix just where the error appears.** Trace backward.

### Phase 2: Pattern Analysis

1. **Find Working Examples** — Locate similar working code in same codebase
2. **Compare Against References** — Read reference implementation COMPLETELY, don't skim
3. **Identify Differences** — List every difference, however small
4. **Understand Dependencies** — What settings, config, environment does this need?

### Phase 3: Hypothesis and Testing

1. **Form Single Hypothesis** — "I think X is the root cause because Y" — write it down
2. **Test Minimally** — SMALLEST possible change, ONE variable at a time
3. **Verify Before Continuing** — Did it work? Yes → Phase 4. No → NEW hypothesis (don't stack fixes)
4. **When You Don't Know** — Say "I don't understand X" — don't pretend

### Phase 4: Implementation

1. **Create Failing Test Case** — Use `/tdd` for proper failing test. MUST have before fixing.
2. **Implement Single Fix** — Address root cause. ONE change. No "while I'm here" improvements.
3. **Verify Fix** — Test passes? No other tests broken? Issue resolved?
4. **If Fix Doesn't Work** — STOP. Count attempts:
   - < 3 attempts: Return to Phase 1 with new information
   - **≥ 3 attempts: Question the architecture** (see below)

### When 3+ Fixes Fail: Question Architecture

**Pattern indicating architectural problem:**

- Each fix reveals new shared state/coupling/problem in different place
- Fixes require "massive refactoring" to implement
- Each fix creates new symptoms elsewhere

**STOP and question fundamentals:**

- Is this pattern fundamentally sound?
- Are we sticking with it through sheer inertia?
- Should we refactor architecture vs. continue fixing symptoms?

Discuss with the user before attempting more fixes.

## Defense-in-Depth Validation

After fixing a root cause, validate at EVERY layer data passes through:

| Layer                     | Purpose                                 | Example                                        |
| ------------------------- | --------------------------------------- | ---------------------------------------------- |
| **Entry Point**           | Reject invalid input at API boundary    | `if (!dir) throw new Error('dir required')`    |
| **Business Logic**        | Ensure data makes sense for operation   | `if (!projectDir) throw 'projectDir required'` |
| **Environment Guard**     | Prevent dangerous operations in context | Refuse git init outside tmpdir in tests        |
| **Debug Instrumentation** | Capture context for forensics           | Log directory, cwd, stack before operation     |

Single validation: "We fixed the bug." Multiple layers: "We made the bug impossible."

## Condition-Based Waiting (for flaky tests)

Replace arbitrary delays with condition polling:

```typescript
// ❌ Guessing at timing
await new Promise((r) => setTimeout(r, 50));

// ✅ Waiting for actual condition
await waitFor(() => getResult() !== undefined);
```

| Scenario       | Pattern                                              |
| -------------- | ---------------------------------------------------- |
| Wait for event | `waitFor(() => events.find(e => e.type === 'DONE'))` |
| Wait for state | `waitFor(() => machine.state === 'ready')`           |
| Wait for count | `waitFor(() => items.length >= 5)`                   |

Generic polling implementation:

```typescript
async function waitFor<T>(
  condition: () => T | undefined | null | false,
  description: string,
  timeoutMs = 5000,
): Promise<T> {
  const startTime = Date.now();
  while (true) {
    const result = condition();
    if (result) return result;
    if (Date.now() - startTime > timeoutMs)
      throw new Error(`Timeout: ${description} after ${timeoutMs}ms`);
    await new Promise((r) => setTimeout(r, 10));
  }
}
```

## Red Flags — STOP and Follow Process

If you catch yourself thinking:

- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- "One more fix attempt" (when already tried 2+)
- Each fix reveals new problem in different place

**ALL of these mean: STOP. Return to Phase 1.**

## Common Rationalizations

| Excuse                                     | Reality                                                                 |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| "Issue is simple, don't need process"      | Simple issues have root causes too. Process is fast for simple bugs.    |
| "Emergency, no time for process"           | Systematic debugging is FASTER than guess-and-check thrashing.          |
| "Just try this first, then investigate"    | First fix sets the pattern. Do it right from the start.                 |
| "I see the problem, let me fix it"         | Seeing symptoms ≠ understanding root cause.                             |
| "One more fix attempt" (after 2+ failures) | 3+ failures = architectural problem. Question pattern, don't fix again. |

## Quick Reference

| Phase                 | Key Activities                                         | Success Criteria            |
| --------------------- | ------------------------------------------------------ | --------------------------- |
| **1. Root Cause**     | Read errors, reproduce, check changes, gather evidence | Understand WHAT and WHY     |
| **2. Pattern**        | Find working examples, compare                         | Identify differences        |
| **3. Hypothesis**     | Form theory, test minimally                            | Confirmed or new hypothesis |
| **4. Implementation** | Create test, fix, verify                               | Bug resolved, tests pass    |

## Integration

- **Use `/tdd`** for creating failing test case (Phase 4, Step 1)
- **Use `/verify`** before claiming the fix works
- **Use `/qa`** for final quality gate after fix is complete
