import { AgentCard } from "../components/agents/AgentCard";
import { BreathingLoop } from "../components/agents/BreathingLoop";
import { ResponsibilityMatrix } from "../components/agents/ResponsibilityMatrix";
import { AGENT_ROSTER } from "../data/hub-data";

/* ── Section Divider ─────────────────────────────────────────────────────── */

function SectionDivider() {
  return (
    <div
      style={{
        height: 1,
        background: "var(--border)",
        margin: "56px 0",
      }}
    />
  );
}

/* ── Section Header ──────────────────────────────────────────────────────── */

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--accent)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {eyebrow}
      </div>
      <h2
        style={{
          fontSize: "clamp(24px, 3vw, 32px)",
          fontWeight: 700,
          color: "var(--text)",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          marginBottom: subtitle ? 12 : 0,
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            maxWidth: 620,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ── Teaching Section ────────────────────────────────────────────────────── */

interface TeachingPointProps {
  icon: string;
  heading: string;
  body: string;
}

function TeachingPoint({ icon, heading, body }: TeachingPointProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: "20px 24px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 12,
      }}
    >
      <span
        style={{ fontSize: 24, lineHeight: 1, flexShrink: 0, marginTop: 2 }}
        role="img"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 6,
          }}
        >
          {heading}
        </div>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */

export default function AgentsPage() {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px 80px" }}>

      {/* ── Hero ── */}
      <div style={{ marginBottom: 48 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--accent)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Agent Architecture
        </div>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 400,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: 16,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
          }}
        >
          The Championship Roster
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "var(--text-secondary)",
            maxWidth: 560,
            lineHeight: 1.6,
          }}
        >
          Every agent is elite at one thing. No redundancy. Clear separation of concerns.
        </p>
      </div>

      {/* ── Agent Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 20,
          marginBottom: 8,
        }}
        role="list"
        aria-label="Agent roster"
      >
        {AGENT_ROSTER.map((agent) => (
          <div key={agent.name} role="listitem">
            <AgentCard agent={agent} />
          </div>
        ))}
      </div>

      <SectionDivider />

      {/* ── Breathing Loop ── */}
      <SectionHeader
        eyebrow="Coordination Pattern"
        title="The Breathing Loop"
        subtitle="The framework breathes when the team operates as a continuous cycle without human intervention."
      />

      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <BreathingLoop />
      </div>

      <SectionDivider />

      {/* ── Responsibility Matrix ── */}
      <SectionHeader
        eyebrow="Ownership Model"
        title="Scan Responsibility Matrix"
        subtitle="Every concern has exactly one primary owner. Overlap causes conflicts; gaps cause failures."
      />

      <ResponsibilityMatrix />

      <SectionDivider />

      {/* ── Teaching: Why Multi-Agent? ── */}
      <SectionHeader
        eyebrow="The Philosophy"
        title="Why multi-agent?"
        subtitle="Specialization beats generalism. One elite agent per concern outperforms one generalist handling everything."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        <TeachingPoint
          icon="🎯"
          heading="Focused context windows"
          body="Each agent loads only what it needs. The Builder carries architecture context. The QA agent loads the quality checklist. Smaller, focused context = better decisions."
        />
        <TeachingPoint
          icon="⚡"
          heading="Parallel execution"
          body="The Watcher monitors in the background while the Builder writes code. QA runs as soon as a task lands in review. No waiting — continuous progress."
        />
        <TeachingPoint
          icon="🛡️"
          heading="Clear accountability"
          body="Every concern has one primary owner. When CHANGELOG has a bug, it's the Technical Writer's scope. When a security flaw ships, it's QA's gate that failed. No ambiguity."
        />
        <TeachingPoint
          icon="🔄"
          heading="The Breathing Loop"
          body="Watcher detects, Builder fixes, QA verifies, Writer documents. The loop runs continuously without human intervention — until the user approves the ship."
        />
        <TeachingPoint
          icon="📐"
          heading="Right model for the job"
          body="Opus for decisions that need deep reasoning — architecture and final review. Sonnet for heavy lifting — building and quality. Haiku for high-frequency monitoring — fast and cheap."
        />
        <TeachingPoint
          icon="🏆"
          heading="Compounding quality"
          body="Each agent catches what the previous missed. The Builder writes; the Watcher catches type errors; QA verifies zero remain; the Writer confirms the docs match reality. Defense in depth."
        />
      </div>

    </div>
  );
}
