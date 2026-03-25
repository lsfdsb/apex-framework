/**
 * LiveBadge — shows a green pulsing dot + "Live" when the HUB is synced
 * to a real Claude Code session, or a gray dot + "Demo" in fallback mode.
 */

interface LiveBadgeProps {
  isLive: boolean;
  /** Optional last-updated timestamp shown in live mode */
  lastUpdated?: Date | null;
}

export function LiveBadge({ isLive, lastUpdated }: LiveBadgeProps) {
  const label = isLive ? "Live" : "Demo";
  const color = isLive ? "var(--success)" : "var(--text-muted)";

  return (
    <span
      role="status"
      aria-label={isLive ? "Live data — synced to Claude Code session" : "Demo mode — showing sample data"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        userSelect: "none",
      }}
      title={
        isLive && lastUpdated
          ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
          : isLive
          ? "Connected to Claude Code session"
          : "No active session — showing demo data"
      }
    >
      {/* Status dot */}
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
          animation: isLive ? "livePulse 2s ease-in-out infinite" : "none",
        }}
      />
      <span style={{ color }}>{label}</span>

      {/* Keyframes injected inline — scoped, no globals needed */}
      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 var(--success); }
          50%       { opacity: 0.7; box-shadow: 0 0 0 4px transparent; }
        }
      `}</style>
    </span>
  );
}
