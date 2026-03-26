import React, { useState } from 'react';

const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238a8a96' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`;

interface FilterDef {
  id: string;
  label: string;
  options: string[];
}

const FILTERS: FilterDef[] = [
  { id: 'stage', label: 'Stage', options: ['All stages', 'Lead', 'Qualified', 'Proposal', 'Closed'] },
  { id: 'owner', label: 'Responsável', options: ['Todos', 'Ana Souza', 'Marcus Chen', 'Julia Park'] },
  { id: 'source', label: 'Origem', options: ['Todas as origens', 'Inbound', 'Outbound', 'Indicação'] },
];

const selectStyle: React.CSSProperties = {
  appearance: 'none', background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', padding: '6px 28px 6px 10px', fontSize: 12,
  color: 'var(--text)', fontFamily: 'var(--font-body)', cursor: 'pointer',
  backgroundImage: CHEVRON_SVG, backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center', transition: 'border-color 0.2s',
};

export default function FilterBar() {
  const [active, setActive] = useState<string[]>(['Leads quentes', 'Ana Souza', 'Inbound']);

  const removeFilter = (label: string) =>
    setActive(prev => prev.filter(f => f !== label));

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '16px 20px',
        display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
      }}>
        {FILTERS.map((filter, i) => (
          <React.Fragment key={filter.id}>
            {i > 0 && <div style={{ width: 1, height: 24, background: 'var(--border)' }} />}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em',
                color: 'var(--text-muted)', fontWeight: 500,
              }}>
                {filter.label}
              </span>
              <select style={selectStyle} aria-label={filter.label}>
                {filter.options.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            </div>
          </React.Fragment>
        ))}
      </div>

      {active.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Active filters:</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {active.map(label => (
              <span key={label} style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 999,
                background: 'var(--accent-glow)', color: 'var(--accent)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {label}
                <button
                  onClick={() => removeFilter(label)}
                  aria-label={`Remover filtro ${label}`}
                  style={{
                    background: 'none', border: 'none', color: 'var(--accent)',
                    cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0,
                  }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
