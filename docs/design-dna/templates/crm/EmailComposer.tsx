// Multi-Channel Composer — Phone > WhatsApp > E-mail
// Unified communication component for CRM/Helpdesk
// Zero external dependencies

import React, { useState } from 'react';

type Channel = 'phone' | 'whatsapp' | 'email';

const CHANNELS: { id: Channel; label: string; icon: string; color: string }[] = [
  {
    id: 'phone',
    label: 'Phone',
    icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
    color: 'var(--success)',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: 'M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z',
    color: '#25D366',
  },
  {
    id: 'email',
    label: 'E-mail',
    icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
    color: 'var(--accent)',
  },
];

function ToolBtn({ d }: { d: string }) {
  return (
    <button
      style={{
        background: 'none',
        border: 'none',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        padding: 6,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color .2s',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d={d} />
      </svg>
    </button>
  );
}

export default function EmailComposer() {
  const [channel, setChannel] = useState<Channel>('whatsapp');

  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius, 12px)',
        overflow: 'hidden',
        maxWidth: 640,
        margin: '0 auto',
      }}
    >
      {/* Channel tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {CHANNELS.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setChannel(ch.id)}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              borderBottom: channel === ch.id ? `2px solid ${ch.color}` : '2px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              color: channel === ch.id ? 'var(--text)' : 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: channel === ch.id ? 600 : 400,
              transition: 'all .25s',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={channel === ch.id ? ch.color : 'currentColor'}
              strokeWidth="1.5"
            >
              <path d={ch.icon} />
            </svg>
            {ch.label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: CHANNELS.find((c) => c.id === channel)?.color,
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 500 }}>
            {channel === 'phone'
              ? 'Call with Elena Rodriguez'
              : channel === 'whatsapp'
                ? 'Elena Rodriguez · +55 11 9xxxx'
                : 'elena@seriesb.com'}
          </span>
        </div>
        {channel === 'email' && (
          <div style={{ display: 'flex', gap: 8 }}>
            {['Rascunho', 'Templates'].map((l) => (
              <button
                key={l}
                style={{
                  fontSize: 11,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm, 8px)',
                  border: '1px solid var(--border)',
                  background: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Phone */}
      {channel === 'phone' && (
        <div style={{ padding: 32, textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(52,211,153,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--success)"
              strokeWidth="2"
            >
              <path d={CHANNELS[0].icon} />
            </svg>
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Elena Rodriguez</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
            +55 11 98765-4321 · StyleHouse
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-sm, 8px)',
                background: 'var(--success)',
                color: 'white',
                border: 'none',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Call now
            </button>
            <button
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-sm, 8px)',
                background: 'none',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Schedule
            </button>
          </div>
          <div
            style={{
              marginTop: 24,
              padding: 16,
              borderRadius: 'var(--radius-sm, 8px)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              fontSize: 12,
              color: 'var(--text-muted)',
              textAlign: 'left',
            }}
          >
            <div style={{ fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Última ligação · 3 dias atrás
            </div>
            Duração: 12min · Discutiu proposta revisada. Elena animada com módulo de analytics.
          </div>
        </div>
      )}

      {/* WhatsApp */}
      {channel === 'whatsapp' && (
        <div>
          <div
            style={{
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              maxHeight: 280,
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '10px 14px',
                borderRadius: 12,
                fontSize: 14,
                lineHeight: 1.5,
                background: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                alignSelf: 'flex-start',
                borderBottomLeftRadius: 4,
              }}
            >
              Olá Ana! Vi a proposta revisada. Muito bom o módulo de analytics 👏
            </div>
            <div
              style={{
                maxWidth: '80%',
                padding: '10px 14px',
                borderRadius: 12,
                fontSize: 14,
                lineHeight: 1.5,
                background: '#25D366',
                color: 'white',
                alignSelf: 'flex-end',
                borderBottomRightRadius: 4,
              }}
            >
              Que bom, Elena! Ajustei o escopo como combinamos. Quer agendar uma call?
            </div>
            <div
              style={{
                maxWidth: '80%',
                padding: '10px 14px',
                borderRadius: 12,
                fontSize: 14,
                lineHeight: 1.5,
                background: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                alignSelf: 'flex-start',
                borderBottomLeftRadius: 4,
              }}
            >
              Quinta às 14h funciona. Vou apresentar pro board na quarta.
            </div>
          </div>
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: 8,
            }}
          >
            <input
              placeholder="Digite uma mensagem..."
              style={{
                flex: 1,
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 999,
                padding: '8px 16px',
                color: 'var(--text)',
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                outline: 'none',
              }}
            />
            <button
              style={{
                background: '#25D366',
                border: 'none',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Email */}
      {channel === 'email' && (
        <div>
          <div
            style={{
              padding: '10px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 48 }}>Subject</span>
            <input
              type="text"
              defaultValue="Follow-up: Platform proposal"
              style={{
                border: 'none',
                background: 'none',
                color: 'var(--text)',
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                outline: 'none',
                width: '100%',
              }}
            />
          </div>
          <div
            style={{
              padding: 20,
              minHeight: 160,
              fontSize: 14,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              whiteSpace: 'pre-line',
            }}
          >
            {
              'Olá Elena,\n\nSeguindo nossa conversa sobre o projeto da plataforma.\n\n• Fase 1 antecipada para 15 de abril\n• Módulo de analytics em tempo real\n• Escopo reduzido para fluxos principais\n\nAbraços,\nAna'
            }
          </div>
          <div
            style={{
              padding: '10px 20px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', gap: 4 }}>
              <ToolBtn d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              <ToolBtn d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </div>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 20px',
                borderRadius: 'var(--radius-sm, 8px)',
                background: 'var(--accent)',
                color: 'var(--accent-contrast, white)',
                border: 'none',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
