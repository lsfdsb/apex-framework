import { useState } from "react";
import { GitPullRequest, Search, Check, Circle, ExternalLink, X } from "lucide-react";
import { PROJECTS, ALL_SUB_PROJECTS, RECENT_PRS, PIPELINE_PHASES } from "../data/projects-data";
import type { PullRequest } from "../data/projects-data";
import { PipelineTimeline } from "../components/projects/PipelineTimeline";
import { ProjectCard } from "../components/projects/ProjectCard";

// ── PR Status Badge ────────────────────────────────────────────────────────────

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

// ── Recent PRs (inline — simple list, no sub-components needed) ────────────────

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

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const subsByPhase = (phaseId: number) =>
    ALL_SUB_PROJECTS.filter(s => {
      if (s.currentPhase === 7 && s.status === "shipped") return phaseId === 7;
      return s.currentPhase === phaseId;
    });

  const filteredProjects = search
    ? PROJECTS.map(p => ({
        ...p,
        subProjects: p.subProjects.filter(s =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.description.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(p => p.subProjects.length > 0)
    : PROJECTS;

  const shippedCount = ALL_SUB_PROJECTS.filter(s => s.status === "shipped").length;
  const totalCount = ALL_SUB_PROJECTS.length;

  const handleSubToggle = (id: string) => {
    setExpandedSub(expandedSub === id ? null : id);
  };

  const handleSelectPhase = (phaseId: number) => {
    setSelectedPhase(selectedPhase === phaseId ? null : phaseId);
    setExpandedSub(null);
  };

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
            {shippedCount}/{totalCount} sub-projects shipped through the 7-phase pipeline.
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

      {/* 7-Phase Pipeline Timeline */}
      <div style={{
        background: "var(--bg-elevated)", border: "1px solid var(--border)",
        borderRadius: 16, padding: "24px 24px 20px", marginBottom: 28,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
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
        <PipelineTimeline
          selectedPhase={selectedPhase}
          onSelectPhase={handleSelectPhase}
          subsByPhase={subsByPhase}
        />
      </div>

      {/* Project Groups */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <h2 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic",
            fontSize: 22, fontWeight: 400, color: "var(--text)", letterSpacing: "-0.02em",
          }}>
            {selectedPhase !== null
              ? `${PIPELINE_PHASES.find(p => p.id === selectedPhase)?.name} Phase`
              : "All Projects"
            }
          </h2>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filteredProjects.map((project) => {
            const visibleSubs = selectedPhase !== null
              ? project.subProjects.filter(s => {
                  if (s.currentPhase === 7 && s.status === "shipped") return selectedPhase === 7;
                  return s.currentPhase === selectedPhase;
                })
              : project.subProjects;
            if (selectedPhase !== null && visibleSubs.length === 0) return null;
            const displayProject = selectedPhase !== null ? { ...project, subProjects: visibleSubs } : project;
            return (
              <ProjectCard
                key={project.id}
                project={displayProject}
                expandedSub={expandedSub}
                onSubToggle={handleSubToggle}
              />
            );
          })}
          {filteredProjects.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)", fontSize: 13, fontStyle: "italic" }}>
              No projects match your search.
            </div>
          )}
        </div>
      </div>

      <RecentPRs />
    </div>
  );
}
