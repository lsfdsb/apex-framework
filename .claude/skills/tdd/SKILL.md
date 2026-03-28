---
name: tdd
description: Use when implementing any feature or bugfix, before writing implementation code. Also use when the user says "TDD", "test first", "red green refactor", "write tests", or when writing code that needs automated verification.
argument-hint: "[feature or behavior to test]"
allowed-tools: Read, Grep, Glob, Bash
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

## Current Context

Test runner: !`grep -m1 '"test"' package.json 2>/dev/null | head -1 || echo "No test script found"`
Test files: !`find . -name "*.test.*" -o -name "*.spec.*" 2>/dev/null | head -5 | wc -l | tr -d ' '` test files found

## RED-GREEN-REFACTOR Cycle

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

- **Use `/debug`** when a test reveals unexpected behavior
- **Use `/verify`** before claiming tests pass
- **Pairs with** systematic debugging — Phase 4 uses TDD for regression tests
