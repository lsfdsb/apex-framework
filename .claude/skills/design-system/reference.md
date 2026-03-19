# Design System — Detailed Reference

> **IMPORTANT**: This file contains token sets and CSS patterns. For **live visual references** of complete page layouts, read the matching page from `docs/design-dna/` — see the routing table in `SKILL.md`. The Design DNA is the authoritative visual quality bar for all APEX projects.

## Font Pairing Recommendations

Choose ONE pairing per project. Never repeat across projects.

### Modern & Clean
- Display: Geist, Satoshi, Cabinet Grotesk, General Sans
- Body: Geist, Instrument Sans, Plus Jakarta Sans

### Editorial & Refined
- Display: Playfair Display, Fraunces, Newsreader
- Body: Source Serif 4, Literata, Charter

### Technical & Precise
- Display: JetBrains Mono, IBM Plex Mono, Space Mono
- Body: IBM Plex Sans, Atkinson Hyperlegible

### Warm & Friendly
- Display: Bricolage Grotesque, Outfit, Sora
- Body: Nunito Sans, DM Sans, Figtree

Load from Google Fonts or Fontsource (self-hosted, better performance).

## Color Palettes

### Generating Custom Palettes
Start with ONE accent color. Derive the rest:
- Surface: near-white or near-black with subtle hue tint
- Text: not pure black (#000) — use #1a1a2e or similar
- Accent hover: 10% darker. Accent subtle: 90% lighter.

### Tested Accessible Combos
- Dark surface (#0f172a) + Light text (#f1f5f9) + Amber accent (#f59e0b)
- Light surface (#fafaf9) + Dark text (#1c1917) + Indigo accent (#6366f1)
- Warm surface (#fffbeb) + Brown text (#44403c) + Teal accent (#14b8a6)

## Responsive Breakpoint Reference

```css
/* Mobile first — default styles are mobile */
/* sm: */ @media (min-width: 640px)  { /* Large phones, small tablets */ }
/* md: */ @media (min-width: 768px)  { /* Tablets */ }
/* lg: */ @media (min-width: 1024px) { /* Laptops */ }
/* xl: */ @media (min-width: 1280px) { /* Desktops */ }
```

## Component State Matrix

Every interactive component needs ALL of these states:
| State | Visual Treatment |
|-------|-----------------|
| Default | Base appearance |
| Hover | Subtle background shift, cursor pointer |
| Focus | 2px ring, high contrast, offset |
| Active/Pressed | Scale 0.98 or color darken |
| Disabled | Opacity 0.5, cursor not-allowed |
| Loading | Skeleton shimmer or spinner |
| Error | Red border, error icon, message |
| Success | Green check, confirmation message |
| Empty | Illustration + CTA |

## Spacing Cheat Sheet

| Use Case | Token | Value |
|----------|-------|-------|
| Icon to text | space-2 | 8px |
| Between form fields | space-4 | 16px |
| Card padding | space-6 | 24px |
| Section gap | space-12 | 48px |
| Page margin (mobile) | space-4 | 16px |
| Page margin (desktop) | space-8 | 32px |

---

## The Generic AI Look — NEVER Ship This

These patterns scream "AI made this." They are banned from every APEX project:

| Anti-Pattern | Why It's Generic | What To Do Instead |
|-------------|------------------|-------------------|
| Centered gradient hero | Every AI tool defaults to this | Asymmetric layout, typography-driven hero |
| 3-column feature grid with icons | The most common AI layout on earth | Offset layouts, alternating image/text, bento grid |
| Blue/purple gradient background | Default AI color palette | One brand accent on neutral surfaces |
| Uniform card grid | No visual hierarchy | Vary card sizes, use featured + compact |
| "Welcome to [App Name]" | Empty headline, no value proposition | Lead with what the user gets, not what the app is |
| Two CTA buttons in hero | Decision paralysis | One primary action per section |
| Stock photo header | Impersonal, seen everywhere | Custom illustration, typography art, or product screenshot |
| Inter/default sans-serif everywhere | Zero typographic personality | Choose a distinctive display font from Font Pairings above |
| Rainbow of colors | No restraint, no brand | One accent color + neutrals. That's it. |
| Shadow-heavy cards floating on white | 2019 design trend | Subtle borders, surface hierarchy through shade |

If the Design Reviewer sees any of these, it's an automatic BLOCK.

## Premium Design Patterns — What Beautiful Looks Like

### Layout
- **Asymmetric hero**: Headline left, visual right. Or full-width type with no image at all
- **Offset sections**: Image bleeds past container edge. Content doesn't always center
- **Bento grid**: Mixed card sizes (2x2 featured, 1x1 compact) instead of uniform grid
- **Breathing room**: Large sections of intentional whitespace. Let the design breathe
- **Content width**: Max 720px for reading, max 1200px for layouts. Never full-bleed text

### Typography as Design
- **Large display type**: Hero headlines at 48-72px. Let type do the work
- **Weight contrast**: Mix light (300) and bold (700) in the same section
- **Size hierarchy**: At least 3 distinct sizes on every page (display, body, caption)
- **Letter spacing**: -0.02em on large display text, +0.05em on all-caps labels

### Color Strategy
- **One accent, not five**: Pick one brand color. Use it sparingly. 90% neutrals
- **Surface depth**: 3-4 shades of your background (base, elevated, overlay, sunken)
- **Muted text**: Secondary text at 60% opacity of primary, not a separate gray
- **Color for meaning**: Green=success, red=destructive, yellow=warning. Never decorative

### Motion (CSS only, GPU-accelerated)
- Only animate `transform` and `opacity` — never `width`, `height`, `margin`, `top/left`
- Always respect `prefers-reduced-motion` — disable all motion when set
- Subtle > flashy. 200-300ms duration. Ease-out for entrances, ease-in for exits

## Curated Token Sets

Copy ONE of these into your project's `globals.css`. Each is a complete, tested palette.

### SaaS Dark (Modern dashboards, dev tools)
```css
:root {
  --bg: #09090b; --bg-elevated: #18181b; --bg-overlay: #27272a;
  --border: #27272a; --border-hover: #3f3f46;
  --text: #fafafa; --text-secondary: #a1a1aa; --text-muted: #71717a;
  --accent: #3b82f6; --accent-hover: #2563eb; --accent-subtle: #1e3a5f;
  --success: #22c55e; --destructive: #ef4444; --warning: #eab308;
  --radius: 8px; --shadow: 0 1px 3px rgb(0 0 0 / 0.3);
}
```

### Editorial Light (Content sites, blogs, portfolios)
```css
:root {
  --bg: #faf9f6; --bg-elevated: #ffffff; --bg-overlay: #f5f0eb;
  --border: #e8e0d8; --border-hover: #d4c8bc;
  --text: #1a1a1a; --text-secondary: #6b6560; --text-muted: #9c9590;
  --accent: #c45d3e; --accent-hover: #a8492d; --accent-subtle: #fdf2ee;
  --success: #2d8659; --destructive: #c42b2b; --warning: #b8860b;
  --radius: 4px; --shadow: 0 1px 2px rgb(0 0 0 / 0.06);
}
```

### Fintech Trust (Banking, finance, professional)
```css
:root {
  --bg: #0c1222; --bg-elevated: #131c31; --bg-overlay: #1a2540;
  --border: #1e2d4a; --border-hover: #2a3f66;
  --text: #e8edf5; --text-secondary: #8899b8; --text-muted: #5c6e8f;
  --accent: #00d4aa; --accent-hover: #00b892; --accent-subtle: #0a2e27;
  --success: #00d4aa; --destructive: #ff5c5c; --warning: #ffb547;
  --radius: 12px; --shadow: 0 2px 8px rgb(0 0 0 / 0.25);
}
```

### Startup Bold (Landing pages, product sites)
```css
:root {
  --bg: #ffffff; --bg-elevated: #f8f8f8; --bg-overlay: #f0f0f0;
  --border: #e5e5e5; --border-hover: #d4d4d4;
  --text: #0a0a0a; --text-secondary: #525252; --text-muted: #a3a3a3;
  --accent: #0a0a0a; --accent-hover: #262626; --accent-subtle: #f5f5f5;
  --success: #16a34a; --destructive: #dc2626; --warning: #ca8a04;
  --radius: 10px; --shadow: 0 1px 3px rgb(0 0 0 / 0.08);
}
```

### Creative Warm (Agencies, design studios, art)
```css
:root {
  --bg: #1a1614; --bg-elevated: #242018; --bg-overlay: #2e2820;
  --border: #3d3428; --border-hover: #524638;
  --text: #f5ebe0; --text-secondary: #b8a898; --text-muted: #7a6e60;
  --accent: #e07850; --accent-hover: #c8603a; --accent-subtle: #2e1e15;
  --success: #6bc46b; --destructive: #e05454; --warning: #d4a843;
  --radius: 6px; --shadow: 0 2px 6px rgb(0 0 0 / 0.3);
}
```

## Premium Animation Patterns (CSS Only)

### 1. Scroll Reveal
```css
.reveal { opacity: 0; transform: translateY(20px); transition: all 0.6s ease-out; }
.reveal.visible { opacity: 1; transform: translateY(0); }
```
```js
// IntersectionObserver — trigger .visible when element enters viewport
const observer = new IntersectionObserver(
  entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

### 2. Stagger List Items
```css
.stagger > * { opacity: 0; transform: translateY(12px); transition: all 0.4s ease-out; }
.stagger.visible > *:nth-child(1) { transition-delay: 0.05s; }
.stagger.visible > *:nth-child(2) { transition-delay: 0.1s; }
.stagger.visible > *:nth-child(3) { transition-delay: 0.15s; }
.stagger.visible > *:nth-child(4) { transition-delay: 0.2s; }
.stagger.visible > * { opacity: 1; transform: translateY(0); }
```

### 3. Text Reveal (Hero Headlines)
```css
.text-reveal span { display: inline-block; opacity: 0; transform: translateY(100%); transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.text-reveal.visible span { opacity: 1; transform: translateY(0); }
```

### 4. Magnetic Hover (Buttons, Cards)
```css
.magnetic { transition: transform 0.3s ease-out; }
.magnetic:hover { transform: translateY(-2px); }
.magnetic:active { transform: translateY(0); }
```

### 5. Smooth Page Transitions (Next.js + framer-motion)
```tsx
<AnimatePresence mode="wait">
  <motion.div key={pathname}
    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
  >{children}</motion.div>
</AnimatePresence>
```

### 6. 3D Card Tilt (CSS perspective)
```css
.tilt { transition: transform 0.3s ease; transform-style: preserve-3d; }
.tilt:hover { transform: perspective(800px) rotateX(2deg) rotateY(-2deg) scale(1.02); }
```

### 7. Skeleton Loading (No layout shift)
```css
.skeleton { background: linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-overlay) 50%, var(--bg-elevated) 75%);
  background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: var(--radius); }
@keyframes shimmer { to { background-position: -200% 0; } }
```

### 8. Subtle Parallax (CSS only)
```css
.parallax-container { perspective: 1px; overflow-y: auto; height: 100vh; }
.parallax-bg { transform: translateZ(-1px) scale(2); position: absolute; inset: 0; }
.parallax-content { transform: translateZ(0); position: relative; }
```

### Reduced Motion (MANDATORY)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

---

## DNA → React Translation Guide

The Design DNA templates are HTML/CSS references. When building React components, follow this translation process **exactly**.

### Step 1: Extract the Anatomy

Read the DNA HTML and identify:
- **Layout structure** — grid columns, flex rows, widths in px or fractions
- **Spacing** — padding, gaps, margins (convert px to Tailwind: 4px=1, 8px=2, 12px=3, 16px=4, 20px=5, 24px=6)
- **Typography** — font-size, font-weight, letter-spacing, line-height, text-transform
- **Colors** — which CSS variable is used (`var(--accent)`, `var(--text-muted)`, etc.)
- **Border radius** — `var(--radius)` = 12px, `var(--radius-sm)` = 8px, 999px = full
- **Transitions** — timing function, duration, which properties animate

### Step 2: Map CSS Variables to Tailwind Tokens

| DNA CSS Variable | Tailwind Token | Usage |
|---|---|---|
| `var(--bg)` | `bg-background` | Page background |
| `var(--bg-elevated)` | `bg-elevated` or `bg-card` | Card/panel backgrounds |
| `var(--bg-surface)` | `bg-surface` or `bg-muted` | Secondary surfaces |
| `var(--border)` | `border-border` | Default borders |
| `var(--border-hover)` | `border-border-hover` or `hover:border-muted-foreground/30` | Hover state borders |
| `var(--text)` | `text-foreground` | Primary text |
| `var(--text-secondary)` | `text-muted-foreground` | Secondary text |
| `var(--text-muted)` | `text-muted-foreground` with lower opacity | Tertiary text |
| `var(--accent)` | `text-primary` / `bg-primary` | Accent color |
| `var(--accent-glow)` | `bg-primary/10` or `hsl(var(--accent-glow))` | Subtle accent bg |
| `var(--success)` | `text-success` / `bg-success` | Success green |
| `var(--warning)` | `text-warning` / `bg-warning` | Warning yellow |
| `var(--destructive)` | `text-destructive` / `bg-destructive` | Error red |

### Step 3: Convert a DNA Section to React

**Example: DNA filter bar → React component**

DNA HTML:
```html
<div class="filter-bar">
  <div class="filter-group">
    <span class="filter-group-label">Status</span>
    <select class="filter-select">...</select>
  </div>
  <div class="filter-divider"></div>
  <div class="active-filters">
    <span class="active-filter">Hot leads <button>&times;</button></span>
  </div>
</div>
```

React translation:
```tsx
<div className="bg-elevated border border-border rounded-xl p-4 flex flex-wrap items-center gap-3">
  <div className="flex items-center gap-2">
    <span className="text-[10px] uppercase tracking-[0.06em] text-muted-foreground font-medium">
      Status
    </span>
    <select className="h-7 px-2 rounded-lg bg-background border border-border text-[11px] text-foreground">
      ...
    </select>
  </div>
  <div className="w-px h-5 bg-border" /> {/* divider */}
  <div className="flex gap-1">
    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
      Hot leads
      <button onClick={onRemove} className="hover:text-foreground">&times;</button>
    </span>
  </div>
</div>
```

### Step 4: Preserve Visual Proportions

These measurements from the DNA MUST be preserved — they are intentional design decisions:

| Element | DNA Value | Tailwind |
|---|---|---|
| Section label | `11px uppercase tracking 0.06em` | `text-[11px] uppercase tracking-[0.06em]` |
| KPI value | `24px weight 700 tracking -0.03em` | `text-2xl font-bold tracking-[-0.03em]` |
| Card padding | `16px` | `p-4` |
| Card border radius | `var(--radius-sm)` = 8px | `rounded-lg` |
| Table cell padding | `12px horizontal, 14px vertical` | `px-3 py-3.5` |
| Avatar size | `28-32px` | `w-7 h-7` to `w-8 h-8` |
| Badge | `11px, 2px 8px padding, 999px radius` | `text-[11px] px-2 py-0.5 rounded-full` |
| Transition | `0.3s cubic-bezier(0.22,1,0.36,1)` | `transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]` |

### Step 5: Page-Level Animation

Every page MUST have these APEX DNA classes:

```tsx
// Root wrapper
<div className="apex-enter">
  {/* Page header */}
  <div className="mb-6">
    <p className="apex-label">Page Title</p>
    <h1 className="font-serif italic text-3xl tracking-[-0.02em] mb-1">
      Heading here
    </h1>
    <p className="text-[15px] text-muted-foreground font-light">
      Description text
    </p>
  </div>

  {/* Content with stagger */}
  <div className="apex-enter stagger-1">
    ...content...
  </div>
</div>
```

Add these to `globals.css` or `main.css` if not present:
```css
@keyframes apex-enter {
  from { opacity: 0; transform: translateY(32px) scale(0.98); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
}
.apex-enter { animation: apex-enter 900ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.apex-label { @apply text-xs uppercase font-medium mb-3 text-primary; letter-spacing: 0.1em; }
.stagger-1 { animation-delay: 100ms; }
.stagger-2 { animation-delay: 200ms; }
.stagger-3 { animation-delay: 300ms; }
```

### Step 6: Verification Checklist

Before marking any UI task complete, open the DNA page and the built component **side by side** and check:

```
[ ] Font sizes match (±1px)
[ ] Spacing/padding match (±2px)
[ ] Border radius matches
[ ] Colors use correct tokens (no hardcoded hex)
[ ] Hover states present and match DNA transition timing
[ ] Active/selected states match DNA pattern
[ ] Typography hierarchy preserved (label → value → description)
[ ] Animations present (apex-enter on page load, hover transitions on cards)
[ ] Dark AND light mode work correctly
```

If any item fails, fix it before reporting done. The DNA is the source of truth.
