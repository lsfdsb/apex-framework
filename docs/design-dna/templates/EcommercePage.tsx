// Copy this file into your app and customize
// Visual reference: docs/design-dna/ecommerce.html
// DNA palette: bg=#08080a, accent=#636bf0, Instrument Serif display font

"use client";

import React, { useState, useEffect, useRef } from "react";
import { DnaBackground } from "../starters/patterns/DnaBackground";
// No external layout imports — showcase pages are self-contained

// ── useReveal hook ─────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── Types ─────────────────────────────────────────────────────
interface Product { id: string; name: string; brand: string; price: string; originalPrice?: string; badge?: string; badgeType?: "new" | "sale"; rating: number; reviews: number; }

const PRODUCTS: Product[] = [
  { id: "p1", name: "Midnight Ceramic Vase", brand: "Home · Decor", price: "$89", badge: "New", badgeType: "new", rating: 5, reviews: 214 },
  { id: "p2", name: "Walnut Desk Lamp", brand: "Lighting", price: "$145", rating: 5, reviews: 892 },
  { id: "p3", name: "Linen Throw Blanket", brand: "Textiles", price: "$62", originalPrice: "$89", badge: "-30%", badgeType: "sale", rating: 4, reviews: 156 },
  { id: "p4", name: "Copper Pour-Over Set", brand: "Kitchen", price: "$124", rating: 4, reviews: 331 },
  { id: "p5", name: "Mechanical Keyboard Pro", brand: "Electronics", price: "$189", originalPrice: "$249", badge: "Sale", badgeType: "sale", rating: 5, reviews: 507 },
  { id: "p6", name: "Focus Timer", brand: "Tools", price: "$59", badge: "New", badgeType: "new", rating: 5, reviews: 48 },
  { id: "p7", name: "Ergonomic Mouse", brand: "Electronics", price: "$89", rating: 4, reviews: 156 },
  { id: "p8", name: "Notebook Set", brand: "Accessories", price: "$19", rating: 4, reviews: 1203 },
];

// ── Sub-components ─────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 12 12" fill={i < rating ? "var(--warning,#fbbf24)" : "var(--border)"}>
          <path d="M6 1l1.5 3 3.5.5-2.5 2.5.6 3.5L6 9 3 10.5l.6-3.5L1 4.5 4.5 4z" />
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  function handleAdd() { setAdded(true); setTimeout(() => setAdded(false), 2000); }
  return (
    <article className="reveal product-card" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius,12px)", overflow: "hidden", transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)", cursor: "pointer" }}>
      <div style={{ aspectRatio: "1", background: "var(--bg-surface)", position: "relative", overflow: "hidden" }}>
        <div className="img-inner" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{product.brand}</span>
        </div>
        {product.badge && (
          <span style={{ position: "absolute", top: 12, left: 12, padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: product.badgeType === "sale" ? "var(--destructive,#f87171)" : "var(--accent)", color: "white" }}>
            {product.badge}
          </span>
        )}
      </div>
      <div style={{ padding: 16 }}>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{product.brand}</p>
        <h3 style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em", marginBottom: 6 }}>{product.name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}><Stars rating={product.rating} /><span style={{ fontSize: 11, color: "var(--text-muted)" }}>({product.reviews})</span></div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>{product.price}</span>
          {product.originalPrice && <span style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "line-through" }}>{product.originalPrice}</span>}
        </div>
      </div>
      <div className="product-actions" style={{ padding: "0 16px 16px", opacity: 0, transform: "translateY(8px)", transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)" }}>
        <button onClick={handleAdd} style={{ width: "100%", padding: "10px", background: added ? "var(--accent)" : "var(--cta-bg,white)", color: added ? "white" : "var(--cta-text,#08080a)", border: "none", borderRadius: "var(--radius-sm,8px)", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>
          {added ? "Added" : "Add to bag"}
        </button>
      </div>
    </article>
  );
}

// ── Checkout Steps ─────────────────────────────────────────────
const STEPS = [{ label: "Bag", state: "done" }, { label: "Shipping", state: "active" }, { label: "Payment", state: "" }];

function CheckoutSteps() {
  return (
    <div className="reveal" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 48 }}>
      {STEPS.map((step, i) => (
        <React.Fragment key={step.label}>
          {i > 0 && <div style={{ width: 40, height: 1, background: STEPS[i - 1].state === "done" ? "var(--success,#34d399)" : "var(--border)" }} />}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", fontSize: 13, color: step.state === "active" ? "var(--text)" : "var(--text-muted)" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${step.state === "done" ? "var(--success,#34d399)" : step.state === "active" ? "var(--accent)" : "var(--border)"}`, background: step.state === "done" ? "var(--success,#34d399)" : step.state === "active" ? "var(--accent)" : "none", color: step.state ? "white" : "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, transition: "all 0.3s" }}>
              {step.state === "done" ? "✓" : i + 1}
            </div>
            {step.label}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────
export default function EcommercePage() {
  const [selectedSize, setSelectedSize] = useState("M");
  useReveal();

  return (
    <>
      <style>{`
        .product-card:hover { border-color: var(--border-hover,#33333a) !important; transform: translateY(-4px); }
        .product-card:hover .img-inner { transform: scale(1.05); }
        .product-card:hover .product-actions { opacity: 1 !important; transform: translateY(0) !important; }
        .reveal { opacity: 0; transform: translateY(32px) scale(0.98); filter: blur(4px); transition: all 0.9s cubic-bezier(0.22,1,0.36,1); }
        .reveal.visible { opacity: 1; transform: none; filter: none; }
        .reveal-delay-1 { transition-delay: 0.1s; } .reveal-delay-2 { transition-delay: 0.2s; } .reveal-delay-3 { transition-delay: 0.3s; }
        .svg-draw path, .svg-draw circle { stroke-dasharray: 800; stroke-dashoffset: 800; transition: stroke-dashoffset 1.5s cubic-bezier(0.22,1,0.36,1); }
        .svg-draw.visible path, .svg-draw.visible circle { stroke-dashoffset: 0; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .float { animation: float 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; filter: none; } .float { animation: none; } }
        @media (max-width: 768px) { .product-grid-4 { grid-template-columns: repeat(2,1fr) !important; } .detail-split { grid-template-columns: 1fr !important; } .cart-layout { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ color: "var(--text)", fontFamily: "var(--font-body)", position: "relative" }}>
        <DnaBackground pattern="diamonds" animated="nebula" />
        {/* Hero */}
        <section style={{ textAlign: "center", padding: "160px 32px 80px" }}>
          <div className="hero-svg reveal" style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
            <svg viewBox="0 0 160 160" fill="none" className="svg-draw float" width="160" height="160">
              <rect x="36" y="60" width="88" height="80" rx="8" stroke="var(--text-secondary)" strokeWidth="1.5" />
              <path d="M60 60 V44 C60 30 72 20 80 20 C88 20 100 30 100 44 V60" stroke="var(--text-secondary)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <circle cx="80" cy="96" r="12" stroke="var(--accent)" strokeWidth="1.5" />
              <path d="M80 88 L82 93 L88 93 L83 97 L85 102 L80 99 L75 102 L77 97 L72 93 L78 93 Z" fill="var(--accent)" opacity="0.6" />
            </svg>
          </div>
          <div className="reveal reveal-delay-1">
            <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>E-Commerce</p>
            <h1 style={{ fontFamily: "var(--font-display,'Instrument Serif',Georgia,serif)", fontSize: "clamp(40px,5vw,64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>
              Shopping that <em style={{ fontStyle: "italic", color: "var(--accent)" }}>feels</em> right.
            </h1>
            <p style={{ fontSize: 17, color: "var(--text-secondary)", fontWeight: 300 }}>Product cards, cart, checkout. Every detail matters.</p>
          </div>
        </section>

        {/* Product Grid */}
        <section id="products" style={{ padding: "80px 32px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
              <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>Product Grid</p>
              <h2 style={{ fontFamily: "var(--font-display,'Instrument Serif',Georgia,serif)", fontSize: "clamp(40px,5vw,64px)", fontWeight: 400, letterSpacing: "-0.03em" }}>Browse with intent.</h2>
            </div>
            <div className="product-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
              {PRODUCTS.map((p, i) => (
                <div key={p.id} className={`reveal${i > 0 ? ` reveal-delay-${Math.min(i, 4)}` : ""}`}><ProductCard product={p} /></div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Detail */}
        <section style={{ padding: "80px 32px", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="detail-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
              <div className="reveal" style={{ background: "var(--bg-surface)", borderRadius: "var(--radius,12px)", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 40%, var(--accent-glow,rgba(99,107,240,0.12)) 0%, transparent 50%)" }} />
                <span style={{ fontSize: 14, color: "var(--text-muted)", zIndex: 1 }}>Product photography</span>
              </div>
              <div className="reveal reveal-delay-2">
                <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>Featured</p>
                <h2 style={{ fontFamily: "var(--font-display,'Instrument Serif',Georgia,serif)", fontSize: 40, fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 8 }}>Midnight Ceramic Vase</h2>
                <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>$89</p>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 32 }}>Hand-thrown stoneware with a matte black glaze. Each piece is unique — subtle variations in texture and tone are part of the character.</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Size</p>
                <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
                  {["S", "M", "L"].map((s) => (
                    <button key={s} onClick={() => setSelectedSize(s)} style={{ width: 44, height: 44, border: `1px solid ${selectedSize === s ? "var(--accent)" : "var(--border)"}`, borderRadius: "var(--radius-sm,8px)", background: selectedSize === s ? "var(--accent-glow,rgba(99,107,240,0.12))" : "none", color: selectedSize === s ? "var(--accent)" : "var(--text)", fontSize: 13, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}>{s}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button style={{ padding: "14px 32px", borderRadius: "var(--radius-sm,8px)", fontSize: 14, fontWeight: 500, cursor: "pointer", background: "var(--cta-bg,white)", color: "var(--cta-text,#08080a)", border: "none", transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)", fontFamily: "inherit" }}>Add to bag</button>
                  <button style={{ padding: "14px 32px", borderRadius: "var(--radius-sm,8px)", fontSize: 14, fontWeight: 500, cursor: "pointer", background: "none", color: "var(--text)", border: "1px solid var(--border)", fontFamily: "inherit" }}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cart */}
        <section style={{ padding: "80px 32px", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
              <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>Cart</p>
              <h2 style={{ fontFamily: "var(--font-display,'Instrument Serif',Georgia,serif)", fontSize: "clamp(40px,5vw,64px)", fontWeight: 400, letterSpacing: "-0.03em" }}>Review your bag.</h2>
            </div>
            <div className="cart-layout reveal reveal-delay-1" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)", borderRadius: "var(--radius,12px)", overflow: "hidden" }}>
                {[{ name: "Midnight Ceramic Vase", variant: "Size M · Matte Black", price: "$89", qty: 1 }, { name: "Linen Throw Blanket", variant: "Natural · King", price: "$124", qty: 2 }, { name: "Copper Pour-Over Set", variant: "Brushed Copper", price: "$124", qty: 1 }].map((item) => (
                  <div key={item.name} style={{ background: "var(--bg-elevated)", padding: 20, display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ width: 72, height: 72, background: "var(--bg-surface)", borderRadius: "var(--radius-sm,8px)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--text-muted)" }}>IMG</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{item.name}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>{item.variant}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {["-", item.qty, "+"].map((v, i) => i === 1
                          ? <span key={i} style={{ fontSize: 14, fontWeight: 500, minWidth: 20, textAlign: "center" }}>{v}</span>
                          : <button key={i} style={{ width: 28, height: 28, border: "1px solid var(--border)", borderRadius: 6, background: "none", color: "var(--text)", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{v}</button>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 15, fontWeight: 600 }}>{item.price}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", cursor: "pointer", marginTop: 4 }}>Remove</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius,12px)", padding: 32, position: "sticky", top: 80 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, letterSpacing: "-0.01em" }}>Order summary</h3>
                {[{ label: "Subtotal", value: "$337" }, { label: "Discount", value: "-$27", accent: true }, { label: "Shipping", value: "Free" }].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 14, color: "var(--text-secondary)" }}>
                    <span>{row.label}</span><span style={row.accent ? { color: "var(--success,#34d399)" } : {}}>{row.value}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", marginTop: 8, paddingTop: 16, fontWeight: 600, fontSize: 16, color: "var(--text)" }}>
                  <span>Total</span><span>$310</span>
                </div>
                <button style={{ width: "100%", padding: 14, background: "var(--accent)", color: "var(--accent-contrast, white)", border: "none", borderRadius: "var(--radius-sm,8px)", fontSize: 14, fontWeight: 500, cursor: "pointer", marginTop: 24, transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)", fontFamily: "inherit" }}>
                  Proceed to checkout
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 12, fontSize: 11, color: "var(--text-muted)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  Secure checkout · SSL encrypted
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Checkout Steps */}
        <section style={{ padding: "80px 32px", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
              <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>Checkout</p>
              <h2 style={{ fontFamily: "var(--font-display,'Instrument Serif',Georgia,serif)", fontSize: "clamp(40px,5vw,64px)", fontWeight: 400, letterSpacing: "-0.03em" }}>Three steps. Done.</h2>
            </div>
            <CheckoutSteps />
          </div>
        </section>

        <footer style={{ padding: "64px 32px 32px", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", gap: 64, marginBottom: 48, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>APEX Store</p>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 240 }}>Shopping patterns that convert. Every detail matters.</p>
            </div>
            <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
              {[{ title: "Patterns", links: ["Landing", "CRM", "E-Commerce"] }, { title: "Framework", links: ["GitHub", "Documentation", "Changelog"] }].map((col) => (
                <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", fontWeight: 500, marginBottom: 8 }}>{col.title}</p>
                  {col.links.map((link) => <a key={link} href="#" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>{link}</a>)}
                </div>
              ))}
            </div>
          </div>
          <div style={{ maxWidth: 1200, margin: "0 auto", paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>&copy; {new Date().getFullYear()} APEX Store. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
