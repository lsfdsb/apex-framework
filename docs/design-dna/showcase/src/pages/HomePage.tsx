import { useEffect, useRef } from "react";
import { Link } from "../router/Router";
import { TEMPLATE_ROUTES } from "../data/routes";
import { PALETTES } from "../data/palettes";

// Dynamic changelog — reads from CHANGELOG.md at build time
import changelogRaw from "../../../../../CHANGELOG.md?raw";

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  items: string[];
}

function parseChangelog(): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];

  // Extract bullet items from a section body
  const extractItems = (body: string): string[] => {
    const items: string[] = [];
    for (const line of body.split("\n")) {
      const bulletMatch = line.match(/^- \*\*(.+?)\*\*\s*[—–-]\s*(.+)/);
      if (bulletMatch && items.length < 15) {
        items.push(`${bulletMatch[1]} — ${bulletMatch[2].trim()}`);
      }
    }
    return items;
  };

  // Find [Unreleased] section
  const unreleasedMatch = changelogRaw.match(/^## \[Unreleased\]\s*$/m);
  if (unreleasedMatch && unreleasedMatch.index !== undefined) {
    const start = unreleasedMatch.index + unreleasedMatch[0].length;
    const nextSection = changelogRaw.indexOf("\n## [", start);
    const body = changelogRaw.slice(start, nextSection > -1 ? nextSection : undefined);
    const items = extractItems(body);
    if (items.length > 0) {
      const today = new Date().toISOString().slice(0, 10);
      entries.push({ version: "next", date: today, title: "Unreleased", items });
    }
  }

  // Match versioned sections: ## [5.14.0] — 2026-03-20 — Title (title is optional)
  const sectionRegex = /^## \[(\d+\.\d+\.\d+)\]\s*[—–-]\s*(\d{4}-\d{2}-\d{2})(?:\s*[—–-]\s*(.+))?$/gm;
  let match;
  const positions: { version: string; date: string; title: string; start: number }[] = [];
  while ((match = sectionRegex.exec(changelogRaw)) !== null) {
    positions.push({
      version: `v${match[1]}`,
      date: match[2],
      title: (match[3] || "").trim(),
      start: match.index + match[0].length,
    });
  }
  for (let i = 0; i < positions.length; i++) {
    const end = i + 1 < positions.length ? positions[i + 1].start - 50 : changelogRaw.length;
    const body = changelogRaw.slice(positions[i].start, end);
    const items = extractItems(body);
    if (items.length > 0) {
      entries.push({ ...positions[i], items });
    }
  }
  return entries;
}

export default function HomePage() {
  const templates = TEMPLATE_ROUTES.filter((r) => r.category === "template");
  const system = TEMPLATE_ROUTES.filter((r) => r.category === "system");
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 },
    );
    revealRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={revealRef} style={{ position: "relative", zIndex: 1 }}>
        {/* ── Hero ── */}
        <div className="hero">
          <div>
            <div className="hero-label reveal visible">APEX Framework</div>
            <h1 className="reveal visible">
              Design <em>DNA</em>
            </h1>
            <p className="reveal visible">
              A living component library.
              <br />
              What you see is what you copy.
            </p>
            <p className="subtext reveal visible">
              14 templates &middot; 24 components &middot; 5 palettes &middot; Zero translation
            </p>
          </div>
        </div>

        {/* ── Page Templates ── */}
        <div className="section">
          <div className="section-inner">
            <div className="reveal" style={{ textAlign: "center", marginBottom: 80 }}>
              <div className="section-label">Patterns</div>
              <div className="section-title">Page Templates</div>
              <div className="section-desc" style={{ margin: "0 auto" }}>
                Complete pages built with DNA starters. Click to preview with live palette switching.
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              {templates.map((route, i) => (
                <Link key={route.path} to={route.path} className={`glass-card reveal reveal-delay-${(i % 5) + 1}`}>
                  <div className="card-preview">
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      opacity="0.2"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                  </div>
                  <div className="card-body">
                    <div className="card-label">{PALETTES[route.palette].name}</div>
                    <div className="card-title">{route.label}</div>
                    <div className="card-desc">
                      {route.palette} palette &middot;{" "}
                      {route.path === "/landing"
                        ? "Header layout"
                        : route.path === "/blog" || route.path === "/portfolio" || route.path === "/ecommerce"
                          ? "Header layout"
                          : "Sidebar layout"}
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 999,
                          background: "var(--bg-surface)",
                          color: "var(--text-muted)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {route.palette}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 999,
                          background: "var(--bg-surface)",
                          color: "var(--text-muted)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        dark + light
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Design System ── */}
        <div className="section">
          <div className="section-inner">
            <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
              <div className="section-label">Foundation</div>
              <div className="section-title">Design System</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              {system.map((route) => (
                <Link key={route.path} to={route.path} className="glass-card reveal">
                  <div className="card-body">
                    <div className="card-label">System</div>
                    <div className="card-title">{route.label}</div>
                    <div className="card-desc">
                      {route.path === "/design-system"
                        ? "Tokens, typography, spacing, colors, motion — the foundation every component inherits"
                        : "Interactive showcase of all 24 starters: primitives, patterns, and layout components"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── How to Use ── */}
        <div className="section">
          <div className="section-inner">
            <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
              <div className="section-label">Guide</div>
              <div className="section-title">How It Works</div>
              <div className="section-desc" style={{ margin: "0 auto" }}>
                Five steps from idea to production. No commands to memorize.
              </div>
            </div>
            <div className="glass-card reveal" style={{ padding: "48px 40px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                <Step n={1} title="Tell APEX what to build">
                  Say "Build me an LMS app" — APEX auto-generates a PRD and picks the right Design DNA recipe for your
                  app type. No slash commands needed.
                </Step>
                <Step n={2} title="APEX reads the recipe">
                  Each app type has a recipe: palette, background, layout pattern, and starter components. The builder
                  gets these values injected into its prompt automatically.
                </Step>
                <Step n={3} title="Components are copied, not translated">
                  The builder copies TSX from{" "}
                  <code style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace", fontSize: "0.85em" }}>
                    starters/
                  </code>{" "}
                  directly into your project. What you see in this showcase is the actual code that ships.
                </Step>
                <Step n={4} title="Tokens drive the theme">
                  Import one palette CSS file and all components inherit colors via CSS variables. Switch palettes by
                  changing one import line.
                </Step>
                <Step n={5} title="Dark + light from day one">
                  Every palette has both variants. The ThemeToggle starter handles persistence. Both modes work out of
                  the box. This is the Way.
                </Step>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Start ── */}
        <div className="section">
          <div className="section-inner">
            <div className="reveal" style={{ marginBottom: 24 }}>
              <div className="section-label">Quick Start</div>
            </div>
            <div className="code-block reveal">
              <div className="code-header">
                <div className="code-dots">
                  <div className="code-dot" style={{ background: "#ff5f57" }} />
                  <div className="code-dot" style={{ background: "#febc2e" }} />
                  <div className="code-dot" style={{ background: "#28c840" }} />
                </div>
                <span
                  style={{
                    marginLeft: 12,
                    fontSize: 12,
                    color: "var(--text-muted)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  terminal
                </span>
              </div>
              <pre
                style={{
                  padding: "24px 28px",
                  fontSize: 13,
                  lineHeight: 1.8,
                  overflowX: "auto",
                  color: "var(--text-secondary)",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
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
          </div>
        </div>

        {/* ── Changelog (parsed from CHANGELOG.md) ── */}
        <div className="section">
          <div className="section-inner">
            <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
              <div className="section-label">History</div>
              <div className="section-title">Changelog</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {parseChangelog().map((entry) => (
                <Entry key={entry.version} v={entry.version} d={entry.date} t={entry.title}>
                  {entry.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </Entry>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="footer">
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
            Forged by Bueno & Claude &middot; S&atilde;o Paulo &middot; 2026
          </p>
          <p
            style={{
              fontFamily: "Instrument Serif, Georgia, serif",
              fontStyle: "italic",
              fontSize: 15,
              color: "var(--text-muted)",
            }}
          >
            "The beskar is pure. This is the Way."
          </p>
        </div>
      </div>
    </>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <div className="step-number">{n}</div>
      <div>
        <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>{title}</div>
        <div style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" }}>{children}</div>
      </div>
    </div>
  );
}

function Entry({ v, d, t, children }: { v: string; d: string; t: string; children: React.ReactNode }) {
  return (
    <div className="glass-card reveal">
      <div className="card-body">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span
            style={{
              fontSize: 12,
              fontFamily: "JetBrains Mono",
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 8,
              background: "var(--accent-glow)",
              color: "var(--accent)",
            }}
          >
            {v}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{d}</span>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>&mdash; {t}</span>
        </div>
        <ul
          style={{ fontSize: 14, lineHeight: 1.8, marginLeft: 20, color: "var(--text-secondary)", listStyle: "disc" }}
        >
          {children}
        </ul>
      </div>
    </div>
  );
}
