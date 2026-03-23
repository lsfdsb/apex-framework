import React, { useState, useRef } from "react";
interface TooltipProps { children: React.ReactNode; content: React.ReactNode; position?: "top" | "bottom" | "left" | "right" }
export default function Tooltip({ children, content, position = "top" }: TooltipProps) {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const enter = () => { timer.current = setTimeout(() => setShow(true), 200) };
  const leave = () => { clearTimeout(timer.current); setShow(false) };
  const pos: React.CSSProperties = position === "top" ? { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" } : position === "bottom" ? { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" } : position === "left" ? { right: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" } : { left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" };
  return (
    <span style={{ position: "relative", display: "inline-flex" }} onMouseEnter={enter} onMouseLeave={leave} onFocus={enter} onBlur={leave}>
      {children}
      {show && <span style={{ position: "absolute", ...pos, padding: "6px 10px", borderRadius: "var(--radius-sm, 8px)", background: "var(--bg-elevated)", border: "1px solid var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", fontSize: 12, color: "var(--text-secondary)", whiteSpace: "nowrap", zIndex: 100, animation: "tooltip-fade .15s ease-out", pointerEvents: "none" }}>{content}</span>}
    </span>
  );
}
