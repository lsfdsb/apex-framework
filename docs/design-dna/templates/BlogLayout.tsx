// Copy this file into your app and customize
// DNA palette: light bg=#faf9f6, dark bg=#0f0d0b, accent=#e07850 (dark)/#c45d3e (light)
// Fonts: Newsreader (body), Instrument Serif (display), Inter (sans labels)

import React, { useEffect } from "react";
import { DnaBackground } from "../starters/patterns/DnaBackground";

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

const dnaStyles = `
.reveal{opacity:0;transform:translateY(32px) scale(0.98);filter:blur(4px);transition:all .9s cubic-bezier(0.22,1,0.36,1)}
.reveal.visible{opacity:1;transform:none;filter:none}
.reveal-delay-1{transition-delay:.1s}.reveal-delay-2{transition-delay:.2s}.reveal-delay-3{transition-delay:.3s}
.article-card{border-radius:var(--radius,12px);overflow:hidden;transition:all .4s cubic-bezier(0.22,1,0.36,1);cursor:pointer;text-decoration:none;color:var(--text)}
.article-card:hover{transform:translateY(-4px)}
.article-card:hover .article-card-img{background:var(--bg-elevated)}
@media(max-width:768px){.featured-grid{grid-template-columns:1fr!important;gap:32px!important}
  .article-grid{grid-template-columns:1fr!important}.newsletter-form{flex-direction:column!important}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}.reveal{opacity:1;transform:none;filter:none}}
`;

const articles = [
  { cat: "Design", title: "Why every pixel matters more than you think.", desc: "The difference between good and great is in the details nobody notices consciously.", author: "Ana Souza", initials: "AS", date: "Mar 18 · 5 min" },
  { cat: "Engineering", title: "Ship less, ship better.", desc: "The courage to delete features is the hardest skill in product development.", author: "Marcus Chen", initials: "MC", date: "Mar 17 · 6 min" },
  { cat: "Philosophy", title: "Simplicity is not the absence of complexity.", desc: "It's the result of understanding it deeply enough to remove what doesn't serve the user.", author: "Julia Park", initials: "JP", date: "Mar 16 · 4 min" },
];

function Author({ initials, name, date }: { initials: string; name: string; date: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent-glow)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>{initials}</div>
      <div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500 }}>{name}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text-muted)" }}>{date}</div>
      </div>
    </div>
  );
}

export default function BlogLayout() {
  useReveal();
  return (
    <div style={{ color: "var(--text)", fontFamily: "var(--font-body)", position: "relative" }}>
      <DnaBackground pattern="dots" animated="particles" />
      <style>{dnaStyles}</style>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: "140px 32px 100px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ fontFamily: "var(--font-sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>Blog + Editorial</div>
          <h1 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 7vw, 80px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1 }}>
            Words that<br /><em style={{ fontStyle: "italic", color: "var(--accent)" }}>breathe.</em>
          </h1>
          <p className="reveal reveal-delay-2" style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300, fontFamily: "var(--font-sans)", maxWidth: 440, margin: "20px auto 0" }}>Typography-first reading experience. Every word has room.</p>
        </div>
      </section>

      {/* ═══ FEATURED ARTICLE ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="featured-grid reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", marginBottom: 80 }}>
            <div style={{ aspectRatio: "4/3", background: "var(--bg-surface)", borderRadius: "var(--radius, 12px)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 40%, var(--accent-glow) 0%, transparent 50%)" }} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text-muted)", position: "relative" }}>Cover image</span>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: 500, marginBottom: 12 }}>Featured</div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 16 }}>The invisible rules that make design feel intentional.</h1>
              <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24 }}>Design systems aren&rsquo;t about consistency for its own sake. They&rsquo;re about building trust through predictability — and then knowing exactly when to break the pattern.</p>
              <Author initials="B" name="Bueno" date="March 19, 2026 · 8 min read" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ARTICLE GRID ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1 }}>Latest stories.</h2>
          </div>
          <div className="article-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {articles.map((a, i) => (
              <div key={a.title} className={`article-card reveal${i > 0 ? ` reveal-delay-${i}` : ""}`}>
                <div className="article-card-img" style={{ aspectRatio: "3/2", background: "var(--bg-surface)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--text-muted)" }}>Image</span>
                </div>
                <div style={{ padding: "20px 0" }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: 500, marginBottom: 8 }}>{a.cat}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: 8 }}>{a.title}</h3>
                  <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6 }}>{a.desc}</p>
                  <div style={{ marginTop: 16 }}><Author initials={a.initials} name={a.author} date={a.date} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ READING EXPERIENCE ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>The reading experience.</h2>
            <p style={{ fontSize: 17, color: "var(--text-secondary)", fontWeight: 300, fontFamily: "var(--font-sans)" }}>Typography that respects your attention.</p>
          </div>
          <div className="reveal reveal-delay-1" style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>Design · 8 min read</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>The invisible rules that make design feel intentional.</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
              <Author initials="B" name="Bueno" date="March 19, 2026" />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--text-muted)" }}>8 min read</span>
            </div>
            <div style={{ fontSize: 18, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              <p style={{ marginBottom: 24 }}>There&rsquo;s a reason certain interfaces feel right the moment you see them. It&rsquo;s not the colors, the fonts, or the animations — it&rsquo;s the system behind them. The invisible rules.</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, color: "var(--text)", margin: "48px 0 16px", letterSpacing: "-0.02em" }}>Space is not empty</h2>
              <p style={{ marginBottom: 24 }}>Whitespace is the most misunderstood element in design. Stakeholders see it as waste — &ldquo;can&rsquo;t we put something there?&rdquo; But whitespace is what gives every other element room to be noticed. It&rsquo;s the silence between notes that makes music.</p>
              <blockquote style={{ borderLeft: "3px solid var(--accent)", padding: "4px 0 4px 24px", margin: "32px 0", fontStyle: "italic", fontSize: 20, color: "var(--text)", lineHeight: 1.6 }}>Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.</blockquote>
              <p style={{ marginBottom: 24 }}>This is the foundational insight. Every element on a page creates cognitive load. Every color, every border, every shadow demands a fraction of attention. The designer&rsquo;s job is to ruthlessly minimize that load while maximizing clarity.</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, color: "var(--text)", margin: "48px 0 16px", letterSpacing: "-0.02em" }}>Typography as design</h2>
              <p style={{ marginBottom: 24 }}>When the type is right, you don&rsquo;t need decoration. A 56px serif headline with <code style={{ fontFamily: "var(--font-mono)", fontSize: 14, background: "var(--bg-surface)", padding: "2px 6px", borderRadius: 4 }}>letter-spacing: -0.03em</code> and <code style={{ fontFamily: "var(--font-mono)", fontSize: 14, background: "var(--bg-surface)", padding: "2px 6px", borderRadius: 4 }}>line-height: 1.1</code> creates more visual impact than any gradient or illustration.</p>
              <pre style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", padding: 20, margin: "24px 0", overflowX: "auto" }}>
                <code style={{ background: "none", padding: 0, fontSize: 14, lineHeight: 1.6, fontFamily: "var(--font-mono)" }}>{`.headline {
  font-family: 'Instrument Serif', Georgia;
  font-size: clamp(36px, 5vw, 56px);
  letter-spacing: -0.03em;
  line-height: 1.1;
}`}</code>
              </pre>
              <p style={{ marginBottom: 24 }}>The font IS the design. When you get typography right, everything else falls into place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", padding: 48 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 8 }}>Stay in the loop.</h3>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>One email per week. No spam. Unsubscribe anytime.</p>
            <div className="newsletter-form" style={{ display: "flex", gap: 8 }}>
              <input type="email" placeholder="your@email.com" style={{ flex: 1, padding: "11px 16px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", color: "var(--text)", fontSize: 14, fontFamily: "var(--font-sans)", outline: "none" }} />
              <button style={{ padding: "11px 24px", background: "var(--accent)", color: "var(--accent-contrast, white)", border: "none", borderRadius: "var(--radius-sm, 8px)", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all .3s cubic-bezier(0.22,1,0.36,1)" }}>Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
