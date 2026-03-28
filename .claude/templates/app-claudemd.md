# {{APP_NAME}} — {{APP_TITLE}}

> Part of {{PROJECT_NAME}} monorepo. See root CLAUDE.md for framework rules.

## Stack

- Next.js 16 App Router + Turbopack
- @apex/design-system ({{PALETTE}} palette)
- @apex/config (shared env + constants)

## This App

- **Purpose**: {{APP_PURPOSE}}
- **Primary persona**: {{PERSONA}}
- **Palette**: {{PALETTE}}
- **Port**: {{PORT}}

## Rules

- Server Components by default. `'use client'` only for interactivity.
- All request APIs async: `await cookies()`, `await headers()`.
- Use `proxy.ts` instead of `middleware.ts` (Next.js 16).
- Import from `@apex/design-system`, not local duplicates.
- Design tokens only — never hardcode colors.

## Testing

- Unit: Vitest. Integration: Next.js test client. E2E: Playwright.
- `npm test` runs all tests for this app.
