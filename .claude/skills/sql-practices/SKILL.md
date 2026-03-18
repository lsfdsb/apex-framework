---
name: sql-practices
description: SQL and database best practices for PostgreSQL and Supabase. Auto-loads when Claude writes queries, migrations, schema changes, or works with database code. Triggers on SQL, query, database, migration, schema, index, Supabase, Drizzle, Prisma, table, SELECT, INSERT, UPDATE, JOIN, or any database operation. Our apps have zero lag — every query matters.
user-invocable: false
---

# SQL Best Practices — Every Query Matters

## Query Performance Rules

### 1. Always use indexes on:
- Primary keys (automatic)
- Foreign keys (NOT automatic — always add these)
- Columns in WHERE clauses used frequently
- Columns in ORDER BY clauses
- Columns in JOIN conditions

```sql
-- ✅ Good: index on foreign key and frequently filtered column
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status) WHERE status != 'completed';  -- partial index
CREATE INDEX idx_orders_created ON orders(created_at DESC);  -- for ORDER BY queries

-- ❌ Bad: no index on foreign key (causes full table scans on JOINs)
```

### 2. Prevent N+1 Queries
```typescript
// ❌ N+1: Fetches users, then loops to fetch orders for each
const users = await db.select().from(usersTable);
for (const user of users) {
  const orders = await db.select().from(ordersTable).where(eq(ordersTable.userId, user.id));
}

// ✅ Single query with JOIN
const usersWithOrders = await db
  .select()
  .from(usersTable)
  .leftJoin(ordersTable, eq(usersTable.id, ordersTable.userId));
```

### 3. Pagination — Always cursor-based for large datasets
```typescript
// ❌ Offset pagination: slow on large tables (scans skipped rows)
SELECT * FROM orders ORDER BY created_at OFFSET 10000 LIMIT 20;

// ✅ Cursor pagination: constant speed regardless of page
SELECT * FROM orders
WHERE created_at < $cursor_timestamp
ORDER BY created_at DESC
LIMIT 20;
```

### 4. SELECT only what you need
```sql
-- ❌ Select all columns (wastes bandwidth, prevents index-only scans)
SELECT * FROM users;

-- ✅ Select only needed columns
SELECT id, name, email FROM users WHERE active = true;
```

### 5. Use EXPLAIN ANALYZE to verify
```sql
-- Always check query plans for queries on tables >10K rows
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 'abc' AND status = 'pending';
-- Look for: Seq Scan (bad on large tables), Index Scan (good), Bitmap Scan (acceptable)
```

## Migration Best Practices

1. **Always reversible**: Every `up` migration has a `down` migration
2. **Small and focused**: One concern per migration
3. **Never delete columns in production**: Add new column → migrate data → deprecate old → remove later
4. **Use transactions**: Wrap DDL in transactions when possible
5. **Test migrations**: Run against a copy of production data before deploying

```typescript
// Drizzle migration example
export async function up(db) {
  await db.schema.alterTable('users').addColumn('avatar_url', 'text');
}
export async function down(db) {
  await db.schema.alterTable('users').dropColumn('avatar_url');
}
```

## Supabase-Specific Patterns

### Row Level Security (RLS) — Always enable
```sql
-- Enable RLS on every table with user data
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can only see their own orders
CREATE POLICY "Users see own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own orders
CREATE POLICY "Users insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Connection Pooling
- Use Supabase's built-in pgbouncer (port 6543 for pooled, 5432 for direct)
- Pooled connection for API routes (short-lived connections)
- Direct connection for migrations only

## Anti-Patterns — NEVER

- `SELECT *` in production queries
- Missing indexes on foreign keys
- Offset pagination on tables >1K rows
- String concatenation in queries (SQL injection)
- Storing JSON blobs when structured columns would work
- Missing RLS on tables with user data (Supabase)
- Running migrations without a rollback plan

For detailed index strategies and EXPLAIN ANALYZE patterns, read `reference.md` in this skill's directory.
