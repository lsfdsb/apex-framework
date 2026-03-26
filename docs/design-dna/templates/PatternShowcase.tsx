// Copy this file into your app and customize
// SVG patterns are inline data URIs — no external dependencies required

import React, { useState, useCallback, useEffect } from "react";

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
.pat-card{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius,12px);overflow:hidden;transition:all .4s cubic-bezier(0.22,1,0.36,1)}
.pat-card:hover{border-color:var(--border-hover);transform:translateY(-3px)}
@media(max-width:768px){.pat-grid{grid-template-columns:1fr!important}.comp-grid{grid-template-columns:1fr!important}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}.reveal{opacity:1;transform:none;filter:none}}
`;

// ── SVG pattern generators ──────────────────────────────────
type PatternFn = (color: string, id: string) => string;
const SVG_PATTERNS: Record<string, PatternFn> = {
  dots: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="${c}" opacity="0.6"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  grid: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0L0 0 0 48" fill="none" stroke="${c}" stroke-width="1" opacity="0.4"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  topo: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="200" height="200" patternUnits="userSpaceOnUse"><path d="M20,80Q60,20 100,80T180,80" fill="none" stroke="${c}" stroke-width="1" opacity="0.4"/><path d="M20,130Q60,70 100,130T180,130" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.3"/><path d="M20,180Q60,120 100,180T180,180" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.2"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  circuit: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M0,40L20,40 20,20 40,20M40,40L60,40 60,60 80,60M40,0L40,20M40,60L40,80" fill="none" stroke="${c}" stroke-width="1" opacity="0.4"/><circle cx="20" cy="20" r="2.5" fill="${c}" opacity="0.45"/><circle cx="60" cy="60" r="2.5" fill="${c}" opacity="0.45"/><circle cx="40" cy="40" r="2" fill="${c}" opacity="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  hexagons: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(0.6)"><path d="M28,2L52,17 52,47 28,62 4,47 4,17Z" fill="none" stroke="${c}" stroke-width="1" opacity="0.35"/><path d="M28,52L52,67 52,97 28,112 4,97 4,67Z" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.25"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  crosses: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M14,8L18,8 18,14 24,14 24,18 18,18 18,24 14,24 14,18 8,18 8,14 14,14Z" fill="${c}" opacity="0.25"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  diamonds: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M20,0L40,20 20,40 0,20Z" fill="none" stroke="${c}" stroke-width="1" opacity="0.35"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  diagonals: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="16" stroke="${c}" stroke-width="1" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  waves: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="200" height="40" patternUnits="userSpaceOnUse"><path d="M0,20Q50,0 100,20T200,20" fill="none" stroke="${c}" stroke-width="1" opacity="0.35"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  constellation: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="120" height="120" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="2.5" fill="${c}" opacity="0.55"/><circle cx="80" cy="30" r="2" fill="${c}" opacity="0.45"/><circle cx="100" cy="90" r="2.5" fill="${c}" opacity="0.55"/><circle cx="40" cy="100" r="2" fill="${c}" opacity="0.45"/><circle cx="60" cy="60" r="3" fill="${c}" opacity="0.5"/><line x1="20" y1="20" x2="80" y2="30" stroke="${c}" stroke-width="0.8" opacity="0.3"/><line x1="80" y1="30" x2="100" y2="90" stroke="${c}" stroke-width="0.8" opacity="0.25"/><line x1="60" y1="60" x2="20" y2="20" stroke="${c}" stroke-width="0.8" opacity="0.25"/><line x1="40" y1="100" x2="100" y2="90" stroke="${c}" stroke-width="0.8" opacity="0.25"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  isometric: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="56" height="32" patternUnits="userSpaceOnUse"><path d="M28,0L56,16 28,32 0,16Z" fill="none" stroke="${c}" stroke-width="1" opacity="0.35"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  triangles: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M24,4L44,44H4Z" fill="none" stroke="${c}" stroke-width="1" opacity="0.35"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  dna: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="40" height="80" patternUnits="userSpaceOnUse"><path d="M0,0Q20,20 40,0M0,40Q20,60 40,40M0,80Q20,100 40,80" fill="none" stroke="${c}" stroke-width="1" opacity="0.4"/><path d="M0,20Q20,0 40,20M0,60Q20,40 40,60" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.2"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
};

let _uid = 0;
function uid(): string { return `p${++_uid}`; }
function getPatternDataUri(name: string, color: string): string {
  const fn = SVG_PATTERNS[name];
  if (!fn) return "";
  return `url("data:image/svg+xml,${encodeURIComponent(fn(color, uid()))}")`;
}

const PATTERNS = [
  { name: "Dots", key: "dots", desc: "Subtle dot matrix. Perfect for hero backgrounds and empty states.", use: "Landing pages" },
  { name: "Grid", key: "grid", desc: "Geometric grid. Technical, precise. Great for dashboards and tools.", use: "Dashboards" },
  { name: "Topographic", key: "topo", desc: "Flowing contour lines. Organic, natural. For creative and editorial.", use: "Editorial" },
  { name: "Circuit", key: "circuit", desc: "Connected nodes and paths. Tech, AI, infrastructure themes.", use: "Tech products" },
  { name: "Hexagons", key: "hexagons", desc: "Honeycomb structure. Science, chemistry, precision engineering.", use: "Science" },
  { name: "Crosses", key: "crosses", desc: "Medical, healthcare, Swiss design. Clean and structured.", use: "Healthcare" },
  { name: "Diamonds", key: "diamonds", desc: "Geometric elegance. Luxury, fashion, premium brands.", use: "Luxury" },
  { name: "Diagonals", key: "diagonals", desc: "Angled line hatching. Construction, caution, progress.", use: "Construction" },
  { name: "Waves", key: "waves", desc: "Flowing sinusoidal curves. Audio, music, fluid interfaces.", use: "Audio" },
  { name: "Constellation", key: "constellation", desc: "Stars connected by lines. Space, networking, graph data.", use: "Networking" },
  { name: "Isometric", key: "isometric", desc: "3D diamond tile grid. Spatial data, architecture.", use: "Architecture" },
  { name: "Triangles", key: "triangles", desc: "Repeating triangle outlines. Angular, geometric brands.", use: "Geometric" },
  { name: "DNA", key: "dna", desc: "Double helix strand pattern. Biotech, health, genetics.", use: "Biotech" },
];

export default function PatternShowcase() {
  useReveal();
  const [copied, setCopied] = useState<string | null>(null);
  const [color, setColor] = useState("#636bf0");

  const handleCopy = useCallback((key: string) => {
    navigator.clipboard.writeText(`<div data-bg="${key}" />`).catch(() => null);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <div style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <style>{dnaStyles}</style>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: "140px 32px 100px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>SVG Library</div>
          <h1 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 7vw, 80px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1 }}>
            Backgrounds<br />with <em style={{ fontStyle: "italic", color: "var(--accent)" }}>texture.</em>
          </h1>
          <p className="reveal reveal-delay-2" style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300, maxWidth: 440, margin: "20px auto 0" }}>SVG patterns that add depth without distraction. Zero images. Infinite scale.</p>
        </div>
      </section>

      {/* ═══ PATTERN LIBRARY ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>13 patterns. Pure SVG.</h2>
            <p style={{ fontSize: 17, color: "var(--text-secondary)", fontWeight: 300, marginBottom: 32 }}>Each pattern adapts to your palette automatically.</p>
            {/* Color picker */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Preview color:</span>
              {["#636bf0", "#34d399", "#fbbf24", "#f87171", "#a855f7", "#ececf0"].map((c) => (
                <button key={c} onClick={() => setColor(c)} style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: color === c ? "2px solid var(--text)" : "2px solid transparent", cursor: "pointer", transition: "all .3s cubic-bezier(0.22,1,0.36,1)", transform: color === c ? "scale(1.15)" : "scale(1)", boxShadow: color === c ? `0 0 8px ${c}` : "none" }} />
              ))}
            </div>
          </div>

          <div className="pat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {PATTERNS.map((p, i) => (
              <div key={p.key} className={`pat-card reveal${i % 3 > 0 ? ` reveal-delay-${i % 3}` : ""}`}>
                <div style={{ height: 200, backgroundImage: getPatternDataUri(p.key, color), backgroundRepeat: "repeat", backgroundColor: "var(--bg-elevated)" }} />
                <div style={{ padding: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 4 }}>{p.name}</div>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>{p.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", background: "var(--bg-surface)", padding: "6px 10px", borderRadius: 6, display: "inline-block" }}>data-bg="{p.key}"</span>
                    <button onClick={() => handleCopy(p.key)} style={{ fontSize: 12, fontWeight: 500, color: copied === p.key ? "var(--success)" : "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", transition: "color .3s" }}>{copied === p.key ? "Copied!" : "Copy"}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPOSITIONS ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>In context.</h2>
            <p style={{ fontSize: 17, color: "var(--text-secondary)", fontWeight: 300 }}>Patterns composited with content. Real-world usage.</p>
          </div>
          <div className="comp-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { key: "dots", title: "Hero with dots", sub: "Landing page background texture" },
              { key: "circuit", title: "Technical product", sub: "Developer tool aesthetic" },
            ].map((comp) => (
              <div key={comp.key} className="reveal" style={{ borderRadius: "var(--radius, 12px)", overflow: "hidden", position: "relative", minHeight: 300, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: getPatternDataUri(comp.key, color), backgroundRepeat: "repeat", backgroundColor: "var(--bg-elevated)" }}>
                <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: 48 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 8 }}>{comp.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{comp.sub}</p>
                </div>
                <span style={{ position: "absolute", bottom: 16, left: 16, fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)", background: "var(--bg)", padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", zIndex: 2 }}>{comp.key}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
