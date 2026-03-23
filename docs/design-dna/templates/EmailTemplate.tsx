// Copy this file into your app and customize
// Visual reference: docs/design-dna/email.html
// 8 templates transacionais — zero dependências externas

import React, { useEffect } from "react";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const css = `
.reveal{opacity:0;transform:translateY(32px) scale(0.98);filter:blur(4px);transition:all .9s cubic-bezier(0.22,1,0.36,1)}
.reveal.visible{opacity:1;transform:none;filter:none}
.reveal-delay-1{transition-delay:.1s}.reveal-delay-2{transition-delay:.2s}
.em-frame{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius,12px);overflow:hidden;max-width:640px;margin:0 auto;transition:all .4s cubic-bezier(0.22,1,0.36,1)}
.em-frame:hover{border-color:var(--border-hover);transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,0,0,0.15)}
.em-btn{display:inline-block;padding:12px 28px;background:var(--accent);color:white;border-radius:var(--radius-sm,8px);font-size:14px;font-weight:500;text-decoration:none;transition:all .3s cubic-bezier(0.22,1,0.36,1)}
.em-btn:hover{opacity:.9;transform:translateY(-1px)}
.em-btn-ghost{background:none;border:1px solid var(--border);color:var(--text)}
.em-notif{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius-sm,8px);padding:16px;margin-bottom:8px;display:flex;gap:12px;align-items:center}
.ship-step{flex:1;text-align:center;position:relative}
.ship-step::before{content:'';position:absolute;top:14px;left:0;right:0;height:2px;background:var(--border)}
.ship-step:first-child::before{left:50%}.ship-step:last-child::before{right:50%}
.ship-step.done::before{background:var(--success)}
@media(max-width:768px){.em-inner{padding:24px 20px!important}}
@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;filter:none;transition:none}}
`;

function Frame({ de, assunto, children }: { de: string; assunto: string; children: React.ReactNode }) {
  return (
    <div className="em-frame">
      <div style={{ padding: "8px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
        <span style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", fontSize: 11, color: "var(--text-muted)" }}>Caixa de entrada</span>
      </div>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)" }}>
        <div style={{ marginBottom: 4 }}><strong style={{ color: "var(--text-secondary)" }}>De:</strong> {de}</div>
        <div><strong style={{ color: "var(--text-secondary)" }}>Assunto:</strong> {assunto}</div>
      </div>
      <div style={{ background: "var(--bg)" }}><div className="em-inner" style={{ maxWidth: 560, margin: "0 auto", padding: "40px 32px" }}>{children}</div></div>
    </div>
  );
}

function Logo() { return <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 32 }}>apex<span style={{ color: "var(--accent)" }}>.</span></div>; }
function Rodape({ extra }: { extra?: string }) {
  return <div style={{ fontSize: 12, lineHeight: 1.6, marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}>{extra || "Você está recebendo este e-mail porque se cadastrou em apex.io."}<br /><a href="#" style={{ color: "var(--text-muted)", textDecoration: "underline" }}>Cancelar inscrição</a> · <a href="#" style={{ color: "var(--text-muted)", textDecoration: "underline" }}>Central de ajuda</a><br /><br />© 2026 APEX · São Paulo, Brasil</div>;
}
function SH({ num, title, sub }: { num: string; title: string; sub: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 32 }}>
      <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginBottom: 8 }}>{num}</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 8 }}>{title}</h2>
      <p style={{ fontSize: 15, color: "var(--text-secondary)", fontWeight: 300 }}>{sub}</p>
    </div>
  );
}
function Notif({ icon, bg, title, desc }: { icon: string; bg: string; title: string; desc: string }) {
  return (
    <div className="em-notif">
      <div style={{ width: 36, height: 36, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={icon} /></svg>
      </div>
      <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}><strong style={{ color: "var(--text)", fontWeight: 500 }}>{title}</strong><br />{desc}</div>
    </div>
  );
}

export default function EmailTemplate() {
  useReveal();
  return (
    <div style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <style>{css}</style>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: "140px 32px 100px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>Templates de E-mail</div>
          <h1 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 7vw, 80px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1 }}>
            E-mails que as<br />pessoas <em style={{ fontStyle: "italic", color: "var(--accent)" }}>abrem.</em>
          </h1>
          <p className="reveal reveal-delay-2" style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300, maxWidth: 480, margin: "20px auto 0" }}>Boas-vindas, verificação, recibos, envio, alertas, redefinição de senha, convites. 8 templates transacionais.</p>
        </div>
      </section>

      {/* ═══ EMAILS ═══ */}
      <section style={{ padding: "0 32px 100px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 96 }}>

          {/* 01 — Boas-vindas */}
          <div className="reveal"><SH num="01" title="E-mail de boas-vindas." sub="Primeira impressão na caixa de entrada." />
            <Frame de="APEX <ola@apex.io>" assunto="Bem-vindo ao APEX — vamos começar">
              <Logo /><h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 12, lineHeight: 1.3, color: "var(--text)" }}>Bem-vindo a bordo, Ana.</h1>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: 24 }}>Você acaba de se juntar a 12.000+ times que entregam produtos melhores com menos esforço. Veja como aproveitar ao máximo sua primeira semana:</p>
              <Notif icon="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" bg="rgba(99,107,240,0.1)" title="Configure seu workspace" desc="Crie seu primeiro projeto e convide seu time." />
              <Notif icon="M22 12l-4 0l-3 9l-6-18l-3 9l-4 0" bg="rgba(52,211,153,0.1)" title="Conecte suas ferramentas" desc="Integre com GitHub, Slack e Figma em um clique." />
              <Notif icon="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2" bg="rgba(251,191,36,0.1)" title="Agende um tour" desc="15 minutos com nosso time. Mostramos os atalhos." />
              <div style={{ marginTop: 20 }}><a href="#" className="em-btn">Ir para o dashboard</a></div>
              <Rodape />
            </Frame>
          </div>

          {/* 02 — Verificação */}
          <div className="reveal"><SH num="02" title="Código de verificação." sub="Claro, escaneável, uma ação." />
            <Frame de="APEX <seguranca@apex.io>" assunto="Seu código de verificação: 847291">
              <div style={{ textAlign: "center" }}>
                <Logo /><h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12, color: "var(--text)" }}>Verifique seu e-mail.</h1>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: 380, margin: "0 auto 24px" }}>Digite este código para confirmar seu endereço de e-mail. Ele expira em 10 minutos.</p>
                <div style={{ display: "inline-block", fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 700, letterSpacing: "0.15em", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", padding: "16px 32px", margin: "16px 0" }}>847291</div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 16 }}>Se você não solicitou isso, pode ignorar este e-mail com segurança.</p>
                <Rodape extra="© 2026 APEX · Central de ajuda" />
              </div>
            </Frame>
          </div>

          {/* 03 — Confirmação de pedido */}
          <div className="reveal"><SH num="03" title="Recibo de pedido." sub="Cada detalhe, claramente estruturado." />
            <Frame de="APEX Store <pedidos@apex.io>" assunto="Pedido confirmado — #ORD-2026-1847">
              <Logo /><h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12, color: "var(--text)" }}>Pedido confirmado.</h1>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 24 }}>Obrigado pela compra, Ana. Aqui está o que você pediu:</p>
              {[{ name: "Vaso Cerâmico Midnight", variant: "Tamanho M · Preto Fosco · Qtd: 1", price: "R$ 489" }, { name: "Manta de Linho", variant: "Natural · King · Qtd: 2", price: "R$ 680" }].map((item) => (
                <div key={item.name} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
                  <div style={{ width: 56, height: 56, background: "var(--bg-surface)", borderRadius: "var(--radius-sm, 8px)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, color: "var(--text-muted)" }}>IMG</div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.variant}</div></div>
                  <div style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{item.price}</div>
                </div>
              ))}
              <div style={{ height: 1, background: "var(--border)", margin: "24px 0" }} />
              {[["Subtotal", "R$ 1.169,00"], ["Frete", "Grátis"], ["Desconto", "-R$ 116,90"]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: l === "Desconto" ? "var(--success)" : "var(--text-muted)", marginBottom: 6 }}><span>{l}</span><span>{v}</span></div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", fontSize: 16, fontWeight: 600, borderTop: "1px solid var(--border)", marginTop: 8 }}><span>Total</span><span>R$ 1.052,10</span></div>
              <a href="#" className="em-btn">Rastrear seu pedido</a>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>Pedido #ORD-2026-1847 · Pago com Visa ····4242</p>
              <Rodape extra="Dúvidas? Responda este e-mail ou acesse nossa Central de ajuda." />
            </Frame>
          </div>

          {/* 04 — Envio */}
          <div className="reveal"><SH num="04" title="Atualização de envio." sub="Visualização de progresso. Onde está meu pacote?" />
            <Frame de="APEX Store <envio@apex.io>" assunto="Seu pedido está a caminho!">
              <Logo /><h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12, color: "var(--text)" }}>Seu pedido foi enviado.</h1>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 4 }}>Entrega estimada: <strong style={{ color: "var(--text)" }}>22 de março de 2026</strong></p>
              <div style={{ display: "flex", gap: 0, margin: "20px 0" }}>
                {[{ l: "Pedido", done: true }, { l: "Embalado", done: true }, { l: "Enviado", current: true }, { l: "Entregue" }].map((s, i) => (
                  <div key={s.l} className={`ship-step${s.done ? " done" : ""}`}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${s.done ? "var(--success)" : s.current ? "var(--accent)" : "var(--border)"}`, background: s.done ? "var(--success)" : "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: s.done ? "white" : s.current ? "var(--accent)" : "var(--text-muted)", margin: "0 auto 8px", position: "relative", zIndex: 1 }}>{s.done ? "✓" : i + 1}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ height: 1, background: "var(--border)", margin: "24px 0" }} />
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Rastreio: <span style={{ fontFamily: "monospace" }}>BR1234567890</span></p>
              <a href="#" className="em-btn">Rastrear pacote</a>
              <Rodape />
            </Frame>
          </div>

          {/* 05 — Redefinição de senha */}
          <div className="reveal"><SH num="05" title="Redefinição de senha." sub="Segurança em primeiro lugar. Urgência clara." />
            <Frame de="APEX <seguranca@apex.io>" assunto="Redefina sua senha">
              <Logo /><h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12, color: "var(--text)" }}>Redefina sua senha.</h1>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: 24 }}>Recebemos um pedido para redefinir sua senha. Clique abaixo para escolher uma nova. Este link expira em 1 hora.</p>
              <a href="#" className="em-btn">Redefinir senha</a>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 12 }}>Se você não solicitou isso, pode ignorar este e-mail com segurança.</p>
              <Rodape />
            </Frame>
          </div>

          {/* 06 — Convite para time */}
          <div className="reveal"><SH num="06" title="Convite para time." sub="Pessoal. Caloroso. Acionável." />
            <Frame de="APEX <times@apex.io>" assunto="Ana Souza convidou você para a Forma">
              <Logo />
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--accent-glow)", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>AS</div>
                <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>Entre para o time Forma.</h1>
                <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>Ana Souza convidou você para colaborar na Forma.</p>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8 }}><a href="#" className="em-btn">Aceitar convite</a><a href="#" className="em-btn em-btn-ghost">Recusar</a></div>
              <Rodape />
            </Frame>
          </div>

          {/* 07 — Pagamento falhou */}
          <div className="reveal"><SH num="07" title="Pagamento falhou." sub="Alerta sem alarme." />
            <Frame de="APEX <cobranca@apex.io>" assunto="Ação necessária: pagamento falhou">
              <Logo />
              <div style={{ padding: 20, borderRadius: "var(--radius-sm, 8px)", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", marginBottom: 24, textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>⚠️</div>
                <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6, color: "var(--destructive)" }}>Pagamento falhou.</h1>
                <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Não conseguimos processar seu pagamento do plano Pro (R$ 149/mês).</p>
              </div>
              <a href="#" className="em-btn">Atualizar método de pagamento</a>
              <Rodape />
            </Frame>
          </div>

          {/* 08 — Resumo semanal */}
          <div className="reveal"><SH num="08" title="Resumo semanal." sub="Resumo. Não ruído." />
            <Frame de="APEX <resumo@apex.io>" assunto="Sua semana na Forma — 17 a 23 de março">
              <Logo /><h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: "var(--text)" }}>Sua semana em revisão.</h1>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                {[{ v: "14", l: "Tarefas feitas" }, { v: "+23%", l: "Velocidade" }, { v: "3", l: "PRs mergeados" }].map((s) => (
                  <div key={s.l} style={{ textAlign: "center", padding: 16, background: "var(--bg-elevated)", borderRadius: "var(--radius-sm, 8px)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <a href="#" className="em-btn">Ver relatório completo</a>
              <Rodape />
            </Frame>
          </div>

        </div>
      </section>
    </div>
  );
}
