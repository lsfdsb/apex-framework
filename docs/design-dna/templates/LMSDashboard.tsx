// Copy this file into your app and customize
// Visual reference: docs/design-dna/lms.html
// DNA: bg=#08080a, accent=#636bf0, font-display=Instrument Serif

import React, { useEffect } from "react";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const dnaStyles = `
.reveal{opacity:0;transform:translateY(32px) scale(0.98);filter:blur(4px);transition:all .9s cubic-bezier(0.22,1,0.36,1)}
.reveal.visible{opacity:1;transform:none;filter:none}
.reveal-delay-1{transition-delay:.1s}.reveal-delay-2{transition-delay:.2s}.reveal-delay-3{transition-delay:.3s}
.lms-course{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius,12px);overflow:hidden;transition:all .4s cubic-bezier(0.22,1,0.36,1);cursor:pointer}
.lms-course:hover{border-color:var(--border-hover);transform:translateY(-3px)}
.lms-lesson{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .2s}
.lms-lesson:last-child{border:none}
.lms-lesson:hover{background:var(--bg-surface)}
.lms-lesson.active{background:var(--accent-glow)}
.lms-progress-card{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius,12px);padding:24px;text-align:center;transition:all .3s cubic-bezier(0.22,1,0.36,1)}
.lms-progress-card:hover{border-color:var(--border-hover);transform:translateY(-2px)}
.lms-cert::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,var(--accent-glow),transparent 60%)}
@media(max-width:768px){.lms-courses{grid-template-columns:1fr!important}.lms-player{grid-template-columns:1fr!important}.lms-progress{grid-template-columns:repeat(2,1fr)!important}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}.reveal{opacity:1;transform:none;filter:none}}
`;

const courses = [
  { cat: "Design", title: "Design Systems Fundamentals", desc: "Build scalable design systems from scratch. Tokens, components, documentation.", instructor: "Ana Souza", initials: "AS", lessons: 12, hours: 4, progress: 65, badge: "Beginner", badgeBg: "rgba(52,211,153,0.15)", badgeC: "var(--success)" },
  { cat: "Engineering", title: "TypeScript Patterns", desc: "Advanced type-level programming. Generics, mapped types, conditional types.", instructor: "Marcus Chen", initials: "MC", lessons: 18, hours: 6, progress: 30, badge: "Intermediate", badgeBg: "rgba(251,191,36,0.15)", badgeC: "var(--warning)" },
  { cat: "Architecture", title: "Scaling React Applications", desc: "State management, code splitting, performance. Production patterns that scale.", instructor: "David Lee", initials: "DL", lessons: 24, hours: 8, progress: 0, badge: "Advanced", badgeBg: "rgba(248,113,113,0.15)", badgeC: "var(--destructive)" },
];
const lessons = [
  { title: "What is a Design System?", duration: "12:30", done: true },
  { title: "Token Fundamentals", duration: "18:45", done: true },
  { title: "Token Architecture", duration: "22:10", active: true },
  { title: "Component Patterns", duration: "15:00" },
  { title: "Documentation", duration: "10:20" },
  { title: "Maintenance & Evolution", duration: "14:55" },
];
const progress = [
  { name: "Design Systems", sub: "8 of 12 lessons", pct: 65, offset: 62 },
  { name: "TypeScript", sub: "5 of 18 lessons", pct: 30, offset: 123 },
  { name: "Git Fundamentals", sub: "Completed", pct: 100, offset: 0, color: "var(--success)" },
  { name: "Scaling React", sub: "Not started", pct: 0, offset: 176 },
];

function SH({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>{label}</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>{title}</h2>
      {sub && <p style={{ fontSize: 17, color: "var(--text-secondary)", fontWeight: 300 }}>{sub}</p>}
    </div>
  );
}

export default function LMSDashboard() {
  useReveal();
  return (
    <div style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <style>{dnaStyles}</style>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: "140px 32px 100px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>Learning Management</div>
          <h1 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 7vw, 80px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1 }}>
            Learn at your<br />own <em style={{ fontStyle: "italic", color: "var(--accent)" }}>pace.</em>
          </h1>
          <p className="reveal reveal-delay-2" style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300, maxWidth: 440, margin: "20px auto 0" }}>Courses, lessons, progress tracking, certificates. Education that respects attention.</p>
        </div>
      </section>

      {/* ═══ COURSES ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Catalog" title="Browse courses." sub="Curated learning paths for every skill level." /></div>
          <div className="lms-courses" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {courses.map((c, i) => (
              <div key={c.title} className={`lms-course reveal${i > 0 ? ` reveal-delay-${i}` : ""}`}>
                <div style={{ aspectRatio: "16/9", background: "var(--bg-surface)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <span style={{ position: "absolute", top: 12, right: 12, padding: "3px 10px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: c.badgeBg, color: c.badgeC, zIndex: 1 }}>{c.badge}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.cat}</span>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 60%, var(--bg-elevated))" }} />
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent)", fontWeight: 500, marginBottom: 6 }}>{c.cat}</div>
                  <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 6 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 14 }}>{c.desc}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--text-muted)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--accent-glow)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, color: "var(--accent)" }}>{c.initials}</div>
                      {c.instructor}
                    </div>
                    <span>{c.lessons} lessons · {c.hours}h</span>
                  </div>
                  <div style={{ width: "100%", height: 4, background: "var(--bg-surface)", borderRadius: 2, marginTop: 14, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "var(--accent)", borderRadius: 2, width: `${c.progress}%`, transition: "width .6s cubic-bezier(0.22,1,0.36,1)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LESSON PLAYER ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Now Playing" title="The lesson experience." sub="Video player + lesson navigation. Focused learning." /></div>
          <div className="lms-player reveal reveal-delay-1" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
            <div>
              <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", overflow: "hidden" }}>
                <div style={{ aspectRatio: "16/9", background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <button style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none", transition: "all .3s cubic-bezier(0.22,1,0.36,1)" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 3 }}><polygon points="5,3 19,12 5,21" /></svg>
                  </button>
                </div>
                <div style={{ padding: 20 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, letterSpacing: "-0.01em" }}>Lesson 3: Design Token Architecture</h2>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Building a token system that scales across platforms and themes.</p>
                </div>
              </div>
            </div>
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Design Systems Fundamentals</h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Module 1 · 6 lessons</p>
              </div>
              {lessons.map((l, i) => (
                <div key={l.title} className={`lms-lesson${l.active ? " active" : ""}`}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${l.done ? "var(--success)" : l.active ? "var(--accent)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0, color: l.done ? "var(--success)" : l.active ? "var(--accent)" : "var(--text-muted)", background: l.done ? "rgba(52,211,153,0.1)" : l.active ? "var(--accent-glow)" : "transparent" }}>
                    {l.done ? "✓" : i + 1}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{l.title}</div>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{l.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROGRESS ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Overview" title="Track progress." sub="Visual progress rings. Motivation through clarity." /></div>
          <div className="lms-progress reveal reveal-delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {progress.map((p) => (
              <div key={p.name} className="lms-progress-card">
                <div style={{ width: 64, height: 64, margin: "0 auto 12px", position: "relative" }}>
                  <svg viewBox="0 0 64 64" width="64" height="64" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border)" strokeWidth="4" />
                    <circle cx="32" cy="32" r="28" fill="none" stroke={p.color || "var(--accent)"} strokeWidth="4" strokeLinecap="round" strokeDasharray="176" strokeDashoffset={p.offset} style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: p.color }}>{p.pct}%</div>
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{p.name}</h4>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CERTIFICATE ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Recognition" title="Earn recognition." sub="Certificates that matter." /></div>
          <div className="lms-cert reveal reveal-delay-1" style={{ maxWidth: 560, margin: "0 auto", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", padding: 48, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent-hover))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", position: "relative" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 15l-3 3 1-4-3-3h4L12 7l1 4h4l-3 3 1 4z" /></svg>
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 8, position: "relative" }}>Certificate of Completion</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", position: "relative" }}>Git Fundamentals</p>
            <p style={{ fontSize: 16, fontWeight: 500, margin: "12px 0", position: "relative" }}>Ana Souza</p>
            <div style={{ fontSize: 12, color: "var(--text-muted)", position: "relative" }}>Completed March 15, 2026 · 8 lessons · 3 hours</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8, position: "relative" }}>Issued by APEX Academy</div>
          </div>
        </div>
      </section>
    </div>
  );
}
