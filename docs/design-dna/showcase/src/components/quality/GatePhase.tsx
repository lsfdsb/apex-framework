import { useState } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { LucideIcon } from "../hub/LucideIcon";
import type { QualityGateDefinition } from "../../data/hub-types";

// ── GatePhase ──────────────────────────────────────────────────────────────────
// Individual QA gate card with icon, name, description, expandable checklist,
// and a teaching point. Click the header row to expand or collapse.

export interface GatePhaseProps {
  gate: QualityGateDefinition;
  /** 0-based index used to display the phase number badge */
  index: number;
}

export function GatePhase({ gate, index }: GatePhaseProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      role="article"
      aria-label={`Phase ${index + 1}: ${gate.name}`}
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.2s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Clickable header */}
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={`gate-phase-${index}-body`}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "18px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Phase number badge */}
        <span
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "var(--accent-glow)",
            border: "1px solid var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--accent)",
          }}
          aria-hidden="true"
        >
          {index + 1}
        </span>

        {/* Gate icon */}
        <span
          style={{ flexShrink: 0, color: "var(--text-secondary)" }}
          aria-hidden="true"
        >
          <LucideIcon name={gate.icon} size={18} />
        </span>

        {/* Name + description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 3,
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
            }}
          >
            {gate.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              lineHeight: 1.4,
            }}
          >
            {gate.description}
          </div>
        </div>

        {/* Check count pill */}
        <span
          style={{
            flexShrink: 0,
            fontSize: 10,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "9999px",
            background: "var(--bg-surface)",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            whiteSpace: "nowrap",
          }}
        >
          {gate.checks.length} checks
        </span>

        {/* Chevron indicator */}
        <ChevronDown
          size={14}
          color="var(--text-muted)"
          aria-hidden="true"
          style={{
            flexShrink: 0,
            transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Expandable body */}
      {expanded && (
        <div
          id={`gate-phase-${index}-body`}
          style={{
            borderTop: "1px solid var(--border)",
            padding: "20px 20px 24px",
          }}
        >
          {/* Teaching point callout */}
          <div
            style={{
              padding: "14px 16px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--accent)",
              borderRadius: "0 8px 8px 0",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 6,
              }}
            >
              Why this matters
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                margin: 0,
                fontFamily: "var(--font-body)",
              }}
            >
              {gate.teachingPoint}
            </p>
          </div>

          {/* Checklist */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {gate.checks.map((check) => (
              <div
                key={check}
                style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
              >
                <CheckCircle2
                  size={14}
                  color="var(--success)"
                  aria-hidden="true"
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {check}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
