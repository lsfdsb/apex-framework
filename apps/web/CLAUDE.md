# web — Public Showcase

> Part of APEX Ops monorepo. See root CLAUDE.md for framework rules.

## Stack

- Next.js 16 App Router + Turbopack
- @apex/design-system (creative-warm palette)
- @apex/internationalization (i18n via next-intl)
- @apex/cms (Basehub content)
- @apex/seo (metadata helpers)

## This App

- **Purpose**: Public showcase + framework docs landing
- **Primary persona**: Jordan (Visitor/Evaluator)
- **Palette**: creative-warm
- **Port**: 3000

## Rules

- Server Components by default.
- All request APIs async: `await cookies()`, `await headers()`.
- Design tokens only — never hardcode colors.
- Import from `@apex/design-system`, not local duplicates.
- Lighthouse > 90 on all pages.
- i18n: all user-facing strings via next-intl messages.
