/**
 * PipelinePage — 7-phase APEX pipeline visualization.
 * Shows each phase as a large card with Apple provenance annotations,
 * agent badges, gate indicators, and live status from OpsContext.
 */

import { useOps } from "../context/OpsContext";
import { PIPELINE_PHASES } from "../data/hub-data";
import { LucideIcon } from "../components/hub/LucideIcon";
import { LiveBadge } from "../components/hub/LiveBadge";
import type { PhaseStatus } from "../data/hub-types";

// ── Status helpers ────────────────────────────────────────────────────────────

function statusColor(status: PhaseStatus): string {
  switch (status) {
    case "active":   return "var(--accent)";
    case "complete": return "var(--success)";
    case "failed":   return "var(--destructive, #ef4444)";
    default:         return "var(--text-muted)";
  }
}

function statusLabel(status: PhaseStatus): string {
  switch (status) {
    case "active":   return "Active";
    case "complete": return "Complete";
    case "failed":   return "Failed";
    default:         return "Idle";
  }
}

// ── Phase Card ────────────────────────────────────────────────────────────────

interface PhaseCardProps {
  phase: typeof PIPELINE_PHASES[number];
  status: PhaseStatus;
  isLast: boolean;
}

function PhaseCard({ phase, status, isLast }: PhaseCardProps) {
  const accent = statusColor(status);
  const isActive = status === "active";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
          transition: "box-shadow 0.3s ease",
          boxShadow: isActive ? `0 0 0 1px ${accent}, 0 8px 32px rgba(0,0,0,0.2)` : undefined,
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 3,
            background: accent,
            opacity: status === "idle" ? 0.3 : 1,
          }}
        />

        <div style={{ padding: "24px 24px 20px", paddingTop: 28 }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
            {/* Phase number + icon */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: `${accent}18`,
                border: `1px solid ${accent}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: accent,
                position: "relative",
              }}
            >
              <LucideIcon name={phase.icon} size={22} />
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  left: -8,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "var(--bg-elevated)",
                  border: `1px solid ${accent}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: accent,
                }}
              >
                {phase.id}
              </span>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 600,
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontStyle: "italic",
                    color: "var(--text)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {phase.name}
                </h3>

                {/* Gate badge */}
                {phase.isGate && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--warning, #f59e0b)",
                      background: "rgba(245,158,11,0.12)",
                      border: "1px solid rgba(245,158,11,0.3)",
                      borderRadius: 6,
                      padding: "2px 8px",
                    }}
                  >
                    Gate
                  </span>
                )}

                {/* Status dot */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    fontWeight: 600,
                    color: accent,
                    letterSpacing: "0.04em",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: accent,
                      animation: isActive ? "livePulse 2s ease-in-out infinite" : "none",
                    }}
                  />
                  {statusLabel(status)}
                </span>
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {phase.description}
              </p>
            </div>
          </div>

          {/* Agent badges + skills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {phase.agents.map((agent) => (
              <span
                key={agent}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--accent)",
                  background: "var(--accent-subtle, rgba(99,102,241,0.1))",
                  border: "1px solid var(--accent-border, rgba(99,102,241,0.2))",
                  borderRadius: 6,
                  padding: "3px 10px",
                  letterSpacing: "0.02em",
                }}
              >
                {agent}
              </span>
            ))}
            {phase.skills.map((skill) => (
              <span
                key={skill}
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "3px 10px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Teaching point */}
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 13,
              fontStyle: "italic",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              borderLeft: `2px solid ${accent}40`,
              paddingLeft: 12,
            }}
          >
            {phase.teachingPoint}
          </p>

          {/* Apple provenance */}
          {phase.appleOrigin && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                Apple EPM
              </span>
              <span
                style={{
                  width: 1,
                  height: 12,
                  background: "var(--border)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  fontStyle: "italic",
                }}
              >
                {phase.appleOrigin}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Connector line between cards */}
      {!isLast && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "4px 0",
          }}
        >
          <div
            style={{
              width: 2,
              height: 20,
              background: `linear-gradient(to bottom, ${accent}60, var(--border))`,
              borderRadius: 1,
            }}
          />
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const { pipeline, isLive, lastUpdated } = useOps();

  // Build a lookup of phase status from live data
  const statusMap = new Map<number, PhaseStatus>(
    pipeline.phases.map((p) => [p.id, p.status])
  );

  const getStatus = (id: number): PhaseStatus =>
    statusMap.get(id) ?? "idle";

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 64px" }}>
      {/* Section header */}
      <div style={{ marginBottom: 40 }}>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          APEX Framework
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            The 7-Phase Pipeline
          </h1>
          <LiveBadge isLive={isLive} lastUpdated={lastUpdated} />
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            maxWidth: 560,
          }}
        >
          A state machine with 7 phases and 3 user gates. Modeled after Apple's EPM process —
          plan, validate, build, and ship with discipline.
        </p>
      </div>

      {/* Gate model legend */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 32,
          padding: "14px 16px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--warning, #f59e0b)",
            }}
          />
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--text)" }}>Gate</strong> — user decision required
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--accent)",
              animation: "livePulse 2s ease-in-out infinite",
            }}
          />
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--text)" }}>Active</strong> — currently running
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--success, #22c55e)",
            }}
          />
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--text)" }}>Complete</strong> — passed and done
          </span>
        </div>
      </div>

      {/* Phase cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {PIPELINE_PHASES.map((phase, idx) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            status={getStatus(phase.id)}
            isLast={idx === PIPELINE_PHASES.length - 1}
          />
        ))}
      </div>

      {/* Apple EPM attribution */}
      <div
        style={{
          marginTop: 40,
          padding: "20px 24px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--text-muted)",
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        >
          APEX adapts Apple's EPM faithfully where possible, and is transparent where it simplifies.
          "APEX addition" means we invented it. "Grounded in" means we adapted it. "Maps to" means it's a direct analog.
        </p>
      </div>

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
