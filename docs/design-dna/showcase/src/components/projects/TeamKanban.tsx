/**
 * TeamKanban — 4-column team stage board for a sub-project.
 * Shows tasks organised by stage: Design Review, Build, Quality, Security.
 */

import { useState } from "react";
import { X, CheckCircle2, Circle, ChevronDown, User } from "lucide-react";
import { TEAM_STAGES, DRI_COLORS } from "../../data/projects-data";
import type { SubProject, TeamTask } from "../../data/projects-data";

// ── Kanban Task Card ───────────────────────────────────────────────────────────

function KanbanTaskCard({ task }: { task: TeamTask }) {
  const [open, setOpen] = useState(false);
  const driColor = DRI_COLORS[task.dri];

  return (
    <div style={{
      borderRadius: 6, overflow: "hidden",
      background: task.done ? "color-mix(in srgb, var(--success) 6%, transparent)" : "var(--bg-elevated)",
      border: `1px solid ${task.done ? "color-mix(in srgb, var(--success) 20%, transparent)" : open ? "var(--accent)" : "var(--border)"}`,
      transition: "border-color 0.2s",
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", textAlign: "left", background: "none", border: "none",
        cursor: "pointer", padding: "6px 8px",
        color: task.done ? "var(--text-secondary)" : "var(--text)",
        display: "flex", flexDirection: "column", gap: 4,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
          {task.done
            ? <CheckCircle2 size={11} style={{ color: "var(--success)", flexShrink: 0, marginTop: 2 }} />
            : <Circle size={11} style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 2 }} />
          }
          <span style={{ fontSize: 11, lineHeight: 1.4, flex: 1 }}>{task.title}</span>
          <ChevronDown size={10} style={{
            color: "var(--text-muted)", flexShrink: 0, marginTop: 2,
            transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s",
          }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 16 }}>
          <User size={8} style={{ color: driColor }} />
          <span style={{
            fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 6,
            background: `color-mix(in srgb, ${driColor} 12%, transparent)`,
            color: driColor, letterSpacing: "0.03em",
          }}>
            {task.dri}
          </span>
          <span style={{ fontSize: 8, color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
            {task.id}
          </span>
        </div>
      </button>

      {open && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "8px 10px", background: "var(--bg-surface, var(--bg))", fontSize: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Status</span>
              <span style={{ fontWeight: 600, color: task.done ? "var(--success)" : "var(--accent)" }}>
                {task.done ? "Complete" : "In Progress"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Owner (DRI)</span>
              <span style={{ fontWeight: 600, color: driColor }}>{task.dri}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Stage</span>
              <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{task.stage}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Team Kanban ────────────────────────────────────────────────────────────────

interface TeamKanbanProps {
  sub: SubProject;
  onClose: () => void;
}

export function TeamKanban({ sub, onClose }: TeamKanbanProps) {
  const tasksByStage = (stage: SubProject["teamTasks"][number]["stage"]) =>
    sub.teamTasks.filter(t => t.stage === stage);

  return (
    <div style={{ borderTop: "1px solid var(--border)", padding: "16px 20px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)" }}>
          Team Pipeline
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
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
              background: "var(--bg-surface, var(--bg))", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderBottom: `2px solid ${stage.color}` }}>
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
                  <KanbanTaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
