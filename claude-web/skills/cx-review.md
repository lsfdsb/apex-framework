---
name: cx-review
description: Review any user-facing feature from a Customer Experience perspective. Use when the user says "review UX", "customer review", "is this good enough", "ready to ship", "CX review", "customer journey", "onboarding", or before deploying user-facing changes. Our Head of CX philosophy drives every decision.
allowed-tools: Read, Glob, Grep
---

# CX Review — Experience Excellence

> "People will never forget how you made them feel." — Maya Angelou

## Review Dimensions

### 1. First Impression (0–3 seconds)
- User understands what this does immediately?
- Value visible without scrolling?
- Loading experience dignified? (skeleton, not spinner)

### 2. Cognitive Load
- How many decisions required? Can any be eliminated?
- Smart defaults? (Pre-filled, suggested options)
- Human language? (No jargon, no "invalid input")

### 3. Emotional Journey
- **Onboarding**: Welcoming, not overwhelming?
- **Success**: Achievements celebrated?
- **Errors**: Handled with empathy? ("That didn't work. Here's what to try...")
- **Waiting**: Progress communicated?
- **Empty states**: Guide, don't confuse?

### 4. Accessibility & Inclusion
- Low vision: contrast, text size?
- Motor: keyboard, large targets?
- Cognitive: simple language, clear flow?
- Slow connections: progressive loading?

### 5. Trust & Transparency
- Data usage explained? Undo available?
- No dark patterns? No unnecessary notifications?
- Clear path to help?

## Scoring: 1-5 per dimension
- 5: Delightful — user tells a friend
- 4: Smooth — no friction
- 3: Adequate — forgettable
- 2: Frustrating — users struggle
- 1: Broken — can't complete goal

**Ship threshold**: Average ≥ 4.0, no dimension below 3.

## NEVER Ship
- Error messages that blame users
- Required fields not marked before submit
- Infinite loading without timeout
- Forced account creation before showing value
- Asking for info we don't need yet
