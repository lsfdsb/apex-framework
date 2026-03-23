// Copy this file into your app and customize
// Visual reference: docs/design-dna/crm.html
// DNA palette: bg=#08080a, accent=#636bf0, pipeline stage colors per column

import React, { useEffect } from "react";
import DealDrawer from "./crm/DealDrawer";
import ContactProfile from "./crm/ContactProfile";
import LeadScoreCards from "./crm/LeadScoreCards";
import DataTable from "./crm/DataTable";
import PipelineAnalytics from "./crm/PipelineAnalytics";
import TaskList from "./crm/TaskList";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const dnaStyles = `
.reveal{opacity:0;transform:translateY(32px) scale(0.98);filter:blur(4px);transition:all .9s cubic-bezier(0.22,1,0.36,1)}
.reveal.visible{opacity:1;transform:none;filter:none}
.reveal-delay-1{transition-delay:.1s}.reveal-delay-2{transition-delay:.2s}.reveal-delay-3{transition-delay:.3s}
.crm-deal{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm,8px);padding:14px;margin-bottom:8px;cursor:grab;transition:all .3s cubic-bezier(0.22,1,0.36,1)}
.crm-deal:hover{border-color:var(--border-hover);transform:translateY(-1px)}
.crm-contact{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius,12px);padding:28px;text-align:center;transition:all .4s cubic-bezier(0.22,1,0.36,1)}
.crm-contact:hover{border-color:var(--border-hover);transform:translateY(-2px)}
.crm-timeline-item:hover .crm-dot{border-color:var(--accent);background:var(--accent-glow)}
.crm-ticket{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius-sm,8px);padding:18px 20px;display:flex;align-items:center;gap:16px;transition:all .3s cubic-bezier(0.22,1,0.36,1);cursor:pointer}
.crm-ticket:hover{border-color:var(--border-hover);transform:translateX(4px)}
@keyframes crm-orbit{to{transform:rotate(360deg)}}
@keyframes crm-pulse{0%{r:8;opacity:.6}100%{r:24;opacity:0}}
@media(max-width:768px){.crm-pipeline{grid-template-columns:1fr!important}.crm-contacts{grid-template-columns:1fr!important}.crm-split{grid-template-columns:1fr!important}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}.reveal{opacity:1;transform:none;filter:none}}
`;

const stages = [
  { name: "New Lead", color: "var(--pipeline-lead,#60a5fa)", count: 3, deals: [
    { name: "Website Redesign", company: "Acme Corp", amount: "$12,000", initials: "AC" },
    { name: "Mobile App", company: "TechStart", amount: "$28,000", initials: "TS" },
    { name: "Brand Identity", company: "Lumina", amount: "$8,500", initials: "LM" },
  ]},
  { name: "Qualified", color: "var(--pipeline-qualified,#a78bfa)", count: 2, deals: [
    { name: "API Integration", company: "DataFlow", amount: "$45,000", initials: "DF" },
    { name: "Dashboard MVP", company: "Metric Labs", amount: "$18,000", initials: "ML" },
  ]},
  { name: "Proposal", color: "var(--pipeline-proposal,#fbbf24)", count: 2, deals: [
    { name: "E-commerce Platform", company: "StyleHouse", amount: "$65,000", initials: "SH" },
    { name: "SaaS Migration", company: "CloudBase", amount: "$32,000", initials: "CB" },
  ]},
  { name: "Won", color: "var(--pipeline-won,#34d399)", count: 1, deals: [
    { name: "Analytics Suite", company: "InsightCo", amount: "$52,000", initials: "IC" },
  ]},
  { name: "Lost", color: "var(--pipeline-lost,#f87171)", count: 1, deals: [
    { name: "Legacy System", company: "OldTech", amount: "$15,000", initials: "OT" },
  ]},
];
const contacts = [
  { name: "Ana Souza", role: "Product Lead at Fintech Co", initials: "AS", color: "var(--accent)", stats: [{ v: "12", l: "Deals" }, { v: "$184k", l: "Revenue" }, { v: "94%", l: "Win Rate" }] },
  { name: "Marcus Chen", role: "CTO at Series A Startup", initials: "MC", color: "var(--success)", stats: [{ v: "8", l: "Deals" }, { v: "$96k", l: "Revenue" }, { v: "75%", l: "Win Rate" }] },
  { name: "Julia Park", role: "Design Director at Agency", initials: "JP", color: "var(--warning)", stats: [{ v: "5", l: "Deals" }, { v: "$52k", l: "Revenue" }, { v: "80%", l: "Win Rate" }] },
];
const timeline = [
  { time: "2 hours ago", text: '<strong>Ana Souza</strong> moved "API Integration" to Qualified', active: true },
  { time: "Yesterday", text: '<strong>Marcus Chen</strong> added note on "Dashboard MVP"', active: false },
  { time: "2 days ago", text: 'New lead: <strong>Brand Identity</strong> from Lumina ($8,500)', active: false },
  { time: "3 days ago", text: '<strong>Julia Park</strong> won "Analytics Suite" — $52,000', active: false },
  { time: "1 week ago", text: 'Lost "Legacy System" — competitor pricing', active: false },
];
const tickets = [
  { title: "Login issues on mobile", desc: "User can't access account on iOS 17", priority: "high", status: "open", time: "12m ago" },
  { title: "Export CSV not working", desc: "Dashboard export returns empty file", priority: "medium", status: "pending", time: "2h ago" },
  { title: "Dark mode contrast fix", desc: "Text hard to read on sidebar", priority: "low", status: "resolved", time: "1d ago" },
];

function Label({ children }: { children: string }) {
  return <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>{children}</div>;
}

export default function CRMPipeline() {
  useReveal();
  return (
    <div style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <style>{dnaStyles}</style>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: "160px 32px 100px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
            <svg viewBox="0 0 200 200" fill="none" style={{ width: 200, height: 200 }}>
              <circle cx="100" cy="100" r="70" stroke="var(--border)" strokeWidth="1" opacity="0.5" />
              <circle cx="100" cy="100" r="45" stroke="var(--border)" strokeWidth="1" opacity="0.3" />
              <circle cx="100" cy="100" r="12" fill="var(--accent)" opacity="0.2" />
              <circle cx="100" cy="100" r="6" fill="var(--accent)" />
              <g style={{ animation: "crm-orbit 8s linear infinite", transformOrigin: "center" }}>
                <circle cx="100" cy="30" r="4" fill="var(--pipeline-lead,#60a5fa)" />
                <circle cx="170" cy="100" r="4" fill="var(--pipeline-qualified,#a78bfa)" />
                <circle cx="100" cy="170" r="4" fill="var(--pipeline-won,#34d399)" />
              </g>
            </svg>
          </div>
          <div className="reveal reveal-delay-1">
            <Label>CRM + Helpdesk Patterns</Label>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>Relationships,<br />visualized.</h2>
            <p style={{ fontSize: 17, color: "var(--text-secondary)", fontWeight: 300 }}>Patterns for apps that manage people, deals, and conversations.</p>
          </div>
        </div>
      </section>

      {/* ═══ PIPELINE ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><Label>Pipeline</Label><h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 48 }}>Every deal, at a glance.</h2></div>
          <div className="crm-pipeline reveal reveal-delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            {stages.map((s) => (
              <div key={s.name} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", padding: 16, minHeight: 400 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: `2px solid ${s.color}` }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</h4>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--bg-surface)", padding: "2px 8px", borderRadius: 999 }}>{s.count}</span>
                </div>
                {s.deals.map((d) => (
                  <div key={d.name} className="crm-deal" style={s.name === "Lost" ? { opacity: 0.5 } : undefined}>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>{d.company}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{d.amount}</span>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--accent-glow)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "var(--accent)", fontWeight: 600 }}>{d.initials}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACTS ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><Label>Contacts</Label><h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 48 }}>People, not records.</h2></div>
          <div className="crm-contacts" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {contacts.map((c, i) => (
              <div key={c.name} className={`crm-contact reveal${i > 0 ? ` reveal-delay-${i}` : ""}`}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 64 64" style={{ position: "absolute", inset: 0 }}><circle cx="32" cy="32" r="30" stroke={c.color} strokeWidth="2" fill="none" opacity="0.3" /><circle cx="32" cy="32" r="30" stroke={c.color} strokeWidth="2" fill="none" strokeDasharray="47 141" transform="rotate(-90 32 32)" strokeLinecap="round" /></svg>
                  <span style={{ fontSize: 20, fontWeight: 600, color: c.color }}>{c.initials}</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 2, letterSpacing: "-0.01em" }}>{c.name}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>{c.role}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
                  {c.stats.map((s) => (
                    <div key={s.l} style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>{s.v}</div><div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.l}</div></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE + CHAT ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><Label>Activity</Label><h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 48 }}>Context, not clutter.</h2></div>
          <div className="crm-split reveal reveal-delay-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
            {/* Timeline */}
            <div style={{ position: "relative", paddingLeft: 32 }}>
              <div style={{ position: "absolute", left: 7, top: 8, bottom: 8, width: 1, background: "var(--border)" }} />
              {timeline.map((t, i) => (
                <div key={i} className="crm-timeline-item" style={{ position: "relative", paddingBottom: 28 }}>
                  <div className="crm-dot" style={{ position: "absolute", left: -32, top: 4, width: 15, height: 15, borderRadius: "50%", border: `2px solid ${t.active ? "var(--accent)" : "var(--border)"}`, background: t.active ? "var(--accent)" : "var(--bg)", zIndex: 1, transition: "all .3s", boxShadow: t.active ? "0 0 0 4px var(--accent-glow)" : "none" }} />
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4, letterSpacing: "0.02em" }}>{t.time}</div>
                  <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: t.text }} />
                </div>
              ))}
            </div>
            {/* Chat */}
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", overflow: "hidden", maxWidth: 400, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)" }} />
                <div><h4 style={{ fontSize: 14, fontWeight: 600 }}>Support Chat</h4><p style={{ fontSize: 11, color: "var(--text-muted)" }}>Ana is online</p></div>
              </div>
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 12, fontSize: 14, lineHeight: 1.5, background: "var(--bg-surface)", color: "var(--text-secondary)", alignSelf: "flex-start", borderBottomLeftRadius: 4 }}>Hi! I need help with the API integration.</div>
                <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 12, fontSize: 14, lineHeight: 1.5, background: "var(--accent)", color: "white", alignSelf: "flex-end", borderBottomRightRadius: 4 }}>Sure! Let me pull up your account details.</div>
                <div style={{ maxWidth: "80%", padding: "12px 16px", borderRadius: 12, background: "var(--bg-surface)", alignSelf: "flex-start", borderBottomLeftRadius: 4, display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 0.2, 0.4].map((d) => <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-muted)", animation: `typing-bounce 1.2s ease-in-out ${d}s infinite` }} />)}
                </div>
              </div>
              <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
                <input placeholder="Type a message..." style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 999, padding: "8px 16px", color: "var(--text)", fontSize: 13, fontFamily: "var(--font-body)", outline: "none" }} />
                <button style={{ background: "var(--accent)", border: "none", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TICKETS ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><Label>Helpdesk</Label><h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 48 }}>Every issue, tracked.</h2></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 720, margin: "0 auto" }}>
            {tickets.map((t, i) => (
              <div key={t.title} className={`crm-ticket reveal${i > 0 ? ` reveal-delay-${i}` : ""}`}>
                <div style={{ width: 4, height: 32, borderRadius: 2, flexShrink: 0, background: t.priority === "high" ? "var(--destructive)" : t.priority === "medium" ? "var(--warning)" : "var(--success)" }} />
                <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{t.title}</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.desc}</div></div>
                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, fontWeight: 500, background: t.status === "open" ? "rgba(96,165,250,0.1)" : t.status === "pending" ? "rgba(251,191,36,0.1)" : "rgba(52,211,153,0.1)", color: t.status === "open" ? "var(--info)" : t.status === "pending" ? "var(--warning)" : "var(--success)" }}>{t.status}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{t.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ═══ DEAL DRAWER ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><Label>Detalhe</Label><h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 48 }}>Tudo em um clique.</h2></div>
          <div className="reveal reveal-delay-1"><DealDrawer /></div>
        </div>
      </section>

      {/* ═══ CONTACT PROFILE ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><Label>Perfil</Label><h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 48 }}>Conheça seu cliente.</h2></div>
          <div className="reveal reveal-delay-1"><ContactProfile /></div>
        </div>
      </section>

      {/* ═══ LEAD SCORES ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><Label>Scoring</Label><h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 48 }}>Qualifique seus leads.</h2></div>
          <div className="reveal reveal-delay-1"><LeadScoreCards /></div>
        </div>
      </section>

      {/* ═══ PIPELINE ANALYTICS ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><Label>Análise</Label><h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 48 }}>Pipeline em números.</h2></div>
          <div className="reveal reveal-delay-1"><PipelineAnalytics /></div>
        </div>
      </section>

      {/* ═══ DATA TABLE ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><Label>Dados</Label><h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 48 }}>Tabelas que contam histórias.</h2></div>
          <div className="reveal reveal-delay-1"><DataTable /></div>
        </div>
      </section>

      {/* ═══ TASKS ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><Label>Tarefas</Label><h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 48 }}>Nenhum follow-up esquecido.</h2></div>
          <div className="reveal reveal-delay-1"><TaskList /></div>
        </div>
      </section>
    </div>
  );
}
