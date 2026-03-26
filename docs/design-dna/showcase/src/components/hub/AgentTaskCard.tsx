/**
 * AgentTaskCard — compact task link shown inside an agent card.
 * Used for in-progress tasks (variant: "active") and recently completed
 * tasks (variant: "done"). Clicking navigates to the task in TasksPage.
 */

import type { TaskItem } from "../../data/hub-types";

export interface AgentTaskCardProps {
  task: TaskItem;
  /** "active" = in-progress styling, "done" = muted styling */
  variant: "active" | "done";
}

export function AgentTaskCard({ task, variant }: AgentTaskCardProps) {
  const isActive = variant === "active";
  const tagColor = isActive ? "var(--accent)" : "var(--text-muted)";

  return (
    <a
      href={`#/tasks?task=${encodeURIComponent(task.id)}`}
      className="agent-task-card"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        background: isActive
          ? "color-mix(in srgb, var(--accent) 6%, transparent)"
          : "var(--bg-surface)",
        border: `1px solid ${isActive
          ? "color-mix(in srgb, var(--accent) 20%, transparent)"
          : "var(--border)"}`,
        borderRadius: 8,
        textDecoration: "none",
        transition: "background 0.15s ease, border-color 0.15s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = isActive
          ? "color-mix(in srgb, var(--accent) 12%, transparent)"
          : "var(--bg-elevated)";
        el.style.borderColor = isActive
          ? "color-mix(in srgb, var(--accent) 40%, transparent)"
          : "var(--border)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = isActive
          ? "color-mix(in srgb, var(--accent) 6%, transparent)"
          : "var(--bg-surface)";
        el.style.borderColor = isActive
          ? "color-mix(in srgb, var(--accent) 20%, transparent)"
          : "var(--border)";
      }}
    >
      {/* Status indicator dot */}
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: isActive ? "var(--accent)" : "var(--text-muted)",
          flexShrink: 0,
        }}
      />

      {/* Task title */}
      <span
        style={{
          fontSize: 11,
          color: isActive ? "var(--text-secondary)" : "var(--text-muted)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
          minWidth: 0,
        }}
      >
        {task.title}
      </span>

      {/* Tag badge */}
      {task.tag && (
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: tagColor,
            background: `color-mix(in srgb, ${tagColor} 10%, transparent)`,
            border: `1px solid color-mix(in srgb, ${tagColor} 25%, transparent)`,
            borderRadius: 4,
            padding: "1px 5px",
            flexShrink: 0,
          }}
        >
          {task.tag}
        </span>
      )}
    </a>
  );
}
