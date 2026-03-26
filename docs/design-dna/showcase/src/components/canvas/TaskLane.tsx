/**
 * TaskLane — horizontal pipeline bar showing task counts per column.
 * Compact: 80px tall, fixed at bottom of the canvas viewport.
 * Clicking a column toggles an expanded task list.
 */

import { useState } from "react";
import type { TaskItem, TaskColumn } from "../../data/hub-types";

// ── Tag colors ────────────────────────────────────────────────────────────────

const TAG_COLORS: Record<string, string> = {
  feat: "var(--accent)",
  fix: "var(--destructive)",
  refactor: "var(--text-muted)",
  docs: "var(--success)",
  chore: "var(--text-muted)",
  perf: "color-mix(in srgb, var(--accent) 70%, #f97316)",
  a11y: "var(--success)",
  security: "var(--destructive)",
  test: "var(--text-secondary)",
};

// ── Column config ─────────────────────────────────────────────────────────────

interface Column {
  id: TaskColumn;
  label: string;
  tasks: TaskItem[];
}

// ── Mini task card ─────────────────────────────────────────────────────────────

function MiniTaskCard({ task }: { task: TaskItem }) {
  const tagColor = task.tag ? (TAG_COLORS[task.tag] ?? "var(--text-muted)") : "var(--text-muted)";
  return (
    <div style={{
      padding: "5px 8px",
      background: "var(--bg-elevated)",
      border: "1px solid var(--border)",
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      gap: 6,
      overflow: "hidden",
    }}>
      {task.tag && (
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: tagColor, flexShrink: 0 }} />
      )}
      <span style={{ fontSize: 11, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
        {task.title}
      </span>
      <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono)", flexShrink: 0, textTransform: "uppercase" }}>
        {task.dri.replace("project-manager", "pm").replace("technical-writer", "tw").replace("design-reviewer", "dr")}
      </span>
    </div>
  );
}

// ── TaskLane ──────────────────────────────────────────────────────────────────

interface TaskLaneProps {
  backlog: TaskItem[];
  todo: TaskItem[];
  inProgress: TaskItem[];
  review: TaskItem[];
  done: TaskItem[];
}

export function TaskLane({ backlog, todo, inProgress, review, done }: TaskLaneProps) {
  const [expanded, setExpanded] = useState<TaskColumn | null>(null);

  const columns: Column[] = [
    { id: "backlog", label: "Backlog", tasks: backlog },
    { id: "todo", label: "Todo", tasks: todo },
    { id: "in-progress", label: "In Progress", tasks: inProgress },
    { id: "review", label: "Review", tasks: review },
    { id: "done", label: "Done", tasks: done },
  ];

  const activeCol = expanded ? columns.find((c) => c.id === expanded) : null;
  const visibleTasks = activeCol?.tasks.slice(0, 5) ?? [];
  const overflow = activeCol ? Math.max(0, activeCol.tasks.length - 5) : 0;

  function toggleColumn(id: TaskColumn) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <div
      aria-label="Task pipeline overview"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        background: "var(--bg-elevated)",
        borderTop: "1px solid var(--border)",
        userSelect: "none",
      }}
    >
      {/* Expanded task list */}
      {expanded && activeCol && (
        <div style={{
          padding: "10px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          maxHeight: 180,
          overflowY: "auto",
          background: "color-mix(in srgb, var(--bg) 60%, transparent)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              {activeCol.label}
            </span>
            <button
              onClick={() => setExpanded(null)}
              aria-label="Close expanded view"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 14, padding: "0 4px", lineHeight: 1 }}
            >
              ×
            </button>
          </div>
          {visibleTasks.map((t) => <MiniTaskCard key={t.id} task={t} />)}
          {overflow > 0 && (
            <p style={{ margin: 0, fontSize: 10, color: "var(--text-muted)", textAlign: "center" }}>
              +{overflow} more
            </p>
          )}
          {activeCol.tasks.length === 0 && (
            <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)", fontStyle: "italic" }}>No tasks here</p>
          )}
        </div>
      )}

      {/* Column buttons bar */}
      <div style={{ display: "flex", height: 56 }}>
        {columns.map((col) => {
          const isActive = expanded === col.id;
          const isInProgress = col.id === "in-progress";
          const count = col.tasks.length;

          return (
            <button
              key={col.id}
              onClick={() => toggleColumn(col.id)}
              aria-label={`${col.label}: ${count} tasks`}
              aria-pressed={isActive}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                padding: "0 8px",
                background: isActive
                  ? "color-mix(in srgb, var(--accent) 8%, transparent)"
                  : "none",
                border: "none",
                borderRight: "1px solid var(--border)",
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: isInProgress
                    ? "var(--accent)"
                    : count > 0
                      ? "var(--text)"
                      : "var(--text-muted)",
                  lineHeight: 1,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {count}
              </span>
              <span style={{
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: isActive ? "var(--accent)" : "var(--text-muted)",
              }}>
                {col.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
