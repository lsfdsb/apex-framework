import React, { useState, useRef, useEffect } from 'react';
interface SelectOption {
  value: string;
  label: string;
}
interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  label?: string;
  searchable?: boolean;
}
export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Selecionar...',
  label,
  searchable = true,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [hi, setHi] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const filtered =
    searchable && q
      ? options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()))
      : options;
  const selected = options.find((o) => o.value === value);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const pick = (v: string) => {
    onChange?.(v);
    setOpen(false);
    setQ('');
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHi((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHi((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && filtered[hi]) pick(filtered[hi].value);
    else if (e.key === 'Escape') setOpen(false);
  };
  return (
    <div ref={ref} style={{ position: 'relative' }}>
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
      <button
        onClick={() => {
          setOpen(!open);
          setHi(0);
        }}
        onKeyDown={onKey}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm, 8px)',
          color: selected ? 'var(--text)' : 'var(--text-muted)',
          fontSize: 14,
          fontFamily: 'var(--font-body)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          outline: 'none',
          textAlign: 'left',
        }}
      >
        {selected?.label || placeholder}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
        >
          <path d="M3 4.5l3 3 3-3" stroke="var(--text-muted)" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'color-mix(in srgb, var(--bg-elevated) 95%, transparent)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm, 8px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            zIndex: 50,
            maxHeight: 240,
            overflowY: 'auto',
          }}
        >
          {searchable && (
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>
              <input
                autoFocus
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setHi(0);
                }}
                onKeyDown={onKey}
                placeholder="Buscar..."
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text)',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>
          )}
          {filtered.length === 0 && (
            <div style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)' }}>
              Nenhum resultado
            </div>
          )}
          {filtered.map((o, i) => (
            <div
              key={o.value}
              onClick={() => pick(o.value)}
              onMouseEnter={() => setHi(i)}
              style={{
                padding: '10px 14px',
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                background: i === hi ? 'var(--accent-glow)' : 'transparent',
                color: i === hi ? 'var(--accent)' : 'var(--text)',
                transition: 'background .1s',
              }}
            >
              {o.label}
              {o.value === value && <span style={{ color: 'var(--accent)' }}>✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
