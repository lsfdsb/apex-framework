/**
 * RosterPhaseCard — static pipeline phase card for the Home / About roster.
 * Distinct from the OPS live PhaseCard (which shows real-time status).
 * Uses the vertical timeline layout with dashed connectors and gate badges.
 */

import { Lock } from "lucide-react";
import { LucideIcon } from "./LucideIcon";
import { PIPELINE_PHASES } from "../../data/hub-data";

export function RosterPhaseCard({
  phase,
  index,
}: {
  phase: (typeof PIPELINE_PHASES)[number];
  index: number;
}) {
  const num = String(phase.id).padStart(2, "0");
  const isLast = index === PIPELINE_PHASES.length - 1;

  return (
    <div style={{ display: "flex", gap: 0, position: "relative" }}>
      {/* Timeline column */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 56, flexShrink: 0 }}>
        <div
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: phase.isGate ? "var(--accent)" : "var(--bg-elevated)",
            border: `2px solid ${phase.isGate ? "var(--accent)" : "var(--border)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: phase.isGate ? "var(--bg)" : "var(--accent)",
            flexShrink: 0, zIndex: 1, position: "relative",
          }}
          aria-hidden="true"
        >
          <LucideIcon name={phase.icon} size={18} />
        </div>
        {!isLast && (
          <div
            aria-hidden="true"
            style={{ flex: 1, width: 2, borderLeft: "2px dashed var(--border)", marginTop: 4, minHeight: 40 }}
          />
        )}
      </div>

      {/* Card body */}
      <div
        style={{
          flex: 1, marginLeft: 20,
          marginBottom: isLast ? 0 : 24,
          background: "var(--bg-elevated)",
          border: phase.isGate ? "1px solid var(--accent)" : "1px solid var(--border)",
          borderLeft: phase.isGate ? "3px solid var(--accent)" : "1px solid var(--border)",
          borderRadius: 14, padding: "24px 24px 20px",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Ghost number watermark */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", top: -8, right: 16,
            fontSize: 72, fontWeight: 900,
            color: "var(--accent)", opacity: 0.06,
            lineHeight: 1, fontFamily: "var(--font-display)", userSelect: "none",
          }}
        >
          {num}
        </div>

        {/* Phase heading row */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--accent)", letterSpacing: "0.06em", fontVariantNumeric: "tabular-nums" }}>
            {num}
          </span>
          <h3 style={{
            fontSize: 18, fontWeight: 700, color: "var(--text)",
            letterSpacing: "-0.02em", lineHeight: 1.2,
            fontFamily: "var(--font-display)", fontStyle: "italic", margin: 0,
          }}>
            {phase.name}
          </h3>
          {phase.isGate && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "2px 8px", borderRadius: 20,
              background: "color-mix(in srgb, var(--accent) 15%, transparent)",
              border: "1px solid var(--accent)", color: "var(--accent)",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", marginLeft: 4,
            }}>
              <Lock size={10} />
              Gate
            </span>
          )}
        </div>

        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
          {phase.description}
        </p>

        {/* Agent + skill badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {phase.agents.map((agent) => (
            <span key={agent} style={{
              padding: "3px 10px", borderRadius: 20,
              background: "var(--bg-surface, var(--bg))", border: "1px solid var(--border)",
              color: "var(--text-secondary)", fontSize: 12, fontWeight: 600,
            }}>
              {agent}
            </span>
          ))}
          {phase.skills.map((skill) => (
            <span key={skill} style={{
              padding: "3px 10px", borderRadius: 20,
              background: "transparent", border: "1px solid var(--border)",
              color: "var(--text-muted)", fontSize: 11,
              fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.02em",
            }}>
              {skill}
            </span>
          ))}
        </div>

        {/* Teaching point */}
        <p style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6,
          margin: 0, paddingTop: 14, borderTop: "1px solid var(--border)",
        }}>
          "{phase.teachingPoint}"
        </p>
      </div>
    </div>
  );
}
