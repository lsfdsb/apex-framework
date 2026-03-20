# Recipe: Email Templates

> Design DNA page: `docs/design-dna/email.html`

## Foundation

| Setting | Value |
|---------|-------|
| **Palette** | Any (inline styles for email compatibility) |
| **Background** | none (email clients strip backgrounds) |
| **Display font** | Georgia (web-safe serif fallback) |
| **Body font** | Arial, Helvetica (web-safe sans fallback) |
| **Mood** | Professional, trustworthy, scannable |

## Email Types

| Template | Purpose | Key Elements |
|----------|---------|-------------|
| Welcome | New user onboarding | Logo, greeting, CTA button, feature highlights |
| Verification | Email confirmation | Code/link, security note, expiry |
| Receipt | Purchase confirmation | Order items, totals, support link |
| Shipping | Delivery update | Tracking info, estimated date, items |
| Password reset | Account recovery | Reset link, security warning, expiry |
| Invitation | Team/workspace invite | Inviter name, workspace, accept CTA |
| Payment failed | Billing issue | Reason, update payment CTA, support |
| Digest | Weekly summary | Stats, highlights, engagement CTA |

## Notes

Email templates use **inline CSS** (not Tailwind) for client compatibility. Use the DNA hex values directly since CSS variables don't work in email. Max width: 600px. Tables for layout (not flexbox/grid).
