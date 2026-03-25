---
name: design-system
description: Our design system standards and UI/UX guidelines. Auto-loads when building any user-facing interface, component, page, or layout. Triggers on design, style, UI, UX, component, layout, responsive, accessibility, dark mode, theme, beautiful, aesthetic, or visual work. Build like Jony Ive — radical simplicity where every element earns its place.
paths:
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/*.css"
  - "**/globals.css"
  - "**/tailwind.config.*"
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

### Recommended Fonts

**Display fonts** (for headings — distinctive, characterful):
- **Fraunces** — editorial serif with optical size axis; great for editorial, blog, portfolio
- **Space Grotesk** — geometric sans with quirky terminals; great for SaaS, tech, startups
- **Plus Jakarta Sans** — geometric humanist; versatile for SaaS dashboards and landing pages

**Body fonts** (for content — clean, highly readable at small sizes):
- **Kumbh Sans** — geometric, neutral, very legible; pairs well with Fraunces or Space Grotesk
- **General Sans** — neo-grotesque with personality; works as both display and body at scale
- **Switzer** — grotesque with warmth; excellent for long-form reading and app interfaces

Load via Google Fonts or Fontsource. Never use Inter, Roboto, or system-ui as a primary font choice.

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

## UX Writing — Words Are Interface

> "A user interface is a conversation between the user and the product."

### Button Labels
- Always: verb + noun ("Create project", "Save changes", "Delete account")
- Never: "Submit", "Click here", "OK", "Yes/No" without context
- Destructive: state the action ("Delete project", not "Remove")
- Loading state: "Creating..." (match the verb from the label)

### Error Messages
- Formula: What happened + Why + How to fix
- Good: "Email already registered. Try logging in, or use a different email."
- Bad: "Error: duplicate entry", "Invalid input", "Something went wrong"
- Never blame the user: "That password is too short" not "You entered an invalid password"

### Empty States
- Formula: What this is + Why it's empty + What to do
- Good: "No projects yet. Projects help you organize tasks by client. Create your first one."
- Bad: "No data", "Nothing here", blank white page
- Always include a primary CTA button

### Confirmation Dialogs
- State the consequence explicitly
- Good: "Delete 'My Project'? This removes 47 tasks permanently and cannot be undone."
- Bad: "Are you sure?" / "Confirm deletion"
- Destructive button label matches the action: "Delete project" not "OK"

### Loading & Progress
- Specific: "Loading your projects..." not "Please wait..."
- Long operations: show progress ("Importing 234 of 1,000 contacts...")
- After completion: confirm what happened ("3 files uploaded successfully")

### Success Messages
- Celebrate proportionally: toast for saves, page change for creation
- Don't over-celebrate minor actions (no confetti for saving a form)

### Tooltips & Help Text
- Explain WHY, not WHAT: "Projects help you organize tasks by client" not "Click to view projects"
- Keep under 15 words. Show on focus AND hover (accessible).

### Tone of Voice
- Professional but human — not robotic, not overly casual
- First person plural for product: "We couldn't find that page"
- Second person for user: "Your project was created"
- Present tense: "This deletes your account" not "This will delete your account"
- Consistent across the entire app

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

## Design DNA — Live Pattern Library (MANDATORY)

The APEX Design DNA at `docs/design-dna/` is our **authoritative visual reference**. Every pattern page contains production-quality HTML/CSS that defines how screens should look and feel. **Before building ANY user-facing page, you MUST read the matching Design DNA page.**

Preview server: `http://localhost:3001` (run from project root if not already running).

### Page-Type Routing Table

| Building this... | Read this React template | Key patterns inside |
|---|---|---|
| Landing page, marketing site | `docs/design-dna/templates/LandingPage.tsx` | Hero, features grid, pricing, testimonials, CTA banner, auth card |
| SaaS dashboard, admin panel | `docs/design-dna/templates/SaaSDashboard.tsx` | Dashboard layout, data tables, settings page, empty states |
| CRM, contacts, pipelines | `docs/design-dna/templates/CRMPipeline.tsx` | 19 patterns: Kanban pipeline, contact cards, activity timeline, chat widget, deal drawer, sidebar nav, CRM dashboard, helpdesk dashboard |
| Sidebar navigation | `docs/design-dna/templates/CRMPipeline.tsx` | Collapsible sidebar with logo, sections, icons, active states, badges — use for any app with 5+ nav items |
| Dashboard layout | `docs/design-dna/templates/CRMPipeline.tsx` | Sidebar + compact content area with KPI strip, sparklines, bar charts, donut charts, activity feed |
| E-commerce, shop, products | `docs/design-dna/templates/EcommercePage.tsx` | Product grid, product detail, cart, 3-step checkout |
| Blog, editorial, articles | `docs/design-dna/templates/BlogLayout.tsx` | Hero, featured article, article grid, reading experience, newsletter |
| Portfolio, agency, showcase | `docs/design-dna/templates/PortfolioPage.tsx` | Selected work grid, services list, contact form |
| Social feed, community | `docs/design-dna/templates/SocialFeed.tsx` | 3-column feed layout, sidebar, trending, suggested |
| LMS, courses, learning | `docs/design-dna/templates/LMSDashboard.tsx` | Course catalog, lesson player, progress overview, certificate |
| Email templates | `docs/design-dna/templates/EmailTemplate.tsx` | 8 transactional patterns: welcome, verification, order, shipping, password reset, team invite, payment failed, weekly digest |
| Presentations, slides | `docs/design-dna/templates/PresentationSlide.tsx` | 10 slide types: title, divider, stats, content grid, quote, split, timeline, team, pricing, CTA |
| Backoffice, internal tools | `docs/design-dna/templates/BackofficePage.tsx` | User management CRUD, activity log, invoices, permission matrix |
| SVG backgrounds, patterns | `docs/design-dna/templates/PatternShowcase.tsx` | 14 static SVG patterns + 8 animated backgrounds |
| Color system, typography, tokens | `docs/design-dna/templates/DesignSystemPage.tsx` | 5 color palettes, typography scale, spacing, motion, component states |

### Reusable JS Modules

These modules are **production-ready code** that can be directly adapted into any project:

- **`docs/design-dna/svg-backgrounds.js`** — 14 static SVG patterns (dots, grid, topo, circuit, hexagons, crosses, diamonds, diagonals, constellation, isometric, waves, dna, noise, triangles) + 8 animated canvas/CSS backgrounds. Import and use directly.
- **`docs/design-dna/palette.js`** — Global palette switcher widget with 5 curated palettes + dark/light mode toggle. Reference implementation for theme switching.

### How to Use Design DNA

1. **Read the matching React template** before writing any component — these are production React code, not wireframes
2. **Follow the Translation Guide** in `$SKILL_DIR/reference.md` — CSS→Tailwind token mappings, worked React example, proportion rules, 9-point verification checklist
3. **Match, don't interpret** — the DNA is the spec. Font sizes within ±1px, padding within ±2px, same border radius, same transition curves
4. **Add page animations** — every page root gets `apex-enter`, content sections get `stagger-1/2/3`, cards get `hover:-translate-y-px transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]`
5. **Use the SVG backgrounds** — reference `PatternShowcase.tsx` for all pattern/animation options
6. **Check all 5 palettes** — your implementation should work with any palette from `DesignSystemPage.tsx`
7. **Verify before done** — run the 9-point side-by-side checklist from the Translation Guide. If any item fails, fix it before reporting done
