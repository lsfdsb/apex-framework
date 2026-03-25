import { Check } from "lucide-react";
import type { PipelinePhaseDefinition } from "../../data/hub-types";
import { LucideIcon } from "../hub/LucideIcon";

interface PhaseNodeProps {
  phase: PipelinePhaseDefinition;
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
  /** Simulation: this phase has completed */
  isSimComplete?: boolean;
  /** Simulation: this gate phase is paused for visual effect */
  isSimGatePause?: boolean;
  /** Simulation: final phase completed successfully — glow effect */
  isSuccessGlow?: boolean;
}

// Lock icon SVG — used for gate phases
function LockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function PhaseNode({
  phase,
  isActive,
  isExpanded,
  onClick,
  isSimComplete = false,
  isSimGatePause = false,
  isSuccessGlow = false,
}: PhaseNodeProps) {
  const borderColor = isSimComplete
    ? "var(--success, #22c55e)"
    : isSimGatePause
    ? "var(--warning, #f59e0b)"
    : phase.isGate
    ? "var(--accent)"
    : isActive
    ? "var(--border-hover)"
    : "var(--border)";

  const boxShadow = isSuccessGlow
    ? "0 0 0 2px var(--success, #22c55e), 0 0 32px rgba(34,197,94,0.35), 0 8px 32px rgba(0,0,0,0.3)"
    : isSimGatePause
    ? "0 0 0 2px var(--warning, #f59e0b), 0 0 24px rgba(245,158,11,0.3), 0 8px 32px rgba(0,0,0,0.3)"
    : isSimComplete
    ? "0 0 0 1px var(--success, #22c55e), 0 2px 12px rgba(0,0,0,0.2)"
    : isActive
    ? "0 0 0 1px var(--accent), 0 0 24px var(--accent-glow), 0 8px 32px rgba(0,0,0,0.3)"
    : isExpanded
    ? "0 0 0 1px var(--border-hover), 0 4px 16px rgba(0,0,0,0.2)"
    : "0 2px 8px rgba(0,0,0,0.15)";

  return (
    <button
      onClick={onClick}
      aria-expanded={isExpanded}
      aria-label={`Phase ${phase.id}: ${phase.name}${phase.isGate ? " — User approval required" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "16px 12px",
        background: isActive ? "var(--bg-elevated)" : "var(--bg-elevated)",
        border: `1px solid ${borderColor}`,
        borderRadius: 12,
        cursor: "pointer",
        minWidth: 100,
        flex: "1 1 0",
        maxWidth: 140,
        textAlign: "center",
        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
        boxShadow,
        position: "relative",
        color: "var(--text)",
      }}
    >
      {/* Sim-complete badge — overrides gate badge during simulation */}
      {isSimComplete ? (
        <span
          aria-label="Phase complete"
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "var(--success, #22c55e)",
            color: "#fff",
            lineHeight: 1,
          }}
        >
          <Check size={12} strokeWidth={3} aria-hidden="true" />
        </span>
      ) : isSimGatePause ? (
        /* Gate-pause badge */
        <span
          aria-label="Gate — awaiting approval"
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "var(--warning, #f59e0b)",
            color: "#fff",
            lineHeight: 1,
            animation: "gatePulse 1s ease-in-out infinite alternate",
          }}
        >
          <LockIcon />
        </span>
      ) : phase.isGate ? (
        /* Normal gate badge */
        <span
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "var(--accent)",
            color: "var(--bg)",
            fontSize: 10,
            lineHeight: 1,
          }}
          title="Gate — User approval required"
        >
          <LockIcon />
        </span>
      ) : null}

      {/* Phase icon */}
      <span
        style={{
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: isSuccessGlow
            ? "drop-shadow(0 0 10px #22c55e)"
            : isSimGatePause
            ? "drop-shadow(0 0 8px #f59e0b)"
            : isSimComplete
            ? "drop-shadow(0 0 4px #22c55e)"
            : isActive
            ? "drop-shadow(0 0 8px var(--accent))"
            : "none",
          transition: "filter 0.3s ease",
          color: isSimComplete
            ? "var(--success, #22c55e)"
            : isSimGatePause
            ? "var(--warning, #f59e0b)"
            : "inherit",
        }}
        aria-hidden="true"
      >
        <LucideIcon name={phase.icon} size={24} />
      </span>

      {/* Phase number */}
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "var(--accent)",
          textTransform: "uppercase" as const,
        }}
      >
        {String(phase.id).padStart(2, "0")}
      </span>

      {/* Phase name */}
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text)",
          lineHeight: 1.2,
        }}
      >
        {phase.name}
      </span>

      {/* Agent indicators */}
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center" }}>
        {phase.agents.map((agent) => (
          <span
            key={agent}
            style={{
              fontSize: 9,
              padding: "2px 6px",
              borderRadius: 999,
              background: "var(--bg-surface)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              whiteSpace: "nowrap" as const,
            }}
          >
            {agent}
          </span>
        ))}
      </div>
    </button>
  );
}
