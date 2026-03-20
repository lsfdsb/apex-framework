import { Link } from "../router/Router";
import { TEMPLATE_ROUTES } from "../data/routes";
import { PALETTES } from "../data/palettes";

export default function HomePage() {
  const templates = TEMPLATE_ROUTES.filter((r) => r.category === "template");
  const system = TEMPLATE_ROUTES.filter((r) => r.category === "system");

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      {/* Hero */}
      <header className="text-center mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: "var(--accent)" }}>
          APEX Framework
        </p>
        <h1 className="text-5xl md:text-6xl font-serif font-normal mb-4" style={{ color: "var(--text)", fontFamily: "Instrument Serif, serif" }}>
          Design DNA
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
          A living component library. What you see is what you copy.
          <br />
          <span style={{ color: "var(--text-muted)" }}>14 templates. 24 components. 5 palettes. Zero translation.</span>
        </p>
      </header>

      {/* Template Grid */}
      <section className="mb-16">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: "var(--text-muted)" }}>
          Page Templates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="group block rounded-xl p-5 transition-all"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ background: PALETTES[route.palette].dark.accent }} />
                <span className="text-base font-semibold" style={{ color: "var(--text)" }}>{route.label}</span>
              </div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {route.palette} palette
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* System Pages */}
      <section className="mb-16">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: "var(--text-muted)" }}>
          Design System
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {system.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="group block rounded-xl p-5 transition-all"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              <span className="text-base font-semibold" style={{ color: "var(--text)" }}>{route.label}</span>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                {route.path === "/design-system" ? "Tokens, typography, spacing, colors" : "Interactive component showcase"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Guide */}
      <section className="mb-16">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: "var(--text-muted)" }}>
          How to Use APEX Design DNA
        </h2>
        <div className="rounded-xl p-6 md:p-8" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <div className="space-y-8">
            <Step n={1} title="Tell APEX what to build">
              <p>Say "Build me an LMS app" or "Create a CRM dashboard." APEX auto-generates a PRD and picks the right Design DNA recipe for your app type.</p>
            </Step>
            <Step n={2} title="APEX reads the recipe">
              <p>Each app type has a recipe that specifies the palette, background, layout pattern, and which starter components to use. The builder gets these values injected automatically.</p>
            </Step>
            <Step n={3} title="Components are copied, not translated">
              <p>The builder copies TSX components from <code style={{ color: "var(--accent)" }}>docs/design-dna/starters/</code> directly into your project. No HTML-to-React translation. What you see in this showcase is the actual code that ships.</p>
            </Step>
            <Step n={4} title="Tokens drive the theme">
              <p>Import a palette CSS file into your <code style={{ color: "var(--accent)" }}>globals.css</code> and all components inherit the colors via CSS variables. Switch palettes by swapping one import line.</p>
            </Step>
            <Step n={5} title="Dark + light mode from day one">
              <p>Every palette includes both dark and light variants. The <code style={{ color: "var(--accent)" }}>ThemeToggle</code> starter component handles persistence. Both modes work out of the box.</p>
            </Step>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="mb-16">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: "var(--text-muted)" }}>
          Quick Start
        </h2>
        <div className="rounded-xl p-6" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <pre className="text-sm leading-relaxed overflow-x-auto" style={{ color: "var(--text-secondary)" }}>
            <code>{`# 1. Copy starters into your project
cp -r docs/design-dna/starters/ src/components/dna/

# 2. Copy your palette tokens
cp docs/design-dna/tokens/palettes/creative-warm.css src/app/tokens/
cp docs/design-dna/tokens/foundation.css src/app/tokens/
cp docs/design-dna/tokens/animations.css src/app/tokens/

# 3. Import in globals.css
@import "./tokens/foundation.css";
@import "./tokens/animations.css";
@import "./tokens/creative-warm.css";

# 4. Use components
import { Card } from "@/components/dna/primitives/Card";
import { PageShell } from "@/components/dna/layout/PageShell";`}</code>
          </pre>
        </div>
      </section>

      {/* Changelog */}
      <section className="mb-16">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: "var(--text-muted)" }}>
          Changelog
        </h2>
        <div className="space-y-4">
          <ChangelogEntry version="v5.14.0" date="2026-03-20" title="Native Alignment Audit">
            <li>Removed 7 redundant skills, 2 agents, 4 scripts</li>
            <li>Autonomous pipeline — zero commands, 3 approval gates</li>
            <li>Builder worktree file loss root cause fixed (permissionMode: dontAsk)</li>
            <li>CLAUDE.md slimmed from 220 to 116 lines</li>
            <li>Official code-review plugin installed</li>
          </ChangelogEntry>
          <ChangelogEntry version="v5.13.0" date="2026-03-19" title="Design DNA Starters">
            <li>24 TSX starter components (layout, primitives, patterns)</li>
            <li>14 full-page templates ready to copy into projects</li>
            <li>5 curated palettes with dark/light mode and RGB tokens</li>
            <li>13 recipes — one per app type with setup instructions</li>
          </ChangelogEntry>
          <ChangelogEntry version="v5.12.0" date="2026-03-20" title="Championship Roster">
            <li>Behavioral test suite with real Claude Code JSON payloads</li>
            <li>Scan Responsibility Matrix — each check has ONE owner</li>
            <li>Code Reviewer elevated to Opus model for security gate</li>
          </ChangelogEntry>
          <ChangelogEntry version="v5.11.0" date="2026-03-18" title="Design DNA Integration">
            <li>14 premium UI pattern pages at docs/design-dna/</li>
            <li>Global palette switcher with 5 palettes x 2 modes</li>
            <li>SVG background library — 14 static + 8 animated</li>
            <li>CRM expanded from 5 to 15 component patterns</li>
          </ChangelogEntry>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8" style={{ color: "var(--text-muted)" }}>
        <p className="text-sm">
          Forged by L.B. & Claude &middot; S&atilde;o Paulo &middot; 2026
        </p>
        <p className="text-xs mt-2" style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
          This is the Way.
        </p>
      </footer>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
        style={{ background: "var(--accent)", color: "var(--bg)" }}
      >
        {n}
      </div>
      <div>
        <h3 className="text-base font-semibold mb-1" style={{ color: "var(--text)" }}>{title}</h3>
        <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{children}</div>
      </div>
    </div>
  );
}

function ChangelogEntry({ version, date, title, children }: { version: string; date: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg p-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm font-mono font-semibold" style={{ color: "var(--accent)" }}>{version}</span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{date}</span>
        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>&mdash; {title}</span>
      </div>
      <ul className="text-sm space-y-1 ml-4 list-disc" style={{ color: "var(--text-secondary)" }}>
        {children}
      </ul>
    </div>
  );
}
