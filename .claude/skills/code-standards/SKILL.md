---
name: code-standards
description: Coding standards and best practices for implementation. Auto-loads when Claude writes or edits code files — TypeScript, React, naming, error handling, imports. Code like Linus Torvalds and Jeff Dean — every line has purpose. Triggers on any code writing, editing, refactoring, or review task.
user-invocable: false
---

# Code Standards

## TypeScript

- `strict: true`, `noUncheckedIndexedAccess: true`
- No `any`. Use `unknown` + type guards.
- No `!` non-null assertions. Check properly.
- Explicit return types on public functions.
- Interfaces for object shapes. Discriminated unions for state.

## Naming

- Files: `kebab-case.ts` utils, `PascalCase.tsx` components
- Booleans: `is`, `has`, `should`, `can` prefix
- Handlers: `handleClick`, `onSubmit`
- Async: verb implying async (`fetchUser`, `loadData`)
- No single-letter variables. No `data`, `temp`, `x`.

## Functions

- ≤30 lines. Single responsibility.
- JSDoc on every public function.
- Typed errors with Result pattern when useful.
- Never empty catch blocks. Always log + handle.

## Visual Standards (for .tsx/.jsx files)

When writing ANY user-facing component, the `/design-system` skill auto-loads with full guidance. Key rules that apply to ALL code:

- **NEVER** use hardcoded Tailwind palette colors (`blue-500`, `purple-600`). Use semantic tokens: `primary`, `accent`, `success`, `warning`, `destructive`, `muted`
- **ALWAYS** wrap page roots in `<div className="apex-enter">` for entrance animations
- **ALWAYS** use the APEX transition curve: `ease-[cubic-bezier(0.22,1,0.36,1)]`
- Read the matching Design DNA page and follow the Translation Guide in `reference.md`

## React Components

```typescript
interface Props {
  /** The user to display */
  user: User;
  onEdit?: (id: string) => void;
  variant?: 'compact' | 'detailed';
}

/** Displays a user profile card. */
export function UserCard({ user, onEdit, variant = 'compact' }: Props) {
  // Hooks at top. Derived state (not useEffect). Early returns.
  // Single return with clean JSX.
}
```

## Imports

1. External libraries
2. Internal modules (@/ aliases)
3. Types (use `import type`)
4. Styles

## Commits

`type(scope): description` — imperative mood, ≤72 chars, no period.
Types: feat, fix, docs, refactor, test, perf, security, chore.
