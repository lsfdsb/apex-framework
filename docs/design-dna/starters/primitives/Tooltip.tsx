import React, { useState, useRef, useCallback } from "react";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

const positionStyles: Record<string, React.CSSProperties> = {
  top:    { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 8 },
  bottom: { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 8 },
  left:   { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: 8 },
  right:  { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: 8 },
};

export function Tooltip({ content, children, position = "top", delay = 200 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback(() => {
    timer.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    clearTimeout(timer.current);
    setVisible(false);
  }, []);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className="pop-in"
          style={{
            position: "absolute",
            ...positionStyles[position],
            whiteSpace: "nowrap",
            fontSize: 12,
            fontWeight: 500,
            padding: "6px 12px",
            borderRadius: "var(--radius-sm)",
            background: "var(--bg-elevated)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
}
