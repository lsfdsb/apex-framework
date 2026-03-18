---
name: architecture
description: Design or review system architecture. Use when the user asks to architect, design a system, plan the stack, database design, schema, API design, system diagram, or when making structural decisions. Use after PRD approval before implementation.
argument-hint: "[system-name]"
context: fork
agent: Plan
---

# System Architecture

ultrathink

Design systems that are simple, scalable, and maintainable. Every decision must be justified.

You are designing: $ARGUMENTS

## Process

1. **Extract requirements** from PRD: user count, data volume, read/write ratio, latency, availability, compliance.

2. **Select architecture**:
   - <10K users: Monolith + PostgreSQL + Next.js
   - 10K-100K: Modular monolith + Redis cache + job queue
   - 100K+: Service-oriented + message queue + container orchestration

3. **Design and document** at `docs/architecture/`:

**Database Schema** — UUIDs for public IDs. Every table: created_at, updated_at. Soft deletes for user data. 3NF minimum. FKs at DB level. Indexes on FKs and frequent queries. Migrations versioned and reversible.

**API Design** — REST by default. Versioned (/api/v1/). Consistent error format. Pagination on lists. Rate limiting on all endpoints. Request validation.

**ADRs** — For every significant choice: Context, Decision, Consequences, Alternatives.

4. **Return summary** of architecture decisions and any trade-offs for user review.

## Production Observability

Every app must ship with error tracking on day one. If it breaks in prod and nobody knows, it's not production-ready.

| Concern | Tool | Why |
|---------|------|-----|
| **Error tracking** | Sentry (`@sentry/nextjs`) | Free tier covers most projects. Auto-captures errors, performance, replays. |
| **Analytics** | Vercel Analytics or Plausible | Privacy-first, no cookie banner needed. Vercel is zero-config for Next.js. |
| **Performance** | Vercel Speed Insights or `web-vitals` library | Core Web Vitals monitoring in production. |
| **Logging** | Structured JSON logs | Never `console.log` in production. Use `pino` or framework logger. |
| **Uptime** | Health endpoint + external monitor | `/api/health` returns 200 + DB connectivity check. |

### Health Endpoint Pattern
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check critical dependencies (DB, cache, etc.)
    // await db.query('SELECT 1')
    return NextResponse.json({ status: 'healthy', timestamp: new Date().toISOString() })
  } catch {
    return NextResponse.json({ status: 'unhealthy' }, { status: 503 })
  }
}
```

### Setup Order
1. Sentry — first dependency after framework setup (catches everything from day one)
2. Health endpoint — deploy with v1, wire to uptime monitor
3. Analytics — add when first users arrive
4. Performance monitoring — add before scaling
