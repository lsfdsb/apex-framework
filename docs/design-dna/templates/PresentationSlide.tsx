// Copy this file into your app and customize
// DNA source: docs/design-dna/presentation.html
// Palette: bg=#08080a, elevated=#111114, accent=#636bf0, font=Inter + Instrument Serif
// Slide aspect ratio: 16:9 (aspect-video)

import React, { useState } from "react";
import { SectionHeader, Button } from "../starters/primitives";

// --- Sample data ---

interface TitleSlideData {
  label: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  presenter: string;
  date: string;
}

interface ContentSlideData {
  title: string;
  points: Array<{ num: string; heading: string; body: string }>;
}

interface ImageSlideData {
  title: string;
  items: Array<{ icon: string; label: string; value: string }>;
}

const TITLE_SLIDE: TitleSlideData = {
  label: "Product Review",
  title: "Shipping faster",
  titleAccent: "without shortcuts.",
  subtitle: "A practical framework for high-quality delivery at scale.",
  presenter: "Marcus Chen · Design Lead",
  date: "March 2026",
};

const CONTENT_SLIDE: ContentSlideData = {
  title: "Three principles for sustainable velocity.",
  points: [
    { num: "01", heading: "Design tokens first", body: "Establish semantic tokens before components. This prevents divergence as the system scales." },
    { num: "02", heading: "Composition over inheritance", body: "Build small, composable primitives. Complexity grows predictably from simple pieces." },
    { num: "03", heading: "Test at the boundary", body: "Unit-test behavior, not implementation. Integration tests catch what unit tests miss." },
    { num: "04", heading: "Document the why", body: "Code explains what. Commit messages and decisions docs explain why. Both matter." },
  ],
};

const IMAGE_SLIDE: ImageSlideData = {
  title: "Numbers that matter.",
  items: [
    { icon: "⚡", label: "Faster delivery", value: "3×" },
    { icon: "↘", label: "Bug reduction", value: "67%" },
    { icon: "↗", label: "Team satisfaction", value: "94%" },
    { icon: "♻", label: "Code reuse", value: "82%" },
  ],
};

// --- Slide wrapper ---

function SlideFrame({ children, label, slideNum, className = "" }: {
  children: React.ReactNode;
  label?: string;
  slideNum?: number;
  className?: string;
}) {
  return (
    <div
      className={`aspect-video rounded-[var(--radius)] border relative overflow-hidden flex flex-col justify-center transition-all duration-[var(--duration-normal)] hover:border-[var(--border-hover)] ${className}`}
      style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", padding: "48px 64px" }}
    >
      {label && (
        <span
          className="absolute top-4 right-5 text-[10px] uppercase tracking-[0.06em]"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </span>
      )}
      {slideNum != null && (
        <span
          className="absolute bottom-4 right-5 text-[11px]"
          style={{ color: "var(--text-muted)" }}
        >
          {slideNum}
        </span>
      )}
      {children}
    </div>
  );
}

// --- Variant 1: Title Slide ---

function TitleSlide({ data }: { data: TitleSlideData }) {
  return (
    <SlideFrame label={data.label} slideNum={1}>
      {/* Glow accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 80% 20%, var(--accent-glow), transparent 60%)" }}
        aria-hidden="true"
      />
      <div className="relative">
        <p className="text-[11px] uppercase tracking-[0.12em] font-medium mb-4" style={{ color: "var(--accent)" }}>
          {data.label}
        </p>
        <h1
          className="font-normal tracking-[-0.04em] leading-none mb-4"
          style={{
            fontFamily: "var(--font-display, 'Instrument Serif', Georgia, serif)",
            fontSize: "clamp(40px, 5vw, 72px)",
            color: "var(--text)",
          }}
        >
          {data.title}{" "}
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{data.titleAccent}</em>
        </h1>
        <p
          className="font-light max-w-[480px] mb-8"
          style={{ fontSize: 18, color: "var(--text-secondary)" }}
        >
          {data.subtitle}
        </p>
        <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
          {data.presenter} · {data.date}
        </p>
      </div>
    </SlideFrame>
  );
}

// --- Variant 2: Content Slide ---

function ContentSlide({ data }: { data: ContentSlideData }) {
  return (
    <SlideFrame label="Principles" slideNum={2}>
      <h2 className="text-[28px] font-semibold tracking-tight mb-6" style={{ color: "var(--text)" }}>
        {data.title}
      </h2>
      <div className="grid grid-cols-2 gap-8">
        {data.points.map(point => (
          <div key={point.num}>
            <p
              className="font-normal tracking-tight mb-2"
              style={{
                fontFamily: "var(--font-display, 'Instrument Serif', Georgia, serif)",
                fontSize: 36,
                color: "var(--border-hover)",
                letterSpacing: "-0.03em",
              }}
            >
              {point.num}
            </p>
            <h3 className="text-[16px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>{point.heading}</h3>
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{point.body}</p>
          </div>
        ))}
      </div>
    </SlideFrame>
  );
}

// --- Variant 3: Stats/Image Slide ---

function StatsSlide({ data }: { data: ImageSlideData }) {
  return (
    <SlideFrame label="Impact" slideNum={3}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 100%, var(--accent-glow), transparent 60%)" }}
        aria-hidden="true"
      />
      <div className="relative text-center">
        <h2 className="text-[28px] font-semibold tracking-tight mb-10" style={{ color: "var(--text)" }}>
          {data.title}
        </h2>
        <div className="flex justify-center gap-16">
          {data.items.map(item => (
            <div key={item.label} className="text-center">
              <p
                className="font-bold tracking-[-0.04em] leading-none mb-2"
                style={{ fontSize: 64, color: "var(--text)" }}
              >
                {item.value}
              </p>
              <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

// --- Mini slide grid (deck overview) ---

const SLIDE_PREVIEWS = [
  { title: "Title slide", desc: "Large serif headline with accent word" },
  { title: "Principles", desc: "2×2 content grid with numbered points" },
  { title: "Statistics", desc: "Large numbers with labels, centered" },
  { title: "Quote", desc: "Italic block quote with attribution" },
  { title: "Split layout", desc: "Image left, bullets right" },
  { title: "Timeline", desc: "Horizontal milestone steps" },
];

function SlideGrid() {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
      {SLIDE_PREVIEWS.map((slide, i) => (
        <div
          key={i}
          className="aspect-video rounded-[var(--radius-sm)] border flex flex-col justify-center px-6 transition-all duration-300 cursor-pointer hover:border-[var(--border-hover)] hover:-translate-y-0.5"
          style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", padding: "24px" }}
          tabIndex={0}
          role="button"
          aria-label={`Slide ${i + 1}: ${slide.title}`}
        >
          <h4 className="text-[13px] font-semibold mb-1" style={{ color: "var(--text)" }}>{slide.title}</h4>
          <p className="text-[11px] leading-snug" style={{ color: "var(--text-muted)" }}>{slide.desc}</p>
        </div>
      ))}
    </div>
  );
}

// --- Page ---

export default function PresentationSlide() {
  const [current, setCurrent] = useState(0);
  const total = 3;

  return (
    <div
      className="min-h-screen px-4 py-16 apex-enter"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <div className="mx-auto" style={{ maxWidth: 1000 }}>
        <SectionHeader
          label="Presentations"
          title="Slide deck templates."
          subtitle="Three slide variants: Title, Content, Stats. Copy and compose."
          align="center"
        />

        {/* Active slide */}
        <div className="mb-6">
          {current === 0 && <TitleSlide data={TITLE_SLIDE} />}
          {current === 1 && <ContentSlide data={CONTENT_SLIDE} />}
          {current === 2 && <StatsSlide data={IMAGE_SLIDE} />}
        </div>

        {/* Slide navigation */}
        <div className="flex items-center justify-between mb-16">
          <Button variant="ghost" size="sm" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>
            ← Previous
          </Button>
          <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            {current + 1} / {total}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setCurrent(c => Math.min(total - 1, c + 1))} disabled={current === total - 1}>
            Next →
          </Button>
        </div>

        {/* Deck overview */}
        <SectionHeader
          label="Overview"
          title="All slide types."
          subtitle="6 slide variants in the full deck."
        />
        <SlideGrid />
      </div>
    </div>
  );
}
