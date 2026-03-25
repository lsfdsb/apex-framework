import { Heart, Lock, MapPin, Palette, Rocket, Shield, Sparkles, Users, Workflow } from "lucide-react";
import { PIPELINE_PHASES } from "../data/hub-data";
import { LucideIcon } from "../components/hub/LucideIcon";
import { Link } from "../router/Router";

// ── Values ───────────────────────────────────────────────────────────────────

const VALUES = [
  { icon: <Shield size={20} />, title: "Quality is Non-Negotiable", text: "7-phase QA gate. Security scanning. Accessibility audits. CX reviews. Nothing ships without passing every gate." },
  { icon: <Users size={20} />, title: "The Framework Teaches", text: "Every action explains what and why. Users don't just build — they learn software engineering principles along the way." },
  { icon: <Rocket size={20} />, title: "Autonomous by Default", text: "3 user decisions. Everything else is autonomous. 5 agents coordinate, quality gates auto-fix, documentation writes itself." },
  { icon: <Sparkles size={20} />, title: "Apple-Grade Polish", text: "The last 10% is the other 90%. Truncated text, stale versions, dead references — these are quality failures, not nitpicks." },
] as const;

// ── Apple EPM Principles ──────────────────────────────────────────────────────

const EPM_PRINCIPLES = [
  {
    heading: "No Story Points",
    body: "Concrete tasks with explicit acceptance criteria. Done means all criteria are met — not 'mostly done'.",
  },
  {
    heading: "DRI Ownership",
    body: "Every task has one Directly Responsible Individual. One owner, no ambiguity, no diffused accountability.",
  },
  {
    heading: "Phases, Not Sprints",
    body: "P0 ships first. P1 follows. P2 is polish. Under pressure, you know exactly what to cut.",
  },
  {
    heading: "WIP Limits",
    body: "In-Progress capped at 2. Review capped at 1. Focus beats context-switching every time.",
  },
  {
    heading: "Quality Gates",
    body: "Each phase ends at a gate. Gates enforce the standard. Nothing slips through by accident.",
  },
];

// ── Phase Timeline Card ───────────────────────────────────────────────────────

function PhaseCard({ phase, index }: { phase: (typeof PIPELINE_PHASES)[number]; index: number }) {
  const num = String(phase.id).padStart(2, "0");

  return (
    <div
      style={{
        display: "flex",
        gap: 0,
        position: "relative",
      }}
    >
      {/* Timeline column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 56,
          flexShrink: 0,
        }}
      >
        {/* Circle node */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: phase.isGate ? "var(--accent)" : "var(--bg-elevated)",
            border: `2px solid ${phase.isGate ? "var(--accent)" : "var(--border)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: phase.isGate ? "var(--bg)" : "var(--accent)",
            flexShrink: 0,
            zIndex: 1,
            position: "relative",
          }}
          aria-hidden="true"
        >
          <LucideIcon name={phase.icon} size={18} />
        </div>
        {/* Connecting line — don't render after last item */}
        {index < PIPELINE_PHASES.length - 1 && (
          <div
            aria-hidden="true"
            style={{
              flex: 1,
              width: 2,
              borderLeft: "2px dashed var(--border)",
              marginTop: 4,
              marginBottom: 0,
              minHeight: 40,
            }}
          />
        )}
      </div>

      {/* Card content */}
      <div
        style={{
          flex: 1,
          marginLeft: 20,
          marginBottom: index < PIPELINE_PHASES.length - 1 ? 24 : 0,
          background: "var(--bg-elevated)",
          border: phase.isGate ? "1px solid var(--accent)" : "1px solid var(--border)",
          borderLeft: phase.isGate ? "3px solid var(--accent)" : "1px solid var(--border)",
          borderRadius: 14,
          padding: "24px 24px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Phase number — decorative background digit */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -8,
            right: 16,
            fontSize: 72,
            fontWeight: 900,
            color: "var(--accent)",
            opacity: 0.06,
            lineHeight: 1,
            fontFamily: "var(--font-display)",
            userSelect: "none",
          }}
        >
          {num}
        </div>

        {/* Phase number + name row */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "var(--accent)",
              letterSpacing: "0.06em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {num}
          </span>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            {phase.name}
          </h3>
          {phase.isGate && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 8px",
                borderRadius: 20,
                background: "var(--accent-glow, color-mix(in srgb, var(--accent) 15%, transparent))",
                border: "1px solid var(--accent)",
                color: "var(--accent)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginLeft: 4,
              }}
            >
              <Lock size={10} />
              Gate
            </span>
          )}
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            marginBottom: 16,
          }}
        >
          {phase.description}
        </p>

        {/* Agents + Skills badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {phase.agents.map((agent) => (
            <span
              key={agent}
              style={{
                padding: "3px 10px",
                borderRadius: 20,
                background: "var(--bg-surface, var(--bg))",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {agent}
            </span>
          ))}
          {phase.skills.map((skill) => (
            <span
              key={skill}
              style={{
                padding: "3px 10px",
                borderRadius: 20,
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontSize: 11,
                fontFamily: "var(--font-mono, monospace)",
                letterSpacing: "0.02em",
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Teaching point */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 14,
            color: "var(--text-muted)",
            lineHeight: 1.6,
            margin: 0,
            paddingTop: 14,
            borderTop: "1px solid var(--border)",
          }}
        >
          "{phase.teachingPoint}"
        </p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>

      {/* ── Section 1: Hero ── */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
          The Story
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 36, fontWeight: 400, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 16 }}>
          About APEX Framework
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Agent-Powered EXcellence for Claude Code.
        </p>
      </div>

      {/* ── Section 2: Origin ── */}
      <div style={{
        background: "var(--bg-elevated)", border: "1px solid var(--border)",
        borderRadius: 16, padding: "32px 28px", marginBottom: 56,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: "var(--text-muted)", fontSize: 13 }}>
          <MapPin size={14} />
          São Paulo, Brazil · 2026
        </div>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
          APEX started as a question: <em style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>"What if AI didn't just write code — but built software the way Apple builds products?"</em>
        </p>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
          Product vision like Jobs. Design like Ive. Code like Torvalds and Dean. Security like Ionescu and Rutkowska. Business like Amodei. Experience like Disney.
        </p>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8 }}>
          Built by <strong style={{ color: "var(--text)" }}>Bueno & Claude</strong>, APEX is a complete framework for Claude Code that enforces quality at every step — from PRD to production. 22 skills, 5 specialized agents, 14 hooks, and a 7-phase autonomous pipeline that turns "build me X" into shipped, tested, documented code.
        </p>
      </div>

      {/* ── Section 2b: The Two Apps ── */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            The Products
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 400,
            color: "var(--text)", letterSpacing: "-0.02em",
            lineHeight: 1.15, marginBottom: 12,
          }}>
            The Two Apps
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 560 }}>
            APEX ships two complementary tools. One keeps you in command of every build. The other guarantees every screen looks world-class.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>

          {/* OPS card */}
          <div style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}>
            {/* Accent bar */}
            <div style={{ height: 3, background: "var(--accent)" }} />

            <div style={{ padding: "28px 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Icon + title row */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent)", flexShrink: 0,
                }}>
                  <Workflow size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                    <span style={{ fontWeight: 800 }}>APEX</span>{" "}
                    <span style={{ fontWeight: 400 }}>OPS</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>
                    The Command Center
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20 }}>
                A project management dashboard built into the framework. See what's being built, who's building it, and where it stands — all in real time.
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Projects with sub-projects, phases, and DRI ownership",
                  "Apple EPM Kanban — WIP-limited, gate-enforced",
                  "Live agent tracking — tasks move as agents work",
                  "No manual updates — live sync by default",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: "var(--accent)", flexShrink: 0, marginTop: 7,
                    }} />
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: "auto" }}>
                <Link
                  to="/projects"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 13, fontWeight: 600, color: "var(--accent)",
                    textDecoration: "none", letterSpacing: "0.01em",
                  }}
                >
                  Explore OPS
                  <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>&#8594;</span>
                </Link>
              </div>
            </div>
          </div>

          {/* DNA card */}
          <div style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}>
            {/* Accent bar */}
            <div style={{ height: 3, background: "var(--accent)" }} />

            <div style={{ padding: "28px 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Icon + title row */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent)", flexShrink: 0,
                }}>
                  <Palette size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                    <span style={{ fontWeight: 800 }}>APEX</span>{" "}
                    <span style={{ fontWeight: 400 }}>DNA</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>
                    The Design System
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20 }}>
                14 premium UI templates and 33 starter components. Every app built with APEX inherits world-class design automatically — builders write only business logic.
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "14 template types: Landing, SaaS, CRM, Blog, Portfolio, and 9 more",
                  "33 starter components — promote to src/components/ and customize",
                  "Design tokens: palette, typography, spacing, motion",
                  "Builders read the DNA recipe, copy starters, ship fast",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: "var(--accent)", flexShrink: 0, marginTop: 7,
                    }} />
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: "auto" }}>
                <Link
                  to="/dna"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 13, fontWeight: 600, color: "var(--accent)",
                    textDecoration: "none", letterSpacing: "0.01em",
                  }}
                >
                  Explore DNA
                  <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>&#8594;</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Section 3: 7-Phase Pipeline ── */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            How it works
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 400,
            color: "var(--text)", letterSpacing: "-0.02em",
            lineHeight: 1.15, marginBottom: 12,
          }}>
            The 7-Phase Pipeline
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 580 }}>
            From idea to production — autonomously. You make 3 decisions at gate phases. APEX handles everything between them.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {PIPELINE_PHASES.map((phase, index) => (
            <PhaseCard key={phase.id} phase={phase} index={index} />
          ))}
        </div>
      </div>

      {/* ── Section 4: The Creed ── */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Values
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 400,
            color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.15,
          }}>
            What we believe
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 40 }}>
          {VALUES.map((v) => (
            <div key={v.title} style={{
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              borderRadius: 12, padding: "24px 20px",
            }}>
              <div style={{ color: "var(--accent)", marginBottom: 12, display: "flex" }}>{v.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 8, fontFamily: "var(--font-body)" }}>
                {v.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {v.text}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", padding: "32px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <p style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: 18, color: "var(--text-muted)", lineHeight: 1.8,
            maxWidth: 500, margin: "0 auto 12px",
          }}>
            "Never ship untested code. Never skip the PRD. Never break the build. Weapons are part of my religion."
          </p>
          <p style={{ fontSize: 12, color: "var(--accent)", letterSpacing: "0.06em", fontWeight: 600 }}>
            This is the Way.
          </p>
        </div>
      </div>

      {/* ── Section 5: Apple EPM Methodology ── */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Methodology
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 400,
            color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 12,
          }}>
            Apple EPM
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 560 }}>
            Engineering Project Management — the discipline that keeps APEX teams moving without letting quality slip. No sprints, no story points, no ambiguity.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}>
          {EPM_PRINCIPLES.map(({ heading, body }) => (
            <div
              key={heading}
              style={{
                padding: "20px 20px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: 12,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>
                {heading}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 6: Footer ── */}
      <div style={{ textAlign: "center", paddingTop: 24, borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: 13 }}>
          <Heart size={14} style={{ color: "var(--destructive)" }} />
          Forged by Bueno & Claude · São Paulo · 2026
        </div>
      </div>

    </div>
  );
}
