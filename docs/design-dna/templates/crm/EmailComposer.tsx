// CRM Email Composer — in-app email with recipients, toolbar, templates
// Copy into your app and customize. Zero external dependencies.

import React from "react";

interface EmailComposerProps {
  to?: string;
  subject?: string;
  body?: string;
  onSend?: () => void;
}

function ToolBtn({ d }: { d: string }) {
  return (
    <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 6, borderRadius: 6, transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d} /></svg>
    </button>
  );
}

export default function EmailComposer({
  to = "elena@seriesb.com",
  subject = "Follow-up: Proposta de plataforma",
  body = `Olá Elena,

Seguindo nossa conversa da semana passada sobre o projeto da plataforma. Segue a proposta revisada com os ajustes de escopo que discutimos.

Principais mudanças:
• Fase 1 antecipada para 15 de abril
• Módulo de analytics em tempo real adicionado
• Escopo inicial reduzido para focar nos fluxos principais

Posso agendar uma call rápida esta semana para revisarmos juntos.

Abraços,
Ana`,
  onSend,
}: EmailComposerProps) {
  return (
    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", overflow: "hidden", maxWidth: 640, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ fontSize: 14, fontWeight: 600 }}>Novo E-mail</h4>
        <div style={{ display: "flex", gap: 8 }}>
          {["Salvar rascunho", "Templates"].map((label) => (
            <button key={label} style={{ fontSize: 11, padding: "4px 10px", borderRadius: "var(--radius-sm, 8px)", border: "1px solid var(--border)", background: "none", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font-body)", transition: "all .2s" }}>{label}</button>
          ))}
        </div>
      </div>

      {/* To */}
      <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)", minWidth: 48 }}>Para</span>
        <span style={{ fontSize: 12, padding: "2px 10px", borderRadius: 999, background: "var(--accent-glow)", color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 4 }}>{to}</span>
      </div>

      {/* Subject */}
      <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)", minWidth: 48 }}>Assunto</span>
        <input type="text" defaultValue={subject} style={{ border: "none", background: "none", color: "var(--text)", fontSize: 13, fontFamily: "var(--font-body)", outline: "none", width: "100%" }} />
      </div>

      {/* Body */}
      <div style={{ padding: 20, minHeight: 200 }}>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-line" }}>{body}</div>
      </div>

      {/* Toolbar */}
      <div style={{ padding: "10px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4 }}>
          <ToolBtn d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          <ToolBtn d="M3 3h18v18H3zM8.5 8.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21" />
          <ToolBtn d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </div>
        <button onClick={onSend} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: "var(--radius-sm, 8px)", background: "var(--accent)", color: "var(--accent-contrast, white)", border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)", transition: "all .2s" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
          Enviar
        </button>
      </div>
    </div>
  );
}
