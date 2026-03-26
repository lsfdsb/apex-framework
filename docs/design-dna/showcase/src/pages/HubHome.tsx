import { useState, useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  GitPullRequest,
  Boxes,
  Palette,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
} from "lucide-react";
import { Link } from "../router/Router";
import { LiveBadge } from "../components/hub/LiveBadge";
import { RosterPhaseCard } from "../components/hub/RosterPhaseCard";
import { RosterAgentCard } from "../components/hub/RosterAgentCard";
import { useOps } from "../context/OpsContext";
import { PIPELINE_PHASES, AGENT_ROSTER } from "../data/hub-data";

// ── CountUp ────────────────────────────────────────────────────────────────────

function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [value, setValue] = useState(prefersReducedMotion ? target : 0);
  useEffect(() => {
    if (prefersReducedMotion) return;
    let cancelled = false;
    const start = performance.now();
    const tick = (now: number) => {
      if (cancelled) return;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { cancelled = true; };
  }, [target, duration, prefersReducedMotion]);
  return <>{value}</>;
}

// ── HubCard ────────────────────────────────────────────────────────────────────

function HubCard({
  suffix, description, href, accent, icon, children,
}: {
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
          background: "var(--bg-elevated)", border: "1px solid var(--border)",
          borderRadius: 16, padding: "28px 24px", cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          position: "relative", overflow: "hidden",
          height: "100%", display: "flex", flexDirection: "column",
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
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent }} />
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

// ── SectionHeader ──────────────────────────────────────────────────────────────

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
        {label}
      </div>
      <h2 style={{
        fontFamily: "var(--font-display)", fontStyle: "italic",
        fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 400,
        color: "var(--text)", letterSpacing: "-0.02em",
        lineHeight: 1.15, marginBottom: subtitle ? 12 : 0,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 580 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Values data ────────────────────────────────────────────────────────────────

const VALUES = [
  { icon: <Shield size={20} />, title: "Quality is Non-Negotiable", text: "7-phase QA gate. Security scanning. Accessibility audits. CX reviews. Nothing ships without passing every gate." },
  { icon: <BookOpen size={20} />, title: "The Framework Teaches", text: "Every action explains what and why. Users don't just build — they learn software engineering principles along the way." },
  { icon: <RefreshCw size={20} />, title: "Autonomous by Default", text: "3 user decisions. Everything else is autonomous. Agents coordinate, quality gates auto-fix, documentation writes itself." },
  { icon: <Sparkles size={20} />, title: "Apple-Grade Polish", text: "The last 10% is the other 90%. Truncated text, stale versions, dead references — these are quality failures, not nitpicks." },
] as const;

// ── useMetrics ─────────────────────────────────────────────────────────────────

function useMetrics() {
  const { tasks, derivedAgents } = useOps();
  const totalTasks = tasks.tasks.length;
  const completedTasks = tasks.tasks.filter((t) => t.column === "done").length;
  const activeAgents = Array.from(derivedAgents.values()).filter((a) => a.status === "active").length;
  return [
    { icon: <GitPullRequest size={16} />, label: "Tasks Completed", value: completedTasks },
    { icon: <Boxes size={16} />, label: "Total Tasks", value: totalTasks },
    { icon: <ShieldCheck size={16} />, label: "QA Gates", value: completedTasks },
    { icon: <Users size={16} />, label: "Agents Active", value: activeAgents },
    { icon: <TrendingUp size={16} />, label: "Velocity", value: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0 },
  ];
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function HubHome() {
  const { session, isLive, lastUpdated } = useOps();
  const metrics = useMetrics();

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px 80px", minHeight: "calc(100vh - 120px)" }}>

      {/* ── 1. Hero ── */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <LiveBadge isLive={isLive} lastUpdated={lastUpdated} />
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
          Agent-Powered EXcellence
        </div>
        <h1 style={{ marginBottom: 20, lineHeight: 1.0 }}>
          <span style={{ fontSize: "clamp(42px, 6vw, 60px)", fontFamily: "var(--font-body)", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.04em" }}>
            APEX
          </span>
          <span style={{ fontSize: "clamp(42px, 6vw, 60px)", fontFamily: "var(--font-body)", fontWeight: 300, color: "var(--text-muted)", marginLeft: "clamp(6px, 1vw, 12px)", letterSpacing: "-0.03em" }}>
            Framework
          </span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7, fontFamily: "var(--font-body)" }}>
          Watch AI build software the right way. 7 phases. 7 agents. Quality gates that never sleep.
        </p>

        {isLive && session.branch && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 16, marginTop: 20,
            padding: "8px 16px", background: "var(--bg-elevated)",
            border: "1px solid var(--success)", borderRadius: 8,
            fontSize: 12, color: "var(--text-secondary)",
          }}>
            <span style={{ color: "var(--success)", fontWeight: 600 }}>Connected session</span>
            {session.branch && (
              <span>Branch: <code style={{ color: "var(--text)", fontFamily: "var(--font-mono, monospace)" }}>{session.branch}</code></span>
            )}
            {session.model && (
              <span>Model: <code style={{ color: "var(--text)", fontFamily: "var(--font-mono, monospace)" }}>{session.model}</code></span>
            )}
          </div>
        )}
      </div>

      {/* ── 2. Live Metrics Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 40 }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
            <div aria-hidden="true" style={{ display: "flex", justifyContent: "center", color: "var(--accent)", marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em", fontFamily: "var(--font-body)" }}>
              <CountUp target={m.value} />
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. Quick Nav Cards ── */}
      <div style={{ display: "flex", gap: 20, marginBottom: 32, flexWrap: "wrap", alignItems: "stretch" }}>
        <HubCard
          suffix="OPS"
          description="The 7-phase autonomous pipeline that turns ideas into production code. See agents work, tasks move, and quality gates execute."
          href="/projects"
          accent="var(--accent)"
          icon={<Workflow size={20} />}
        >
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>7 phases · 7 agents · 3 user gates</div>
        </HubCard>
        <HubCard
          suffix="DNA"
          description="14 premium UI templates, 33 starters, 5 palettes. The visual quality bar that every APEX build inherits."
          href="/dna"
          accent="var(--success)"
          icon={<Palette size={20} />}
        >
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>14 templates · 33 starters · 5 palettes</div>
        </HubCard>
      </div>

      {/* ── 4. What's New ── */}
      <Link to="/changelog" style={{ textDecoration: "none", display: "block", marginBottom: 56 }}>
        <div
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, transition: "all 0.2s", cursor: "pointer" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
        >
          <Sparkles size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: "var(--text-secondary)", flex: 1 }}>
            <strong style={{ color: "var(--text)" }}>v5.23</strong> — Pipeline autonomy, Supabase RAG live, 5-agent ET Review, Apple EPM strict
          </span>
          <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}>
            Changelog <ArrowRight size={12} />
          </span>
        </div>
      </Link>

      {/* ── 5. The 7-Phase Pipeline ── */}
      <div style={{ marginBottom: 64 }}>
        <SectionHeader
          label="How it works"
          title="The 7-Phase Pipeline"
          subtitle="From idea to production — autonomously. You make 3 decisions at gate phases. APEX handles everything between them."
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {PIPELINE_PHASES.map((phase, index) => (
            <RosterPhaseCard key={phase.id} phase={phase} index={index} />
          ))}
        </div>
      </div>

      {/* ── 6. Agent Roster ── */}
      <div style={{ marginBottom: 64 }}>
        <SectionHeader
          label="The Team"
          title="The Agent Roster"
          subtitle="7 specialized agents, each with a clear role. No ambiguity — every task has one DRI."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {AGENT_ROSTER.map((agent) => (
            <RosterAgentCard key={agent.name} agent={agent} />
          ))}
        </div>
      </div>

      {/* ── 7. Values ── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHeader label="Values" title="What we believe" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {VALUES.map((v) => (
            <div key={v.title} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 20px" }}>
              <div style={{ color: "var(--accent)", marginBottom: 12, display: "flex" }}>{v.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 8, fontFamily: "var(--font-body)" }}>
                {v.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{v.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8. The Creed ── */}
      <div style={{ textAlign: "center", paddingTop: 32, borderTop: "1px solid var(--border)" }}>
        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17, color: "var(--text-muted)", lineHeight: 1.8, maxWidth: 500, margin: "0 auto" }}>
          "Never ship untested code. Never skip the PRD. Never break the build. Weapons are part of my religion."
        </p>
        <p style={{ fontSize: 12, color: "var(--accent)", marginTop: 12, letterSpacing: "0.06em", fontWeight: 600 }}>
          This is the Way.
        </p>
      </div>

    </div>
  );
}
