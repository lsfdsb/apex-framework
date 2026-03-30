import React, { useRef } from 'react';
interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onClear?: () => void;
}
export default function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar...',
  onClear,
}: SearchInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const clear = () => {
    onChange('');
    onClear?.();
    ref.current?.focus();
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm, 8px)',
        padding: '8px 12px',
        transition: 'border-color .2s',
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--text-muted)"
        strokeWidth="2"
        style={{ flexShrink: 0 }}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          border: 'none',
          background: 'none',
          color: 'var(--text)',
          fontSize: 13,
          outline: 'none',
          width: '100%',
          fontFamily: 'var(--font-body)',
        }}
      />
      {value.length > 0 && (
        <button
          onClick={clear}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 2,
            display: 'flex',
            fontSize: 14,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
