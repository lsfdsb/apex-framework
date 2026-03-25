import { useState, useRef, useCallback, type ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface TeachingTooltipProps {
  content: string;
  children: ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TeachingTooltip({ content, children }: TeachingTooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), 300);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, []);

  return (
    <span
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Tooltip */}
      <span
        role="tooltip"
        aria-hidden={!visible}
        style={{
          position: "absolute",
          bottom: "calc(100% + 10px)",
          left: "50%",
          transform: "translateX(-50%)",
          width: "max-content",
          maxWidth: 280,
          padding: "8px 12px",
          borderRadius: 8,
          fontSize: 12,
          lineHeight: 1.5,
          color: "var(--text-secondary)",
          background: "color-mix(in srgb, var(--bg-elevated) 92%, transparent)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid var(--border)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          whiteSpace: "normal",
          wordBreak: "break-word",
          pointerEvents: "none",
          zIndex: 200,
          opacity: visible ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
      >
        {content}
        {/* Arrow pointing down */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: -5,
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: 8,
            height: 8,
            background: "color-mix(in srgb, var(--bg-elevated) 92%, transparent)",
            border: "1px solid var(--border)",
            borderTop: "none",
            borderLeft: "none",
          }}
        />
      </span>
    </span>
  );
}
