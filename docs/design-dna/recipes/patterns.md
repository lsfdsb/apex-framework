# Recipe: SVG Patterns & Animated Backgrounds

> Design DNA page: `docs/design-dna/patterns.html`
> JS module: `docs/design-dna/svg-backgrounds.js`

## Foundation

| Setting | Value |
|---------|-------|
| **Source** | `svg-backgrounds.js` — 14 static + 8 animated |
| **Component** | `DnaBackground` (React wrapper) |
| **Mood** | Set by pattern choice — see app-type table below |

## Setup Commands

```bash
# Copy the React component into your project
cp docs/design-dna/starters/primitives/DnaBackground.tsx src/components/ui/

# The raw JS source (for reference or non-React use)
# docs/design-dna/svg-backgrounds.js
```

## When to Use SVG Patterns

Use backgrounds to add depth and personality without visual noise. Apply them to:

- **Hero sections** — high-impact first impression
- **Auth pages** — transforms a bare login card into a branded surface
- **Empty states** — prevents dead-white areas in dashboards and lists
- **Section separators** — subtle texture change between page sections
- **Full-page layouts** — when the content is sparse (forms, settings, single cards)

Do NOT use animated backgrounds on:
- Data-dense tables or kanban boards (distracts from content)
- Pages where the user performs sustained reading
- Any component that appears inside a modal or drawer

## Pattern → App Type Table

| Pattern | Best for | Mood |
|---------|----------|------|
| `dots` | SaaS dashboard, backoffice | Clean, minimal, professional |
| `grid` | CRM, admin tools | Structured, technical |
| `topo` | Portfolio, agency, landing | Organic, creative |
| `circuit` | Fintech, security, dev tools | Technical, precise |
| `hexagons` | Data science, analytics | Systematic, data-forward |
| `crosses` | Editorial, blog | Quiet, typographic |
| `diamonds` | E-commerce, luxury | Premium, geometric |
| `diagonals` | Presentation, slides | Dynamic, directional |
| `constellation` | Landing, marketing | Cosmic, aspirational |
| `isometric` | Architecture, engineering tools | Dimensional, structured |
| `waves` | LMS, wellness apps | Fluid, calming |
| `dna` | Health, biotech, research | Scientific, thematic |
| `noise` | Creative portfolio, art tools | Analog, textured |
| `triangles` | Startup landing, modern SaaS | Energetic, forward-looking |

## Animated Backgrounds → App Type Table

| Animation | Best for | Performance notes |
|-----------|----------|-------------------|
| `orbs` | Landing hero, auth pages | Low CPU — CSS only |
| `aurora` | Premium SaaS, portfolio hero | Low CPU — CSS gradient |
| `particles` | Fintech, data platforms | Medium — canvas RAF |
| `gradient-mesh` | Creative tools, design apps | Low CPU — CSS only |
| `rings` | Feature spotlights, empty states | Low CPU — CSS only |
| `matrix` | Dev tools, security, terminal | High — canvas RAF |
| `nebula` | Cosmic/space themes, landing | Medium — canvas RAF |
| `spotlight` | Auth pages, focused CTAs | Low CPU — CSS only |

Rules:
- Canvas-based animations (`particles`, `matrix`, `nebula`) must be gated with `prefers-reduced-motion`
- CSS-only animations (`orbs`, `aurora`, `rings`, `gradient-mesh`, `spotlight`) are safe by default but still check reduced motion for courtesy
- Never use more than one animated background per page

## DnaBackground Component Usage

```tsx
import { DnaBackground } from '@/components/ui/DnaBackground'

// Static pattern — zero runtime cost
<DnaBackground pattern="dots" opacity={0.4} />

// Animated background — add prefers-reduced-motion check
<DnaBackground
  pattern="orbs"
  animated
  className="fixed inset-0 -z-10"
/>
```

### Opacity Guidelines

| Context | Opacity |
|---------|---------|
| Full-page background (light mode) | 0.3–0.4 |
| Full-page background (dark mode) | 0.15–0.25 |
| Hero section accent | 0.5–0.6 |
| Empty state texture | 0.2–0.3 |

## Combining Patterns with the Palette Switcher

The `DnaBackground` pattern color inherits from `--color-border` by default, ensuring automatic palette compatibility. When using a custom color:

1. Use a CSS variable from the current palette — never a hardcoded hex
2. Test all 5 palettes (SaaS, Editorial, Fintech, Startup, Creative) to confirm contrast
3. Test both dark and light modes

## Personality-Matched Combos (from DNA showcase)

These pairings are used in the Design DNA showcase and serve as reference quality:

| Page type | Pattern | Palette |
|-----------|---------|---------|
| Landing | `constellation` (animated) | startup-mono |
| SaaS dashboard | `dots` | saas-blue |
| CRM | `grid` | fintech-teal |
| E-commerce | `diamonds` | editorial-warm |
| Blog | `crosses` | editorial-warm |
| Portfolio | `topo` | creative-warm |
| LMS | `waves` | saas-blue |
| Backoffice | `grid` | fintech-teal |
| Auth/login | `orbs` (animated) | any |
| Empty states | `rings` (animated) | any |
