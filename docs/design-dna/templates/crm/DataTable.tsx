// CRM Data Table — search, filters, alternating rows, pagination
// Uses standard DNA tokens (--bg, --accent, etc). Zero external dependencies.

import React, { useState } from 'react';

type Filter = 'All' | 'Hot' | 'Warm' | 'Cold';
interface Lead {
  initials: string;
  name: string;
  email: string;
  company: string;
  score: number;
  status: 'Hot' | 'Warm' | 'Cold';
}

const LEADS: Lead[] = [
  {
    initials: 'ER',
    name: 'Elena Rodriguez',
    email: 'elena@seriesb.io',
    company: 'Series B Startup',
    score: 92,
    status: 'Hot',
  },
  {
    initials: 'JO',
    name: 'James Okafor',
    email: 'j.okafor@entcorp.com',
    company: 'Enterprise Corp',
    score: 72,
    status: 'Warm',
  },
  {
    initials: 'PP',
    name: 'Priya Patel',
    email: 'priya@earlystage.co',
    company: 'Early Stage',
    score: 45,
    status: 'Warm',
  },
  {
    initials: 'AS',
    name: 'Ana Souza',
    email: 'ana@fintech.co',
    company: 'Fintech Co',
    score: 88,
    status: 'Hot',
  },
  {
    initials: 'TH',
    name: 'Tom Hansen',
    email: 'tom@unknown.com',
    company: 'Unknown',
    score: 15,
    status: 'Cold',
  },
  {
    initials: 'MC',
    name: 'Marcus Chen',
    email: 'm.chen@globalb2b.com',
    company: 'Global B2B',
    score: 58,
    status: 'Warm',
  },
];

const COUNTS: Record<Filter, number> = { All: 248, Hot: 24, Warm: 89, Cold: 135 };
const badgeColors = {
  Hot: { bg: 'rgba(248,113,113,0.1)', fg: 'var(--destructive)' },
  Warm: { bg: 'rgba(251,191,36,0.1)', fg: 'var(--warning)' },
  Cold: { bg: 'rgba(96,165,250,0.1)', fg: 'var(--info)' },
};
const scoreColor = (s: Lead['status']) =>
  s === 'Hot' ? 'var(--success)' : s === 'Warm' ? 'var(--warning)' : 'var(--text-muted)';

export default function DataTable() {
  const [filter, setFilter] = useState<Filter>('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const visible = LEADS.filter((l) => {
    if (filter !== 'All' && l.status !== filter) return false;
    const q = search.toLowerCase();
    return (
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.company.toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius, 12px)',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm, 8px)',
            padding: '6px 12px',
            minWidth: 240,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar contatos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['All', 'Hot', 'Warm', 'Cold'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontSize: 12,
                padding: '5px 12px',
                borderRadius: 'var(--radius-sm, 8px)',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'all .2s',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                border: filter === f ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: filter === f ? 'var(--accent-glow)' : 'transparent',
                color: filter === f ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              {f === 'All' ? 'Todos' : f}{' '}
              <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{COUNTS[f]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sticky header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '40px 2fr 2fr 1.5fr 80px 100px',
          padding: '10px 20px',
          borderBottom: '1px solid var(--border)',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--text-muted)',
          fontWeight: 500,
          background: 'var(--bg-surface)',
          position: 'sticky',
          top: 0,
          zIndex: 2,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <span>
          <input type="checkbox" style={{ width: 14, height: 14, cursor: 'pointer' }} />
        </span>
        <span>Nome</span>
        <span>E-mail</span>
        <span>Empresa</span>
        <span>Score</span>
        <span>Status</span>
      </div>

      {/* Rows with alternating colors */}
      {visible.map((lead, i) => (
        <div
          key={lead.email}
          style={{
            display: 'grid',
            gridTemplateColumns: '40px 2fr 2fr 1.5fr 80px 100px',
            padding: '14px 20px',
            borderBottom: '1px solid var(--border)',
            fontSize: 13,
            alignItems: 'center',
            transition: 'background .15s',
            cursor: 'pointer',
            background:
              i % 2 === 1
                ? 'color-mix(in srgb, var(--bg-surface) 40%, transparent)'
                : 'transparent',
          }}
        >
          <span>
            <input type="checkbox" style={{ width: 14, height: 14, cursor: 'pointer' }} />
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--accent-glow)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--accent)',
                flexShrink: 0,
              }}
            >
              {lead.initials}
            </span>
            <span style={{ fontWeight: 500 }}>{lead.name}</span>
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>{lead.email}</span>
          <span style={{ color: 'var(--text-secondary)' }}>{lead.company}</span>
          <span style={{ fontWeight: 600, color: scoreColor(lead.status) }}>{lead.score}</span>
          <span>
            <span
              style={{
                fontSize: 11,
                padding: '3px 10px',
                borderRadius: 999,
                fontWeight: 500,
                background: badgeColors[lead.status].bg,
                color: badgeColors[lead.status].fg,
              }}
            >
              {lead.status}
            </span>
          </span>
        </div>
      ))}

      {/* Pagination */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Mostrando 1–{visible.length} de 24 leads
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {['«', '1', '2', '3', '…', '4', '»'].map((label, i) => (
            <button
              key={i}
              onClick={() => {
                const n = Number(label);
                if (!isNaN(n)) setPage(n);
              }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm, 8px)',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'all .15s',
                border:
                  String(page) === label ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: String(page) === label ? 'var(--accent)' : 'transparent',
                color:
                  String(page) === label
                    ? 'var(--accent-contrast, white)'
                    : 'var(--text-secondary)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
