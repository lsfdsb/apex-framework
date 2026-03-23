// Copy this file into your app and customize
// Visual reference: docs/design-dna/portfolio.html
// DNA palette: bg=var(--bg), accent=var(--accent), Instrument Serif display, centered hero

import React, { useEffect, FormEvent, useState } from "react";
import { Header } from "../starters/layout";
import { Badge } from "../starters/primitives";

// ── Reveal hook (IntersectionObserver → .visible) ─────────────
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Types ──────────────────────────────────────────────────────
interface Project { id: string; title: string; category: string; description: string; tags: string[]; tall?: boolean; }

// ── Sample data ────────────────────────────────────────────────
const PROJECTS: Project[] = [
  { id: "pr1", title: "Forma — Design System",        category: "Product Design",       description: "Built a comprehensive design system from scratch for a Series B SaaS. 120+ components, 5 themes, full a11y compliance.",        tags: ["Figma","React","TypeScript"], tall: true },
  { id: "pr2", title: "Relay — Real-time Collab",     category: "Frontend Engineering", description: "Architected the WebSocket layer and presence system for a document editor used by 80k teams.",                                  tags: ["Next.js","WebSockets","CRDTs"] },
  { id: "pr3", title: "Beacon — Analytics",           category: "Full-stack",           description: "End-to-end analytics product. Data pipeline, visualization layer, and white-label reporting.",                                   tags: ["React","D3","Postgres"] },
  { id: "pr4", title: "Inkline — Brand Identity",     category: "Visual Design",        description: "Complete brand identity, illustration system, and motion guidelines for a publishing startup.",                                   tags: ["Illustrator","Motion","Brand"], tall: true },
];

const SERVICES = [
  { num: "01", title: "Product Design",   desc: "From research to polished interfaces. Figma, prototyping, design systems." },
  { num: "02", title: "Development",      desc: "Next.js, React, TypeScript. Production-grade code that performs." },
  { num: "03", title: "Brand Strategy",   desc: "Positioning, visual identity, tone of voice. Brands that resonate." },
];

const STATS = [{ value: "48", label: "Projects" }, { value: "12", label: "Years" }, { value: "8", label: "Awards" }];

// ── ProjectCard ────────────────────────────────────────────────
function ProjectCard({ p, delay }: { p: Project; delay?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      className={`reveal${delay ? ` reveal-delay-${delay}` : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg-elevated)", border: `1px solid ${hovered ? "var(--border-hover)" : "var(--border)"}`,
        borderRadius: "var(--radius)", overflow: "hidden", cursor: "pointer",
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div style={{ aspectRatio: p.tall ? "16/14" : "16/10", background: "var(--bg-surface)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Project image</span>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 60%,var(--bg-elevated) 100%)" }} />
      </div>
      <div style={{ padding: 24 }}>
        <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent)", fontWeight: 500, marginBottom: 6 }}>{p.category}</p>
        <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 6, color: "var(--text)" }}>{p.title}</h3>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{p.description}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {p.tags.map((t) => <Badge key={t} variant="default">{t}</Badge>)}
        </div>
      </div>
    </article>
  );
}

// ── ContactForm ────────────────────────────────────────────────
function ContactForm() {
  const [status, setStatus] = useState<"idle"|"sending"|"sent">("idle");
  function handleSubmit(e: FormEvent) { e.preventDefault(); setStatus("sending"); setTimeout(() => setStatus("sent"), 1200); }
  const inp: React.CSSProperties = { width: "100%", padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", outline: "none", resize: "vertical" as const };
  const lbl: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 };
  return (
    <div className="reveal" style={{ maxWidth: 560, margin: "0 auto", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 48 }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 8, color: "var(--text)" }}>Let&apos;s talk.</h3>
      <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 32 }}>Tell us about your project. We&apos;ll respond within 24 hours.</p>
      {status === "sent" ? (
        <p style={{ fontSize: 15, color: "var(--success)", textAlign: "center", padding: "24px 0" }}>Message sent. We&apos;ll be in touch soon.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}><label htmlFor="cf-name" style={lbl}>Name</label><input id="cf-name" type="text" placeholder="Your name" autoComplete="name" required style={inp} /></div>
          <div style={{ marginBottom: 20 }}><label htmlFor="cf-email" style={lbl}>Email</label><input id="cf-email" type="email" placeholder="your@email.com" autoComplete="email" required style={inp} /></div>
          <div style={{ marginBottom: 20 }}><label htmlFor="cf-msg" style={lbl}>Message</label><textarea id="cf-msg" rows={4} placeholder="Tell us about your project..." required style={inp} /></div>
          <button type="submit" disabled={status === "sending"} style={{ width: "100%", padding: 13, background: "var(--accent)", color: "white", border: "none", borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)", opacity: status === "sending" ? 0.7 : 1 }}>
            {status === "sending" ? "Sending..." : "Send message"}
          </button>
        </form>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────
export default function PortfolioPage() {
  useReveal();
  const sec: React.CSSProperties = { padding: "100px 32px" };
  const inner: React.CSSProperties = { maxWidth: 1200, margin: "0 auto" };
  const sectionLabel: React.CSSProperties = { fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 };
  const sectionH2: React.CSSProperties = { fontFamily: "var(--font-display)", fontSize: "clamp(40px,5vw,64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1 };
  const sectionHead = (label: string, title: string) => (
    <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
      <p style={sectionLabel}>{label}</p>
      <h2 style={sectionH2}>{title}</h2>
    </div>
  );

  return (
    <div className="apex-enter" style={{ color: "var(--text)" }}>
      <style>{`
        .reveal{opacity:0;transform:translateY(32px) scale(0.98);filter:blur(4px);transition:all 0.9s cubic-bezier(0.22,1,0.36,1)}
        .reveal.visible{opacity:1;transform:none;filter:none}
        .reveal-delay-1{transition-delay:0.1s}.reveal-delay-2{transition-delay:0.2s}.reveal-delay-3{transition-delay:0.3s}
        .port-link:hover{border-color:var(--accent)!important;color:var(--accent)!important}
        @media(max-width:768px){.pg-grid,.ab-split,.sv-grid{grid-template-columns:1fr!important}}
        @media(prefers-reduced-motion:reduce){.reveal{opacity:1!important;transform:none!important;filter:none!important}}
      `}</style>

      <Header
        logo={<span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--text)" }}>Creative Studio</span>}
        links={[{ label: "Work", href: "#work", active: true }, { label: "About", href: "#about" }, { label: "Services", href: "#services" }, { label: "Contact", href: "#contact" }]}
      />

      {/* Hero — centered serif "Creative studio." */}
      <section id="main-content" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 32px 100px" }}>
        <div>
          <p className="reveal" style={sectionLabel}>Portfolio</p>
          <h1 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(64px,10vw,120px)", fontWeight: 400, letterSpacing: "-0.05em", lineHeight: 0.95, marginBottom: 16 }}>
            Creative<br /><em style={{ fontStyle: "italic", color: "var(--accent)" }}>studio.</em>
          </h1>
          <p className="reveal reveal-delay-2" style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300, marginBottom: 32 }}>Design + Engineering + Strategy</p>
          <div className="reveal reveal-delay-3" style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            {["Work","About","Contact"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="port-link" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", padding: "6px 16px", border: "1px solid var(--border)", borderRadius: 999, transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)" }}>{l}</a>
            ))}
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section id="work" style={sec}>
        <div style={inner}>
          {sectionHead("Selected Work", "Projects that shipped.")}
          <div className="pg-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
            {PROJECTS.map((p, i) => <ProjectCard key={p.id} p={p} delay={i > 0 ? i : undefined} />)}
          </div>
        </div>
      </section>

      {/* About — photo + text + stats */}
      <section id="about" style={sec}>
        <div className="ab-split" style={{ ...inner, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div className="reveal" style={{ aspectRatio: "3/4", background: "var(--bg-surface)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", zIndex: 1 }}>Photo</span>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 40%,var(--accent-glow) 0%,transparent 50%)" }} />
          </div>
          <div className="reveal reveal-delay-1">
            <p style={sectionLabel}>About</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.1, color: "var(--text)" }}>Design with intention. Build with care.</h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>We&apos;re a small studio that believes great products come from understanding people first, technology second. Every project starts with listening.</p>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24 }}>Based in São Paulo. Working globally.</p>
            <div style={{ display: "flex", gap: 32 }}>
              {STATS.map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services — numbered, 1px-gap grid */}
      <section id="services" style={sec}>
        <div style={inner}>
          {sectionHead("Services", "What we do.")}
          <div className="sv-grid reveal reveal-delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            {SERVICES.map((s) => (
              <ServiceItem key={s.num} s={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact — card with form */}
      <section id="contact" style={sec}><div style={inner}><ContactForm /></div></section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "40px 32px" }}>
        <div style={{ ...inner, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Creative Studio</span>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>&copy; {new Date().getFullYear()} · Crafted with care.</p>
        </div>
      </footer>
    </div>
  );
}

function ServiceItem({ s }: { s: { num: string; title: string; desc: string } }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? "var(--bg-elevated)" : "var(--bg)", padding: "40px 32px", transition: "background 0.3s" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 40, color: "var(--border-hover)", marginBottom: 16, letterSpacing: "-0.03em" }}>{s.num}</div>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.01em" }}>{s.title}</h3>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{s.desc}</p>
    </div>
  );
}
