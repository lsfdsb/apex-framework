# Supabase Reference — Code Patterns & Templates

## setup — Full Project Setup

### Step 1: Detect Stack

Read `package.json` to detect:

- Framework: Next.js (App Router) vs Vite vs other
- Package manager: pnpm > npm > yarn (check lockfiles)
- Existing Supabase packages

### Step 2: Install Dependencies

```bash
# Core client
pnpm add @supabase/supabase-js

# For Next.js App Router — SSR auth helpers
pnpm add @supabase/ssr

# Dev: CLI for migrations and type generation
pnpm add -D supabase
```

### Step 3: Create Client Files

**For Next.js App Router:**

Create `src/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
```

Create `src/lib/supabase/server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    },
  );
}
```

Create `src/lib/supabase/middleware.ts`:

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session if expired
  await supabase.auth.getUser();

  return supabaseResponse;
}
```

Create or update `middleware.ts` (project root or src/):

```typescript
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

**For Vite/React:**

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
```

### Step 4: Environment Variables

Create `.env.local.example`:

```bash
# Supabase — get from https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

For Vite projects, use `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

Remind the user: copy `.env.local.example` to `.env.local` and fill in real values. Verify `.env.local` is in `.gitignore`.

### Step 5: Initialize Supabase CLI

```bash
npx supabase init    # Creates supabase/ directory
npx supabase login   # Browser-based auth
npx supabase link --project-ref PROJECT_ID
```

### Step 6: Generate Initial Types

```bash
npx supabase gen types typescript --linked > src/types/supabase.ts
```

Add to `package.json` scripts:

```json
{
  "db:types": "supabase gen types typescript --linked > src/types/supabase.ts",
  "db:push": "supabase db push",
  "db:diff": "supabase db diff --linked",
  "db:migration": "supabase migration new"
}
```

---

## auth — Authentication Patterns

### Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { display_name: name },
    emailRedirectTo: `${origin}/auth/callback`,
  },
});
```

### Sign In (Email/Password)

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

### Sign In (OAuth)

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google', // 'github' | 'discord' | 'apple'
  options: {
    redirectTo: `${origin}/auth/callback`,
  },
});
```

### OAuth Callback Route (Next.js App Router)

Create `app/auth/callback/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`);
}
```

### Sign Out

```typescript
await supabase.auth.signOut();
```

### Get User (Server Component)

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <h1>Welcome, {user.email}</h1>
}
```

### Auth State Listener (Client Component)

```typescript
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function AuthListener() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.push('/login');
      if (event === 'SIGNED_IN') router.refresh();
    });
    return () => subscription.unsubscribe();
  }, [router, supabase]);

  return null;
}
```

---

## migration — Database Migrations

### Create Migration

```bash
npx supabase migration new MIGRATION_NAME
```

### Migration Template

Every migration MUST include:

1. Table creation with standard columns (id, created_at, updated_at)
2. RLS enablement
3. RLS policies (SELECT, INSERT, UPDATE, DELETE as needed)
4. Indexes on foreign keys and frequent query columns
5. updated_at trigger

```sql
-- Create table
CREATE TABLE public.TABLE_NAME (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- columns here
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_TABLE_NAME_user_id ON public.TABLE_NAME(user_id);

-- RLS
ALTER TABLE public.TABLE_NAME ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own" ON public.TABLE_NAME
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "insert_own" ON public.TABLE_NAME
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own" ON public.TABLE_NAME
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own" ON public.TABLE_NAME
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- updated_at trigger
CREATE TRIGGER set_TABLE_NAME_updated_at
  BEFORE UPDATE ON public.TABLE_NAME
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

### Apply Migration

```bash
npx supabase db push         # Push to remote
npx supabase db diff --linked # Check diff before pushing
npx supabase migration list   # Check status
```

### After Migration — Always Regenerate Types

```bash
pnpm db:types
```

---

## types — Type Generation

```bash
# Generate types from linked project
npx supabase gen types typescript --linked > src/types/supabase.ts

# Or from project ID
npx supabase gen types typescript --project-id PROJECT_ID > src/types/supabase.ts
```

The generated `Database` type is used as generic parameter in `createClient<Database>()`.

Helper types for convenience:

```typescript
import type { Database } from './supabase';

// Extract Row, Insert, Update types for any table
type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Usage: type Post = Tables<'posts'>
```

---

## realtime — Real-time Subscriptions

### Listen to Table Changes

```typescript
const channel = supabase
  .channel('table-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
    if (payload.eventType === 'INSERT') addMessage(payload.new);
    if (payload.eventType === 'UPDATE') updateMessage(payload.new);
    if (payload.eventType === 'DELETE') removeMessage(payload.old);
  })
  .subscribe();

// Cleanup
return () => {
  supabase.removeChannel(channel);
};
```

### Filter by Column

```typescript
.on('postgres_changes', {
  event: 'INSERT',
  schema: 'public',
  table: 'messages',
  filter: `room_id=eq.${roomId}`,
}, callback)
```

### Presence (Who's Online)

```typescript
const channel = supabase.channel(`room:${roomId}`);

channel
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState();
    setOnlineUsers(Object.values(state).flat());
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({ user_id: userId, name: userName });
    }
  });
```

### Broadcast (Custom Events)

```typescript
const channel = supabase.channel(`room:${roomId}`);

// Listen
channel.on('broadcast', { event: 'cursor' }, ({ payload }) => {
  setCursors((prev) => ({ ...prev, [payload.userId]: payload.position }));
});

// Send
await channel.send({
  type: 'broadcast',
  event: 'cursor',
  payload: { userId, position: { x, y } },
});
```

### Important

- Enable Realtime on the table in Supabase Dashboard (or via SQL: `ALTER PUBLICATION supabase_realtime ADD TABLE table_name`)
- Always clean up subscriptions in useEffect return
- Realtime requires RLS policies — anonymous can't listen without SELECT policy

---

## storage — File Storage

### Upload

```typescript
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload(`${userId}/${fileName}`, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type,
  });
```

### Download

```typescript
const { data, error } = await supabase.storage.from('bucket-name').download('path/to/file.pdf');

// data is Blob
const url = URL.createObjectURL(data!);
```

### Public URL (for public buckets)

```typescript
const { data } = supabase.storage.from('public-bucket').getPublicUrl('path/to/file.png');
// data.publicUrl
```

### Signed URL (for private buckets)

```typescript
const { data, error } = await supabase.storage
  .from('private-bucket')
  .createSignedUrl('path/to/file.pdf', 3600); // expires in 1 hour
// data.signedUrl
```

### Bucket Policies (SQL)

```sql
-- Users can upload to their own folder
CREATE POLICY "upload_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can read their own files
CREATE POLICY "read_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Public read access
CREATE POLICY "public_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'public');
```

---

## edge-functions — Supabase Edge Functions

### Create

```bash
npx supabase functions new function-name
```

### Function Template (Deno)

```typescript
// supabase/functions/function-name/index.ts
import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  // Get auth user from request
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Business logic here
  const body = await req.json();

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### Invoke from Client

```typescript
const { data, error } = await supabase.functions.invoke('function-name', {
  body: { key: 'value' },
});
```

### Deploy

```bash
npx supabase functions deploy function-name
```

### Secrets

```bash
npx supabase secrets set SECRET_NAME=value
npx supabase secrets list
```
