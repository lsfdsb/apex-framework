---
paths:
  - "**/supabase/**"
  - "**/lib/supabase*"
  - "**/lib/supabase/**"
  - "**/auth/callback/**"
  - "**/*supabase*"
---

# Supabase Conventions

## Client Setup
- Browser client: `createClient<Database>()` from `@supabase/supabase-js` (React/Vite) or `createBrowserClient<Database>()` from `@supabase/ssr` (Next.js).
- Server/SSR client: `createServerClient<Database>()` from `@supabase/ssr` — only for SSR frameworks (Next.js, Remix). Not applicable in React SPA (Vite).
- Always pass the `Database` generic for full type safety.
- Regenerate types after every schema change: `npx supabase gen types typescript --linked > src/lib/supabase/types.ts`.

## Auth
- React SPA: use `supabase.auth.getUser()` in hooks/context — never cache the raw JWT yourself.
- SSR/Server: use `getUser()` server-side — never trust `getSession()` alone (JWT can be spoofed).
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose in `NEXT_PUBLIC_` or `VITE_` prefixed vars.
- OAuth callback: handle `exchangeCodeForSession()` in the callback route/page for the current framework.
- For Next.js: middleware must refresh session on every request via `supabase.auth.getUser()`.

## RLS (Row Level Security)
- Enable RLS on ALL tables with user data — no exceptions.
- Every table needs policies for each operation it supports (SELECT, INSERT, UPDATE, DELETE).
- Use `auth.uid()` for user-scoped access. Use subqueries for org/role-scoped access.
- Test policies: try accessing data as the wrong user. Use service_role only server-side.

## Storage
- Bucket policies use `storage.foldername(name)[1]` to scope by user folder.
- Always set `contentType` and `cacheControl` on uploads.
- Use signed URLs for private files, public URLs only for truly public content.

## Realtime
- Enable realtime per table: `ALTER PUBLICATION supabase_realtime ADD TABLE table_name`.
- Always clean up subscriptions in useEffect return / component unmount.
- Realtime respects RLS — ensure SELECT policies exist for listeners.

## Migrations
- One concern per migration file. Always include RLS + indexes.
- After `db push`, always regenerate types.
- Use `handle_updated_at()` trigger on every table with `updated_at`.

## Security Checklist
- [ ] `.env.local` in `.gitignore`
- [ ] `SERVICE_ROLE_KEY` never exposed to client
- [ ] RLS enabled on all user-data tables
- [ ] Storage policies restrict uploads
- [ ] Auth uses `getUser()` server-side
