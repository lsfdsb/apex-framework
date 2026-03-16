---
paths:
  - "**/api/**"
  - "**/routes/**"
  - "**/app/api/**"
  - "**/server/**"
  - "**/trpc/**"
---

# API Conventions

- RESTful naming: `/api/v1/users` (plural nouns, no verbs in URLs).
- HTTP methods: GET (read), POST (create), PUT/PATCH (update), DELETE (remove).
- Consistent error response: `{ error: { code: "NOT_FOUND", message: "User not found", details?: {} } }`
- Status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable, 429 Rate Limited, 500 Server Error.
- Validate ALL request bodies with Zod. Return 400 with validation errors for invalid input.
- Check authorization on EVERY endpoint. Not just authentication — verify the user owns the resource.
- Paginate all list endpoints. Return: `{ data: [], pagination: { cursor, hasMore } }`.
- Rate limit all public endpoints. Stricter limits on auth endpoints (5/min).
- Never expose internal IDs, stack traces, or database errors to clients.
- Log all requests with: method, path, status, duration, user_id (if authenticated).
