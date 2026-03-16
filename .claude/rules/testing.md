---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
  - "**/tests/**"
  - "**/__tests__/**"
---

# Testing Conventions

- Use `describe` blocks to group related tests. Name them after the function/component.
- Use `it` or `test` with behavior descriptions: "it should return null when input is empty"
- Arrange → Act → Assert pattern in every test.
- Mock external dependencies (API calls, database). Never mock internal logic.
- Test edge cases: null, undefined, empty string, empty array, max length, negative numbers.
- One assertion per test when possible. Multiple assertions only if testing the same behavior.
- Use `beforeEach` for shared setup. Clean up in `afterEach`.
- Name test files `[module].test.ts` next to the source file, or mirror in `tests/`.
- Minimum coverage: 80% lines, 70% branches for new code.
- Integration tests go in `tests/integration/`. E2E tests in `tests/e2e/`.
- Never test implementation details. Test behavior and outputs.
