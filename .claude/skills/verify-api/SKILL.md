---
name: verify-api
description: Verify any external API before integration. Auto-invoked when code references supabase, stripe, openai, anthropic, vercel, firebase, auth0, twilio, sendgrid, cloudflare, aws, resend, clerk, planetscale, neon, upstash, or any fetch() call to an external domain. Checks current auth patterns, SDK versions, deprecated keys, and security requirements against live official documentation. Can also be invoked manually with /verify-api [api-name] to verify a specific API before starting integration work.
argument-hint: "[api name or URL — e.g. supabase, stripe, openai]"
allowed-tools: WebSearch, WebFetch, Read, Grep, Glob
---

# API Verification Gate

> Born from a real incident: Supabase integration built using deprecated `anon`/`service_role` JWT keys (deprecated Nov 2025). The current pattern uses `sb_publishable_`/`sb_secret_` keys. We only caught it because CLAUDE.md rule #2 was manually enforced. This skill makes that enforcement automatic.

Before integrating ANY external API, verify current patterns against official documentation. APIs change. Authentication schemes rotate. SDK versions break. Verify first, build second.

## When This Triggers

Auto-invoked when any of the following appear in code being written or reviewed:

- Package names: `@supabase/`, `stripe`, `openai`, `@anthropic-ai/`, `firebase`, `@auth0/`, `twilio`, `@sendgrid/`, `cloudflare`, `aws-sdk`, `@aws-sdk/`, `resend`, `@clerk/`, `@planetscale/`, `@neondatabase/`, `@upstash/`
- Import patterns: `from 'stripe'`, `from 'openai'`, `createClient(` with external URLs
- Fetch calls to external domains: `fetch('https://api.`, `fetch('https://[service].`, or any hardcoded API endpoint URL
- Environment variable names that look like API keys: `SUPABASE_`, `STRIPE_`, `OPENAI_`, `ANTHROPIC_`, etc.

## Verification Protocol

### Step 1 — Check the Known Patterns Reference (below)

Start with the reference section at the bottom of this skill. If the API is listed there, check whether the "last verified" date is within 90 days. If it is, proceed with those patterns — but still run Step 2 to check for breaking changes since that date.

### Step 2 — WebSearch for Current State

Run these three searches. All three are required — the first alone is not enough because official docs don't always highlight what's deprecated.

```
WebSearch("[API name] official documentation authentication [current year]")
WebSearch("[API name] SDK changelog deprecated breaking changes [current year]")
WebSearch("[API name] security best practices API key rotation [current year]")
```

For Supabase specifically, also run:
```
WebSearch("supabase new API keys sb_publishable sb_secret migration 2025 2026")
```

### Step 3 — WebFetch the Official Docs

Fetch the official docs page for the specific integration being built. Do not rely on search snippets alone — read the actual current documentation.

```
WebFetch("https://[api-docs-url]/authentication")  # or equivalent auth page
WebFetch("https://[api-docs-url]/quickstart")       # quickstart shows current SDK patterns
```

Priority pages to fetch (SDK install + auth/keys section):

| API | Docs URL to fetch |
|-----|------------------|
| Supabase | `https://supabase.com/docs/reference/javascript/installing` |
| Stripe | `https://stripe.com/docs/api?lang=node` |
| OpenAI | `https://platform.openai.com/docs/quickstart` |
| Anthropic | `https://docs.anthropic.com/en/api/getting-started` |
| Clerk | `https://clerk.com/docs/quickstarts/nextjs` |
| Resend | `https://resend.com/docs/introduction` |

### Step 4 — Compare Against Intent

After gathering current documentation, compare against what is about to be written:

1. Is the SDK version current? Check npm for the latest published version.
2. Are the authentication patterns current? Compare key prefixes, header names, initialization patterns.
3. Are any patterns in the planned code listed as deprecated in current docs?
4. Are there required security configurations (webhook signature verification, key scoping, environment restrictions) that are missing?

### Step 5 — Output the Verification Report

Always produce this report before any integration code is written.

```markdown
## API Verification: [API Name]

**SDK Version**: [package@version] — latest as of [date]
**Auth Method**: [current pattern — e.g. "sb_publishable_ key in client, sb_secret_ on server"]
**Deprecated Patterns**: [list what must NOT be used]
**Security Notes**: [required configurations, scoping, restrictions]

### Verified Integration Template
[Minimal, working code snippet using only current patterns]
```

## Block Conditions

Integration is **blocked** — do not write the code — if any of the following are true:

1. **Deprecated auth pattern detected**: The planned code uses a key format, header, or initialization method that official docs mark as deprecated or removed. (Example: Supabase `anon`/`service_role` JWT keys post-Nov 2025.)

2. **Outdated SDK with known vulnerability**: The planned SDK version has a CVE listed in the npm audit or GitHub advisories for that package.

3. **Missing required security configuration**: The API requires webhook signature verification, key scoping, origin restrictions, or similar security controls, and the planned code omits them. (Example: Stripe webhook without `constructEvent` signature check.)

4. **Server-only secret on the client**: A key or token that must only exist on the server (secret key, service role key, private key) is being used in client-side code or exposed in a public environment variable.

When blocking, explain what the violation is, show the current correct pattern, and wait for confirmation before proceeding.

## Known APIs — Verified Patterns Reference

These patterns were verified against official documentation. The "last verified" date tells you how fresh the data is. If more than 90 days have passed, re-run the verification protocol above before using.

---

### Supabase
**Last verified**: 2026-03-24

**SDK**: `@supabase/supabase-js` v2.99+ (check `https://www.npmjs.com/package/@supabase/supabase-js` for latest)
**SSR/Next.js SDK**: `@supabase/ssr` (required for App Router — replaces deprecated `@supabase/auth-helpers-nextjs`)

**Current key format (post-Nov 2025)**:
- Client (browser-safe): `sb_publishable_[...]` — used as `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Server (secret): `sb_secret_[...]` — used as `SUPABASE_SECRET_KEY`, never in client code

**REMOVED (Nov 2025) — DO NOT USE**:
- `anon` JWT key (REMOVED Nov 2025) — previously `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` JWT key (REMOVED Nov 2025) — previously `SUPABASE_SERVICE_ROLE_KEY`

These keys are no longer accepted by Supabase. Migration to `sb_publishable_`/`sb_secret_` is mandatory.

**Current initialization pattern**:
```typescript
// Client component (browser)
import { createBrowserClient } from '@supabase/ssr'
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)

// Server component / Route Handler
import { createServerClient } from '@supabase/ssr'
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { cookies: { /* Next.js cookie adapter */ } }
)
```

**Security requirements**:
- Row Level Security (RLS) must be enabled on all tables
- `SUPABASE_SECRET_KEY` must never appear in client bundles or `NEXT_PUBLIC_` variables
- Use `sb_secret_` key only in server-side code (Route Handlers, Server Actions, middleware)

---

### Stripe
**Last verified**: 2026-03-24

**SDK**: `stripe` (server) + `@stripe/stripe-js` (client) — check npm for latest
**React**: `@stripe/react-stripe-js`

**Key format**:
- Client (browser-safe): `pk_live_[...]` or `pk_test_[...]` — used as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Server (secret): `sk_live_[...]` or `sk_test_[...]` — used as `STRIPE_SECRET_KEY`, never in client code

**Webhook signature verification — REQUIRED**:
```typescript
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// In webhook Route Handler
const sig = request.headers.get('stripe-signature')!
const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
// Never process webhook events without this check
```

**Security requirements**:
- Always verify webhook signatures with `constructEvent` — unverified webhooks are a critical vulnerability
- `STRIPE_SECRET_KEY` server-only; never in `NEXT_PUBLIC_` variables
- Use idempotency keys for payment creation to prevent duplicate charges
- Restrict webhook endpoint to Stripe IP ranges in production

---

### OpenAI
**Last verified**: 2026-03-24

**SDK**: `openai` npm package — check for latest v4.x
**Key format**: `sk-[...]` or `sk-proj-[...]` — `OPENAI_API_KEY`, server-only

**Current initialization**:
```typescript
import OpenAI from 'openai'
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Streaming (current pattern)
const stream = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: prompt }],
  stream: true,
})
```

**Security requirements**:
- API key is server-only — never expose in client code or `NEXT_PUBLIC_` variables
- Implement rate limiting on your API routes that call OpenAI
- Never pass raw user input directly to the model without sanitization or system prompt guardrails

---

### Anthropic
**Last verified**: 2026-03-24

**SDK**: `@anthropic-ai/sdk` — check npm for latest
**Key format**: `sk-ant-[...]` — `ANTHROPIC_API_KEY`, server-only

**Current initialization**:
```typescript
import Anthropic from '@anthropic-ai/sdk'
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Streaming (current pattern)
const stream = await client.messages.create({
  model: 'claude-opus-4-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: prompt }],
  stream: true,
})
```

**Security requirements**:
- API key is server-only — never expose in client code
- `max_tokens` is required — always set an explicit limit

---

### Vercel
**Last verified**: 2026-03-24

**SDK**: `@vercel/sdk` for programmatic API access
**Key format**: Project tokens via `VERCEL_TOKEN` — server-only

**Edge Config (current pattern)**:
```typescript
import { createClient } from '@vercel/edge-config'
const edgeConfig = createClient(process.env.EDGE_CONFIG)
const value = await edgeConfig.get('feature-flag')
```

**Security requirements**:
- `VERCEL_TOKEN` is server-only
- Edge Config connection strings (`ecfg_[...]`) are read-only by default — use separate tokens for write access
- Never expose deployment tokens in client bundles

---

### Resend
**Last verified**: 2026-03-24

**SDK**: `resend` npm package
**Key format**: `re_[...]` — `RESEND_API_KEY`, server-only

**Current initialization**:
```typescript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'name@yourdomain.com', // must be a verified domain
  to: recipient,
  subject: 'Subject',
  react: <EmailTemplate />,
})
```

**Security requirements**:
- Sending domain must be verified in Resend dashboard — unverified domains will be rejected
- API key is server-only; use only in Route Handlers or Server Actions
- Implement rate limiting on email-sending routes to prevent abuse

---

### Clerk
**Last verified**: 2026-03-24

**SDK**: `@clerk/nextjs` for Next.js App Router
**Key format**:
- Publishable: `pk_live_[...]` or `pk_test_[...]` — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Secret: `sk_live_[...]` or `sk_test_[...]` — `CLERK_SECRET_KEY`, server-only

**Current initialization (App Router)**:
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])
export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})
```

**Deprecated — DO NOT USE**:
- `authMiddleware` (removed in `@clerk/nextjs` v6) — use `clerkMiddleware` instead
- `withAuth` HOC pattern — use `auth()` from `@clerk/nextjs/server` in Server Components

**Security requirements**:
- `CLERK_SECRET_KEY` is server-only
- Always use `clerkMiddleware` to protect routes — never rely solely on client-side redirects

---

## If the API Is Not Listed

For any API not in the reference section above:

1. Run the full verification protocol (Steps 1–5)
2. Add the verified patterns to this reference section with today's date
3. Then proceed with integration

This keeps the reference section growing over time as new APIs are verified.
