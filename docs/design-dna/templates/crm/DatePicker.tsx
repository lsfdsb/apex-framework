import React from "react";
interface DatePickerProps { value?: string; onChange?: (v: string) => void; label?: string; placeholder?: string; withTime?: boolean }
export default function DatePicker({ value, onChange, label, placeholder, withTime }: DatePickerProps) {
  return (
    <div>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>{label}</label>}
      <input type={withTime ? "datetime-local" : "date"} value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "10px 14px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", outline: "none", colorScheme: "dark" }} />
    </div>
  );
}
