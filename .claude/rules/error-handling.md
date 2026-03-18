---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/lib/**"
  - "**/utils/**"
  - "**/services/**"
  - "**/actions/**"
---

# Error Handling Conventions

- Define typed error results: `type Result<T> = { data: T; error: null } | { data: null; error: AppError }`.
- Never throw from utility functions. Return Result types. Let the caller decide how to handle.
- Throw only at boundaries: API routes, server actions, React error boundaries.
- Custom error classes extend a base `AppError` with `code`, `message`, `statusCode`, `isOperational`.
- Operational errors (user input, network) vs programming errors (null ref, type mismatch) — handle differently.
- API routes: catch all, map to appropriate HTTP status, never leak stack traces.
- React: `error.tsx` boundaries per route. `ErrorBoundary` wrapper for client components that fetch data.
- Forms: server action errors return `{ error: { field?, message } }`. Display inline, not toast-only.
- External API calls: always wrap in try/catch with timeout. Retry transient failures (429, 503) with exponential backoff, max 3 attempts.
- Log errors with context: user_id, request_id, action, input (sanitized). Use structured logging.
- Never swallow errors silently. `catch (e) {}` is a bug. At minimum, log and re-throw.
- Database errors: catch constraint violations specifically. Map to user-friendly messages.
- Graceful degradation: if a non-critical feature fails, show fallback UI, not a crash.
