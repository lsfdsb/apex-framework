---
name: design-system
description: Our design system standards and UI/UX guidelines. Auto-loads when building any user-facing interface, component, page, or layout. Triggers on design, style, UI, UX, component, layout, responsive, accessibility, dark mode, theme, beautiful, aesthetic, or visual work. Build like Jony Ive — radical simplicity where every element earns its place.
user-invocable: false
---

# Design System — Build Like Jony Ive

> "Design is not just what it looks like. Design is how it works."

## Core Philosophy

**Radical Simplicity**: Remove until it breaks, then add back one thing. White space is design. Typography does heavy lifting. Color is surgical.

**Functional Beauty**: Nothing decorative-only. Animations guide attention. Layout communicates hierarchy.

## Typography

Choose distinctive fonts. **NEVER** use Inter, Roboto, Arial, or system defaults as primary fonts.

- Display font: distinctive, characterful (for headings)
- Body font: clean, readable (for content)
- Mono font: for code blocks only
- Scale: Perfect Fourth (1.333) or Major Third (1.25)
- Max 2 font families per page
- Prose max-width: 65ch

## Color

- **One** strong accent color, not a rainbow
- Semantic tokens: surface, text-primary, text-secondary, accent, success, warning, error
- Dark mode: design it, don't just invert
- Contrast: 4.5:1 text, 3:1 large text/UI (WCAG 2.2 AA)

## Spacing

4px base unit. Use the scale consistently: 4, 8, 12, 16, 24, 32, 48, 64, 96. Never arbitrary values.

## Components

- Touch targets: 44×44px minimum
- Focus rings: visible, high-contrast, 2px offset
- Hover: subtle transition (150-200ms ease)
- Loading: skeleton screens over spinners
- Empty states: guide the user, never blank
- Error states: what happened, why, how to fix

## Layout

- Mobile-first (320px → 1440px)
- CSS Grid for pages, Flexbox for components
- Max content: 1200px. Gutters: 16px mobile, 24px tablet, 32px desktop
- Breakpoints: 640, 768, 1024, 1280

## Motion

- Micro: 150-250ms, ease-out
- Page: 300-500ms, ease-in-out
- Always respect `prefers-reduced-motion`
- Use `transform` and `opacity` only (GPU-accelerated)

## Animation Implementation

- Use **framer-motion** for complex animations (page transitions, layout animations, gestures)
- Use **CSS transitions** for simple hover/focus states (don't import a library for opacity changes)
- `AnimatePresence` for enter/exit animations
- Always wrap in `motion.div` with `initial`, `animate`, `exit` props
- **ALWAYS** check `prefers-reduced-motion` before any animation

```typescript
import { motion, AnimatePresence } from 'framer-motion'

// Respect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )}
</AnimatePresence>
```

Decision tree:
- Opacity/color change on hover → CSS transition
- Element appearing/disappearing → framer-motion `AnimatePresence`
- Page transitions → framer-motion layout animations
- Drag/swipe gestures → framer-motion gesture handlers
- Loading spinner → CSS `@keyframes` animation

## Accessibility (WCAG 2.2 AA minimum)

- Semantic HTML first, ARIA only when needed
- Keyboard navigable with logical tab order
- All images: meaningful alt text
- Forms: visible labels, error messages, autocomplete
- Skip navigation link on every page
- Screen reader: announce dynamic content with aria-live

## Interaction Patterns

- **Forms**: inline validation on blur, not on submit. Show success states. Multi-step forms show progress. Autosave for long forms with "Draft saved" feedback.
- **Navigation**: sidebar for apps with 5+ sections, tabs for 2-4 views, breadcrumbs for deep hierarchies. Bottom nav on mobile for primary actions.
- **Data display**: tables for comparison, cards for browsing. Paginate at 20+ items, virtualize at 100+. Always show total count.
- **Notifications**: toast bottom-right, auto-dismiss 5s, stack max 3, most recent on top. Errors persist until dismissed.
- **Modals**: only for critical confirmations. Drawers for forms/details. Inline expansion for progressive disclosure. Never modal-in-modal.
- **Search**: instant results after 300ms debounce. Show recent searches. Empty results suggest alternatives.

## Page Templates

When building a new page, start from these patterns:

- **Landing**: hero with one CTA → social proof (logos/testimonials) → 3 features with icons → pricing → final CTA
- **Dashboard**: sidebar nav (collapsible on mobile) + header (search, notifications, avatar) + content grid with cards
- **Settings**: grouped sections with headers, save button fixed at bottom on mobile, success toast on save
- **Auth**: centered card, social login buttons first, then divider, then email/password. "Forgot password" link under password field.
- **List/table**: filters on top, bulk actions bar appears on selection, empty state with illustration + CTA to create first item

## Dark Mode Implementation

```css
:root { --bg: #ffffff; --text: #1a1a2e; --accent: #6366f1; }
[data-theme="dark"] { --bg: #0f172a; --text: #f1f5f9; --accent: #818cf8; }
```

- Use CSS custom properties, not Tailwind `dark:` alone
- Detect system preference: `prefers-color-scheme`
- Let user override with toggle, persist in `localStorage`
- Test BOTH themes — dark mode is not optional, it's expected

## Anti-Patterns — NEVER

- Purple-to-blue gradient backgrounds
- Inter/Roboto/Arial as primary font
- Shadows from 2015 (huge, blurry, dark)
- Centered text blocks wider than 40ch
- Icon-only buttons without tooltips or aria-label
- Placeholder as only label
- Modals for non-critical confirmations

## Detailed Reference

For font pairings, color palettes, responsive breakpoints, and component state matrix, read `$SKILL_DIR/reference.md`.
