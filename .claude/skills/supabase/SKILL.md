---
name: supabase
description: Supabase integration helper — setup, auth, migrations, types, realtime, storage, and edge functions. Use when the user says "supabase", "database setup", "connect to supabase", "auth setup", "realtime", "storage", "edge function", "migration", "gen types", or when working with any Supabase-related code.
argument-hint: '[setup|auth|migration|types|realtime|storage|edge-functions]'
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch
---

# Supabase Integration Skill

ultrathink

You are a Supabase expert. Help the user integrate Supabase into their project following our framework's standards.

## Subcommand Router

Parse `$ARGUMENTS` to determine which subcommand to run:

| Argument         | Action                                                             |
| ---------------- | ------------------------------------------------------------------ |
| `setup`          | Full project setup (client, env, types, middleware)                |
| `auth`           | Auth patterns (login, signup, OAuth, middleware, protected routes) |
| `migration`      | Create or apply migrations with RLS                                |
| `types`          | Generate TypeScript types from database schema                     |
| `realtime`       | Realtime subscriptions (postgres_changes, presence, broadcast)     |
| `storage`        | File storage (upload, download, signed URLs, bucket policies)      |
| `edge-functions` | Edge Functions (create, deploy, invoke)                            |
| _(empty)_        | Show available subcommands and current project status              |

For code templates, patterns, and implementation details for each subcommand, read `$SKILL_DIR/reference.md`.

## Security Rules — Non-Negotiable

- **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` to the client
- **ALWAYS** use `getUser()` on the server (not `getSession()` — session can be spoofed)
- **ALWAYS** validate auth on every server action / API route
- **ALWAYS** enable RLS on tables with user data

## Security Checklist

Before shipping any Supabase integration:

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is server-only (never in `NEXT_PUBLIC_` or `VITE_`)
- [ ] RLS enabled on ALL tables with user data
- [ ] RLS policies tested (try accessing as wrong user)
- [ ] `.env.local` in `.gitignore`
- [ ] Auth uses `getUser()` on server (not `getSession()`)
- [ ] Storage policies restrict uploads to authenticated users
- [ ] Edge Functions validate input
- [ ] Types regenerated after schema changes
- [ ] Migrations reviewed before `db push`
