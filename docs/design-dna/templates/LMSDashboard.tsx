// Unified LMS — courses, lesson player, reading, progress, certificates
// Zero external dependencies

import React, { useState, useEffect, useRef } from 'react';
import { DnaBackground } from '../starters/patterns/DnaBackground';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const css = `
.reveal{opacity:0;transform:translateY(32px) scale(0.98);filter:blur(4px);transition:all .9s cubic-bezier(0.22,1,0.36,1)}
.reveal.visible{opacity:1;transform:none;filter:none}
.reveal-delay-1{transition-delay:.1s}.reveal-delay-2{transition-delay:.2s}.reveal-delay-3{transition-delay:.3s}
.lms-course{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius,12px);overflow:hidden;transition:all .4s cubic-bezier(0.22,1,0.36,1);cursor:pointer}
.lms-course:hover{border-color:var(--border-hover);transform:translateY(-3px)}
.lms-lesson{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .2s}
.lms-lesson:last-child{border:none}.lms-lesson:hover{background:var(--bg-surface)}.lms-lesson.active{background:var(--accent-glow)}
.lms-progress-card{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius,12px);padding:24px;text-align:center;transition:all .3s cubic-bezier(0.22,1,0.36,1)}
.lms-progress-card:hover{border-color:var(--border-hover);transform:translateY(-2px)}
.lms-cert::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,var(--accent-glow),transparent 60%)}
.lms-reading{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius,12px);padding:56px 48px;position:relative}
@media(max-width:768px){.lms-courses,.lms-progress{grid-template-columns:1fr!important}.lms-player{grid-template-columns:1fr!important}.lms-reading{padding:32px 24px!important}}
@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;filter:none;transition:none}}
`;

const courses = [
  {
    cat: 'Design',
    title: 'Design Systems Fundamentals',
    desc: 'Build scalable design systems from scratch. Tokens, components, documentation.',
    instructor: 'Ana Souza',
    initials: 'AS',
    lessons: 12,
    hours: 4,
    progress: 65,
    badge: 'Beginner',
    badgeBg: 'rgba(52,211,153,0.15)',
    badgeC: 'var(--success)',
  },
  {
    cat: 'Engineering',
    title: 'TypeScript Patterns',
    desc: 'Advanced type-level programming. Generics, mapped types, conditional types.',
    instructor: 'Marcus Chen',
    initials: 'MC',
    lessons: 18,
    hours: 6,
    progress: 30,
    badge: 'Intermediate',
    badgeBg: 'rgba(251,191,36,0.15)',
    badgeC: 'var(--warning)',
  },
  {
    cat: 'Architecture',
    title: 'Scaling React Applications',
    desc: 'State management, code splitting, performance. Production patterns that scale.',
    instructor: 'David Lee',
    initials: 'DL',
    lessons: 24,
    hours: 8,
    progress: 0,
    badge: 'Advanced',
    badgeBg: 'rgba(248,113,113,0.15)',
    badgeC: 'var(--destructive)',
  },
];
const lessons = [
  { title: 'What is a Design System?', dur: '12:30', done: true },
  { title: 'Token Fundamentals', dur: '18:45', done: true },
  { title: 'Token Architecture', dur: '22:10', active: true },
  { title: 'Component Patterns', dur: '15:00' },
  { title: 'Documentation', dur: '10:20' },
  { title: 'Maintenance & Evolution', dur: '14:55' },
];
const progress = [
  { name: 'Design Systems', sub: '8 of 12', pct: 65, offset: 62 },
  { name: 'TypeScript', sub: '5 of 18', pct: 30, offset: 123 },
  { name: 'Git Fundamentals', sub: 'Completed', pct: 100, offset: 0, color: 'var(--success)' },
  { name: 'Scaling React', sub: 'Not started', pct: 0, offset: 176 },
];

function SH({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--accent)',
          fontWeight: 500,
          marginBottom: 16,
        }}
      >
        {label}
      </div>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(40px, 5vw, 64px)',
          fontWeight: 400,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: 16,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p style={{ fontSize: 17, color: 'var(--text-secondary)', fontWeight: 300 }}>{sub}</p>
      )}
    </div>
  );
}

function LessonNum({ i, done, active }: { i: number; done?: boolean; active?: boolean }) {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        border: `1px solid ${done ? 'var(--success)' : active ? 'var(--accent)' : 'var(--border)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 600,
        flexShrink: 0,
        color: done ? 'var(--success)' : active ? 'var(--accent)' : 'var(--text-muted)',
        background: done ? 'rgba(52,211,153,0.1)' : active ? 'var(--accent-glow)' : 'transparent',
      }}
    >
      {done ? '✓' : i}
    </div>
  );
}

function ProgressRing({ pct, offset, color }: { pct: number; offset: number; color?: string }) {
  const c = color || 'var(--accent)';
  return (
    <div style={{ width: 64, height: 64, margin: '0 auto 12px', position: 'relative' }}>
      <svg viewBox="0 0 64 64" width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border)" strokeWidth="4" />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke={c}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="176"
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 700,
          color: c,
        }}
      >
        {pct}%
      </div>
    </div>
  );
}

// ── E-Book Data ──
const ebookChapters = [
  { num: '01', title: 'The Tyranny of Complexity', page: 7 },
  { num: '02', title: 'Tokens as a Language', page: 21 },
  { num: '03', title: 'Composition Over Inheritance', page: 38 },
  { num: '04', title: 'The Living Documentation', page: 55 },
  { num: '05', title: 'Designing for the Second Decade', page: 72 },
  { num: '06', title: 'Motion with Meaning', page: 88 },
  { num: '07', title: 'Evolution, Not Revolution', page: 104 },
];

function BookCover() {
  return (
    <div style={{ maxWidth: 380, margin: '0 auto' }}>
      <div
        style={{
          aspectRatio: '3/4',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius, 12px)',
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 30% 20%, var(--accent-glow), transparent 50%)',
            pointerEvents: 'none',
          }}
        />
        <p
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--accent)',
            fontWeight: 500,
            marginBottom: 12,
            position: 'relative',
          }}
        >
          A Practical Guide
        </p>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            fontWeight: 400,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: 8,
            position: 'relative',
          }}
        >
          Design Systems for{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Humans.</em>
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', position: 'relative' }}>
          Building token architectures that scale across teams, platforms, and time.
        </p>
        <p
          style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 24, position: 'relative' }}
        >
          by Lucas Bueno & Claude
        </p>
      </div>
    </div>
  );
}

function EbookTOC({
  chapters,
  active,
  onSelect,
}: {
  chapters: typeof ebookChapters;
  active: string;
  onSelect: (n: string) => void;
}) {
  return (
    <nav style={{ position: 'sticky', top: 96, alignSelf: 'start' }}>
      <p
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--accent)',
          fontWeight: 500,
          marginBottom: 16,
        }}
      >
        Contents
      </p>
      {chapters.map((ch) => (
        <button
          key={ch.num}
          onClick={() => onSelect(ch.num)}
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '14px 0',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            background: 'none',
            border: 'none',
            borderBottomStyle: 'solid',
            borderBottomWidth: 1,
            borderBottomColor: 'var(--border)',
            cursor: 'pointer',
            color: active === ch.num ? 'var(--accent)' : 'var(--text)',
            transition: 'color .2s',
            fontFamily: 'var(--font-body)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span
              style={{
                fontSize: 12,
                minWidth: 32,
                color: active === ch.num ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {ch.num}
            </span>
            <span style={{ fontSize: 17, letterSpacing: '-0.01em' }}>{ch.title}</span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 16 }}>
            {ch.page}
          </span>
        </button>
      ))}
    </nav>
  );
}

function EbookReader({ chapter }: { chapter: (typeof ebookChapters)[0] }) {
  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius, 12px)',
        padding: '56px 48px',
        position: 'relative',
      }}
    >
      <p
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--accent)',
          marginBottom: 20,
        }}
      >
        Chapter {chapter.num}
      </p>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 32,
          fontWeight: 400,
          letterSpacing: '-0.02em',
          marginBottom: 32,
        }}
      >
        {chapter.title}
      </h2>
      <div
        style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontSize: 17,
          lineHeight: 1.9,
          color: 'var(--text-secondary)',
        }}
      >
        <p style={{ marginBottom: 20 }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 56,
              float: 'left',
              lineHeight: 1,
              marginRight: 12,
              color: 'var(--accent)',
            }}
          >
            T
          </span>
          he first principle of any lasting system is that it must be understood by the people who
          maintain it. Complexity that cannot be reasoned about cannot be trusted.
        </p>
        <blockquote
          style={{
            borderLeft: '3px solid var(--accent)',
            paddingLeft: 24,
            margin: '28px 0',
            fontStyle: 'italic',
            fontSize: 19,
            color: 'var(--text)',
            lineHeight: 1.6,
          }}
        >
          "The art of programming is the art of organizing complexity." — Edsger W. Dijkstra
        </blockquote>
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-sm, 8px)',
            padding: '20px 24px',
            margin: '24px 0',
          }}
        >
          <p
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--accent)',
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            Key Insight
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
            The best design systems are invisible. Users never notice consistency — they only notice
            inconsistency.
          </p>
        </div>
        <p style={{ marginBottom: 20, textIndent: '1.5em' }}>
          Every abstraction has a maintenance cost. When we introduce a layer of indirection, we
          gain flexibility at the price of indirection. The question is whether the flexibility is
          worth the cost.
        </p>
      </div>
      <span
        style={{
          position: 'absolute',
          bottom: 24,
          right: 32,
          fontSize: 11,
          color: 'var(--text-muted)',
        }}
      >
        {chapter.page}
      </span>
    </div>
  );
}

export default function LMSDashboard() {
  useReveal();
  const [activeTab, setActiveTab] = useState<'video' | 'reading'>('video');
  const [ebookChapter, setEbookChapter] = useState('02');

  return (
    <div style={{ color: 'var(--text)', fontFamily: 'var(--font-body)', position: 'relative' }}>
      <DnaBackground pattern="hexagons" animated="particles" />
      <style>{css}</style>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: '140px 32px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            className="reveal"
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              fontWeight: 500,
              marginBottom: 16,
            }}
          >
            Learning Management
          </div>
          <h1
            className="reveal reveal-delay-1"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 7vw, 80px)',
              fontWeight: 400,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            Learn at your
            <br />
            own <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>pace.</em>
          </h1>
          <p
            className="reveal reveal-delay-2"
            style={{
              fontSize: 18,
              color: 'var(--text-secondary)',
              fontWeight: 300,
              maxWidth: 440,
              margin: '20px auto 0',
            }}
          >
            Courses, lessons, reading, progress tracking, certificates. Education that respects
            attention.
          </p>
        </div>
      </section>

      {/* ═══ COURSES ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal">
            <SH
              label="Catalog"
              title="Browse courses."
              sub="Curated learning paths for every skill level."
            />
          </div>
          <div
            className="lms-courses"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
          >
            {courses.map((c, i) => (
              <div
                key={c.title}
                className={`lms-course reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}
              >
                <div
                  style={{
                    aspectRatio: '16/9',
                    background: 'var(--bg-surface)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      padding: '3px 10px',
                      borderRadius: 999,
                      fontSize: 10,
                      fontWeight: 600,
                      background: c.badgeBg,
                      color: c.badgeC,
                      zIndex: 1,
                    }}
                  >
                    {c.badge}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.cat}</span>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 60%, var(--bg-elevated))',
                    }}
                  />
                </div>
                <div style={{ padding: 20 }}>
                  <div
                    style={{
                      fontSize: 10,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--accent)',
                      fontWeight: 500,
                      marginBottom: 6,
                    }}
                  >
                    {c.cat}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      marginBottom: 6,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: 14,
                    }}
                  >
                    {c.desc}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 12,
                      color: 'var(--text-muted)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'var(--accent-glow)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 9,
                          fontWeight: 600,
                          color: 'var(--accent)',
                        }}
                      >
                        {c.initials}
                      </div>
                      {c.instructor}
                    </div>
                    <span>
                      {c.lessons} lessons · {c.hours}h
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: 4,
                      background: 'var(--bg-surface)',
                      borderRadius: 2,
                      marginTop: 14,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        background: 'var(--accent)',
                        borderRadius: 2,
                        width: `${c.progress}%`,
                        transition: 'width .6s cubic-bezier(0.22,1,0.36,1)',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LESSON EXPERIENCE ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal">
            <SH
              label="Now Playing"
              title="The lesson experience."
              sub="Video player + lesson navigation. Switch between video and reading."
            />
          </div>

          {/* Tab switcher */}
          <div className="reveal" style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
            {(['video', 'reading'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: activeTab === tab ? 600 : 400,
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === tab ? 'var(--accent-glow)' : 'transparent',
                  color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
                  transition: 'all .25s',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {tab === 'video' ? 'Video' : 'Reading'}
              </button>
            ))}
          </div>

          <div
            className="lms-player reveal reveal-delay-1"
            style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}
          >
            {/* Main content — video or reading */}
            <div>
              {activeTab === 'video' ? (
                <div
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius, 12px)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      aspectRatio: '16/9',
                      background: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <button
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: 'none',
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="white"
                        style={{ marginLeft: 3 }}
                      >
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </button>
                  </div>
                  <div style={{ padding: 20 }}>
                    <h2
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 4,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      Lesson 3: Token Architecture
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Building a token system that scales across platforms.
                    </p>
                  </div>
                </div>
              ) : (
                /* Reading experience — from Ebook DNA */
                <div className="lms-reading">
                  <p
                    style={{
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--accent)',
                      marginBottom: 20,
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Chapter 03
                  </p>
                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 32,
                      fontWeight: 400,
                      letterSpacing: '-0.02em',
                      marginBottom: 32,
                      color: 'var(--text)',
                    }}
                  >
                    Token Architecture
                  </h2>
                  <div
                    style={{
                      fontFamily: "'Newsreader', Georgia, serif",
                      fontSize: 17,
                      lineHeight: 1.9,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <p style={{ marginBottom: 20 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 56,
                          float: 'left',
                          lineHeight: 1,
                          marginRight: 12,
                          color: 'var(--accent)',
                        }}
                      >
                        T
                      </span>
                      he first principle of any lasting system is that it must be understood by the
                      people who maintain it. Complexity that cannot be reasoned about cannot be
                      trusted, and systems that cannot be trusted will be replaced.
                    </p>
                    <p style={{ marginBottom: 20, textIndent: '1.5em' }}>
                      This is not an argument against sophistication — it is an argument for
                      clarity. A design token architecture should feel inevitable: each layer exists
                      for a reason, each name communicates its purpose.
                    </p>
                    <blockquote
                      style={{
                        borderLeft: '3px solid var(--accent)',
                        paddingLeft: 24,
                        margin: '28px 0',
                        fontStyle: 'italic',
                        fontSize: 19,
                        color: 'var(--text)',
                        lineHeight: 1.6,
                      }}
                    >
                      A design system is a shared language. If the language cannot be spoken by
                      everyone on the team, it is not a language — it is a dialect.
                    </blockquote>
                    <p style={{ marginBottom: 20, textIndent: '1.5em' }}>
                      The hierarchy of tokens follows a natural progression: from the most primitive
                      values (raw colors, pixel sizes) to the most semantic (what does this color
                      mean, what does this spacing achieve).
                    </p>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 24,
                      right: 32,
                      fontSize: 11,
                      color: 'var(--text-muted)',
                    }}
                  >
                    21
                  </div>
                </div>
              )}
            </div>

            {/* Lesson sidebar */}
            <div
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius, 12px)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Design Systems Fundamentals</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  Module 1 · 6 lessons
                </p>
              </div>
              {lessons.map((l, i) => (
                <div key={l.title} className={`lms-lesson${l.active ? ' active' : ''}`}>
                  <LessonNum i={i + 1} done={l.done} active={l.active} />
                  <div style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{l.title}</div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.dur}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROGRESS ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal">
            <SH
              label="Overview"
              title="Track progress."
              sub="Visual progress rings. Motivation through clarity."
            />
          </div>
          <div
            className="lms-progress reveal reveal-delay-1"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
          >
            {progress.map((p) => (
              <div key={p.name} className="lms-progress-card">
                <ProgressRing pct={p.pct} offset={p.offset} color={p.color} />
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{p.name}</h4>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CERTIFICATE ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal">
            <SH label="Recognition" title="Earn recognition." sub="Certificates that matter." />
          </div>
          <div
            className="lms-cert reveal reveal-delay-1"
            style={{
              maxWidth: 560,
              margin: '0 auto',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius, 12px)',
              padding: 48,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                position: 'relative',
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M12 15l-3 3 1-4-3-3h4L12 7l1 4h4l-3 3 1 4z" />
              </svg>
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 400,
                letterSpacing: '-0.02em',
                marginBottom: 8,
                position: 'relative',
              }}
            >
              Certificate of Completion
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', position: 'relative' }}>
              Git Fundamentals
            </p>
            <p style={{ fontSize: 16, fontWeight: 500, margin: '12px 0', position: 'relative' }}>
              Ana Souza
            </p>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', position: 'relative' }}>
              Completed March 15, 2026 · 8 lessons · 3 hours
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                marginTop: 8,
                position: 'relative',
              }}
            >
              Issued by APEX Academy
            </div>
          </div>
        </div>
      </section>

      {/* ═══ E-BOOK: COVER ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <SH
              label="E-Book"
              title="Long-form reading."
              sub="Book covers, table of contents, reader view, callouts, sidenotes."
            />
          </div>
          <div className="reveal reveal-delay-1">
            <BookCover />
          </div>
        </div>
      </section>

      {/* ═══ E-BOOK: READER ═══ */}
      <section style={{ padding: '0 32px 100px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <p
              style={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--accent)',
                marginBottom: 12,
              }}
            >
              E-Book Reader
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                marginBottom: 12,
              }}
            >
              Reading that <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>flows.</em>
            </h2>
          </div>
          <div
            className="reveal reveal-delay-1"
            style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 48 }}
          >
            <EbookTOC chapters={ebookChapters} active={ebookChapter} onSelect={setEbookChapter} />
            <EbookReader
              chapter={ebookChapters.find((c) => c.num === ebookChapter) ?? ebookChapters[1]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
