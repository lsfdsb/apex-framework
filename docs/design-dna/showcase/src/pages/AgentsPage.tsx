import { AgentCard } from "../components/agents/AgentCard";
import { BreathingLoop } from "../components/agents/BreathingLoop";
import { ResponsibilityMatrix } from "../components/agents/ResponsibilityMatrix";
import { AGENT_ROSTER } from "../data/hub-data";
import { useApexState } from "../hooks/useApexState";
import { LiveBadge } from "../components/hub/LiveBadge";
import type { AgentState } from "../data/hub-types";

const DEFAULT_AGENT_STATE: AgentState = { agents: [] };

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

/* ── Main Page ───────────────────────────────────────────────────────────── */

export default function AgentsPage() {
  const { data: agentState, isLive, lastUpdated } = useApexState<AgentState>(
    "agents.json",
    DEFAULT_AGENT_STATE
  );

  // Build a lookup: agent name → live status (for card highlighting)
  const liveStatusMap: Record<string, "idle" | "active"> = {};
  if (isLive) {
    for (const instance of agentState.agents) {
      liveStatusMap[instance.name] = instance.status === "active" ? "active" : "idle";
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px 80px", minHeight: "calc(100vh - 120px)" }}>

      {/* ── Hero ── */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--accent)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              flex: 1,
            }}
          >
            Agent Architecture
          </div>
          <LiveBadge isLive={isLive} lastUpdated={lastUpdated} />
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
            <AgentCard
              agent={agent}
              status={isLive ? (liveStatusMap[agent.name] ?? "idle") : "idle"}
            />
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

    </div>
  );
}
