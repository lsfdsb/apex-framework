# Recipe: Portfolio / Agency

> Design DNA page: `docs/design-dna/portfolio.html`

## Foundation

| Setting | Value |
|---------|-------|
| **Palette** | `creative-warm.css` |
| **Background** | rings (animated) |
| **Display font** | Instrument Serif |
| **Body font** | Inter |
| **Mood** | Artistic, expressive, showcase |

## Setup Commands

```bash
cp docs/design-dna/tokens/foundation.css src/app/tokens/
cp docs/design-dna/tokens/animations.css src/app/tokens/
cp docs/design-dna/tokens/palettes/creative-warm.css src/app/tokens/palette.css
cp docs/design-dna/starters/layout/*.tsx src/components/layout/
cp docs/design-dna/starters/primitives/*.tsx src/components/ui/
```

## Layout

| Pattern | Component | Notes |
|---------|-----------|-------|
| Navigation | `Header` (minimal) | Logo + few links + CTA |
| Content | Full-width sections | Generous spacing, scroll-reveal |

## Sections

| Section | Components | Details |
|---------|-----------|---------|
| Hero | `SectionHeader` (centered) | Large display font, subtitle, scroll indicator |
| Projects | `Card` grid (2 cols) | Full-bleed images, hover overlay with title + Badge |
| About | Split layout (text + image) | Bio in display font, photo |
| Services | `Card` grid (3 cols) | Icon, title, description |
| Contact | `Input` fields + `Button` | Name, email, message, send |
| Footer | Minimal | Social links, copyright |
