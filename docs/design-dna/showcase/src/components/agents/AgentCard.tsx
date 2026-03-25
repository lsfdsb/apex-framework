import type { AgentDefinition } from "../../data/hub-types";

interface AgentCardProps {
  agent: AgentDefinition;
  status?: "idle" | "active";
}

// Model badge color map
const MODEL_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  opus:   { label: "Opus",   bg: "rgba(212,175,55,0.15)", color: "#d4af37" },
  sonnet: { label: "Sonnet", bg: "var(--accent-glow)",    color: "var(--accent)" },
  haiku:  { label: "Haiku",  bg: "var(--bg-surface)",     color: "var(--text-muted)" },
};

export function AgentCard({ agent, status = "idle" }: AgentCardProps) {
  const badge = MODEL_BADGE[agent.model] ?? MODEL_BADGE.haiku;
  const isActive = status === "active";

  const cardStyle: React.CSSProperties = {
    background: "var(--bg-elevated)",
    border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
    borderRadius: 16,
    overflow: "hidden",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
    boxShadow: isActive
      ? "0 0 0 1px var(--accent), 0 0 32px var(--accent-glow), 0 8px 32px rgba(0,0,0,0.2)"
      : "0 2px 8px rgba(0,0,0,0.12)",
    cursor: "default",
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 12px 40px rgba(0,0,0,0.25)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-hover)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLDivElement).style.transform = "none";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 2px 8px rgba(0,0,0,0.12)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
        }
      }}
      role="article"
      aria-label={`${agent.name} — ${agent.role}`}
    >
      {/* Header: icon + name + model badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            fontSize: 28,
            lineHeight: 1,
            display: "block",
            filter: isActive ? "drop-shadow(0 0 8px var(--accent))" : "none",
            transition: "filter 0.3s ease",
          }}
          role="img"
          aria-hidden="true"
        >
          {agent.icon}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "var(--text)",
              }}
            >
              {agent.name}
            </span>

            {/* Status indicator */}
            {isActive && (
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  boxShadow: "0 0 8px var(--accent)",
                  flexShrink: 0,
                }}
                aria-label="Active"
              />
            )}
          </div>

          <span
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 500,
            }}
          >
            {agent.role}
          </span>
        </div>

        {/* Model badge */}
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 999,
            background: badge.bg,
            color: badge.color,
            border: `1px solid ${badge.color}`,
            whiteSpace: "nowrap",
            flexShrink: 0,
            opacity: badge.color === "#d4af37" ? 1 : 0.85,
          }}
        >
          {badge.label}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)" }} />

      {/* Tagline — italic serif */}
      <p
        style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontStyle: "italic",
          fontSize: 15,
          lineHeight: 1.5,
          color: "var(--text-secondary)",
          margin: 0,
        }}
      >
        "{agent.tagline}"
      </p>

      {/* Teaching point */}
      <p
        style={{
          fontSize: 13,
          lineHeight: 1.6,
          color: "var(--text-muted)",
          margin: 0,
        }}
      >
        {agent.teachingPoint}
      </p>

      {/* Responsibilities */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
        {agent.responsibilities.map((r) => (
          <span
            key={r}
            style={{
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 999,
              background: "var(--bg-surface)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
              whiteSpace: "nowrap",
            }}
          >
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}
