import { useState, useEffect } from "react";
import { PhaseFilter } from "../components/tasks/PhaseFilter";
import type { PhaseFilterValue } from "../components/tasks/PhaseFilter";
import { WipIndicator } from "../components/tasks/WipIndicator";
import { TaskCard } from "../components/tasks/TaskCard";
import { MOCK_TASK_BOARD } from "../data/hub-mock";
import type { TaskColumn, TaskItem } from "../data/hub-types";

// ── Column config ─────────────────────────────────────────────────────────────

const COLUMNS: { id: TaskColumn; label: string; accent?: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "In Progress", accent: "var(--accent)" },
  { id: "review", label: "Review", accent: "var(--warning)" },
  { id: "done", label: "Done", accent: "var(--success)" },
];

// ── Column header ─────────────────────────────────────────────────────────────

function ColumnHeader({
  label,
  count,
  column,
  accent,
}: {
  label: string;
  count: number;
  column: TaskColumn;
  accent?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 16px 10px",
        borderBottom: `1px solid ${accent ? `${accent}30` : "var(--border)"}`,
      }}
    >
      {accent && (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: accent,
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
      )}
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: accent ?? "var(--text-muted)",
          flex: 1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          padding: "2px 7px",
          borderRadius: "var(--radius-full)",
          background: "var(--bg-surface)",
          color: "var(--text-muted)",
          border: "1px solid var(--border)",
          minWidth: 24,
          textAlign: "center",
        }}
      >
        {count}
      </span>
      <WipIndicator column={column} current={count} />
    </div>
  );
}

// ── Kanban column ─────────────────────────────────────────────────────────────

function KanbanColumn({
  column,
  tasks,
}: {
  column: (typeof COLUMNS)[number];
  tasks: TaskItem[];
}) {
  return (
    <div
      style={{
        minWidth: 280,
        flex: "0 0 280px",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-elevated)",
        border: `1px solid ${column.accent ? `${column.accent}30` : "var(--border)"}`,
        borderRadius: "var(--radius)",
        overflow: "hidden",
      }}
    >
      <ColumnHeader
        label={column.label}
        count={tasks.length}
        column={column.id}
        accent={column.accent}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: 12,
          minHeight: 160,
        }}
      >
        {tasks.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              fontSize: 12,
              fontStyle: "italic",
              padding: "24px 0",
            }}
          >
            No tasks
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}

// ── Mobile column tabs ────────────────────────────────────────────────────────

function MobileColumnTabs({
  activeColumn,
  onChange,
  countsByColumn,
}: {
  activeColumn: TaskColumn;
  onChange: (col: TaskColumn) => void;
  countsByColumn: Record<TaskColumn, number>;
}) {
  return (
    <div
      role="tablist"
      aria-label="Kanban columns"
      style={{
        display: "flex",
        overflowX: "auto",
        gap: 4,
        padding: "4px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        scrollbarWidth: "none",
      }}
    >
      {COLUMNS.map((col) => {
        const isActive = activeColumn === col.id;
        return (
          <button
            key={col.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(col.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 12px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
              transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
              background: isActive ? "var(--bg-elevated)" : "transparent",
              color: isActive ? (col.accent ?? "var(--text)") : "var(--text-muted)",
              boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.15)" : "none",
              flexShrink: 0,
            }}
          >
            {col.label}
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "1px 5px",
                borderRadius: "var(--radius-full)",
                background: isActive ? (col.accent ?? "var(--accent)") : "var(--bg-surface)",
                color: isActive ? "var(--bg)" : "var(--text-muted)",
                minWidth: 16,
                textAlign: "center",
              }}
            >
              {countsByColumn[col.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Teaching section ──────────────────────────────────────────────────────────

function TeachingSection() {
  const items = [
    {
      term: "DRI (Directly Responsible Individual)",
      body: "Every task has exactly one owner. The DRI is accountable for delivery — not a committee. If something ships late, it's clear who owns it. Apple popularised this model; APEX applies it to every task.",
    },
    {
      term: "Phases (P0 / P1 / P2)",
      body: "P0 = must ship (blocks the release). P1 = should ship (high value, fits the sprint). P2 = polish (nice to have, deferred if time is tight). Every task is assigned a phase at creation so the team always knows what to cut under pressure.",
    },
    {
      term: "WIP Limits",
      body: "Work In Progress limits prevent context-switching overhead. In‑progress is capped at 2 — if you want to pick up task 3, finish one first. Review is capped at 1, keeping feedback cycles tight. When the indicator turns red, the column is over limit.",
    },
    {
      term: "Acceptance Criteria",
      body: "Each task carries a checklist of concrete, testable criteria. Done means all criteria are met — not 'mostly done' or 'just needs polish'. The progress bar on each card shows how many criteria are satisfied.",
    },
  ];

  return (
    <section
      aria-labelledby="apple-epm-heading"
      style={{
        marginTop: 48,
        padding: "32px 32px 36px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "var(--accent)",
          borderRadius: "var(--radius) var(--radius) 0 0",
        }}
        aria-hidden="true"
      />

      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: 8,
        }}
      >
        Methodology
      </div>
      <h2
        id="apple-epm-heading"
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "var(--text)",
          letterSpacing: "-0.02em",
          marginBottom: 6,
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}
      >
        Apple EPM — Engineering Project Management
      </h2>
      <p
        style={{
          fontSize: 14,
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          marginBottom: 28,
          maxWidth: 640,
        }}
      >
        The methodology behind this board. Four principles that keep the build
        moving without letting quality slip.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 20,
        }}
      >
        {items.map(({ term, body }) => (
          <div
            key={term}
            style={{
              padding: "18px 20px",
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: 8,
                lineHeight: 1.3,
              }}
            >
              {term}
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── TaskBoardPage ─────────────────────────────────────────────────────────────

export default function TaskBoardPage() {
  const { projectName, tasks, meta } = MOCK_TASK_BOARD;

  const [phase, setPhase] = useState<PhaseFilterValue>("all");
  const [activeColumn, setActiveColumn] = useState<TaskColumn>("backlog");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Filter tasks by selected phase
  const filteredTasks = phase === "all" ? tasks : tasks.filter((t) => t.phase === phase);

  // Group filtered tasks by column
  const byColumn = (colId: TaskColumn) => filteredTasks.filter((t) => t.column === colId);

  // Counts for the PhaseFilter badges (across ALL tasks, not filtered)
  const phaseCounts = {
    all: tasks.length,
    P0: meta.p0Count,
    P1: meta.p1Count,
    P2: meta.p2Count,
  };

  // Counts per column for mobile tabs (use filtered tasks)
  const countsByColumn = COLUMNS.reduce(
    (acc, col) => ({ ...acc, [col.id]: byColumn(col.id).length }),
    {} as Record<TaskColumn, number>
  );

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "40px 24px 80px",
      }}
    >
      {/* ── Page header ── */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: 6,
          }}
        >
          Apple EPM Kanban
        </div>
        <h1
          style={{
            fontSize: "clamp(26px, 4vw, 36px)",
            fontWeight: 400,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: 8,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
          }}
        >
          Task Board
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
          {projectName} &mdash; {tasks.length} tasks &middot; {meta.completedCount} done &middot;{" "}
          {meta.velocity} tasks/day velocity
        </p>
      </div>

      {/* ── Controls ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <PhaseFilter value={phase} onChange={setPhase} counts={phaseCounts} />
        <span
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginLeft: "auto",
          }}
        >
          {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
          {phase !== "all" ? ` in ${phase}` : ""}
        </span>
      </div>

      {/* ── Mobile column tabs ── */}
      {isMobile && (
        <div style={{ marginBottom: 16 }}>
          <MobileColumnTabs
            activeColumn={activeColumn}
            onChange={setActiveColumn}
            countsByColumn={countsByColumn}
          />
        </div>
      )}

      {/* ── Board ── */}
      {isMobile ? (
        /* Mobile: single column view */
        <div>
          {COLUMNS.filter((col) => col.id === activeColumn).map((col) => (
            <KanbanColumn key={col.id} column={col} tasks={byColumn(col.id)} />
          ))}
        </div>
      ) : (
        /* Desktop: horizontal scroll with all 5 columns */
        <div
          role="region"
          aria-label="Kanban board"
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            paddingBottom: 12,
            scrollbarWidth: "thin",
            scrollbarColor: "var(--border) transparent",
          }}
        >
          {COLUMNS.map((col) => (
            <KanbanColumn key={col.id} column={col} tasks={byColumn(col.id)} />
          ))}
        </div>
      )}

      {/* ── Teaching section ── */}
      <TeachingSection />
    </div>
  );
}
