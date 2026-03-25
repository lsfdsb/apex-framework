import { useState } from "react";

// Only the agents that appear in the matrix (per PRD §6.4)
const MATRIX_AGENTS = [
  { name: "Builder", model: "sonnet", icon: "⚒️" },
  { name: "QA",      model: "sonnet", icon: "🛡️" },
  { name: "Watcher", model: "haiku",  icon: "👁️" },
  { name: "Writer",  model: "haiku",  icon: "✍️" },
] as const;

type Ownership = "primary" | "none";

interface ConcernRow {
  concern: string;
  tooltip: string;
  cells: Ownership[];
}

// Columns order matches MATRIX_AGENTS: Builder, QA, Watcher, Writer
const CONCERNS: ConcernRow[] = [
  {
    concern: "TypeScript errors",
    tooltip: "Builder writes the code; Watcher catches type errors in real-time; QA verifies none remain at the gate.",
    cells: ["primary", "primary", "primary", "none"],
  },
  {
    concern: "Test coverage",
    tooltip: "Builder writes the tests alongside the feature. QA runs the full suite and enforces the coverage threshold.",
    cells: ["primary", "primary", "none", "none"],
  },
  {
    concern: "Security",
    tooltip: "Builder avoids injection and auth bypass patterns while coding. QA scans for OWASP Top 10 vulnerabilities before ship.",
    cells: ["primary", "primary", "none", "none"],
  },
  {
    concern: "Performance",
    tooltip: "Builder applies lazy-loading, memoization, and pagination. QA benchmarks against LCP < 1.5s and INP < 100ms. Watcher monitors build times.",
    cells: ["primary", "primary", "primary", "none"],
  },
  {
    concern: "Documentation",
    tooltip: "The Technical Writer owns CHANGELOG, README, and PRD status. Nothing ships undocumented — this is architecture that humans read.",
    cells: ["none", "none", "none", "primary"],
  },
  {
    concern: "CHANGELOG",
    tooltip: "Only the Technical Writer updates CHANGELOG.md. Single owner prevents duplicates and keeps the release narrative coherent.",
    cells: ["none", "none", "none", "primary"],
  },
];

// Model badge styles (matches AgentCard)
const MODEL_BADGE: Record<string, { bg: string; color: string }> = {
  opus:   { bg: "rgba(212,175,55,0.15)", color: "#d4af37" },
  sonnet: { bg: "var(--accent-glow)",    color: "var(--accent)" },
  haiku:  { bg: "var(--bg-surface)",     color: "var(--text-muted)" },
};

export function ResponsibilityMatrix() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; row: number } | null>(null);

  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "20px 24px 0" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--accent)",
            marginBottom: 6,
          }}
        >
          Ownership Model
        </div>
        <div
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 20,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "var(--text)",
            marginBottom: 16,
          }}
        >
          Responsibility Matrix
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
          }}
          aria-label="Agent responsibility matrix"
        >
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {/* Concern column */}
              <th
                style={{
                  padding: "12px 24px",
                  textAlign: "left",
                  fontWeight: 500,
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                Concern
              </th>

              {/* Agent columns */}
              {MATRIX_AGENTS.map((agent) => {
                const badge = MODEL_BADGE[agent.model];
                return (
                  <th
                    key={agent.name}
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span style={{ fontSize: 16 }} role="img" aria-hidden="true">
                        {agent.icon}
                      </span>
                      <span style={{ color: "var(--text)", fontSize: 12 }}>
                        {agent.name}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.color}`,
                        }}
                      >
                        {agent.model.charAt(0).toUpperCase() + agent.model.slice(1)}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {CONCERNS.map((row, rowIdx) => {
              const isHovered = hoveredRow === rowIdx;
              return (
                <tr
                  key={row.concern}
                  onMouseEnter={() => setHoveredRow(rowIdx)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    borderBottom:
                      rowIdx < CONCERNS.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                    background: isHovered ? "var(--bg-surface)" : "transparent",
                    transition: "background 0.15s ease",
                  }}
                >
                  {/* Concern label + tooltip trigger */}
                  <td style={{ padding: "14px 24px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span style={{ color: "var(--text)", fontWeight: 500 }}>
                        {row.concern}
                      </span>
                      <button
                        onMouseEnter={() =>
                          setTooltip({ text: row.tooltip, row: rowIdx })
                        }
                        onMouseLeave={() => setTooltip(null)}
                        onFocus={() =>
                          setTooltip({ text: row.tooltip, row: rowIdx })
                        }
                        onBlur={() => setTooltip(null)}
                        aria-label={`Learn about ${row.concern} ownership`}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          color: "var(--text-muted)",
                          display: "flex",
                          alignItems: "center",
                          fontSize: 11,
                          position: "relative",
                        }}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 16v-4" />
                          <path d="M12 8h.01" />
                        </svg>

                        {/* Tooltip */}
                        {tooltip?.row === rowIdx && (
                          <div
                            role="tooltip"
                            style={{
                              position: "absolute",
                              left: "calc(100% + 8px)",
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: 240,
                              background: "var(--bg)",
                              border: "1px solid var(--border)",
                              borderRadius: 10,
                              padding: "10px 12px",
                              fontSize: 12,
                              lineHeight: 1.5,
                              color: "var(--text-secondary)",
                              zIndex: 10,
                              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                              pointerEvents: "none",
                            }}
                          >
                            {tooltip.text}
                          </div>
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Ownership cells */}
                  {row.cells.map((ownership, colIdx) => (
                    <td
                      key={`${row.concern}-${MATRIX_AGENTS[colIdx].name}`}
                      style={{ padding: "14px 16px", textAlign: "center" }}
                    >
                      {ownership === "primary" ? (
                        <span
                          title="Primary owner"
                          aria-label="Primary owner"
                          style={{
                            display: "inline-block",
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            background: "var(--accent)",
                            boxShadow: isHovered
                              ? "0 0 10px var(--accent-glow)"
                              : "none",
                            transition: "box-shadow 0.2s ease",
                          }}
                        />
                      ) : (
                        <span
                          aria-label="Not responsible"
                          style={{
                            display: "inline-block",
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            border: "1px solid var(--border)",
                            opacity: 0.4,
                          }}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div
        style={{
          padding: "12px 24px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Primary owner
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              border: "1px solid var(--border)",
              display: "inline-block",
              opacity: 0.4,
            }}
          />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Not responsible
          </span>
        </div>
        <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>
          Hover a row to highlight · Hover info icon for details
        </span>
      </div>
    </div>
  );
}
