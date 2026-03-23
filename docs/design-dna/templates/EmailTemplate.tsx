// Copy this file into your app and customize
// Visual reference: docs/design-dna/email.html
// 8 transactional email templates — zero external dependencies

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

const dnaStyles = `
.reveal{opacity:0;transform:translateY(32px) scale(0.98);filter:blur(4px);transition:all .9s cubic-bezier(0.22,1,0.36,1)}
.reveal.visible{opacity:1;transform:none;filter:none}
.reveal-delay-1{transition-delay:.1s}.reveal-delay-2{transition-delay:.2s}
@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;filter:none;transition:none}}
`;

// ── Shared email components ─────────────────────────────────
function Frame({ title, from, subject, children }: { title?: string; from: string; subject: string; children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", overflow: "hidden" }}>
      <div style={{ padding: "8px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
        <span style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", fontSize: 11, color: "var(--text-muted)" }}>{title || "Inbox"}</span>
      </div>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)" }}>
        <div style={{ marginBottom: 4 }}><strong style={{ color: "var(--text-secondary)", fontWeight: 500 }}>From:</strong> {from}</div>
        <div><strong style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Subject:</strong> {subject}</div>
      </div>
      <div style={{ background: "var(--bg)" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 32px" }}>{children}</div>
      </div>
    </div>
  );
}
function Logo() { return <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 32, color: "var(--text)" }}>Your<span style={{ color: "var(--accent)" }}>App</span></div>; }
function Btn({ children, ghost }: { children: React.ReactNode; ghost?: boolean }) {
  return <a href="#" style={{ display: "inline-block", padding: "12px 28px", borderRadius: "var(--radius-sm, 8px)", fontSize: 14, fontWeight: 500, marginBottom: 16, marginRight: 8, textDecoration: "none", ...(ghost ? { background: "none", border: "1px solid var(--border)", color: "var(--text)" } : { background: "var(--accent)", color: "white" }) }}>{children}</a>;
}
function Foot() {
  return <div style={{ fontSize: 12, lineHeight: 1.6, marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}>You're receiving this because you signed up at yourapp.com.<br /><a href="#" style={{ color: "var(--text-muted)", textDecoration: "underline" }}>Unsubscribe</a> · <a href="#" style={{ color: "var(--text-muted)", textDecoration: "underline" }}>Help Center</a></div>;
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
function Step({ icon, title, desc, color }: { icon: string; title: string; desc: string; color: string }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: 16, borderRadius: "var(--radius-sm, 8px)", border: "1px solid var(--border)", background: "var(--bg-elevated)", marginBottom: 8 }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points={icon} /></svg>
      </div>
      <p style={{ fontSize: 14, color: "var(--text-secondary)" }}><strong style={{ color: "var(--text)" }}>{title}</strong> — {desc}</p>
    </div>
  );
}

export default function EmailTemplate() {
  useReveal();
  return (
    <div style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <style>{dnaStyles}</style>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: "140px 32px 100px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>Email Templates</div>
          <h1 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 7vw, 80px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1 }}>
            Emails people<br />actually <em style={{ fontStyle: "italic", color: "var(--accent)" }}>open.</em>
          </h1>
          <p className="reveal reveal-delay-2" style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300, maxWidth: 480, margin: "20px auto 0" }}>Welcome, verification, receipts, shipping, alerts, password reset, invitations. 8 transactional templates.</p>
        </div>
      </section>

      {/* ═══ EMAILS ═══ */}
      <section style={{ padding: "0 32px 100px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 80 }}>

          {/* 01 — Welcome */}
          <div className="reveal"><SH num="01" title="Welcome email." sub="First impression in the inbox." />
            <Frame from="YourApp <hello@yourapp.com>" subject="Welcome to YourApp — let's get started">
              <Logo /><h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 12, color: "var(--text)" }}>Welcome aboard, Ana.</h1>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: 24 }}>You just joined 12,000+ teams who ship better products with less effort. Here's how to make the most of your first week:</p>
              <Step icon="20 6 9 17 4 12" title="Set up your workspace" desc="Create your first project and invite your team." color="rgba(59,130,246,0.15)" />
              <Step icon="20 6 9 17 4 12" title="Connect your tools" desc="Integrate with GitHub, Slack, and Figma in one click." color="rgba(34,197,94,0.15)" />
              <Step icon="20 6 9 17 4 12" title="Book a walkthrough" desc="15 minutes with our team. We'll show you the shortcuts." color="rgba(234,179,8,0.15)" />
              <div style={{ marginTop: 16 }}><Btn>Go to your dashboard</Btn></div>
              <Foot />
            </Frame>
          </div>

          {/* 02 — Verification */}
          <div className="reveal"><SH num="02" title="Verification code." sub="Clear, scannable, one action." />
            <Frame from="YourApp <security@yourapp.com>" subject="Your verification code: 847291">
              <Logo /><h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12, color: "var(--text)" }}>Verify your email.</h1>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: 24 }}>Enter this code to verify your email address. It expires in 10 minutes.</p>
              <div style={{ textAlign: "center", padding: "24px 0", marginBottom: 24, background: "var(--bg-elevated)", borderRadius: "var(--radius-sm, 8px)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "0.15em", fontFamily: "var(--font-mono)", color: "var(--text)" }}>847 291</div>
              </div>
              <Foot />
            </Frame>
          </div>

          {/* 03 — Order Confirmation */}
          <div className="reveal"><SH num="03" title="Order receipt." sub="Clean. Itemized. Trustworthy." />
            <Frame from="YourApp <orders@yourapp.com>" subject="Order confirmed — #YA-2026-1847">
              <Logo /><h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12, color: "var(--text)" }}>Order confirmed.</h1>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 24 }}>Thanks for your order, Ana. Here's your receipt:</p>
              {[{ name: "Design Systems Pro", qty: 1, price: "$199" }, { name: "Component Library", qty: 1, price: "$49" }].map((item) => (
                <div key={item.name} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)", fontSize: 14 }}>
                  <span style={{ color: "var(--text)" }}>{item.name} × {item.qty}</span>
                  <span style={{ fontWeight: 600 }}>{item.price}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", fontSize: 16, fontWeight: 700 }}><span>Total</span><span>$248.00</span></div>
              <Foot />
            </Frame>
          </div>

          {/* 04 — Shipping */}
          <div className="reveal"><SH num="04" title="Shipping update." sub="Progress tracking built in." />
            <Frame from="YourApp <shipping@yourapp.com>" subject="Your order has shipped!">
              <Logo /><h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12, color: "var(--text)" }}>Your order is on the way.</h1>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 24 }}>Tracking: YA-2026-1847-SHIP</p>
              <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
                {["Ordered", "Packed", "Shipped", "Delivered"].map((step, i) => (
                  <React.Fragment key={step}>
                    {i > 0 && <div style={{ flex: 1, height: 2, background: i <= 2 ? "var(--success)" : "var(--border)" }} />}
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: i <= 2 ? (i < 2 ? "var(--success)" : "var(--accent)") : "var(--bg-surface)", border: `2px solid ${i <= 2 ? (i < 2 ? "var(--success)" : "var(--accent)") : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", fontSize: 10, fontWeight: 700, color: i <= 2 ? "white" : "var(--text-muted)" }}>{i < 2 ? "✓" : i + 1}</div>
                      <div style={{ fontSize: 10, color: i <= 2 ? "var(--text)" : "var(--text-muted)" }}>{step}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <Btn>Track package</Btn>
              <Foot />
            </Frame>
          </div>

          {/* 05 — Password Reset */}
          <div className="reveal"><SH num="05" title="Password reset." sub="Security-first. Clear urgency." />
            <Frame from="YourApp <security@yourapp.com>" subject="Reset your password">
              <Logo /><h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12, color: "var(--text)" }}>Reset your password.</h1>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: 24 }}>We received a request to reset your password. Click below to choose a new one. This link expires in 1 hour.</p>
              <Btn>Reset password</Btn>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>If you didn't request this, you can safely ignore this email.</p>
              <Foot />
            </Frame>
          </div>

          {/* 06 — Team Invitation */}
          <div className="reveal"><SH num="06" title="Team invite." sub="Personal. Warm. Actionable." />
            <Frame from="YourApp <teams@yourapp.com>" subject="Ana Souza invited you to Forma">
              <Logo />
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--accent-glow)", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>AS</div>
                <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>Join the Forma team.</h1>
                <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>Ana Souza invited you to collaborate on Forma.</p>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8 }}><Btn>Accept invite</Btn><Btn ghost>Decline</Btn></div>
              <Foot />
            </Frame>
          </div>

          {/* 07 — Payment Failed */}
          <div className="reveal"><SH num="07" title="Payment failed." sub="Alert without alarm." />
            <Frame from="YourApp <billing@yourapp.com>" subject="Action needed: payment failed">
              <Logo />
              <div style={{ padding: 20, borderRadius: "var(--radius-sm, 8px)", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", marginBottom: 24, textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>⚠️</div>
                <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6, color: "var(--destructive)" }}>Payment failed.</h1>
                <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>We couldn't process your payment for the Pro plan ($29/mo).</p>
              </div>
              <Btn>Update payment method</Btn>
              <Foot />
            </Frame>
          </div>

          {/* 08 — Weekly Digest */}
          <div className="reveal"><SH num="08" title="Weekly digest." sub="Summary. Not noise." />
            <Frame from="YourApp <digest@yourapp.com>" subject="Your week at Forma — Mar 17-23">
              <Logo /><h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: "var(--text)" }}>Your week in review.</h1>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                {[{ v: "14", l: "Tasks done" }, { v: "+23%", l: "Velocity" }, { v: "3", l: "PRs merged" }].map((s) => (
                  <div key={s.l} style={{ textAlign: "center", padding: 16, background: "var(--bg-elevated)", borderRadius: "var(--radius-sm, 8px)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <Btn>View full report</Btn>
              <Foot />
            </Frame>
          </div>

        </div>
      </section>
    </div>
  );
}
