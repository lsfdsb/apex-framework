// Copy this file into your app and customize
// DNA source: docs/design-dna/ebook.html
// Palette: bg=#08080a, elevated=#111114, accent=#636bf0
// Body font: Newsreader (serif), UI font: Inter, Display: Instrument Serif

import React, { useState, useEffect, useRef } from "react";
import { SectionHeader, Button } from "../starters/primitives";

// --- Sample data ---

interface Chapter {
  num: string;
  title: string;
  page: number;
  excerpt: string;
}

interface SideNote {
  anchor: string;
  text: string;
}

const CHAPTERS: Chapter[] = [
  { num: "01", title: "The Tyranny of Complexity", page: 7, excerpt: "Every system tends toward entropy. The question is not whether complexity will grow, but how fast." },
  { num: "02", title: "Tokens as a Language", page: 21, excerpt: "Before components, before patterns — there are tokens. The vocabulary from which everything else is built." },
  { num: "03", title: "Composition Over Inheritance", page: 38, excerpt: "The most resilient systems are not hierarchies. They are networks of small, composable pieces." },
  { num: "04", title: "The Living Documentation", page: 55, excerpt: "Documentation that doesn't evolve with the system is worse than no documentation at all." },
  { num: "05", title: "Designing for the Second Decade", page: 72, excerpt: "Short-term thinking is the most expensive engineering practice. The compounding cost of technical debt is real." },
];

const SIDE_NOTES: SideNote[] = [
  { anchor: "first", text: "Shannon's information theory (1948) is the mathematical foundation for this principle." },
  { anchor: "second", text: "See also: Atomic Design by Brad Frost, which formalizes this hierarchy." },
];

const CHAPTER_CONTENT = `The first principle of any lasting system is that it must be understood by the people who maintain it. Complexity that cannot be reasoned about cannot be trusted, and systems that cannot be trusted will be replaced.

This is not an argument against sophistication. It is an argument for intentional design — the deliberate choice to make hard problems tractable through the right abstractions at the right level of the stack.

When we say a system is "simple," we do not mean it is trivial. We mean it is composed of pieces that are each understandable in isolation. The complexity exists, but it is organized. Managed. Named.

> "The art of programming is the art of organizing complexity." — Edsger W. Dijkstra

Names matter enormously. A token named \`--color-brand-500\` is a coordinate in a color space. A token named \`--accent\` is a design decision. The latter is infinitely more valuable because it carries intent.

### The Cost of Unmaintained Abstractions

Every abstraction has a maintenance cost. When we introduce a layer of indirection, we gain flexibility at the price of indirection. The question is always whether the flexibility is worth the cost.

Systems that have grown organically over years accumulate layers of abstractions, some of which were reasonable at the time and some of which were not. The ones that were not reasonable become load-bearing walls — too dangerous to remove, too confusing to extend.`;

// --- Sub-components ---

function TableOfContents({
  chapters,
  activeChapter,
  onSelect,
}: {
  chapters: Chapter[];
  activeChapter: string;
  onSelect: (num: string) => void;
}) {
  return (
    <nav
      className="sticky self-start"
      style={{ top: 96 }}
      aria-label="Table of contents"
    >
      <p
        className="text-[11px] uppercase tracking-[0.12em] font-medium mb-4"
        style={{
          fontFamily: "var(--font-sans, 'Inter', sans-serif)",
          color: "var(--accent)",
        }}
      >
        Contents
      </p>
      <div>
        {chapters.map(ch => (
          <button
            key={ch.num}
            onClick={() => onSelect(ch.num)}
            className="w-full text-left py-3.5 border-b flex justify-between items-baseline transition-colors duration-200 hover:text-[var(--accent)]"
            style={{
              borderColor: "var(--border)",
              color: activeChapter === ch.num ? "var(--accent)" : "var(--text)",
            }}
            aria-current={activeChapter === ch.num ? "true" : undefined}
          >
            <div className="flex items-baseline gap-3">
              <span
                className="text-[12px] min-w-[40px]"
                style={{
                  fontFamily: "var(--font-sans, 'Inter', sans-serif)",
                  color: activeChapter === ch.num ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                {ch.num}
              </span>
              <span style={{ fontSize: 17, letterSpacing: "-0.01em" }}>{ch.title}</span>
            </div>
            <span
              className="text-[12px] ml-4 shrink-0"
              style={{
                fontFamily: "var(--font-sans, 'Inter', sans-serif)",
                color: "var(--text-muted)",
              }}
            >
              {ch.page}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function ReadingPage({
  chapter,
  content,
  sideNotes,
  pageNum,
}: {
  chapter: Chapter;
  content: string;
  sideNotes: SideNote[];
  pageNum: number;
}) {
  const paragraphs = content.split("\n\n").filter(Boolean);

  return (
    <div className="max-w-[860px] mx-auto">
      <div className="grid gap-8" style={{ gridTemplateColumns: "1fr 180px" }}>
        {/* Main page */}
        <div
          className="rounded-[var(--radius)] border relative"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--border)",
            padding: "56px 48px",
          }}
        >
          <p
            className="text-[11px] uppercase tracking-[0.08em] mb-5"
            style={{
              fontFamily: "var(--font-sans, 'Inter', sans-serif)",
              color: "var(--accent)",
            }}
          >
            Chapter {chapter.num}
          </p>
          <h2
            className="font-normal tracking-tight mb-8"
            style={{
              fontFamily: "var(--font-display, 'Instrument Serif', Georgia, serif)",
              fontSize: 32,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            {chapter.title}
          </h2>
          <div
            style={{
              fontFamily: "var(--font-body, 'Newsreader', Georgia, serif)",
              fontSize: 17,
              lineHeight: 1.9,
              color: "var(--text-secondary)",
            }}
          >
            {paragraphs.map((para, i) => {
              if (para.startsWith(">")) {
                return (
                  <blockquote
                    key={i}
                    style={{
                      borderLeft: "3px solid var(--accent)",
                      paddingLeft: 24,
                      margin: "28px 0",
                      fontStyle: "italic",
                      fontSize: 19,
                      color: "var(--text)",
                    }}
                  >
                    {para.slice(2)}
                  </blockquote>
                );
              }
              if (para.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    style={{
                      fontFamily: "var(--font-display, 'Instrument Serif', Georgia, serif)",
                      fontSize: 24,
                      fontWeight: 400,
                      color: "var(--text)",
                      margin: "36px 0 12px",
                    }}
                  >
                    {para.slice(4)}
                  </h3>
                );
              }
              return (
                <p
                  key={i}
                  style={{
                    marginBottom: 20,
                    textIndent: i === 0 ? 0 : "1.5em",
                  }}
                >
                  {i === 0 ? (
                    <>
                      <span
                        style={{
                          fontFamily: "var(--font-display, 'Instrument Serif', Georgia, serif)",
                          fontSize: 56,
                          float: "left",
                          lineHeight: 1,
                          marginRight: 12,
                          color: "var(--accent)",
                        }}
                      >
                        {para[0]}
                      </span>
                      {para.slice(1)}
                    </>
                  ) : para}
                </p>
              );
            })}
          </div>
          <span
            className="absolute bottom-6 right-8 text-[11px]"
            style={{
              fontFamily: "var(--font-sans, 'Inter', sans-serif)",
              color: "var(--text-muted)",
            }}
          >
            {pageNum}
          </span>
        </div>

        {/* Side notes — hidden on mobile */}
        <div className="hidden md:block">
          {sideNotes.map((note, i) => (
            <div
              key={i}
              className="pt-2 border-t mb-6"
              style={{
                borderColor: "var(--border)",
                fontFamily: "var(--font-sans, 'Inter', sans-serif)",
                fontSize: 12,
                lineHeight: 1.5,
                color: "var(--text-muted)",
              }}
            >
              {note.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChapterNav({ chapters, current, onNavigate }: {
  chapters: Chapter[];
  current: string;
  onNavigate: (num: string) => void;
}) {
  const idx = chapters.findIndex(c => c.num === current);
  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;

  return (
    <div className="max-w-[640px] mx-auto flex gap-4 mt-12">
      {prev ? (
        <button
          onClick={() => onNavigate(prev.num)}
          className="flex-1 text-left px-5 py-3 border rounded-[var(--radius-sm)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-sans, 'Inter', sans-serif)" }}
        >
          <span className="text-[10px] uppercase tracking-[0.06em] block mb-1">Previous</span>
          <span className="text-[14px] font-medium block" style={{ color: "var(--text)" }}>{prev.title}</span>
        </button>
      ) : <div className="flex-1" />}
      {next && (
        <button
          onClick={() => onNavigate(next.num)}
          className="flex-1 text-right px-5 py-3 border rounded-[var(--radius-sm)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-sans, 'Inter', sans-serif)" }}
        >
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

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, pct)));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentChapter = CHAPTERS.find(c => c.num === activeChapter) ?? CHAPTERS[1];

  return (
    <div
      className="min-h-screen apex-enter"
      style={{ color: "var(--text)" }}
      ref={mainRef}
    >
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50"
        style={{ height: 2, background: "var(--border)" }}
        aria-hidden="true"
      >
        <div
          style={{ width: `${scrollProgress}%`, height: "100%", background: "var(--accent)", transition: "width 0.1s" }}
        />
      </div>

      <div className="px-4 py-16 pt-20">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <SectionHeader
            label="E-Book Reader"
            title="Long-form reading."
            subtitle="Table of contents, chapter prose, sidenotes, navigation."
            align="center"
          />

          <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
            {/* TOC sidebar */}
            <TableOfContents
              chapters={CHAPTERS}
              activeChapter={activeChapter}
              onSelect={setActiveChapter}
            />

            {/* Reading content */}
            <div>
              <ReadingPage
                chapter={currentChapter}
                content={CHAPTER_CONTENT}
                sideNotes={SIDE_NOTES}
                pageNum={currentChapter.page}
              />
              <ChapterNav
                chapters={CHAPTERS}
                current={activeChapter}
                onNavigate={setActiveChapter}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
