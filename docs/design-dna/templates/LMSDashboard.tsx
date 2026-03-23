// Copy this file into your app and customize
// DNA source: docs/design-dna/lms.html
// Palette: bg=#08080a, elevated=#111114, accent=#636bf0, font=Inter + Instrument Serif

import React, { useState, useEffect, useRef } from "react";
import { PageShell, Sidebar } from "../starters/layout";
import { SectionHeader, Card, Badge, ProgressBar, ProgressRing } from "../starters/primitives";

// --- Reveal hook ---

function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// --- Sample data ---

interface Course {
  id: string; title: string; category: string; description: string;
  level: "Beginner" | "Intermediate" | "Advanced"; instructor: string;
  lessons: number; duration: string; progress: number;
}

interface Lesson { id: string; title: string; duration: string; status: "done" | "active" | "pending"; }
interface Achievement { id: string; title: string; description: string; earned: boolean; }

const COURSES: Course[] = [
  { id: "1", title: "Design Systems Fundamentals", category: "Design", description: "Build scalable design systems from scratch. Tokens, components, documentation.", level: "Beginner", instructor: "Ana Souza", lessons: 12, duration: "4h", progress: 65 },
  { id: "2", title: "TypeScript Patterns", category: "Engineering", description: "Advanced type-level programming. Generics, mapped types, conditional types.", level: "Intermediate", instructor: "Marcus Chen", lessons: 18, duration: "6h", progress: 30 },
  { id: "3", title: "Scaling React Applications", category: "Architecture", description: "State management, code splitting, performance. Production patterns that scale.", level: "Advanced", instructor: "David Lee", lessons: 24, duration: "8h", progress: 0 },
];

const LESSONS: Lesson[] = [
  { id: "1", title: "What is a Design System?", duration: "12:30", status: "done" },
  { id: "2", title: "Token Fundamentals", duration: "18:45", status: "done" },
  { id: "3", title: "Token Architecture", duration: "22:10", status: "active" },
  { id: "4", title: "Component Patterns", duration: "15:00", status: "pending" },
  { id: "5", title: "Documentation", duration: "10:20", status: "pending" },
  { id: "6", title: "Maintenance & Evolution", duration: "14:55", status: "pending" },
];

const ACHIEVEMENTS: Achievement[] = [
  { id: "1", title: "First Lesson", description: "Complete your first lesson", earned: true },
  { id: "2", title: "Halfway There", description: "Reach 50% on any course", earned: true },
  { id: "3", title: "Speed Learner", description: "Complete 3 lessons in one day", earned: false },
  { id: "4", title: "Certified", description: "Finish a full course", earned: false },
];

const PROGRESS_STATS = [
  { label: "Design Systems", sublabel: "8 of 12 lessons", percentage: 65 },
  { label: "TypeScript", sublabel: "5 of 18 lessons", percentage: 30 },
  { label: "Git Fundamentals", sublabel: "Completed", percentage: 100 },
  { label: "Scaling React", sublabel: "Not started", percentage: 0 },
];

const levelVariant: Record<Course["level"], "success" | "warning" | "error"> = {
  Beginner: "success", Intermediate: "warning", Advanced: "error",
};

// --- Sub-components ---

function CourseCard({ course }: { course: Course }) {
  return (
    <Card>
      <Card.Thumbnail>
        <span className="text-[12px]" style={{ color: "var(--text-muted)", zIndex: 1, position: "relative" }}>
          {course.category}
        </span>
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
          <Badge variant={levelVariant[course.level]}>{course.level}</Badge>
        </div>
      </Card.Thumbnail>
      <Card.Body>
        <p className="text-[10px] uppercase tracking-[0.08em] font-medium mb-1.5" style={{ color: "var(--accent)" }}>{course.category}</p>
        <h3 className="text-[18px] font-semibold tracking-tight mb-1.5" style={{ color: "var(--text)" }}>{course.title}</h3>
        <p className="text-[13px] leading-relaxed mb-3.5" style={{ color: "var(--text-secondary)" }}>{course.description}</p>
        <div className="flex justify-between items-center text-[12px]" style={{ color: "var(--text-muted)" }}>
          <span>{course.instructor}</span>
          <span>{course.lessons} lessons · {course.duration}</span>
        </div>
        <div className="mt-3.5"><ProgressBar percentage={course.progress} /></div>
      </Card.Body>
    </Card>
  );
}

function LessonItem({ lesson }: { lesson: Lesson }) {
  const isDone = lesson.status === "done";
  const isActive = lesson.status === "active";
  return (
    <div
      className="flex items-center gap-3 px-5 py-3.5 border-b last:border-0 cursor-pointer transition-colors duration-200"
      style={{ borderColor: "var(--border)", background: isActive ? "var(--accent-glow)" : "transparent" }}
      tabIndex={0} role="button" aria-current={isActive ? "step" : undefined}
    >
      <div
        className="w-7 h-7 rounded-full border flex items-center justify-center text-[11px] font-semibold shrink-0 transition-all duration-200"
        style={{
          borderColor: isDone ? "var(--success)" : isActive ? "var(--accent)" : "var(--border)",
          color: isDone ? "var(--success)" : isActive ? "var(--accent)" : "var(--text-muted)",
          background: isDone ? "rgba(52,211,153,0.1)" : isActive ? "var(--accent-glow)" : "transparent",
        }}
      >
        {isDone ? "✓" : lesson.id}
      </div>
      <p className="flex-1 text-[13px] font-medium" style={{ color: "var(--text)" }}>{lesson.title}</p>
      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{lesson.duration}</span>
    </div>
  );
}

// --- Page ---

export default function LMSDashboard() {
  const [activeTab, setActiveTab] = useState<"courses" | "lesson" | "progress" | "achievements">("courses");

  const heroLabelRef = useReveal() as React.RefObject<HTMLDivElement>;
  const heroH1Ref = useReveal() as React.RefObject<HTMLHeadingElement>;
  const heroSubRef = useReveal() as React.RefObject<HTMLParagraphElement>;
  const catalogRef = useReveal() as React.RefObject<HTMLElement>;
  const lessonRef = useReveal() as React.RefObject<HTMLElement>;
  const progressRef = useReveal() as React.RefObject<HTMLElement>;
  const achieveRef = useReveal() as React.RefObject<HTMLElement>;
  const certRef = useReveal() as React.RefObject<HTMLElement>;

  const sidebarSections = [
    {
      items: [
        { label: "Courses", href: "#courses", active: activeTab === "courses", icon: (<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="14" height="14" rx="2" /><path d="M7 7h6M7 10h4" /></svg>) },
        { label: "Current Lesson", href: "#lesson", active: activeTab === "lesson", icon: (<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="7" /><path d="M8 7l5 3-5 3V7z" /></svg>) },
        { label: "Progress", href: "#progress", active: activeTab === "progress", icon: (<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 17l4-6 4 3 4-8" strokeLinecap="round" strokeLinejoin="round" /></svg>) },
        { label: "Achievements", href: "#achievements", active: activeTab === "achievements", icon: (<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="8" r="5" /><path d="M6.5 13l-2 5 5.5-2 5.5 2-2-5" /></svg>) },
      ],
    },
  ];

  return (
    <PageShell
      sidebar={
        <Sidebar
          logo={<span className="text-[15px] font-semibold tracking-tight" style={{ color: "var(--text)" }}>Learn</span>}
          sections={sidebarSections}
          sidebarWidth={220}
        />
      }
      sidebarWidth={220}
    >
      <style>{`
        .reveal{opacity:0;transform:translateY(32px) scale(0.98);filter:blur(4px);transition:all 0.9s cubic-bezier(0.22,1,0.36,1)}
        .reveal.visible{opacity:1;transform:none;filter:none}
        .reveal-delay-1{transition-delay:0.1s}
        .reveal-delay-2{transition-delay:0.2s}
        .reveal-delay-3{transition-delay:0.3s}
        @media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;filter:none}}
        .cert-card{max-width:560px;margin:0 auto;border:1px solid var(--border);border-radius:12px;padding:48px;text-align:center;position:relative;overflow:hidden}
        .cert-card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,var(--accent-glow),transparent 60%)}
        .cert-badge{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-hover));display:flex;align-items:center;justify-content:center;margin:0 auto 20px;position:relative}
      `}</style>

      {/* Hero */}
      <section style={{ paddingTop: 80, paddingBottom: 60, textAlign: "center" }}>
        <div className="reveal" ref={heroLabelRef} style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>
          Learning Management
        </div>
        <h1
          className="reveal reveal-delay-1"
          ref={heroH1Ref}
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px,7vw,80px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 20 }}
        >
          Learn at your<br />own <em style={{ fontStyle: "italic", color: "var(--accent)" }}>pace.</em>
        </h1>
        <p
          className="reveal reveal-delay-2"
          ref={heroSubRef}
          style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300, maxWidth: 440, margin: "0 auto" }}
        >
          Courses, lessons, progress tracking, certificates. Education that respects attention.
        </p>
      </section>

      {/* Course catalog */}
      <section id="courses" className="mb-16 reveal" ref={catalogRef}>
        <SectionHeader label="Catalog" title="Browse courses." subtitle="Curated learning paths for every skill level." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map(course => <CourseCard key={course.id} course={course} />)}
        </div>
      </section>

      {/* Lesson player */}
      <section id="lesson" className="mb-16 reveal" ref={lessonRef}>
        <SectionHeader label="Now Playing" title="The lesson experience." subtitle="Video player + lesson navigation. Focused learning." />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card hover={false}>
            <Card.Thumbnail>
              <button
                className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110"
                style={{ background: "var(--accent)" }}
                aria-label="Play lesson"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="white" style={{ marginLeft: 3 }}>
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </button>
            </Card.Thumbnail>
            <Card.Body>
              <h2 className="text-[18px] font-semibold tracking-tight mb-1" style={{ color: "var(--text)" }}>Lesson 3: Design Token Architecture</h2>
              <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>Building a token system that scales across platforms and themes.</p>
            </Card.Body>
          </Card>
          <Card hover={false}>
            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Design Systems Fundamentals</h3>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>Module 1 · 6 lessons</p>
            </div>
            <div>{LESSONS.map(lesson => <LessonItem key={lesson.id} lesson={lesson} />)}</div>
          </Card>
        </div>
      </section>

      {/* Progress overview */}
      <section id="progress" className="mb-16 reveal" ref={progressRef}>
        <SectionHeader label="Overview" title="Track progress." subtitle="Visual progress rings. Motivation through clarity." />
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {PROGRESS_STATS.map(stat => (
            <Card key={stat.label}>
              <Card.Body className="text-center">
                <div className="flex justify-center mb-3"><ProgressRing percentage={stat.percentage} size={64} /></div>
                <h4 className="text-[14px] font-semibold mb-0.5" style={{ color: "var(--text)" }}>{stat.label}</h4>
                <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>{stat.sublabel}</p>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      {/* Achievement badges */}
      <section id="achievements" className="mb-16 reveal" ref={achieveRef}>
        <SectionHeader label="Milestones" title="Achievements." subtitle="Earn badges as you learn." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACHIEVEMENTS.map(a => (
            <Card key={a.id} hover={a.earned}>
              <Card.Body className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: a.earned ? "linear-gradient(135deg, var(--accent), var(--accent-hover))" : "var(--bg-surface)" }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
                    stroke={a.earned ? "white" : "var(--text-muted)"} strokeWidth="2">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M8.5 14L6 21l6-2 6 2-2.5-7" />
                  </svg>
                </div>
                <h4 className="text-[14px] font-semibold mb-0.5" style={{ color: a.earned ? "var(--text)" : "var(--text-muted)" }}>{a.title}</h4>
                <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>{a.description}</p>
                {a.earned && <Badge variant="success" className="mt-2">Earned</Badge>}
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      {/* Certificate */}
      <section id="certificate" className="mb-16 reveal" ref={certRef}>
        <SectionHeader label="Recognition" title="Earn recognition." subtitle="Certificates that matter." />
        <div className="cert-card reveal-delay-1" style={{ background: "var(--bg-elevated)" }}>
          <div className="cert-badge">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 15l-3 3 1-4-3-3h4L12 7l1 4h4l-3 3 1 4z" />
            </svg>
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 8, position: "relative" }}>
            Certificate of Completion
          </h3>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", position: "relative", marginBottom: 4 }}>Git Fundamentals</p>
          <p style={{ fontSize: 16, fontWeight: 500, margin: "12px 0", position: "relative" }}>Ana Souza</p>
          <div style={{ fontSize: 12, color: "var(--text-muted)", position: "relative" }}>Completed March 15, 2026 · 8 lessons · 3 hours</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8, position: "relative" }}>Issued by APEX Academy</div>
        </div>
      </section>
    </PageShell>
  );
}
