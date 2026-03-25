import type { TaskPhase } from "../../data/hub-types";

export type PhaseFilterValue = "all" | TaskPhase;

interface PhaseFilterProps {
  value: PhaseFilterValue;
  onChange: (value: PhaseFilterValue) => void;
  counts?: { all: number; P0: number; P1: number; P2: number };
}

const OPTIONS: { label: string; value: PhaseFilterValue; color: string }[] = [
  { label: "All", value: "all", color: "var(--text-secondary)" },
  { label: "P0", value: "P0", color: "var(--destructive)" },
  { label: "P1", value: "P1", color: "var(--warning)" },
  { label: "P2", value: "P2", color: "var(--accent)" },
];

/** Filter bar toggling between All / P0 / P1 / P2 task phases. */
export function PhaseFilter({ value, onChange, counts }: PhaseFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter by phase"
      style={{
        display: "inline-flex",
        gap: 4,
        padding: 4,
        borderRadius: "var(--radius)",
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
      }}
    >
      {OPTIONS.map((option) => {
        const isActive = value === option.value;
        const count = counts ? counts[option.value as keyof typeof counts] : undefined;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
              background: isActive ? "var(--bg-elevated)" : "transparent",
              color: isActive ? option.color : "var(--text-muted)",
              boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.15)" : "none",
            }}
          >
            {option.label}
            {count !== undefined && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "1px 5px",
                  borderRadius: "var(--radius-full)",
                  background: isActive ? option.color : "var(--bg-surface)",
                  color: isActive ? "var(--bg)" : "var(--text-muted)",
                  minWidth: 16,
                  textAlign: "center",
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
