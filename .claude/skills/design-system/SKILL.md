---
name: design-system
description: Our design system standards and UI/UX guidelines. Auto-loads when building any user-facing interface, component, page, or layout. Triggers on design, style, UI, UX, component, layout, responsive, accessibility, dark mode, theme, beautiful, aesthetic, or visual work. Build like Jony Ive — radical simplicity where every element earns its place.
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

## Accessibility (WCAG 2.2 AA minimum)

- Semantic HTML first, ARIA only when needed
- Keyboard navigable with logical tab order
- All images: meaningful alt text
- Forms: visible labels, error messages, autocomplete
- Skip navigation link on every page
- Screen reader: announce dynamic content with aria-live

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
