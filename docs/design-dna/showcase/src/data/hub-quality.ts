/**
 * APEX Visual Pipeline HUB — Quality Gate Definitions
 * The 7-phase QA gate + additional gates.
 */

import type { QualityGateDefinition } from "./hub-types";

// ── 7-Phase QA Gate ────────────────────────────────────────────────────────────

export const QA_GATES: QualityGateDefinition[] = [
  {
    name: "Dependencies",
    icon: "📦",
    description: "Package versions, security advisories, license compliance.",
    teachingPoint: "Your dependencies are your attack surface. Every package you install is code you didn't write but are responsible for. Check versions, scan for CVEs, verify licenses.",
    checks: [
      "No known security vulnerabilities in dependencies",
      "All packages from verified publishers",
      "License compatibility (MIT, Apache 2.0, ISC)",
      "No deprecated packages in use",
      "Lock file is up to date",
    ],
  },
  {
    name: "Code Quality",
    icon: "📝",
    description: "TypeScript strict, no `any`, ESLint, Prettier, conventional commits.",
    teachingPoint: "Style consistency eliminates cognitive load. When every file follows the same patterns, developers spend time thinking about logic — not formatting. TypeScript strict mode catches bugs at compile time, not runtime.",
    checks: [
      "TypeScript strict mode — zero errors",
      "No `any` types in production code",
      "ESLint passes with zero warnings",
      "Prettier formatting consistent",
      "Conventional commit messages on all commits",
      "Functions ≤ 30 lines, files ≤ 300 lines",
    ],
  },
  {
    name: "Logic",
    icon: "🧠",
    description: "Business logic correctness, edge cases, error handling.",
    teachingPoint: "Code that works is not the same as code that's correct. Does it handle empty states? Null values? Network failures? Race conditions? Correct code works on the happy path AND every edge case.",
    checks: [
      "Happy path works end-to-end",
      "Empty states handled gracefully",
      "Error states show helpful messages",
      "Loading states prevent interaction",
      "No race conditions in async code",
      "Edge cases covered (0 items, max items, special characters)",
    ],
  },
  {
    name: "Design DNA",
    icon: "🎨",
    description: "Matches design tokens, responsive, dark/light, no hardcoded colors.",
    teachingPoint: "Design is how it works, not just how it looks. Using design tokens means every color, spacing, and font comes from a single source of truth. Change the token, change the entire app. Hardcoded colors are design debt.",
    checks: [
      "All colors use CSS variables (no hardcoded hex)",
      "Typography uses design system fonts",
      "Spacing follows the 4px/8px grid",
      "Dark and light mode both work",
      "Responsive at 320px, 768px, 1024px, 1280px",
      "Matches the Design DNA template for this app type",
    ],
  },
  {
    name: "Performance",
    icon: "⚡",
    description: "Bundle size, lazy loading, no N+1, pagination, Lighthouse.",
    teachingPoint: "Speed is a feature, not an optimization. Users don't wait — they leave. Lazy load routes, virtualize long lists, paginate queries, and measure everything. If Lighthouse says it's slow, it's slow.",
    checks: [
      "Lighthouse Performance > 90",
      "All routes lazy-loaded",
      "No N+1 database queries",
      "Lists > 20 items are paginated",
      "Images optimized (WebP, lazy loading)",
      "Bundle size within budget",
    ],
  },
  {
    name: "Security",
    icon: "🔒",
    description: "OWASP Top 10, auth patterns, input validation, secrets scan.",
    teachingPoint: "Security is not a feature — it's a constraint. Every input is untrusted. Every API is a potential attack vector. OWASP Top 10 is the minimum. Defense in depth means multiple layers, not one wall.",
    checks: [
      "No secrets in source code",
      "Input validation on all user inputs",
      "SQL injection prevention (parameterized queries)",
      "XSS prevention (output encoding)",
      "CSRF protection on mutations",
      "Auth tokens stored securely (httpOnly cookies)",
      "RLS policies on all database tables",
    ],
  },
  {
    name: "Polish",
    icon: "💎",
    description: "Spelling, version consistency, dead references, truncated text.",
    teachingPoint: "The last 10% is the other 90%. Truncated text, misaligned tables, stale version numbers, dead references — these are not nitpicks, they are quality failures. The difference between good and great is the details nobody notices until they are wrong.",
    checks: [
      "No spelling errors in UI text",
      "Version numbers consistent across all files",
      "No dead links or references",
      "No truncated text at any viewport",
      "No placeholder or 'lorem ipsum' content",
      "Favicon and meta tags present",
    ],
  },
];

// ── Additional Gates ───────────────────────────────────────────────────────────

export const ADDITIONAL_GATES = [
  {
    name: "Accessibility",
    icon: "♿",
    description: "WCAG 2.2 AA compliance. Keyboard navigation. Screen reader support.",
    teachingPoint: "Accessibility is not optional — it's a legal and ethical requirement. 15% of the world has a disability. If your app doesn't work with a keyboard, a screen reader, or high contrast, you've excluded 1 billion people.",
  },
  {
    name: "CX Review",
    icon: "💬",
    description: "Customer journey validation. Onboarding flow. Error message quality.",
    teachingPoint: "Every error message is a conversation with a frustrated user. Every onboarding step is a chance to lose them. CX review asks: would a first-time user succeed on their own? If not, fix the product — not the documentation.",
  },
  {
    name: "Security Deep",
    icon: "🔐",
    description: "Auth flow audit. Encryption verification. Token storage review.",
    teachingPoint: "The deep security gate runs on code that handles authentication, payments, or PII. It's not a scan — it's a review. How are tokens stored? What happens on session expiry? Can a user escalate privileges? Trust nothing.",
  },
] as const;
