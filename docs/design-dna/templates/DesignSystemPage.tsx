// Copy this file into your app and customize
// DNA source: docs/design-dna/design-system.html
// Palette: bg=#08080a, elevated=#111114, accent=#636bf0, font=Inter + Instrument Serif

import React from "react";
import { SectionHeader, Card, Button, Badge, Input } from "../starters/primitives";

// --- Sample data ---

interface ColorSwatch {
  name: string;
  cssVar: string;
  hex: string;
  textDark?: boolean;
}

interface TypeSample {
  label: string;
  className: string;
  style: React.CSSProperties;
  sample: string;
}

interface SpacingStep {
  px: number;
  cssVar: string;
}

const COLOR_SWATCHES: ColorSwatch[][] = [
  [
    { name: "Background", cssVar: "--bg", hex: "#08080a" },
    { name: "Elevated", cssVar: "--bg-elevated", hex: "#111114" },
    { name: "Surface", cssVar: "--bg-surface", hex: "#19191d" },
  ],
  [
    { name: "Text", cssVar: "--text", hex: "#ececf0", textDark: true },
    { name: "Secondary", cssVar: "--text-secondary", hex: "#8a8a96", textDark: true },
    { name: "Muted", cssVar: "--text-muted", hex: "#55555e", textDark: true },
  ],
  [
    { name: "Accent", cssVar: "--accent", hex: "#636bf0", textDark: true },
    { name: "Accent hover", cssVar: "--accent-hover", hex: "#5158d4", textDark: true },
    { name: "Accent glow", cssVar: "--accent-glow", hex: "rgba(99,107,240,0.12)" },
  ],
  [
    { name: "Success", cssVar: "--success", hex: "#34d399", textDark: true },
    { name: "Warning", cssVar: "--warning", hex: "#fbbf24", textDark: true },
    { name: "Destructive", cssVar: "--destructive", hex: "#f87171", textDark: true },
  ],
];

const TYPE_SAMPLES: TypeSample[] = [
  {
    label: "Display — 64px",
    className: "",
    style: {
      fontFamily: "var(--font-display, 'Instrument Serif', Georgia, serif)",
      fontSize: 64,
      fontWeight: 400,
      letterSpacing: "-0.04em",
      lineHeight: 1,
      color: "var(--text)",
    },
    sample: "The quick brown fox",
  },
  {
    label: "Heading — 32px",
    className: "",
    style: {
      fontFamily: "var(--font-display, 'Instrument Serif', Georgia, serif)",
      fontSize: 32,
      fontWeight: 400,
      letterSpacing: "-0.02em",
      lineHeight: 1.2,
      color: "var(--text)",
    },
    sample: "Typography drives hierarchy",
  },
  {
    label: "Body — 17px",
    className: "",
    style: {
      fontFamily: "var(--font-body, 'Inter', sans-serif)",
      fontSize: 17,
      fontWeight: 400,
      lineHeight: 1.7,
      color: "var(--text-secondary)",
    },
    sample: "Body text is the workhorse of any interface. Clear, readable, with enough line-height to breathe.",
  },
  {
    label: "Label — 11px",
    className: "",
    style: {
      fontFamily: "var(--font-body, 'Inter', sans-serif)",
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.12em",
      textTransform: "uppercase" as const,
      color: "var(--accent)",
    },
    sample: "Section label",
  },
  {
    label: "Caption — 12px",
    className: "",
    style: {
      fontFamily: "var(--font-body, 'Inter', sans-serif)",
      fontSize: 12,
      fontWeight: 400,
      color: "var(--text-muted)",
    },
    sample: "Supporting caption text for data and metadata",
  },
];

const SPACING_STEPS: SpacingStep[] = [
  { px: 4, cssVar: "1" },
  { px: 8, cssVar: "2" },
  { px: 12, cssVar: "3" },
  { px: 16, cssVar: "4" },
  { px: 24, cssVar: "6" },
  { px: 32, cssVar: "8" },
  { px: 48, cssVar: "12" },
  { px: 64, cssVar: "16" },
  { px: 96, cssVar: "24" },
];

// --- Sub-components ---

function ColorRow({ swatches }: { swatches: ColorSwatch[] }) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${swatches.length}, 1fr)` }}>
      {swatches.map(swatch => (
        <div key={swatch.cssVar}>
          <div
            className="h-16 rounded-[var(--radius-sm)] mb-2 border transition-transform duration-200 hover:-translate-y-0.5"
            style={{
              background: swatch.hex,
              borderColor: "var(--border)",
            }}
            aria-label={`Color: ${swatch.name}`}
          />
          <p className="text-[13px] font-medium mb-0.5" style={{ color: "var(--text)" }}>{swatch.name}</p>
          <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{swatch.cssVar}</p>
          <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{swatch.hex}</p>
        </div>
      ))}
    </div>
  );
}

function SpacingRow() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {SPACING_STEPS.map(step => (
        <div key={step.px} className="flex flex-col items-center gap-2">
          <div
            className="rounded-sm"
            style={{
              width: step.px,
              height: step.px,
              background: "var(--accent)",
              opacity: 0.6,
              minWidth: 4,
            }}
            aria-label={`${step.px}px spacing`}
          />
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{step.px}</p>
        </div>
      ))}
    </div>
  );
}

function ComponentGallery() {
  return (
    <div className="flex flex-col gap-12">
      {/* Button variants */}
      <div>
        <p className="text-[12px] uppercase tracking-[0.08em] font-medium mb-4" style={{ color: "var(--text-muted)" }}>
          Button
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </div>

      {/* Badge variants */}
      <div>
        <p className="text-[12px] uppercase tracking-[0.08em] font-medium mb-4" style={{ color: "var(--text-muted)" }}>
          Badge
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="success" size="md">Medium</Badge>
        </div>
      </div>

      {/* Input variants */}
      <div>
        <p className="text-[12px] uppercase tracking-[0.08em] font-medium mb-4" style={{ color: "var(--text-muted)" }}>
          Input
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Default input" placeholder="Enter text..." />
          <Input label="With value" defaultValue="Ana Souza" />
          <Input label="With error" placeholder="Email" error="Please enter a valid email address." />
        </div>
      </div>

      {/* Card variants */}
      <div>
        <p className="text-[12px] uppercase tracking-[0.08em] font-medium mb-4" style={{ color: "var(--text-muted)" }}>
          Card
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <Card.Body>
              <p className="text-[14px] font-semibold mb-1" style={{ color: "var(--text)" }}>Default card</p>
              <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>With hover lift effect and border transition.</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Thumbnail>
              <span className="text-[12px]" style={{ color: "var(--text-muted)", zIndex: 1, position: "relative" }}>Thumbnail</span>
            </Card.Thumbnail>
            <Card.Body>
              <p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>With thumbnail</p>
            </Card.Body>
          </Card>
          <Card hover={false}>
            <Card.Body>
              <p className="text-[14px] font-semibold mb-1" style={{ color: "var(--text)" }}>No hover</p>
              <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>Static variant for content blocks.</p>
            </Card.Body>
            <Card.Footer>
              <Button size="sm" variant="ghost">Action</Button>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Page ---

export default function DesignSystemPage() {
  return (
    <div
      className="min-h-screen px-4 py-16 apex-enter"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <SectionHeader
          label="Design System"
          title="Tokens, type, and components."
          subtitle="The APEX visual vocabulary. Every token, every scale, every component variant."
          align="center"
        />

        {/* Color palette */}
        <section className="mb-16">
          <SectionHeader label="Color" title="Palette." subtitle="Semantic tokens only. No hardcoded hex values in components." />
          <div className="flex flex-col gap-6">
            {COLOR_SWATCHES.map((row, i) => <ColorRow key={i} swatches={row} />)}
          </div>
        </section>

        {/* Typography scale */}
        <section className="mb-16">
          <SectionHeader label="Typography" title="Type scale." subtitle="Instrument Serif for display, Inter for UI. Perfect Fourth ratio." />
          <Card hover={false}>
            <Card.Body>
              <div className="flex flex-col gap-8">
                {TYPE_SAMPLES.map(sample => (
                  <div key={sample.label} className="flex items-baseline gap-6 py-4 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                    <p
                      className="text-[11px] uppercase tracking-[0.06em] shrink-0 w-32"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-body, 'Inter', sans-serif)" }}
                    >
                      {sample.label}
                    </p>
                    <p style={sample.style}>{sample.sample}</p>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </section>

        {/* Spacing scale */}
        <section className="mb-16">
          <SectionHeader label="Spacing" title="4px base unit." subtitle="All spacing is a multiple of 4. No arbitrary values." />
          <Card hover={false}>
            <Card.Body>
              <SpacingRow />
            </Card.Body>
          </Card>
        </section>

        {/* Component gallery */}
        <section>
          <SectionHeader label="Components" title="Component gallery." subtitle="Every primitive, every variant. Copy and compose." />
          <ComponentGallery />
        </section>
      </div>
    </div>
  );
}
