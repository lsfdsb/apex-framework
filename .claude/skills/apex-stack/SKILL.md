---
name: apex-stack
description: Performance-obsessed stack selection engine. Researches and recommends the best tools for each project based on current benchmarks, not dogma. Auto-loads when starting new projects or discussing tech stack. Adapts to existing projects. Only official, verified libraries.
user-invocable: false
---

# APEX Stack — Performance & Quality Above All

> "Premature optimization is the root of all evil, but premature tool loyalty is worse." — The Creed

## Rule #1: Adapt First

If the user already has a project with an existing stack, **adapt to it**. Read their package.json, requirements.txt, Cargo.toml, or equivalent first. Improve what they have — don't replace it.

## Rule #2: No Fixed Stack

APEX does not prescribe a fixed set of tools. Every recommendation must be **earned** through:

1. **Performance benchmarks** — fastest build, smallest bundle, lowest latency
2. **Quality guarantees** — type safety, testing support, security defaults
3. **Active maintenance** — recent commits, responsive maintainers, no critical CVEs
4. **Community validation** — production use at scale, not hype-driven adoption

If a better tool exists today than what we recommended yesterday, we switch. No loyalty to tools — only loyalty to performance and quality.

## Rule #3: Verify Before Recommending

Before recommending ANY stack for a new project, **verify current versions**:

```bash
npm view [package] version
```

And **WebFetch official docs** to confirm the tool still works as expected:
```
WebFetch("https://[official-docs-url]")
```

Never recommend from memory alone. The ecosystem moves fast. Verify.

## Stack Selection Process

When starting a new project, follow this decision tree:

### Step 1: Understand the Project

Ask or infer:
- **Type**: SPA, SSR, static site, API, mobile, CLI, library?
- **Scale**: Prototype, MVP, production, enterprise?
- **Users**: Consumer (mobile-first), internal tool, B2B dashboard?
- **Real-time**: Chat, live data, collaborative editing?
- **Auth**: Social login, enterprise SSO, magic links?
- **Data**: CRUD, analytics, search, file storage?

### Step 2: Apply Performance Principles

Every choice must satisfy these non-negotiable targets:

| Metric | Target | Why |
|---|---|---|
| LCP | < 1.5s | Users abandon after 2s |
| FID/INP | < 100ms | Perceived responsiveness |
| CLS | < 0.1 | Visual stability |
| JS Bundle | < 100KB initial | Mobile networks are slow |
| TTFB | < 200ms | Edge deployment mandatory |
| Build time | < 30s | Fast iteration = better code |
| Cold start | < 100ms | Serverless tax must be minimal |

### Step 3: Select by Category

Current ecosystem leaders verified from npm registry (March 2026). **Always re-verify with `npm view` and /research before recommending.**

#### Language
- **TypeScript** (strict mode) — non-negotiable for any JS/TS project
  - Catches bugs at compile time, self-documenting, best AI code generation

#### Framework (pick based on project type)

| Use case | Current leader | Version | Why | Alternatives to evaluate |
|----------|---------------|---------|-----|------------------------|
| **SSR/Full-stack** | Next.js | 16.x | App Router, React Server Components, mature ecosystem | SvelteKit, Nuxt, Astro |
| **SPA** | React + Vite | — | Fastest dev server, HMR, tree-shaking | Svelte, Solid |
| **Static/Content** | Astro | — | Zero JS by default, partial hydration | Eleventy |
| **API-only** | Hono | — | Edge-native, ultra-fast, tiny | Fastify, Express |
| **Mobile** | React Native + Expo | — | One codebase, native performance | Flutter |

#### Styling
- **Tailwind CSS v4** — utility-first, zero runtime cost, mobile-first, purges unused styles
  - v4 is stable (4.2.x). Major changes from v3: new engine, CSS-first config, faster builds.
  - Still the performance leader. No CSS-in-JS runtime overhead.

#### Components
- **shadcn/ui** — copy-paste (you own the code), accessible, Radix primitives
  - No version lock-in, no dependency bloat, fully customizable

#### Database

| Use case | Recommendation | Why |
|----------|---------------|-----|
| Most apps | PostgreSQL (via Supabase) | Auth + DB + realtime + storage in one |
| Edge-first | SQLite (via Turso/libSQL) | Low-latency reads, globally distributed |
| Caching | Redis (via Upstash) | Serverless, edge-compatible |

Supabase remains the leading BaaS — combines PostgreSQL, auth, realtime, storage, and edge functions in one platform with a generous free tier.

#### ORM / Query Builder

| Tool | Version | Strengths | Best for |
|------|---------|-----------|----------|
| Drizzle ORM | 0.45.x | Type-safe, SQL-like, lightweight, fast queries | New projects, performance-critical |
| Prisma | 7.x | Mature, great migrations, rich ecosystem | Existing Prisma projects, complex schemas |

Both are actively maintained. Drizzle has lower runtime overhead and generates cleaner SQL. Prisma has better migration tooling and a larger ecosystem. Choose based on project needs.

#### Auth
- **Supabase Auth** — for Supabase projects (built-in, zero extra deps)
- **Auth.js (NextAuth)** — for Next.js without Supabase
- **Clerk** — for fast-to-market with prebuilt components
- Evaluate based on: provider coverage, MFA support, session handling, pricing

#### Validation

| Tool | Version | Bundle (gzip) | Best for |
|------|---------|---------------|----------|
| **Valibot** | 1.3.x | ~1KB (tree-shakeable) | New projects — smaller, faster, actively maintained |
| **Zod** | 4.3.x | ~13KB | Existing Zod projects — mature ecosystem, v4 improved perf |

Valibot has gained momentum with smaller bundle and faster compilation. Zod remains solid for existing projects. For new projects where bundle size matters, prefer Valibot.

#### Testing
- **Unit/Integration**: Vitest — fast, Vite-native, Jest-compatible
- **E2E**: Playwright — cross-browser, mobile viewports, auto-waiting
- **Component**: Testing Library — tests behavior, not implementation

#### Linting & Formatting

| Tool | Version | Speed | What it replaces |
|------|---------|-------|-----------------|
| Biome | 2.x | ~100x faster than ESLint | ESLint + Prettier in one tool |
| Oxlint | 1.x | Fastest linter available | ESLint (lint only, no formatting) |
| ESLint + Prettier | — | Slowest but most mature | Legacy, still works fine |

**Recommendation**: Biome for new projects (replaces both ESLint and Prettier). ESLint + Prettier for existing projects that already use them.

#### Package Manager

| Tool | Speed | Disk usage | Notes |
|------|-------|-----------|-------|
| pnpm | Fast | Efficient (content-addressable) | Best for monorepos |
| bun | Fastest install | Standard | Also a runtime |
| npm | Standard | Standard | Universal, zero setup |

**Recommendation**: pnpm for most projects. npm if simplicity matters more.

#### Deployment

| Platform | Best for | Key advantage |
|----------|---------|--------------|
| Vercel | Next.js projects | Zero-config, preview deploys |
| Cloudflare | Edge-first, Hono | Fastest global edge network |
| Fly.io | Containers, custom runtimes | Closest to bare metal |
| Railway | Quick deployments | Simple pricing, GitHub integration |

## Performance Characteristics (Non-Negotiable)

Every APEX app must ship with:

- **Mobile-first**: Design for 320px, scale up
- **Edge-deployed**: Global CDN, <50ms TTFB
- **Code-split**: Lazy load routes, dynamic imports for heavy components
- **Image-optimized**: WebP/AVIF, responsive srcsets, lazy loading
- **Font-optimized**: Subset, preload, font-display: swap
- **Zero layout shift**: Explicit dimensions on media, skeleton screens

## Security Characteristics (Non-Negotiable)

- TypeScript strict: catches null/undefined at compile time
- Server-side validation: never trust the client
- Database-level access control: RLS or equivalent
- HTTPS everywhere, secure headers, CSP
- No secrets in client bundles
- Dependency audit on every install

## Quality Characteristics (Non-Negotiable)

- Every feature has tests before shipping
- Every component has prop types and accessibility attributes
- Every API endpoint validates input and handles errors
- Every database query is indexed and analyzed
- Every deployment has a rollback strategy

## Only Official Libraries

We ONLY install packages that are:

1. Published by the official maintainer (npm verified publisher)
2. Actively maintained (commit in last 6 months)
3. No known critical CVEs (`npm audit`)
4. Licensed under MIT, Apache 2.0, or BSD
5. TypeScript types included or via @types/
6. Bundle size justified for the value provided

## Development Environment

- **Terminal**: Whatever the user prefers (iTerm2, Warp, Ghostty, built-in)
- **Editor**: VS Code + Claude Code extension
- **Claude Code**: Native installer (auto-updates)
- **Version Control**: Git + GitHub (PR-based workflow)
- **Preview**: Dev server with hot reload (framework-dependent)
- **Deployment**: Auto-preview per PR (platform-dependent)
