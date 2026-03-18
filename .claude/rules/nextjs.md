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

## SEO

Every public page needs proper SEO. This is non-negotiable for discoverability.

### Meta Tags (via Metadata API)
```typescript
// In page.tsx or layout.tsx
export const metadata: Metadata = {
  title: 'Page Title — Brand',
  description: 'Concise description under 160 chars',
  openGraph: {
    title: 'Page Title — Brand',
    description: 'Concise description under 160 chars',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}
```

For dynamic pages, use `generateMetadata`:
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.id)
  return { title: product.name, description: product.description }
}
```

### Sitemap
Generate `sitemap.xml` with `app/sitemap.ts`:
```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getAllPages()
  return pages.map((page) => ({
    url: `https://example.com${page.path}`,
    lastModified: page.updatedAt,
    changeFrequency: 'weekly',
    priority: page.path === '/' ? 1 : 0.8,
  }))
}
```
For larger sites, use `next-sitemap` for more control.

### Structured Data (JSON-LD)
Add to key pages (product, article, FAQ, organization):
```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
/>
```

### Canonical URLs
Prevent duplicates — set canonical in metadata:
```typescript
export const metadata: Metadata = {
  alternates: { canonical: 'https://example.com/page' },
}
```

### robots.txt
Create `app/robots.ts`:
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```
