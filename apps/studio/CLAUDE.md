# studio — Database Studio

> Part of APEX Ops monorepo. See root CLAUDE.md for framework rules.

## Stack

- Prisma Studio
- @apex/database (shared schema)

## This App

- **Purpose**: Visual database browser and editor
- **Port**: 5555

## Rules

- Read-only in production. Write access only in development.
- Never expose publicly — local/internal use only.
