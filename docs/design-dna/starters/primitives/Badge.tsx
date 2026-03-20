import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "accent";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string }> = {
  default: { bg: "var(--bg-surface)", color: "var(--text-secondary)" },
  success: { bg: "rgba(var(--success-rgb, 34,197,94), 0.1)", color: "var(--success)" },
  warning: { bg: "rgba(var(--warning-rgb, 234,179,8), 0.1)", color: "var(--warning)" },
  error: { bg: "rgba(var(--destructive-rgb, 239,68,68), 0.1)", color: "var(--destructive)" },
  info: { bg: "rgba(var(--info-rgb, 96,165,250), 0.1)", color: "var(--info)" },
  accent: { bg: "var(--accent-glow)", color: "var(--accent)" },
};

export function Badge({ children, variant = "default", size = "sm" }: BadgeProps) {
  const style = variantStyles[variant];
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${size === "sm" ? "text-[10px] px-2 py-0.5" : "text-[11px] px-2.5 py-1"}
      `}
      style={{ background: style.bg, color: style.color }}
    >
      {children}
    </span>
  );
}
