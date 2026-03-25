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

**Persona → Page Mapping** — REQUIRED. Create a table mapping every page/view to its primary persona from the PRD. This prevents mixing management views (dashboards, KPIs, reports) with operational views (queues, tasks, kanban) on the same page. Each page serves ONE primary persona.

```markdown
## Page → Persona Map
| Route | Page | Primary Persona | View Type | Key Components |
|-------|------|----------------|-----------|----------------|
```

**RULE**: If a page serves two personas, split it into two views. A CEO dashboard is NOT an agent's workspace. Review this table with the user before implementation begins.

**Database Schema** — UUIDs for public IDs. Every table: created_at, updated_at. Soft deletes for user data. 3NF minimum. FKs at DB level. Indexes on FKs and frequent queries. Migrations versioned and reversible.

**API Design** — REST by default. Versioned (/api/v1/). Consistent error format. Pagination on lists. Rate limiting on all endpoints. Request validation.

**Integration Architecture** — For each external integration identified in the PRD:
1. Confirm API docs have been verified via WebSearch
2. Document: auth method, rate limits, webhook patterns, error handling
3. Design service abstraction layer (never call external APIs directly from components)
4. Plan for mock/test mode that doesn't hit real APIs

**Component Audit** — REQUIRED before any build starts.

Before designing the component tree, **search the existing codebase** for reusable components:
```bash
# Search existing components
grep -r "export.*function\|export default" src/components/ 2>/dev/null | head -30
# Search DNA starters for promotable components
ls docs/design-dna/starters/primitives/ docs/design-dna/starters/patterns/ docs/design-dna/starters/layout/ 2>/dev/null
# Search for potential duplicates
grep -r "export function" src/components/ 2>/dev/null | awk -F: '{print $2}' | sort
```

For each component in the tree, mark it as: **[exists]** (reuse as-is), **[extend]** (add props/variants), **[promote]** (copy from DNA starter and adapt), or **[new]** (build from scratch). The goal is to minimize [new] — every new component is a maintenance burden.

Component tree format:
```markdown
## Component Tree
### Shared Components (used by 2+ pages)
| Component | Used By | Props | Design DNA Reference |
|-----------|---------|-------|---------------------|
| PageHeader | All pages | label, title, description | apex-label + heading pattern |
| StatCard | Dashboard, Analytics | label, value, sub, spark | crm.html KPI card |
| DataTable | Contacts, Invoices | columns, data, pagination | crm.html data table |
| FilterBar | Contacts, Pipeline | filters, activeFilters | crm.html filter bar |
| SidebarNav | All app pages | items, active | crm.html sidebar |

### Page-Specific Components
| Component | Page | Why Not Shared |
|-----------|------|---------------|
| PipelineKanban | Pipeline | Unique drag-drop behavior |
| ConversationView | Queue | Channel-specific rendering |
```

**Rules:**
- If a pattern appears on 2+ pages, it MUST be a shared component
- Every shared component references a specific Design DNA section
- Builder agents MUST search for existing components before creating new ones
- The component tree is reviewed BEFORE implementation begins

**Mobile-First + Dark/Light Mode** — REQUIRED from architecture phase:
- ALL layouts designed mobile-first (320px → 1440px)
- Dark mode is the default; light mode must be designed simultaneously
- Use CSS custom properties / Tailwind semantic tokens (never raw colors)
- Breakpoints: 640, 768, 1024, 1280 (defined in design-system skill)
- Test at minimum: 320px, 768px, 1280px + both themes

**ADRs** — For every significant choice: Context, Decision, Consequences, Alternatives.

4. **Produce Dependencies Manifest** — append to the architecture doc at `docs/architecture/`:

```markdown
## Dependencies Manifest

### Packages (npm/pip)
| Package | Version | Purpose | Required |
|---------|---------|---------|----------|
| react | ^19.0.0 | UI framework | yes |

### APIs (external)
| API | Endpoint | Auth | Purpose |
|-----|----------|------|---------|
| Supabase | SUPABASE_URL | API key | Database |

### Environment Variables
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| SUPABASE_URL | yes | — | Database URL |

### Database Tables
| Table | Purpose | Migration |
|-------|---------|-----------|
| users | User accounts | 001_create_users.sql |

### Internal Dependencies
| Component | Depends On | Type |
|-----------|-----------|------|
| AuthPage | useAuth hook | import |
```

Fill every row with the actual packages, APIs, env vars, tables, and internal imports this system requires. This manifest is the contract QA uses to verify the build — incomplete rows block QA.

5. **Return summary** of architecture decisions, the persona→page map, component tree, and any trade-offs for user review. Explicitly list any integrations that still need API verification via WebSearch.

**Persona→Page Gate** — Before presenting the summary, scan every row in the Page→Persona Map:
- If ANY page has no primary persona assigned → **BLOCK**: ask the user to assign a primary persona to that page before proceeding.
- If two or more personas share the same page without explicit justification in the PRD → **BLOCK**: ask the user to either split the page into two views or point to the PRD section that justifies the shared view.

Do not proceed to implementation until the persona→page map is complete and conflict-free.

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

## Payments
When the app needs payments:
- Use Stripe. Verify API version with /research first.
- Stripe Checkout for simple, Stripe Elements for custom UI
- NEVER store card numbers. NEVER process without Stripe SDK.
- Webhook: always verify stripe-signature header
- Test mode first with test keys and test cards (4242...)

## Transactional Email
When the app sends email:
- Use Resend or Postmark + React Email for templates
- Send from subdomain (mail.yourapp.com) on day one
- Required: unsubscribe link, physical address (CAN-SPAM), plain-text version

## Analytics & Privacy
- Vercel Analytics or Plausible (privacy-first, no cookie banner)
- NEVER Google Analytics unless specifically requested (requires EU cookie consent)
- Event naming: noun_verb (project_created, plan_upgraded)
- Respect Do Not Track header

## Phase Transition
After presenting the architecture, ask the user: "Approve this blueprint?"

When the user approves, the Lead agent MUST immediately proceed to Phase 3 (Decompose) by spawning the Project Manager agent. Do NOT wait for the user to ask — the pipeline is autonomous. Announce:
```
⚔️ Phase 3: Decompose — "I have spoken."
```
Then spawn the PM agent with `Agent({ subagent_type: "project-manager" })`, passing the PRD and Architecture as context. The PM will create the phased task board (P0/P1/P2) with acceptance criteria, test plans, and DRI assignments.
