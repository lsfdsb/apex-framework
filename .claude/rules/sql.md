---
paths:
  - "**/*.sql"
  - "**/migrations/**"
  - "**/schema/**"
  - "**/drizzle/**"
  - "**/prisma/**"
---

# SQL Conventions

## Schema Decisions
- Every table: `id` (uuid PK), `created_at` (timestamptz, default now), `updated_at` (trigger).
- Soft delete with `deleted_at` for user data. Hard delete for ephemeral data only.
- Column naming: `snake_case`. Table naming: plural `snake_case` (users, order_items).
- Store money as integers (cents), never floats.
- Foreign keys: always add an index. Always set `ON DELETE` (CASCADE or SET NULL).

## Migrations
- One concern per migration. Always reversible.
- Include RLS policies and indexes in the same migration as the table.
- Test against production-like data before applying.

## Query Rules
- Always use parameterized queries. Never concatenate user input into SQL.
- Cursor-based pagination. Never OFFSET on tables >1K rows.
- Run `EXPLAIN ANALYZE` on queries touching tables >10K rows.
- Supabase: always enable RLS on tables with user data.
