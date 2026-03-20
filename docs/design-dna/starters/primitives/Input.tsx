import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.style.borderColor = "var(--accent)";
    e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)";
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    e.target.style.borderColor = error ? "var(--destructive)" : "var(--border)";
    e.target.style.boxShadow = "none";
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className="w-full px-3.5 py-2.5 rounded-[var(--radius-sm)] text-[14px] outline-none transition-all duration-200 placeholder:opacity-40"
        style={{
          background: "var(--bg)",
          border: `1px solid ${error ? "var(--destructive)" : "var(--border)"}`,
          color: "var(--text)",
          boxShadow: "none",
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-[12px]" style={{ color: "var(--destructive)" }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
