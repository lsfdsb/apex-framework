# Recipe: Presentation / Slides

> Design DNA page: `docs/design-dna/presentation.html`

## Foundation

| Setting | Value |
|---------|-------|
| **Palette** | `startup-mono.css` |
| **Background** | gradient (animated) |
| **Display font** | Instrument Serif |
| **Body font** | Inter |
| **Mood** | Impactful, minimal, storytelling |

## Setup Commands

```bash
cp docs/design-dna/tokens/foundation.css src/app/tokens/
cp docs/design-dna/tokens/animations.css src/app/tokens/
cp docs/design-dna/tokens/palettes/startup-mono.css src/app/tokens/palette.css
```

## Slide Types

| Slide | Layout | Key Elements |
|-------|--------|-------------|
| Title | Centered | Large display font, subtitle, presenter |
| Stats | 3-column | Big numbers with labels |
| Quote | Centered | Large italic serif quote, attribution |
| Content | Left text + right image | Heading, bullets, visual |
| Comparison | 2-column | Before/After or Option A/B |
| Roadmap | Timeline | Vertical or horizontal milestones |
| Team | Grid | Avatar cards with roles |
| Pricing | 3 columns | Plan cards with CTAs |
| CTA | Centered | Final action, large CTA button |
| Thank you | Centered | Contact info, social links |
