import React, { useId } from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: "sm" | "md";
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, size = "md", disabled = false }: ToggleProps) {
  const id = useId();
  const trackW = size === "sm" ? 36 : 44;
  const trackH = size === "sm" ? 20 : 24;
  const thumbSize = size === "sm" ? 14 : 18;
  const travel = trackW - thumbSize - 6;

  return (
    <label
      htmlFor={id}
      className="inline-flex items-center gap-2.5 select-none"
      style={{ cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}
    >
      <button
        id={id}
        role="switch"
        type="button"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        style={{
          position: "relative",
          width: trackW,
          height: trackH,
          borderRadius: trackH,
          border: "none",
          padding: 0,
          cursor: "inherit",
          background: checked ? "var(--accent)" : "var(--bg-surface)",
          boxShadow: `inset 0 1px 2px rgba(0,0,0,${checked ? "0.1" : "0.15"})`,
          transition: "background var(--duration-normal) var(--ease-out)",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: (trackH - thumbSize) / 2,
            left: 3,
            width: thumbSize,
            height: thumbSize,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            transform: `translateX(${checked ? travel : 0}px)`,
            transition: "transform var(--duration-normal) var(--ease-spring)",
          }}
        />
      </button>
      {label && (
        <span className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
          {label}
        </span>
      )}
    </label>
  );
}
