---
paths:
  - '**/api/**'
  - '**/routes/**'
  - '**/server/**'
  - '**/trpc/**'
  - '**/actions/**'
---

# API Conventions

## Route Handlers (Next.js App Router)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: parsed.error.flatten(),
        },
      },
      { status: 400 },
    );
  }

  // Authorization: verify the user owns this resource
  // Never skip this, even for authenticated routes

  return NextResponse.json({ data: result }, { status: 201 });
}
```

## Rules

- Validate ALL request bodies with Zod. Return 400 with structured errors.
- Check authorization on EVERY endpoint — not just authentication, verify ownership.
- Error shape: `{ error: { code: string, message: string, details?: unknown } }`
- Paginate lists with cursors: `{ data: [], pagination: { cursor, hasMore } }`
- Rate limit auth endpoints (5-10/min per IP). General endpoints: 60/min.
- Never expose internal IDs, stack traces, or database errors to clients.
- Log requests: method, path, status, duration, user_id (if authenticated).
- Server Actions: validate with Zod, return `{ error: { field?, message } }` on failure.
