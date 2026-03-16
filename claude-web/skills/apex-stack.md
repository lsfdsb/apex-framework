---
name: apex-stack
description: Our verified, performant tech stack for building web apps mobile-first. Auto-loads when starting new projects or when discussing tech stack, tools, dependencies, or setup. If the user already has a project with an existing stack, adapt to it instead of forcing ours. Only use official, verified libraries.
user-invocable: false
---

# APEX Stack — Verified & Performant

## Rule #1: Adapt First
If the user already has a project with an existing stack, **adapt to it**. Don't force our defaults. Read their package.json, requirements.txt, or equivalent first. Our stack is for new projects only.

## The APEX Default Stack (New Projects)

Chosen for: performance, AI-tool compatibility, mobile-first, security, and DX.

### Development Environment (macOS)
- **Terminal**: iTerm2 (native split panes for Agent Teams) or built-in Terminal
- **Editor**: VS Code + Claude Code extension (launch with `code .`, then open Claude in terminal)
- **Claude Code**: Native installer (no Node.js required, auto-updates)
- **Preview**: `npm run dev` → localhost:3000 (Next.js hot reload)
- **Deployment**: Vercel (zero-config for Next.js, edge functions, preview deploys per PR)
- **Version Control**: Git + GitHub (PR-based workflow)

### Frontend
- **Framework**: Next.js 15+ (App Router, React Server Components, Edge Functions)
  - WHY: Largest ecosystem, best AI-tool compatibility, built-in performance (code splitting, image optimization, streaming SSR)
- **Language**: TypeScript (strict mode)
  - WHY: Catches bugs at compile time, self-documenting, best AI code generation
- **Styling**: Tailwind CSS 4+
  - WHY: Utility-first, no CSS-in-JS runtime cost, mobile-first by default, purges unused styles
- **Components**: shadcn/ui (copy-paste, not dependency — you own the code)
  - WHY: Accessible, customizable, no version lock-in, built on Radix primitives
- **Icons**: Lucide React
  - WHY: Tree-shakeable, consistent, open source

### Backend (included in Next.js)
- **API**: Next.js Route Handlers + Server Actions
  - WHY: Full-stack in one framework, type-safe, edge-deployable
- **Validation**: Zod
  - WHY: TypeScript-first schema validation, works client and server, tiny bundle

### Database & Auth
- **Database**: Supabase (PostgreSQL + real-time + storage + edge functions)
  - WHY: Open source, generous free tier, built-in Row Level Security, real-time subscriptions, file storage
  - ALTERNATIVE: Neon (serverless PostgreSQL) if you don't need real-time
- **ORM**: Drizzle ORM
  - WHY: Type-safe, SQL-like syntax (not magic), lightweight, no runtime overhead
  - ALTERNATIVE: Prisma if team prefers declarative schema
- **Auth**: Supabase Auth or NextAuth.js v5
  - WHY: OAuth providers, magic links, MFA, session management built-in

### Payments (when needed)
- **Stripe** — the only serious option for global payments
  - Use Stripe Checkout for hosted payment pages (PCI compliant out of the box)

### Email (when needed)
- **Resend** — modern email API, React Email for templates
  - WHY: Developer-first, reliable delivery, fair pricing

### Testing
- **Unit/Integration**: Vitest (Vite-native, fast, Jest-compatible API)
- **E2E**: Playwright (cross-browser, mobile viewport testing, auto-waiting)
- **Component**: Testing Library (tests user behavior, not implementation)

### Deployment Pipeline
```
Local dev → Git push → GitHub PR → Vercel Preview Deploy → Review → Merge → Vercel Production
```
Every PR gets its own preview URL automatically. No manual staging needed.

## Performance Characteristics
- Initial JS bundle: <100KB (Next.js code splitting + Tailwind purge)
- LCP: <1.5s (Server Components + streaming SSR)
- Mobile-first: Tailwind breakpoints start at 320px
- Edge-deployed: Vercel Edge Network (global, <50ms TTFB)

## Security Characteristics
- TypeScript strict: catches null/undefined at compile time
- Zod validation: server-side input validation by default
- Supabase RLS: database-level access control
- Next.js: CSRF protection, secure headers, no XSS in Server Components
- Vercel: automatic HTTPS, DDoS protection

## Only Official Libraries
We ONLY install packages that are:
1. Published by the official maintainer (npm verified publisher)
2. Actively maintained (commit in last 6 months)
3. No known critical CVEs (`npm audit`)
4. Licensed under MIT, Apache 2.0, or BSD
5. TypeScript types included or via @types/
