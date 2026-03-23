export type PaletteName = "saas" | "editorial" | "fintech" | "startup" | "creative";

interface PaletteColors {
  bg: string; elevated: string; surface: string; border: string; borderHover: string;
  text: string; secondary: string; muted: string; accent: string; accentHover: string;
  accentGlow: string; success: string; warning: string; destructive: string; info: string;
}

interface Palette {
  name: string;
  dark: PaletteColors;
  light: PaletteColors;
}

export const PALETTES: Record<PaletteName, Palette> = {
  saas: {
    name: "SaaS",
    dark: { bg:"#09090b", elevated:"#18181b", surface:"#27272a", border:"#27272a", borderHover:"#3f3f46",
      text:"#fafafa", secondary:"#a1a1aa", muted:"#71717a", accent:"#3b82f6", accentHover:"#2563eb",
      accentGlow:"rgba(59,130,246,0.12)", success:"#22c55e", warning:"#eab308", destructive:"#ef4444", info:"#60a5fa" },
    light: { bg:"#fafafa", elevated:"#ffffff", surface:"#f4f4f5", border:"#e4e4e7", borderHover:"#d4d4d8",
      text:"#18181b", secondary:"#52525b", muted:"#a1a1aa", accent:"#2563eb", accentHover:"#1d4ed8",
      accentGlow:"rgba(37,99,235,0.08)", success:"#16a34a", warning:"#ca8a04", destructive:"#dc2626", info:"#2563eb" }
  },
  editorial: {
    name: "Editorial",
    dark: { bg:"#0f0d0b", elevated:"#1a1714", surface:"#24201b", border:"#2e2820", borderHover:"#3d3428",
      text:"#f5ebe0", secondary:"#b8a898", muted:"#7a6e60", accent:"#c45d3e", accentHover:"#a8492d",
      accentGlow:"rgba(196,93,62,0.12)", success:"#6bc46b", warning:"#d4a843", destructive:"#c45d3e", info:"#7cacbe" },
    light: { bg:"#faf9f6", elevated:"#ffffff", surface:"#f5f0eb", border:"#e8e0d8", borderHover:"#d4c8bc",
      text:"#1a1a1a", secondary:"#6b6560", muted:"#9c9590", accent:"#c45d3e", accentHover:"#a8492d",
      accentGlow:"rgba(196,93,62,0.06)", success:"#2d8659", warning:"#b8860b", destructive:"#c42b2b", info:"#3a7ca5" }
  },
  fintech: {
    name: "Fintech",
    dark: { bg:"#0c1222", elevated:"#131c31", surface:"#1a2540", border:"#1e2d4a", borderHover:"#2a3f66",
      text:"#e8edf5", secondary:"#8899b8", muted:"#5c6e8f", accent:"#00d4aa", accentHover:"#00b892",
      accentGlow:"rgba(0,212,170,0.12)", success:"#00d4aa", warning:"#ffb547", destructive:"#ff5c5c", info:"#60a5fa" },
    light: { bg:"#f8fafc", elevated:"#ffffff", surface:"#f1f5f9", border:"#e2e8f0", borderHover:"#cbd5e1",
      text:"#0f172a", secondary:"#475569", muted:"#94a3b8", accent:"#0d9488", accentHover:"#0f766e",
      accentGlow:"rgba(13,148,136,0.08)", success:"#0d9488", warning:"#d97706", destructive:"#dc2626", info:"#2563eb" }
  },
  startup: {
    name: "Startup",
    dark: { bg:"#0a0a0a", elevated:"#141414", surface:"#1e1e1e", border:"#282828", borderHover:"#383838",
      text:"#fafafa", secondary:"#a3a3a3", muted:"#666666", accent:"#fafafa", accentHover:"#e0e0e0",
      accentGlow:"rgba(250,250,250,0.08)", success:"#22c55e", warning:"#eab308", destructive:"#ef4444", info:"#60a5fa" },
    light: { bg:"#ffffff", elevated:"#f8f8f8", surface:"#f0f0f0", border:"#e5e5e5", borderHover:"#d4d4d4",
      text:"#0a0a0a", secondary:"#525252", muted:"#a3a3a3", accent:"#0a0a0a", accentHover:"#262626",
      accentGlow:"rgba(10,10,10,0.05)", success:"#16a34a", warning:"#ca8a04", destructive:"#dc2626", info:"#2563eb" }
  },
  creative: {
    name: "Creative",
    dark: { bg:"#1a1614", elevated:"#242018", surface:"#2e2820", border:"#3d3428", borderHover:"#524638",
      text:"#f5ebe0", secondary:"#b8a898", muted:"#7a6e60", accent:"#e07850", accentHover:"#c8603a",
      accentGlow:"rgba(224,120,80,0.12)", success:"#6bc46b", warning:"#d4a843", destructive:"#e05454", info:"#7cacbe" },
    light: { bg:"#fdf8f4", elevated:"#ffffff", surface:"#f5ede5", border:"#e8ddd2", borderHover:"#d4c5b5",
      text:"#2c1e10", secondary:"#785840", muted:"#a08870", accent:"#d4603a", accentHover:"#b84a28",
      accentGlow:"rgba(212,96,58,0.08)", success:"#2d8659", warning:"#b8860b", destructive:"#c42b2b", info:"#3a7ca5" }
  }
};

export const PALETTE_NAMES: PaletteName[] = ["saas", "editorial", "fintech", "startup", "creative"];

export const DEFAULT_PALETTES: Record<string, PaletteName> = {
  landing: "startup",
  saas: "saas",
  crm: "fintech",
  blog: "editorial",
  ecommerce: "fintech",
  backoffice: "saas",
  portfolio: "creative",
  lms: "creative",
  social: "saas",
  email: "saas",
  presentation: "startup",
  ebook: "editorial",
  "design-system": "saas",
  patterns: "creative",
};

export function applyPalette(name: PaletteName, mode: "dark" | "light") {
  const p = PALETTES[name]?.[mode];
  if (!p) return;
  const r = document.documentElement.style;
  r.setProperty("--bg", p.bg);
  r.setProperty("--bg-elevated", p.elevated);
  r.setProperty("--bg-surface", p.surface);
  r.setProperty("--border", p.border);
  r.setProperty("--border-hover", p.borderHover);
  r.setProperty("--text", p.text);
  r.setProperty("--text-secondary", p.secondary);
  r.setProperty("--text-muted", p.muted);
  r.setProperty("--accent", p.accent);
  r.setProperty("--accent-hover", p.accentHover);
  r.setProperty("--accent-glow", p.accentGlow);
  r.setProperty("--success", p.success);
  r.setProperty("--warning", p.warning);
  r.setProperty("--destructive", p.destructive);
  r.setProperty("--info", p.info);
  // Nav background with transparency
  const hexToRgb = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  };
  r.setProperty("--nav-bg", mode === "dark" ? `rgba(${hexToRgb(p.bg)},0.7)` : `rgba(${hexToRgb(p.bg)},0.85)`);
  // CTA colors (for landing page buttons)
  r.setProperty("--cta-bg", mode === "dark" ? "#ffffff" : p.text);
  r.setProperty("--cta-text", mode === "dark" ? p.bg : p.elevated);
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("apex-palette", name);
  localStorage.setItem("apex-theme", mode);
}
