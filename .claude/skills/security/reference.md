# Security Audit — Detailed Reference

## Danger Pattern Grep Commands

Run these against the codebase to find common vulnerabilities:

```bash
# SQL Injection risks
grep -rn --include="*.ts" --include="*.js" -E '(query|execute|raw)\s*\(' | grep -v node_modules | grep -v '.test.'

# Hardcoded secrets
grep -rn --include="*.ts" --include="*.js" --include="*.env*" -iE '(password|secret|api_key|apikey|token|private_key)\s*[=:]' | grep -v node_modules | grep -v '.example'

# Dangerous functions
grep -rn --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" -E '(eval\(|innerHTML|dangerouslySetInnerHTML|document\.write|exec\(|spawn\()' | grep -v node_modules

# Unvalidated redirects
grep -rn --include="*.ts" --include="*.js" -E '(redirect|location\.href|window\.location)\s*=' | grep -v node_modules

# Missing auth checks (routes without middleware)
grep -rn --include="*.ts" -E 'export\s+(async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH)' | grep -v 'auth\|session\|middleware'
```

## Security Headers Checklist

```typescript
// next.config.js headers
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];
```

## Common Vulnerability Patterns in Next.js

| Vulnerability | Where to Look | Fix |
|--------------|---------------|-----|
| XSS | Client components with user input | Escape output, use textContent not innerHTML |
| CSRF | API routes without token | Next.js Server Actions have built-in CSRF |
| IDOR | API routes with user IDs | Always check `session.user.id === resource.userId` |
| Open Redirect | Login redirect URLs | Validate against allowlist |
| Info Leak | Error responses | Never return stack traces in production |
| Rate Limit | Auth endpoints | Use upstash/ratelimit or similar |

## Environment Variable Security

```
# .env.example — document ALL required vars
# Auth
NEXTAUTH_SECRET=          # Generate: openssl rand -base64 32
NEXTAUTH_URL=             # Your app URL

# Database
DATABASE_URL=             # Supabase connection string
DIRECT_URL=               # Direct connection (for migrations)

# Third-party
STRIPE_SECRET_KEY=        # sk_live_... or sk_test_...
STRIPE_WEBHOOK_SECRET=    # whsec_...
RESEND_API_KEY=           # re_...
```

NEVER: commit .env files, log env vars, expose server-side vars to client (use NEXT_PUBLIC_ prefix only for truly public values).
