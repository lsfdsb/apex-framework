import { useState, useMemo } from "react";
import { useHashParams } from "../router/Router";
import { PhaseFilter } from "../components/tasks/PhaseFilter";
import type { PhaseFilterValue } from "../components/tasks/PhaseFilter";
import { WipIndicator } from "../components/tasks/WipIndicator";
import { TaskCard } from "../components/tasks/TaskCard";
import { LiveBadge } from "../components/hub/LiveBadge";
import { useOps } from "../context/OpsContext";
import type { TaskColumn, TaskItem } from "../data/hub-types";

// ── Column config ─────────────────────────────────────────────────────────────

type ColConfig = { id: TaskColumn; label: string; accentColor?: string };

const COLUMNS: ColConfig[] = [
  { id: "backlog", label: "Backlog" },
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "In Progress", accentColor: "var(--accent)" },
  { id: "review", label: "Review", accentColor: "var(--warning)" },
  { id: "done", label: "Done", accentColor: "var(--success)" },
];

// ── KanbanColumn ──────────────────────────────────────────────────────────────

interface KanbanColumnProps {
  id: TaskColumn;
  label: string;
  accentColor?: string;
  tasks: TaskItem[];
  expandTaskId: string | null;
}

function KanbanColumn({ id, label, accentColor, tasks, expandTaskId }: KanbanColumnProps) {
  const count = tasks.length;

  return (
    <section
      aria-label={`${label} column — ${count} task${count !== 1 ? "s" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        minWidth: 280,
        flex: "0 0 280px",
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-lg, 12px)",
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {/* Column header */}
      <div
        style={{
          padding: "12px 14px 10px",
          borderBottom: accentColor
            ? `2px solid ${accentColor}`
            : "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: accentColor ?? "var(--text-secondary)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            flex: 1,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "1px 7px",
            borderRadius: "var(--radius-full)",
            background: "var(--bg-elevated)",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
          }}
          aria-label={`${count} tasks`}
        >
          {count}
        </span>
        <WipIndicator column={id} current={count} />
      </div>

      {/* Task cards */}
      <div
        aria-live="polite"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: 10,
          flex: 1,
          minHeight: 48,
        }}
      >
        {tasks.length === 0 ? (
          <div
            style={{
              padding: "24px 12px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 12,
              fontStyle: "italic",
            }}
          >
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              autoExpand={task.id === expandTaskId}
            />
          ))
        )}
      </div>
    </section>
  );
}

// ── MobileColumnTabs ──────────────────────────────────────────────────────────

interface MobileColumnTabsProps {
  active: TaskColumn;
  onChange: (col: TaskColumn) => void;
  counts: Record<TaskColumn, number>;
}

function MobileColumnTabs({ active, onChange, counts }: MobileColumnTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Kanban columns"
      style={{
        display: "flex",
        overflowX: "auto",
        scrollbarWidth: "none",
        gap: 4,
        padding: "4px 0",
      }}
    >
      {COLUMNS.map((col) => {
        const isActive = col.id === active;
        return (
          <button
            key={col.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(col.id)}
            style={{
              flexShrink: 0,
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              border: `1px solid ${isActive ? (col.accentColor ?? "var(--accent)") : "var(--border)"}`,
              background: isActive ? "var(--bg-elevated)" : "transparent",
              color: isActive ? (col.accentColor ?? "var(--accent)") : "var(--text-muted)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
              whiteSpace: "nowrap",
            }}
          >
            {col.label}
            <span
              style={{
                marginLeft: 5,
                fontSize: 10,
                color: "var(--text-muted)",
              }}
            >
              {counts[col.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── TaskBoardPage ─────────────────────────────────────────────────────────────

export default function TaskBoardPage() {
  const { tasks, isLive, lastUpdated } = useOps();
  const params = useHashParams();

  const initialPhase = (params.phase as PhaseFilterValue) ?? "all";
  const [phase, setPhase] = useState<PhaseFilterValue>(initialPhase);
  const [mobileCol, setMobileCol] = useState<TaskColumn>("in-progress");

  const expandTaskId = params.task ?? null;

  // Filter by phase, then bucket by column
  const filtered = useMemo(() => {
    return tasks.tasks.filter((t) => phase === "all" || t.phase === phase);
  }, [tasks.tasks, phase]);

  const byColumn = useMemo(() => {
    const map: Record<TaskColumn, TaskItem[]> = {
      backlog: [],
      todo: [],
      "in-progress": [],
      review: [],
      done: [],
    };
    for (const task of filtered) {
      map[task.column].push(task);
    }
    return map;
  }, [filtered]);

  const phaseCounts = useMemo(() => ({
    all: tasks.tasks.length,
    P0: tasks.tasks.filter((t) => t.phase === "P0").length,
    P1: tasks.tasks.filter((t) => t.phase === "P1").length,
    P2: tasks.tasks.filter((t) => t.phase === "P2").length,
  }), [tasks.tasks]);

  const colCounts = useMemo(() => {
    const counts: Record<TaskColumn, number> = {
      backlog: 0, todo: 0, "in-progress": 0, review: 0, done: 0,
    };
    for (const task of filtered) counts[task.column]++;
    return counts;
  }, [filtered]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        padding: "24px 20px",
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text)",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Tasks
        </h1>
        <LiveBadge isLive={isLive} lastUpdated={lastUpdated} />
        <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
          {filtered.length} task{filtered.length !== 1 ? "s" : ""}
          {phase !== "all" && ` — ${phase}`}
        </span>
      </header>

      {/* Phase filter */}
      <PhaseFilter value={phase} onChange={setPhase} counts={phaseCounts} />

      {/* Mobile column tabs — visible below 768px */}
      <div className="mobile-tabs">
        <MobileColumnTabs active={mobileCol} onChange={setMobileCol} counts={colCounts} />
      </div>

      {/* Desktop board — horizontal scroll with 5 columns */}
      <div
        className="desktop-board"
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 12,
          scrollbarWidth: "thin",
          alignItems: "flex-start",
        }}
      >
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            label={col.label}
            accentColor={col.accentColor}
            tasks={byColumn[col.id]}
            expandTaskId={expandTaskId}
          />
        ))}
      </div>

      {/* Mobile single column view */}
      <div className="mobile-board">
        {COLUMNS.filter((col) => col.id === mobileCol).map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            label={col.label}
            accentColor={col.accentColor}
            tasks={byColumn[col.id]}
            expandTaskId={expandTaskId}
          />
        ))}
      </div>

      <style>{`
        .mobile-tabs { display: none; }
        .mobile-board { display: none; }
        @media (max-width: 768px) {
          .mobile-tabs { display: block; }
          .mobile-board { display: block; }
          .desktop-board { display: none !important; }
        }
      `}</style>
    </div>
  );
}
