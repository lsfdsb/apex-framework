// Copy this file into your app and customize
// Visual reference: docs/design-dna/landing.html
// DNA palette: bg=#08080a, accent=#636bf0, font-display=Instrument Serif

import React, { useEffect } from "react";
import { DnaBackground } from "../starters/patterns/DnaBackground";

// ── Reveal hook (IntersectionObserver) ───────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── Injected CSS (animations + feature cards) ────────────────
const dnaStyles = `
.reveal{opacity:0;transform:translateY(40px) scale(0.98);filter:blur(6px);
  transition:opacity 1s cubic-bezier(0.22,1,0.36,1),transform 1s cubic-bezier(0.22,1,0.36,1),filter 0.8s cubic-bezier(0.22,1,0.36,1)}
.reveal.visible{opacity:1;transform:none;filter:none}
.reveal-delay-1{transition-delay:.12s}.reveal-delay-2{transition-delay:.24s}
.reveal-delay-3{transition-delay:.36s}.reveal-delay-4{transition-delay:.48s}
.lift{transition:transform .5s cubic-bezier(0.22,1,0.36,1),box-shadow .5s cubic-bezier(0.22,1,0.36,1)}
.lift:hover{transform:translateY(-6px);box-shadow:var(--shadow-lift,0 20px 60px rgba(0,0,0,.3))}
@keyframes glow-pulse{0%,100%{opacity:.6;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}}
.feature-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border-radius:var(--radius,12px);overflow:hidden}
.feature-card{background:var(--bg);padding:48px 40px;transition:background .4s cubic-bezier(0.22,1,0.36,1);position:relative}
.feature-card:hover{background:var(--bg-elevated,#111114)}
.feature-card::after{content:'';position:absolute;bottom:0;left:40px;right:40px;height:1px;background:var(--accent);transform:scaleX(0);transition:transform .6s cubic-bezier(0.22,1,0.36,1)}
.feature-card:hover::after{transform:scaleX(1)}
.testimonial-card{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius,12px);padding:36px;transition:all .5s cubic-bezier(0.22,1,0.36,1)}
.testimonial-card:hover{border-color:var(--border-hover);transform:translateY(-2px)}
.price-card{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius,12px);padding:44px 36px;display:flex;flex-direction:column;transition:all .3s cubic-bezier(0.16,1,0.3,1)}
.price-card:hover{transform:translateY(-2px);border-color:var(--border-hover)}
.price-card.featured{border-color:var(--accent);background:linear-gradient(180deg,var(--accent-glow) 0%,var(--bg-elevated) 100%)}
.dash-bar{flex:1;background:var(--accent-glow);border-radius:4px 4px 0 0;transition:background .3s;min-height:8px}
.dash-bar:hover{background:var(--accent)}
@media(max-width:768px){.feature-grid,.pricing-grid,.testimonial-grid{grid-template-columns:1fr}
  .auth-frame{grid-template-columns:1fr}.auth-brand{display:none}.dash-stats{grid-template-columns:repeat(2,1fr)}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}.reveal{opacity:1;transform:none;filter:none}}
`;

// ── Data ─────────────────────────────────────────────────────
const features = [
  { num: "01", title: "Typography does the work", desc: "Large display type, weight contrast, letter-spacing precision. The font IS the design. No decoration needed when the words are beautiful." },
  { num: "02", title: "Space is intentional", desc: "Whitespace isn't empty. It's the most powerful element on the page. It gives everything room to breathe, to be noticed, to matter." },
  { num: "03", title: "Motion has meaning", desc: "Nothing moves without purpose. Blur to focus on entrance. Subtle lift on hover. The interface responds to you, not performs for you." },
];
const pricing = [
  { tier: "Starter", price: "$0", unit: "/mo", desc: "For individuals exploring.", items: ["3 projects", "Basic analytics", "Community support"], featured: false },
  { tier: "Pro", price: "$29", unit: "/mo", desc: "For teams that ship.", items: ["Unlimited projects", "Advanced analytics", "Priority support", "Custom integrations"], featured: true },
  { tier: "Enterprise", price: "Custom", unit: "", desc: "For organizations at scale.", items: ["Everything in Pro", "SSO & SAML", "Dedicated support", "SLA guarantee"], featured: false },
];
const testimonials = [
  { text: "This changed how I think about shipping products. The quality bar is non-negotiable now.", name: "Ana Souza", role: "Product Lead, Fintech", initials: "A" },
  { text: "Every interface we ship now feels intentional. The difference is night and day.", name: "Marcus Chen", role: "CTO, Series A Startup", initials: "M" },
  { text: "I stopped asking 'is this good enough?' Now I ask 'is this beautiful?' That shift changes everything.", name: "Julia Park", role: "Design Engineer", initials: "J" },
];
const stats = [
  { label: "Revenue", value: "$45.2k", delta: "+12.5%", up: true },
  { label: "Users", value: "2,847", delta: "+8.2%", up: true },
  { label: "Conversion", value: "3.6%", delta: "-0.4%", up: false },
  { label: "Avg. Order", value: "$64", delta: "+2.1%", up: true },
];
const bars = [35,58,42,75,50,88,62,80,55,92,68,85,45,78,60,90];

// ── Page ─────────────────────────────────────────────────────
export default function LandingPage() {
  useReveal();
  const s = (vars: React.CSSProperties) => vars;
  return (
    <div style={{ color: "var(--text)", fontFamily: "var(--font-body)", position: "relative" }}>
      <style>{dnaStyles}</style>
      <DnaBackground pattern="constellation" animated="orbs" />

      {/* ═══ HERO ═══ */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "160px 32px", position: "relative" }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)", top: "50%", left: "50%", pointerEvents: "none", zIndex: 0, animation: "glow-pulse 6s ease-in-out infinite", opacity: "var(--hero-glow-opacity,1)" }} aria-hidden="true" />
        <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="reveal" style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 500, marginBottom: 24 }}>Design DNA</div>
          <h1 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(52px, 8vw, 96px)", fontWeight: 400, lineHeight: 1, letterSpacing: "-0.04em", marginBottom: 32 }}>
            Build things people <em style={{ fontStyle: "italic", color: "var(--accent)" }}>feel.</em>
          </h1>
          <p className="reveal reveal-delay-2" style={{ fontSize: 18, lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto 48px", fontWeight: 300 }}>
            Stop shipping interfaces. Start shipping experiences. Every pixel earns its place or it doesn't exist.
          </p>
          <a href="#features" className="reveal reveal-delay-3" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--cta-bg, white)", color: "var(--cta-text, #08080a)", padding: "14px 36px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none", transition: "all .4s cubic-bezier(0.22,1,0.36,1)" }}>
            Explore patterns <span style={{ fontSize: 18 }}>&rarr;</span>
          </a>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" style={{ padding: "160px 32px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 80 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>Three things.<br />Done right.</h2>
            <p style={{ fontSize: 17, color: "var(--text-secondary)", fontWeight: 300, maxWidth: 420, margin: "0 auto" }}>Every feature earns its place. If it doesn&rsquo;t, it doesn&rsquo;t exist.</p>
          </div>
          <div className="feature-grid reveal reveal-delay-1">
            {features.map((f) => (
              <div key={f.num} className="feature-card">
                <div style={{ fontSize: 48, fontWeight: 700, color: "var(--feature-number-color, var(--border-hover))", fontFamily: "var(--font-display)", marginBottom: 24, letterSpacing: "-0.03em" }}>{f.num}</div>
                <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 12 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section style={{ padding: "160px 32px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 80 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 20 }}>Honest pricing.</h2>
            <p style={{ fontSize: 17, color: "var(--text-secondary)", fontWeight: 300 }}>No hidden fees. No calculator needed.</p>
          </div>
          <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 960, margin: "0 auto" }}>
            {pricing.map((p) => (
              <div key={p.tier} className={`price-card reveal${p.featured ? " featured" : ""}`}>
                <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 12, fontWeight: 500, letterSpacing: "0.03em" }}>{p.tier}</div>
                <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 6 }}>{p.price}{p.unit && <small style={{ fontSize: 16, fontWeight: 400, color: "var(--text-muted)" }}>{p.unit}</small>}</div>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 36, lineHeight: 1.5 }}>{p.desc}</div>
                <ul style={{ listStyle: "none", marginBottom: 40, flex: 1 }}>
                  {p.items.map((item) => (
                    <li key={item} style={{ padding: "10px 0", fontSize: 14, color: "var(--text-secondary)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(52,211,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, color: "var(--success)" }}>&#10003;</span>{item}
                    </li>
                  ))}
                </ul>
                <button style={{ display: "block", width: "100%", textAlign: "center", padding: 13, borderRadius: "var(--radius-sm, 8px)", fontSize: 14, fontWeight: 500, border: p.featured ? "none" : "1px solid var(--border)", cursor: "pointer", fontFamily: "var(--font-body)", background: p.featured ? "var(--accent)" : "transparent", color: p.featured ? "var(--accent-contrast, white)" : "var(--text)", transition: "all .25s" }}>{p.featured ? "Start trial" : p.tier === "Enterprise" ? "Contact sales" : "Start free"}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DASHBOARD ═══ */}
      <section style={{ padding: "160px 32px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 20 }}>Clarity over clutter.</h2>
            <p style={{ fontSize: 17, color: "var(--text-secondary)", fontWeight: 300 }}>Every metric earns its place. Nothing decorative.</p>
          </div>
          <div className="reveal reveal-delay-1" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", overflow: "hidden" }}>
            <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} /><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} /><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} /></div>
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>Overview</h3>
              <button style={{ background: "var(--accent)", color: "var(--accent-contrast, white)", border: "none", padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Export</button>
            </div>
            <div style={{ padding: 24 }}>
              <div className="dash-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                {stats.map((s) => (
                  <div key={s.label} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", padding: 20 }}>
                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 8 }}>{s.label}</div>
                    <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em" }}>{s.value}</div>
                    <div style={{ fontSize: 12, marginTop: 6, color: s.up ? "var(--success)" : "var(--destructive)" }}>{s.delta}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", padding: 24, height: 200, display: "flex", alignItems: "flex-end", gap: 6 }}>
                {bars.map((h, i) => <div key={i} className="dash-bar" style={{ height: `${h}%` }} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ AUTH ═══ */}
      <section style={{ padding: "160px 32px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div className="auth-frame reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: "var(--radius, 12px)", overflow: "hidden", border: "1px solid var(--border)", minHeight: 520 }}>
            <div className="auth-brand" style={{ background: "var(--bg-elevated)", padding: 64, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden", borderRight: "1px solid var(--border)" }}>
              <div style={{ position: "absolute", bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }} />
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16, position: "relative" }}>Start building something that matters.</h2>
              <p style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.7, maxWidth: 320, position: "relative" }}>Join teams that ship products people love. Free to start, no credit card.</p>
            </div>
            <div style={{ background: "var(--bg)", padding: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "100%", maxWidth: 340 }}>
                <h3 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 6 }}>Create account</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 36 }}>Free forever for individuals.</p>
                {["Full name", "Email", "Password"].map((label) => (
                  <div key={label} style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>{label}</label>
                    <input type={label === "Password" ? "password" : label === "Email" ? "email" : "text"} placeholder={label === "Full name" ? "Jane Smith" : label === "Email" ? "jane@company.com" : "8+ characters"} style={{ width: "100%", padding: "11px 14px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", outline: "none" }} />
                  </div>
                ))}
                <button style={{ width: "100%", padding: 12, background: "var(--accent)", color: "var(--accent-contrast, white)", border: "none", borderRadius: "var(--radius-sm, 8px)", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)", marginTop: 8 }}>Create account</button>
                <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "var(--text-muted)" }}>Have an account? <a href="#" style={{ color: "var(--accent)", textDecoration: "none" }}>Sign in</a></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section style={{ padding: "160px 32px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 80 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1 }}>Loved by people<br />who build.</h2>
          </div>
          <div className="testimonial-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {testimonials.map((t, i) => (
              <div key={t.name} className={`testimonial-card reveal${i > 0 ? ` reveal-delay-${i}` : ""}`}>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: 28, fontStyle: "italic" }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent-glow)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: "160px 32px", background: "var(--bg-surface)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }} />
        <div className="reveal" style={{ textAlign: "center", position: "relative" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(44px, 6vw, 72px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 16 }}>Ready to build<br />something <em style={{ fontStyle: "italic", color: "var(--accent)" }}>real?</em></h2>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300 }}>Start shipping interfaces that people remember.</p>
          <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--cta-bg, white)", color: "var(--cta-text, #08080a)", padding: "14px 36px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none", marginTop: 16, transition: "all .4s cubic-bezier(0.22,1,0.36,1)" }}>Start building <span style={{ fontSize: 18 }}>&rarr;</span></a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "64px 32px 32px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", gap: 64, marginBottom: 48 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>apex <span style={{ color: "var(--text-muted)", fontWeight: 400, marginLeft: 8 }}>framework</span></div>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 240 }}>Design like Ive. Code like Torvalds.<br />Ship like Jobs.</p>
          </div>
          <div style={{ display: "flex", gap: 64 }}>
            {[
              { title: "Product", links: ["Features", "Pricing", "Changelog"] },
              { title: "Resources", links: ["Documentation", "Design DNA", "GitHub"] },
              { title: "Company", links: ["About", "Blog", "Contact"] },
            ].map((col) => (
              <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 500, marginBottom: 8 }}>{col.title}</div>
                {col.links.map((link) => (
                  <a key={link} href="#" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>{link}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1120, margin: "0 auto", paddingTop: 24, borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>&copy; 2026 Lucas Bueno &amp; Claude. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
