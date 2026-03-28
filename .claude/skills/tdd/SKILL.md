---
name: tdd
description: Use when implementing any feature or bugfix, before writing implementation code. Also use when the user says "TDD", "test first", "red green refactor", "write tests", or when writing code that needs automated verification.
argument-hint: "[feature or behavior to test]"
allowed-tools: Read, Grep, Glob, Bash, Agent
---

# Test-Driven Development — The Creed

> "Never ship untested code. This is the Way."

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Write code before the test? Delete it. Start over.

**No exceptions:**
- Don't keep it as "reference"
- Don't "adapt" it while writing tests
- Don't look at it
- Delete means delete

**Violating the letter of the rules is violating the spirit of the rules.**

## Execution Mode: Isolated Agents

TDD in APEX uses **isolated subagents** to prevent implementation from bleeding into test logic. This is the critical architectural pattern from the Claude Code Mastery Guide — when test-writing and implementation happen in the same context, tests become rubber stamps.

```
Main Session (you — the orchestrator)
│
├── @tdd-red    → Writes FAILING tests (cannot see implementation)
├── @tdd-green  → Writes MINIMUM code (cannot modify tests)
└── @tdd-refactor → Cleans up (must keep tests green)
```

### The Orchestration Flow

For each behavior/requirement in the spec:

#### Step 1: RED — Dispatch @tdd-red

```
Invoke @tdd-red: "Write failing tests for: [feature/behavior].
Spec: [paste relevant spec section or requirements].
Test conventions: [test runner, file location pattern, mock patterns]."
```

**Review the output:**
- Confirm tests were written (check the test file exists)
- Confirm tests FAIL (check the test output)
- If tests pass → something is wrong. Re-dispatch with clarification.

#### Step 2: GREEN — Dispatch @tdd-green

```
Invoke @tdd-green: "Make these failing tests pass: [test file path].
Read the test file to understand expected behavior.
Follow existing codebase patterns for implementation."
```

**Review the output:**
- Confirm ALL tests pass (check the test output)
- Confirm implementation is minimal (no gold-plating)
- If tests still fail → re-dispatch with the error output.

#### Step 3: REFACTOR — Dispatch @tdd-refactor

```
Invoke @tdd-refactor: "Refactor the implementation in [file paths]
while keeping [test file] green. Focus on: [specific concerns if any]."
```

**Review the output:**
- Confirm tests still pass after refactoring
- Confirm no new functionality was added
- If tests broke → revert and re-dispatch.

#### Step 4: Commit

```bash
git add [test files] [implementation files]
git commit -m "feat(scope): [what was implemented]"
```

#### Step 5: Repeat

Next behavior/requirement → back to Step 1 with @tdd-red.

### When to Use Direct Mode (No Agents)

For **trivial changes** (single test, one-line fix), you may run TDD directly without agents:
- Bug fix with one test case
- Adding a single edge case test to existing code
- The change is < 10 lines total

Even in direct mode, the Iron Law applies: failing test FIRST, then implementation.

## Current Context

Test runner: !`grep -m1 '"test"' package.json 2>/dev/null | head -1 || echo "No test script found"`
Test files: !`find . -name "*.test.*" -o -name "*.spec.*" 2>/dev/null | head -5 | wc -l | tr -d ' '` test files found

## RED-GREEN-REFACTOR Reference

### RED — Write Failing Test

Write ONE minimal test showing what should happen.

```typescript
// ✅ GOOD: Clear name, tests real behavior, one thing
test('retries failed operations 3 times', async () => {
  let attempts = 0;
  const operation = () => {
    attempts++;
    if (attempts < 3) throw new Error('fail');
    return 'success';
  };
  const result = await retryOperation(operation);
  expect(result).toBe('success');
  expect(attempts).toBe(3);
});

// ❌ BAD: Vague name, tests mock not code
test('retry works', async () => {
  const mock = jest.fn().mockRejectedValueOnce(new Error())
    .mockResolvedValueOnce('success');
  await retryOperation(mock);
  expect(mock).toHaveBeenCalledTimes(2);
});
```

**Requirements:** One behavior. Clear name. Real code (no mocks unless unavoidable).

### Verify RED — Watch It Fail (MANDATORY)

```bash
npm test path/to/test.test.ts
```

Confirm: Test fails (not errors). Failure is expected. Fails because feature is missing (not typos).

**Test passes?** You're testing existing behavior. Fix test.
**Test errors?** Fix error, re-run until it fails correctly.

### GREEN — Minimal Code

Write the SIMPLEST code to pass the test. Don't add features, refactor other code, or "improve" beyond the test.

### Verify GREEN (MANDATORY)

```bash
npm test path/to/test.test.ts
```

Confirm: Test passes. Other tests still pass. No warnings.

**Test fails?** Fix code, not test.

### REFACTOR — Clean Up

After green only: remove duplication, improve names, extract helpers.
Keep tests green. Don't add behavior.

### Repeat

Next failing test for next feature.

## Testing Anti-Patterns

### Never Test Mock Behavior

```typescript
// ❌ BAD: Testing that the mock exists
test('renders sidebar', () => {
  render(<Page />);
  expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
});

// ✅ GOOD: Test real component
test('renders sidebar', () => {
  render(<Page />);
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});
```

### Never Add Test-Only Methods to Production Code

```typescript
// ❌ BAD: destroy() only used in tests
class Session {
  async destroy() { /* cleanup */ }
}

// ✅ GOOD: Test utilities handle cleanup
// In test-utils/
export async function cleanupSession(session: Session) { /* cleanup */ }
```

### Never Mock Without Understanding

Before mocking any method:
1. What side effects does the real method have?
2. Does this test depend on any of those side effects?
3. Do I fully understand what this test needs?

Mock at the LOWEST level needed. Preserve side effects the test depends on.

### Never Use Incomplete Mocks

Mock the COMPLETE data structure as it exists in reality, not just fields your immediate test uses. Partial mocks hide structural assumptions and fail silently at integration.

## Example: Bug Fix with TDD

**Bug:** Empty email accepted

**RED:**
```typescript
test('rejects empty email', async () => {
  const result = await submitForm({ email: '' });
  expect(result.error).toBe('Email required');
});
```

**Verify RED:** `FAIL: expected 'Email required', got undefined`

**GREEN:**
```typescript
function submitForm(data: FormData) {
  if (!data.email?.trim()) return { error: 'Email required' };
  // ...
}
```

**Verify GREEN:** `PASS`

**REFACTOR:** Extract validation for multiple fields if needed.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |
| "I'll test after" | Tests passing immediately prove nothing. |
| "Tests after achieve same goals" | Tests-after = "what does this do?" Tests-first = "what should this do?" |
| "Deleting X hours is wasteful" | Sunk cost fallacy. Keeping unverified code is tech debt. |
| "TDD will slow me down" | TDD is faster than debugging. |
| "Keep as reference" | You'll adapt it. That's testing after. Delete means delete. |
| "Need to explore first" | Fine. Throw away exploration, start with TDD. |

## Red Flags — STOP and Start Over

- Code before test
- Test passes immediately (testing existing behavior)
- Can't explain why test failed
- "Just this once"
- "I already manually tested it"
- "This is different because..."

**All of these mean: Delete code. Start over with TDD.**

## Verification Checklist

Before marking work complete:

- [ ] Every new function/method has a test
- [ ] Watched each test fail before implementing
- [ ] Each test failed for expected reason
- [ ] Wrote minimal code to pass each test
- [ ] All tests pass
- [ ] Tests use real code (mocks only if unavoidable)
- [ ] Edge cases and errors covered

Can't check all boxes? You skipped TDD. Start over.

## Integration

- **Uses** `@tdd-red`, `@tdd-green`, `@tdd-refactor` agents for isolated execution
- **Use `/debug`** when a test reveals unexpected behavior
- **Use `/verify`** before claiming tests pass
- **Pairs with** `/spec-create` — specs define WHAT, tests define WHEN IT'S DONE
- **Pairs with** systematic debugging — Phase 4 uses TDD for regression tests
