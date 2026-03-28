# app — Control Plane Dashboard

> Part of APEX Ops monorepo. See root CLAUDE.md for framework rules.

## Stack

- Next.js 16 App Router + Turbopack
- @apex/design-system (saas-blue palette)
- @apex/auth (Clerk)
- @apex/database (Prisma + Neon)
- @apex/analytics, @apex/observability

## This App

- **Purpose**: Dashboard for managing APEX-powered projects
- **Primary persona**: Alex (Developer)
- **Palette**: saas-blue
- **Port**: 3001
- **Auth**: All `/dashboard/*` routes require Clerk auth

## Rules

- Server Components by default.
- All request APIs async.
- Design tokens only.
- Data access via `@apex/database` service layer, never direct Prisma in components.
- Protected routes use Clerk `auth()` in Server Components.
