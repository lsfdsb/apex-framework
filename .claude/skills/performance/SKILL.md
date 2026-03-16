---
name: performance
description: Analyze and optimize application performance. Use when the user mentions slow, performance, optimize, speed, lag, loading, bundle size, lighthouse, core web vitals, LCP, CLS, memory leak, render, or when reviewing code with performance implications. Our apps have zero lag — non-negotiable.
argument-hint: "[component or page]"
allowed-tools: Read, Grep, Glob, Bash
---

# Performance — Zero Lag

## Budgets

| Metric | Target | Max |
|--------|--------|-----|
| LCP | < 1.5s | < 2.5s |
| INP | < 100ms | < 200ms |
| CLS | < 0.05 | < 0.1 |
| Initial JS | < 100KB gz | < 200KB |
| Total JS/page | < 300KB gz | < 500KB |
| API simple read | < 50ms | < 200ms |

## Frontend Checks

- No unnecessary re-renders (measure before adding React.memo)
- Lists virtualized if >50 items
- Code-split by route (dynamic imports)
- Images: WebP/AVIF, srcset, loading="lazy"
- Fonts: display:swap, preloaded, subset
- Animations: transform/opacity only
- Respect `prefers-reduced-motion`

## Backend Checks

- No N+1 queries (use EXPLAIN ANALYZE)
- Pagination on all list endpoints (cursor-based preferred)
- Connection pooling configured
- Compression enabled (gzip/brotli)
- Caching layer for hot data

## Anti-Patterns to Flag

- `useEffect` with wrong dependency arrays
- Importing entire lodash (`import _ from 'lodash'`)
- Inline objects in JSX props (causes re-renders)
- Unoptimized images (PNG >100KB)
- `JSON.parse`/`JSON.stringify` in hot paths

## Output

```markdown
## Performance Report: [Component]
**Status**: 🔴 SLOW / 🟡 OK / 🟢 FAST

### Issues (prioritized by impact)
1. **[P0]** [Issue] → [Fix] (saves ~Xms/XKB)

### Recommendations
[Prioritized optimizations]
```
