# Tokens Page v2 — Design Spec

> "Every token you need to build. Copy, compose, ship."

## Goal

Rewrite the Design System (Tokens) page from a visual showcase into an **actionable builder reference**. A solo developer with Claude Code should be able to read this page and have everything needed to build beautiful, consistent UI — no guessing which token to use, no hunting for CSS variable names.

## Target file

`docs/design-dna/templates/DesignSystemPage.tsx` — single file rewrite, same location, same visual DNA patterns. No new dependencies.

## Sections

### 1. Hero (enhance)

Update subtitle to: "Every token you need to build. Copy, compose, ship." Keep the animated intro.

### 2. Color (enhance existing)

Current state: shows swatches with short labels like `bg`, `elevated`.

Changes:

- Display full `var(--name)` next to each swatch
- Click-to-copy on each variable name (clipboard + brief "Copied!" feedback)
- Add micro usage label under each swatch: "Page bg", "Cards & modals", "Nested containers", etc.
- Dark/light split: each swatch renders two halves showing both theme resolutions side-by-side
- Keep the curated palette strip

Token list:
| Variable | Usage |
|----------|-------|
| `--bg` | Page background |
| `--bg-elevated` | Cards, modals, popovers |
| `--bg-surface` | Nested containers inside cards |
| `--text` | Primary content, headings |
| `--text-secondary` | Descriptions, subtitles |
| `--text-muted` | Timestamps, hints, placeholders |
| `--accent` | Primary action, brand color |
| `--accent-glow` | Subtle accent backgrounds |
| `--border` | Default borders |
| `--success` | Success states, confirmations |
| `--destructive` | Errors, destructive actions |

### 3. Contrast Checker (new)

Grid of common text/background combinations. Each cell shows:

- Rendered text sample in the actual colors
- Token pair label: e.g. `--text on --bg-elevated`
- Computed contrast ratio (e.g. `12.4:1`)
- WCAG badge: AA pass (green), AA fail (red), AAA pass (gold)

Combos to check:

- `--text` on `--bg`
- `--text` on `--bg-elevated`
- `--text-secondary` on `--bg`
- `--text-secondary` on `--bg-elevated`
- `--text-muted` on `--bg`
- `--text-muted` on `--bg-elevated`
- `--text-muted` on `--bg-surface`
- `--accent` on `--bg`
- `--accent` on `--bg-elevated`

Contrast ratio computed at runtime via `getComputedStyle` + relative luminance formula (WCAG 2.1 algorithm). Updates when palette changes.

### 4. Typography (keep as-is)

Already solid: font families, type scale with specimens. No changes.

### 5. Spacing (keep as-is)

Full 4px-128px scale. No changes.

### 6. Icon Sizes (new)

5 canonical sizes with context:

| Size | Context                     | Tailwind    |
| ---- | --------------------------- | ----------- |
| 16px | Inline, badges, table cells | `w-4 h-4`   |
| 20px | Buttons, nav items          | `w-5 h-5`   |
| 24px | Section headers, standalone | `w-6 h-6`   |
| 32px | Feature cards, callouts     | `w-8 h-8`   |
| 48px | Empty states, hero sections | `w-12 h-12` |

Each renders a simple circle icon at that size with the pixel value and Tailwind class labeled. All icons inherit `currentColor`.

### 7. Motion and Transitions (enhance existing)

Keep the 8 animation demo cards.

Add a **Copy-Paste Transitions** subsection with 4 standard transitions:

| Duration | Use for                                   | CSS                                                   |
| -------- | ----------------------------------------- | ----------------------------------------------------- |
| 0.2s     | Micro: hover, focus, toggle               | `transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1)` |
| 0.3s     | Standard: dropdowns, accordion            | `transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1)` |
| 0.5s     | Layout: panel slides, page transitions    | `transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1)` |
| 0.9s     | Reveal: scroll animations, hero entrances | `transition: all 0.9s cubic-bezier(0.22, 1, 0.36, 1)` |

Each with:

- Click-to-copy the CSS string
- A live demo div that scales/moves on hover using that specific transition

### 8. States (keep as-is)

Interactive button demo + 6-state grid. No changes.

### 9. Shape + Shadow (keep as-is)

Border radius scale + shadow scale. No changes.

### 10. Z-Index Scale (new)

Visual stacked card diagram showing the layer system:

| z-index | Layer    | Use for                          |
| ------- | -------- | -------------------------------- |
| 0       | Base     | Content, cards, layout           |
| 10      | Sticky   | Sticky headers, floating labels  |
| 20      | Dropdown | Popovers, select menus, tooltips |
| 50      | Modal    | Dialogs, overlays, sheets        |
| 100     | Chrome   | App navigation, fixed toolbars   |
| 999     | Toast    | Notifications, urgent alerts     |

Rendered as overlapping cards with increasing blur/shadow to visualize depth.

### 11. Breakpoints (new)

Responsive scale reference:

| Breakpoint | Tailwind | Context                   |
| ---------- | -------- | ------------------------- |
| 640px      | `sm:`    | Mobile landscape          |
| 768px      | `md:`    | Tablet portrait           |
| 1024px     | `lg:`    | Laptop / Tablet landscape |
| 1280px     | `xl:`    | Desktop                   |
| 1536px     | `2xl:`   | Wide desktop              |

Visual: horizontal bar chart showing relative widths, each bar labeled with pixel value + Tailwind prefix.

### 12. Composition Combos (new, crown jewel)

5 live-rendered examples showing tokens working together:

**Card**: `--bg-elevated` + `--border` + `--radius` + `--shadow-sm` — rendered card with heading and text, CSS snippet below, click-to-copy

**Input**: `--bg-surface` + `--border` + `--radius-sm` + `--text` — rendered text input with placeholder, CSS snippet below, click-to-copy

**Badge**: `--accent-glow` + `--accent` + `4px radius` — small accent badge with text, CSS snippet below, click-to-copy

**Muted Block**: `--bg-surface` + `--text-muted` + `--border` — subtle info block with muted text, CSS snippet below, click-to-copy

**Glass Floating**: `--bg-elevated` + `--shadow-lg` + `backdrop-filter: blur(20px)` — elevated glass card with blur, CSS snippet below, click-to-copy

## Interactions

### Click-to-copy

- Applies to: all CSS variable names, transition strings, CSS snippets in combos
- Implementation: `navigator.clipboard.writeText(value)`
- Feedback: brief "Copied!" text replaces the value for 1.5s, then reverts
- Cursor: `pointer` on all copyable elements

### Contrast computation

- Uses `getComputedStyle(document.documentElement)` to read current theme values
- Luminance formula per WCAG 2.1: `L = 0.2126*R + 0.7152*G + 0.0722*B` (after linearizing sRGB)
- Ratio: `(L1 + 0.05) / (L2 + 0.05)` where L1 is lighter
- AA threshold: 4.5:1 for normal text
- We test against AA normal (4.5:1) — badge shows pass/fail

## Technical constraints

- Single file: `DesignSystemPage.tsx`
- No new npm dependencies
- Pure React + inline styles (matches all other DNA templates)
- All helper functions (luminance, contrast, copy) defined inside the file
- Responsive: works at 320px+ (mobile-first)
- Page target: under 600 lines
