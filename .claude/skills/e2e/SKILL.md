---
name: e2e
description: Write and run end-to-end tests with Playwright. Use when the user says "e2e", "end to end", "playwright", "browser test", "integration test", "test the flow", "test the page", or when testing complete user journeys. Every critical user flow needs an E2E test before shipping.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# E2E Testing — Test What Users Do

## Setup (if not installed)
```bash
npm install -D @playwright/test
npx playwright install
```

## Test Structure
```
tests/
└── e2e/
    ├── auth.spec.ts        # Login, logout, register
    ├── navigation.spec.ts  # Page navigation, routing
    ├── [feature].spec.ts   # One file per feature
    └── helpers/
        └── fixtures.ts     # Shared test data and helpers
```

## Writing Tests
```typescript
import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrong');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });
});
```

## Key Patterns
- Use `getByRole`, `getByLabel`, `getByText` — NOT CSS selectors. Accessible selectors = resilient tests.
- Test mobile viewport: `test.use({ viewport: { width: 375, height: 667 } })`
- Wait for network: `await page.waitForResponse('**/api/users')`
- Screenshot on failure: configured automatically by Playwright
- Parallel execution: Playwright runs tests in parallel by default

## Critical Flows to Test (minimum before shipping)
1. **Auth**: Login, logout, register, password reset
2. **Core Action**: The #1 thing users do in your app
3. **Payment** (if applicable): Checkout flow with Stripe test mode
4. **Error Recovery**: What happens when the API is down?

## Running
```bash
npx playwright test                    # All tests
npx playwright test auth.spec.ts       # Single file
npx playwright test --ui               # Interactive UI mode
npx playwright show-report             # View HTML report
```
