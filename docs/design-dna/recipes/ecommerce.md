# Recipe: E-Commerce / Shop

> Design DNA page: `docs/design-dna/ecommerce.html`

## Foundation

| Setting | Value |
|---------|-------|
| **Palette** | `fintech-teal.css` |
| **Background** | hexagons (static) |
| **Display font** | Instrument Serif |
| **Body font** | Inter |
| **Mood** | Modern, trustworthy, conversion-focused |

## Setup Commands

```bash
cp docs/design-dna/tokens/foundation.css src/app/tokens/
cp docs/design-dna/tokens/animations.css src/app/tokens/
cp docs/design-dna/tokens/palettes/fintech-teal.css src/app/tokens/palette.css
cp docs/design-dna/starters/layout/*.tsx src/components/layout/
cp docs/design-dna/starters/primitives/*.tsx src/components/ui/
```

## Layout

| Pattern | Component | Notes |
|---------|-----------|-------|
| Navigation | `Header` | Logo, search, cart icon, account |
| Content | Full-width | Grid-based product layouts |

## Pages & Components

### / (shop)
| Section | Components | Details |
|---------|-----------|---------|
| Hero | `SectionHeader` + `Button` (cta) | Seasonal/featured collection |
| Categories | `Badge` row | Filter chips |
| Product grid | `Card` with `Card.Thumbnail` | Image, name, price, quick-add Button |
| Featured | `Card` (large) | Highlighted product with details |

### /product/[slug]
| Section | Components | Details |
|---------|-----------|---------|
| Gallery | Image carousel | Multiple product images |
| Details | Display font title | Price, size selector (Badge buttons), add to cart Button |
| Reviews | `Card` + `Avatar` | Rating stars, review text |

### /cart
| Section | Components | Details |
|---------|-----------|---------|
| Items | `Card` list | Image, name, quantity, price, remove |
| Summary | `Card` | Subtotal, shipping, total, checkout Button (cta) |

### /checkout
| Section | Components | Details |
|---------|-----------|---------|
| Steps | `ProgressBar` | Shipping → Payment → Review |
| Form | `Input` fields | Address, payment, grouped in Cards |
| Order summary | `Card` (sticky sidebar) | Items, total, place order Button |
