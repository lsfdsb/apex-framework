# Recipe: Landing Page / Marketing

> Design DNA page: `docs/design-dna/landing.html`

## Foundation

| Setting | Value |
|---------|-------|
| **Palette** | `startup-mono.css` |
| **Background** | constellation (animated) |
| **Display font** | Instrument Serif |
| **Body font** | Inter |
| **Mood** | Bold, minimal, high-impact |

## Setup Commands

```bash
cp docs/design-dna/tokens/foundation.css src/app/tokens/
cp docs/design-dna/tokens/animations.css src/app/tokens/
cp docs/design-dna/tokens/palettes/startup-mono.css src/app/tokens/palette.css
cp docs/design-dna/starters/layout/*.tsx src/components/layout/
cp docs/design-dna/starters/primitives/*.tsx src/components/ui/
```

## Layout

| Pattern | Component | Notes |
|---------|-----------|-------|
| Navigation | `Header` (sticky, blur backdrop) | No sidebar — header only |
| Content | Full-width sections | Each section = 100vh or min-height |
| Mobile | `Header` collapses to hamburger | No bottom tabs |

## Sections (scroll-based, one page)

| Section | Components | Details |
|---------|-----------|---------|
| Hero | `SectionHeader` (centered) + `Button` (cta) | Display font headline, subtext, CTA pill button |
| Bento grid | `Card` (no hover) | 2x3 or 3x2 feature cards with icons |
| Social proof | `Avatar` row + text | "Trusted by 10,000+ teams" |
| Features | `SectionHeader` + `Card` grid | 3-column, icon + title + description |
| Testimonials | `Card` | Quote, Avatar, name, role |
| Pricing | `Card` (3 columns) | Free/Pro/Enterprise with Badge highlights |
| CTA | `SectionHeader` + `Button` (cta) | Final conversion section |
| Footer | Custom | Links grid, social icons, copyright |
