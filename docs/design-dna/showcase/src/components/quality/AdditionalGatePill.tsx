import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LucideIcon } from "../hub/LucideIcon";

// ── AdditionalGatePill ─────────────────────────────────────────────────────────
// Card for context-aware gates (Accessibility, CX Review, Security Deep).
// Uses LucideIcon for the gate icon; expandable teaching point on demand.

export interface AdditionalGatePillProps {
  name: string;
  icon: string;
  description: string;
  teachingPoint: string;
}

export function AdditionalGatePill({
  name,
  icon,
  description,
  teachingPoint,
}: AdditionalGatePillProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        padding: "20px 24px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        flex: "1 1 260px",
        minWidth: 0,
      }}
    >
      {/* Icon + name row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <span
          style={{ color: "var(--accent)", display: "flex", alignItems: "center" }}
          aria-hidden="true"
        >
          <LucideIcon name={icon} size={20} />
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--text)",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
          }}
        >
          {name}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.5,
          margin: "0 0 12px",
          fontFamily: "var(--font-body)",
        }}
      >
        {description}
      </p>

      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 12,
          color: "var(--accent)",
          fontWeight: 600,
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
        aria-expanded={expanded}
      >
        {expanded ? "Hide" : "Why this matters"}
        <ChevronDown
          size={12}
          aria-hidden="true"
          style={{
            transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Teaching point */}
      {expanded && (
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            margin: "12px 0 0",
            paddingTop: 12,
            borderTop: "1px solid var(--border)",
            fontFamily: "var(--font-body)",
          }}
        >
          {teachingPoint}
        </p>
      )}
    </div>
  );
}
