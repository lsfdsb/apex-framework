import React, { useRef, useCallback } from "react";

type ButtonVariant = "primary" | "ghost" | "accent" | "cta";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  as?: React.ElementType;
  ripple?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-[13px] px-3 py-1.5",
  md: "text-[14px] px-5 py-2.5",
  lg: "text-[15px] px-8 py-3.5",
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: "var(--accent)", color: "#fff", border: "1px solid transparent" },
  ghost: { background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)" },
  accent: { background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid transparent" },
  cta: {
    background: "var(--cta-bg)",
    color: "var(--cta-text)",
    border: "1px solid transparent",
    borderRadius: "var(--radius-full)",
  },
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  as: Tag,
  children,
  className = "",
  ripple = true,
  onClick,
  ...props
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        const span = document.createElement("span");
        span.className = "ripple-effect";
        span.style.left = `${e.clientX - rect.left - 20}px`;
        span.style.top = `${e.clientY - rect.top - 20}px`;
        btnRef.current.appendChild(span);
        span.addEventListener("animationend", () => span.remove());
      }
      onClick?.(e);
    },
    [ripple, onClick]
  );

  const base = [
    "relative overflow-hidden inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-sm)]",
    "transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
    "active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
    sizeClasses[size],
    className,
  ]
    .join(" ")
    .trim();

  if (href) {
    const LinkTag = Tag ?? "a";
    return (
      <LinkTag className={base} style={variantStyles[variant]} href={href}>
        {children}
      </LinkTag>
    );
  }

  return (
    <button ref={btnRef} className={base} style={variantStyles[variant]} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
