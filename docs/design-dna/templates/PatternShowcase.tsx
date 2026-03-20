// Copy this file into your app and customize
// DNA source: docs/design-dna/patterns.html + docs/design-dna/svg-backgrounds.js
// Palette: bg=#08080a, elevated=#111114, accent=#636bf0, font=Inter + Instrument Serif
// SVG patterns are inline data URIs — no external dependencies required

import React, { useState, useCallback } from "react";
import { SectionHeader, Card, Button } from "../starters/primitives";

// --- SVG pattern generators (from svg-backgrounds.js) ---

type PatternFn = (color: string, id: string) => string;

const SVG_PATTERNS: Record<string, PatternFn> = {
  dots: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="${c}" opacity="0.4"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  grid: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0L0 0 0 48" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.2"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  topo: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="200" height="200" patternUnits="userSpaceOnUse"><path d="M20,80Q60,20 100,80T180,80" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.2"/><path d="M20,130Q60,70 100,130T180,130" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.12"/><path d="M20,180Q60,120 100,180T180,180" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.08"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  circuit: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M0,40L20,40 20,20 40,20M40,40L60,40 60,60 80,60M40,0L40,20M40,60L40,80" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/><circle cx="20" cy="20" r="2.5" fill="${c}" opacity="0.2"/><circle cx="60" cy="60" r="2.5" fill="${c}" opacity="0.2"/><circle cx="40" cy="40" r="2" fill="${c}" opacity="0.25"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  hexagons: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(0.6)"><path d="M28,2L52,17 52,47 28,62 4,47 4,17Z" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/><path d="M28,52L52,67 52,97 28,112 4,97 4,67Z" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  crosses: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M14,8L18,8 18,14 24,14 24,18 18,18 18,24 14,24 14,18 8,18 8,14 14,14Z" fill="${c}" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  diamonds: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M20,0L40,20 20,40 0,20Z" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  diagonals: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="16" stroke="${c}" stroke-width="0.6" opacity="0.15"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  waves: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="200" height="40" patternUnits="userSpaceOnUse"><path d="M0,20Q50,0 100,20T200,20" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  constellation: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="120" height="120" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="2" fill="${c}" opacity="0.3"/><circle cx="80" cy="30" r="1.5" fill="${c}" opacity="0.2"/><circle cx="100" cy="90" r="2" fill="${c}" opacity="0.3"/><circle cx="40" cy="100" r="1.5" fill="${c}" opacity="0.2"/><circle cx="60" cy="60" r="2.5" fill="${c}" opacity="0.2"/><line x1="20" y1="20" x2="80" y2="30" stroke="${c}" stroke-width="0.4" opacity="0.12"/><line x1="80" y1="30" x2="100" y2="90" stroke="${c}" stroke-width="0.4" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  isometric: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="56" height="32" patternUnits="userSpaceOnUse"><path d="M28,0L56,16 28,32 0,16Z" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.12"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  triangles: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M24,4L44,44H4Z" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.12"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
  dna: (c, id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="40" height="80" patternUnits="userSpaceOnUse"><path d="M0,0Q20,20 40,0M0,40Q20,60 40,40M0,80Q20,100 40,80" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/><path d="M0,20Q20,0 40,20M0,60Q20,40 40,60" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.08"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,
};

let _uid = 0;
function uid(): string { return `p${++_uid}`; }

function getPatternDataUri(name: string, color: string): string {
  const fn = SVG_PATTERNS[name];
  if (!fn) return "";
  const svg = fn(color, uid());
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// --- Sample data ---

interface PatternMeta {
  name: string;
  key: string;
  description: string;
  use: string;
}

const PATTERNS: PatternMeta[] = [
  { name: "Dots", key: "dots", description: "Subtle repeating dot grid", use: "Hero backgrounds, landing pages" },
  { name: "Grid", key: "grid", description: "Clean 48px grid lines", use: "Dashboards, technical pages" },
  { name: "Topographic", key: "topo", description: "Layered contour lines", use: "Map interfaces, depth effects" },
  { name: "Circuit", key: "circuit", description: "PCB trace pattern with nodes", use: "Tech products, developer tools" },
  { name: "Hexagons", key: "hexagons", description: "Honeycomb cell structure", use: "Data visualization, science" },
  { name: "Crosses", key: "crosses", description: "Swiss cross repeat", use: "Medical, minimalist layouts" },
  { name: "Diamonds", key: "diamonds", description: "Rotated square outline grid", use: "Premium, luxury aesthetics" },
  { name: "Diagonals", key: "diagonals", description: "Angled line hatching", use: "Caution states, construction" },
  { name: "Waves", key: "waves", description: "Flowing sinusoidal curves", use: "Audio, fluid interfaces" },
  { name: "Constellation", key: "constellation", description: "Stars connected by lines", use: "Space, networking, graphs" },
  { name: "Isometric", key: "isometric", description: "3D diamond tile grid", use: "Data, spatial interfaces" },
  { name: "Triangles", key: "triangles", description: "Repeating triangle outlines", use: "Angular, geometric brands" },
  { name: "DNA", key: "dna", description: "Double helix strand pattern", use: "Biotech, health products" },
];

// --- Sub-components ---

function PatternCard({
  pattern,
  accentColor,
  onCopy,
  copied,
}: {
  pattern: PatternMeta;
  accentColor: string;
  onCopy: (key: string) => void;
  copied: string | null;
}) {
  const bgImage = getPatternDataUri(pattern.key, accentColor);

  return (
    <div
      className="rounded-[var(--radius)] border overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[var(--border-hover)]"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
    >
      {/* Pattern preview */}
      <div
        className="h-[200px] relative"
        style={{ backgroundImage: bgImage, backgroundRepeat: "repeat", backgroundColor: "var(--bg-elevated)" }}
        aria-label={`${pattern.name} pattern preview`}
      />
      {/* Info */}
      <div className="p-5">
        <h3 className="text-[16px] font-semibold tracking-tight mb-1" style={{ color: "var(--text)" }}>
          {pattern.name}
        </h3>
        <p className="text-[13px] leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
          {pattern.description}
        </p>
        <p
          className="text-[11px] font-mono mb-4 inline-block px-2.5 py-1.5 rounded-md"
          style={{ background: "var(--bg-surface)", color: "var(--accent)" }}
        >
          data-bg=&quot;{pattern.key}&quot;
        </p>
        <div className="flex items-center justify-between">
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>{pattern.use}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopy(pattern.key)}
            aria-label={`Copy ${pattern.name} usage snippet`}
          >
            {copied === pattern.key ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function UsageExample({ accentColor }: { accentColor: string }) {
  const dotsUri = getPatternDataUri("dots", accentColor);
  const circuitUri = getPatternDataUri("circuit", accentColor);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Dots + hero content */}
      <div
        className="rounded-[var(--radius)] border relative overflow-hidden flex items-center justify-center"
        style={{
          minHeight: 300,
          borderColor: "var(--border)",
          backgroundImage: dotsUri,
          backgroundRepeat: "repeat",
          backgroundColor: "var(--bg-elevated)",
        }}
        aria-label="Dots pattern usage example"
      >
        <div className="relative z-10 text-center px-12">
          <h3
            className="font-normal tracking-tight mb-2"
            style={{
              fontFamily: "var(--font-display, 'Instrument Serif', Georgia, serif)",
              fontSize: 32,
              letterSpacing: "-0.03em",
              color: "var(--text)",
            }}
          >
            Dots background
          </h3>
          <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
            Hero section with subtle texture
          </p>
        </div>
        <span
          className="absolute bottom-4 left-4 text-[11px] px-2 py-1 rounded border"
          style={{
            fontFamily: "monospace",
            background: "var(--bg)",
            borderColor: "var(--border)",
            color: "var(--text-muted)",
          }}
        >
          dots
        </span>
      </div>

      {/* Circuit + card content */}
      <div
        className="rounded-[var(--radius)] border relative overflow-hidden flex items-center justify-center"
        style={{
          minHeight: 300,
          borderColor: "var(--border)",
          backgroundImage: circuitUri,
          backgroundRepeat: "repeat",
          backgroundColor: "var(--bg-elevated)",
        }}
        aria-label="Circuit pattern usage example"
      >
        <div className="relative z-10 text-center px-12">
          <h3
            className="font-normal tracking-tight mb-2"
            style={{
              fontFamily: "var(--font-display, 'Instrument Serif', Georgia, serif)",
              fontSize: 32,
              letterSpacing: "-0.03em",
              color: "var(--text)",
            }}
          >
            Circuit pattern
          </h3>
          <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
            Technical product landing page
          </p>
        </div>
        <span
          className="absolute bottom-4 left-4 text-[11px] px-2 py-1 rounded border"
          style={{
            fontFamily: "monospace",
            background: "var(--bg)",
            borderColor: "var(--border)",
            color: "var(--text-muted)",
          }}
        >
          circuit
        </span>
      </div>
    </div>
  );
}

// --- Page ---

export default function PatternShowcase() {
  const [copied, setCopied] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState("#636bf0");

  const handleCopy = useCallback((key: string) => {
    const snippet = `// Apply pattern via CSS (works with any element)\ngetPatternDataUri("${key}", "var(--accent)");\n\n// Or use data attribute (requires svg-backgrounds.js)\n<div data-bg="${key}" />`;
    navigator.clipboard.writeText(snippet).catch(() => null);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <div
      className="min-h-screen px-4 py-16 apex-enter"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <SectionHeader
          label="SVG Patterns"
          title="Background pattern library."
          subtitle="13 static SVG patterns. Click to copy the usage snippet. Zero dependencies."
          align="center"
        />

        {/* Color picker for previewing patterns */}
        <div className="flex items-center gap-4 mb-10 justify-center">
          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>Pattern color:</p>
          <div className="flex gap-2">
            {["#636bf0", "#34d399", "#fbbf24", "#f87171", "#a855f7", "#ececf0"].map(c => (
              <button
                key={c}
                onClick={() => setAccentColor(c)}
                className="w-6 h-6 rounded-full border-2 transition-transform duration-200 hover:scale-110"
                style={{
                  background: c,
                  borderColor: accentColor === c ? "var(--text)" : "transparent",
                }}
                aria-label={`Set pattern color to ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Pattern grid */}
        <section className="mb-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PATTERNS.map(pattern => (
              <PatternCard
                key={pattern.key}
                pattern={pattern}
                accentColor={accentColor}
                onCopy={handleCopy}
                copied={copied}
              />
            ))}
          </div>
        </section>

        {/* Usage examples */}
        <section>
          <SectionHeader
            label="Usage"
            title="In context."
            subtitle="Patterns composited with content. Dots and circuit shown below."
          />
          <UsageExample accentColor={accentColor} />
        </section>
      </div>
    </div>
  );
}
