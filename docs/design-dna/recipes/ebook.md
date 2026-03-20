# Recipe: E-Book / Long-Form Content

> Design DNA page: `docs/design-dna/ebook.html`

## Foundation

| Setting | Value |
|---------|-------|
| **Palette** | `editorial-warm.css` |
| **Background** | none |
| **Display font** | Instrument Serif |
| **Body font** | Inter |
| **Mood** | Literary, immersive, focused reading |

## Setup Commands

```bash
cp docs/design-dna/tokens/foundation.css src/app/tokens/
cp docs/design-dna/tokens/animations.css src/app/tokens/
cp docs/design-dna/tokens/palettes/editorial-warm.css src/app/tokens/palette.css
```

## Page Types

| Page | Layout | Key Elements |
|------|--------|-------------|
| Cover | Full-screen centered | Large serif title, author, decorative element |
| TOC | Single column | Chapter list with page numbers |
| Chapter start | Full-screen | Chapter number (large), title, opening quote |
| Reading page | Centered prose (max-w-2xl) | Drop caps, sidenotes, pull quotes |
| Image page | Full-bleed | Caption below, credit text |
| End matter | Single column | Notes, bibliography, about author |

## Typography Rules

- Body text: 16-18px, 1.8 line-height, max-width 38em
- Drop caps: first letter of chapter, 3-line height, display font
- Pull quotes: display font italic, larger size, accent color border
- Sidenotes: smaller text, muted color, positioned in margin on desktop
- Chapter headings: display font, clamp(32px, 5vw, 48px)
