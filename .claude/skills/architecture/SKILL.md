---
name: architecture
description: Design or review system architecture. Use when the user asks to architect, design a system, plan the stack, database design, schema, API design, system diagram, or when making structural decisions. Use after PRD approval before implementation.
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
