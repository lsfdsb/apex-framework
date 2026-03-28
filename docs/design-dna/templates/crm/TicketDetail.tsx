import { useState } from 'react';

type Priority = 'high' | 'medium' | 'low';
type Status = 'open' | 'pending' | 'resolved';

interface TimelineEvent {
  id: number;
  time: string;
  text: string;
  active?: boolean;
}

const PRIORITY_COLOR: Record<Priority, string> = {
  high: 'var(--destructive)',
  medium: 'var(--warning)',
  low: 'var(--success)',
};
const PRIORITY_LABEL: Record<Priority, string> = { high: 'Alta', medium: 'Média', low: 'Baixa' };
const STATUS_STYLE: Record<Status, React.CSSProperties> = {
  open: { background: 'rgba(96,165,250,0.1)', color: 'var(--info)' },
  pending: { background: 'rgba(251,191,36,0.1)', color: 'var(--warning)' },
  resolved: { background: 'rgba(52,211,153,0.1)', color: 'var(--success)' },
};
const STATUS_LABEL: Record<Status, string> = {
  open: 'Aberto',
  pending: 'Pendente',
  resolved: 'Resolvido',
};

const TIMELINE: TimelineEvent[] = [
  { id: 1, time: 'Today, 09:14', text: 'Ticket created by Marina Costa via chat', active: true },
  { id: 2, time: 'Today, 09:17', text: 'Assigned to Ana Souza (support tier 2)' },
  { id: 3, time: 'Today, 09:31', text: 'Ana replied with debugging instructions' },
  { id: 4, time: 'Today, 10:02', text: 'Customer confirmed resolution — awaiting closure' },
];

const s: Record<string, React.CSSProperties> = {
  card: {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    maxWidth: 640,
    margin: '0 auto',
    fontFamily: 'var(--font-body)',
  },
  header: { padding: '20px 24px', borderBottom: '1px solid var(--border)' },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap' as const,
  },
  ticketId: { fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em' },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: 'var(--text)',
    letterSpacing: '-0.01em',
    margin: '0 0 4px',
  },
  created: { fontSize: 12, color: 'var(--text-muted)' },
  badge: { fontSize: 11, padding: '3px 10px', borderRadius: 999, fontWeight: 500 },
  priorityBar: { width: 4, height: 32, borderRadius: 2, flexShrink: 0 },
  body: { padding: '20px 24px', borderBottom: '1px solid var(--border)' },
  customerRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'var(--accent)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 600,
    flexShrink: 0,
  },
  description: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 },
  section: { padding: '20px 24px', borderBottom: '1px solid var(--border)' },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    marginBottom: 14,
  },
  timelineItem: { display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' },
  timelineText: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 },
  timelineTime: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginBottom: 2,
    letterSpacing: '0.02em',
  },
  notes: {
    width: '100%',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 14px',
    color: 'var(--text)',
    fontSize: 13,
    fontFamily: 'var(--font-body)',
    resize: 'vertical' as const,
    minHeight: 72,
    outline: 'none',
  },
  actions: { padding: '16px 24px', display: 'flex', gap: 8, flexWrap: 'wrap' as const },
  btnPrimary: {
    background: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  btnSecondary: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  btnDestructive: {
    background: 'transparent',
    color: 'var(--destructive)',
    border: '1px solid rgba(248,113,113,0.3)',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
};

export default function TicketDetail() {
  const [note, setNote] = useState('');
  const priority: Priority = 'high';
  const status: Status = 'open';

  return (
    <div style={s.card}>
      <div style={s.header}>
        <div style={s.meta}>
          <span style={{ ...s.badge, background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
            #TKT-2891
          </span>
          <div
            style={{ ...s.priorityBar, background: PRIORITY_COLOR[priority] }}
            aria-label={`Prioridade ${PRIORITY_LABEL[priority]}`}
          />
          <span
            style={{
              ...s.badge,
              background: `${PRIORITY_COLOR[priority]}18`,
              color: PRIORITY_COLOR[priority],
            }}
          >
            {PRIORITY_LABEL[priority]}
          </span>
          <span style={{ ...s.badge, ...STATUS_STYLE[status] }}>{STATUS_LABEL[status]}</span>
        </div>
        <h2 style={s.title}>Falha no processamento de pagamento — clientes BR</h2>
        <span style={s.created}>Aberto em 23 mar 2026, 09:14</span>
      </div>

      <div style={s.body}>
        <div style={s.customerRow}>
          <div style={s.avatar} aria-hidden="true">
            MC
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>Marina Costa</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              marina.costa@empresa.com.br
            </div>
          </div>
        </div>
        <p style={s.description}>
          O webhook do Stripe retorna 502 durante a conversão de moeda ao finalizar compras.
          Acontece apenas com cartões emitidos no Brasil. Já testei em três contas diferentes e o
          erro persiste. O log mostra:{' '}
          <code
            style={{
              background: 'var(--bg-surface)',
              padding: '1px 6px',
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            stripe.error: currency_conversion_timeout
          </code>
          .
        </p>
      </div>

      <div style={s.section}>
        <div style={s.sectionLabel}>Linha do Tempo</div>
        {TIMELINE.map((ev) => (
          <div key={ev.id} style={s.timelineItem}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: ev.active ? 'var(--accent)' : 'var(--border-hover)',
                flexShrink: 0,
                marginTop: 5,
                boxShadow: ev.active ? '0 0 0 3px var(--accent-glow)' : 'none',
              }}
              aria-hidden="true"
            />
            <div>
              <div style={s.timelineTime}>{ev.time}</div>
              <div style={s.timelineText}>{ev.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={s.section}>
        <div style={s.sectionLabel}>Nota Interna</div>
        <textarea
          style={s.notes}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Adicione uma nota interna (visível apenas para a equipe)..."
          aria-label="Nota interna"
        />
      </div>

      <div style={s.actions}>
        <button style={s.btnPrimary}>Responder</button>
        <button style={s.btnSecondary}>Atribuir</button>
        <button style={s.btnDestructive}>Fechar Ticket</button>
      </div>
    </div>
  );
}
