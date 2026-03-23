// Copy this file into your app and customize
// DNA source: docs/design-dna/design-system.html
// Palette: bg=#08080a, elevated=#111114, accent=#636bf0, font=Inter + Instrument Serif

import React, { useEffect, useState } from "react";
import Select from "./crm/Select";
import Toggle from "./crm/Toggle";
import Textarea from "./crm/Textarea";
import SearchInput from "./crm/SearchInput";
import DatePicker from "./crm/DatePicker";
import Tooltip from "./crm/Tooltip";
import ConfirmDialog from "./crm/ConfirmDialog";

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
.ds-swatch-color{height:64px;border-radius:var(--radius-sm,8px);border:1px solid var(--border);margin-bottom:6px;transition:transform .3s cubic-bezier(0.22,1,0.36,1)}
.ds-swatch-color:hover{transform:scale(1.08)}
.ds-space-box{background:var(--accent-glow);border:1px solid var(--accent);border-radius:4px;transition:transform .3s}
.ds-space-box:hover{transform:scale(1.1)}
.ds-motion-card{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius,12px);padding:24px;text-align:center;cursor:pointer}
.ds-motion-card:hover .ds-motion-demo{animation-play-state:running!important}
.ds-motion-demo{width:40px;height:40px;background:var(--accent);border-radius:8px;margin:0 auto 16px;animation-play-state:paused}
@keyframes ds-fade{0%,100%{opacity:.2}50%{opacity:1}}
@keyframes ds-slide{0%,100%{transform:translateY(12px)}50%{transform:translateY(-12px)}}
@keyframes ds-scale{0%,100%{transform:scale(.7)}50%{transform:scale(1.1)}}
@keyframes ds-blur{0%,100%{filter:blur(6px);opacity:.3}50%{filter:blur(0);opacity:1}}
@keyframes ds-bounce{0%,100%{transform:translateY(0)}30%{transform:translateY(-16px)}50%{transform:translateY(-4px)}70%{transform:translateY(-10px)}}
@keyframes ds-pulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 var(--accent-glow)}50%{transform:scale(1.05);box-shadow:0 0 0 12px transparent}}
@keyframes ds-morph{0%,100%{border-radius:8px}50%{border-radius:50%}}
@keyframes ds-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
.ds-state-chip{padding:10px 24px;border-radius:var(--radius-sm,8px);font-size:13px;font-weight:500;border:none;display:inline-flex;align-items:center;gap:8px}
.ds-live-btn{padding:10px 28px;border-radius:var(--radius-sm,8px);font-size:14px;font-weight:500;cursor:pointer;border:none;background:var(--accent);color:white;transition:all .3s cubic-bezier(0.22,1,0.36,1);outline:none}
.ds-live-btn:hover{background:var(--accent-hover);transform:translateY(-2px)}
.ds-live-btn:focus-visible{box-shadow:0 0 0 3px var(--accent-glow)}
.ds-live-btn:active{transform:scale(.96)}
.ds-radius-box{width:80px;height:80px;background:var(--bg-elevated);border:1px solid var(--border);margin-bottom:8px;transition:transform .3s}
.ds-radius-box:hover{transform:scale(1.08)}
.ds-shadow-box{width:100px;height:100px;background:var(--bg-elevated);border-radius:var(--radius,12px);margin-bottom:8px;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text-muted);font-family:var(--font-mono)}
.ds-strip{display:grid;grid-template-columns:repeat(5,1fr);gap:2px;border-radius:var(--radius,12px);overflow:hidden;margin-bottom:8px}
.ds-strip-cell{height:80px;display:flex;align-items:flex-end;padding:8px;font-size:10px;font-family:var(--font-mono)}
@media(max-width:768px){.ds-motion-grid{grid-template-columns:repeat(2,1fr)!important}.ds-states-grid{grid-template-columns:repeat(3,1fr)!important}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}.reveal{opacity:1;transform:none;filter:none}}
`;

const motions = [
  { name: "Fade", timing: "opacity 0→1", anim: "ds-fade 2s ease-in-out infinite" },
  { name: "Slide", timing: "translateY", anim: "ds-slide 2s cubic-bezier(0.22,1,0.36,1) infinite" },
  { name: "Scale", timing: "scale 0.7→1.1", anim: "ds-scale 2s cubic-bezier(0.22,1,0.36,1) infinite" },
  { name: "Blur Focus", timing: "blur 6px→0", anim: "ds-blur 2.5s cubic-bezier(0.22,1,0.36,1) infinite" },
  { name: "Bounce", timing: "spring physics", anim: "ds-bounce 1.5s cubic-bezier(0.22,1,0.36,1) infinite" },
  { name: "Pulse", timing: "scale + glow", anim: "ds-pulse 2s ease-in-out infinite" },
  { name: "Morph", timing: "radius 8→50%", anim: "ds-morph 3s cubic-bezier(0.22,1,0.36,1) infinite" },
  { name: "Rotate", timing: "360° linear", anim: "ds-rotate 3s linear infinite" },
];
const radii = [0, 4, 8, 12, 16, 999];
const shadows = [
  { label: "xs", val: "0 1px 2px rgba(0,0,0,0.1)" }, { label: "sm", val: "0 2px 8px rgba(0,0,0,0.12)" },
  { label: "md", val: "0 4px 16px rgba(0,0,0,0.15)" }, { label: "lg", val: "0 8px 32px rgba(0,0,0,0.18)" },
  { label: "xl", val: "0 16px 48px rgba(0,0,0,0.22)" },
];
const states = [
  { label: "rest", chip: { background: "var(--accent)", color: "var(--accent-contrast, white)" } },
  { label: ":hover", chip: { background: "var(--accent-hover)", color: "white", transform: "translateY(-2px)" } },
  { label: ":focus", chip: { background: "var(--accent)", color: "var(--accent-contrast, white)", boxShadow: "0 0 0 3px var(--accent-glow)" } },
  { label: ":active", chip: { background: "var(--accent-hover)", color: "white", transform: "scale(0.96)" } },
  { label: "disabled", chip: { background: "var(--bg-surface)", color: "var(--text-muted)", opacity: 0.5 } },
];
const palettes = [
  { name: "SaaS Dark", cells: [{ bg: "#09090b", c: "#666", t: "SaaS" },{ bg: "#18181b" },{ bg: "#27272a" },{ bg: "#3b82f6", c: "#fff", t: "accent" },{ bg: "#fafafa", c: "#000", t: "text" }] },
  { name: "Editorial", cells: [{ bg: "#faf9f6", c: "#666", t: "Edit" },{ bg: "#ffffff", border: true },{ bg: "#f5f0eb" },{ bg: "#c45d3e", c: "#fff", t: "accent" },{ bg: "#1a1a1a", c: "#fff", t: "text" }] },
  { name: "Fintech", cells: [{ bg: "#0c1222", c: "#666", t: "Fin" },{ bg: "#131c31" },{ bg: "#1a2540" },{ bg: "#00d4aa", c: "#000", t: "accent" },{ bg: "#e8edf5", c: "#000", t: "text" }] },
  { name: "Startup", cells: [{ bg: "#ffffff", c: "#999", t: "Start", border: true },{ bg: "#f8f8f8" },{ bg: "#f0f0f0" },{ bg: "#0a0a0a", c: "#fff", t: "accent" },{ bg: "#0a0a0a", c: "#fff", t: "text" }] },
  { name: "Creative", cells: [{ bg: "#1a1614", c: "#666", t: "Crea" },{ bg: "#242018" },{ bg: "#2e2820" },{ bg: "#e07850", c: "#fff", t: "accent" },{ bg: "#f5ebe0", c: "#000", t: "text" }] },
];

function Label({ children }: { children: string }) {
  return <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)", fontWeight: 500, marginBottom: 12 }}>{children}</div>;
}
function SH({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <Label>{label}</Label>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 400, letterSpacing: "-0.03em", marginBottom: 12 }}>{title}</h2>
      {sub && <p style={{ fontSize: 16, color: "var(--text-secondary)", fontWeight: 300 }}>{sub}</p>}
    </div>
  );
}
function PLabel({ children }: { children: string }) {
  return <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: "var(--text-secondary)" }}>{children}</div>;
}
function Mono({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{children}</span>;
}

function SearchInputDemo() { const [v, setV] = useState(""); return <SearchInput value={v} onChange={setV} placeholder="Buscar contatos..." /> }
function ToggleDemo() { const [on, setOn] = useState(true); return <Toggle checked={on} onChange={setOn} label="Notificações por e-mail" description="Receber alertas de novos deals" /> }
function TextareaDemo() { const [v, setV] = useState(""); return <Textarea value={v} onChange={setV} label="Anotações" placeholder="Adicionar nota sobre o contato..." maxLength={280} /> }
function ConfirmDialogDemo() { const [open, setOpen] = useState(false); return (<><button onClick={() => setOpen(true)} style={{ padding: "8px 16px", borderRadius: "var(--radius-sm, 8px)", border: "1px solid var(--destructive)", background: "rgba(248,113,113,0.08)", color: "var(--destructive)", cursor: "pointer", fontSize: 13 }}>Excluir (dialog)</button><ConfirmDialog open={open} onConfirm={() => setOpen(false)} onCancel={() => setOpen(false)} title="Excluir contato?" description="Esta ação não pode ser desfeita. Todos os dados serão perdidos." confirmText="Excluir" variant="destructive" /></>) }

export default function DesignSystemPage() {
  useReveal();
  return (
    <div style={{ color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <style>{dnaStyles}</style>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: "140px 32px 100px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Label>Foundation</Label>
          <h1 className="reveal reveal-delay-1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 7vw, 80px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1 }}>
            The system<br />behind the <em style={{ fontStyle: "italic", color: "var(--accent)" }}>soul.</em>
          </h1>
          <p className="reveal reveal-delay-2" style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300, maxWidth: 480, margin: "24px auto 0" }}>Tokens, type, color, space, motion. The invisible rules that make everything feel intentional.</p>
        </div>
      </section>

      {/* ═══ COLOR ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Color" title="One accent. Infinite depth." sub="Restraint is the design. 90% neutrals, one accent for meaning." /></div>
          {[
            { label: "Surfaces", swatches: [["bg","--bg"],["elevated","--bg-elevated"],["surface","--bg-surface"],["border","--border"],["border-hover","--border-hover"]] },
            { label: "Text", swatches: [["text","--text"],["secondary","--text-secondary"],["muted","--text-muted"]] },
            { label: "Semantic", swatches: [["accent","--accent"],["success","--success"],["warning","--warning"],["destructive","--destructive"],["info","--info"]] },
          ].map((group, gi) => (
            <div key={group.label} className={`reveal reveal-delay-${gi + 1}`} style={{ marginBottom: 48 }}>
              <PLabel>{group.label}</PLabel>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {group.swatches.map(([name, cssVar]) => (
                  <div key={cssVar} style={{ width: 80, textAlign: "center" }}>
                    <div className="ds-swatch-color" style={{ background: `var(${cssVar})` }} />
                    <Mono>{name}</Mono>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="reveal" style={{ marginBottom: 48 }}>
            <PLabel>Curated Palettes</PLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {palettes.map((p) => (
                <div key={p.name}>
                  <div className="ds-strip">
                    {p.cells.map((cell, i) => (
                      <div key={i} className="ds-strip-cell" style={{ background: cell.bg, color: cell.c || "transparent", border: cell.border ? "1px solid #eee" : undefined }}>{cell.t || ""}</div>
                    ))}
                  </div>
                  <Mono>{p.name}</Mono>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TYPOGRAPHY ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Typography" title="Type is the design." sub="Large display, weight contrast, letter-spacing precision." /></div>
          {[
            { name: "Display — Instrument Serif", sample: "The quick brown fox jumps.", style: { fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 56, lineHeight: 1.05 }, meta: "400 weight · -0.04em tracking · 1.0 line-height" },
            { name: "Body — Inter", sample: "Every pixel earns its place or it doesn't exist. Restraint is the design. Typography does the work. Whitespace isn't empty — it's the most powerful element on the page.", style: { fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: 600 }, meta: "400 weight · 0em tracking · 1.7 line-height" },
          ].map((spec, i) => (
            <div key={spec.name} className={`reveal reveal-delay-${i + 1}`} style={{ marginBottom: 48, padding: 32, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)" }}>
              <Mono>{spec.name}</Mono>
              <div style={{ ...spec.style, marginTop: 12, marginBottom: 8, letterSpacing: "-0.03em" }}>{spec.sample}</div>
              <Mono>{spec.meta}</Mono>
            </div>
          ))}
          <div className="reveal" style={{ marginTop: 48 }}>
            <PLabel>Type Scale</PLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "96px", sample: "Display", style: { fontFamily: "var(--font-display)", fontSize: 64, lineHeight: 1 } },
                { label: "48px", sample: "Heading 1", style: { fontSize: 36, fontWeight: 700, lineHeight: 1.1 } },
                { label: "32px", sample: "Heading 2", style: { fontSize: 28, fontWeight: 600, lineHeight: 1.2 } },
                { label: "24px", sample: "Heading 3", style: { fontSize: 22, fontWeight: 600 } },
                { label: "16px", sample: "Body text — the reading size.", style: { fontSize: 16 } },
                { label: "14px", sample: "Secondary — labels, captions", style: { fontSize: 14, color: "var(--text-secondary)" } },
                { label: "12px", sample: "OVERLINE — categories, timestamps", style: { fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.08em" } },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", alignItems: "baseline", gap: 24, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ minWidth: 80, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>{row.label}</span>
                  <span style={{ letterSpacing: "-0.02em", ...row.style }}>{row.sample}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SPACING ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Spacing" title="Space is intentional." sub="Every gap has a reason. Consistent rhythm creates calm." /></div>
          <div className="reveal reveal-delay-1" style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
            {[4, 8, 12, 16, 24, 32, 48, 64, 96, 128].map((px) => (
              <div key={px} style={{ textAlign: "center" }}>
                <div className="ds-space-box" style={{ width: px, height: px }} />
                <Mono>{px}</Mono>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MOTION ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Motion" title="Movement with meaning." sub="Hover each card to see the animation. Apple easing: cubic-bezier(0.22, 1, 0.36, 1)." /></div>
          <div className="ds-motion-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {motions.map((m, i) => (
              <div key={m.name} className={`ds-motion-card reveal${i > 0 && i < 4 ? ` reveal-delay-${i}` : ""}`}>
                <div className="ds-motion-demo" style={{ animation: m.anim }} />
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{m.name}</div>
                <Mono>{m.timing}</Mono>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATES ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="States" title="Every state, considered." sub="Default, hover, focus, active, disabled, loading. No state left behind." /></div>
          <div className="reveal reveal-delay-1" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", padding: 48, textAlign: "center", marginBottom: 48 }}>
            <Mono>Try it — hover, click, tab to focus</Mono>
            <div style={{ marginTop: 20 }}><button className="ds-live-btn">Interactive Button</button></div>
          </div>
          <div className="reveal reveal-delay-2">
            <PLabel>All States</PLabel>
            <div className="ds-states-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, textAlign: "center" }}>
              {[...states, { label: "async", chip: { background: "var(--accent)", color: "transparent", position: "relative" as const, minWidth: 90 } }].map((s) => (
                <div key={s.label}>
                  <span className="ds-state-chip" style={s.chip}>{s.label === "async" ? "Loading" : s.label === "rest" ? "Default" : s.label === ":hover" ? "Hover" : s.label === ":focus" ? "Focus" : s.label === ":active" ? "Active" : "Disabled"}</span>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", minWidth: 56, textAlign: "center", marginTop: 8 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SHAPE + SHADOW ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Shape + Shadow" title="Soft edges. Quiet depth." /></div>
          <div className="reveal reveal-delay-1" style={{ marginBottom: 48 }}>
            <PLabel>Border Radius</PLabel>
            <div style={{ display: "flex", gap: 24, alignItems: "flex-end", flexWrap: "wrap" }}>
              {radii.map((r) => (
                <div key={r} style={{ textAlign: "center" }}>
                  <div className="ds-radius-box" style={{ borderRadius: r === 999 ? 999 : r }} />
                  <Mono>{r === 999 ? "full" : `${r}px`}</Mono>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal reveal-delay-2">
            <PLabel>Shadows</PLabel>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {shadows.map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div className="ds-shadow-box" style={{ boxShadow: s.val }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FORM PRIMITIVES ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Formulários" title="Primitivas de input." sub="Select, toggle, textarea, search, date — os blocos de construção de todo formulário." /></div>
          <div className="reveal reveal-delay-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 16 }}>
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", padding: "28px 28px 32px" }}>
              <PLabel>Select / Combobox</PLabel>
              <div style={{ marginTop: 12 }}><Select label="Status" options={[{ value: "lead", label: "Novo Lead" }, { value: "qualified", label: "Qualificado" }, { value: "proposal", label: "Proposta" }, { value: "won", label: "Ganho" }]} placeholder="Selecionar status..." /></div>
            </div>
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", padding: "28px 28px 32px" }}>
              <PLabel>DatePicker</PLabel>
              <div style={{ marginTop: 12 }}><DatePicker label="Data de follow-up" /></div>
            </div>
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", padding: "28px 28px 32px" }}>
              <PLabel>SearchInput</PLabel>
              <div style={{ marginTop: 12 }}><SearchInputDemo /></div>
            </div>
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", padding: "28px 28px 32px" }}>
              <PLabel>Toggle Switch</PLabel>
              <div style={{ marginTop: 12 }}><ToggleDemo /></div>
            </div>
          </div>

          <div className="reveal reveal-delay-2" style={{ marginTop: 20 }}>
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", padding: "28px 28px 32px" }}>
              <PLabel>Textarea</PLabel>
              <div style={{ marginTop: 12 }}><TextareaDemo /></div>
            </div>
          </div>

          <div className="reveal reveal-delay-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 20 }}>
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", padding: "28px 28px 32px", textAlign: "center" }}>
              <PLabel>Tooltip</PLabel>
              <div style={{ marginTop: 16 }}><Tooltip content="Informação adicional sobre este campo"><span style={{ padding: "8px 16px", borderRadius: "var(--radius-sm, 8px)", border: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 13, cursor: "default" }}>Passe o mouse aqui</span></Tooltip></div>
            </div>
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", padding: "28px 28px 32px", textAlign: "center" }}>
              <PLabel>ConfirmDialog</PLabel>
              <div style={{ marginTop: 16 }}><ConfirmDialogDemo /></div>
            </div>
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", padding: "28px 28px 32px", textAlign: "center" }}>
              <PLabel>Toast</PLabel>
              <div style={{ marginTop: 16 }}><span style={{ fontSize: 12, color: "var(--text-muted)" }}>useToast() hook</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LAYOUT PATTERNS ═══ */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal"><SH label="Layout" title="Headers & Sidebars." sub="Floating glass morphism. The app breathes with the background." /></div>
          <div className="reveal reveal-delay-1" style={{ marginBottom: 48 }}>
            <PLabel>Floating Header</PLabel>
            <div style={{ position: "relative", height: 80, borderRadius: "var(--radius, 12px)", border: "1px solid var(--border)", overflow: "hidden", background: "var(--bg-surface)" }}>
              <div style={{ position: "absolute", top: 12, left: 12, right: 12, height: 44, borderRadius: 14, background: "color-mix(in srgb, var(--bg-elevated) 80%, transparent)", backdropFilter: "blur(20px)", border: "1px solid color-mix(in srgb, var(--text-muted) 15%, transparent)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>CRM</span>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M2 3l2 2 2-2" stroke="var(--text-muted)" strokeWidth="1.5" /></svg>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Dashboard</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 140, height: 28, borderRadius: "var(--radius-sm, 8px)", border: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 10px", gap: 6 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Buscar...</span>
                  </div>
                  <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="reveal reveal-delay-2">
            <PLabel>Floating Sidebar</PLabel>
            <div style={{ position: "relative", height: 300, borderRadius: "var(--radius, 12px)", border: "1px solid var(--border)", overflow: "hidden", background: "var(--bg-surface)", display: "flex" }}>
              <div style={{ position: "absolute", left: 12, top: 12, bottom: 12, width: 56, borderRadius: 16, background: "color-mix(in srgb, var(--bg-elevated) 80%, transparent)", backdropFilter: "blur(20px)", border: "1px solid color-mix(in srgb, var(--text-muted) 15%, transparent)", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: 2 }}>
                {/* P. logo */}
                <div style={{ marginBottom: 16, textAlign: "center" }}>
                  <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>P</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>.</span>
                </div>
                {[true, false, false, false].map((active, i) => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: active ? "var(--accent-glow)" : "transparent", color: active ? "var(--accent)" : "var(--text-muted)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {i === 0 && <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>}
                      {i === 1 && <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></>}
                      {i === 2 && <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></>}
                      {i === 3 && <><circle cx="12" cy="12" r="3" /></>}
                    </svg>
                  </div>
                ))}
              </div>
              <div style={{ marginLeft: 80, padding: 24, display: "flex", alignItems: "center", justifyContent: "center", flex: 1, color: "var(--text-muted)", fontSize: 13 }}>Conteúdo da aplicação</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
