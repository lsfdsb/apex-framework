/**
 * APEX Design DNA — Token Definitions (TypeScript)
 * Extract from the five canonical palettes + foundation.css
 * by Bueno & Claude · São Paulo, 2026
 *
 * Usage:
 *   import { palettes, semantic, spacing, typography, radii, shadows, breakpoints, zIndex } from '@apex/tokens';
 */

// ---------------------------------------------------------------------------
// Palette definitions — 5 curated APEX palettes, each with dark + light modes
// ---------------------------------------------------------------------------

export const palettes = {
  /** Minimal/monochrome. Best for: landing pages, presentations, minimal apps. */
  startup: {
    dark: {
      bg: '#0a0a0a',
      bgElevated: '#141414',
      bgSurface: '#1e1e1e',
      bgRgb: '10,10,10',
      border: '#282828',
      borderHover: '#383838',
      text: '#fafafa',
      textSecondary: '#a3a3a3',
      textMuted: '#666666',
      accent: '#fafafa',
      accentHover: '#e0e0e0',
      accentGlow: 'rgba(250,250,250,0.08)',
      success: '#22c55e',
      successRgb: '34,197,94',
      warning: '#eab308',
      warningRgb: '234,179,8',
      destructive: '#ef4444',
      destructiveRgb: '239,68,68',
      info: '#60a5fa',
      infoRgb: '96,165,250',
      ctaBg: '#ffffff',
      ctaText: '#0a0a0a',
    },
    light: {
      bg: '#ffffff',
      bgElevated: '#f8f8f8',
      bgSurface: '#f0f0f0',
      bgRgb: '255,255,255',
      border: '#e5e5e5',
      borderHover: '#d4d4d4',
      text: '#0a0a0a',
      textSecondary: '#525252',
      textMuted: '#a3a3a3',
      accent: '#0a0a0a',
      accentHover: '#262626',
      accentGlow: 'rgba(10,10,10,0.05)',
      success: '#16a34a',
      successRgb: '22,163,74',
      warning: '#ca8a04',
      warningRgb: '202,138,4',
      destructive: '#dc2626',
      destructiveRgb: '220,38,38',
      info: '#2563eb',
      infoRgb: '37,99,235',
      ctaBg: '#0a0a0a',
      ctaText: '#ffffff',
    },
  },

  /** Blue/zinc. Best for: SaaS dashboards, backoffice, admin panels. */
  saas: {
    dark: {
      bg: '#09090b',
      bgElevated: '#18181b',
      bgSurface: '#27272a',
      bgRgb: '9,9,11',
      border: '#27272a',
      borderHover: '#3f3f46',
      text: '#fafafa',
      textSecondary: '#a1a1aa',
      textMuted: '#71717a',
      accent: '#3b82f6',
      accentHover: '#2563eb',
      accentGlow: 'rgba(59,130,246,0.12)',
      success: '#22c55e',
      successRgb: '34,197,94',
      warning: '#eab308',
      warningRgb: '234,179,8',
      destructive: '#ef4444',
      destructiveRgb: '239,68,68',
      info: '#60a5fa',
      infoRgb: '96,165,250',
      ctaBg: '#ffffff',
      ctaText: '#09090b',
    },
    light: {
      bg: '#fafafa',
      bgElevated: '#ffffff',
      bgSurface: '#f4f4f5',
      bgRgb: '250,250,250',
      border: '#e4e4e7',
      borderHover: '#d4d4d8',
      text: '#18181b',
      textSecondary: '#52525b',
      textMuted: '#a1a1aa',
      accent: '#2563eb',
      accentHover: '#1d4ed8',
      accentGlow: 'rgba(37,99,235,0.08)',
      success: '#16a34a',
      successRgb: '22,163,74',
      warning: '#ca8a04',
      warningRgb: '202,138,4',
      destructive: '#dc2626',
      destructiveRgb: '220,38,38',
      info: '#2563eb',
      infoRgb: '37,99,235',
      ctaBg: '#18181b',
      ctaText: '#fafafa',
    },
  },

  /** Teal/navy. Best for: CRM, e-commerce, fintech apps. */
  fintech: {
    dark: {
      bg: '#0c1222',
      bgElevated: '#131c31',
      bgSurface: '#1a2540',
      bgRgb: '12,18,34',
      border: '#1e2d4a',
      borderHover: '#2a3f66',
      text: '#e8edf5',
      textSecondary: '#8899b8',
      textMuted: '#5c6e8f',
      accent: '#00d4aa',
      accentHover: '#00b892',
      accentGlow: 'rgba(0,212,170,0.12)',
      success: '#00d4aa',
      successRgb: '0,212,170',
      warning: '#ffb547',
      warningRgb: '255,181,71',
      destructive: '#ff5c5c',
      destructiveRgb: '255,92,92',
      info: '#60a5fa',
      infoRgb: '96,165,250',
      ctaBg: '#ffffff',
      ctaText: '#0c1222',
    },
    light: {
      bg: '#f8fafc',
      bgElevated: '#ffffff',
      bgSurface: '#f1f5f9',
      bgRgb: '248,250,252',
      border: '#e2e8f0',
      borderHover: '#cbd5e1',
      text: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
      accent: '#0d9488',
      accentHover: '#0f766e',
      accentGlow: 'rgba(13,148,136,0.08)',
      success: '#0d9488',
      successRgb: '13,148,136',
      warning: '#d97706',
      warningRgb: '217,119,6',
      destructive: '#dc2626',
      destructiveRgb: '220,38,38',
      info: '#2563eb',
      infoRgb: '37,99,235',
      ctaBg: '#0f172a',
      ctaText: '#f8fafc',
    },
  },

  /** Terracotta/sepia. Best for: blogs, e-books, editorial/content apps. */
  editorial: {
    dark: {
      bg: '#0f0d0b',
      bgElevated: '#1a1714',
      bgSurface: '#24201b',
      bgRgb: '15,13,11',
      border: '#2e2820',
      borderHover: '#3d3428',
      text: '#f5ebe0',
      textSecondary: '#b8a898',
      textMuted: '#7a6e60',
      accent: '#c45d3e',
      accentHover: '#a8492d',
      accentGlow: 'rgba(196,93,62,0.12)',
      success: '#6bc46b',
      successRgb: '107,196,107',
      warning: '#d4a843',
      warningRgb: '212,168,67',
      destructive: '#c45d3e',
      destructiveRgb: '196,93,62',
      info: '#7cacbe',
      infoRgb: '124,172,190',
      ctaBg: '#ffffff',
      ctaText: '#0f0d0b',
    },
    light: {
      bg: '#faf9f6',
      bgElevated: '#ffffff',
      bgSurface: '#f5f0eb',
      bgRgb: '250,249,246',
      border: '#e8e0d8',
      borderHover: '#d4c8bc',
      text: '#1a1a1a',
      textSecondary: '#6b6560',
      textMuted: '#9c9590',
      accent: '#c45d3e',
      accentHover: '#a8492d',
      accentGlow: 'rgba(196,93,62,0.06)',
      success: '#2d8659',
      successRgb: '45,134,89',
      warning: '#b8860b',
      warningRgb: '184,134,11',
      destructive: '#c42b2b',
      destructiveRgb: '196,43,43',
      info: '#3a7ca5',
      infoRgb: '58,124,165',
      ctaBg: '#1a1a1a',
      ctaText: '#faf9f6',
    },
  },

  /** Coral/warm-dark. Best for: LMS, portfolio, artistic/creative apps. */
  creative: {
    dark: {
      bg: '#1a1614',
      bgElevated: '#242018',
      bgSurface: '#2e2820',
      bgRgb: '26,22,20',
      border: '#3d3428',
      borderHover: '#524638',
      text: '#f5ebe0',
      textSecondary: '#b8a898',
      textMuted: '#7a6e60',
      accent: '#e07850',
      accentHover: '#c8603a',
      accentGlow: 'rgba(224,120,80,0.12)',
      success: '#6bc46b',
      successRgb: '107,196,107',
      warning: '#d4a843',
      warningRgb: '212,168,67',
      destructive: '#e05454',
      destructiveRgb: '224,84,84',
      info: '#7cacbe',
      infoRgb: '124,172,190',
      ctaBg: '#ffffff',
      ctaText: '#1a1614',
    },
    light: {
      bg: '#fdf8f4',
      bgElevated: '#ffffff',
      bgSurface: '#f5ede5',
      bgRgb: '253,248,244',
      border: '#e8ddd2',
      borderHover: '#d4c5b5',
      text: '#2c1e10',
      textSecondary: '#785840',
      textMuted: '#a08870',
      accent: '#d4603a',
      accentHover: '#b84a28',
      accentGlow: 'rgba(212,96,58,0.08)',
      success: '#2d8659',
      successRgb: '45,134,89',
      warning: '#b8860b',
      warningRgb: '184,134,11',
      destructive: '#c42b2b',
      destructiveRgb: '196,43,43',
      info: '#3a7ca5',
      infoRgb: '58,124,165',
      ctaBg: '#2c1e10',
      ctaText: '#fdf8f4',
    },
  },
} as const;

// ---------------------------------------------------------------------------
// Semantic color tokens — CSS variable references (palette-agnostic)
// ---------------------------------------------------------------------------

export const semantic = {
  /** Page background */
  bg: 'var(--bg)',
  /** Elevated surface (cards, dropdowns) */
  bgElevated: 'var(--bg-elevated)',
  /** Recessed surface (inputs, table rows) */
  bgSurface: 'var(--bg-surface)',
  /** Default border */
  border: 'var(--border)',
  /** Hover-state border */
  borderHover: 'var(--border-hover)',
  /** Primary text */
  text: 'var(--text)',
  /** Secondary / label text */
  textSecondary: 'var(--text-secondary)',
  /** Placeholder / de-emphasized text */
  textMuted: 'var(--text-muted)',
  /** Brand accent */
  accent: 'var(--accent)',
  /** Accent on hover */
  accentHover: 'var(--accent-hover)',
  /** Subtle accent glow / fill */
  accentGlow: 'var(--accent-glow)',
  /** Positive/success state */
  success: 'var(--success)',
  /** Caution/warning state */
  warning: 'var(--warning)',
  /** Danger/destructive state */
  destructive: 'var(--destructive)',
  /** Informational state */
  info: 'var(--info)',
  /** CTA button background */
  ctaBg: 'var(--cta-bg)',
  /** CTA button text */
  ctaText: 'var(--cta-text)',
} as const;

// ---------------------------------------------------------------------------
// Spacing scale — 4px base unit
// ---------------------------------------------------------------------------

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px  (minimum touch target)
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  48: '12rem',      // 192px
  56: '14rem',      // 224px
  64: '16rem',      // 256px
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const typography = {
  fontFamily: {
    /** APEX display — Instrument Serif (editorial, expressive headings) */
    display: "'Instrument Serif', Georgia, 'Times New Roman', serif",
    /** APEX body — Inter (clean, readable UI text) */
    body: "'Inter', -apple-system, system-ui, sans-serif",
    /** APEX mono — JetBrains Mono (code, technical content) */
    mono: "'JetBrains Mono', ui-monospace, monospace",
  },
  fontSize: {
    '2xs': '0.625rem',   // 10px
    xs: '0.6875rem',     // 11px  — labels, tags
    sm: '0.8125rem',     // 13px  — nav links, captions
    base: '0.875rem',    // 14px  — body default
    md: '1rem',          // 16px  — comfortable reading
    lg: '1.125rem',      // 18px
    xl: '1.25rem',       // 20px  — card titles
    '2xl': '1.5rem',     // 24px  — section subtitles
    '3xl': '1.875rem',   // 30px  — page subtitles
    '4xl': '2.25rem',    // 36px  — section headings
    '5xl': '3rem',       // 48px  — hero headings
    '6xl': '3.75rem',    // 60px  — display
    '7xl': '4.5rem',     // 72px  — display large
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    none: '1',
    tight: '1.1',
    snug: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.04em',
    tight: '-0.03em',
    normal: '0em',
    label: '0.08em',
    wide: '0.1em',
    wider: '0.12em',
    widest: '0.15em',
  },
  /** Section heading pattern — matches DNA section-header */
  sectionHeading: {
    fontSize: 'clamp(32px, 5vw, 56px)',
    fontWeight: '400',
    letterSpacing: '-0.03em',
    lineHeight: '1.1',
  },
  /** Section label pattern — small all-caps above headings */
  sectionLabel: {
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
  },
} as const;

// ---------------------------------------------------------------------------
// Border radius scale
// ---------------------------------------------------------------------------

export const radii = {
  none: '0',
  sm: '8px',
  DEFAULT: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  full: '9999px',
} as const;

// ---------------------------------------------------------------------------
// Shadow definitions
// ---------------------------------------------------------------------------

export const shadows = {
  none: 'none',
  /** Subtle card elevation */
  sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
  /** Default card / dropdown */
  DEFAULT: '0 4px 16px rgba(0,0,0,0.12)',
  /** Modal / drawer */
  md: '0 8px 32px rgba(0,0,0,0.18)',
  /** Overlay / sheet */
  lg: '0 12px 48px rgba(0,0,0,0.25)',
  /** Accent glow (uses CSS var — palette-aware) */
  glow: '0 0 20px var(--accent-glow)',
  /** Inset — pressed states */
  inner: 'inset 0 2px 4px rgba(0,0,0,0.06)',
} as const;

// ---------------------------------------------------------------------------
// Breakpoints (min-width, px)
// ---------------------------------------------------------------------------

export const breakpoints = {
  /** Minimum supported width */
  xs: 320,
  /** Mobile landscape / large phone */
  sm: 640,
  /** Tablet */
  md: 768,
  /** Desktop */
  lg: 1024,
  /** Wide desktop */
  xl: 1280,
  /** Max content width */
  '2xl': 1440,
} as const;

// ---------------------------------------------------------------------------
// Z-index scale
// ---------------------------------------------------------------------------

export const zIndex = {
  base: 0,
  raised: 1,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
  /** Design widget — always on top */
  widget: 200,
} as const;

// ---------------------------------------------------------------------------
// Motion / easing
// ---------------------------------------------------------------------------

export const motion = {
  easing: {
    /** APEX default — snappy decelerate */
    out: 'cubic-bezier(0.22, 1, 0.36, 1)',
    /** Spring — playful overshoot */
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    /** Standard in-out */
    inOut: 'ease-in-out',
  },
  duration: {
    /** Micro-interactions (hover, focus) */
    fast: '150ms',
    /** Default transitions */
    normal: '300ms',
    /** Page-level animations */
    slow: '500ms',
    /** Dramatic reveals */
    slower: '900ms',
  },
} as const;

// ---------------------------------------------------------------------------
// Sidebar dimensions
// ---------------------------------------------------------------------------

export const sidebar = {
  width: '220px',
  collapsedWidth: '64px',
} as const;

// ---------------------------------------------------------------------------
// Derived types
// ---------------------------------------------------------------------------

export type PaletteName = keyof typeof palettes;
export type PaletteMode = 'dark' | 'light';
export type PaletteTokens = (typeof palettes)[PaletteName][PaletteMode];
export type SemanticColor = keyof typeof semantic;
export type SpacingKey = keyof typeof spacing;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type Radius = keyof typeof radii;
export type Shadow = keyof typeof shadows;
export type Breakpoint = keyof typeof breakpoints;
export type ZIndexLayer = keyof typeof zIndex;
export type MotionEasing = keyof typeof motion.easing;
export type MotionDuration = keyof typeof motion.duration;

// ---------------------------------------------------------------------------
// Convenience: default export (all tokens in one object)
// ---------------------------------------------------------------------------

const tokens = {
  palettes,
  semantic,
  spacing,
  typography,
  radii,
  shadows,
  breakpoints,
  zIndex,
  motion,
  sidebar,
} as const;

export default tokens;
