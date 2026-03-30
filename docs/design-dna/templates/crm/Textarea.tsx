import React, { useRef, useEffect } from 'react';
interface TextareaProps {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  error?: string;
  autoResize?: boolean;
}
export default function Textarea({
  value,
  onChange,
  label,
  placeholder,
  rows = 4,
  maxLength,
  error,
  autoResize = true,
}: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (autoResize && ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [value, autoResize]);
  const remaining = maxLength ? maxLength - value.length : null;
  return (
    <div>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--text-secondary)',
            marginBottom: 6,
          }}
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: 'var(--bg-elevated)',
          border: `1px solid ${error ? 'var(--destructive)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm, 8px)',
          color: 'var(--text)',
          fontSize: 14,
          fontFamily: 'var(--font-body)',
          outline: 'none',
          resize: autoResize ? 'none' : 'vertical',
          lineHeight: 1.7,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        {error && <span style={{ fontSize: 12, color: 'var(--destructive)' }}>{error}</span>}
        {remaining !== null && (
          <span
            style={{
              fontSize: 11,
              color:
                remaining <= 0
                  ? 'var(--destructive)'
                  : remaining <= 20
                    ? 'var(--warning)'
                    : 'var(--text-muted)',
              marginLeft: 'auto',
            }}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
