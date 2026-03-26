// DnaBackground — React wrapper for SVG patterns + animated backgrounds
// Usage: <DnaBackground pattern="dots" animated="orbs" />
// Place as first child inside a position:relative container

import { useEffect, useRef } from "react";

// ── SVG Pattern Generators ──
type PatternFn = (color: string, id: string) => string;
let _uid = 0;
function uid() { return `bg${++_uid}`; }

const SVG_PATTERNS: Record<string, PatternFn> = {
  dots: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="${c}" opacity="0.4"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  grid: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0L0 0 0 48" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.2"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  topo: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="200" height="200" patternUnits="userSpaceOnUse"><path d="M20,80Q60,20 100,80T180,80" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.2"/><path d="M20,130Q60,70 100,130T180,130" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.12"/><path d="M20,180Q60,120 100,180T180,180" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.08"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  circuit: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M0,40L20,40 20,20 40,20M40,40L60,40 60,60 80,60M40,0L40,20M40,60L40,80" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/><circle cx="20" cy="20" r="2.5" fill="${c}" opacity="0.2"/><circle cx="60" cy="60" r="2.5" fill="${c}" opacity="0.2"/><circle cx="40" cy="40" r="2" fill="${c}" opacity="0.25"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  hexagons: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(0.6)"><path d="M28,2L52,17 52,47 28,62 4,47 4,17Z" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/><path d="M28,52L52,67 52,97 28,112 4,97 4,67Z" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  crosses: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M14,8L18,8 18,14 24,14 24,18 18,18 18,24 14,24 14,18 8,18 8,14 14,14Z" fill="${c}" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  diamonds: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M20,0L40,20 20,40 0,20Z" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  diagonals: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="16" stroke="${c}" stroke-width="0.6" opacity="0.15"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  triangles: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M24,4L44,44H4Z" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.12"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  constellation: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="120" height="120" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="2" fill="${c}" opacity="0.3"/><circle cx="80" cy="30" r="1.5" fill="${c}" opacity="0.2"/><circle cx="100" cy="90" r="2" fill="${c}" opacity="0.3"/><circle cx="40" cy="100" r="1.5" fill="${c}" opacity="0.2"/><circle cx="60" cy="60" r="2.5" fill="${c}" opacity="0.2"/><line x1="20" y1="20" x2="80" y2="30" stroke="${c}" stroke-width="0.4" opacity="0.12"/><line x1="80" y1="30" x2="100" y2="90" stroke="${c}" stroke-width="0.4" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  isometric: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="56" height="32" patternUnits="userSpaceOnUse"><path d="M28,0L56,16 28,32 0,16Z" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.12"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  waves: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="200" height="40" patternUnits="userSpaceOnUse"><path d="M0,20Q50,0 100,20T200,20" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  dna: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="40" height="80" patternUnits="userSpaceOnUse"><path d="M0,0Q20,20 40,0M0,40Q20,60 40,40M0,80Q20,100 40,80" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/><path d="M0,20Q20,0 40,20M0,60Q20,40 40,60" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.08"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  noise: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs><rect width="100%" height="100%" filter="url(#${id})" opacity="0.05"/></svg>`,
};

// ── Animated Background Generators ──
const ANIMATED_KEYFRAMES = `
@keyframes apex-drift-0{0%,100%{transform:translate(0,0)}33%{transform:translate(60px,-40px)}66%{transform:translate(-30px,50px)}}
@keyframes apex-drift-1{0%,100%{transform:translate(0,0)}33%{transform:translate(-50px,30px)}66%{transform:translate(40px,-45px)}}
@keyframes apex-drift-2{0%,100%{transform:translate(0,0)}33%{transform:translate(35px,45px)}66%{transform:translate(-55px,-25px)}}
@keyframes apex-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
@keyframes apex-ring-expand{0%{transform:translate(-50%,-50%) scale(0);opacity:0.35}100%{transform:translate(-50%,-50%) scale(1);opacity:0}}
@keyframes apex-spotlight{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.5}50%{transform:translate(-40%,-40%) scale(1.2);opacity:0.8}}
@keyframes apex-mesh-shift{0%,100%{filter:hue-rotate(0deg)}50%{filter:hue-rotate(30deg)}}
@keyframes apex-rain{0%{transform:translateY(-150px)}100%{transform:translateY(110vh)}}
@keyframes apex-aurora-0{0%,100%{transform:translateX(0) scaleY(1)}50%{transform:translateX(5%) scaleY(1.4)}}
@keyframes apex-aurora-1{0%,100%{transform:translateX(0) scaleY(1)}50%{transform:translateX(-8%) scaleY(0.7)}}
@keyframes apex-aurora-2{0%,100%{transform:translateX(0) scaleY(1)}50%{transform:translateX(6%) scaleY(1.2)}}
`;

type AnimatedBgFn = (container: HTMLDivElement) => void;

const ANIMATED_BGS: Record<string, AnimatedBgFn> = {
  orbs: (el) => {
    [
      { color: "var(--accent)", size: 400, dur: 20, top: "10%", left: "15%" },
      { color: "#a855f7", size: 300, dur: 25, top: "50%", left: "auto", right: "10%" },
      { color: "#06b6d4", size: 250, dur: 18, top: "auto", left: "40%", bottom: "10%" },
    ].forEach((cfg, i) => {
      const orb = document.createElement("div");
      Object.assign(orb.style, {
        position: "absolute", borderRadius: "50%", filter: "blur(80px)", opacity: "0.25",
        width: cfg.size + "px", height: cfg.size + "px", background: cfg.color,
        pointerEvents: "none", mixBlendMode: "screen",
        animation: `apex-drift-${i} ${cfg.dur}s ease-in-out infinite`,
        top: cfg.top || "auto", left: cfg.left || "auto",
        right: ("right" in cfg ? cfg.right : "auto") as string,
        bottom: ("bottom" in cfg ? cfg.bottom : "auto") as string,
      });
      el.appendChild(orb);
    });
  },
  aurora: (el) => {
    [
      { color: "var(--accent)", y: "20%", dur: 12 },
      { color: "#a855f7", y: "45%", dur: 16 },
      { color: "#06b6d4", y: "65%", dur: 20 },
      { color: "#f43f5e", y: "80%", dur: 14 },
    ].forEach((s, i) => {
      const d = document.createElement("div");
      Object.assign(d.style, {
        position: "absolute", width: "120%", height: "120px", top: s.y, left: "-10%",
        background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`,
        filter: "blur(50px)", opacity: "0.12", pointerEvents: "none",
        animation: `apex-aurora-${i % 3} ${s.dur}s ease-in-out infinite`,
      });
      el.appendChild(d);
    });
  },
  particles: (el) => {
    for (let i = 0; i < 40; i++) {
      const p = document.createElement("div");
      const size = 1 + Math.random() * 3;
      Object.assign(p.style, {
        position: "absolute", width: size + "px", height: size + "px", borderRadius: "50%",
        background: "var(--accent)", opacity: String(0.08 + Math.random() * 0.25),
        left: Math.random() * 100 + "%", top: Math.random() * 100 + "%", pointerEvents: "none",
        animation: `apex-float ${6 + Math.random() * 14}s ease-in-out ${Math.random() * 5}s infinite`,
      });
      el.appendChild(p);
    }
  },
  gradient: (el) => {
    const mesh = document.createElement("div");
    Object.assign(mesh.style, {
      position: "absolute", inset: "0", pointerEvents: "none", opacity: "0.4",
      background: `radial-gradient(ellipse at 20% 50%, var(--accent-glow) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.06) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 80%, rgba(6,182,212,0.05) 0%, transparent 50%)`,
      animation: "apex-mesh-shift 20s ease-in-out infinite",
    });
    el.appendChild(mesh);
  },
  nebula: (el) => {
    ["var(--accent)", "#a855f7", "#ec4899", "#06b6d4", "#f59e0b"].forEach((color, i) => {
      const blob = document.createElement("div");
      const size = 150 + Math.random() * 250;
      Object.assign(blob.style, {
        position: "absolute", borderRadius: "50%", filter: "blur(100px)",
        width: size + "px", height: size + "px", background: color, pointerEvents: "none",
        opacity: String(0.08 + Math.random() * 0.1), mixBlendMode: "screen",
        top: Math.random() * 80 + "%", left: Math.random() * 80 + "%",
        animation: `apex-drift-${i % 3} ${15 + Math.random() * 15}s ease-in-out infinite`,
      });
      el.appendChild(blob);
    });
  },
  spotlight: (el) => {
    const light = document.createElement("div");
    Object.assign(light.style, {
      position: "absolute", width: "600px", height: "600px", borderRadius: "50%",
      background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
      top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none",
      animation: "apex-spotlight 8s ease-in-out infinite",
    });
    el.appendChild(light);
  },
};

export type DnaPattern = keyof typeof SVG_PATTERNS;
export type DnaAnimatedBg = keyof typeof ANIMATED_BGS;

interface DnaBackgroundProps {
  /** Static SVG pattern name (dots, grid, topo, circuit, etc.) */
  pattern?: DnaPattern;
  /** Animated background name (orbs, aurora, particles, gradient, nebula, spotlight) */
  animated?: DnaAnimatedBg;
  /** Override pattern color (defaults to --accent) */
  color?: string;
}

export function DnaBackground({ pattern, animated, color }: DnaBackgroundProps) {
  const animRef = useRef<HTMLDivElement>(null);

  // Inject animated background DOM elements
  useEffect(() => {
    if (!animated || !animRef.current) return;
    const el = animRef.current;
    const fn = ANIMATED_BGS[animated];
    if (fn) fn(el);
    return () => { el.innerHTML = ""; };
  }, [animated]);

  // Resolve pattern color from CSS variable
  const patternColor = color ?? (typeof document !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#636bf0"
    : "#636bf0");

  const patternBg = pattern && SVG_PATTERNS[pattern]
    ? `url("data:image/svg+xml,${encodeURIComponent(SVG_PATTERNS[pattern](patternColor, uid()))}")`
    : undefined;

  return (
    <>
      <style>{ANIMATED_KEYFRAMES}</style>
      {/* Static SVG pattern layer */}
      {patternBg && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, zIndex: 0,
            backgroundImage: patternBg, backgroundRepeat: "repeat",
            pointerEvents: "none",
          }}
        />
      )}
      {/* Animated background layer */}
      {animated && (
        <div
          ref={animRef}
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, zIndex: 0,
            overflow: "hidden", pointerEvents: "none",
          }}
        />
      )}
    </>
  );
}
