# APEX Design DNA — Tokens

Design tokens extracted from the five canonical APEX palettes. Import in TypeScript, JavaScript, or plain CSS.

## Installation

The tokens live at `docs/design-dna/tokens/` inside the APEX Framework repo. Copy the files you need into your project, or reference them directly if your project lives inside the monorepo.

```bash
# From the apex-framework root, copy tokens into your project
cp -r docs/design-dna/tokens/ your-project/src/tokens/
```

---

## Usage

### TypeScript / ESM

```typescript
import {
  palettes,
  semantic,
  spacing,
  typography,
  radii,
  shadows,
  breakpoints,
  zIndex,
  motion,
} from './tokens';
import type { PaletteName, SemanticColor } from './tokens';

// Access a palette value directly
const accentColor = palettes.creative.dark.accent; // '#e07850'

// Use semantic tokens as CSS variable strings (palette-agnostic)
const accentVar = semantic.accent; // 'var(--accent)'

// Type-safe palette selection
function getAccent(palette: PaletteName, mode: 'dark' | 'light') {
  return palettes[palette][mode].accent;
}

// Spacing
const gap = spacing[6]; // '1.5rem' (24px)

// Typography
const displayFont = typography.fontFamily.display;
const headingSize = typography.sectionHeading.fontSize; // 'clamp(32px, 5vw, 56px)'
```

### Plain JavaScript

```javascript
const { palettes, semantic, spacing } = require('./tokens');
// or ESM:
import tokens from './tokens/index.js';

const { palettes, spacing } = tokens;
console.log(palettes.saas.dark.accent); // '#3b82f6'
```

### CSS

```css
/* 1. Import the token file */
@import './tokens/index.css';

/* 2. Activate a palette on the root element */
/* Options: startup | saas | fintech | editorial | creative */
```

```html
<!-- Dark mode (default) -->
<html data-palette="saas">
  <!-- Light mode -->
  <html data-palette="saas" data-theme="light">
    <!-- No attribute = startup-mono dark (CSS :root fallback) -->
    <html></html>
  </html>
</html>
```

Then use tokens anywhere in your CSS:

```css
.card {
  background-color: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-4);
  box-shadow: var(--shadow);
  transition:
    border-color var(--duration-normal) var(--ease-out),
    transform var(--duration-normal) var(--ease-out);
}

.card:hover {
  border-color: var(--border-hover);
  transform: translateY(var(--card-hover-y));
}

.heading {
  font-family: var(--font-display);
  font-size: var(--section-heading-size);
  font-weight: var(--section-heading-weight);
  letter-spacing: var(--section-heading-tracking);
  line-height: var(--section-heading-leading);
  color: var(--text);
}

.label {
  font-size: var(--section-label-size);
  letter-spacing: var(--section-label-tracking);
  text-transform: uppercase;
  font-weight: 500;
  color: var(--accent);
}
```

### Tailwind CSS integration

Reference APEX tokens in your `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-surface': 'var(--bg-surface)',
        border: 'var(--border)',
        'border-hover': 'var(--border-hover)',
        text: 'var(--text)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        destructive: 'var(--destructive)',
        info: 'var(--info)',
      },
      fontFamily: {
        display: ["'Instrument Serif'", 'Georgia', 'serif'],
        body: ["'Inter'", '-apple-system', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
      },
      transitionTimingFunction: {
        'apex-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'apex-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
};

export default config;
```

---

## Token Reference

### Palettes

| Name        | Accent (dark)          | Accent (light)    | Best for                                   |
| ----------- | ---------------------- | ----------------- | ------------------------------------------ |
| `startup`   | `#fafafa` (white)      | `#0a0a0a` (black) | Landing pages, presentations, minimal apps |
| `saas`      | `#3b82f6` (blue)       | `#2563eb` (blue)  | SaaS dashboards, admin panels, backoffice  |
| `fintech`   | `#00d4aa` (teal)       | `#0d9488` (teal)  | CRM, e-commerce, fintech apps              |
| `editorial` | `#c45d3e` (terracotta) | `#c45d3e`         | Blogs, e-books, editorial/content          |
| `creative`  | `#e07850` (coral)      | `#d4603a` (coral) | LMS, portfolio, artistic apps              |

### Semantic tokens (CSS variables)

| Variable           | Purpose                                    |
| ------------------ | ------------------------------------------ |
| `--bg`             | Page background                            |
| `--bg-elevated`    | Cards, dropdowns, popovers                 |
| `--bg-surface`     | Inputs, table rows, recessed areas         |
| `--bg-rgb`         | RGB values of `--bg` for `rgba()` overlays |
| `--border`         | Default border color                       |
| `--border-hover`   | Border on hover/focus                      |
| `--text`           | Primary text                               |
| `--text-secondary` | Labels, secondary copy                     |
| `--text-muted`     | Placeholders, de-emphasized text           |
| `--accent`         | Brand accent — buttons, links, icons       |
| `--accent-hover`   | Accent on hover                            |
| `--accent-glow`    | Subtle accent fill / glow                  |
| `--success`        | Positive state                             |
| `--warning`        | Caution state                              |
| `--destructive`    | Danger / delete state                      |
| `--info`           | Informational state                        |
| `--cta-bg`         | CTA button background                      |
| `--cta-text`       | CTA button text                            |
| `--nav-bg`         | Frosted-glass navigation background        |

### Spacing

4px base unit. Variables: `--space-1` (4px) through `--space-64` (256px).

Key values:

- `--space-4` = 16px (card padding, input padding)
- `--space-6` = 24px (section gap)
- `--space-8` = 32px (grid gap)
- `--space-11` = 44px (minimum touch target)
- `--space-16` = 64px (section padding)

### Typography

```css
/* Font families */
--font-body:
  'Inter', -apple-system, system-ui, sans-serif --font-display: 'Instrument Serif', Georgia,
  serif --font-mono: 'JetBrains Mono', ui-monospace,
  monospace /* Section header pattern (mandatory for all DNA pages) */
    --section-heading-size: clamp(32px, 5vw, 56px) --section-heading-weight: 400
    --section-heading-tracking: -0.03em --section-heading-leading: 1.1 --section-label-size: 11px
    --section-label-tracking: 0.12em;
```

### Border radius

| Variable        | Value    | Use                         |
| --------------- | -------- | --------------------------- |
| `--radius-none` | `0`      | Square elements             |
| `--radius-sm`   | `8px`    | Inputs, badges, small cards |
| `--radius`      | `12px`   | Default cards, buttons      |
| `--radius-lg`   | `16px`   | Large cards, modals         |
| `--radius-xl`   | `24px`   | Featured cards, hero cards  |
| `--radius-full` | `9999px` | Pills, avatars, tags        |

### Shadows

| Variable         | Use                                 |
| ---------------- | ----------------------------------- |
| `--shadow-sm`    | Subtle hover lift                   |
| `--shadow`       | Default card elevation              |
| `--shadow-md`    | Modals, drawers                     |
| `--shadow-lg`    | High-elevation overlays             |
| `--shadow-glow`  | Accent-colored glow (palette-aware) |
| `--shadow-inner` | Pressed / inset states              |

### Z-index

| Variable       | Value | Use                       |
| -------------- | ----- | ------------------------- |
| `--z-base`     | `0`   | Normal document flow      |
| `--z-raised`   | `1`   | Slightly elevated (cards) |
| `--z-dropdown` | `10`  | Dropdowns, tooltips       |
| `--z-sticky`   | `20`  | Sticky headers, sidebars  |
| `--z-overlay`  | `30`  | Backdrop overlays         |
| `--z-modal`    | `40`  | Modals, dialogs           |
| `--z-toast`    | `50`  | Toast notifications       |
| `--z-widget`   | `200` | Design settings widget    |

### Breakpoints

| Variable   | px       | Use                     |
| ---------- | -------- | ----------------------- |
| `--bp-xs`  | `320px`  | Minimum supported width |
| `--bp-sm`  | `640px`  | Mobile landscape        |
| `--bp-md`  | `768px`  | Tablet                  |
| `--bp-lg`  | `1024px` | Desktop                 |
| `--bp-xl`  | `1280px` | Wide desktop            |
| `--bp-2xl` | `1440px` | Max content width       |

### Motion

```css
--ease-out: cubic-bezier(0.22, 1, 0.36, 1) /* APEX default */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1) /* spring/bounce */ --ease-in-out: ease-in-out
  --duration-fast: 150ms /* hover, focus rings */ --duration-normal: 300ms /* default transitions */
  --duration-slow: 500ms /* page-level */ --duration-slower: 900ms /* dramatic reveals */;
```

---

## Switching palettes at runtime

```typescript
// React example — switch palette and mode
function applyPalette(name: PaletteName, mode: 'dark' | 'light') {
  document.documentElement.setAttribute('data-palette', name);
  document.documentElement.setAttribute('data-theme', mode);
  localStorage.setItem('apex-palette', name);
  localStorage.setItem('apex-theme', mode);
}

// Restore on load
const saved = (localStorage.getItem('apex-palette') as PaletteName) ?? 'creative';
const savedMode = localStorage.getItem('apex-theme') ?? 'dark';
applyPalette(saved, savedMode as 'dark' | 'light');
```

---

## Design Rules (from APEX Constitution)

1. **Design tokens only** — Never hardcode Tailwind palette colors (`blue-500`, `purple-600`). Always use semantic tokens: `accent`, `text`, `bg`, etc.
2. **Both themes from day one** — Dark and light mode must work when you start, not as an afterthought.
3. **Mobile-first** — Design for 320px, enhance up. Test at 320px, 768px, 1280px.
4. **No background shorthand** — Use `background-color: var(--bg)` not `background: var(--bg)`. The shorthand resets `background-image`, breaking dot patterns and animated backgrounds.

---

## File index

| File                          | Purpose                                                             |
| ----------------------------- | ------------------------------------------------------------------- |
| `index.ts`                    | TypeScript definitions with full types — for TS/React projects      |
| `index.js`                    | Plain JS (ESM + CJS dual) — for non-TS projects and CDN use         |
| `index.css`                   | CSS custom properties — import once at app root                     |
| `foundation.css`              | Foundation-only CSS (no palette) — used by individual palette files |
| `animations.css`              | APEX animation classes: `.apex-enter`, `.reveal`, `.skeleton`, etc. |
| `palettes/startup-mono.css`   | Startup Mono palette standalone                                     |
| `palettes/saas-blue.css`      | SaaS Blue palette standalone                                        |
| `palettes/fintech-teal.css`   | Fintech Teal palette standalone                                     |
| `palettes/editorial-warm.css` | Editorial Warm palette standalone                                   |
| `palettes/creative-warm.css`  | Creative Warm palette standalone                                    |
