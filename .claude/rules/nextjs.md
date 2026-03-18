---
paths:
  - "**/app/**"
  - "**/middleware.*"
  - "**/next.config.*"
  - "**/layout.tsx"
  - "**/page.tsx"
  - "**/loading.tsx"
  - "**/error.tsx"
  - "**/not-found.tsx"
---

# Next.js App Router Conventions

- Server Components by default. Add `'use client'` only when using hooks, event handlers, or browser APIs.
- Data fetching in Server Components — no useEffect for initial data. Use `async` components or server actions.
- Metadata: export `metadata` or `generateMetadata` from pages/layouts. Never use `<Head>`.
- Loading states: `loading.tsx` for Suspense boundaries per route segment. No manual loading spinners.
- Error boundaries: `error.tsx` per route segment. Must be a Client Component with `'use client'`.
- `not-found.tsx` for 404 states. Call `notFound()` from server components when resource missing.
- Middleware: edge runtime only. Keep light — auth checks, redirects, headers. No heavy computation.
- Route handlers (`route.ts`): export named functions (GET, POST, PUT, DELETE). Return `NextResponse`.
- Server Actions: `'use server'` directive. Validate input with Zod. Return typed results, not redirects.
- Images: always use `next/image` with width/height or fill. Never raw `<img>`.
- Fonts: use `next/font` for zero-layout-shift loading. No external font CDNs.
- Environment variables: `NEXT_PUBLIC_` prefix for client-side. Server-only by default.
- Parallel routes (`@slot`) for complex layouts. Intercepting routes (`(.)`) for modals.
- Revalidation: prefer `revalidatePath`/`revalidateTag` over `router.refresh()`.
