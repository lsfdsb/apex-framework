# Security Audit — Detailed Reference

## Danger Pattern Grep Commands

Run these against the codebase to find common vulnerabilities:

```bash
# SQL Injection risks
grep -rn --include="*.ts" --include="*.js" -E '(query|execute|raw)\s*\(' | grep -v node_modules | grep -v '.test.'

# Hardcoded secrets (general)
grep -rn --include="*.ts" --include="*.js" --include="*.env*" -iE '(password|secret|api_key|apikey|token|private_key)\s*[=:]' | grep -v node_modules | grep -v '.example'

# Hardcoded API keys (provider-specific prefixes)
grep -rn --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" -E "(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36}|AKIA[A-Z0-9]{16}|sk_live_|sk_test_|whsec_|re_[a-zA-Z0-9])" | grep -v node_modules | grep -v '.example' | grep -v '.env.example'

# Hardcoded Bearer tokens and token= in URLs
grep -rn --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" -E "(Bearer ['\"][a-zA-Z0-9._-]{20,}|token=[a-zA-Z0-9._-]{20,})" | grep -v node_modules | grep -v '.test.'

# console.log with sensitive data
grep -rn --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" -E 'console\.(log|info|debug|warn)\(.*\b(password|token|secret|apiKey|api_key|credential|private_key)\b' | grep -v node_modules | grep -v '.test.'

# Dangerous functions (code execution)
grep -rn --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" -E '(eval\(|new Function\(|innerHTML\s*=|dangerouslySetInnerHTML|document\.write\(|exec\(|spawn\()' | grep -v node_modules

# SQL injection via template literals (unescaped user input)
grep -rn --include="*.ts" --include="*.js" -E '(query|execute|sql|raw)\s*\(`[^`]*\$\{' | grep -v node_modules | grep -v '.test.'

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
