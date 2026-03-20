---
paths:
  - "**/components/**"
---

# Component Conventions

- Named exports for components. `export function UserCard()`, not `export default`.
  - Exception: Next.js requires `export default` for `page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`.
- Hooks at the top. Derived state next (not in useEffect). Event handlers. Early returns. Single JSX return.
- Every component handles: loading state, error state, empty state. No blank screens.
- Accessibility: semantic HTML, aria-labels on icon buttons, keyboard navigation, focus management.
- No inline styles. Use Tailwind utilities or CSS modules.
- **Design tokens only** — NEVER hardcode Tailwind palette colors. Use semantic tokens (`primary`, `accent`, `muted`, `destructive`). Read `tailwind.config.ts` or `globals.css` first.
- **Reuse before create** — Before creating any component, check existing ones: `grep -r "export.*function\|export default" src/components/`. Three similar components = refactor into one with variants via props.
- **Co-locate** — Component file, test file, and styles in the same directory.
- Memoize only when measured. Premature React.memo hurts readability.
- Extract custom hooks for reusable logic. Name them `useXxx`.

## Error Boundaries

Every route segment needs an `error.tsx`. Never let users see a white screen.

```typescript
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

## Forms

Use react-hook-form + zod for ALL forms:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name too short'),
})
type FormData = z.infer<typeof schema>

export function MyForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p role="alert">{errors.email.message}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
```

## State Management

| State type | Tool | When |
|-----------|------|------|
| **Server state** | TanStack Query | API data, cached data, background refetching |
| **Client global** | zustand | Auth, UI preferences, cart |
| **Client local** | useState | Toggle, form field, component-scoped |
| **URL state** | nuqs or useSearchParams | Filters, pagination, sort, search |
| **Form state** | react-hook-form | Any form with validation |

- NEVER manually fetch in `useEffect` — use TanStack Query or server components
- URL state (filters, pagination) must be shareable — use query params
