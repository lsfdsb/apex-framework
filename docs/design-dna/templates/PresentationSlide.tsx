// Copy this file into your app and customize
// DNA source: docs/design-dna/presentation.html
// 10 slide types: Title, Section, Stats, Content, Quote, Split, Timeline, Team, Pricing, CTA

import React, { useEffect } from "react";
import { DnaBackground } from "../starters/patterns/DnaBackground";

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
.reveal-delay-1{transition-delay:.1s}.reveal-delay-2{transition-delay:.2s}
.pres-slide{aspect-ratio:16/9;background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius,16px);padding:48px 64px;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden;margin-bottom:24px;transition:all .4s cubic-bezier(0.22,1,0.36,1)}
.pres-slide:hover{border-color:var(--border-hover)}
@media(max-width:768px){.pres-slide{padding:32px;aspect-ratio:auto;min-height:300px}.pres-split{flex-direction:column!important}.pres-content-grid{grid-template-columns:1fr!important}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}.reveal{opacity:1;transform:none;filter:none}}
`;

function SlideLabel({ children }: { children: string }) {
  return <span style={{ position: "absolute", top: 16, right: 20, fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{children}</span>;
}
function SlideNum({ n }: { n: number }) {
  return <span style={{ position: "absolute", bottom: 16, right: 20, fontSize: 11, color: "var(--text-muted)" }}>{String(n).padStart(2, "0")} / 10</span>;
}

export default function PresentationSlide() {
  useReveal();
  return (
    <div style={{ color: "var(--text)", fontFamily: "var(--font-body)", position: "relative" }}>
      <DnaBackground pattern="diagonals" animated="spotlight" />
      <style>{dnaStyles}</style>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: "140px 32px 100px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>Presentation</div>
          <h1 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 7vw, 80px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1 }}>Slides that<br /><em style={{ fontStyle: "italic", color: "var(--accent)" }}>persuade.</em></h1>
          <p className="reveal reveal-delay-2" style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300, maxWidth: 440, margin: "20px auto 0" }}>Pitch decks, keynotes, investor presentations. 10 slide types, each designed to make one point perfectly.</p>
        </div>
      </section>

      {/* ═══ 10 SLIDES ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>10 slide types.</h2>
            <p style={{ fontSize: 17, color: "var(--text-secondary)", fontWeight: 300 }}>One idea per slide. Maximum impact.</p>
          </div>

          {/* 1: Title */}
          <div className="pres-slide reveal">
            <SlideLabel>Title Slide</SlideLabel>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1 }}>The future of<br />work is <em style={{ fontStyle: "italic", color: "var(--accent)" }}>async.</em></h1>
            <p style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300, marginTop: 16, maxWidth: 480 }}>How distributed teams are outperforming co-located ones — and what it means for your company.</p>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 32 }}>Acme Corp · Series B Pitch · March 2026</div>
            <SlideNum n={1} />
          </div>

          {/* 2: Section Divider */}
          <div className="pres-slide reveal" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <SlideLabel>Section Divider</SlideLabel>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 400, letterSpacing: "-0.04em" }}>The <em style={{ fontStyle: "italic", color: "var(--accent)" }}>problem.</em></h2>
            <p style={{ fontSize: 16, color: "var(--text-muted)", marginTop: 12 }}>Why traditional offices are failing knowledge workers.</p>
            <SlideNum n={2} />
          </div>

          {/* 3: Stats */}
          <div className="pres-slide reveal" style={{ alignItems: "center", textAlign: "center" }}>
            <SlideLabel>Key Metrics</SlideLabel>
            <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>The numbers speak for themselves.</h2>
            <div style={{ display: "flex", justifyContent: "center", gap: 64, marginTop: 32 }}>
              {[{ v: "73%", l: "Prefer remote work", c: "var(--accent)" }, { v: "2.4×", l: "Productivity increase" }, { v: "$21K", l: "Saved per employee/year", c: "var(--success)" }].map((s) => (
                <div key={s.l} style={{ textAlign: "center" }}><div style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1, color: s.c }}>{s.v}</div><div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>{s.l}</div></div>
              ))}
            </div>
            <SlideNum n={3} />
          </div>

          {/* 4: Content Grid */}
          <div className="pres-slide reveal">
            <SlideLabel>Key Points</SlideLabel>
            <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 24 }}>Why async wins.</h2>
            <div className="pres-content-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              {[{ n: "01", t: "Deep Work", d: "Uninterrupted blocks of focus time. No context switching. No meetings about meetings." }, { n: "02", t: "Global Talent", d: "Hire the best person for the job, regardless of timezone." }, { n: "03", t: "Written Culture", d: "Decisions documented by default. Institutional memory that scales." }, { n: "04", t: "Work-Life Balance", d: "People work when they're at their best. Retention follows." }].map((item) => (
                <div key={item.n}><div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--border-hover)", marginBottom: 8, letterSpacing: "-0.03em" }}>{item.n}</div><h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{item.t}</h3><p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.d}</p></div>
              ))}
            </div>
            <SlideNum n={4} />
          </div>

          {/* 5: Quote */}
          <div className="pres-slide reveal" style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: "48px 80px" }}>
            <SlideLabel>Quote</SlideLabel>
            <blockquote style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.3, fontStyle: "italic" }}>&ldquo;The future of work is not about where you work. It&rsquo;s about how clearly you think.&rdquo;</blockquote>
            <cite style={{ display: "block", fontFamily: "var(--font-body)", fontStyle: "normal", fontSize: 14, color: "var(--text-muted)", marginTop: 24 }}>— Jason Fried, Basecamp</cite>
            <SlideNum n={5} />
          </div>

          {/* 6: Split Image+Text */}
          <div className="pres-slide pres-split reveal" style={{ flexDirection: "row", gap: 0, padding: 0 }}>
            <SlideLabel>Feature Highlight</SlideLabel>
            <div style={{ flex: 1, background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 40%, var(--accent-glow), transparent 60%)" }} />
              <span style={{ fontSize: 12, color: "var(--text-muted)", position: "relative" }}>Product screenshot</span>
            </div>
            <div style={{ flex: 1, padding: "48px 48px 48px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 12 }}>Built for async teams.</h2>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>Our platform replaces meetings with structured communication.</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {["Threaded discussions with @mentions", "Async video messages (no scheduling)", "Decision logs with voting", "Timezone-aware availability"].map((li) => (
                  <li key={li} style={{ fontSize: 14, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />{li}</li>
                ))}
              </ul>
            </div>
            <SlideNum n={6} />
          </div>

          {/* 7: Timeline/Roadmap */}
          <div className="pres-slide reveal">
            <SlideLabel>Roadmap</SlideLabel>
            <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 24 }}>Where we&rsquo;re going.</h2>
            <div style={{ display: "flex", gap: 0, marginTop: 24 }}>
              {[{ q: "Q1 2026", t: "MVP launch", s: "1K users", done: true }, { q: "Q2 2026", t: "Teams feature", s: "10K users", done: true }, { q: "Q3 2026", t: "Enterprise", s: "50K target", done: false, n: "3" }, { q: "Q4 2026", t: "AI features", s: "100K target", done: false, n: "4" }].map((step, i) => (
                <div key={step.q} style={{ flex: 1, textAlign: "center", position: "relative", padding: "0 16px" }}>
                  {i > 0 && <div style={{ position: "absolute", top: 16, left: 0, right: "50%", height: 1, background: "var(--border)" }} />}
                  {i < 3 && <div style={{ position: "absolute", top: 16, left: "50%", right: 0, height: 1, background: "var(--border)" }} />}
                  <div style={{ width: 32, height: 32, borderRadius: "50%", border: `2px solid ${step.done ? "var(--success)" : "var(--accent)"}`, background: step.done ? "var(--success)" : "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: step.done ? "white" : "var(--accent)", margin: "0 auto 12px", position: "relative", zIndex: 1 }}>{step.done ? "✓" : step.n}</div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{step.q}</h4>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>{step.t}<br />{step.s}</p>
                </div>
              ))}
            </div>
            <SlideNum n={7} />
          </div>

          {/* 8: Team */}
          <div className="pres-slide reveal" style={{ alignItems: "center" }}>
            <SlideLabel>Team</SlideLabel>
            <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 24 }}>The people behind it.</h2>
            <div style={{ display: "flex", justifyContent: "center", gap: 48 }}>
              {[{ name: "Ana Souza", role: "CEO & Design", bg: "Ex-Stripe, RISD" }, { name: "Marcus Chen", role: "CTO", bg: "Ex-Google, MIT" }, { name: "Julia Park", role: "Head of Product", bg: "Ex-Linear, Stanford" }].map((p) => (
                <div key={p.name} style={{ textAlign: "center" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-glow)", border: "1px solid var(--border)", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.role}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{p.bg}</div>
                </div>
              ))}
            </div>
            <SlideNum n={8} />
          </div>

          {/* 9: Pricing */}
          <div className="pres-slide reveal" style={{ alignItems: "center" }}>
            <SlideLabel>Pricing</SlideLabel>
            <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 24 }}>Simple pricing. No surprises.</h2>
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              {[{ tier: "Starter", price: "$0", features: "Up to 5 users\n10GB storage\nBasic integrations", featured: false }, { tier: "Pro", price: "$12", features: "Unlimited users\n100GB storage\nAll integrations", featured: true }, { tier: "Enterprise", price: "Custom", features: "SSO & SAML\nDedicated support\nSLA guarantee", featured: false }].map((p) => (
                <div key={p.tier} style={{ flex: 1, maxWidth: 220, background: "var(--bg)", border: p.featured ? "2px solid var(--accent)" : "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", padding: 24, textAlign: "center" }}>
                  <div style={{ fontSize: 14, color: p.featured ? "var(--accent)" : "var(--text-muted)", marginBottom: 8, fontWeight: p.featured ? 500 : 400 }}>{p.tier}</div>
                  <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em" }}>{p.price}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>{p.price !== "Custom" ? "per user/month" : "\u00A0"}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, whiteSpace: "pre-line" }}>{p.features}</div>
                </div>
              ))}
            </div>
            <SlideNum n={9} />
          </div>

          {/* 10: CTA */}
          <div className="pres-slide reveal" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <SlideLabel>Closing</SlideLabel>
            <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }} />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(44px, 5vw, 72px)", fontWeight: 400, letterSpacing: "-0.03em", position: "relative" }}>Ready to go <em style={{ fontStyle: "italic", color: "var(--accent)" }}>async?</em></h2>
            <p style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300, marginTop: 12, position: "relative" }}>Let&rsquo;s build the future of work together.</p>
            <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 24, padding: "12px 28px", borderRadius: "var(--radius-sm, 8px)", background: "var(--accent)", color: "var(--accent-contrast, white)", fontSize: 14, fontWeight: 500, textDecoration: "none", position: "relative", transition: "all .3s cubic-bezier(0.22,1,0.36,1)" }}>Schedule a demo</a>
            <SlideNum n={10} />
          </div>
        </div>
      </section>
    </div>
  );
}
