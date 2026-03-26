// Custom DatePicker — glass morphism calendar, no native popup
// Zero external dependencies

import React, { useState, useRef, useEffect } from "react";

interface DatePickerProps {
  value?: string;
  onChange?: (v: string) => void;
  label?: string;
  placeholder?: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function daysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function firstDayOfMonth(year: number, month: number) { return new Date(year, month, 1).getDay(); }
function fmt(y: number, m: number, d: number) { return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }

export default function DatePicker({ value, onChange, label, placeholder = "Select date..." }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const today = new Date();
  const selected = value ? new Date(value + "T00:00:00") : null;
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const prev = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) } else setViewMonth(viewMonth - 1) };
  const next = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) } else setViewMonth(viewMonth + 1) };
  const pick = (day: number) => { onChange?.(fmt(viewYear, viewMonth, day)); setOpen(false) };

  const days = daysInMonth(viewYear, viewMonth);
  const offset = firstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d: number) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isSelected = (d: number) => selected && d === selected.getDate() && viewMonth === selected.getMonth() && viewYear === selected.getFullYear();

  const displayValue = selected ? `${selected.getDate()} de ${MONTHS[selected.getMonth()].toLowerCase()}, ${selected.getFullYear()}` : "";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>{label}</label>}
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", padding: "10px 14px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)",
        color: displayValue ? "var(--text)" : "var(--text-muted)", fontSize: 14, fontFamily: "var(--font-body)", cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "center", outline: "none", textAlign: "left",
      }}>
        {displayValue || placeholder}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 50, width: 280,
          background: "color-mix(in srgb, var(--bg-elevated) 95%, transparent)", backdropFilter: "blur(20px) saturate(1.4)",
          border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)",
          boxShadow: "0 12px 48px rgba(0,0,0,0.25)", padding: 16,
          animation: "cal-in .2s cubic-bezier(0.22,1,0.36,1)",
        }}>
          <style>{`@keyframes cal-in{from{opacity:0;transform:translateY(-4px) scale(0.96)}to{opacity:1;transform:none}}`}</style>

          {/* Month/Year nav */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <button onClick={prev} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 4, borderRadius: 6, fontSize: 16 }}>‹</button>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{MONTHS[viewMonth]} {viewYear}</span>
            <button onClick={next} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 4, borderRadius: 6, fontSize: 16 }}>›</button>
          </div>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
            {DAYS.map((d) => (
              <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 500, color: "var(--text-muted)", padding: "4px 0", letterSpacing: "0.04em" }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
            {cells.map((day, i) => (
              <button key={i} disabled={!day} onClick={() => day && pick(day)} style={{
                width: 34, height: 34, borderRadius: 8, border: "none", cursor: day ? "pointer" : "default",
                fontSize: 13, fontWeight: isToday(day!) ? 600 : 400,
                background: isSelected(day!) ? "var(--accent)" : isToday(day!) ? "var(--accent-glow)" : "transparent",
                color: !day ? "transparent" : isSelected(day!) ? "var(--accent-contrast, white)" : isToday(day!) ? "var(--accent)" : "var(--text-secondary)",
                transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {day || ""}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
            <button onClick={() => { onChange?.(""); setOpen(false) }} style={{ fontSize: 12, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>Limpar</button>
            <button onClick={() => { pick(today.getDate()); setViewMonth(today.getMonth()); setViewYear(today.getFullYear()) }} style={{ fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Today</button>
          </div>
        </div>
      )}
    </div>
  );
}
