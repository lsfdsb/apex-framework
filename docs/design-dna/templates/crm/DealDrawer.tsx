// CRM Deal Detail Drawer — side panel with deal info, progress, tags, actions
// Copy into your app and customize. Zero external dependencies.

import React from 'react';

interface DealDrawerProps {
  deal?: {
    name: string;
    company: string;
    stage: string;
    value: string;
    probability: number;
    stageColor: string;
    expectedClose: string;
    owner: { name: string; initials: string };
    source: string;
    tags: string[];
    lastActivity: string;
  };
  onClose?: () => void;
}

const defaultDeal = {
  name: 'E-commerce Platform',
  company: 'StyleHouse',
  stage: 'Proposal',
  value: '$65,000',
  probability: 60,
  stageColor: 'var(--pipeline-proposal, #fbbf24)',
  expectedClose: '28 Mar, 2026',
  owner: { name: 'Ana Souza', initials: 'AS' },
  source: 'Inbound · Website',
  tags: ['enterprise', 'e-commerce', 'high-value', 'Q1 target'],
  lastActivity: 'Proposal sent via email — awaiting board review. Follow-up scheduled for Friday.',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          fontWeight: 500,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 14, color: 'var(--text)' }}>{children}</div>
    </div>
  );
}

export default function DealDrawer({ deal = defaultDeal, onClose }: DealDrawerProps) {
  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius, 12px)',
        overflow: 'hidden',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 24,
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>
            {deal.name}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {deal.company} · {deal.stage}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm, 8px)',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            transition: 'all .2s',
            fontSize: 16,
          }}
        >
          &times;
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: 24 }}>
        {/* Progress */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              height: 6,
              background: 'var(--bg-surface)',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: 3,
                width: `${deal.probability}%`,
                background: deal.stageColor,
                transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{deal.stage}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {deal.probability}% probabilidade
            </span>
          </div>
        </div>

        {/* Fields grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <Field label="Valor">
            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {deal.value}
            </span>
          </Field>
          <Field label="Fechamento esperado">{deal.expectedClose}</Field>
          <Field label="Responsável">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'var(--accent-glow)',
                  border: '1px solid var(--border)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 8,
                  fontWeight: 600,
                  color: 'var(--accent)',
                }}
              >
                {deal.owner.initials}
              </span>
              {deal.owner.name}
            </span>
          </Field>
          <Field label="Origem">{deal.source}</Field>
        </div>

        {/* Tags */}
        <Field label="Tags">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {deal.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </Field>

        {/* Last activity */}
        <Field label="Última atividade">
          <span style={{ color: 'var(--text-secondary)' }}>{deal.lastActivity}</span>
        </Field>
      </div>

      {/* Actions */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: 8,
        }}
      >
        <button
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm, 8px)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            background: 'var(--accent)',
            color: 'var(--accent-contrast, white)',
            border: 'none',
            transition: 'all .2s',
            fontFamily: 'var(--font-body)',
          }}
        >
          Send follow-up
        </button>
        <button
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm, 8px)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            background: 'none',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            transition: 'all .2s',
            fontFamily: 'var(--font-body)',
          }}
        >
          Add note
        </button>
        <button
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm, 8px)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            background: 'none',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            transition: 'all .2s',
            fontFamily: 'var(--font-body)',
          }}
        >
          Schedule call
        </button>
      </div>
    </div>
  );
}
