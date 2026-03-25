import { useState } from "react";
import { Link } from "../router/Router";
import {
  GitBranch, GitPullRequest, Check, ExternalLink,
  Clock, CheckCircle2, AlertCircle, Layers, Search, Circle,
  ClipboardList, Building, Kanban, SearchCheck, Hammer,
  ShieldCheck, Rocket, Paintbrush, Bug, X, Lock,
} from "lucide-react";

/* ── Types ────────────────────────────────────────────────────────────────── */

type SubProjectStatus = "building" | "shipped" | "paused" | "planned";
type TeamStage = "design-review" | "build" | "quality" | "security";

interface TeamTask {
  id: string;
  title: string;
  stage: TeamStage;
  done: boolean;
}

interface SubProject {
  id: string;
  name: string;
  description: string;
  branch: string;
  pr?: string;
  prStatus?: "merged" | "open" | "closed";
  prUrl?: string;
  lastActive: string;
  status: SubProjectStatus;
  /** Which pipeline phase this subproject is currently at (1–7) or has completed through */
  currentPhase: number;
  teamTasks: TeamTask[];
}

interface PullRequest {
  number: number;
  title: string;
  status: "merged" | "open" | "closed";
  date: string;
  branch: string;
}

/* ── The 7 APEX Pipeline Phases ───────────────────────────────────────────── */

const PIPELINE_PHASES = [
  { id: 1, name: "Plan",      icon: ClipboardList, isGate: true,  description: "PRD from user description",            agents: ["Lead"],                    skills: ["/prd"] },
  { id: 2, name: "Architect", icon: Building,      isGate: true,  description: "System design + stack",                agents: ["Lead"],                    skills: ["/architecture", "/verify-api"] },
  { id: 3, name: "Decompose", icon: Kanban,        isGate: false, description: "PM breaks into tasks",                 agents: ["PM"],                      skills: ["/teams"] },
  { id: 4, name: "Verify",    icon: SearchCheck,   isGate: false, description: "APIs + libs verified",                 agents: ["Lead", "Builder"],         skills: ["/verify-api", "/verify-lib"] },
  { id: 5, name: "Build",     icon: Hammer,        isGate: false, description: "Builders implement",                   agents: ["Builder", "Watcher"],      skills: ["/teams", "/design-system"] },
  { id: 6, name: "Quality",   icon: ShieldCheck,   isGate: false, description: "7-phase QA gate",                      agents: ["QA"],                      skills: ["/qa", "/security", "/a11y", "/cx-review"] },
  { id: 7, name: "Ship",      icon: Rocket,        isGate: true,  description: "PR + merge approval",                  agents: ["Tech Writer", "Lead"],     skills: ["/ship", "/changelog"] },
] as const;

/* ── Team Stages (Kanban Columns) ─────────────────────────────────────────── */

const TEAM_STAGES: { id: TeamStage; label: string; icon: typeof Paintbrush; color: string }[] = [
  { id: "design-review", label: "Design Review", icon: Paintbrush,  color: "var(--accent)" },
  { id: "build",         label: "Build",         icon: Hammer,      color: "var(--warning)" },
  { id: "quality",       label: "Quality",       icon: Bug,         color: "var(--success)" },
  { id: "security",      label: "Security",      icon: ShieldCheck, color: "var(--info, #60a5fa)" },
];

/* ── Sub-Projects Data ────────────────────────────────────────────────────── */

const SUB_PROJECTS: SubProject[] = [
  {
    id: "v520-production", name: "v5.20 — Production Readiness",
    description: "41 files: hooks, Oscar animations, DnaBackground, E2E tests.",
    branch: "feat/v5.20-production-readiness",
    pr: "#187", prStatus: "merged", prUrl: "https://github.com/lsfdsb/apex-framework/pull/187",
    lastActive: "Mar 23", status: "shipped", currentPhase: 7,
    teamTasks: [
      { id: "F-1", title: "Hook architecture design", stage: "design-review", done: true },
      { id: "F-2", title: "14 hook implementations", stage: "build", done: true },
      { id: "F-3", title: "Oscar animation keyframes", stage: "build", done: true },
      { id: "F-4", title: "E2E test framework", stage: "quality", done: true },
      { id: "F-5", title: "Hook security audit", stage: "security", done: true },
    ],
  },
  {
    id: "perf-bundle", name: "Bundle Optimization",
    description: "544KB to 210KB (61% smaller). Lazy loading, code splitting, tree shaking.",
    branch: "perf/bundle-optimization",
    pr: "#185", prStatus: "merged", prUrl: "https://github.com/lsfdsb/apex-framework/pull/185",
    lastActive: "Mar 22", status: "shipped", currentPhase: 7,
    teamTasks: [
      { id: "B-1", title: "Bundle analysis report", stage: "design-review", done: true },
      { id: "B-2", title: "Lazy route loading", stage: "build", done: true },
      { id: "B-3", title: "Tree shaking config", stage: "build", done: true },
      { id: "B-4", title: "Performance benchmarks", stage: "quality", done: true },
      { id: "B-5", title: "No sensitive code in bundle", stage: "security", done: true },
    ],
  },
  {
    id: "v521-quality", name: "v5.21 — Quality Gates",
    description: "81 Apple-audit fixes, dynamic counts, portable shell, batch-reads rule.",
    branch: "feat/apple-grade-audit-fixes",
    pr: "#194", prStatus: "merged", prUrl: "https://github.com/lsfdsb/apex-framework/pull/194",
    lastActive: "Mar 24", status: "shipped", currentPhase: 7,
    teamTasks: [
      { id: "Q-1", title: "Apple audit checklist", stage: "design-review", done: true },
      { id: "Q-2", title: "81 audit fixes (20 files)", stage: "build", done: true },
      { id: "Q-3", title: "Dynamic counts", stage: "build", done: true },
      { id: "Q-4", title: "QA pass on all fixes", stage: "quality", done: true },
      { id: "Q-5", title: "Safe process management", stage: "security", done: true },
    ],
  },
  {
    id: "v522-apple", name: "v5.22 — The Apple Release",
    description: "PM agent, 7-phase pipeline, Bueno rebrand, CI fixes, Node.js 22 LTS.",
    branch: "feat/v522-apple-audit",
    pr: "#202", prStatus: "merged", prUrl: "https://github.com/lsfdsb/apex-framework/pull/202",
    lastActive: "Mar 25", status: "shipped", currentPhase: 7,
    teamTasks: [
      { id: "A-1", title: "PM agent architecture", stage: "design-review", done: true },
      { id: "A-2", title: "Project Manager agent", stage: "build", done: true },
      { id: "A-3", title: "7-phase pipeline rewire", stage: "build", done: true },
      { id: "A-4", title: "Bueno rebrand (36 files)", stage: "build", done: true },
      { id: "A-5", title: "Full QA gate pass", stage: "quality", done: true },
      { id: "A-6", title: "CI security review", stage: "security", done: true },
    ],
  },
  {
    id: "visual-hub", name: "Visual Pipeline HUB",
    description: "Web command center with OPS dashboard, task board, agent roster, and quality gates.",
    branch: "feat/visual-pipeline-hub",
    pr: "#203", prStatus: "merged", prUrl: "https://github.com/lsfdsb/apex-framework/pull/203",
    lastActive: "Today", status: "shipped", currentPhase: 7,
    teamTasks: [
      { id: "H-1", title: "HUB PRD + architecture", stage: "design-review", done: true },
      { id: "H-2", title: "7 OPS pages + components", stage: "build", done: true },
      { id: "H-3", title: "Live sync (useApexState)", stage: "build", done: true },
      { id: "H-4", title: "Teaching layer", stage: "build", done: true },
      { id: "H-5", title: "TypeScript strict + build", stage: "quality", done: true },
      { id: "H-6", title: "Path traversal guard", stage: "security", done: true },
    ],
  },
  {
    id: "dna-showcase", name: "Design DNA Showcase",
    description: "14 premium UI templates, 33 starters, 39 components.",
    branch: "main",
    pr: "#187", prStatus: "merged", prUrl: "https://github.com/lsfdsb/apex-framework/pull/187",
    lastActive: "Mar 23", status: "shipped", currentPhase: 7,
    teamTasks: [
      { id: "D-1", title: "14 template designs", stage: "design-review", done: true },
      { id: "D-2", title: "Template implementations", stage: "build", done: true },
      { id: "D-3", title: "CRM/Helpdesk components", stage: "build", done: true },
      { id: "D-4", title: "Accessibility audit", stage: "quality", done: true },
      { id: "D-5", title: "No credentials in templates", stage: "security", done: true },
    ],
  },
  {
    id: "ops-timeline", name: "OPS Phase Timeline",
    description: "Horizontal 7-phase timeline with team kanban per subproject.",
    branch: "feat/ops-phase-timeline",
    lastActive: "Now", status: "building", currentPhase: 5,
    teamTasks: [
      { id: "T-1", title: "Timeline UX design", stage: "design-review", done: true },
      { id: "T-2", title: "Phase timeline component", stage: "build", done: true },
      { id: "T-3", title: "Team kanban per subproject", stage: "build", done: false },
      { id: "T-4", title: "QA pass", stage: "quality", done: false },
      { id: "T-5", title: "Security review", stage: "security", done: false },
    ],
  },
  {
    id: "supabase-rag", name: "Supabase RAG Pipeline",
    description: "AI-powered documentation search with vector embeddings and edge functions.",
    branch: "feat/rag-v2",
    lastActive: "Mar 20", status: "paused", currentPhase: 2,
    teamTasks: [
      { id: "R-1", title: "RAG architecture + schema", stage: "design-review", done: true },
      { id: "R-2", title: "Vector embeddings pipeline", stage: "build", done: false },
      { id: "R-3", title: "Edge function endpoints", stage: "build", done: false },
      { id: "R-4", title: "Retrieval accuracy tests", stage: "quality", done: false },
      { id: "R-5", title: "API key rotation + RLS", stage: "security", done: false },
    ],
  },
];

/* ── Recent PRs ───────────────────────────────────────────────────────────── */

const RECENT_PRS: PullRequest[] = [
  { number: 203, title: "feat(hub): APEX Visual Pipeline HUB", status: "merged", date: "Mar 25", branch: "feat/visual-pipeline-hub" },
  { number: 202, title: "feat(v5.22): PM agent, pipeline, rebrand, CI fixes", status: "merged", date: "Mar 25", branch: "feat/v522-apple-audit" },
  { number: 201, title: "refactor(hooks): single CHANGELOG owner", status: "merged", date: "Mar 25", branch: "fix/changelog-single-owner" },
  { number: 200, title: "fix(hooks): skip meta-docs in auto-changelog", status: "merged", date: "Mar 25", branch: "fix/auto-changelog-self-ref..." },
  { number: 199, title: "fix(hooks): fix sed recursion + add startup sound", status: "merged", date: "Mar 25", branch: "fix/startup-hooks-and-sound" },
];

/* ── Status Config ────────────────────────────────────────────────────────── */

const STATUS_CFG: Record<SubProjectStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  building: { label: "Building", color: "var(--accent)",     icon: AlertCircle },
  shipped:  { label: "Shipped",  color: "var(--success)",    icon: CheckCircle2 },
  paused:   { label: "Paused",   color: "var(--text-muted)", icon: Clock },
  planned:  { label: "Planned",  color: "var(--warning)",    icon: Layers },
};

/* ── Pipeline Phase Node ──────────────────────────────────────────────────── */

function PipelineNode({ phase, isLast, isSelected, subCount, completedCount, onClick }: {
  phase: typeof PIPELINE_PHASES[number];
  isLast: boolean;
  isSelected: boolean;
  subCount: number;
  completedCount: number;
  onClick: () => void;
}) {
  const Icon = phase.icon;
  const allDone = subCount > 0 && completedCount === subCount;
  const hasWork = subCount > 0;
  const dotColor = allDone ? "var(--success)" : hasWork ? "var(--accent)" : "var(--text-muted)";

  return (
    <div style={{ display: "flex", alignItems: "center", flex: isLast ? "0 0 auto" : 1 }}>
      <button
        onClick={onClick}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          background: "none", border: "none", cursor: "pointer", padding: "6px 2px",
          minWidth: 80, transition: "transform 0.2s",
          transform: isSelected ? "scale(1.08)" : "scale(1)",
          opacity: hasWork || isSelected ? 1 : 0.5,
        }}
        aria-label={`${phase.name} — ${subCount} sub-projects`}
      >
        {/* Icon circle */}
        <div style={{
          width: isSelected ? 36 : 28,
          height: isSelected ? 36 : 28,
          borderRadius: "50%",
          background: isSelected ? dotColor : allDone ? dotColor : "var(--bg)",
          border: `2px solid ${dotColor}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: isSelected ? `0 0 0 4px color-mix(in srgb, ${dotColor} 20%, transparent)` : "none",
          transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          position: "relative",
        }}>
          <Icon size={isSelected ? 16 : 12} style={{
            color: (isSelected || allDone) ? "var(--bg)" : dotColor,
          }} />
          {phase.isGate && (
            <Lock size={7} style={{
              position: "absolute", bottom: -2, right: -2,
              color: "var(--warning)", background: "var(--bg-elevated)",
              borderRadius: "50%", padding: 1,
            }} />
          )}
        </div>

        {/* Label + Team */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: isSelected ? 12 : 10,
            fontWeight: isSelected ? 700 : 600,
            color: isSelected ? "var(--text)" : hasWork ? "var(--text-secondary)" : "var(--text-muted)",
            fontFamily: "var(--font-body)",
            letterSpacing: "-0.01em",
          }}>
            {phase.name}
          </div>

          {/* Agents for this phase */}
          <div style={{
            display: "flex", gap: 3, justifyContent: "center", marginTop: 3, flexWrap: "wrap",
          }}>
            {phase.agents.map((agent) => (
              <span key={agent} style={{
                fontSize: 8, fontWeight: 600, padding: "1px 5px", borderRadius: 8,
                background: isSelected
                  ? "color-mix(in srgb, var(--accent) 15%, transparent)"
                  : "color-mix(in srgb, var(--text-muted) 8%, transparent)",
                color: isSelected ? "var(--accent)" : "var(--text-muted)",
                letterSpacing: "0.02em",
                transition: "all 0.3s",
              }}>
                {agent}
              </span>
            ))}
          </div>

          {/* Skills — only when selected */}
          {isSelected && (
            <div style={{
              display: "flex", gap: 2, justifyContent: "center", marginTop: 3, flexWrap: "wrap",
            }}>
              {phase.skills.map((skill) => (
                <span key={skill} style={{
                  fontSize: 7, fontWeight: 500, padding: "1px 4px", borderRadius: 4,
                  background: "var(--bg-surface, var(--bg))",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                  fontFamily: "var(--font-mono, monospace)",
                }}>
                  {skill}
                </span>
              ))}
            </div>
          )}

          {hasWork && (
            <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>
              {completedCount}/{subCount}
            </div>
          )}
        </div>
      </button>

      {/* Connector */}
      {!isLast && (
        <div style={{
          flex: 1, height: 2, minWidth: 12,
          background: allDone && subCount > 0 ? "var(--success)" : "var(--border)",
          marginTop: -20, position: "relative",
        }}>
          {allDone && subCount > 0 && (
            <div style={{
              position: "absolute", right: -1, top: -3,
              width: 0, height: 0,
              borderTop: "4px solid transparent",
              borderBottom: "4px solid transparent",
              borderLeft: "5px solid var(--success)",
            }} />
          )}
        </div>
      )}
    </div>
  );
}

/* ── Sub-Project Card ─────────────────────────────────────────────────────── */

function SubProjectCard({ sub, isExpanded, onToggle }: {
  sub: SubProject; isExpanded: boolean; onToggle: () => void;
}) {
  const status = STATUS_CFG[sub.status];
  const StatusIcon = status.icon;
  const doneTasks = sub.teamTasks.filter(t => t.done).length;
  const totalTasks = sub.teamTasks.length;
  const currentPhaseName = PIPELINE_PHASES.find(p => p.id === sub.currentPhase)?.name ?? "—";

  return (
    <div style={{
      background: "var(--bg-elevated)",
      border: `1px solid ${isExpanded ? "var(--accent)" : "var(--border)"}`,
      borderRadius: 12, overflow: "hidden",
      transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
      boxShadow: isExpanded ? "0 8px 32px rgba(0,0,0,0.2)" : "none",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", textAlign: "left", background: "none", border: "none",
          cursor: "pointer", padding: "16px 20px", color: "var(--text)",
          display: "flex", flexDirection: "column", gap: 8,
        }}
      >
        {/* Title row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", letterSpacing: "-0.01em", margin: 0 }}>
              {sub.name}
            </h3>
            {/* Pipeline phase badge */}
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 10,
              background: sub.status === "shipped"
                ? "color-mix(in srgb, var(--success) 12%, transparent)"
                : "color-mix(in srgb, var(--accent) 12%, transparent)",
              color: sub.status === "shipped" ? "var(--success)" : "var(--accent)",
              letterSpacing: "0.04em", textTransform: "uppercase",
            }}>
              {sub.status === "shipped" ? "Shipped" : currentPhaseName}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: status.color, fontWeight: 600, flexShrink: 0 }}>
            <StatusIcon size={12} />
            {status.label}
          </div>
        </div>

        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
          {sub.description}
        </p>

        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "var(--text-muted)", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <GitBranch size={11} /> {sub.branch}
          </span>
          {sub.pr && sub.prUrl && (
            <a href={sub.prUrl} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                background: sub.prStatus === "merged" ? "color-mix(in srgb, var(--success) 12%, transparent)" : "color-mix(in srgb, var(--accent) 12%, transparent)",
                color: sub.prStatus === "merged" ? "var(--success)" : "var(--accent)",
                fontWeight: 600, padding: "2px 8px", borderRadius: 6, fontSize: 10, textDecoration: "none",
              }}
            >
              <GitPullRequest size={10} /> PR {sub.pr} {sub.prStatus === "merged" && <Check size={8} />}
            </a>
          )}
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={11} /> {sub.lastActive}
          </span>
          <span style={{ marginLeft: "auto", fontWeight: 600, color: doneTasks === totalTasks ? "var(--success)" : "var(--text-secondary)" }}>
            {doneTasks}/{totalTasks} tasks
          </span>
        </div>

        {/* Mini pipeline progress — shows which of the 7 phases this subproject has completed */}
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          {PIPELINE_PHASES.map((p, i) => {
            const completed = sub.currentPhase > p.id || (sub.currentPhase === p.id && sub.status === "shipped");
            const current = sub.currentPhase === p.id && sub.status !== "shipped";
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{
                  height: 3, flex: 1, borderRadius: 2,
                  background: completed ? "var(--success)" : current ? "var(--accent)" : "var(--border)",
                  transition: "background 0.3s",
                }} />
                {i < PIPELINE_PHASES.length - 1 && <div style={{ width: 2 }} />}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--text-muted)", marginTop: -2 }}>
          <span>Plan</span>
          <span>Ship</span>
        </div>
      </button>

      {isExpanded && <TeamKanban sub={sub} onClose={onToggle} />}
    </div>
  );
}

/* ── Team Kanban ──────────────────────────────────────────────────────────── */

function TeamKanban({ sub, onClose }: { sub: SubProject; onClose: () => void }) {
  const tasksByStage = (stage: TeamStage) => sub.teamTasks.filter(t => t.stage === stage);

  return (
    <div style={{ borderTop: "1px solid var(--border)", padding: "16px 20px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)" }}>
          Team Pipeline
        </div>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--text-muted)", display: "flex" }}
          aria-label="Close kanban"
        >
          <X size={14} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {TEAM_STAGES.map((stage) => {
          const tasks = tasksByStage(stage.id);
          const StageIcon = stage.icon;
          const doneCount = tasks.filter(t => t.done).length;

          return (
            <div key={stage.id} style={{
              background: "var(--bg-surface, var(--bg))",
              border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden",
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 10px", borderBottom: `2px solid ${stage.color}`,
              }}>
                <StageIcon size={12} style={{ color: stage.color }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: stage.color, flex: 1 }}>
                  {stage.label}
                </span>
                <span style={{
                  fontSize: 9, fontWeight: 600, padding: "1px 5px", borderRadius: 10,
                  background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)",
                }}>
                  {doneCount}/{tasks.length}
                </span>
              </div>
              <div style={{ padding: 6, display: "flex", flexDirection: "column", gap: 4, minHeight: 48 }}>
                {tasks.length === 0 ? (
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontStyle: "italic", padding: "8px 4px", textAlign: "center" }}>
                    No tasks
                  </div>
                ) : tasks.map((task) => (
                  <div key={task.id} style={{
                    fontSize: 11, lineHeight: 1.4, padding: "6px 8px", borderRadius: 6,
                    background: task.done ? "color-mix(in srgb, var(--success) 6%, transparent)" : "var(--bg-elevated)",
                    border: `1px solid ${task.done ? "color-mix(in srgb, var(--success) 20%, transparent)" : "var(--border)"}`,
                    color: task.done ? "var(--text-secondary)" : "var(--text)",
                    display: "flex", alignItems: "flex-start", gap: 6,
                  }}>
                    {task.done
                      ? <CheckCircle2 size={11} style={{ color: "var(--success)", flexShrink: 0, marginTop: 2 }} />
                      : <Circle size={11} style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 2 }} />
                    }
                    <span>{task.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── PR Badge ─────────────────────────────────────────────────────────────── */

function PRStatusBadge({ status }: { status: PullRequest["status"] }) {
  const cfg = {
    merged: { label: "merged", bg: "color-mix(in srgb, var(--success) 12%, transparent)", color: "var(--success)" },
    open:   { label: "open",   bg: "color-mix(in srgb, var(--accent) 12%, transparent)",  color: "var(--accent)" },
    closed: { label: "closed", bg: "color-mix(in srgb, var(--text-muted) 12%, transparent)", color: "var(--text-muted)" },
  }[status];

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: cfg.bg, color: cfg.color, fontWeight: 600, fontSize: 10,
      padding: "2px 8px", borderRadius: 6,
    }}>
      {status === "merged" && <Check size={8} />}
      {status === "open" && <Circle size={8} />}
      {cfg.label}
    </span>
  );
}

/* ── Recent PRs ───────────────────────────────────────────────────────────── */

function RecentPRs() {
  return (
    <div style={{ marginTop: 40 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingBottom: 12, borderBottom: "1px solid var(--border)", marginBottom: 4,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <GitPullRequest size={16} style={{ color: "var(--accent)" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18, fontWeight: 400, color: "var(--text)", letterSpacing: "-0.02em" }}>
            Recent Pull Requests
          </h2>
        </div>
        <a href="https://github.com/lsfdsb/apex-framework/pulls" target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--accent)", textDecoration: "none" }}>
          View all on GitHub <ExternalLink size={12} />
        </a>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {RECENT_PRS.map((pr, idx) => (
          <div key={pr.number} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "12px 8px",
            borderBottom: idx < RECENT_PRS.length - 1 ? "1px solid var(--border)" : "none",
            transition: "background 0.15s",
            borderRadius: idx === 0 ? "8px 8px 0 0" : idx === RECENT_PRS.length - 1 ? "0 0 8px 8px" : 0,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 4%, transparent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
          >
            <a href={`https://github.com/lsfdsb/apex-framework/pull/${pr.number}`} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", textDecoration: "none", flexShrink: 0, minWidth: 36 }}>
              #{pr.number}
            </a>
            <PRStatusBadge status={pr.status} />
            <span style={{ fontSize: 13, color: "var(--text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {pr.title}
            </span>
            <span style={{
              fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)",
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              padding: "2px 7px", borderRadius: 5, flexShrink: 0,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200,
            }}>
              {pr.branch}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0, minWidth: 40, textAlign: "right" }}>
              {pr.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────────────── */

export default function ProjectsPage() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Group subprojects by their current pipeline phase
  const subsByPhase = (phaseId: number) =>
    SUB_PROJECTS.filter(s => {
      // Shipped projects completed phase 7, so they appear in Ship
      if (s.currentPhase === 7 && s.status === "shipped") return phaseId === 7;
      return s.currentPhase === phaseId;
    });

  // Always show all subs — highlight matching phase, dim the rest
  const matchesPhase = (sub: SubProject) => {
    if (selectedPhase === null) return true;
    if (sub.currentPhase === 7 && sub.status === "shipped") return selectedPhase === 7;
    return sub.currentPhase === selectedPhase;
  };

  const filteredSubs = search
    ? SUB_PROJECTS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()))
    : SUB_PROJECTS;

  const shippedCount = SUB_PROJECTS.filter(s => s.status === "shipped").length;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", minHeight: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
            APEX Framework
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: 32, fontWeight: 400, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 8,
          }}>
            Project Timeline
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
            {shippedCount}/{SUB_PROJECTS.length} sub-projects shipped through the 7-phase pipeline.
          </p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--bg-elevated)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "7px 12px", width: 220,
        }}>
          <Search size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input type="text" placeholder="Search..." aria-label="Search projects"
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ background: "none", border: "none", outline: "none", fontSize: 12, color: "var(--text)", width: "100%", fontFamily: "var(--font-body)" }}
          />
        </div>
      </div>

      {/* ── 7-Phase Pipeline Timeline ── */}
      <div style={{
        background: "var(--bg-elevated)", border: "1px solid var(--border)",
        borderRadius: 16, padding: "24px 24px 20px", marginBottom: 28,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)" }}>
            7-Phase Autonomous Pipeline
          </span>
          {selectedPhase !== null && (
            <button onClick={() => { setSelectedPhase(null); setExpandedSub(null); }}
              style={{
                background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                borderRadius: 6, padding: "2px 8px", cursor: "pointer",
                fontSize: 10, fontWeight: 600, color: "var(--accent)",
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              Show All <X size={10} />
            </button>
          )}
        </div>
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          overflowX: "auto", scrollbarWidth: "none",
        }}>
          {PIPELINE_PHASES.map((phase, i) => {
            const subs = subsByPhase(phase.id);
            const completed = subs.filter(s => s.status === "shipped").length;
            return (
              <PipelineNode
                key={phase.id}
                phase={phase}
                isLast={i === PIPELINE_PHASES.length - 1}
                isSelected={selectedPhase === phase.id}
                subCount={subs.length}
                completedCount={completed}
                onClick={() => {
                  setSelectedPhase(selectedPhase === phase.id ? null : phase.id);
                  setExpandedSub(null);
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ── Sub-projects for selected phase ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <h2 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: 22, fontWeight: 400, color: "var(--text)", letterSpacing: "-0.02em",
          }}>
            {selectedPhase !== null
              ? `${PIPELINE_PHASES.find(p => p.id === selectedPhase)?.name} Phase`
              : "All Sub-Projects"
            }
          </h2>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {filteredSubs.length} sub-project{filteredSubs.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredSubs.map((sub) => {
            const isMatch = matchesPhase(sub);
            return (
              <div key={sub.id} style={{
                opacity: selectedPhase !== null && !isMatch ? 0.4 : 1,
                transition: "opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
              }}>
                <SubProjectCard
                  sub={sub}
                  isExpanded={expandedSub === sub.id}
                  onToggle={() => setExpandedSub(expandedSub === sub.id ? null : sub.id)}
                />
              </div>
            );
          })}
          {filteredSubs.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)", fontSize: 13, fontStyle: "italic" }}>
              No sub-projects match your search.
            </div>
          )}
        </div>
      </div>

      <RecentPRs />
    </div>
  );
}
