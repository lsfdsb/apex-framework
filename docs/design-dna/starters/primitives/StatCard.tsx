import React from "react";

interface StatCardProps {
  label: string;
  value: string;
  delta?: number;
  icon?: React.ReactNode;
  className?: string;
}

/** Dashboard stat card with optional trend delta and icon. */
export function StatCard({ label, value, delta, icon, className = "" }: StatCardProps) {
  const deltaColor =
    delta === undefined
      ? undefined
      : delta > 0
        ? "var(--success)"
        : delta < 0
          ? "var(--destructive)"
          : "var(--text-secondary)";

  return (
    <div
      className={`
        rounded-[var(--radius)] border p-[var(--card-padding,16px)]
        transition-all duration-[var(--duration-normal,300ms)] ease-[var(--ease-out)]
        hover:border-[var(--border-hover)] hover:-translate-y-0.5
        ${className}
      `.trim()}
      style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </p>
        {icon && (
          <span
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>

      <p
        className="mt-2 text-3xl font-bold tracking-tight leading-none"
        style={{ color: "var(--text)" }}
      >
        {value}
      </p>

      {delta !== undefined && (
        <p className="mt-2 flex items-center gap-1 text-[12px] font-medium" style={{ color: deltaColor }}>
          <span aria-hidden="true">{delta > 0 ? "↑" : delta < 0 ? "↓" : "→"}</span>
          <span>
            {delta > 0 ? "+" : ""}
            {delta}%
          </span>
          <span style={{ color: "var(--text-secondary)" }}>vs last period</span>
        </p>
      )}
    </div>
  );
}
