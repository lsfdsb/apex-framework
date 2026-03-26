/**
 * ProjectCard — Collapsible project group container.
 * Shows project name, description, sub-project count badges,
 * progress bar, and expands to show sub-project cards.
 */

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Project } from "../../data/projects-data";
import { SubProjectCard } from "./SubProjectCard";

interface ProjectCardProps {
  project: Project;
  expandedSub: string | null;
  onSubToggle: (id: string) => void;
}

export function ProjectCard({ project, expandedSub, onSubToggle }: ProjectCardProps) {
  const [collapsed, setCollapsed] = useState(project.collapsed);
  const totalSubs = project.subProjects.length;
  const shippedSubs = project.subProjects.filter(s => s.status === "shipped").length;
  const progress = totalSubs > 0 ? (shippedSubs / totalSubs) * 100 : 0;

  return (
    <div style={{
      borderRadius: 16, overflow: "hidden",
      border: "1px solid var(--border)",
      background: "var(--bg-elevated)",
      transition: "box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
      boxShadow: !collapsed ? "0 4px 24px rgba(0,0,0,0.12)" : "none",
    }}>
      {/* Accent bar */}
      <div style={{ height: 3, background: "var(--accent)", width: "100%" }} />

      {/* Project header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          width: "100%", textAlign: "left", background: "none", border: "none",
          cursor: "pointer", padding: "18px 24px", color: "var(--text)",
          display: "flex", alignItems: "center", gap: 14,
        }}
        aria-expanded={!collapsed}
        aria-label={`${project.name} — ${collapsed ? "expand" : "collapse"}`}
      >
        {/* Chevron */}
        <div style={{
          flexShrink: 0,
          transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
          transform: collapsed ? "rotate(0deg)" : "rotate(90deg)",
        }}>
          <ChevronRight size={16} style={{ color: "var(--accent)" }} />
        </div>

        {/* Name + description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontStyle: "italic",
              fontSize: 20, fontWeight: 400, color: "var(--text)", letterSpacing: "-0.02em", margin: 0,
            }}>
              {project.name}
            </h2>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
              color: "var(--accent)", letterSpacing: "0.04em",
            }}>
              {totalSubs} sub-project{totalSubs !== 1 ? "s" : ""}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
              background: shippedSubs === totalSubs
                ? "color-mix(in srgb, var(--success) 12%, transparent)"
                : "color-mix(in srgb, var(--warning) 12%, transparent)",
              color: shippedSubs === totalSubs ? "var(--success)" : "var(--warning)",
              letterSpacing: "0.04em",
            }}>
              {shippedSubs}/{totalSubs} shipped
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
            {project.description}
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ flexShrink: 0, width: 100 }}>
          <div style={{ fontSize: 9, color: "var(--text-muted)", textAlign: "right", marginBottom: 4, fontWeight: 600 }}>
            {Math.round(progress)}% complete
          </div>
          <div style={{ height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 2,
              background: progress === 100 ? "var(--success)" : "var(--accent)",
              width: `${progress}%`,
              transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            }} />
          </div>
        </div>
      </button>

      {/* Sub-projects (collapsible) */}
      <div style={{
        overflow: "hidden",
        maxHeight: collapsed ? 0 : 9999,
        transition: "max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
      }}>
        <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {project.subProjects.map((sub) => (
            <SubProjectCard
              key={sub.id}
              sub={sub}
              isExpanded={expandedSub === sub.id}
              onToggle={() => onSubToggle(sub.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
