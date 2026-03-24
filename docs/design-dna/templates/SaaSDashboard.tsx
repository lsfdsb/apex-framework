// Copy this file into your app and customize
// Visual reference: docs/design-dna/saas.html
// DNA palette: bg=#09090b, accent=#3b82f6, sidebar 220px, stats 4-col grid

import React, { useEffect, useState } from "react";
import { DnaBackground } from "../starters/patterns/DnaBackground";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const dnaStyles = `
.reveal{opacity:0;transform:translateY(32px) scale(0.98);filter:blur(4px);transition:all .9s cubic-bezier(0.22,1,0.36,1)}
.reveal.visible{opacity:1;transform:none;filter:none}
.reveal-delay-1{transition-delay:.1s}.reveal-delay-2{transition-delay:.2s}.reveal-delay-3{transition-delay:.3s}
.saas-stat{transition:all .3s cubic-bezier(0.22,1,0.36,1)}.saas-stat:hover{border-color:var(--border-hover)!important;transform:translateY(-2px)}
.saas-stat:hover .spark-bar{background:var(--accent)!important}
.chart-bar{flex:1;background:var(--accent-glow);border-radius:4px 4px 0 0;transition:background .3s;min-height:4px;position:relative}
.chart-bar:hover{background:var(--accent)}
.chart-bar:hover::after{content:attr(data-value);position:absolute;top:-24px;left:50%;transform:translateX(-50%);font-size:10px;color:var(--text);background:var(--bg-elevated);padding:2px 6px;border-radius:4px;border:1px solid var(--border);white-space:nowrap}
.saas-sidebar-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;font-size:13px;color:var(--text-secondary);cursor:pointer;transition:all .2s}
.saas-sidebar-item:hover{background:var(--bg-elevated);color:var(--text)}
.saas-sidebar-item.active{background:var(--accent-glow);color:var(--accent)}
.saas-table-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 80px;padding:14px 20px;border-bottom:1px solid var(--border);font-size:14px;align-items:center;transition:background .2s}
.saas-table-row:last-child{border:none}.saas-table-row:hover{background:var(--bg-elevated)}
.settings-nav-item{padding:8px 14px;border-radius:8px;font-size:13px;color:var(--text-secondary);cursor:pointer;transition:all .2s}
.settings-nav-item:hover{background:var(--bg-elevated);color:var(--text)}.settings-nav-item.active{background:var(--accent-glow);color:var(--accent)}
.saas-toggle{width:40px;height:22px;border-radius:11px;background:var(--border);position:relative;cursor:pointer;transition:background .3s}
.saas-toggle.on{background:var(--accent)}
.saas-toggle::after{content:'';width:18px;height:18px;border-radius:50%;background:white;position:absolute;top:2px;left:2px;transition:transform .3s cubic-bezier(0.22,1,0.36,1)}
.saas-toggle.on::after{transform:translateX(18px)}
@media(max-width:768px){.saas-app-layout{grid-template-columns:1fr!important}.saas-sidebar{display:none!important}
  .saas-stats{grid-template-columns:repeat(2,1fr)!important}.settings-layout{grid-template-columns:1fr!important}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}.reveal{opacity:1;transform:none;filter:none}}
`;

// ── Data ─────────────────────────────────────────────
const statsData = [
  { label: "Revenue", value: "$45.2k", delta: "+12.5%", up: true, sparks: [30,45,38,52,48,65,58,72,64,80] },
  { label: "Users", value: "2,847", delta: "+8.2%", up: true, sparks: [40,35,50,45,55,48,60,52,65,70] },
  { label: "Conversion", value: "3.6%", delta: "-0.4%", up: false, sparks: [50,48,52,45,40,42,38,36,35,34] },
  { label: "Avg. Order", value: "$64", delta: "+2.1%", up: true, sparks: [35,40,38,42,44,43,48,50,52,55] },
];
const chartBars = [42,58,35,72,55,88,65,82,48,90,68,78,52,85,60,95,70,82,55,88,72,65,80,58];
const users = [
  { name: "Ana Souza", email: "ana@acme.com", initials: "AS", status: "Active", role: "Admin", last: "2 min ago" },
  { name: "Marcus Chen", email: "marcus@acme.com", initials: "MC", status: "Active", role: "Editor", last: "1 hour ago" },
  { name: "Julia Park", email: "julia@acme.com", initials: "JP", status: "Pending", role: "Viewer", last: "3 days ago" },
  { name: "David Lee", email: "david@acme.com", initials: "DL", status: "Inactive", role: "Viewer", last: "2 weeks ago" },
];

function AppFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", overflow: "hidden" }}>
      <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
        <span style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", fontSize: 12, color: "var(--text-muted)" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function SidebarIcon({ d }: { d: string }) {
  return <svg style={{ width: 16, height: 16, opacity: 0.5 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d} /></svg>;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    Active: { bg: "rgba(34,197,94,0.1)", color: "var(--success)" },
    Inactive: { bg: "rgba(113,113,122,0.1)", color: "var(--text-muted)" },
    Pending: { bg: "rgba(234,179,8,0.1)", color: "var(--warning)" },
  };
  const c = colors[status] || colors.Inactive;
  return <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500, background: c.bg, color: c.color }}>{status}</span>;
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return <div className={`saas-toggle${on ? " on" : ""}`} onClick={() => setOn(!on)} />;
}

export default function SaaSDashboard() {
  useReveal();
  return (
    <div style={{ color: "var(--text)", fontFamily: "var(--font-body)", position: "relative" }}>
      <DnaBackground pattern="grid" animated="gradient" />
      <style>{dnaStyles}</style>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: "140px 32px 100px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>SaaS Application</div>
          <h1 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 7vw, 80px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1 }}>
            Apps that respect<br />your <em style={{ fontStyle: "italic", color: "var(--accent)" }}>time.</em>
          </h1>
          <p className="reveal reveal-delay-2" style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300, maxWidth: 440, margin: "20px auto 0" }}>Dashboard, tables, settings, empty states. Every pattern a SaaS app needs.</p>
        </div>
      </section>

      {/* ═══ DASHBOARD ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>The dashboard.</h2>
            <p style={{ fontSize: 17, color: "var(--text-secondary)", fontWeight: 300 }}>Information hierarchy. No clutter.</p>
          </div>
          <AppFrame title="Dashboard — Acme Analytics">
            <div className="saas-app-layout" style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 560 }}>
              <div className="saas-sidebar" style={{ background: "var(--bg)", borderRight: "1px solid var(--border)", padding: "20px 12px" }}>
                <div style={{ fontWeight: 600, fontSize: 14, padding: "4px 12px", marginBottom: 20, letterSpacing: "-0.01em" }}>Acme</div>
                <div className="saas-sidebar-item active"><SidebarIcon d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />Overview</div>
                <div className="saas-sidebar-item"><SidebarIcon d="M22 12l-4 0l-3 9l-6-18l-3 9l-4 0" />Analytics</div>
                <div className="saas-sidebar-item"><SidebarIcon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />Users<span style={{ marginLeft: "auto", fontSize: 10, padding: "1px 6px", borderRadius: 999, background: "var(--accent)", color: "var(--accent-contrast, white)" }}>24</span></div>
                <div className="saas-sidebar-item"><SidebarIcon d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6" />Messages</div>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", padding: "8px 12px 4px", marginTop: 12 }}>Settings</div>
                <div className="saas-sidebar-item"><SidebarIcon d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />Preferences</div>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>Overview</h2>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ padding: "7px 16px", borderRadius: "var(--radius-sm, 8px)", fontSize: 13, fontWeight: 500, cursor: "pointer", background: "none", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>Export</button>
                    <button style={{ padding: "7px 16px", borderRadius: "var(--radius-sm, 8px)", fontSize: 13, fontWeight: 500, cursor: "pointer", background: "var(--accent)", color: "var(--accent-contrast, white)", border: "none" }}>Add metric</button>
                  </div>
                </div>
                <div className="saas-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
                  {statsData.map((s) => {
                    const max = Math.max(...s.sparks);
                    return (
                      <div key={s.label} className="saas-stat" style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", padding: 20 }}>
                        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: 8 }}>{s.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em" }}>{s.value}</div>
                        <div style={{ fontSize: 12, marginTop: 6, display: "flex", alignItems: "center", gap: 4, color: s.up ? "var(--success)" : "var(--destructive)" }}>{s.up ? "↑" : "↓"} {s.delta}</div>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, marginTop: 12, height: 24 }}>
                          {s.sparks.map((v, i) => <div key={i} className="spark-bar" style={{ flex: 1, background: "var(--accent-glow)", borderRadius: 2, minHeight: 3, height: `${(v / max) * 100}%`, transition: "background .3s" }} />)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)" }}>
                  <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600 }}>Revenue</h3>
                    <div style={{ display: "flex", gap: 4 }}>
                      {["7d", "30d", "90d"].map((t, i) => <button key={t} style={{ padding: "4px 12px", borderRadius: 6, fontSize: 12, border: "none", background: i === 0 ? "var(--accent-glow)" : "none", color: i === 0 ? "var(--accent)" : "var(--text-muted)", cursor: "pointer" }}>{t}</button>)}
                    </div>
                  </div>
                  <div style={{ padding: 20, height: 200, display: "flex", alignItems: "flex-end", gap: 6 }}>
                    {chartBars.map((h, i) => <div key={i} className="chart-bar" style={{ height: `${h}%` }} data-value={`$${h * 52}`} />)}
                  </div>
                </div>
              </div>
            </div>
          </AppFrame>
        </div>
      </section>

      {/* ═══ DATA TABLE ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>Tables that tell stories.</h2>
            <p style={{ fontSize: 17, color: "var(--text-secondary)", fontWeight: 300 }}>Not spreadsheets. Information with hierarchy.</p>
          </div>
          <AppFrame title="Users">
            <div style={{ padding: 20 }}>
              <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px", padding: "10px 20px", borderBottom: "1px solid var(--border)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
                  <span>User</span><span>Status</span><span>Role</span><span>Last active</span><span></span>
                </div>
                {users.map((u) => (
                  <div key={u.email} className="saas-table-row">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent-glow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "var(--accent)" }}>{u.initials}</div>
                      <div><div style={{ fontWeight: 500, fontSize: 13 }}>{u.name}</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>{u.email}</div></div>
                    </div>
                    <StatusBadge status={u.status} />
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{u.role}</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{u.last}</span>
                    <span style={{ fontSize: 16, color: "var(--text-muted)", cursor: "pointer", textAlign: "center" }}>···</span>
                  </div>
                ))}
              </div>
            </div>
          </AppFrame>
        </div>
      </section>

      {/* ═══ SETTINGS ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>Settings that make sense.</h2>
            <p style={{ fontSize: 17, color: "var(--text-secondary)", fontWeight: 300 }}>Organized. Clear. No hunting.</p>
          </div>
          <AppFrame title="Settings">
            <div style={{ padding: 24 }}>
              <div className="settings-layout" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {["Profile", "Notifications", "Security", "Billing", "Team"].map((item, i) => (
                    <div key={item} className={`settings-nav-item${i === 0 ? " active" : ""}`}>{item}</div>
                  ))}
                </div>
                <div>
                  <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", padding: 28, marginBottom: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, letterSpacing: "-0.01em" }}>Profile</h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>Your public information.</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
                      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-glow), var(--bg-surface))", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Profile photo</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>JPG, PNG or SVG. 1MB max.</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button style={{ padding: "5px 12px", borderRadius: "var(--radius-sm, 8px)", fontSize: 12, background: "none", color: "var(--text-secondary)", border: "1px solid var(--border)", cursor: "pointer" }}>Upload</button>
                          <button style={{ padding: "5px 12px", borderRadius: "var(--radius-sm, 8px)", fontSize: 12, background: "none", color: "var(--text-secondary)", border: "1px solid var(--border)", cursor: "pointer" }}>Remove</button>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                      {[["First name", "Ana"], ["Last name", "Souza"]].map(([label, val]) => (
                        <div key={label} style={{ marginBottom: 0 }}>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>{label}</label>
                          <input type="text" defaultValue={val} style={{ width: "100%", padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", outline: "none" }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Email</label>
                      <input type="text" defaultValue="ana@acme.com" style={{ width: "100%", padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", outline: "none" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                      <button style={{ padding: "7px 16px", borderRadius: "var(--radius-sm, 8px)", fontSize: 13, fontWeight: 500, background: "none", color: "var(--text-secondary)", border: "1px solid var(--border)", cursor: "pointer" }}>Cancel</button>
                      <button style={{ padding: "7px 16px", borderRadius: "var(--radius-sm, 8px)", fontSize: 13, fontWeight: 500, background: "var(--accent)", color: "var(--accent-contrast, white)", border: "none", cursor: "pointer" }}>Save changes</button>
                    </div>
                  </div>
                  <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm, 8px)", padding: 28 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, letterSpacing: "-0.01em" }}>Notifications</h3>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>Choose what you hear about.</p>
                    {[
                      { label: "Email notifications", desc: "Get notified about new activity", on: true },
                      { label: "Push notifications", desc: "Browser push alerts", on: false },
                      { label: "Weekly digest", desc: "Summary every Monday", on: true },
                    ].map((t, i) => (
                      <div key={t.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                        <div><div style={{ fontSize: 14 }}>{t.label}</div><div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.desc}</div></div>
                        <Toggle defaultOn={t.on} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AppFrame>
        </div>
      </section>

      {/* ═══ EMPTY STATE ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>Empty states with soul.</h2>
            <p style={{ fontSize: 17, color: "var(--text-secondary)", fontWeight: 300 }}>The first thing users see. Make it count.</p>
          </div>
          <AppFrame title="Projects">
            <div style={{ textAlign: "center", padding: "80px 32px" }}>
              <div style={{ width: 64, height: 64, margin: "0 auto 20px", borderRadius: 16, background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No projects yet</h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>Create your first project to get started.</p>
              <button style={{ padding: "7px 16px", borderRadius: "var(--radius-sm, 8px)", fontSize: 13, fontWeight: 500, background: "var(--accent)", color: "var(--accent-contrast, white)", border: "none", cursor: "pointer" }}>Create project</button>
            </div>
          </AppFrame>
        </div>
      </section>
    </div>
  );
}
