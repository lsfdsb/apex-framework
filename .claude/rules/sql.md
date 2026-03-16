---
paths:
  - "**/*.sql"
  - "**/migrations/**"
  - "**/schema/**"
  - "**/drizzle/**"
  - "**/prisma/**"
  - "**/supabase/**"
---

# SQL Conventions

- Every table: `id` (uuid PK), `created_at` (timestamp, default now), `updated_at` (auto-update).
- Soft delete with `deleted_at` for user-facing data. Hard delete only for ephemeral data.
- Foreign keys: always add an index. Always set `ON DELETE` behavior (CASCADE or SET NULL).
- Column naming: `snake_case`. Table naming: plural `snake_case` (users, order_items).
- Store money as integers (cents), never floats.
- Always use parameterized queries. Never concatenate user input into SQL.
- Cursor-based pagination for lists. Never OFFSET on tables >1K rows.
- Run `EXPLAIN ANALYZE` on any query touching tables >10K rows.
- Supabase: Always enable RLS on tables with user data. Write policies for SELECT, INSERT, UPDATE, DELETE.
- Migrations: one concern per file, always reversible, test against production-like data.
