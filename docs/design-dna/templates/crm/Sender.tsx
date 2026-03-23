// Sender — Multi-channel agent communication hub
// Phone (macros, call notes, schedule) · WhatsApp (templates API, quick replies) · E-mail
// Zero external dependencies

import React, { useState } from "react";

type Channel = "phone" | "whatsapp" | "email";
type PhoneTab = "call" | "notes" | "schedule";

const CH = [
  { id: "phone" as Channel, label: "Telefone", color: "var(--success)" },
  { id: "whatsapp" as Channel, label: "WhatsApp", color: "#25D366" },
  { id: "email" as Channel, label: "E-mail", color: "var(--accent)" },
];
const WA_TEMPLATES = [
  { id: "welcome", name: "Boas-vindas", preview: "Olá {{nome}}, bem-vindo(a) ao {{empresa}}! Como posso ajudar?" },
  { id: "followup", name: "Follow-up", preview: "Oi {{nome}}, passando para saber se teve alguma dúvida sobre {{assunto}}." },
  { id: "proposal", name: "Proposta", preview: "{{nome}}, sua proposta está pronta! Acesse: {{link}}" },
  { id: "schedule", name: "Agendamento", preview: "{{nome}}, confirmamos sua reunião para {{data}} às {{hora}}." },
];
const MACROS = [
  { key: "/transferir", desc: "Transferir ligação" },
  { key: "/mudo", desc: "Ativar mudo" },
  { key: "/gravar", desc: "Iniciar gravação" },
  { key: "/encerrar", desc: "Encerrar ligação" },
];

function Pill({ children, active, color, onClick }: { children: React.ReactNode; active?: boolean; color?: string; onClick?: () => void }) {
  return <button onClick={onClick} style={{ padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: active ? 600 : 400, border: active ? `1px solid ${color || "var(--accent)"}` : "1px solid var(--border)", background: active ? `color-mix(in srgb, ${color || "var(--accent)"} 10%, transparent)` : "transparent", color: active ? (color || "var(--accent)") : "var(--text-muted)", cursor: "pointer", fontFamily: "var(--font-body)", transition: "all .25s" }}>{children}</button>;
}

function PhoneView() {
  const [tab, setTab] = useState<PhoneTab>("call");
  return (
    <div>
      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 4, padding: "12px 20px", borderBottom: "1px solid var(--border)" }}>
        {([["call", "Ligação"], ["notes", "Anotações"], ["schedule", "Agendar"]] as [PhoneTab, string][]).map(([id, label]) => (
          <Pill key={id} active={tab === id} color="var(--success)" onClick={() => setTab(id)}>{label}</Pill>
        ))}
      </div>

      {tab === "call" && (
        <div style={{ padding: 32, textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(52,211,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Elena Rodriguez</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>+55 11 98765-4321 · StyleHouse</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
            <button style={{ padding: "10px 24px", borderRadius: "var(--radius-sm, 8px)", background: "var(--success)", color: "white", border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Ligar agora</button>
            <button style={{ padding: "10px 24px", borderRadius: "var(--radius-sm, 8px)", background: "none", border: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 14, cursor: "pointer" }}>Agendar</button>
          </div>
          {/* Macros */}
          <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
            {MACROS.map((m) => (
              <span key={m.key} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 6, background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", cursor: "pointer" }}>{m.key}</span>
            ))}
          </div>
          {/* Last call */}
          <div style={{ padding: 16, borderRadius: "var(--radius-sm, 8px)", background: "var(--bg-surface)", border: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)", textAlign: "left" }}>
            <div style={{ fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Última ligação · 3 dias atrás · 12min</div>
            Discutiu proposta revisada. Elena animada com módulo de analytics. Board review na quinta.
          </div>
        </div>
      )}

      {tab === "notes" && (
        <div style={{ padding: 20 }}>
          <textarea placeholder="Anotações da ligação..." style={{ width: "100%", minHeight: 120, padding: 16, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", outline: "none", resize: "vertical", lineHeight: 1.7 }} />
          <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
            {["Proposta", "Follow-up", "Decisão", "Técnico", "Urgente"].map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </div>
          <button style={{ marginTop: 16, padding: "8px 20px", borderRadius: "var(--radius-sm, 8px)", background: "var(--accent)", color: "var(--accent-contrast, white)", border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Salvar anotação</button>
        </div>
      )}

      {tab === "schedule" && (
        <div style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 6 }}>Data</label>
            <input type="date" style={{ width: "100%", padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", outline: "none" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 6 }}>Horário</label>
            <input type="time" style={{ width: "100%", padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", outline: "none" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 6 }}>Assunto</label>
            <input type="text" defaultValue="Follow-up proposta" style={{ width: "100%", padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", outline: "none" }} />
          </div>
          <button style={{ width: "100%", padding: "10px 20px", borderRadius: "var(--radius-sm, 8px)", background: "var(--accent)", color: "var(--accent-contrast, white)", border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Agendar ligação</button>
        </div>
      )}
    </div>
  );
}

function WhatsAppView() {
  const [showTemplates, setShowTemplates] = useState(false);
  return (
    <div>
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, maxHeight: 240, overflowY: "auto" }}>
        <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 12, fontSize: 14, lineHeight: 1.5, background: "var(--bg-surface)", color: "var(--text-secondary)", alignSelf: "flex-start", borderBottomLeftRadius: 4 }}>Olá Ana! Vi a proposta revisada. Muito bom o módulo de analytics 👏</div>
        <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 12, fontSize: 14, lineHeight: 1.5, background: "#25D366", color: "white", alignSelf: "flex-end", borderBottomRightRadius: 4 }}>Que bom, Elena! Ajustei o escopo como combinamos.</div>
        <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 12, fontSize: 14, lineHeight: 1.5, background: "var(--bg-surface)", color: "var(--text-secondary)", alignSelf: "flex-start", borderBottomLeftRadius: 4 }}>Quinta às 14h funciona. Vou apresentar pro board na quarta.</div>
      </div>

      {/* Template selector */}
      {showTemplates && (
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-surface)" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 500, marginBottom: 8 }}>Templates da API oficial</div>
          {WA_TEMPLATES.map((t) => (
            <div key={t.id} style={{ padding: "8px 12px", borderRadius: "var(--radius-sm, 8px)", marginBottom: 4, cursor: "pointer", transition: "background .2s", fontSize: 13 }} onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-elevated)" }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}>
              <div style={{ fontWeight: 500, marginBottom: 2 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.preview}</div>
            </div>
          ))}
        </div>
      )}

      {/* Input + tools */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <Pill active={showTemplates} color="#25D366" onClick={() => setShowTemplates(!showTemplates)}>Templates</Pill>
          <Pill>Atalhos</Pill>
          <Pill>Agendar</Pill>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="Digite uma mensagem..." style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 999, padding: "8px 16px", color: "var(--text)", fontSize: 13, fontFamily: "var(--font-body)", outline: "none" }} />
          <button style={{ background: "#25D366", border: "none", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function EmailView() {
  return (
    <div>
      <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)", minWidth: 48 }}>Assunto</span>
        <input type="text" defaultValue="Follow-up: Proposta de plataforma" style={{ border: "none", background: "none", color: "var(--text)", fontSize: 13, fontFamily: "var(--font-body)", outline: "none", width: "100%" }} />
      </div>
      <div style={{ padding: 20, minHeight: 140, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-line" }}>{"Olá Elena,\n\nSeguindo nossa conversa sobre o projeto.\n\n• Fase 1 antecipada para 15 de abril\n• Módulo de analytics em tempo real\n\nAbraços,\nAna"}</div>
      <div style={{ padding: "8px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <Pill>Templates</Pill>
          <Pill>Anexar</Pill>
        </div>
        <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: "var(--radius-sm, 8px)", background: "var(--accent)", color: "var(--accent-contrast, white)", border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default function Sender() {
  const [channel, setChannel] = useState<Channel>("phone");
  return (
    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", overflow: "hidden", maxWidth: 640, margin: "0 auto" }}>
      {/* Channel tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
        {CH.map((ch) => (
          <button key={ch.id} onClick={() => setChannel(ch.id)} style={{
            flex: 1, padding: "12px 16px", border: "none", borderBottom: channel === ch.id ? `2px solid ${ch.color}` : "2px solid transparent",
            background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            color: channel === ch.id ? "var(--text)" : "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: channel === ch.id ? 600 : 400, transition: "all .25s",
          }}>
            {ch.label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: CH.find((c) => c.id === channel)?.color }} />
        <span style={{ fontSize: 13, fontWeight: 500 }}>
          {channel === "phone" ? "Elena Rodriguez" : channel === "whatsapp" ? "Elena Rodriguez · +55 11 9xxxx" : "elena@seriesb.com"}
        </span>
      </div>

      {channel === "phone" && <PhoneView />}
      {channel === "whatsapp" && <WhatsAppView />}
      {channel === "email" && <EmailView />}
    </div>
  );
}
