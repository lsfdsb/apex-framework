import React from "react";

interface Lead {
  score: number;
  name: string;
  company: string;
  factors: string[];
  strokeColor: string;
  dashOffset: number;
}

const leads: Lead[] = [
  {
    score: 92,
    name: "Elena Rodriguez",
    company: "Series B Startup",
    factors: ["website visit", "demo booked", "budget confirmed"],
    strokeColor: "var(--success)",
    dashOffset: 18,
  },
  {
    score: 72,
    name: "James Okafor",
    company: "Enterprise Corp",
    factors: ["pricing page", "email opened"],
    strokeColor: "var(--accent)",
    dashOffset: 55,
  },
  {
    score: 45,
    name: "Priya Patel",
    company: "Early Stage",
    factors: ["blog reader", "free trial"],
    strokeColor: "var(--warning)",
    dashOffset: 108,
  },
  {
    score: 15,
    name: "Tom Hansen",
    company: "Unknown",
    factors: ["single visit"],
    strokeColor: "var(--text-muted)",
    dashOffset: 168,
  },
];

const cardStyle: React.CSSProperties = {
  background: "var(--bg-elevated)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  padding: 24,
  textAlign: "center",
  transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
  cursor: "default",
};

export default function LeadScoreCards() {
  const [hovered, setHovered] = React.useState<number | null>(null);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
      }}
    >
      {leads.map((lead, i) => (
        <div
          key={lead.name}
          style={{
            ...cardStyle,
            borderColor: hovered === i ? "var(--border-hover)" : "var(--border)",
            transform: hovered === i ? "translateY(-2px)" : "translateY(0)",
          }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Score ring */}
          <div style={{ width: 80, height: 80, margin: "0 auto 16px", position: "relative" }}>
            <svg viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke="var(--bg-surface)"
                strokeWidth="6"
              />
              <circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke={lead.strokeColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="197"
                strokeDashoffset={lead.dashOffset}
                style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.22,1,0.36,1)" }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 700,
                color: lead.score > 20 ? lead.strokeColor : undefined,
              }}
            >
              {lead.score}
            </div>
          </div>

          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{lead.name}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>{lead.company}</div>

          <div style={{ display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
            {lead.factors.map((f) => (
              <span
                key={f}
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--text-muted)",
                  padding: "3px 8px",
                  background: "var(--bg-surface)",
                  borderRadius: 999,
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
