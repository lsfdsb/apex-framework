import { useState } from "react";
import { Link } from "../router/Router";
import { FolderOpen, Plus, Clock, GitBranch, CheckCircle2, AlertCircle, Search, MoreHorizontal } from "lucide-react";

/* ── Mock Projects ────────────────────────────────────────────────────────── */

const PROJECTS = [
  {
    id: "phoenix-crm",
    name: "Phoenix CRM V3",
    description: "Full-stack CRM with pipeline, contacts, deals, and analytics",
    branch: "feat/phoenix-v3",
    lastActive: "2 hours ago",
    status: "building" as const,
    phase: 5,
    tasksTotal: 14,
    tasksDone: 7,
    stack: ["Next.js", "Supabase", "Tailwind"],
  },
  {
    id: "apex-hub",
    name: "APEX Visual HUB",
    description: "Command center dashboard for the APEX Framework",
    branch: "feat/visual-pipeline-hub",
    lastActive: "Just now",
    status: "building" as const,
    phase: 5,
    tasksTotal: 26,
    tasksDone: 15,
    stack: ["React", "Vite", "TypeScript"],
  },
  {
    id: "dna-showcase",
    name: "Design DNA Showcase",
    description: "14 premium UI templates and component library",
    branch: "main",
    lastActive: "1 day ago",
    status: "shipped" as const,
    phase: 7,
    tasksTotal: 18,
    tasksDone: 18,
    stack: ["React", "Tailwind", "Vite"],
  },
  {
    id: "supabase-rag",
    name: "Supabase RAG Pipeline",
    description: "AI-powered documentation search with vector embeddings",
    branch: "feat/rag-v2",
    lastActive: "3 days ago",
    status: "paused" as const,
    phase: 3,
    tasksTotal: 10,
    tasksDone: 4,
    stack: ["Supabase", "Edge Functions", "pgvector"],
  },
] as const;

type ProjectStatus = "building" | "shipped" | "paused";

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  building: { label: "Building", color: "var(--accent)", icon: AlertCircle },
  shipped: { label: "Shipped", color: "var(--success)", icon: CheckCircle2 },
  paused: { label: "Paused", color: "var(--text-muted)", icon: Clock },
};

/* ── Project Card ─────────────────────────────────────────────────────────── */

function ProjectCard({ project }: { project: typeof PROJECTS[number] }) {
  const status = STATUS_CONFIG[project.status];
  const StatusIcon = status.icon;
  const progress = Math.round((project.tasksDone / project.tasksTotal) * 100);

  return (
    <Link to="/pipeline" style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "24px 22px",
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.borderColor = status.color;
          e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.2)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-body)", letterSpacing: "-0.01em", marginBottom: 4 }}>
              {project.name}
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.4 }}>
              {project.description}
            </p>
          </div>
          <button
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, borderRadius: 6, flexShrink: 0 }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            aria-label="Project options"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Status + Branch */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: status.color, fontWeight: 600 }}>
            <StatusIcon size={13} />
            {status.label}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-muted)" }}>
            <GitBranch size={12} />
            {project.branch}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-muted)", marginLeft: "auto" }}>
            <Clock size={12} />
            {project.lastActive}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Phase {project.phase}/7
            </span>
            <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>
              {project.tasksDone}/{project.tasksTotal} tasks · {progress}%
            </span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              borderRadius: 2,
              background: status.color,
              width: `${progress}%`,
              transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
            }} />
          </div>
        </div>

        {/* Stack tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {project.stack.map((tech) => (
            <span key={tech} style={{
              fontSize: 10, fontWeight: 500, color: "var(--text-muted)",
              padding: "2px 8px", borderRadius: 6,
              background: "color-mix(in srgb, var(--text-muted) 10%, transparent)",
              letterSpacing: "0.02em",
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

/* ── New Project Card ─────────────────────────────────────────────────────── */

function NewProjectCard() {
  return (
    <div
      style={{
        border: "2px dashed var(--border)",
        borderRadius: 14,
        padding: "48px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        cursor: "pointer",
        transition: "all 0.25s",
        minHeight: 200,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 5%, transparent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.background = "";
      }}
      onClick={() => alert("New project wizard coming soon")}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: "color-mix(in srgb, var(--accent) 12%, transparent)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--accent)",
      }}>
        <Plus size={20} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)" }}>New Project</span>
      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Start with a PRD</span>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────────────── */

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const filtered = PROJECTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: 32, fontWeight: 400, color: "var(--text)",
          letterSpacing: "-0.02em", marginBottom: 8,
        }}>
          Projects
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Select a project to open its pipeline, or start a new one.
        </p>
      </div>

      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "var(--bg-elevated)", border: "1px solid var(--border)",
        borderRadius: 10, padding: "8px 14px", marginBottom: 24,
      }}>
        <Search size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "none", border: "none", outline: "none",
            fontSize: 13, color: "var(--text)", width: "100%",
            fontFamily: "var(--font-body)",
          }}
        />
      </div>

      {/* Project Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: 16,
      }}>
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        <NewProjectCard />
      </div>
    </div>
  );
}
