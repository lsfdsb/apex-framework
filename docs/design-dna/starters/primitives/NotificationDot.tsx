interface NotificationDotProps {
  count?: number;
  pulse?: boolean;
  size?: "sm" | "md";
}

export function NotificationDot({ count, pulse = true, size = "sm" }: NotificationDotProps) {
  const dotSize = size === "sm" ? 8 : 12;
  const hasCount = count !== undefined && count > 0;

  return (
    <span
      className={`relative inline-flex items-center justify-center ${pulse ? "pulse-ring" : ""}`}
      style={{
        width: hasCount ? "auto" : dotSize,
        height: hasCount ? "auto" : dotSize,
        minWidth: hasCount ? 18 : dotSize,
        padding: hasCount ? "1px 5px" : 0,
        borderRadius: 999,
        background: "var(--destructive, #ef4444)",
        fontSize: 10,
        fontWeight: 700,
        color: "#fff",
        lineHeight: 1,
      }}
      aria-label={hasCount ? `${count} notifications` : "New notification"}
    >
      {hasCount ? (count > 99 ? "99+" : count) : null}
    </span>
  );
}
