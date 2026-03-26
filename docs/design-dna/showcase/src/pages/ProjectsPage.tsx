/**
 * ProjectsPage — Live project overview powered by OpsContext.
 * All data from useOps() — no hardcoded project data.
 */

import { useState } from "react";
import { GitBranch, Cpu, CheckCircle2, ChevronDown, ChevronUp, Users, LayoutGrid, Activity, Circle, Workflow } from "lucide-react";
import { useOps } from "../context/OpsContext";
import { LiveBadge } from "../components/hub/LiveBadge";
import { Link } from "../router/Router";
import type { PhaseStatus } from "../data/hub-types";

const PHASE_NAMES = ["Plan", "Architect", "Decompose", "Verify", "Build", "Quality", "Ship"];

// ── Phase strip — compact 7-phase visual summary ──────────────────────────────

function PhaseStrip({ currentPhase, phases }: { currentPhase: number; phases: { id: number; status: PhaseStatus }[] }) {
  const getStatus = (id: number): PhaseStatus =>
    phases.find((p) => p.id === id)?.status ?? (id < currentPhase ? "complete" : "idle");

  return (
    <div aria-label="Pipeline phase overview" style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
      {PHASE_NAMES.map((name, idx) => {
        const id = idx + 1;
        const s = getStatus(id);
        const done = s === "complete";
        const active = s === "active" || (currentPhase === id && s === "idle");
        const color = done ? "var(--success)" : active ? "var(--accent)" : "var(--text-muted)";
        return (
          <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: done ? "color-mix(in srgb,var(--success) 12%,transparent)" : active ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-surface)",
              border: `1px solid ${done ? "color-mix(in srgb,var(--success) 25%,transparent)" : active ? "color-mix(in srgb,var(--accent) 30%,transparent)" : "var(--border)"}`,
              borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 600, color,
              transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)", whiteSpace: "nowrap",
            }}>
              <span style={{ fontSize: 10, opacity: 0.6 }}>{id}</span>{name}
              {done && <CheckCircle2 size={10} />}
              {active && <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", animation: "projectPulse 2s ease-in-out infinite" }} />}
            </span>
            {idx < 6 && <span aria-hidden style={{ color: "var(--border)", fontSize: 10 }}>›</span>}
          </span>
        );
      })}
      <style>{`@keyframes projectPulse { 0%,100% { opacity:1 } 50% { opacity:0.3 } }`}</style>
    </div>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({ name, done, total, agents, phase, phases }: {
  name: string; done: number; total: number; agents: number; phase: number; phases: { id: number; status: PhaseStatus }[];
}) {
  const [open, setOpen] = useState(true);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "20px 24px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: "0 0 4px", fontFamily: "'Instrument Serif',Georgia,serif", fontStyle: "italic", fontSize: 20, fontWeight: 400, letterSpacing: "-0.02em", color: "var(--text)" }}>
              {name}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {agents > 0 && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: "var(--accent)" }}>
                  <Activity size={11} />{agents} agent{agents !== 1 ? "s" : ""} active
                </span>
              )}
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{done}/{total} tasks</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <Link to="/tasks" style={{
              display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600,
              color: "var(--accent)", textDecoration: "none", padding: "5px 12px",
              background: "color-mix(in srgb,var(--accent) 10%,transparent)",
              border: "1px solid color-mix(in srgb,var(--accent) 25%,transparent)", borderRadius: 8,
            }}>View Tasks</Link>
            <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Collapse" : "Expand"} style={{
              background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "5px 8px",
              cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center",
            }}>
              {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
        <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${pct}% complete`}
          style={{ height: 4, background: "var(--bg-surface)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "var(--success)" : "var(--accent)", borderRadius: 2, transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)" }} />
        </div>
      </div>
      {open && (
        <div style={{ padding: "12px 24px 18px", borderTop: "1px solid var(--border)" }}>
          <PhaseStrip currentPhase={phase} phases={phases} />
        </div>
      )}
    </div>
  );
}

// ── Session banner — glass morphism ──────────────────────────────────────────

function SessionBanner({ branch, model, contextUsed, contextMax }: { branch: string; model: string; contextUsed: number; contextMax: number }) {
  const pct = contextMax > 0 ? Math.round((contextUsed / contextMax) * 100) : 0;
  const ctxColor = pct > 80 ? "var(--destructive,#ef4444)" : pct > 60 ? "var(--warning,#f59e0b)" : "var(--success)";
  return (
    <div aria-label="Active session" style={{
      background: "color-mix(in srgb,var(--accent) 6%,var(--bg-elevated))",
      border: "1px solid color-mix(in srgb,var(--accent) 20%,var(--border))",
      borderRadius: 12, padding: "14px 20px", marginBottom: 24,
      backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
    }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <GitBranch size={13} style={{ color: "var(--accent)" }} />
        <code style={{ fontSize: 12, fontFamily: "var(--font-mono,'JetBrains Mono',monospace)", color: "var(--text)" }}>{branch || "no branch"}</code>
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <Cpu size={13} style={{ color: "var(--accent)" }} />
        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{model || "unknown"}</span>
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Context</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: ctxColor }}>{pct}%</span>
      </span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const { tasks, pipeline, agents, session, isLive, lastUpdated } = useOps();

  const allTasks = tasks.tasks;
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter((t) => t.column === "done").length;
  const inProgressTasks = allTasks.filter((t) => t.column === "in-progress").length;
  const activeAgents = agents.agents.filter((a) => a.status === "active").length;

  const statCard = (label: string, value: number, accent = "var(--accent)") => (
    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px", flex: 1 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: accent, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "var(--text-muted)" }}>{label}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 64px" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)" }}>
          APEX Framework
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <h1 style={{ margin: 0, fontFamily: "'Instrument Serif',Georgia,serif", fontStyle: "italic", fontSize: "clamp(28px,4vw,40px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)" }}>
            Projects
          </h1>
          <LiveBadge isLive={isLive} lastUpdated={lastUpdated} />
        </div>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>
          What's being built, current pipeline phase, and live task progress.
        </p>
      </div>

      {/* Session banner */}
      {isLive && session.active && (
        <SessionBanner branch={session.branch} model={session.model} contextUsed={session.contextUsed} contextMax={session.contextMax} />
      )}

      {/* Quick stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
        {statCard("Total Tasks", totalTasks, "var(--text)")}
        {statCard("Completed", doneTasks, "var(--success)")}
        {statCard("In Progress", inProgressTasks, "var(--accent)")}
        {statCard("Agents Active", activeAgents, activeAgents > 0 ? "var(--accent)" : "var(--text-muted)")}
      </div>

      {/* Project card */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <LayoutGrid size={14} style={{ color: "var(--text-muted)" }} />
          <h2 style={{ margin: 0, fontFamily: "'Instrument Serif',Georgia,serif", fontStyle: "italic", fontSize: 18, fontWeight: 400, color: "var(--text)", letterSpacing: "-0.01em" }}>
            Active Project
          </h2>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600,
            color: "var(--success)", background: "color-mix(in srgb,var(--success) 12%,transparent)",
            border: "1px solid color-mix(in srgb,var(--success) 25%,transparent)", borderRadius: 6, padding: "2px 8px",
          }}>
            <Circle size={6} style={{ fill: "var(--success)" }} />1 active
          </span>
        </div>
        <ProjectCard
          name={tasks.projectName || "APEX Framework"}
          done={doneTasks}
          total={totalTasks}
          agents={activeAgents}
          phase={pipeline.currentPhase || 0}
          phases={pipeline.phases.map((p) => ({ id: p.id, status: p.status }))}
        />
      </div>

      {/* No session — empty state */}
      {!isLive && totalTasks === 0 && (
        <div style={{
          textAlign: "center", padding: "48px 24px",
          background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 16,
        }}>
          <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }} aria-hidden="true">
            <Workflow size={32} style={{ color: "var(--text-muted)" }} />
          </div>
          <p style={{
            fontFamily: "'Instrument Serif',Georgia,serif", fontStyle: "italic",
            fontSize: 20, color: "var(--text)", marginBottom: 8,
          }}>
            No active session
          </p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 400, margin: "0 auto" }}>
            Start a Claude Code session to see live project data. Tasks, agents, and pipeline phases appear here in real time.
          </p>
        </div>
      )}
    </div>
  );
}
