import type { CSSProperties } from "react";

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  style?: CSSProperties;
}

export function SectionHeader({ label, title, subtitle, align = "left", style }: SectionHeaderProps) {
  return (
    <div className={`mb-8 ${align === "center" ? "text-center" : ""}`} style={style}>
      {label && (
        <p className="apex-label mb-3" style={{ color: "var(--accent)" }}>
          {label}
        </p>
      )}
      <h2 className="apex-heading mb-2" style={{ color: "var(--text)" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-base font-light" style={{ color: "var(--text-secondary)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
