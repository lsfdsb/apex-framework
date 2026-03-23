// Copy this file into your app and customize
// DNA source: docs/design-dna/ebook.html
// Palette: bg=#08080a, elevated=#111114, surface=#19191d, accent=#636bf0
// Body font: Newsreader (serif), UI font: Inter, Display: Instrument Serif

import React, { useState, useEffect, useRef } from "react";
import { SectionHeader, Button } from "../starters/primitives";

// --- Reveal hook ---

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// --- Data ---

interface Chapter { num: string; title: string; page: number; excerpt: string; }
interface SideNote { anchor: string; text: string; }

const CHAPTERS: Chapter[] = [
  { num: "01", title: "The Tyranny of Complexity", page: 7, excerpt: "Every system tends toward entropy." },
  { num: "02", title: "Tokens as a Language", page: 21, excerpt: "Before components — there are tokens." },
  { num: "03", title: "Composition Over Inheritance", page: 38, excerpt: "The most resilient systems are networks." },
  { num: "04", title: "The Living Documentation", page: 55, excerpt: "Documentation that doesn't evolve is worse than none." },
  { num: "05", title: "Designing for the Second Decade", page: 72, excerpt: "Short-term thinking is the most expensive practice." },
  { num: "06", title: "Motion with Meaning", page: 88, excerpt: "Animation is communication, not decoration." },
  { num: "07", title: "Evolution, Not Revolution", page: 104, excerpt: "The best systems grow without breaking." },
];

const SIDE_NOTES: SideNote[] = [
  { anchor: "first", text: "Shannon's information theory (1948) is the mathematical foundation for this principle." },
  { anchor: "second", text: "See also: Atomic Design by Brad Frost, which formalizes this hierarchy." },
];

// Markers: "> " = blockquote, "### " = h3, "@@callout:" = callout, rest = p
const CHAPTER_CONTENT = `The first principle of any lasting system is that it must be understood by the people who maintain it. Complexity that cannot be reasoned about cannot be trusted, and systems that cannot be trusted will be replaced.

This is not an argument against sophistication. It is an argument for intentional design — the deliberate choice to make hard problems tractable through the right abstractions at the right level of the stack.

When we say a system is "simple," we do not mean it is trivial. We mean it is composed of pieces that are each understandable in isolation. The complexity exists, but it is organized. Managed. Named.

> "The art of programming is the art of organizing complexity." — Edsger W. Dijkstra

@@callout:The best design systems are invisible. Users never notice consistency — they only notice inconsistency. Your job is to remove friction, not add decoration.

### The Cost of Unmaintained Abstractions

Every abstraction has a maintenance cost. When we introduce a layer of indirection, we gain flexibility at the price of indirection. The question is always whether the flexibility is worth the cost.

Systems that have grown organically accumulate layers of abstractions — some reasonable, some not. The unreasonable ones become load-bearing walls: too dangerous to remove, too confusing to extend.`;

// --- Sub-components ---

function BookCover() {
  return (
    <div className="reveal reveal-delay-1" style={{ maxWidth: 400, margin: "0 auto" }}>
      <div
        className="relative overflow-hidden flex flex-col justify-end"
        style={{
          aspectRatio: "3/4",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 48,
          transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
      >
        {/* Radial gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 30% 20%, var(--accent-glow, rgba(99,107,240,0.12)), transparent 50%)" }}
        />
        <p className="relative" style={{ fontFamily: "var(--font-sans,'Inter',sans-serif)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", marginBottom: 12 }}>
          A Practical Guide
        </p>
        <h1
          className="relative font-normal"
          style={{ fontFamily: "var(--font-display,'Instrument Serif',Georgia,serif)", fontSize: 36, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 8 }}
        >
          Design Systems for{" "}
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Humans.</em>
        </h1>
        <p className="relative" style={{ fontFamily: "var(--font-sans,'Inter',sans-serif)", fontSize: 14, color: "var(--text-secondary)" }}>
          Building token architectures that scale across teams, platforms, and time.
        </p>
        <p className="relative" style={{ fontFamily: "var(--font-sans,'Inter',sans-serif)", fontSize: 12, color: "var(--text-muted)", marginTop: 24 }}>
          by Lucas Bueno &amp; Claude
        </p>
      </div>
    </div>
  );
}

function CalloutBox({ text }: { text: string }) {
  return (
    <div style={{ background: "var(--bg-surface,#19191d)", borderRadius: "var(--radius-sm)", padding: "20px 24px", margin: "24px 0" }}>
      <p style={{ fontFamily: "var(--font-sans,'Inter',sans-serif)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent)", fontWeight: 500, marginBottom: 6 }}>
        Key Insight
      </p>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)", margin: 0 }}>{text}</p>
    </div>
  );
}

function TableOfContents({ chapters, activeChapter, onSelect }: { chapters: Chapter[]; activeChapter: string; onSelect: (n: string) => void; }) {
  return (
    <nav className="sticky self-start" style={{ top: 96 }} aria-label="Table of contents">
      <p className="text-[11px] uppercase tracking-[0.12em] font-medium mb-4" style={{ fontFamily: "var(--font-sans,'Inter',sans-serif)", color: "var(--accent)" }}>
        Contents
      </p>
      <div>
        {chapters.map(ch => (
          <button
            key={ch.num}
            onClick={() => onSelect(ch.num)}
            className="w-full text-left py-3.5 border-b flex justify-between items-baseline transition-colors duration-200 hover:text-[var(--accent)]"
            style={{ borderColor: "var(--border)", color: activeChapter === ch.num ? "var(--accent)" : "var(--text)" }}
            aria-current={activeChapter === ch.num ? "true" : undefined}
          >
            <div className="flex items-baseline gap-3">
              <span className="text-[12px] min-w-[40px]" style={{ fontFamily: "var(--font-sans,'Inter',sans-serif)", color: activeChapter === ch.num ? "var(--accent)" : "var(--text-muted)" }}>
                {ch.num}
              </span>
              <span style={{ fontSize: 17, letterSpacing: "-0.01em" }}>{ch.title}</span>
            </div>
            <span className="text-[12px] ml-4 shrink-0" style={{ fontFamily: "var(--font-sans,'Inter',sans-serif)", color: "var(--text-muted)" }}>
              {ch.page}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function ReadingPage({ chapter, content, sideNotes, pageNum }: { chapter: Chapter; content: string; sideNotes: SideNote[]; pageNum: number; }) {
  const paragraphs = content.split("\n\n").filter(Boolean);
  let pIdx = 0;

  return (
    <div className="max-w-[860px] mx-auto">
      <div className="grid gap-8" style={{ gridTemplateColumns: "1fr 180px" }}>
        <div className="rounded-[var(--radius)] border relative" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", padding: "56px 48px" }}>
          <p className="text-[11px] uppercase tracking-[0.08em] mb-5" style={{ fontFamily: "var(--font-sans,'Inter',sans-serif)", color: "var(--accent)" }}>
            Chapter {chapter.num}
          </p>
          <h2 className="font-normal tracking-tight mb-8" style={{ fontFamily: "var(--font-display,'Instrument Serif',Georgia,serif)", fontSize: 32, letterSpacing: "-0.02em", color: "var(--text)" }}>
            {chapter.title}
          </h2>
          <div style={{ fontFamily: "var(--font-body,'Newsreader',Georgia,serif)", fontSize: 17, lineHeight: 1.9, color: "var(--text-secondary)" }}>
            {paragraphs.map((para, i) => {
              if (para.startsWith(">")) {
                return <blockquote key={i} style={{ borderLeft: "3px solid var(--accent)", paddingLeft: 24, margin: "28px 0", fontStyle: "italic", fontSize: 19, color: "var(--text)", textIndent: 0 }}>{para.slice(2)}</blockquote>;
              }
              if (para.startsWith("@@callout:")) {
                return <CalloutBox key={i} text={para.slice(10)} />;
              }
              if (para.startsWith("### ")) {
                return <h3 key={i} style={{ fontFamily: "var(--font-display,'Instrument Serif',Georgia,serif)", fontSize: 24, fontWeight: 400, color: "var(--text)", margin: "36px 0 12px", textIndent: 0 }}>{para.slice(4)}</h3>;
              }
              const isFirst = pIdx++ === 0;
              return (
                <p key={i} style={{ marginBottom: 20, textIndent: isFirst ? 0 : "1.5em" }}>
                  {isFirst ? (
                    <><span style={{ fontFamily: "var(--font-display,'Instrument Serif',Georgia,serif)", fontSize: 56, float: "left", lineHeight: 1, marginRight: 12, color: "var(--accent)" }}>{para[0]}</span>{para.slice(1)}</>
                  ) : para}
                </p>
              );
            })}
          </div>
          <span className="absolute bottom-6 right-8 text-[11px]" style={{ fontFamily: "var(--font-sans,'Inter',sans-serif)", color: "var(--text-muted)" }}>{pageNum}</span>
        </div>
        <div className="hidden md:block">
          {sideNotes.map((note, i) => (
            <div key={i} className="pt-2 border-t mb-6" style={{ borderColor: "var(--border)", fontFamily: "var(--font-sans,'Inter',sans-serif)", fontSize: 12, lineHeight: 1.5, color: "var(--text-muted)" }}>
              {note.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChapterNav({ chapters, current, onNavigate }: { chapters: Chapter[]; current: string; onNavigate: (n: string) => void; }) {
  const idx = chapters.findIndex(c => c.num === current);
  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;

  return (
    <div className="max-w-[640px] mx-auto flex gap-4 mt-12">
      {prev ? (
        <button onClick={() => onNavigate(prev.num)} className="flex-1 text-left px-5 py-3 border rounded-[var(--radius-sm)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]" style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-sans,'Inter',sans-serif)" }}>
          <span className="text-[10px] uppercase tracking-[0.06em] block mb-1">Previous</span>
          <span className="text-[14px] font-medium block" style={{ color: "var(--text)" }}>{prev.title}</span>
        </button>
      ) : <div className="flex-1" />}
      {next && (
        <button onClick={() => onNavigate(next.num)} className="flex-1 text-right px-5 py-3 border rounded-[var(--radius-sm)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]" style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-sans,'Inter',sans-serif)" }}>
          <span className="text-[10px] uppercase tracking-[0.06em] block mb-1">Next</span>
          <span className="text-[14px] font-medium block" style={{ color: "var(--text)" }}>{next.title}</span>
        </button>
      )}
    </div>
  );
}

// --- Page ---

export default function EbookPage() {
  const [activeChapter, setActiveChapter] = useState("02");
  const [scrollProgress, setScrollProgress] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);
  useReveal();

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      setScrollProgress(Math.min(100, Math.max(0, (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentChapter = CHAPTERS.find(c => c.num === activeChapter) ?? CHAPTERS[1];

  return (
    <div className="min-h-screen apex-enter" style={{ color: "var(--text)" }} ref={mainRef}>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50" style={{ height: 2, background: "var(--border)" }} aria-hidden="true">
        <div style={{ width: `${scrollProgress}%`, height: "100%", background: "var(--accent)", transition: "width 0.1s" }} />
      </div>

      <div className="px-4 py-16 pt-20">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>

          {/* Cover section */}
          <section style={{ marginBottom: 80 }}>
            <div className="section-header reveal" style={{ textAlign: "center", marginBottom: 64 }}>
              <h2 style={{ fontFamily: "var(--font-display,'Instrument Serif',Georgia,serif)", fontSize: "clamp(40px,5vw,64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>The cover.</h2>
              <p style={{ fontFamily: "var(--font-sans,'Inter',sans-serif)", fontSize: 17, color: "var(--text-secondary)", fontWeight: 300 }}>First impression. Typography does the work.</p>
            </div>
            <BookCover />
          </section>

          {/* TOC + Reading */}
          <SectionHeader label="E-Book Reader" title="Long-form reading." subtitle="Table of contents, chapter prose, callouts, sidenotes, navigation." align="center" />

          <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
            <div className="reveal">
              <TableOfContents chapters={CHAPTERS} activeChapter={activeChapter} onSelect={setActiveChapter} />
            </div>
            <div className="reveal reveal-delay-1">
              <ReadingPage chapter={currentChapter} content={CHAPTER_CONTENT} sideNotes={SIDE_NOTES} pageNum={currentChapter.page} />
              <ChapterNav chapters={CHAPTERS} current={activeChapter} onNavigate={setActiveChapter} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
