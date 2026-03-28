// Copy this file into your app and customize
// DNA: bg=#08080a, accent=#636bf0, display=Instrument Serif, mono=JetBrains Mono

import React, { useEffect } from 'react';
import { DnaBackground } from '../starters/patterns/DnaBackground';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const dnaStyles = `
.reveal{opacity:0;transform:translateY(32px) scale(0.98);filter:blur(4px);transition:all .9s cubic-bezier(0.22,1,0.36,1)}
.reveal.visible{opacity:1;transform:none;filter:none}
.reveal-delay-1{transition-delay:.1s}.reveal-delay-2{transition-delay:.2s}.reveal-delay-3{transition-delay:.3s}
.bo-kpi{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius,12px);padding:24px;transition:all .3s cubic-bezier(0.22,1,0.36,1)}
.bo-kpi:hover{border-color:var(--border-hover);transform:translateY(-1px)}
@media(max-width:768px){.bo-kpis,.bo-perms-grid{grid-template-columns:1fr!important}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}.reveal{opacity:1;transform:none;filter:none}}
`;

const LOGS = [
  {
    time: '14:32:08',
    level: 'INFO',
    color: 'var(--info)',
    msg: 'User ana@forma.io logged in from 189.44.xx.xx',
  },
  {
    time: '14:31:45',
    level: 'OK',
    color: 'var(--success)',
    msg: 'Backup completed: 2.4 GB → s3://backups/2026-03-23',
  },
  {
    time: '14:30:12',
    level: 'WARN',
    color: 'var(--warning)',
    msg: 'Rate limit approaching: /api/search (847/1000 req/min)',
  },
  {
    time: '14:28:33',
    level: 'ERR',
    color: 'var(--destructive)',
    msg: 'Payment webhook failed: Stripe evt_1234 — retry 2/3',
  },
  {
    time: '14:25:01',
    level: 'INFO',
    color: 'var(--info)',
    msg: 'Deploy completed: v2.4.1 → production (12 files, 0 errors)',
  },
  {
    time: '14:22:18',
    level: 'OK',
    color: 'var(--success)',
    msg: 'SSL certificate renewed for forma.io (expires 2027-03-23)',
  },
  {
    time: '14:15:44',
    level: 'WARN',
    color: 'var(--warning)',
    msg: 'Disk usage at 78% on /var/data — consider cleanup',
  },
];
const INVOICES = [
  {
    id: '#INV-2026-042',
    client: 'TechStart Inc.',
    amount: '$12,500',
    status: 'Paid',
    bg: 'rgba(52,211,153,0.1)',
    fg: 'var(--success)',
    due: 'Mar 15',
    overdue: false,
  },
  {
    id: '#INV-2026-041',
    client: 'Lumina Design',
    amount: '$8,400',
    status: 'Pending',
    bg: 'rgba(251,191,36,0.1)',
    fg: 'var(--warning)',
    due: 'Mar 20',
    overdue: false,
  },
  {
    id: '#INV-2026-040',
    client: 'DataFlow Corp',
    amount: '$45,000',
    status: 'Paid',
    bg: 'rgba(52,211,153,0.1)',
    fg: 'var(--success)',
    due: 'Mar 10',
    overdue: false,
  },
  {
    id: '#INV-2026-039',
    client: 'CloudBase LLC',
    amount: '$3,200',
    status: 'Overdue',
    bg: 'rgba(248,113,113,0.1)',
    fg: 'var(--destructive)',
    due: 'Mar 1',
    overdue: true,
  },
];
const KPIS = [
  { label: 'Total Users', value: '2,847', delta: '↑ 12%', deltaC: 'var(--success)' },
  { label: 'Active Now', value: '184', delta: 'Peak: 312', deltaC: 'var(--text-muted)' },
  { label: 'Revenue (MRR)', value: '$48.2k', delta: '↑ 8%', deltaC: 'var(--success)' },
  {
    label: 'Uptime',
    value: '99.97%',
    delta: '14d clean',
    deltaC: 'var(--text-muted)',
    valueC: 'var(--success)',
  },
];
const PERMS = [
  { label: 'View dashboard', a: true, e: true, v: true },
  { label: 'Edit content', a: true, e: true, v: false },
  { label: 'Publish content', a: true, e: true, v: false },
  { label: 'Manage users', a: true, e: false, v: false },
  { label: 'View invoices', a: true, e: true, v: false },
  { label: 'Manage billing', a: true, e: false, v: false },
  { label: 'Access logs', a: true, e: false, v: false },
  { label: 'Delete data', a: true, e: false, v: false },
];

function SH({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div
        style={{
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--accent)',
          fontWeight: 500,
          marginBottom: 16,
        }}
      >
        {label}
      </div>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 4vw, 52px)',
          fontWeight: 400,
          letterSpacing: '-0.03em',
          marginBottom: 12,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', fontWeight: 300 }}>{sub}</p>
      )}
    </div>
  );
}

function AppFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius, 12px)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          position: 'relative',
        }}
      >
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
        <span
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 12,
            color: 'var(--text-muted)',
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

export default function BackofficePage() {
  useReveal();
  return (
    <div style={{ color: 'var(--text)', fontFamily: 'var(--font-body)', position: 'relative' }}>
      <DnaBackground pattern="grid" animated="gradient" />
      <style>{dnaStyles}</style>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: '140px 32px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            className="reveal"
            style={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--accent)',
              fontWeight: 500,
              marginBottom: 16,
            }}
          >
            Admin + Operations
          </div>
          <h1
            className="reveal reveal-delay-1"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 7vw, 80px)',
              fontWeight: 400,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            The engine that
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>works.</em>
          </h1>
          <p
            className="reveal reveal-delay-2"
            style={{
              fontSize: 18,
              color: 'var(--text-secondary)',
              fontWeight: 300,
              maxWidth: 440,
              margin: '20px auto 0',
            }}
          >
            User management, activity logs, invoices, permissions. Every admin pattern,
            production-ready.
          </p>
        </div>
      </section>

      {/* ═══ KPIs ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal">
            <SH
              label="Dashboard"
              title="Numbers that matter."
              sub="KPIs at a glance. No vanity metrics."
            />
          </div>
          <div
            className="bo-kpis reveal reveal-delay-1"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
              marginBottom: 48,
            }}
          >
            {KPIS.map((k) => (
              <div key={k.label} className="bo-kpi">
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: 8,
                  }}
                >
                  {k.label}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: k.valueC,
                  }}
                >
                  {k.value}
                </div>
                <div style={{ fontSize: 12, marginTop: 6, color: k.deltaC }}>{k.delta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ACTIVITY LOG ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal">
            <SH
              label="Activity"
              title="Every action, logged."
              sub="Real-time system events with severity levels."
            />
          </div>
          <div className="reveal reveal-delay-1">
            <AppFrame title="System Log">
              <div
                style={{
                  padding: 20,
                  maxHeight: 320,
                  overflowY: 'auto',
                  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                  fontSize: 12,
                  lineHeight: 2,
                }}
              >
                {LOGS.map((l, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{l.time}</span>
                    <span style={{ color: l.color, fontWeight: 600, width: 36, flexShrink: 0 }}>
                      {l.level}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{l.msg}</span>
                  </div>
                ))}
              </div>
            </AppFrame>
          </div>
        </div>
      </section>

      {/* ═══ INVOICES ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal">
            <SH
              label="Billing"
              title="Invoices, tracked."
              sub="Financial records with status at a glance."
            />
          </div>
          <div className="reveal reveal-delay-1">
            <AppFrame title="Invoices">
              <div style={{ padding: 0 }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.5fr 1fr 80px 100px',
                    padding: '10px 20px',
                    borderBottom: '1px solid var(--border)',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                    background: 'var(--bg-surface)',
                  }}
                >
                  <span>Invoice</span>
                  <span>Client</span>
                  <span>Amount</span>
                  <span>Due</span>
                  <span>Status</span>
                </div>
                {INVOICES.map((inv) => (
                  <div
                    key={inv.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1.5fr 1fr 80px 100px',
                      padding: '14px 20px',
                      borderBottom: '1px solid var(--border)',
                      fontSize: 13,
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{inv.id}</span>
                    <span>{inv.client}</span>
                    <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {inv.amount}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: inv.overdue ? 'var(--destructive)' : 'var(--text-muted)',
                      }}
                    >
                      {inv.due}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        padding: '3px 10px',
                        borderRadius: 999,
                        fontWeight: 500,
                        background: inv.bg,
                        color: inv.fg,
                        display: 'inline-block',
                        textAlign: 'center',
                      }}
                    >
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            </AppFrame>
          </div>
        </div>
      </section>

      {/* ═══ PERMISSIONS ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal">
            <SH
              label="Access Control"
              title="Permissions matrix."
              sub="Who can do what. Clear, visible, no guessing."
            />
          </div>
          <div className="reveal reveal-delay-1">
            <AppFrame title="Role Permissions">
              <div style={{ padding: 0 }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    padding: '10px 20px',
                    borderBottom: '1px solid var(--border)',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                    background: 'var(--bg-surface)',
                  }}
                >
                  <span>Permission</span>
                  <span style={{ textAlign: 'center' }}>Admin</span>
                  <span style={{ textAlign: 'center' }}>Editor</span>
                  <span style={{ textAlign: 'center' }}>Viewer</span>
                </div>
                {PERMS.map((p) => (
                  <div
                    key={p.label}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr',
                      padding: '12px 20px',
                      borderBottom: '1px solid var(--border)',
                      fontSize: 13,
                      alignItems: 'center',
                    }}
                  >
                    <span>{p.label}</span>
                    {[p.a, p.e, p.v].map((has, i) => (
                      <span
                        key={i}
                        style={{
                          textAlign: 'center',
                          fontSize: 14,
                          color: has ? 'var(--success)' : 'var(--text-muted)',
                        }}
                      >
                        {has ? '✓' : '—'}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </AppFrame>
          </div>
        </div>
      </section>
    </div>
  );
}
