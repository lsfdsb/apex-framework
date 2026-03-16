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
