interface ProgressBarProps {
  percentage: number;
  height?: number;
  showLabel?: boolean;
}

export function ProgressBar({ percentage, height = 4, showLabel = false }: ProgressBarProps) {
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>
            Progress
          </span>
          <span className="text-[11px] font-semibold" style={{ color: "var(--accent)" }}>
            {percentage}%
          </span>
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height, background: "var(--bg-surface)" }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-[var(--duration-slow)] ease-[var(--ease-out)]"
          style={{ width: `${percentage}%`, background: "var(--accent)" }}
        />
      </div>
    </div>
  );
}
