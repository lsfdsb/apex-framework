import type { TaskColumn } from "../../data/hub-types";

interface WipConfig {
  limit: number | null;
}

const WIP_LIMITS: Record<TaskColumn, WipConfig> = {
  backlog: { limit: null },
  todo: { limit: null },
  "in-progress": { limit: 2 },
  review: { limit: 1 },
  done: { limit: null },
};

interface WipIndicatorProps {
  column: TaskColumn;
  current: number;
}

/** Displays current/limit WIP count. Green when under, red when at/over limit. */
export function WipIndicator({ column, current }: WipIndicatorProps) {
  const config = WIP_LIMITS[column];

  if (config.limit === null) return null;

  const atLimit = current >= config.limit;
  const color = atLimit ? "var(--destructive)" : "var(--success)";
  const bg = atLimit
    ? "rgba(var(--destructive-rgb, 239,68,68), 0.12)"
    : "rgba(var(--success-rgb, 34,197,94), 0.12)";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        fontSize: 10,
        fontWeight: 600,
        padding: "2px 7px",
        borderRadius: "var(--radius-full)",
        background: bg,
        color,
        border: `1px solid ${color}`,
        lineHeight: 1.4,
        flexShrink: 0,
      }}
      title={`WIP limit: ${current} of ${config.limit}`}
      aria-label={`${current} of ${config.limit} WIP slots used`}
    >
      {current}/{config.limit}
    </span>
  );
}
