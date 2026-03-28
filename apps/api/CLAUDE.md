# api — Backend API

> Part of APEX Ops monorepo. See root CLAUDE.md for framework rules.

## Stack

- Next.js 16 Route Handlers
- @apex/database (Prisma + Neon)
- @apex/auth (Clerk JWT verification)
- @apex/webhooks (Svix)
- @apex/payments (Stripe)

## This App

- **Purpose**: REST API for dashboard + external integrations
- **Primary persona**: Alex (Developer) via API
- **Port**: 3002

## Rules

- No UI — Route Handlers only.
- Validate all inputs with zod schemas.
- Clerk JWT auth on protected endpoints.
- Webhook endpoints verify signatures.
- Return consistent JSON: `{ data, error, meta }`.
