// Copy this file into your app and customize
// DNA source: docs/design-dna/design-system.html
// Palette: bg=#08080a, elevated=#111114, accent=#636bf0, font=Inter + Instrument Serif

import React, { useEffect, useState, useCallback } from "react";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const dnaStyles = `
.reveal{opacity:0;transform:translateY(32px) scale(0.98);filter:blur(4px);transition:all .9s cubic-bezier(0.22,1,0.36,1)}
.reveal.visible{opacity:1;transform:none;filter:none}
.reveal-delay-1{transition-delay:.1s}.reveal-delay-2{transition-delay:.2s}.reveal-delay-3{transition-delay:.3s}
.ds-swatch-color{height:64px;border-radius:var(--radius-sm,8px);border:1px solid var(--border);margin-bottom:6px;transition:transform .3s cubic-bezier(0.22,1,0.36,1)}
.ds-swatch-color:hover{transform:scale(1.08)}
.ds-space-box{background:var(--accent-glow);border:1px solid var(--accent);border-radius:4px;transition:transform .3s}
.ds-space-box:hover{transform:scale(1.1)}
.ds-motion-card{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius,12px);padding:24px;text-align:center;cursor:pointer}
.ds-motion-card:hover .ds-motion-demo{animation-play-state:running!important}
.ds-motion-demo{width:40px;height:40px;background:var(--accent);border-radius:8px;margin:0 auto 16px;animation-play-state:paused}
@keyframes ds-fade{0%,100%{opacity:.2}50%{opacity:1}}
@keyframes ds-slide{0%,100%{transform:translateY(12px)}50%{transform:translateY(-12px)}}
@keyframes ds-scale{0%,100%{transform:scale(.7)}50%{transform:scale(1.1)}}
@keyframes ds-blur{0%,100%{filter:blur(6px);opacity:.3}50%{filter:blur(0);opacity:1}}
@keyframes ds-bounce{0%,100%{transform:translateY(0)}30%{transform:translateY(-16px)}50%{transform:translateY(-4px)}70%{transform:translateY(-10px)}}
@keyframes ds-pulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 var(--accent-glow)}50%{transform:scale(1.05);box-shadow:0 0 0 12px transparent}}
@keyframes ds-morph{0%,100%{border-radius:8px}50%{border-radius:50%}}
@keyframes ds-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
.ds-state-chip{padding:10px 24px;border-radius:var(--radius-sm,8px);font-size:13px;font-weight:500;border:none;display:inline-flex;align-items:center;gap:8px}
.ds-live-btn{padding:10px 28px;border-radius:var(--radius-sm,8px);font-size:14px;font-weight:500;cursor:pointer;border:none;background:var(--accent);color:white;transition:all .3s cubic-bezier(0.22,1,0.36,1);outline:none}
.ds-live-btn:hover{background:var(--accent-hover);transform:translateY(-2px)}
.ds-live-btn:focus-visible{box-shadow:0 0 0 3px var(--accent-glow)}
.ds-live-btn:active{transform:scale(.96)}
.ds-radius-box{width:80px;height:80px;background:var(--bg-elevated);border:1px solid var(--border);margin-bottom:8px;transition:transform .3s}
.ds-radius-box:hover{transform:scale(1.08)}
.ds-shadow-box{width:100px;height:100px;background:var(--bg-elevated);border-radius:var(--radius,12px);margin-bottom:8px;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text-muted);font-family:var(--font-mono)}
.ds-strip{display:grid;grid-template-columns:repeat(5,1fr);gap:2px;border-radius:var(--radius,12px);overflow:hidden;margin-bottom:8px}
.ds-strip-cell{height:80px;display:flex;align-items:flex-end;padding:8px;font-size:10px;font-family:var(--font-mono)}
@media(max-width:768px){.ds-motion-grid{grid-template-columns:repeat(2,1fr)!important}.ds-states-grid{grid-template-columns:repeat(3,1fr)!important}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}.reveal{opacity:1;transform:none;filter:none}}
`;

const motions = [
  { name: "Fade", timing: "opacity 0→1", anim: "ds-fade 2s ease-in-out infinite" },
  { name: "Slide", timing: "translateY", anim: "ds-slide 2s cubic-bezier(0.22,1,0.36,1) infinite" },
  { name: "Scale", timing: "scale 0.7→1.1", anim: "ds-scale 2s cubic-bezier(0.22,1,0.36,1) infinite" },
  { name: "Blur Focus", timing: "blur 6px→0", anim: "ds-blur 2.5s cubic-bezier(0.22,1,0.36,1) infinite" },
  { name: "Bounce", timing: "spring physics", anim: "ds-bounce 1.5s cubic-bezier(0.22,1,0.36,1) infinite" },
  { name: "Pulse", timing: "scale + glow", anim: "ds-pulse 2s ease-in-out infinite" },
  { name: "Morph", timing: "radius 8→50%", anim: "ds-morph 3s cubic-bezier(0.22,1,0.36,1) infinite" },
  { name: "Rotate", timing: "360° linear", anim: "ds-rotate 3s linear infinite" },
];
const radii = [0, 4, 8, 12, 16, 999];
const shadows = [
  { label: "xs", val: "0 1px 2px rgba(0,0,0,0.1)" }, { label: "sm", val: "0 2px 8px rgba(0,0,0,0.12)" },
  { label: "md", val: "0 4px 16px rgba(0,0,0,0.15)" }, { label: "lg", val: "0 8px 32px rgba(0,0,0,0.18)" },
  { label: "xl", val: "0 16px 48px rgba(0,0,0,0.22)" },
];
const states = [
  { label: "rest", chip: { background: "var(--accent)", color: "var(--accent-contrast, white)" } },
  { label: ":hover", chip: { background: "var(--accent-hover)", color: "white", transform: "translateY(-2px)" } },
  { label: ":focus", chip: { background: "var(--accent)", color: "var(--accent-contrast, white)", boxShadow: "0 0 0 3px var(--accent-glow)" } },
  { label: ":active", chip: { background: "var(--accent-hover)", color: "white", transform: "scale(0.96)" } },
  { label: "disabled", chip: { background: "var(--bg-surface)", color: "var(--text-muted)", opacity: 0.5 } },
];
const palettes = [
  { name: "SaaS Dark", cells: [{ bg: "#09090b", c: "#666", t: "SaaS" },{ bg: "#18181b" },{ bg: "#27272a" },{ bg: "#3b82f6", c: "#fff", t: "accent" },{ bg: "#fafafa", c: "#000", t: "text" }] },
  { name: "Editorial", cells: [{ bg: "#faf9f6", c: "#666", t: "Edit" },{ bg: "#ffffff", border: true },{ bg: "#f5f0eb" },{ bg: "#c45d3e", c: "#fff", t: "accent" },{ bg: "#1a1a1a", c: "#fff", t: "text" }] },
  { name: "Fintech", cells: [{ bg: "#0c1222", c: "#666", t: "Fin" },{ bg: "#131c31" },{ bg: "#1a2540" },{ bg: "#00d4aa", c: "#000", t: "accent" },{ bg: "#e8edf5", c: "#000", t: "text" }] },
  { name: "Startup", cells: [{ bg: "#ffffff", c: "#999", t: "Start", border: true },{ bg: "#f8f8f8" },{ bg: "#f0f0f0" },{ bg: "#0a0a0a", c: "#fff", t: "accent" },{ bg: "#0a0a0a", c: "#fff", t: "text" }] },
  { name: "Creative", cells: [{ bg: "#1a1614", c: "#666", t: "Crea" },{ bg: "#242018" },{ bg: "#2e2820" },{ bg: "#e07850", c: "#fff", t: "accent" },{ bg: "#f5ebe0", c: "#000", t: "text" }] },
];

const colorGroups = [
  { label: "Surfaces", tokens: [
    { name: "bg", cssVar: "--bg", usage: "Page background" },
    { name: "elevated", cssVar: "--bg-elevated", usage: "Cards, modals" },
    { name: "surface", cssVar: "--bg-surface", usage: "Nested containers" },
    { name: "border", cssVar: "--border", usage: "Default borders" },
    { name: "border-hover", cssVar: "--border-hover", usage: "Hover borders" },
  ]},
  { label: "Text", tokens: [
    { name: "text", cssVar: "--text", usage: "Primary content" },
    { name: "secondary", cssVar: "--text-secondary", usage: "Descriptions" },
    { name: "muted", cssVar: "--text-muted", usage: "Hints, timestamps" },
  ]},
  { label: "Semantic", tokens: [
    { name: "accent", cssVar: "--accent", usage: "Brand, primary actions" },
    { name: "success", cssVar: "--success", usage: "Confirmations" },
    { name: "warning", cssVar: "--warning", usage: "Caution states" },
    { name: "destructive", cssVar: "--destructive", usage: "Errors, delete" },
    { name: "info", cssVar: "--info", usage: "Informational" },
  ]},
];

const contrastPairs = [
  { fg: "--text", bg: "--bg", label: "--text on --bg" },
  { fg: "--text", bg: "--bg-elevated", label: "--text on --bg-elevated" },
  { fg: "--text-secondary", bg: "--bg", label: "--text-secondary on --bg" },
  { fg: "--text-secondary", bg: "--bg-elevated", label: "--text-secondary on --bg-elevated" },
  { fg: "--text-muted", bg: "--bg", label: "--text-muted on --bg" },
  { fg: "--text-muted", bg: "--bg-elevated", label: "--text-muted on --bg-elevated" },
  { fg: "--text-muted", bg: "--bg-surface", label: "--text-muted on --bg-surface" },
  { fg: "--accent", bg: "--bg", label: "--accent on --bg" },
  { fg: "--accent", bg: "--bg-elevated", label: "--accent on --bg-elevated" },
];

function Label({ children }: { children: string }) {
  return <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", fontWeight: 500, marginBottom: 12 }}>{children}</div>;
}
function SH({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <Label>{label}</Label>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 12 }}>{title}</h2>
      {sub && <p style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 300 }}>{sub}</p>}
    </div>
  );
}
function PLabel({ children }: { children: string }) {
  return <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: "var(--text-secondary)" }}>{children}</div>;
}
function Mono({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{children}</span>;
}

function CopyToken({ value, children }: { value: string; children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [value]);
  return (
    <span
      onClick={copy}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && copy()}
      style={{ cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 10, color: copied ? "var(--success)" : "var(--text-muted)", transition: "color 0.2s", userSelect: "none" }}
      title={`Copy: ${value}`}
    >
      {copied ? "Copied!" : children ?? value}
    </span>
  );
}

function parseColor(raw: string): [number, number, number] | null {
  const s = raw.trim();
  let m = s.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const h = m[1];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  m = s.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) return [+m[1], +m[2], +m[3]];
  return null;
}

function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(fg: string, bg: string): number | null {
  const c1 = parseColor(fg);
  const c2 = parseColor(bg);
  if (!c1 || !c2) return null;
  const l1 = luminance(...c1);
  const l2 = luminance(...c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function resolveVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function ContrastCell({ fg, bg, label }: { fg: string; bg: string; label: string }) {
  const [ratio, setRatio] = useState<number | null>(null);
  useEffect(() => {
    const fgVal = resolveVar(fg);
    const bgVal = resolveVar(bg);
    setRatio(contrastRatio(fgVal, bgVal));
  }, [fg, bg]);
  const pass = ratio !== null && ratio >= 4.5;
  const aaa = ratio !== null && ratio >= 7;
  return (
    <div style={{ background: `var(${bg})`, border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ color: `var(${fg})`, fontSize: 16, fontWeight: 600 }}>Sample Text</span>
      <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: `var(${fg})`, opacity: 0.7 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
        <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: `var(${fg})` }}>{ratio ? `${ratio.toFixed(1)}:1` : "..."}</span>
        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: aaa ? "var(--warning)" : pass ? "var(--success)" : "var(--destructive)", color: aaa || pass ? "#000" : "#fff" }}>
          {aaa ? "AAA" : pass ? "AA" : "FAIL"}
        </span>
      </div>
    </div>
  );
}


export default function DesignSystemPage() {
  useReveal();
  return (
    <div style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <style>{dnaStyles}</style>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: "140px 32px 100px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Label>Foundation</Label>
          <h1 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 7vw, 80px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1 }}>
            The system<br />behind the <em style={{ fontStyle: "italic", color: "var(--accent)" }}>soul.</em>
          </h1>
          <p className="reveal reveal-delay-2" style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300, maxWidth: 480, margin: "24px auto 0" }}>Tokens, type, color, space, motion. The invisible rules that make everything feel intentional.</p>
        </div>
      </section>

      {/* ═══ COLOR ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Color" title="One accent. Infinite depth." sub="Restraint is the design. 90% neutrals, one accent for meaning." /></div>
          {colorGroups.map((group, gi) => (
            <div key={group.label} className={`reveal reveal-delay-${gi + 1}`} style={{ marginBottom: 48 }}>
              <PLabel>{group.label}</PLabel>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {group.tokens.map(({ name, cssVar, usage }) => (
                  <div key={cssVar} style={{ width: 100, textAlign: "center" }}>
                    <div className="ds-swatch-color" style={{ background: `var(${cssVar})` }} />
                    <CopyToken value={`var(${cssVar})`}>{name}</CopyToken>
                    <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.3 }}>{usage}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="reveal" style={{ marginBottom: 48 }}>
            <PLabel>Curated Palettes</PLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {palettes.map((p) => (
                <div key={p.name}>
                  <div className="ds-strip">
                    {p.cells.map((cell, i) => (
                      <div key={i} className="ds-strip-cell" style={{ background: cell.bg, color: cell.c || "transparent", border: cell.border ? "1px solid #eee" : undefined }}>{cell.t || ""}</div>
                    ))}
                  </div>
                  <Mono>{p.name}</Mono>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTRAST ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Contrast" title="Accessibility built in." sub="Every text/background combo verified against WCAG 2.1 AA (4.5:1)." /></div>
          <div className="reveal reveal-delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {contrastPairs.map((p) => (
              <ContrastCell key={p.label} fg={p.fg} bg={p.bg} label={p.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TYPOGRAPHY ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Typography" title="Type is the design." sub="Large display, weight contrast, letter-spacing precision." /></div>
          {[
            { name: "Display — Instrument Serif", sample: "The quick brown fox jumps.", style: { fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 56, lineHeight: 1.05 }, meta: "400 weight · -0.04em tracking · 1.0 line-height" },
            { name: "Body — Inter", sample: "Every pixel earns its place or it doesn't exist. Restraint is the design. Typography does the work. Whitespace isn't empty — it's the most powerful element on the page.", style: { fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: 600 }, meta: "400 weight · 0em tracking · 1.7 line-height" },
          ].map((spec, i) => (
            <div key={spec.name} className={`reveal reveal-delay-${i + 1}`} style={{ marginBottom: 48, padding: 32, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)" }}>
              <Mono>{spec.name}</Mono>
              <div style={{ ...spec.style, marginTop: 12, marginBottom: 8, letterSpacing: "-0.03em" }}>{spec.sample}</div>
              <Mono>{spec.meta}</Mono>
            </div>
          ))}
          <div className="reveal" style={{ marginTop: 48 }}>
            <PLabel>Type Scale</PLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "96px", sample: "Display", style: { fontFamily: "var(--font-display)", fontSize: 64, lineHeight: 1 } },
                { label: "48px", sample: "Heading 1", style: { fontSize: 36, fontWeight: 700, lineHeight: 1.1 } },
                { label: "32px", sample: "Heading 2", style: { fontSize: 28, fontWeight: 600, lineHeight: 1.2 } },
                { label: "24px", sample: "Heading 3", style: { fontSize: 22, fontWeight: 600 } },
                { label: "16px", sample: "Body text — the reading size.", style: { fontSize: 16 } },
                { label: "14px", sample: "Secondary — labels, captions", style: { fontSize: 14, color: "var(--text-secondary)" } },
                { label: "12px", sample: "OVERLINE — categories, timestamps", style: { fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.08em" } },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", alignItems: "baseline", gap: 24, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ minWidth: 80, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>{row.label}</span>
                  <span style={{ letterSpacing: "-0.02em", ...row.style }}>{row.sample}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SPACING ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Spacing" title="Space is intentional." sub="Every gap has a reason. Consistent rhythm creates calm." /></div>
          <div className="reveal reveal-delay-1" style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
            {[4, 8, 12, 16, 24, 32, 48, 64, 96, 128].map((px) => (
              <div key={px} style={{ textAlign: "center" }}>
                <div className="ds-space-box" style={{ width: px, height: px }} />
                <Mono>{px}</Mono>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MOTION ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Motion" title="Movement with meaning." sub="Hover each card to see the animation. Apple easing: cubic-bezier(0.22, 1, 0.36, 1)." /></div>
          <div className="ds-motion-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {motions.map((m, i) => (
              <div key={m.name} className={`ds-motion-card reveal${i > 0 && i < 4 ? ` reveal-delay-${i}` : ""}`}>
                <div className="ds-motion-demo" style={{ animation: m.anim }} />
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{m.name}</div>
                <Mono>{m.timing}</Mono>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATES ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="States" title="Every state, considered." sub="Default, hover, focus, active, disabled, loading. No state left behind." /></div>
          <div className="reveal reveal-delay-1" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", padding: 48, textAlign: "center", marginBottom: 48 }}>
            <Mono>Try it — hover, click, tab to focus</Mono>
            <div style={{ marginTop: 20 }}><button className="ds-live-btn">Interactive Button</button></div>
          </div>
          <div className="reveal reveal-delay-2">
            <PLabel>All States</PLabel>
            <div className="ds-states-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, textAlign: "center" }}>
              {[...states, { label: "async", chip: { background: "var(--accent)", color: "transparent", position: "relative" as const, minWidth: 90 } }].map((s) => (
                <div key={s.label}>
                  <span className="ds-state-chip" style={s.chip}>{s.label === "async" ? "Loading" : s.label === "rest" ? "Default" : s.label === ":hover" ? "Hover" : s.label === ":focus" ? "Focus" : s.label === ":active" ? "Active" : "Disabled"}</span>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", minWidth: 56, textAlign: "center", marginTop: 8 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SHAPE + SHADOW ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Shape + Shadow" title="Soft edges. Quiet depth." /></div>
          <div className="reveal reveal-delay-1" style={{ marginBottom: 48 }}>
            <PLabel>Border Radius</PLabel>
            <div style={{ display: "flex", gap: 24, alignItems: "flex-end", flexWrap: "wrap" }}>
              {radii.map((r) => (
                <div key={r} style={{ textAlign: "center" }}>
                  <div className="ds-radius-box" style={{ borderRadius: r === 999 ? 999 : r }} />
                  <Mono>{r === 999 ? "full" : `${r}px`}</Mono>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal reveal-delay-2">
            <PLabel>Shadows</PLabel>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {shadows.map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div className="ds-shadow-box" style={{ boxShadow: s.val }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
