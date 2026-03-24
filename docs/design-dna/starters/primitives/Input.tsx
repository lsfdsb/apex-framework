import React, { useRef, useEffect } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const inputRef = useRef<HTMLInputElement>(null);
  const prevError = useRef(error);

  // Shake on new error
  useEffect(() => {
    if (error && error !== prevError.current && inputRef.current) {
      inputRef.current.classList.add("shake");
      const handler = () => inputRef.current?.classList.remove("shake");
      inputRef.current.addEventListener("animationend", handler, { once: true });
    }
    prevError.current = error;
  }, [error]);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        id={inputId}
        className="w-full px-3.5 py-2.5 rounded-[var(--radius-sm)] text-[14px] outline-none transition-all duration-200 placeholder:opacity-40"
        style={{
          background: "var(--bg)",
          border: `1px solid ${error ? "var(--destructive)" : "var(--border)"}`,
          color: "var(--text)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)";
          e.currentTarget.style.borderColor = "var(--accent)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = error ? "var(--destructive)" : "var(--border)";
          props.onBlur?.(e);
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-[12px] slide-up" style={{ color: "var(--destructive)" }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
