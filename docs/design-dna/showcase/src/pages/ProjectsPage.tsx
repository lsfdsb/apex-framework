import { useState } from "react";
import { Link } from "../router/Router";
import {
  FolderOpen, Plus, Clock, GitBranch, CheckCircle2, AlertCircle,
  Search, Layers, GitPullRequest, Check, ExternalLink, Circle,
} from "lucide-react";

/* ── Data Types ───────────────────────────────────────────────────────────── */

type SubProjectStatus = "building" | "shipped" | "paused" | "planned";

interface PhaseData {
  total: number;
  done: number;
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
  tasksTotal: number;
  tasksDone: number;
  phases: {
    p0: PhaseData;
    p1: PhaseData;
    p2: PhaseData;
  };
}

interface Project {
  id: string;
  name: string;
  repo: string;
  description: string;
  subProjects: SubProject[];
}

interface PullRequest {
  number: number;
  title: string;
  status: "merged" | "open" | "closed";
  date: string;
  branch: string;
}

/* ── Projects Data ────────────────────────────────────────────────────────── */

const PROJECTS: Project[] = [
  {
    id: "apex-framework",
    name: "APEX Framework",
    repo: "lsfdsb/apex-framework",
    description: "Agent-Powered EXcellence for Claude Code — skills, hooks, agents, design system, and visual command center.",
    subProjects: [
      {
        id: "visual-hub",
        name: "Visual Pipeline HUB",
        description: "Web command center with OPS dashboard, task board, agent roster, and quality gates.",
        branch: "feat/visual-pipeline-hub",
        lastActive: "Just now",
        status: "building",
        tasksTotal: 27,
        tasksDone: 22,
        phases: { p0: { total: 10, done: 10 }, p1: { total: 8, done: 8 }, p2: { total: 9, done: 4 } },
      },
      {
        id: "v522-apple",
        name: "v5.22 — The Apple Release",
        description: "PM agent, 7-phase pipeline, Bueno rebrand, CI fixes, Node.js 22 LTS.",
        branch: "feat/v522-apple-audit",
        pr: "#202",
        prStatus: "merged",
        prUrl: "https://github.com/lsfdsb/apex-framework/pull/202",
        lastActive: "Today",
        status: "shipped",
        tasksTotal: 16,
        tasksDone: 16,
        phases: { p0: { total: 4, done: 4 }, p1: { total: 4, done: 4 }, p2: { total: 8, done: 8 } },
      },
      {
        id: "v521-quality",
        name: "v5.21 — Quality Gates & Safe Processes",
        description: "81 Apple-audit fixes, dynamic counts, portable shell, batch-reads rule.",
        branch: "feat/apple-grade-audit-fixes",
        pr: "#194",
        prStatus: "merged",
        prUrl: "https://github.com/lsfdsb/apex-framework/pull/194",
        lastActive: "Mar 24",
        status: "shipped",
        tasksTotal: 12,
        tasksDone: 12,
        phases: { p0: { total: 5, done: 5 }, p1: { total: 4, done: 4 }, p2: { total: 3, done: 3 } },
      },
      {
        id: "v520-production",
        name: "v5.20 — Production Readiness",
        description: "41 files: hooks complete, Oscar animations, DnaBackground, E2E tests.",
        branch: "feat/v5.20-production-readiness",
        pr: "#187",
        prStatus: "merged",
        prUrl: "https://github.com/lsfdsb/apex-framework/pull/187",
        lastActive: "Mar 23",
        status: "shipped",
        tasksTotal: 14,
        tasksDone: 14,
        phases: { p0: { total: 6, done: 6 }, p1: { total: 5, done: 5 }, p2: { total: 3, done: 3 } },
      },
      {
        id: "dna-showcase",
        name: "Design DNA Showcase",
        description: "14 premium UI templates, 33 starters, 39 components — the visual quality bar.",
        branch: "main",
        pr: "#187",
        prStatus: "merged",
        prUrl: "https://github.com/lsfdsb/apex-framework/pull/187",
        lastActive: "Mar 23",
        status: "shipped",
        tasksTotal: 18,
        tasksDone: 18,
        phases: { p0: { total: 8, done: 8 }, p1: { total: 6, done: 6 }, p2: { total: 4, done: 4 } },
      },
      {
        id: "perf-bundle",
        name: "Bundle Optimization",
        description: "544KB → 210KB (61% smaller). Lazy loading, code splitting, tree shaking.",
        branch: "perf/bundle-optimization",
        pr: "#185",
        prStatus: "merged",
        prUrl: "https://github.com/lsfdsb/apex-framework/pull/185",
        lastActive: "Mar 22",
        status: "shipped",
        tasksTotal: 5,
        tasksDone: 5,
        phases: { p0: { total: 3, done: 3 }, p1: { total: 2, done: 2 }, p2: { total: 0, done: 0 } },
      },
      {
        id: "supabase-rag",
        name: "Supabase RAG Pipeline",
        description: "AI-powered documentation search with vector embeddings and edge functions.",
        branch: "feat/rag-v2",
        lastActive: "Mar 20",
        status: "paused",
        tasksTotal: 10,
        tasksDone: 4,
        phases: { p0: { total: 10, done: 4 }, p1: { total: 0, done: 0 }, p2: { total: 0, done: 0 } },
      },
    ],
  },
];

/* ── Recent PRs Data ──────────────────────────────────────────────────────── */

const RECENT_PRS: PullRequest[] = [
  { number: 202, title: "feat(v5.22): PM agent, pipeline, rebrand, CI fixes", status: "merged", date: "Mar 25", branch: "feat/v522-apple-audit" },
  { number: 201, title: "refactor(hooks): single CHANGELOG owner", status: "merged", date: "Mar 25", branch: "fix/changelog-single-owner" },
  { number: 200, title: "fix(hooks): skip meta-docs in auto-changelog", status: "merged", date: "Mar 25", branch: "fix/auto-changelog-self-reference" },
  { number: 199, title: "fix(hooks): fix sed recursion + add startup sound", status: "merged", date: "Mar 25", branch: "fix/startup-hooks-and-sound" },
  { number: 198, title: "fix(output-style): add batch-reads-before-edits rule", status: "merged", date: "Mar 24", branch: "fix/batch-reads-rule" },
];

/* ── Status Config ────────────────────────────────────────────────────────── */

const STATUS_CONFIG: Record<SubProjectStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  building: { label: "Building", color: "var(--accent)", icon: AlertCircle },
  shipped:  { label: "Shipped",  color: "var(--success)", icon: CheckCircle2 },
  paused:   { label: "Paused",   color: "var(--text-muted)", icon: Clock },
  planned:  { label: "Planned",  color: "var(--warning)", icon: Layers },
};

/* ── Phase Progress Bar ───────────────────────────────────────────────────── */

function PhaseBar({ label, data, isLast }: { label: string; data: PhaseData; isLast?: boolean }) {
  if (data.total === 0) {
    return (
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em" }}>{label}</span>
          <span style={{ fontSize: 9, color: "var(--text-muted)" }}>—</span>
        </div>
        <div style={{ height: 3, borderRadius: 2, background: "var(--border)" }} />
        {!isLast && <div style={{ width: 1, height: 8, background: "var(--border)", margin: "0 auto" }} />}
      </div>
    );
  }

  const pct = Math.round((data.done / data.total) * 100);
  const complete = pct === 100;

  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: complete ? "var(--success)" : "var(--text-secondary)", letterSpacing: "0.05em" }}>{label}</span>
        {complete
          ? <Check size={9} style={{ color: "var(--success)" }} />
          : <span style={{ fontSize: 9, fontWeight: 600, color: "var(--accent)" }}>{pct}%</span>
        }
      </div>
      <div style={{ height: 3, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 2,
          background: complete ? "var(--success)" : "var(--accent)",
          width: `${pct}%`,
          transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        }} />
      </div>
    </div>
  );
}

/* ── Phase Progress Row ───────────────────────────────────────────────────── */

function PhaseProgress({ phases }: { phases: SubProject["phases"] }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <PhaseBar label="P0" data={phases.p0} />
      <PhaseBar label="P1" data={phases.p1} />
      <PhaseBar label="P2" data={phases.p2} isLast />
    </div>
  );
}

/* ── Completion Ring ──────────────────────────────────────────────────────── */

function CompletionRing({ pct }: { pct: number }) {
  const radius = 16;
  const circ = 2 * Math.PI * radius;
  const filled = (pct / 100) * circ;
  const color = pct > 80 ? "var(--success)" : pct > 50 ? "var(--accent)" : "var(--warning)";

  return (
    <svg width={40} height={40} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
      <circle cx={20} cy={20} r={radius} fill="none" stroke="var(--border)" strokeWidth={3} />
      <circle
        cx={20} cy={20} r={radius} fill="none"
        stroke={color} strokeWidth={3}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 20 20)"
        style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
      <text
        x={20} y={20}
        textAnchor="middle" dominantBaseline="central"
        fontSize={8} fontWeight={700}
        fill={color}
        style={{ fontFamily: "var(--font-body)" }}
      >
        {pct}%
      </text>
    </svg>
  );
}

/* ── Sub-Project Card ─────────────────────────────────────────────────────── */

function SubProjectCard({ sub }: { sub: SubProject }) {
  const status = STATUS_CONFIG[sub.status];
  const StatusIcon = status.icon;

  return (
    <Link to={`/tasks?project=${sub.id}`} style={{ textDecoration: "none", display: "flex" }}>
      <div
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "20px",
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
          width: "100%",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.borderColor = status.color;
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)", letterSpacing: "-0.01em" }}>
            {sub.name}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: status.color, fontWeight: 600, flexShrink: 0 }}>
            <StatusIcon size={12} />
            {status.label}
          </div>
        </div>

        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 12 }}>
          {sub.description}
        </p>

        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, fontSize: 11, color: "var(--text-muted)", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <GitBranch size={11} /> {sub.branch}
          </span>
          {sub.pr && sub.prUrl ? (
            <a
              href={sub.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                background: sub.prStatus === "merged"
                  ? "color-mix(in srgb, var(--success) 12%, transparent)"
                  : sub.prStatus === "open"
                  ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                  : "color-mix(in srgb, var(--text-muted) 12%, transparent)",
                color: sub.prStatus === "merged"
                  ? "var(--success)"
                  : sub.prStatus === "open"
                  ? "var(--accent)"
                  : "var(--text-muted)",
                fontWeight: 600,
                padding: "2px 8px", borderRadius: 6, fontSize: 10,
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.75"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              <GitPullRequest size={10} />
              PR {sub.pr}
              {sub.prStatus === "merged" && <Check size={8} />}
            </a>
          ) : sub.pr ? (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
              color: "var(--accent)", fontWeight: 600,
              padding: "2px 8px", borderRadius: 6, fontSize: 10,
            }}>
              <GitPullRequest size={10} />
              PR {sub.pr}
            </span>
          ) : null}
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={11} /> {sub.lastActive}
          </span>
        </div>

        {/* Phase progress */}
        <PhaseProgress phases={sub.phases} />

        {/* Task count footnote */}
        <div style={{ marginTop: 8, fontSize: 10, color: "var(--text-muted)", textAlign: "right" }}>
          {sub.tasksDone}/{sub.tasksTotal} tasks
        </div>
      </div>
    </Link>
  );
}

/* ── PR Status Badge ──────────────────────────────────────────────────────── */

function PRStatusBadge({ status }: { status: PullRequest["status"] }) {
  const cfg = {
    merged: { label: "merged", bg: "color-mix(in srgb, var(--success) 12%, transparent)", color: "var(--success)" },
    open:   { label: "open",   bg: "color-mix(in srgb, var(--accent) 12%, transparent)",  color: "var(--accent)" },
    closed: { label: "closed", bg: "color-mix(in srgb, var(--text-muted) 12%, transparent)", color: "var(--text-muted)" },
  }[status];

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: cfg.bg, color: cfg.color,
      fontWeight: 600, fontSize: 10,
      padding: "2px 8px", borderRadius: 6,
    }}>
      {status === "merged" && <Check size={8} />}
      {status === "open" && <Circle size={8} />}
      {cfg.label}
    </span>
  );
}

/* ── Recent PRs Section ───────────────────────────────────────────────────── */

function RecentPRs() {
  return (
    <div style={{ marginTop: 40 }}>
      {/* Section header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingBottom: 12, borderBottom: "1px solid var(--border)", marginBottom: 4,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <GitPullRequest size={16} style={{ color: "var(--accent)" }} />
          <h2 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: 18, fontWeight: 400, color: "var(--text)", letterSpacing: "-0.02em",
          }}>
            Recent Pull Requests
          </h2>
        </div>
        <a
          href="https://github.com/lsfdsb/apex-framework/pulls"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 12, color: "var(--accent)", textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          View all on GitHub
          <ExternalLink size={12} />
        </a>
      </div>

      {/* PR rows */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {RECENT_PRS.map((pr, idx) => (
          <div
            key={pr.number}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "12px 8px",
              borderBottom: idx < RECENT_PRS.length - 1 ? "1px solid var(--border)" : "none",
              transition: "background 0.15s",
              borderRadius: idx === 0 ? "8px 8px 0 0" : idx === RECENT_PRS.length - 1 ? "0 0 8px 8px" : 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 4%, transparent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
          >
            {/* PR number */}
            <a
              href={`https://github.com/lsfdsb/apex-framework/pull/${pr.number}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12, fontWeight: 700, color: "var(--accent)",
                textDecoration: "none", flexShrink: 0, minWidth: 36,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              #{pr.number}
            </a>

            {/* Status badge */}
            <PRStatusBadge status={pr.status} />

            {/* Title */}
            <span style={{
              fontSize: 13, color: "var(--text)", flex: 1,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {pr.title}
            </span>

            {/* Branch */}
            <span style={{
              fontSize: 10, color: "var(--text-muted)",
              fontFamily: "var(--font-mono, monospace)",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              padding: "2px 7px", borderRadius: 5, flexShrink: 0,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              maxWidth: 200,
            }}>
              {pr.branch}
            </span>

            {/* Date */}
            <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0, minWidth: 40, textAlign: "right" }}>
              {pr.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Project Section ──────────────────────────────────────────────────────── */

function ProjectSection({ project }: { project: Project }) {
  const totalTasks = project.subProjects.reduce((sum, s) => sum + s.tasksTotal, 0);
  const doneTasks  = project.subProjects.reduce((sum, s) => sum + s.tasksDone, 0);
  const activeCount = project.subProjects.filter(s => s.status === "building").length;
  const overallPct  = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div style={{ marginBottom: 40 }}>
      {/* Project header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
        padding: "12px 0", borderBottom: "1px solid var(--border)",
      }}>
        <FolderOpen size={20} style={{ color: "var(--accent)" }} />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-body)", letterSpacing: "-0.01em" }}>
            {project.name}
          </h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {project.repo}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "var(--text-muted)" }}>
          <span><strong style={{ color: "var(--text-secondary)" }}>{project.subProjects.length}</strong> sub-projects</span>
          <span><strong style={{ color: "var(--accent)" }}>{activeCount}</strong> active</span>
          <span><strong style={{ color: "var(--text-secondary)" }}>{doneTasks}/{totalTasks}</strong> tasks</span>
          <span>
            <strong style={{ color: "var(--success)" }}>
              {project.subProjects.filter(s => s.prStatus === "merged").length}
            </strong> PRs merged
          </span>
        </div>

        {/* Completion ring */}
        <CompletionRing pct={overallPct} />
      </div>

      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: "12px 0 20px" }}>
        {project.description}
      </p>

      {/* Sub-projects grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 12,
      }}>
        {project.subProjects.map((sub) => (
          <SubProjectCard key={sub.id} sub={sub} />
        ))}

        {/* New sub-project */}
        <div
          style={{
            border: "1px dashed var(--border)",
            borderRadius: 12,
            padding: "32px 20px",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 8, cursor: "pointer", transition: "all 0.2s",
            minHeight: 160,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 4%, transparent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.background = "";
          }}
          onClick={() => alert("New sub-project — starts with /prd")}
        >
          <Plus size={18} style={{ color: "var(--accent)" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>New Sub-Project</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Starts with a PRD</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────────────── */

export default function ProjectsPage() {
  const [search, setSearch] = useState("");

  const filtered = PROJECTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.subProjects.some(s => s.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: 960, minHeight: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: 32, fontWeight: 400, color: "var(--text)",
            letterSpacing: "-0.02em", marginBottom: 8,
          }}>
            Projects
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
            Your repos and their sub-projects. Select one to open its pipeline.
          </p>
        </div>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--bg-elevated)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "7px 12px", width: 220,
        }}>
          <Search size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "none", border: "none", outline: "none",
              fontSize: 12, color: "var(--text)", width: "100%",
              fontFamily: "var(--font-body)",
            }}
          />
        </div>
      </div>

      {/* Projects */}
      {filtered.map((project) => (
        <ProjectSection key={project.id} project={project} />
      ))}

      {/* Recent PRs */}
      <RecentPRs />
    </div>
  );
}
