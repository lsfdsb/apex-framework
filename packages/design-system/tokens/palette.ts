/**
 * APEX Design DNA — Palette Loader
 *
 * Each app imports its palette CSS at the root layout level.
 * This module exports palette metadata for programmatic use.
 *
 * Usage in app layout:
 *   import '@apex/design-system/tokens/palettes/saas-blue.css';
 *   import '@apex/design-system/tokens/bridge.css';
 *   import '@apex/design-system/tokens/foundation.css';
 */

export const PALETTES = {
  'saas-blue': {
    name: 'SaaS Blue',
    description: 'SaaS dashboards, backoffice, admin panels',
    accent: '#3b82f6',
    cssFile: 'palettes/saas-blue.css',
  },
  'creative-warm': {
    name: 'Creative Warm',
    description: 'LMS, portfolio, artistic/creative apps',
    accent: '#e07850',
    cssFile: 'palettes/creative-warm.css',
  },
  'startup-mono': {
    name: 'Startup Mono',
    description: 'Landing pages, presentations, minimal apps',
    accent: '#fafafa',
    cssFile: 'palettes/startup-mono.css',
  },
  'fintech-teal': {
    name: 'Fintech Teal',
    description: 'CRM, e-commerce, fintech apps',
    accent: '#00d4aa',
    cssFile: 'palettes/fintech-teal.css',
  },
  'editorial-warm': {
    name: 'Editorial Warm',
    description: 'Blogs, e-books, editorial/content apps',
    accent: '#c45d3e',
    cssFile: 'palettes/editorial-warm.css',
  },
} as const;

export type PaletteName = keyof typeof PALETTES;
