---
name: cx-review
description: Review any user-facing feature from a Customer Experience perspective. Use when the user says "review UX", "customer review", "is this good enough", "ready to ship", "CX review", "customer journey", "onboarding", or before deploying user-facing changes. Our Head of CX philosophy drives every decision.
argument-hint: "[feature or page]"
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

### 6. Resilience

- Offline: does the app degrade gracefully? Cached content shown? Retry with feedback?
- Slow network: skeleton screens, not frozen UI? Timeout with helpful message after 10s?
- API errors: user sees "Something went wrong, try again" not a stack trace?

### 7. Destructive Actions

- Delete/remove: confirmation with consequences ("This will delete 47 tasks permanently")
- Irreversible actions: require typing confirmation (like GitHub's "type repo name to delete")
- Undo available for 10s after soft-deletes (toast with "Undo" button)

### 8. First-Time Experience

- Progressive disclosure: don't show everything on first visit
- Empty states guide the user: "Create your first project" with illustration + button
- Tooltips for complex features, dismissible, don't repeat
- Quick wins: let user accomplish something valuable in <60 seconds

### 9. Mobile Excellence

- Thumb zone: primary actions in bottom 1/3 of screen
- Bottom sheets instead of modals on mobile
- Swipe gestures for common actions (swipe to delete, pull to refresh)
- No hover-dependent interactions (hover doesn't exist on touch)
- Input fields: appropriate keyboard type (email, tel, number)

### 10. Content Quality
- Buttons: verb + noun? Consistent patterns across the app?
- Errors: empathetic + actionable + specific? No technical jargon?
- Empty states: explain value + include CTA? Not just "No data"?
- Confirmations: state consequences? Destructive button matches action?
- No lorem ipsum, TODO, placeholder text in production
- Tone consistent across all pages and states
- Numbers formatted for locale (1,234.56 not 1234.56)
- Dates human-readable ("2 hours ago" not "2026-03-18T16:00:00Z")

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
- Hover-only interactions with no touch alternative
- Destructive actions without confirmation
- Frozen UI during network requests
- Generic "Error" messages without recovery path
- Buttons that say "Submit" or "Click here"
- Error messages showing stack traces or error codes to users
- Empty pages with no guidance
