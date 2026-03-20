# Recipe: Blog / Editorial

> Design DNA page: `docs/design-dna/blog.html`

## Foundation

| Setting | Value |
|---------|-------|
| **Palette** | `editorial-warm.css` |
| **Background** | topographic (static) |
| **Display font** | Instrument Serif |
| **Body font** | Inter |
| **Mood** | Warm, literary, content-focused |

## Setup Commands

```bash
cp docs/design-dna/tokens/foundation.css src/app/tokens/
cp docs/design-dna/tokens/animations.css src/app/tokens/
cp docs/design-dna/tokens/palettes/editorial-warm.css src/app/tokens/palette.css
cp docs/design-dna/starters/layout/*.tsx src/components/layout/
cp docs/design-dna/starters/primitives/*.tsx src/components/ui/
```

## Layout

| Pattern | Component | Notes |
|---------|-----------|-------|
| Navigation | `Header` | Blog header with categories |
| Content | Centered column (max-w-3xl for articles) | Reading-optimized width |

## Pages & Components

### / (home)
| Section | Components | Details |
|---------|-----------|---------|
| Featured | `Card` (large, full-width) | Hero image, category Badge, title in display font |
| Grid | `Card` grid (2-3 cols) | Thumbnail, category, title, author Avatar, date |
| Newsletter | `Input` + `Button` | Email signup with accent CTA |

### /[slug] (article)
| Section | Components | Details |
|---------|-----------|---------|
| Header | Display font title | Category Badge, date, reading time, author Avatar |
| Body | Prose styling | Drop caps, pull quotes, images with captions |
| Sidebar | Sticky TOC | Table of contents (desktop only) |
| Footer | `Card` | Author bio, related articles |
