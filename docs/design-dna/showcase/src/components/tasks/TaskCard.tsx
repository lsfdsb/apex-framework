import { useState } from "react";
import type { TaskItem, TaskPhase, TaskDRI, TaskColumn, TaskTag, ReviewGate } from "../../data/hub-types";
import { TaskDetail } from "./TaskDetail";

// ── Tag badge colors ────────────────────────────────────────────────────────

const TAG_STYLE: Record<TaskTag, { label: string; color: string; bg: string }> = {
  feat:     { label: "feat",     color: "var(--accent)",                bg: "color-mix(in srgb, var(--accent) 12%, transparent)" },
  fix:      { label: "fix",      color: "var(--destructive)",           bg: "color-mix(in srgb, var(--destructive) 12%, transparent)" },
  refactor: { label: "refactor", color: "var(--warning)",               bg: "color-mix(in srgb, var(--warning) 12%, transparent)" },
  docs:     { label: "docs",     color: "var(--info, #60a5fa)",         bg: "color-mix(in srgb, var(--info, #60a5fa) 12%, transparent)" },
  chore:    { label: "chore",    color: "var(--text-muted)",            bg: "color-mix(in srgb, var(--text-muted) 12%, transparent)" },
  perf:     { label: "perf",     color: "var(--success)",               bg: "color-mix(in srgb, var(--success) 12%, transparent)" },
  a11y:     { label: "a11y",     color: "var(--success)",               bg: "color-mix(in srgb, var(--success) 12%, transparent)" },
  security: { label: "security", color: "var(--destructive)",           bg: "color-mix(in srgb, var(--destructive) 12%, transparent)" },
  test:     { label: "test",     color: "var(--warning)",               bg: "color-mix(in srgb, var(--warning) 12%, transparent)" },
};

/** Extract tag from title prefix (e.g., "feat: add X" → "feat") or use explicit tag field. */
function resolveTag(task: TaskItem): TaskTag | null {
  if (task.tag) return task.tag;
  const match = task.title.match(/^(feat|fix|refactor|docs|chore|perf|a11y|security|test):/);
  return match ? (match[1] as TaskTag) : null;
}

/** Strip tag prefix from title for display (e.g., "feat: add X" → "add X"). */
function displayTitle(task: TaskItem): string {
  return task.title.replace(/^(feat|fix|refactor|docs|chore|perf|a11y|security|test):\s*/, "");
}

// ── Phase badge colors ───────────────────────────────────────────────────────

const PHASE_COLOR: Record<TaskPhase, { text: string; bg: string; border: string }> = {
  P0: {
    text: "var(--destructive)",
    bg: "color-mix(in srgb, var(--destructive) 12%, transparent)",
    border: "color-mix(in srgb, var(--destructive) 30%, transparent)",
  },
  P1: {
    text: "var(--warning)",
    bg: "color-mix(in srgb, var(--warning) 12%, transparent)",
    border: "color-mix(in srgb, var(--warning) 30%, transparent)",
  },
  P2: {
    text: "var(--accent)",
    bg: "color-mix(in srgb, var(--accent) 12%, transparent)",
    border: "color-mix(in srgb, var(--accent) 20%, transparent)",
  },
};

const DRI_LABEL: Record<TaskDRI, string> = {
  lead: "Lead",
  builder: "Builder",
  qa: "QA",
  "design-reviewer": "Designer",
  "project-manager": "PM",
  watcher: "Watcher",
  "technical-writer": "Writer",
};

const DRI_COLOR: Record<TaskDRI, string> = {
  lead: "color-mix(in srgb, var(--accent) 80%, #a855f7)",
  builder: "var(--accent)",
  qa: "var(--warning)",
  "design-reviewer": "var(--accent)",
  "project-manager": "var(--success)",
  watcher: "var(--info, #60a5fa)",
  "technical-writer": "var(--info, #60a5fa)",
};

// ── Icons ────────────────────────────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        transition: "transform 0.2s ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function FileCountIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

// ── TaskCard ─────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: TaskItem;
  /** Auto-expand the card on mount (used for ?task= deep-link navigation). */
  autoExpand?: boolean;
}

/** Kanban card for the Apple EPM task board. Click to expand TaskDetail. */
export function TaskCard({ task, autoExpand = false }: TaskCardProps) {
  const [expanded, setExpanded] = useState(autoExpand);

  const phase = PHASE_COLOR[task.phase];
  const tag = resolveTag(task);
  const tagStyle = tag ? TAG_STYLE[tag] : null;
  const title = displayTitle(task);
  const metCount = task.acceptanceCriteria.filter((c) => c.met).length;
  const total = task.acceptanceCriteria.length;
  const progressPct = total > 0 ? (metCount / total) * 100 : 0;
  const isInProgress = task.column === ("in-progress" as TaskColumn);
  const isInReview = task.column === ("review" as TaskColumn);

  const cardStyle: React.CSSProperties = {
    background: "var(--bg-elevated)",
    border: `1px solid ${isInProgress ? "var(--accent)" : "var(--border)"}`,
    borderRadius: "var(--radius)",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
    boxShadow: isInProgress
      ? "0 0 0 1px var(--accent), 0 0 16px var(--accent-glow)"
      : "0 2px 8px rgba(0,0,0,0.12)",
  };

  return (
    <article style={cardStyle} aria-expanded={expanded}>
      {/* Card header — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-label={`${task.id}: ${task.title} — ${expanded ? "collapse" : "expand"} details`}
        style={{
          width: "100%",
          textAlign: "left",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "12px 14px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          color: "var(--text)",
        }}
      >
        {/* Top row: phase badge + task ID + chevron */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 7px",
              borderRadius: "var(--radius-full)",
              background: phase.bg,
              color: phase.text,
              border: `1px solid ${phase.border}`,
              flexShrink: 0,
              letterSpacing: "0.06em",
            }}
            title={
              task.phase === "P0"
                ? "P0 — Must ship"
                : task.phase === "P1"
                ? "P1 — Should ship"
                : "P2 — Polish"
            }
          >
            {task.phase}
          </span>
          {tagStyle && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                padding: "1px 6px",
                borderRadius: "var(--radius-full)",
                background: tagStyle.bg,
                color: tagStyle.color,
                letterSpacing: "0.04em",
                flexShrink: 0,
              }}
            >
              {tagStyle.label}
            </span>
          )}
          <span
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono, monospace)",
              flexShrink: 0,
            }}
          >
            {task.id}
          </span>
          <span style={{ flex: 1 }} />
          <span style={{ color: "var(--text-muted)" }}>
            <ChevronIcon open={expanded} />
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.4,
            color: "var(--text)",
          }}
        >
          {title}
        </div>

        {/* Criteria progress bar */}
        {total > 0 && (
          <div>
            <div
              style={{
                height: 3,
                borderRadius: "var(--radius-full)",
                background: "var(--bg-surface)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progressPct}%`,
                  background:
                    progressPct === 100
                      ? "var(--success)"
                      : isInProgress
                      ? "var(--accent)"
                      : "var(--text-muted)",
                  borderRadius: "var(--radius-full)",
                  transition: "width 0.4s ease",
                }}
                role="progressbar"
                aria-valuenow={metCount}
                aria-valuemin={0}
                aria-valuemax={total}
                aria-label={`${metCount} of ${total} criteria met`}
              />
            </div>
          </div>
        )}

        {/* Review gates — shown only when in review column */}
        {isInReview && task.reviewGates && task.reviewGates.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {task.reviewGates.map((gate: ReviewGate) => (
              <span
                key={gate.name}
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background:
                    gate.status === "passed"
                      ? "color-mix(in srgb, var(--success) 12%, transparent)"
                      : gate.status === "failed"
                      ? "color-mix(in srgb, var(--destructive) 12%, transparent)"
                      : "color-mix(in srgb, var(--text-muted) 10%, transparent)",
                  color:
                    gate.status === "passed"
                      ? "var(--success)"
                      : gate.status === "failed"
                      ? "var(--destructive)"
                      : "var(--text-muted)",
                  border: `1px solid ${
                    gate.status === "passed"
                      ? "color-mix(in srgb, var(--success) 25%, transparent)"
                      : gate.status === "failed"
                      ? "color-mix(in srgb, var(--destructive) 25%, transparent)"
                      : "color-mix(in srgb, var(--text-muted) 15%, transparent)"
                  }`,
                  letterSpacing: "0.04em",
                }}
                title={`${gate.name}: ${gate.status}`}
              >
                {gate.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer row: DRI badge + file count + criteria text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          {/* DRI badge */}
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 7px",
              borderRadius: "var(--radius-full)",
              background: "var(--bg-surface)",
              color: DRI_COLOR[task.dri],
              border: "1px solid var(--border)",
            }}
            title={`DRI: ${DRI_LABEL[task.dri]}`}
          >
            {DRI_LABEL[task.dri]}
          </span>

          {/* Criteria count */}
          {total > 0 && (
            <span
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <span style={{ color: metCount === total ? "var(--success)" : "var(--text-muted)" }}>
                {metCount}/{total}
              </span>
            </span>
          )}

          {/* File count */}
          {task.files.length > 0 && (
            <span
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
              title={`Touches ${task.files.length} file${task.files.length !== 1 ? "s" : ""}`}
            >
              <FileCountIcon />
              {task.files.length}
            </span>
          )}

          {/* Blocked indicator */}
          {task.blockedBy.length > 0 && (
            <span
              style={{
                fontSize: 10,
                color: "var(--destructive)",
                fontWeight: 600,
              }}
              title={`Blocked by: ${task.blockedBy.join(", ")}`}
            >
              Blocked
            </span>
          )}
        </div>
      </button>

      {/* Expanded detail panel */}
      {expanded && <TaskDetail task={task} />}
    </article>
  );
}
