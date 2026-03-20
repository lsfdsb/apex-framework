---
paths:
  - "**/lib/**"
  - "**/utils/**"
  - "**/services/**"
  - "**/actions/**"
---

# Error Handling Conventions

- Return `Result<T>` from utility functions, never throw:
  ```typescript
  type Result<T> = { data: T; error: null } | { data: null; error: AppError }
  ```
- Throw only at boundaries: API routes, server actions, React error boundaries.
- Custom errors extend a base `AppError` with `code`, `message`, `statusCode`, `isOperational`.
- API routes: catch all, map to HTTP status, never leak stack traces.
- Forms: server action errors return `{ error: { field?, message } }`. Display inline, not toast-only.
- External APIs: wrap in try/catch with timeout. Retry transient failures (429, 503) with exponential backoff, max 3 attempts.
- `catch (e) {}` with no handling is a bug. At minimum, log and re-throw.
- Graceful degradation: non-critical feature failure = fallback UI, not crash.
