import { useState, useEffect } from "react";
import { Link } from "../router/Router";
import { Workflow, Palette, GitPullRequest, Boxes, ShieldCheck, Users, ArrowRight, TrendingUp, Sparkles } from "lucide-react";

/* ── CountUp ──────────────────────────────────────────────────────────────── */

function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <>{value}</>;
}

/* ── HUB Card ─────────────────────────────────────────────────────────────── */

function HubCard({ suffix, description, href, accent, icon, children }: {
  suffix: string;
  description: string;
  href: string;
  accent: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Link to={href} style={{ textDecoration: "none", flex: "1 1 0", minWidth: 280 }}>
      <div
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "28px 24px",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          position: "relative",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.3), 0 0 0 1px ${accent}`;
          e.currentTarget.style.borderColor = accent;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "";
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      >
        {/* Accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent }} />

        {/* Icon + Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ color: accent, display: "flex" }}>{icon}</div>
          <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em", color: "var(--text)" }}>
            APEX
            <span style={{ color: "var(--text-muted)", fontWeight: 300, marginLeft: 5, fontSize: 16, letterSpacing: "0.02em" }}>
              {suffix}
            </span>
          </span>
        </div>

        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
          {description}
        </p>

        {children}

        <div style={{ display: "flex", alignItems: "center", gap: 6, color: accent, fontSize: 13, fontWeight: 600, marginTop: 16 }}>
          Explore <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}

/* ── Metric Row ───────────────────────────────────────────────────────────── */

const METRICS = [
  { icon: <GitPullRequest size={16} />, label: "PRs Merged", value: 202 },
  { icon: <Boxes size={16} />, label: "Components", value: 72 },
  { icon: <ShieldCheck size={16} />, label: "QA Gates Passed", value: 198 },
  { icon: <Users size={16} />, label: "Agents Active", value: 5 },
  { icon: <TrendingUp size={16} />, label: "Versions Shipped", value: 22 },
] as const;

/* ── Main Page ────────────────────────────────────────────────────────────── */

export default function HubHome() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px 80px" }}>

      {/* ── Hero ── */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
          Agent-Powered EXcellence
        </div>
        <h1 style={{ marginBottom: 20, fontFamily: "var(--font-body)", lineHeight: 1.0 }}>
          <span style={{ fontSize: "clamp(42px, 6vw, 60px)", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.04em" }}>
            APEX
          </span>
          <span style={{ fontSize: "clamp(42px, 6vw, 60px)", fontWeight: 300, color: "var(--text-muted)", marginLeft: "clamp(6px, 1vw, 12px)", letterSpacing: "-0.03em" }}>
            Framework
          </span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7, fontFamily: "var(--font-body)" }}>
          Watch AI build software the right way. 7 phases. 5 agents. Quality gates that never sleep.
        </p>
      </div>

      {/* ── Cards (equal height with flex) ── */}
      <div style={{ display: "flex", gap: 20, marginBottom: 40, flexWrap: "wrap", alignItems: "stretch" }}>
        <HubCard
          suffix="OPS"
          description="The 7-phase autonomous pipeline that turns ideas into production code. See agents work, tasks move, and quality gates execute."
          href="/projects"
          accent="var(--accent)"
          icon={<Workflow size={20} />}
        >
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>7 phases · 5 agents · 3 user gates</div>
        </HubCard>
        <HubCard
          suffix="DNA"
          description="14 premium UI templates, 33 starters, 39 components. The visual quality bar that every APEX build inherits."
          href="/dna"
          accent="var(--success)"
          icon={<Palette size={20} />}
        >
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>14 templates · 33 starters · 65 files</div>
        </HubCard>
      </div>

      {/* ── What's New (compact changelog preview) ── */}
      <Link to="/changelog" style={{ textDecoration: "none", display: "block", marginBottom: 40 }}>
        <div style={{
          background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 12,
          padding: "16px 20px", display: "flex", alignItems: "center", gap: 12,
          transition: "all 0.2s", cursor: "pointer",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
        >
          <Sparkles size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: "var(--text-secondary)", flex: 1 }}>
            <strong style={{ color: "var(--text)" }}>v5.22</strong> — PM Agent, 7-phase pipeline, Visual HUB, CI upgrades
          </span>
          <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}>
            Changelog <ArrowRight size={12} />
          </span>
        </div>
      </Link>

      {/* ── Dynamic Metrics ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12,
        marginBottom: 48,
      }}>
        {METRICS.map((m) => (
          <div key={m.label} style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "20px 16px",
            textAlign: "center",
          }}>
            <div style={{ display: "flex", justifyContent: "center", color: "var(--accent)", marginBottom: 8 }}>
              {m.icon}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em", fontFamily: "var(--font-body)" }}>
              <CountUp target={m.value} />
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── The Creed ── */}
      <div style={{ textAlign: "center", paddingTop: 32, borderTop: "1px solid var(--border)" }}>
        <p style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: 17, color: "var(--text-muted)", lineHeight: 1.8,
          maxWidth: 500, margin: "0 auto",
        }}>
          "Never ship untested code. Never skip the PRD. Never break the build. Weapons are part of my religion."
        </p>
        <p style={{ fontSize: 12, color: "var(--accent)", marginTop: 12, letterSpacing: "0.06em", fontWeight: 600 }}>
          This is the Way.
        </p>
      </div>
    </div>
  );
}
