# Design System — Detailed Reference

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
