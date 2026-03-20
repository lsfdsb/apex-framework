import React from "react";

interface KanbanColumnProps {
  title: string;
  count?: number;
  color?: string;
  children: React.ReactNode;
  className?: string;
}

/** Kanban/pipeline column for CRM pipeline boards and task boards. */
export function KanbanColumn({ title, count, color, children, className = "" }: KanbanColumnProps) {
  return (
    <div
      className={`flex flex-col w-[280px] flex-shrink-0 rounded-[var(--radius)] ${className}`}
      style={{ background: "var(--bg-surface)" }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2.5 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        {color && (
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: color }}
            aria-hidden="true"
          />
        )}

        <p
          className="text-[12px] font-semibold uppercase tracking-wider flex-1 truncate"
          style={{ color: "var(--text-secondary)" }}
        >
          {title}
        </p>

        {count !== undefined && (
          <span
            className="text-[11px] font-medium px-1.5 py-0.5 rounded-full"
            style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
          >
            {count}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-2 overflow-y-auto flex-1" style={{ maxHeight: "calc(100vh - 200px)" }}>
        {children}
      </div>
    </div>
  );
}
