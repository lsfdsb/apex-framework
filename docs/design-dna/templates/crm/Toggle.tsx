import React from "react";
interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; label?: string; description?: string; disabled?: boolean }
export default function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}>
      {(label || description) && <div><div style={{ fontSize: 14, color: "var(--text)" }}>{label}</div>{description && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{description}</div>}</div>}
      <button role="switch" aria-checked={checked} disabled={disabled} onClick={() => !disabled && onChange(!checked)} style={{ width: 40, height: 22, borderRadius: 11, background: checked ? "var(--accent)" : "var(--border)", border: "none", position: "relative", cursor: "inherit", transition: "background .3s", flexShrink: 0, outline: "none" }}>
        <span style={{ position: "absolute", top: 2, left: 2, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "transform .3s cubic-bezier(0.34,1.56,0.64,1)", transform: checked ? "translateX(18px)" : "translateX(0)" }} />
      </button>
    </label>
  );
}
