---
paths:
  - "**/supabase/**"
  - "**/lib/supabase*"
  - "**/lib/supabase/**"
  - "**/auth/callback/**"
---

# Supabase Conventions

## Client Setup
- Browser: `createBrowserClient<Database>()` from `@supabase/ssr` (Next.js) or `createClient<Database>()` (Vite).
- Server: `createServerClient<Database>()` from `@supabase/ssr`. SSR only.
- Always pass the `Database` generic for type safety.
- Regenerate types after schema changes: `npx supabase gen types typescript --linked > src/lib/supabase/types.ts`.

## Auth (Security-Critical)
- Server-side: always use `getUser()`, never trust `getSession()` alone (JWT can be spoofed).
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never in `NEXT_PUBLIC_*` or `VITE_*` vars.
- Next.js middleware must refresh session via `supabase.auth.getUser()` on every request.
- OAuth: handle `exchangeCodeForSession()` in the callback route.

## RLS
- Enable RLS on ALL user-data tables. No exceptions.
- Write policies for each operation (SELECT, INSERT, UPDATE, DELETE).
- Use `auth.uid()` for user-scoped access. Subqueries for org/role-scoped.

## Storage & Realtime
- Storage: set `contentType` + `cacheControl` on uploads. Signed URLs for private files.
- Realtime: always clean up subscriptions on unmount. Respects RLS.

## Migrations
- One concern per file. Include RLS + indexes.
- After `db push`, always regenerate types.
- Use `handle_updated_at()` trigger on tables with `updated_at`.
