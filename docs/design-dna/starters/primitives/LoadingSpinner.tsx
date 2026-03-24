interface LoadingSpinnerProps {
  size?: number;
  label?: string;
}

export function LoadingSpinner({ size = 24, label = "Loading" }: LoadingSpinnerProps) {
  return (
    <span
      className="inline-flex items-center justify-center"
      role="status"
      aria-label={label}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" fill="none" style={{ width: "100%", height: "100%" }}>
        {/* Track */}
        <circle
          cx="12"
          cy="12"
          r="10"
          strokeWidth="2.5"
          stroke="var(--border)"
          fill="none"
        />
        {/* Spinner arc */}
        <circle
          cx="12"
          cy="12"
          r="10"
          strokeWidth="2.5"
          stroke="var(--accent)"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="47 16"
          style={{
            transformOrigin: "center",
            animation: "apex-spin 0.8s linear infinite",
          }}
        />
      </svg>
      <style>{`@keyframes apex-spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}
