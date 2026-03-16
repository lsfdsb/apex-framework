# SQL Practices — Detailed Reference

## Index Strategy Decision Matrix

| Query Pattern | Index Type | Example |
|--------------|-----------|---------|
| Exact match (WHERE x = ?) | B-tree (default) | `CREATE INDEX ON users(email)` |
| Range (WHERE x > ?) | B-tree | `CREATE INDEX ON orders(created_at)` |
| Text search (WHERE x LIKE 'abc%') | B-tree (prefix only) | `CREATE INDEX ON products(name text_pattern_ops)` |
| Full text search | GIN | `CREATE INDEX ON articles USING gin(to_tsvector('english', body))` |
| JSON queries | GIN | `CREATE INDEX ON events USING gin(metadata jsonb_path_ops)` |
| Geospatial | GiST | `CREATE INDEX ON locations USING gist(coordinates)` |
| Multiple columns | Composite | `CREATE INDEX ON orders(user_id, status, created_at)` |
| Partial (filtered) | Partial B-tree | `CREATE INDEX ON orders(status) WHERE status = 'pending'` |

**Composite index rule**: Column order matters. Put equality columns first, then range columns.
```sql
-- For: WHERE user_id = ? AND created_at > ?
CREATE INDEX ON orders(user_id, created_at);  -- ✅ equality first, range second
CREATE INDEX ON orders(created_at, user_id);  -- ❌ wrong order
```

## Reading EXPLAIN ANALYZE

```
Seq Scan on orders  (cost=0.00..1234.00 rows=50000 width=100) (actual time=0.01..45.23 rows=50000 loops=1)
```

| Field | Meaning | Action |
|-------|---------|--------|
| Seq Scan | Full table scan | Add an index |
| Index Scan | Using an index | Good |
| Bitmap Scan | Using index + heap | Acceptable for medium selectivity |
| cost= | Estimated cost | Lower is better |
| rows= | Estimated row count | Compare to actual rows |
| actual time= | Real execution time (ms) | Target: <50ms for simple, <200ms complex |
| loops= | Times this node ran | High loops = possible N+1 |

**Red flags in EXPLAIN**:
- `Seq Scan` on table >10K rows → needs index
- `Nested Loop` with high `loops` count → N+1 pattern
- `Sort` with `external merge` → needs more work_mem or index

## Drizzle ORM Patterns

```typescript
// Schema definition with proper types and indexes
import { pgTable, uuid, text, timestamp, index, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
  activeIdx: index('idx_users_active').on(table.isActive).where(table.isActive.equals(true)),
}));

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: text('status', { enum: ['pending', 'processing', 'completed', 'cancelled'] }).notNull(),
  total: integer('total').notNull(), // Store in cents, not dollars
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('idx_orders_user_id').on(table.userId),
  statusIdx: index('idx_orders_status').on(table.status),
  createdIdx: index('idx_orders_created').on(table.createdAt.desc()),
}));
```

## Supabase RLS Template

```sql
-- Standard RLS template for any user-owned table
ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;

-- Authenticated users: read own data
CREATE POLICY "select_own" ON [table_name]
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users: insert own data
CREATE POLICY "insert_own" ON [table_name]
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users: update own data
CREATE POLICY "update_own" ON [table_name]
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users: delete own data
CREATE POLICY "delete_own" ON [table_name]
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Service role: bypass RLS (for server-side operations)
-- This is automatic — service_role key bypasses RLS by default
```

## Supabase RLS — Multi-Tenant Pattern

```sql
-- Organization-scoped access via memberships table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_select" ON projects
  FOR SELECT TO authenticated
  USING (
    org_id IN (
      SELECT org_id FROM memberships
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "org_insert" ON projects
  FOR INSERT TO authenticated
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM memberships
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );
```

## Supabase RLS — Role-Based Pattern

```sql
-- Admin bypass + user-scoped access
ALTER TABLE sensitive_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all" ON sensitive_data
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "user_select_own" ON sensitive_data
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
```

## Supabase Storage Policies

```sql
-- Users can upload to their own folder
CREATE POLICY "upload_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can read their own files
CREATE POLICY "read_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Public read access to public bucket
CREATE POLICY "public_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'public');
```

## Supabase Realtime — Enable on Tables

```sql
-- Enable realtime for a specific table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable realtime for multiple tables
ALTER PUBLICATION supabase_realtime ADD TABLE messages, notifications, presence;
```

## Supabase Connection Pooling

```
# Direct connection (migrations, schema changes)
# Port 5432 — use for: supabase db push, drizzle-kit push
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# Pooled connection (API routes, short-lived queries)
# Port 6543 — use for: application queries, server actions
DATABASE_URL=postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

## Migration Template — Complete

```sql
-- supabase/migrations/YYYYMMDDHHMMSS_description.sql

-- 1. Create table with standard columns
CREATE TABLE IF NOT EXISTS public.table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- domain columns here
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexes on FKs and frequent queries
CREATE INDEX idx_table_name_user_id ON public.table_name(user_id);

-- 3. RLS
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own" ON public.table_name
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own" ON public.table_name
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own" ON public.table_name
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own" ON public.table_name
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 4. updated_at trigger (reuse shared function)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.table_name
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Enable realtime (if needed)
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.table_name;
```
