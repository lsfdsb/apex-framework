interface AnimatedCheckmarkProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function AnimatedCheckmark({ size = 24, color, strokeWidth = 2.5 }: AnimatedCheckmarkProps) {
  // Path length of the checkmark polyline (calculated: ~24 units)
  const pathLength = 24;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: "inline-block" }}
    >
      {/* Circle */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color ?? "var(--accent)"}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray="63"
        strokeDashoffset="63"
        style={{
          animation: "apex-stroke-draw 0.6s var(--ease-out) forwards",
          ["--path-length" as string]: "63",
        }}
      />
      {/* Checkmark */}
      <polyline
        points="7 12 10.5 15.5 17 9"
        stroke={color ?? "var(--accent)"}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength}
        style={{
          animation: `apex-checkmark 0.3s var(--ease-out) 0.4s forwards`,
        }}
      />
    </svg>
  );
}
