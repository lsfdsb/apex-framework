---
paths:
  - "**/components/**"
  - "**/*.tsx"
---

# Component Conventions

- Props interface with JSDoc above the component. Default export.
- Hooks at the top. Derived state next (not in useEffect). Event handlers. Early returns. Single JSX return.
- Atomic design: atoms (Button, Input), molecules (SearchBar, Card), organisms (Header, ProductList).
- Every component handles: loading state, error state, empty state. No blank screens.
- Accessibility: semantic HTML, aria-labels on icon buttons, keyboard navigation, focus management.
- Responsive: mobile-first. Test at 320px, 768px, 1280px.
- No inline styles. Use Tailwind utilities or CSS modules.
- **Design tokens only** — NEVER use hardcoded Tailwind palette colors (`blue-500`, `purple-600`, etc.). Use the project's semantic tokens (`primary`, `accent`, `muted`, `destructive`). Read `tailwind.config.ts` or `globals.css` first.
- **Design DNA reference** — Before building any page or major component, read the matching pattern from `docs/design-dna/` (landing, saas, crm, ecommerce, blog, portfolio, social, lms, email, presentation, ebook, backoffice, patterns). These are the visual quality bar.
- Memoize only when measured — premature React.memo hurts readability.
- Extract custom hooks for reusable logic. Name them `useXxx`.
- Co-locate: component file, test file, and styles in the same directory.

## Error Boundaries

Every route segment needs an `error.tsx` (Next.js App Router). Never let users see a white screen.

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

Also create a global `global-error.tsx` at the app root for root layout errors.

## Forms

Use react-hook-form + zod for ALL forms. This pattern handles validation, loading states, and error feedback:

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
    mode: 'onBlur', // Inline validation on blur
  })

  const onSubmit = async (data: FormData) => {
    // Submit logic — loading state handled by isSubmitting
  }

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

Rules:
- Define schema with zod first, derive the TypeScript type from it
- Use `mode: 'onBlur'` for inline validation
- Show loading state on submit button via `isSubmitting`
- Display success/error feedback after submission (toast or inline)
- NEVER use uncontrolled inputs with manual `useState` for complex forms

## State Management

Choose the right tool for the right state:

| State type | Tool | When |
|-----------|------|------|
| **Server state** | TanStack Query (React Query) | API data, cached data, background refetching |
| **Client state (global)** | zustand | Auth, UI preferences, shopping cart |
| **Client state (local)** | useState | Toggle, form field, component-scoped |
| **URL state** | nuqs or useSearchParams | Filters, pagination, sort order, search |
| **Form state** | react-hook-form | Any form with validation |

Rules:
- **NEVER** manually fetch in `useEffect` — use TanStack Query or server components
- **NEVER** use Redux for new projects — zustand does the same with 1/10th the boilerplate
- **NEVER** use controlled inputs with `useState` for complex forms — use react-hook-form
- URL state (filters, pagination) must be shareable — use query params, not component state
