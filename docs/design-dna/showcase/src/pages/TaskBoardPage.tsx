import { useState, useEffect, useRef } from "react";
import { Link, useHashParams } from "../router/Router";
import { PhaseFilter } from "../components/tasks/PhaseFilter";
import type { PhaseFilterValue } from "../components/tasks/PhaseFilter";
import { WipIndicator } from "../components/tasks/WipIndicator";
import { TaskCard } from "../components/tasks/TaskCard";
import { MOCK_TASK_BOARD } from "../data/hub-mock";
import { useApexState } from "../hooks/useApexState";
import { LiveBadge } from "../components/hub/LiveBadge";
import type { TaskColumn, TaskItem, TaskBoardState, TaskPhase, Iteration } from "../data/hub-types";

const SUB_PROJECT_NAMES: Record<string, string> = {
  "visual-hub": "Visual Pipeline HUB",
  "v522-apple": "v5.22 — The Apple Release",
  "v521-quality": "v5.21 — Quality Gates",
  "v520-production": "v5.20 — Production Readiness",
  "dna-showcase": "Design DNA Showcase",
  "perf-bundle": "Bundle Optimization",
  "supabase-rag": "Supabase RAG Pipeline",
};

// ── Column config ─────────────────────────────────────────────────────────────

const COLUMNS: { id: TaskColumn; label: string; accent?: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "In Progress", accent: "var(--accent)" },
  { id: "review", label: "Review", accent: "var(--warning)" },
  { id: "done", label: "Done", accent: "var(--success)" },
];

// ── Iteration filter type ─────────────────────────────────────────────────────

type IterationFilter = "all" | number;

// ── Date helpers ───────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ExternalLinkIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

// ── IterationTabs ─────────────────────────────────────────────────────────────

function IterationTabs({
  iterations,
  active,
  onChange,
}: {
  iterations: Iteration[];
  active: IterationFilter;
  onChange: (v: IterationFilter) => void;
}) {
  return (
    <div role="tablist" aria-label="Iteration filter" style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
      <button
        role="tab"
        aria-selected={active === "all"}
        onClick={() => onChange("all")}
        style={{
          padding: "5px 14px",
          borderRadius: "var(--radius-full)",
          border: `1px solid ${active === "all" ? "var(--accent)" : "var(--border)"}`,
          background: active === "all" ? "var(--accent-glow)" : "transparent",
          color: active === "all" ? "var(--accent)" : "var(--text-muted)",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
        }}
      >
        All ships
      </button>
      {iterations.map((iter) => {
        const isCurrent = !iter.shippedAt;
        const isActive = active === iter.id;
        return (
          <button
            key={iter.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(iter.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 14px",
              borderRadius: "var(--radius-full)",
              border: `1px solid ${isActive ? (isCurrent ? "var(--accent)" : "var(--success)") : "var(--border)"}`,
              background: isActive
                ? isCurrent
                  ? "var(--accent-glow)"
                  : "color-mix(in srgb, var(--success) 10%, transparent)"
                : "transparent",
              color: isActive ? (isCurrent ? "var(--accent)" : "var(--success)") : "var(--text-muted)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}
          >
            {iter.shippedAt ? (
              <CheckIcon size={11} />
            ) : (
              <span
                className="iter-pulse"
                style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }}
                aria-hidden="true"
              />
            )}
            Ship {iter.id}
            {isCurrent && (
              <span style={{ fontSize: 10, fontWeight: 500, color: "var(--accent)", opacity: 0.8 }}>current</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── IterationTimeline ─────────────────────────────────────────────────────────

function IterationTimeline({
  iterations,
  active,
  onSelect,
}: {
  iterations: Iteration[];
  active: IterationFilter;
  onSelect: (v: IterationFilter) => void;
}) {
  return (
    <div
      style={{ display: "flex", alignItems: "flex-start", gap: 0, padding: "12px 0 8px", overflowX: "auto", scrollbarWidth: "none" }}
      aria-label="Iteration timeline"
    >
      {iterations.map((iter, i) => {
        const isCurrent = !iter.shippedAt;
        const isLast = i === iterations.length - 1;
        const isActive = active === iter.id;
        return (
          <div key={iter.id} style={{ display: "flex", alignItems: "flex-start", flexShrink: 0 }}>
            <button
              onClick={() => onSelect(iter.id)}
              aria-label={`${iter.label}${isCurrent ? " (current)" : ""}${iter.shippedAt ? `, shipped ${fmtDate(iter.shippedAt)}` : ""}`}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: "pointer", padding: "0 12px" }}
            >
              <div
                className={isCurrent ? "timeline-node-pulse" : ""}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: iter.shippedAt ? "var(--success)" : isCurrent ? "var(--accent)" : "var(--bg-surface)",
                  border: `2px solid ${iter.shippedAt ? "var(--success)" : isCurrent ? "var(--accent)" : "var(--border)"}`,
                  boxShadow: isActive
                    ? `0 0 0 3px ${isCurrent ? "var(--accent-glow)" : "color-mix(in srgb, var(--success) 20%, transparent)"}`
                    : "none",
                  transition: "box-shadow 0.2s ease",
                }}
                aria-hidden="true"
              />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 80 }}>
                <span style={{ fontSize: 11, fontFamily: "var(--font-display)", fontStyle: "italic", color: isCurrent ? "var(--accent)" : iter.shippedAt ? "var(--success)" : "var(--text-muted)", whiteSpace: "nowrap", fontWeight: 500 }}>
                  Ship {iter.id}
                </span>
                <span style={{ fontSize: 10, fontFamily: "var(--font-mono, monospace)", color: "var(--text-muted)", opacity: 0.7, whiteSpace: "nowrap" }}>
                  {iter.shippedAt ? fmtDate(iter.shippedAt) : fmtDate(iter.startedAt)}
                </span>
                {iter.prUrl && (
                  <a
                    href={iter.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: 9, color: "var(--accent)", textDecoration: "none", opacity: 0.8, display: "flex", alignItems: "center", gap: 2 }}
                    aria-label={`PR for Ship ${iter.id}`}
                  >
                    <ExternalLinkIcon size={8} />
                    PR
                  </a>
                )}
              </div>
            </button>
            {!isLast && (
              <div
                style={{ width: 40, height: 2, marginTop: 4, background: iterations[i + 1]?.shippedAt ? "var(--success)" : "var(--border)", opacity: 0.5, flexShrink: 0, alignSelf: "flex-start" }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── CurrentShipBanner ─────────────────────────────────────────────────────────

function CurrentShipBanner({ iteration, tasks }: { iteration: Iteration; tasks: TaskItem[] }) {
  const remaining = tasks.filter((t) => t.column !== "done").length;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 14px",
        background: "var(--accent-glow)",
        border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
        borderRadius: "var(--radius)",
        marginBottom: 16,
        flexShrink: 0,
        flexWrap: "wrap",
      }}
    >
      <span className="iter-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} aria-hidden="true" />
      <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>
        {iteration.label}
      </span>
      <span style={{ color: "var(--border)", fontSize: 12 }}>·</span>
      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Started {fmtDateTime(iteration.startedAt)}</span>
      <span style={{ color: "var(--border)", fontSize: 12 }}>·</span>
      <span style={{ fontSize: 12, fontFamily: "var(--font-mono, monospace)", color: remaining > 0 ? "var(--warning)" : "var(--success)", fontWeight: 600 }}>
        {remaining > 0 ? `${remaining} task${remaining !== 1 ? "s" : ""} remaining` : "All tasks done"}
      </span>
    </div>
  );
}

// ── CollapsibleShipSection ─────────────────────────────────────────────────────

function CollapsibleShipSection({
  iteration,
  tasks,
  phase,
  targetTaskId,
  targetTaskRef,
}: {
  iteration: Iteration;
  tasks: TaskItem[];
  phase: PhaseFilterValue;
  targetTaskId: string | null;
  targetTaskRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [expanded, setExpanded] = useState(false);
  const filteredTasks = phase === "all" ? tasks : tasks.filter((t) => t.phase === phase);
  const doneCount = filteredTasks.filter((t) => t.column === "done").length;

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", marginBottom: 12, flexShrink: 0 }}>
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "var(--bg-elevated)", border: "none", cursor: "pointer", textAlign: "left", color: "var(--text)" }}
      >
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          style={{ transition: "transform 0.22s cubic-bezier(0.22,1,0.36,1)", transform: expanded ? "rotate(90deg)" : "rotate(0deg)", color: "var(--text-muted)", flexShrink: 0 }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span style={{ color: "var(--success)", flexShrink: 0 }}>
          <CheckIcon size={13} />
        </span>
        <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14, color: "var(--text-secondary)", fontWeight: 500 }}>
          {iteration.label}
        </span>
        <span style={{ color: "var(--border)", margin: "0 2px", fontSize: 12 }}>·</span>
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
          {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: "var(--success)", fontFamily: "var(--font-mono, monospace)", whiteSpace: "nowrap" }}>
          Shipped {iteration.shippedAt ? fmtDate(iteration.shippedAt) : ""}
        </span>
        {iteration.prUrl && (
          <a
            href={iteration.prUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ fontSize: 11, color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 3, marginLeft: 8 }}
            aria-label={`View PR for ${iteration.label}`}
          >
            <ExternalLinkIcon size={10} />
            PR
          </a>
        )}
        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: "var(--radius-full)", background: "color-mix(in srgb, var(--success) 12%, transparent)", color: "var(--success)", border: "1px solid color-mix(in srgb, var(--success) 25%, transparent)", marginLeft: 8, whiteSpace: "nowrap" }}>
          {doneCount}/{filteredTasks.length}
        </span>
      </button>

      {expanded && (
        <div style={{ padding: "12px 16px 16px", background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}>
            {COLUMNS.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.column === col.id);
              return (
                <div
                  key={col.id}
                  style={{ minWidth: 220, flex: "0 0 220px", display: "flex", flexDirection: "column", background: "var(--bg-elevated)", border: `1px solid ${col.accent ? `${col.accent}30` : "var(--border)"}`, borderRadius: "var(--radius)", overflow: "hidden" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderBottom: "1px solid var(--border)" }}>
                    {col.accent && <span style={{ width: 6, height: 6, borderRadius: "50%", background: col.accent, flexShrink: 0 }} aria-hidden="true" />}
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" as const, color: col.accent ?? "var(--text-muted)", flex: 1 }}>{col.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: "var(--radius-full)", background: "var(--bg-surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>{colTasks.length}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 10, minHeight: 80 }}>
                    {colTasks.length === 0 ? (
                      <div style={{ color: "var(--text-muted)", fontSize: 11, fontStyle: "italic", padding: "12px 0", textAlign: "center" as const }}>No tasks</div>
                    ) : (
                      colTasks.map((task) => {
                        const isTarget = task.id === targetTaskId;
                        return (
                          <div
                            key={task.id}
                            ref={isTarget ? (targetTaskRef as React.RefObject<HTMLDivElement>) : undefined}
                            style={{ outline: isTarget ? "2px solid var(--accent)" : "none", outlineOffset: 2, borderRadius: "var(--radius)" }}
                          >
                            <TaskCard task={task} autoExpand={isTarget} />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

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
  filterKey,
  targetTaskId,
  targetTaskRef,
}: {
  column: (typeof COLUMNS)[number];
  tasks: TaskItem[];
  filterKey: string;
  targetTaskId: string | null;
  targetTaskRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      role="region"
      aria-label={`${column.label} column — ${tasks.length} task${tasks.length !== 1 ? "s" : ""}`}
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
        className="kanban-col"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: 12,
          minHeight: 160,
          overflowY: "auto",
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
          tasks.map((task, i) => {
            const isTarget = task.id === targetTaskId;
            return (
              <div
                key={`${filterKey}-${task.id}`}
                ref={isTarget ? (targetTaskRef as React.RefObject<HTMLDivElement>) : undefined}
                className="task-card-enter"
                tabIndex={isTarget ? -1 : undefined}
                style={{
                  animationDelay: `${i * 30}ms`,
                  outline: isTarget ? "2px solid var(--accent)" : "none",
                  outlineOffset: 2,
                  borderRadius: "var(--radius)",
                }}
              >
                <TaskCard task={task} autoExpand={isTarget} />
              </div>
            );
          })
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

// ── TaskBoardPage ─────────────────────────────────────────────────────────────

export default function TaskBoardPage() {
  const { data: liveBoard, isLive, lastUpdated } = useApexState<TaskBoardState>(
    "tasks.json",
    MOCK_TASK_BOARD
  );
  const hashParams = useHashParams();

  // Use live data when available AND has tasks; otherwise fall back to mock
  const useLive = isLive && liveBoard.tasks.length > 0;
  const board = useLive ? liveBoard : MOCK_TASK_BOARD;
  const { projectName, tasks, meta } = board;
  const iterations: Iteration[] = board.iterations ?? [];
  const subProjectName = hashParams.project ? SUB_PROJECT_NAMES[hashParams.project] ?? null : null;

  // Pre-select phase from ?phase= URL param (P0 / P1 / P2)
  const urlPhase = hashParams.phase as TaskPhase | undefined;
  const validPhases: PhaseFilterValue[] = ["all", "P0", "P1", "P2"];
  const initialPhase: PhaseFilterValue =
    urlPhase && validPhases.includes(urlPhase) ? urlPhase : "all";

  const [phase, setPhase] = useState<PhaseFilterValue>(initialPhase);
  const [iterationFilter, setIterationFilter] = useState<IterationFilter>("all");
  const [activeColumn, setActiveColumn] = useState<TaskColumn>("backlog");
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
  );

  // Deep-link: auto-scroll to ?task= and expand it
  const targetTaskId = hashParams.task ?? null;
  const targetTaskRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!targetTaskId || !targetTaskRef.current) return;
    const el = targetTaskRef.current;
    const timer = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Move focus to the expanded card so screen readers announce it
      el.focus({ preventScroll: true });
    }, 150);
    return () => clearTimeout(timer);
  }, [targetTaskId]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Filter tasks by selected phase
  const phaseFiltered = phase === "all" ? tasks : tasks.filter((t) => t.phase === phase);

  // Shipped and current iterations
  const shippedIterations = iterations.filter((it) => it.shippedAt);
  const currentIteration = iterations.find((it) => !it.shippedAt);

  // Determine which iteration object is actively viewed
  const activeIteration =
    iterationFilter !== "all" ? iterations.find((it) => it.id === iterationFilter) : null;

  // Board tasks: when viewing a specific iteration, filter to it.
  // When viewing "all", show only current iteration tasks (+ tasks without iteration field).
  // Shipped iterations are shown in collapsible sections below.
  const boardTasks: TaskItem[] =
    iterationFilter !== "all"
      ? phaseFiltered.filter((t) => t.iteration === iterationFilter)
      : currentIteration
      ? phaseFiltered.filter((t) => t.iteration === currentIteration.id)
      : phaseFiltered.filter((t) => !t.iteration);

  // Group board tasks by column
  const byColumn = (colId: TaskColumn) => boardTasks.filter((t) => t.column === colId);

  // Counts for the PhaseFilter badges (across ALL tasks, not filtered)
  const phaseCounts = {
    all: tasks.length,
    P0: meta.p0Count,
    P1: meta.p1Count,
    P2: meta.p2Count,
  };

  const filterKey = `${phase}-${iterationFilter}`;

  // Counts per column for mobile tabs (use board tasks)
  const countsByColumn = COLUMNS.reduce(
    (acc, col) => ({ ...acc, [col.id]: byColumn(col.id).length }),
    {} as Record<TaskColumn, number>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 56px)",
        maxWidth: 1400,
        margin: "0 auto",
        padding: "40px 24px 24px",
        boxSizing: "border-box",
      }}
    >
      {/* ── Page header ── */}
      <div style={{ marginBottom: 20, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              flex: 1,
            }}
          >
            Apple EPM Kanban
          </div>
          <LiveBadge isLive={isLive} lastUpdated={lastUpdated} />
        </div>
        {subProjectName && (
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
            <Link to="/projects" style={{ color: "var(--accent)", textDecoration: "none" }}>APEX Framework</Link>
            <span style={{ margin: "0 6px", opacity: 0.5 }}>/</span>
            <span style={{ color: "var(--text-secondary)" }}>{subProjectName}</span>
          </div>
        )}
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

      {/* ── Iteration tabs + timeline ── */}
      {iterations.length > 0 && (
        <div
          style={{
            marginBottom: 16,
            flexShrink: 0,
            padding: "14px 16px 4px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
        >
          <IterationTabs iterations={iterations} active={iterationFilter} onChange={setIterationFilter} />
          <IterationTimeline iterations={iterations} active={iterationFilter} onSelect={setIterationFilter} />
        </div>
      )}

      {/* ── Current ship banner (non-shipped iteration selected) ── */}
      {activeIteration && !activeIteration.shippedAt && (
        <CurrentShipBanner iteration={activeIteration} tasks={boardTasks} />
      )}

      {/* ── Shipped iterations (collapsible, only in "all" view) ── */}
      {iterationFilter === "all" && shippedIterations.length > 0 && (
        <div style={{ flexShrink: 0 }}>
          {shippedIterations.map((iter) => {
            const iterTasks = phaseFiltered.filter((t) => t.iteration === iter.id);
            if (iterTasks.length === 0) return null;
            return (
              <CollapsibleShipSection
                key={iter.id}
                iteration={iter}
                tasks={iterTasks}
                phase={phase}
                targetTaskId={targetTaskId}
                targetTaskRef={targetTaskRef}
              />
            );
          })}
        </div>
      )}

      {/* ── Current ship label in "all" view ── */}
      {iterationFilter === "all" && currentIteration && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexShrink: 0 }}>
          <span
            className="iter-pulse"
            style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }}
            aria-hidden="true"
          />
          <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>
            {currentIteration.label}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", opacity: 0.6 }}>— current</span>
        </div>
      )}

      {/* ── Controls ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
          flexShrink: 0,
        }}
      >
        <PhaseFilter value={phase} onChange={setPhase} counts={phaseCounts} />
        <span
          aria-live="polite"
          aria-atomic="true"
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginLeft: "auto",
          }}
        >
          {boardTasks.length} task{boardTasks.length !== 1 ? "s" : ""}
          {phase !== "all" ? ` in ${phase}` : ""}
          {activeIteration ? ` · ${activeIteration.label}` : ""}
        </span>
      </div>

      {/* ── Mobile column tabs ── */}
      {isMobile && (
        <div style={{ marginBottom: 16, flexShrink: 0 }}>
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
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {COLUMNS.filter((col) => col.id === activeColumn).map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={byColumn(col.id)}
              filterKey={filterKey}
              targetTaskId={targetTaskId}
              targetTaskRef={targetTaskRef}
            />
          ))}
        </div>
      ) : (
        /* Desktop: horizontal scroll with all 5 columns */
        <div
          role="region"
          aria-label="Kanban board"
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            gap: 16,
            overflowX: "auto",
            paddingBottom: 12,
            scrollbarWidth: "thin",
            scrollbarColor: "var(--border) transparent",
          }}
        >
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={byColumn(col.id)}
              filterKey={filterKey}
              targetTaskId={targetTaskId}
              targetTaskRef={targetTaskRef}
            />
          ))}
        </div>
      )}

      {/* ── CSS animations ── */}
      <style>{`
        .kanban-col {
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }
        .kanban-col::-webkit-scrollbar {
          width: 4px;
        }
        .kanban-col::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 2px;
        }
        @keyframes taskCardSlideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes taskCardFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .task-card-enter {
          animation: taskCardSlideUp 200ms cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes iterPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.85); }
        }
        .iter-pulse {
          animation: iterPulse 2s ease-in-out infinite;
        }
        @keyframes timelineNodePulse {
          0%, 100% { box-shadow: 0 0 0 0 var(--accent-glow); }
          50%       { box-shadow: 0 0 0 4px var(--accent-glow); }
        }
        .timeline-node-pulse {
          animation: timelineNodePulse 2.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .task-card-enter {
            animation: taskCardFadeIn 150ms ease both;
          }
          .iter-pulse,
          .timeline-node-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
