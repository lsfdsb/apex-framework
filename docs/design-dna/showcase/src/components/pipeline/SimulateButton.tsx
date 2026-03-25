import { Play, Loader2, CheckCircle2 } from "lucide-react";

interface SimulateButtonProps {
  onSimulate: () => void;
  isRunning: boolean;
  isComplete: boolean;
}

export function SimulateButton({ onSimulate, isRunning, isComplete }: SimulateButtonProps) {
  const label = isRunning
    ? "Running..."
    : isComplete
    ? "Complete!"
    : "Simulate Pipeline";

  return (
    <>
      <button
        onClick={onSimulate}
        disabled={isRunning}
        aria-label={isRunning ? "Pipeline simulation running" : "Run pipeline simulation"}
        className="simulate-btn"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 28px",
          borderRadius: 8,
          border: "1px solid var(--accent)",
          background: isComplete
            ? "var(--accent-glow)"
            : isRunning
            ? "var(--bg-elevated)"
            : "var(--accent)",
          color: isComplete || isRunning ? "var(--accent)" : "var(--bg)",
          fontSize: 14,
          fontWeight: 600,
          cursor: isRunning ? "not-allowed" : "pointer",
          opacity: isRunning ? 0.8 : 1,
          transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
          letterSpacing: "0.01em",
          minWidth: 200,
          justifyContent: "center",
        }}
      >
        {isRunning ? (
          <Loader2 size={16} className="simulate-spin" aria-hidden="true" />
        ) : isComplete ? (
          <CheckCircle2 size={16} aria-hidden="true" />
        ) : (
          <Play size={16} aria-hidden="true" />
        )}
        {label}
      </button>

      <style>{`
        .simulate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .simulate-spin {
            animation: none;
          }
        }
        .simulate-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px var(--accent-glow);
        }
        @media (prefers-reduced-motion: reduce) {
          .simulate-btn:not(:disabled):hover {
            transform: none;
          }
        }
      `}</style>
    </>
  );
}
