import type { PipelinePhaseDefinition } from "../../data/hub-types";

interface PhaseDetailProps {
  phase: PipelinePhaseDefinition;
}

export function PhaseDetail({ phase }: PhaseDetailProps) {
  return (
    <div
      role="region"
      aria-label={`Details for phase ${phase.id}: ${phase.name}`}
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "28px 32px",
        marginTop: 16,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        animation: "phaseDetailIn 0.3s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{ fontSize: 28, lineHeight: 1 }}
          role="img"
          aria-hidden="true"
        >
          {phase.icon}
        </span>
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "var(--accent)",
              marginBottom: 4,
            }}
          >
            Phase {phase.id}{phase.isGate ? " — Gate" : ""}
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text)" }}>
            {phase.name}
          </div>
        </div>
        {phase.isGate && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 999,
              border: "1px solid var(--accent)",
              color: "var(--accent)",
              fontWeight: 500,
              letterSpacing: "0.08em",
            }}
          >
            User Approval Required
          </span>
        )}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: "var(--text-secondary)",
          margin: 0,
        }}
      >
        {phase.description}
      </p>

      {/* Agents + Skills row */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" as const }}>
        <BadgeGroup label="Agents" items={phase.agents} accentBg />
        <BadgeGroup label="Skills" items={phase.skills} />
      </div>

      {/* Teaching point */}
      <div
        style={{
          padding: "16px 20px",
          background: "var(--bg-surface)",
          borderRadius: 8,
          borderLeft: "3px solid var(--accent)",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: "var(--accent)",
            marginBottom: 8,
          }}
        >
          Teaching Point
        </div>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--text-secondary)",
            fontStyle: "italic",
            margin: 0,
          }}
        >
          {phase.teachingPoint}
        </p>
      </div>
    </div>
  );
}

interface BadgeGroupProps {
  label: string;
  items: string[];
  accentBg?: boolean;
}

function BadgeGroup({ label, items, accentBg = false }: BadgeGroupProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          color: "var(--text-muted)",
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
        {items.map((item) => (
          <span
            key={item}
            style={{
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 999,
              background: accentBg ? "var(--accent-glow)" : "var(--bg-surface)",
              color: accentBg ? "var(--accent)" : "var(--text-secondary)",
              border: `1px solid ${accentBg ? "var(--accent)" : "var(--border)"}`,
              fontWeight: accentBg ? 500 : 400,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
