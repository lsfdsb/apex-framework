// DNA source: docs/design-dna/email.html — bg=#08080a, elevated=#111114, accent=#636bf0
import React, { useEffect, useRef } from "react";
import { SectionHeader } from "../starters/primitives";

// Reveal: matches HTML pattern — IntersectionObserver adds .visible class
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return ref;
}

const revealStyles = `.reveal{opacity:0;transform:translateY(32px) scale(0.98);filter:blur(4px);transition:all 0.9s cubic-bezier(0.22,1,0.36,1)}.reveal.visible{opacity:1;transform:none;filter:none}.reveal-delay-1{transition-delay:0.1s}.reveal-delay-2{transition-delay:0.2s}@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;filter:none;transition:none}}`;

function EmailFrame({ subject, from, children }: { subject: string; from: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius)] border overflow-hidden mx-auto" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", maxWidth: 640 }}>
      <div className="px-4 py-2.5 border-b flex items-center gap-2 relative" style={{ borderColor: "var(--border)" }}>
        {["#ff5f57","#febc2e","#28c840"].map(c => <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} aria-hidden="true" />)}
        <span className="absolute left-1/2 -translate-x-1/2 text-[11px]" style={{ color: "var(--text-muted)" }}>Inbox</span>
      </div>
      <div className="px-6 py-4 border-b text-[12px]" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
        <div className="mb-1"><strong style={{ color: "var(--text-secondary)", fontWeight: 500 }}>From: </strong>{from}</div>
        <div><strong style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Subject: </strong>{subject}</div>
      </div>
      <div style={{ background: "var(--bg)" }}><div className="mx-auto" style={{ maxWidth: 560, padding: "40px 32px" }}>{children}</div></div>
    </div>
  );
}

const Logo = () => <div className="text-[16px] font-semibold tracking-tight mb-8" style={{ color: "var(--text)" }}>Your<span style={{ color: "var(--accent)" }}>App</span></div>;
const Divider = () => <div className="my-6" style={{ height: 1, background: "var(--border)" }} aria-hidden="true" />;
const Btn = ({ href, children, ghost }: { href: string; children: React.ReactNode; ghost?: boolean }) => (
  <a href={href} className="inline-block px-7 py-3 rounded-[var(--radius-sm)] text-[14px] font-medium mb-4 mr-2 hover:opacity-90 transition-opacity"
    style={ghost ? { background: "none", border: "1px solid var(--border)", color: "var(--text)", textDecoration: "none" } : { background: "var(--accent)", color: "#fff", textDecoration: "none" }}>{children}</a>
);
const Footer = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[12px] leading-relaxed mt-8 pt-6 border-t" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
    {children}<p className="mt-1"><a href="#" style={{ color: "var(--text-muted)" }} className="underline">Unsubscribe</a>{" · "}<a href="#" style={{ color: "var(--text-muted)" }} className="underline">Help Center</a></p>
  </div>
);
const NotifCard = ({ bg, stroke, title, desc }: { bg: string; stroke: string; title: string; desc: string }) => (
  <div className="flex gap-3 items-start p-4 rounded-[var(--radius-sm)] border mb-2" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
    </div>
    <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}><strong style={{ color: "var(--text)" }}>{title}</strong> — {desc}</p>
  </div>
);

function WelcomeEmail() {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal">
      <SectionHeader label="01" title="Welcome email." subtitle="First impression in the inbox." align="center" />
      <EmailFrame subject="Welcome to YourApp — let's get started" from="YourApp <hello@yourapp.com>">
        <Logo /><h1 className="text-[24px] font-semibold tracking-tight mb-3 leading-snug" style={{ color: "var(--text)" }}>Welcome aboard, Ana.</h1>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>You just joined 12,000+ teams who ship better products with less effort. Here's how to make the most of your first week:</p>
        <NotifCard bg="rgba(99,107,240,0.1)" stroke="var(--accent)" title="Set up your workspace" desc="Create your first project and invite your team." />
        <NotifCard bg="rgba(52,211,153,0.1)" stroke="var(--success)" title="Connect your tools" desc="Integrate with GitHub, Slack, and Figma in one click." />
        <NotifCard bg="rgba(251,191,36,0.1)" stroke="var(--warning)" title="Book a walkthrough" desc="15 minutes with our team. We'll show you the shortcuts." />
        <Btn href="#">Go to your dashboard</Btn>
        <Footer><p>You're receiving this because you signed up at yourapp.com.</p></Footer>
      </EmailFrame>
    </div>
  );
}

function VerificationEmail() {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal">
      <SectionHeader label="02" title="Verification code." subtitle="Clear, scannable, one action." align="center" />
      <EmailFrame subject="Your verification code: 847291" from="YourApp <security@yourapp.com>">
        <Logo /><h1 className="text-[24px] font-semibold tracking-tight mb-3" style={{ color: "var(--text)" }}>Verify your email.</h1>
        <p className="text-[15px] leading-[1.7] mb-6" style={{ color: "var(--text-secondary)" }}>Enter this code to confirm your email address. It expires in 10 minutes.</p>
        <div className="inline-block text-[32px] font-bold tracking-[0.15em] rounded-[var(--radius-sm)] px-8 py-4 mb-6 border"
          style={{ fontFamily: "'JetBrains Mono',monospace", background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text)" }} aria-label="Verification code: 847291">847 291</div>
        <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>If you didn't request this, you can safely ignore this email.</p>
        <Footer><p>© 2026 YourApp Inc.</p></Footer>
      </EmailFrame>
    </div>
  );
}

function OrderEmail() {
  const ref = useReveal();
  const items = [{ name: "Midnight Ceramic Vase", variant: "Size M · Matte Black · Qty: 1", price: "$89.00" }, { name: "Linen Throw Blanket", variant: "Natural · King · Qty: 2", price: "$124.00" }];
  return (
    <div ref={ref} className="reveal">
      <SectionHeader label="03" title="Order receipt." subtitle="Every detail, clearly structured." align="center" />
      <EmailFrame subject="Order confirmed — #ORD-2026-1847" from="YourApp Store <orders@yourapp.com>">
        <Logo />
        <div className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full mb-4" style={{ background: "rgba(52,211,153,0.1)", color: "var(--success)" }}>✓ Order confirmed</div>
        <h1 className="text-[24px] font-semibold tracking-tight mb-3" style={{ color: "var(--text)" }}>Order confirmed.</h1>
        <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>Thanks for your purchase, Ana. Here's what you ordered:</p>
        {items.map(item => (
          <div key={item.name} className="flex items-center gap-4 py-3.5 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
            <div className="w-14 h-14 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0 text-[10px]" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>IMG</div>
            <div className="flex-1"><p className="text-[14px] font-medium" style={{ color: "var(--text)" }}>{item.name}</p><p className="text-[12px]" style={{ color: "var(--text-muted)" }}>{item.variant}</p></div>
            <p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>{item.price}</p>
          </div>
        ))}
        <Divider />
        <div className="flex justify-between text-[13px] mb-1.5" style={{ color: "var(--text-muted)" }}><span>Subtotal</span><span>$213.00</span></div>
        <div className="flex justify-between text-[13px] mb-3" style={{ color: "var(--success)" }}><span>Discount</span><span>-$21.30</span></div>
        <div className="flex justify-between pt-3 text-[16px] font-semibold border-t" style={{ borderColor: "var(--border)", color: "var(--text)" }}><span>Total</span><span>$191.70</span></div>
        <div className="mt-4"><Btn href="#">Track your order</Btn></div>
        <p className="text-[12px] mb-4" style={{ color: "var(--text-muted)" }}>Order #ORD-2026-1847 · Paid with Visa ····4242</p>
        <Footer><p>Questions? Reply to this email or visit our Help Center.</p></Footer>
      </EmailFrame>
    </div>
  );
}

function ShippingEmail() {
  const ref = useReveal();
  const steps = [{ label: "Ordered", done: true }, { label: "Packed", done: true }, { label: "Shipped", current: true }, { label: "Delivered" }];
  return (
    <div ref={ref} className="reveal">
      <SectionHeader label="04" title="Shipping update." subtitle="Progress visualization. Where is my package?" align="center" />
      <EmailFrame subject="Your order is on the way!" from="YourApp Store <shipping@yourapp.com>">
        <Logo /><h1 className="text-[24px] font-semibold tracking-tight mb-3" style={{ color: "var(--text)" }}>Your order shipped.</h1>
        <p className="text-[15px] mb-5" style={{ color: "var(--text-secondary)" }}>Estimated delivery: <strong style={{ color: "var(--text)" }}>March 22, 2026</strong></p>
        <div className="flex my-5">
          {steps.map(({ label, done, current }, i) => (
            <div key={label} className="flex-1 text-center relative">
              <div className="absolute h-0.5" style={{ background: done ? "var(--success)" : "var(--border)", top: 14, left: i === 0 ? "50%" : 0, right: i === steps.length - 1 ? "50%" : 0 }} />
              <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-semibold mx-auto mb-2 relative z-10"
                style={done ? { borderColor: "var(--success)", background: "var(--success)", color: "#fff" } : current ? { borderColor: "var(--accent)", background: "var(--bg)", color: "var(--accent)" } : { borderColor: "var(--border)", background: "var(--bg)", color: "var(--text-muted)" }}>
                {done ? "✓" : i + 1}
              </div>
              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{label}</div>
            </div>
          ))}
        </div>
        <Divider />
        <p className="text-[12px] mb-3" style={{ color: "var(--text-muted)" }}>Tracking: <span style={{ fontFamily: "monospace" }}>BR1234567890</span></p>
        <Btn href="#">Track package</Btn>
        <Footer><p>© 2026 YourApp Store.</p></Footer>
      </EmailFrame>
    </div>
  );
}

function PasswordResetEmail() {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal">
      <SectionHeader label="05" title="Password reset." subtitle="Urgent but calm. Clear action." align="center" />
      <EmailFrame subject="Reset your password" from="YourApp <security@yourapp.com>">
        <div className="text-center">
          <Logo />
          <div className="w-12 h-12 rounded-[12px] flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(248,113,113,0.1)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--destructive)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
          </div>
          <h1 className="text-[24px] font-semibold tracking-tight mb-3" style={{ color: "var(--text)" }}>Reset your password.</h1>
          <p className="text-[15px] leading-[1.7] mb-6 mx-auto" style={{ color: "var(--text-secondary)", maxWidth: 380 }}>Click the button below to set a new password. This link expires in 1 hour.</p>
          <Btn href="#">Reset password</Btn>
          <p className="text-[13px] mt-2" style={{ color: "var(--text-muted)" }}>If you didn't request this, your account is safe. No action needed.</p>
          <Footer><p>© 2026 YourApp Inc.</p></Footer>
        </div>
      </EmailFrame>
    </div>
  );
}

function TeamInvitationEmail() {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal">
      <SectionHeader label="06" title="Team invitation." subtitle="Personal touch. Who invited, why it matters." align="center" />
      <EmailFrame subject="Ana invited you to join Acme on YourApp" from="YourApp <team@yourapp.com>">
        <div className="text-center">
          <Logo />
          <div className="w-12 h-12 rounded-full border flex items-center justify-center mx-auto mb-4 text-[16px] font-semibold" style={{ background: "var(--accent-glow)", borderColor: "var(--border)", color: "var(--accent)" }}>AS</div>
          <h1 className="text-[24px] font-semibold tracking-tight mb-3" style={{ color: "var(--text)" }}>You're invited.</h1>
          <p className="text-[15px] leading-[1.7] mb-6 mx-auto" style={{ color: "var(--text-secondary)", maxWidth: 400 }}><strong style={{ color: "var(--text)" }}>Ana Souza</strong> invited you to join the <strong style={{ color: "var(--text)" }}>Acme</strong> team. Accept to start collaborating.</p>
          <Btn href="#">Accept invitation</Btn><Btn href="#" ghost>Decline</Btn>
          <Footer><p>This invitation expires in 7 days. © 2026 YourApp Inc.</p></Footer>
        </div>
      </EmailFrame>
    </div>
  );
}

function PaymentFailedEmail() {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal">
      <SectionHeader label="07" title="Payment failed." subtitle="Urgent without panic. Clear next step." align="center" />
      <EmailFrame subject="Action needed: payment failed for your Pro plan" from="YourApp <billing@yourapp.com>">
        <Logo />
        <div className="flex gap-3 items-center p-4 rounded-[var(--radius-sm)] border mb-5" style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.15)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(248,113,113,0.1)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--destructive)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
          <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>Your payment of <strong style={{ color: "var(--text)" }}>$29.00</strong> for the Pro plan failed. We'll retry in 3 days.</p>
        </div>
        <p className="text-[15px] leading-[1.7] mb-5" style={{ color: "var(--text-secondary)" }}>This usually happens when a card expires or has insufficient funds. Update your payment method to keep your account active.</p>
        <Btn href="#">Update payment method</Btn>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>Your account will remain active for 7 days. After that, you'll be downgraded to the free plan.</p>
        <Footer><p>Need help? Reply to this email or visit billing settings.</p></Footer>
      </EmailFrame>
    </div>
  );
}

function WeeklyDigestEmail() {
  const ref = useReveal();
  const stats = [{ value: "14", label: "Tasks done", color: "var(--text)" }, { value: "+23%", label: "Velocity", color: "var(--success)" }, { value: "3", label: "PRs merged", color: "var(--text)" }];
  return (
    <div ref={ref} className="reveal">
      <SectionHeader label="08" title="Weekly digest." subtitle="Summary that respects time. Scannable, actionable." align="center" />
      <EmailFrame subject="Your week at YourApp — Mar 13-19, 2026" from="YourApp <digest@yourapp.com>">
        <Logo /><h1 className="text-[24px] font-semibold tracking-tight mb-3" style={{ color: "var(--text)" }}>Your week in review.</h1>
        <p className="text-[15px] leading-[1.7] mb-5" style={{ color: "var(--text-secondary)" }}>Here's what happened on your team this week:</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map(({ value, label, color }) => (
            <div key={label} className="rounded-[var(--radius-sm)] border p-4 text-center" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
              <div className="text-[28px] font-bold tracking-tight" style={{ color }}>{value}</div>
              <div className="text-[11px] uppercase tracking-wide mt-1" style={{ color: "var(--text-muted)" }}>{label}</div>
            </div>
          ))}
        </div>
        <p className="text-[18px] font-semibold tracking-tight mb-3" style={{ color: "var(--text)" }}>Highlights</p>
        <NotifCard bg="rgba(52,211,153,0.1)" stroke="var(--success)" title="Dashboard v2 shipped" desc="Marcus deployed the new analytics dashboard to production." />
        <NotifCard bg="rgba(99,107,240,0.1)" stroke="var(--accent)" title="2 new team members" desc="Julia and David joined the engineering team." />
        <NotifCard bg="rgba(251,191,36,0.1)" stroke="var(--warning)" title="3 tasks overdue" desc="Review the backlog and reassign if needed." />
        <div className="mt-4"><Btn href="#">View full report</Btn></div>
        <Footer><p>Sent every Monday at 9:00 AM.</p></Footer>
      </EmailFrame>
    </div>
  );
}

export default function EmailTemplate() {
  return (
    <>
      <style>{revealStyles}</style>
      <div className="min-h-screen px-4 apex-enter" style={{ color: "var(--text)" }}>
        <section className="text-center" style={{ paddingTop: 140, paddingBottom: 40 }}>
          <div className="mx-auto" style={{ maxWidth: 1200 }}>
            <p className="apex-label mb-4 reveal" style={{ color: "var(--accent)" }}>Email Templates</p>
            <h1 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px,7vw,80px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1 }}>
              Emails people<br />actually <em style={{ fontStyle: "italic", color: "var(--accent)" }}>open.</em>
            </h1>
            <p className="reveal reveal-delay-2 mx-auto mt-5" style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300, maxWidth: 480 }}>
              Welcome, verification, receipts, shipping, alerts, password reset, invitations. 8 transactional templates.
            </p>
          </div>
        </section>
        <div className="mx-auto flex flex-col gap-20 pb-20" style={{ maxWidth: 720 }}>
          <WelcomeEmail /><VerificationEmail /><OrderEmail /><ShippingEmail />
          <PasswordResetEmail /><TeamInvitationEmail /><PaymentFailedEmail /><WeeklyDigestEmail />
        </div>
      </div>
    </>
  );
}
