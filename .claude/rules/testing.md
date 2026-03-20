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

## Framework
- Use **Vitest** for unit/integration tests, **Playwright** for E2E.
- Component tests use `@testing-library/react` — test behavior, not implementation.

## Coverage Targets
- New code: 80% lines, 70% branches minimum.
- Integration tests in `tests/integration/`. E2E in `tests/e2e/`.

## Patterns

```typescript
// Component test with RTL
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('LoginForm', () => {
  it('should show validation error for invalid email', async () => {
    render(<LoginForm />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Email'), 'invalid')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email')
  })
})
```

```typescript
// API route test
import { createMockRequest } from 'tests/helpers'

describe('POST /api/users', () => {
  it('should return 400 for invalid body', async () => {
    const req = createMockRequest({ method: 'POST', body: {} })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
```

## Rules
- Mock external deps (API, database). Never mock internal logic.
- Use `beforeEach` for shared setup. Clean up in `afterEach`.
- Test files colocated: `[module].test.ts` next to source, or mirror in `tests/`.
- Server components: test via integration tests (render the page), not unit tests.
- Async operations: always use `waitFor` or `findBy*` — never raw `setTimeout`.
