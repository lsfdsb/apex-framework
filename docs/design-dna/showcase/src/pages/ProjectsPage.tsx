import { useState } from "react";
import { Link } from "../router/Router";
import { FolderOpen, Plus, Clock, GitBranch, CheckCircle2, AlertCircle, Search, ChevronRight, Layers } from "lucide-react";

/* ── Data Types ───────────────────────────────────────────────────────────── */

type SubProjectStatus = "building" | "shipped" | "paused" | "planned";

interface SubProject {
  id: string;
  name: string;
  description: string;
  branch: string;
  pr?: string;
  lastActive: string;
  status: SubProjectStatus;
  phase: number;
  tasksTotal: number;
  tasksDone: number;
}

interface Project {
  id: string;
  name: string;
  repo: string;
  description: string;
  subProjects: SubProject[];
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
        phase: 5,
        tasksTotal: 26,
        tasksDone: 18,
      },
      {
        id: "v522-apple",
        name: "v5.22 — The Apple Release",
        description: "PM agent, 7-phase pipeline, Bueno rebrand, CI fixes, Node.js 22 LTS.",
        branch: "feat/v522-apple-audit",
        pr: "#202",
        lastActive: "Today",
        status: "shipped",
        phase: 7,
        tasksTotal: 16,
        tasksDone: 16,
      },
      {
        id: "v521-quality",
        name: "v5.21 — Quality Gates & Safe Processes",
        description: "81 Apple-audit fixes, dynamic counts, portable shell, batch-reads rule.",
        branch: "feat/apple-grade-audit-fixes",
        pr: "#194",
        lastActive: "Mar 24",
        status: "shipped",
        phase: 7,
        tasksTotal: 12,
        tasksDone: 12,
      },
      {
        id: "v520-production",
        name: "v5.20 — Production Readiness",
        description: "41 files: hooks complete, Oscar animations, DnaBackground, E2E tests.",
        branch: "feat/v5.20-production-readiness",
        pr: "#187",
        lastActive: "Mar 23",
        status: "shipped",
        phase: 7,
        tasksTotal: 14,
        tasksDone: 14,
      },
      {
        id: "dna-showcase",
        name: "Design DNA Showcase",
        description: "14 premium UI templates, 33 starters, 39 components — the visual quality bar.",
        branch: "main",
        pr: "#187",
        lastActive: "Mar 23",
        status: "shipped",
        phase: 7,
        tasksTotal: 18,
        tasksDone: 18,
      },
      {
        id: "perf-bundle",
        name: "Bundle Optimization",
        description: "544KB → 210KB (61% smaller). Lazy loading, code splitting, tree shaking.",
        branch: "perf/bundle-optimization",
        pr: "#185",
        lastActive: "Mar 22",
        status: "shipped",
        phase: 7,
        tasksTotal: 5,
        tasksDone: 5,
      },
      {
        id: "supabase-rag",
        name: "Supabase RAG Pipeline",
        description: "AI-powered documentation search with vector embeddings and edge functions.",
        branch: "feat/rag-v2",
        lastActive: "Mar 20",
        status: "paused",
        phase: 3,
        tasksTotal: 10,
        tasksDone: 4,
      },
    ],
  },
];

/* ── Status Config ────────────────────────────────────────────────────────── */

const STATUS_CONFIG: Record<SubProjectStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  building: { label: "Building", color: "var(--accent)", icon: AlertCircle },
  shipped: { label: "Shipped", color: "var(--success)", icon: CheckCircle2 },
  paused: { label: "Paused", color: "var(--text-muted)", icon: Clock },
  planned: { label: "Planned", color: "var(--warning)", icon: Layers },
};

/* ── Sub-Project Card ─────────────────────────────────────────────────────── */

function SubProjectCard({ sub }: { sub: SubProject }) {
  const status = STATUS_CONFIG[sub.status];
  const StatusIcon = status.icon;
  const progress = Math.round((sub.tasksDone / sub.tasksTotal) * 100);

  return (
    <Link to="/pipeline" style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "20px",
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
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
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)", letterSpacing: "-0.01em" }}>
            {sub.name}
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: status.color, fontWeight: 600, flexShrink: 0 }}>
            <StatusIcon size={12} />
            {status.label}
          </div>
        </div>

        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 12 }}>
          {sub.description}
        </p>

        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 11, color: "var(--text-muted)", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <GitBranch size={11} /> {sub.branch}
          </span>
          {sub.pr && (
            <span style={{
              display: "flex", alignItems: "center", gap: 3,
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
              color: "var(--accent)", fontWeight: 600,
              padding: "1px 7px", borderRadius: 6, fontSize: 10,
            }}>
              PR {sub.pr}
            </span>
          )}
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={11} /> {sub.lastActive}
          </span>
        </div>

        {/* Progress */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Phase {sub.phase}/7</span>
            <span style={{ fontSize: 10, color: "var(--text-secondary)", fontWeight: 600 }}>{sub.tasksDone}/{sub.tasksTotal} tasks</span>
          </div>
          <div style={{ height: 3, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 2, background: status.color,
              width: `${progress}%`, transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
            }} />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Project Section ──────────────────────────────────────────────────────── */

function ProjectSection({ project }: { project: Project }) {
  const totalTasks = project.subProjects.reduce((sum, s) => sum + s.tasksTotal, 0);
  const doneTasks = project.subProjects.reduce((sum, s) => sum + s.tasksDone, 0);
  const activeCount = project.subProjects.filter(s => s.status === "building").length;

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
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-muted)" }}>
          <span><strong style={{ color: "var(--text-secondary)" }}>{project.subProjects.length}</strong> sub-projects</span>
          <span><strong style={{ color: "var(--accent)" }}>{activeCount}</strong> active</span>
          <span><strong style={{ color: "var(--text-secondary)" }}>{doneTasks}/{totalTasks}</strong> tasks</span>
        </div>
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
    <div style={{ maxWidth: 960 }}>
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
    </div>
  );
}
