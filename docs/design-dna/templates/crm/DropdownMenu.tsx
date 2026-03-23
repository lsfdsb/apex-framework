import React, { useState, useRef, useEffect } from "react";
interface MenuItem { label: string; icon?: React.ReactNode; onClick?: () => void; variant?: "default" | "destructive"; divider?: boolean }
interface DropdownMenuProps { trigger: React.ReactNode; items: MenuItem[] }
export default function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h) }, []);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <span onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>{trigger}</span>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, minWidth: 180, background: "color-mix(in srgb, var(--bg-elevated) 95%, transparent)", backdropFilter: "blur(20px)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", zIndex: 50, overflow: "hidden", animation: "dd-in .2s cubic-bezier(0.22,1,0.36,1)" }} role="menu">
          <style>{`@keyframes dd-in{from{opacity:0;transform:translateY(-4px) scale(0.95)}to{opacity:1;transform:none}}`}</style>
          {items.map((item, i) => item.divider ? (
            <div key={i} style={{ height: 1, background: "var(--border)", margin: "4px 0" }} role="separator" />
          ) : (
            <button key={i} onClick={() => { item.onClick?.(); setOpen(false) }} role="menuitem" style={{ width: "100%", padding: "10px 14px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: item.variant === "destructive" ? "var(--destructive)" : "var(--text)", fontFamily: "var(--font-body)", textAlign: "left", transition: "background .15s" }} onMouseEnter={(e) => { e.currentTarget.style.background = item.variant === "destructive" ? "rgba(248,113,113,0.08)" : "var(--bg-surface)" }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}>
              {item.icon && <span style={{ width: 16, height: 16, display: "flex", flexShrink: 0 }}>{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
