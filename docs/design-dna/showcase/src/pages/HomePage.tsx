import { Link } from "../router/Router";
import { TEMPLATE_ROUTES } from "../data/routes";
import { PALETTES } from "../data/palettes";

export default function HomePage() {
  const templates = TEMPLATE_ROUTES.filter((r) => r.category === "template");
  const system = TEMPLATE_ROUTES.filter((r) => r.category === "system");

  return (
    <>
      {/* Animated background */}
      <div className="bg-constellation" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-16 md:py-24">
        {/* Hero */}
        <header className="text-center mb-20 reveal">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: "var(--accent)" }}>
            APEX Framework
          </p>
          <h1
            className="text-5xl md:text-7xl font-normal mb-6"
            style={{ color: "var(--text)", fontFamily: "Instrument Serif, serif" }}
          >
            Design DNA
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            A living component library. What you see is what you copy.
          </p>
          <p className="text-sm mt-3" style={{ color: "var(--text-muted)" }}>
            14 templates &middot; 24 components &middot; 5 palettes &middot; Zero translation
          </p>
        </header>

        {/* Template Grid */}
        <section className="mb-20 reveal reveal-delay-1">
          <p className="section-label">Page Templates</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((route, i) => (
              <Link key={route.path} to={route.path} className={`glass-card block p-5 reveal reveal-delay-${Math.min(i % 4 + 1, 4)}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: PALETTES[route.palette].dark.accent, boxShadow: `0 0 8px ${PALETTES[route.palette].dark.accentGlow}` }}
                  />
                  <span className="text-base font-semibold" style={{ color: "var(--text)" }}>
                    {route.label}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {PALETTES[route.palette].name} palette &middot; {route.palette === "creative" || route.palette === "editorial" ? "warm" : "cool"} tones
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Design System */}
        <section className="mb-20 reveal reveal-delay-2">
          <p className="section-label">Design System</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {system.map((route) => (
              <Link key={route.path} to={route.path} className="glass-card block p-6">
                <span className="text-lg font-semibold" style={{ color: "var(--text)" }}>{route.label}</span>
                <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                  {route.path === "/design-system" ? "Tokens, typography, spacing, colors, motion" : "Interactive component showcase with all 24 starters"}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Guide */}
        <section className="mb-20 reveal reveal-delay-3">
          <p className="section-label">How to Use APEX Design DNA</p>
          <div className="glass-card p-6 md:p-10">
            <div className="space-y-8">
              <Step n={1} title="Tell APEX what to build">
                Say "Build me an LMS app" or "Create a CRM dashboard." APEX auto-generates a PRD and picks the right Design DNA recipe for your app type.
              </Step>
              <Step n={2} title="APEX reads the recipe">
                Each app type has a recipe that specifies the palette, background, layout pattern, and which starter components to use. The builder gets these values injected automatically.
              </Step>
              <Step n={3} title="Components are copied, not translated">
                The builder copies TSX components from <code style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace", fontSize: "0.85em" }}>starters/</code> directly into your project. No HTML-to-React translation. What you see here is the actual code that ships.
              </Step>
              <Step n={4} title="Tokens drive the theme">
                Import a palette CSS file into your globals.css and all components inherit colors via CSS variables. Switch palettes by swapping one import line.
              </Step>
              <Step n={5} title="Dark + light mode from day one">
                Every palette includes both dark and light variants. The ThemeToggle starter handles persistence. Both modes work out of the box. This is the Way.
              </Step>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-20 reveal reveal-delay-4">
          <p className="section-label">Quick Start</p>
          <div className="code-block">
            <div className="flex items-center px-4 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
              </div>
              <span className="ml-3 text-xs" style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>terminal</span>
            </div>
            <pre className="p-5 text-sm leading-relaxed overflow-x-auto" style={{ color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace" }}>
{`# 1. Copy starters into your project
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
import { PageShell } from "@/components/dna/layout/PageShell";`}
            </pre>
          </div>
        </section>

        {/* Changelog */}
        <section className="mb-20">
          <p className="section-label">Changelog</p>
          <div className="space-y-3">
            <ChangelogEntry version="v5.14.0" date="2026-03-20" title="Native Alignment Audit">
              <li>Autonomous pipeline — zero commands, 3 approval gates</li>
              <li>Removed 7 redundant skills, 2 agents, 4 scripts</li>
              <li>Builder worktree file loss root cause fixed</li>
              <li>CLAUDE.md slimmed from 220 to 116 lines</li>
              <li>Design DNA Showcase App (this page)</li>
            </ChangelogEntry>
            <ChangelogEntry version="v5.13.0" date="2026-03-19" title="Design DNA Starters">
              <li>24 TSX starter components (layout, primitives, patterns)</li>
              <li>14 full-page templates ready to copy</li>
              <li>5 curated palettes with dark/light and RGB tokens</li>
              <li>13 recipes — one per app type</li>
            </ChangelogEntry>
            <ChangelogEntry version="v5.12.0" date="2026-03-20" title="Championship Roster">
              <li>Scan Responsibility Matrix — each check has ONE owner</li>
              <li>Code Reviewer elevated to Opus for security gate</li>
              <li>Behavioral test suite with real Claude Code payloads</li>
            </ChangelogEntry>
            <ChangelogEntry version="v5.11.0" date="2026-03-18" title="Design DNA Launch">
              <li>14 premium UI pattern pages</li>
              <li>SVG background library — 14 static + 8 animated</li>
              <li>CRM expanded to 15 component patterns</li>
              <li>Global palette switcher with persistence</li>
            </ChangelogEntry>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-12 reveal">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Forged by L.B. & Claude &middot; S&atilde;o Paulo &middot; 2026
          </p>
          <p className="text-xs mt-3" style={{ color: "var(--text-muted)", fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "0.9rem" }}>
            "The beskar is pure. This is the Way."
          </p>
        </footer>
      </div>
    </>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <div
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
        style={{ background: "var(--accent)", color: "var(--bg)", boxShadow: `0 0 16px var(--accent-glow)` }}
      >
        {n}
      </div>
      <div>
        <h3 className="text-base font-semibold mb-1.5" style={{ color: "var(--text)" }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{children}</p>
      </div>
    </div>
  );
}

function ChangelogEntry({ version, date, title, children }: { version: string; date: string; title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3 mb-3">
        <span
          className="text-xs font-mono font-bold px-2 py-0.5 rounded"
          style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
        >
          {version}
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{date}</span>
        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>&mdash; {title}</span>
      </div>
      <ul className="text-sm space-y-1.5 ml-5 list-disc" style={{ color: "var(--text-secondary)" }}>
        {children}
      </ul>
    </div>
  );
}
