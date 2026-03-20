// Copy this file into your app and customize
// Visual reference: docs/design-dna/landing.html
// DNA palette: bg=#08080a, accent=#636bf0, font-display=Instrument Serif

import React from "react";
import { Header } from "../starters/layout";
import { Button, SectionHeader, Card } from "../starters/primitives";

// ── Sample data ──────────────────────────────────────────────
interface Feature {
  number: string;
  title: string;
  description: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  initials: string;
}

const sampleFeatures: Feature[] = [
  {
    number: "01",
    title: "Ship in hours, not weeks.",
    description:
      "Pre-built components, design tokens, and a clear architecture so your team spends time on product, not setup.",
  },
  {
    number: "02",
    title: "Design that earns trust.",
    description:
      "Every pattern is tested for accessibility, dark mode, and responsiveness. Your users deserve better than templates.",
  },
  {
    number: "03",
    title: "Performance by default.",
    description:
      "Zero-config code splitting, image optimization, and Core Web Vitals baked in from the start.",
  },
  {
    number: "04",
    title: "Security without ceremony.",
    description:
      "OWASP checks, input validation, and secrets detection run automatically on every commit.",
  },
];

const sampleTestimonials: Testimonial[] = [
  {
    quote:
      "We cut our onboarding time from three weeks to two days. Every pattern we needed was already there.",
    author: "Ana Souza",
    role: "CTO, Forma",
    initials: "AS",
  },
  {
    quote:
      "The design system is genuinely beautiful. We shipped to a hundred thousand users and got zero UX complaints.",
    author: "Marcus Chen",
    role: "Lead Designer, Relay",
    initials: "MC",
  },
  {
    quote:
      "I've tried every Next.js starter. This is the first one that doesn't make me clean up after it.",
    author: "Priya Nair",
    role: "Founder, Inkline",
    initials: "PN",
  },
];

const sampleLogos = ["Forma", "Relay", "Inkline", "Beacon", "Drift", "Arc"];

// ── Sub-components ────────────────────────────────────────────
function FeatureItem({ feature }: { feature: Feature }) {
  return (
    <div className="flex gap-6 py-8 border-b" style={{ borderColor: "var(--border)" }}>
      <span
        className="text-[11px] font-mono font-medium shrink-0 mt-1"
        style={{ color: "var(--text-muted)" }}
      >
        {feature.number}
      </span>
      <div>
        <h3
          className="text-[18px] font-medium tracking-[-0.02em] mb-2"
          style={{ color: "var(--text)" }}
        >
          {feature.title}
        </h3>
        <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {feature.description}
        </p>
      </div>
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <Card className="p-6">
      <Card.Body>
        <p
          className="text-[15px] leading-relaxed mb-6"
          style={{ color: "var(--text-secondary)", fontStyle: "italic" }}
        >
          &ldquo;{t.quote}&rdquo;
        </p>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0"
            style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
          >
            {t.initials}
          </div>
          <div>
            <p className="text-[13px] font-medium" style={{ color: "var(--text)" }}>
              {t.author}
            </p>
            <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
              {t.role}
            </p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="apex-enter" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Header
        logo={
          <span className="text-[14px] font-semibold tracking-[-0.01em]">
            APEX <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>framework</span>
          </span>
        }
        links={[
          { label: "Features", href: "#features" },
          { label: "Testimonials", href: "#testimonials" },
          { label: "Pricing", href: "#pricing" },
        ]}
        actions={
          <>
            <Button variant="ghost" size="sm" href="#login">
              Sign in
            </Button>
            <Button variant="primary" size="sm" href="#signup">
              Get started
            </Button>
          </>
        }
      />

      {/* Hero */}
      <section
        id="main-content"
        className="min-h-[100svh] flex items-center justify-center px-6 py-32 text-center relative overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 40%, var(--accent-glow) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="max-w-3xl mx-auto relative z-10">
          <p
            className="text-[12px] uppercase tracking-[0.12em] font-medium mb-6"
            style={{ color: "var(--accent)" }}
          >
            Agent-Powered Excellence
          </p>
          <h1
            className="font-serif text-[clamp(52px,8vw,88px)] font-normal leading-none tracking-[-0.04em] mb-8"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Build apps that{" "}
            <em className="not-italic" style={{ color: "var(--accent)" }}>
              last.
            </em>
          </h1>
          <p
            className="text-[18px] leading-[1.7] font-light max-w-md mx-auto mb-12"
            style={{ color: "var(--text-secondary)" }}
          >
            The framework that ships production-quality code from day one — design, security, and
            performance included.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="cta" size="lg" href="#get-started">
              Start building
              <span aria-hidden="true">→</span>
            </Button>
            <Button variant="ghost" size="lg" href="#demo">
              Watch demo
            </Button>
          </div>
        </div>
      </section>

      {/* Social proof: logo strip */}
      <section className="px-6 py-16 border-y" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.1em] mb-8" style={{ color: "var(--text-muted)" }}>
            Trusted by teams at
          </p>
          <div className="flex flex-wrap gap-8 justify-center items-center">
            {sampleLogos.map((name) => (
              <span
                key={name}
                className="text-[15px] font-semibold tracking-[-0.02em]"
                style={{ color: "var(--text-muted)" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features — asymmetric list, not a 3-column icon grid */}
      <section id="features" className="px-6 py-24 sm:py-32">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[320px_1fr] gap-16 items-start">
          <div className="lg:sticky" style={{ top: "96px" }}>
            <SectionHeader
              label="Features"
              title="Everything your app needs."
              subtitle="Not everything imaginable — everything that actually matters."
            />
          </div>
          <div>
            {sampleFeatures.map((f) => (
              <FeatureItem key={f.number} feature={f} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-6 py-24 sm:py-32" style={{ background: "var(--bg-elevated)" }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            label="Testimonials"
            title="Teams that ship."
            subtitle="Real feedback from real teams."
            align="center"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleTestimonials.map((t) => (
              <TestimonialCard key={t.author} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 sm:py-32 text-center">
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-serif text-[clamp(36px,5vw,60px)] font-normal leading-tight tracking-[-0.04em] mb-6"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Ready to build something{" "}
            <em className="not-italic" style={{ color: "var(--accent)" }}>
              great?
            </em>
          </h2>
          <p className="text-[17px] font-light mb-10" style={{ color: "var(--text-secondary)" }}>
            Free to start. No credit card required.
          </p>
          <Button variant="cta" size="lg" href="#get-started">
            Get started for free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-10" style={{ borderColor: "var(--border)" }}>
        <div
          className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <span className="text-[14px] font-semibold tracking-[-0.01em]">APEX</span>
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} APEX Framework. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
