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

## Rule #3: Research Before Recommending

Before recommending ANY stack for a new project, run `/research` to verify:

- Current version and release date
- Bundle size impact (bundlephobia.com)
- Build performance benchmarks
- Known issues or breaking changes
- Comparison with alternatives

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

For each category, choose the tool that best meets the performance targets above. Here are the current leading options (as of early 2026), but **always verify with /research**:

#### Language
- **TypeScript** (strict mode) — non-negotiable for any JS/TS project
  - Catches bugs at compile time, self-documenting, best AI code generation

#### Framework (pick based on project type)
- **SSR/Full-stack**: Research current leaders (Next.js, Nuxt, SvelteKit, Astro, etc.)
- **SPA**: Research current leaders (React + Vite, Svelte, Solid, etc.)
- **Static/Content**: Research current leaders (Astro, Eleventy, etc.)
- **API-only**: Research current leaders (Hono, Fastify, Express, etc.)
- **Mobile**: Research current leaders (React Native, Expo, Flutter, etc.)

Decision criteria: bundle size, build speed, ecosystem maturity, deployment flexibility.

#### Styling
- **Tailwind CSS** — utility-first, zero runtime cost, mobile-first by default, purges unused styles
  - This remains the performance leader. No CSS-in-JS runtime overhead.

#### Components
- **shadcn/ui** — copy-paste (you own the code), accessible, Radix primitives
  - No version lock-in, no dependency bloat, fully customizable

#### Database
- Evaluate based on project needs:
  - **PostgreSQL** (via Supabase, Neon, or self-hosted) — for most apps
  - **SQLite** (via Turso/libSQL) — for edge-first, low-latency reads
  - **Redis** — for caching, sessions, real-time counters
  - Decision criteria: latency, cost, real-time needs, edge compatibility

#### ORM / Query Builder
- Evaluate based on performance:
  - Research current leaders for type safety, query performance, and bundle size
  - Decision criteria: generated SQL quality, migration tooling, runtime overhead

#### Auth
- Evaluate based on requirements:
  - Research current options for OAuth, MFA, session management
  - Decision criteria: security defaults, provider coverage, token handling

#### Validation
- **Zod** — TypeScript-first, works client and server, tiny bundle
  - Check for newer alternatives that may be faster (e.g., Valibot, ArkType)

#### Testing
- **Unit/Integration**: Vitest (fast, Vite-native, Jest-compatible)
- **E2E**: Playwright (cross-browser, mobile viewports, auto-waiting)
- **Component**: Testing Library (tests behavior, not implementation)

#### Linting & Formatting
- Research the fastest option available:
  - Oxlint, Biome, ESLint — compare speed benchmarks
  - Prettier or Biome for formatting
  - Decision criteria: speed, zero-config, correctness

#### Package Manager
- Research current benchmarks:
  - pnpm, bun, npm, yarn — compare install speed, disk usage, lockfile reliability
  - Use whatever is fastest and most reliable today

#### Deployment
- Evaluate based on framework and requirements:
  - Vercel, Cloudflare, Netlify, Fly.io, Railway, AWS — compare for the specific use case
  - Decision criteria: cold start time, edge network, preview deploys, cost

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
