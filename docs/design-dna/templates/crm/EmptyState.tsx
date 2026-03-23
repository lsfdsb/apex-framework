import React from 'react';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 28, height: 28 }}>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  desc?: string;
  buttonText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = <SearchIcon />,
  title = 'Nenhum deal encontrado',
  desc = 'Tente ajustar os filtros ou crie um novo deal para visualizar seu pipeline de vendas.',
  buttonText = 'Criar novo deal',
  onAction,
}: EmptyStateProps) {
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '64px 32px',
      textAlign: 'center', maxWidth: 480, margin: '0 auto',
    }}>
      <div style={{
        width: 64, height: 64, margin: '0 auto 24px',
        borderRadius: '50%', background: 'var(--bg-surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)',
      }}>
        {icon}
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <div style={{
        fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6,
        marginBottom: 24, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto',
      }}>
        {desc}
      </div>
      <button
        onClick={onAction}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '10px 20px', borderRadius: 'var(--radius-sm)',
          background: 'var(--accent)', color: 'white', fontSize: 13,
          fontWeight: 500, border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-body)', transition: 'background 0.2s',
        }}
      >
        <PlusIcon /> {buttonText}
      </button>
    </div>
  );
}
