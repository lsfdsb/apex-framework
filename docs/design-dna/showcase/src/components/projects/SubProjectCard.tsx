/**
 * SubProjectCard — Individual sub-project card.
 * Shows status badge, pipeline progress bar, branch/PR info,
 * team task count, and expands to show TeamKanban.
 */

import { GitBranch, GitPullRequest, Check, Clock } from "lucide-react";
import { PIPELINE_PHASES, STATUS_CFG } from "../../data/projects-data";
import type { SubProject } from "../../data/projects-data";
import { TeamKanban } from "./TeamKanban";

interface SubProjectCardProps {
  sub: SubProject;
  isExpanded: boolean;
  onToggle: () => void;
}

export function SubProjectCard({ sub, isExpanded, onToggle }: SubProjectCardProps) {
  const status = STATUS_CFG[sub.status];
  const StatusIcon = status.icon;
  const doneTasks = sub.teamTasks.filter(t => t.done).length;
  const totalTasks = sub.teamTasks.length;
  const currentPhaseName = PIPELINE_PHASES.find(p => p.id === sub.currentPhase)?.name ?? "—";

  return (
    <div style={{
      background: "var(--bg-elevated)", border: `1px solid ${isExpanded ? "var(--accent)" : "var(--border)"}`,
      borderRadius: 12, overflow: "hidden",
      transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
      boxShadow: isExpanded ? "0 8px 32px rgba(0,0,0,0.2)" : "none",
    }}>
      <button onClick={onToggle} style={{
        width: "100%", textAlign: "left", background: "none", border: "none",
        cursor: "pointer", padding: "16px 20px", color: "var(--text)",
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        {/* Title row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", letterSpacing: "-0.01em", margin: 0 }}>
              {sub.name}
            </h3>
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

        {/* Description */}
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

        {/* Pipeline progress bar */}
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
