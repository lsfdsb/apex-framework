/**
 * PipelinePage — 7-phase APEX pipeline visualization.
 * Shows each phase as a large card with Apple provenance annotations,
 * agent badges, gate indicators, and live status from OpsContext.
 *
 * Upgrades (T8):
 * - Animated SVG connector lines between phases (green + flowing when complete)
 * - Active phase pulse animation on card border
 * - Click-to-expand tasks section per phase
 * - Apple provenance tooltip styled as italic muted EPM badge
 * Cross-nav (T10):
 * - "View all tasks in this phase" navigates to #/tasks?phase=P{id}
 * - Task cards link to #/tasks?task={id}
 */

import { useState } from "react";
import { useOps } from "../context/OpsContext";
import { PIPELINE_PHASES } from "../data/hub-data";
import { LucideIcon } from "../components/hub/LucideIcon";
import { LiveBadge } from "../components/hub/LiveBadge";
import { Link } from "../router/Router";
import type { PhaseStatus, TaskItem } from "../data/hub-types";

// ── Status helpers ────────────────────────────────────────────────────────────

function statusColor(status: PhaseStatus): string {
  switch (status) {
    case "active":   return "var(--accent)";
    case "complete": return "var(--success)";
    case "failed":   return "var(--destructive, #ef4444)";
    default:         return "var(--text-muted)";
  }
}

function statusLabel(status: PhaseStatus): string {
  switch (status) {
    case "active":   return "Active";
    case "complete": return "Complete";
    case "failed":   return "Failed";
    default:         return "Idle";
  }
}

// ── SVG Connector Line ────────────────────────────────────────────────────────

interface ConnectorProps {
  status: PhaseStatus;
  nextStatus: PhaseStatus;
}

function ConnectorLine({ status, nextStatus: _nextStatus }: ConnectorProps) {
  const isComplete = status === "complete";
  const accent = isComplete ? "var(--success, #22c55e)" : "var(--border)";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "2px 0",
      }}
    >
      <svg
        width="32"
        height="24"
        viewBox="0 0 32 24"
        fill="none"
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        <line
          x1="16"
          y1="0"
          x2="16"
          y2="24"
          stroke={accent}
          strokeWidth="2"
          strokeDasharray={isComplete ? "none" : "4 4"}
          strokeLinecap="round"
          className={isComplete ? "connector-flow" : undefined}
        />
        {/* Arrow head */}
        <polyline
          points="11,18 16,24 21,18"
          stroke={accent}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

// ── Compact Task Card (phase expansion) ───────────────────────────────────────

interface MiniTaskCardProps {
  task: TaskItem;
}

function MiniTaskCard({ task }: MiniTaskCardProps) {
  const columnColor: Record<string, string> = {
    done: "var(--success)",
    "in-progress": "var(--accent)",
    review: "var(--warning, #f59e0b)",
    todo: "var(--text-secondary)",
    backlog: "var(--text-muted)",
  };
  const color = columnColor[task.column] ?? "var(--text-muted)";

  return (
    <Link
      to={`/tasks?task=${task.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          cursor: "pointer",
          transition: "border-color 0.15s, background 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
          (e.currentTarget as HTMLDivElement).style.background =
            "color-mix(in srgb, var(--accent) 4%, var(--bg-surface))";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLDivElement).style.background = "var(--bg-surface)";
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 12,
            color: "var(--text)",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {task.title}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "var(--text-muted)",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: "1px 6px",
            flexShrink: 0,
            letterSpacing: "0.03em",
          }}
        >
          {task.dri}
        </span>
      </div>
    </Link>
  );
}

// ── Phase Tasks Expansion ─────────────────────────────────────────────────────

interface PhaseTasksProps {
  phaseId: number;
  tasks: TaskItem[];
}

function PhaseTasks({ phaseId, tasks }: PhaseTasksProps) {
  // Map pipeline phase IDs to task phases (pipeline phases 1-7, tasks use P0/P1/P2)
  // We show tasks whose phase label contains the pipeline phase number for filtering.
  // Since pipeline phases and task phases are different dimensions, we show all tasks
  // and let the user navigate to the full task board filtered by phase label.
  const phaseTasks = tasks.filter((t) => {
    // Heuristic: P0 = phases 1-3, P1 = phases 4-5, P2 = phases 6-7
    if (phaseId <= 3) return t.phase === "P0";
    if (phaseId <= 5) return t.phase === "P1";
    return t.phase === "P2";
  });

  const phaseLabel = phaseId <= 3 ? "P0" : phaseId <= 5 ? "P1" : "P2";

  if (phaseTasks.length === 0) {
    return (
      <div
        style={{
          padding: "16px 24px 20px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "var(--text-muted)",
            fontStyle: "italic",
          }}
        >
          No tasks assigned to this phase.
        </p>
        <Link
          to={`/tasks?phase=${phaseLabel}`}
          style={{
            display: "inline-block",
            marginTop: 8,
            fontSize: 12,
            color: "var(--accent)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Open Task Board →
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "16px 24px 20px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          Tasks ({phaseTasks.length})
        </span>
        <Link
          to={`/tasks?phase=${phaseLabel}`}
          style={{
            fontSize: 11,
            color: "var(--accent)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          View all in {phaseLabel} →
        </Link>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {phaseTasks.slice(0, 5).map((task) => (
          <MiniTaskCard key={task.id} task={task} />
        ))}
        {phaseTasks.length > 5 && (
          <Link
            to={`/tasks?phase=${phaseLabel}`}
            style={{
              fontSize: 12,
              color: "var(--accent)",
              textDecoration: "none",
              textAlign: "center",
              padding: "6px",
              fontWeight: 600,
            }}
          >
            +{phaseTasks.length - 5} more tasks →
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Phase Card ────────────────────────────────────────────────────────────────

interface PhaseCardProps {
  phase: typeof PIPELINE_PHASES[number];
  status: PhaseStatus;
  isLast: boolean;
  nextStatus: PhaseStatus;
  tasks: TaskItem[];
}

function PhaseCard({ phase, status, isLast, nextStatus, tasks }: PhaseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const accent = statusColor(status);
  const isActive = status === "active";

  return (
    <div role="listitem" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div
        style={{
          background: "var(--bg-elevated)",
          border: `1px solid ${isActive ? accent : "var(--border)"}`,
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
          boxShadow: isActive
            ? `0 0 0 1px ${accent}, 0 8px 32px rgba(0,0,0,0.2)`
            : undefined,
          animation: isActive ? "phase-pulse 3s ease-in-out infinite" : "none",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 3,
            background: accent,
            opacity: status === "idle" ? 0.3 : 1,
          }}
        />

        {/* Clickable header */}
        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label={`${phase.name} — ${expanded ? "collapse" : "expand"} tasks`}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: 0,
          }}
        >
          <div style={{ padding: "24px 24px 20px", paddingTop: 28 }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
              {/* Phase number + icon */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: `color-mix(in srgb, ${accent} 10%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${accent} 25%, transparent)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: accent,
                  position: "relative",
                }}
              >
                <LucideIcon name={phase.icon} size={22} />
                <span
                  style={{
                    position: "absolute",
                    top: -8,
                    left: -8,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "var(--bg-elevated)",
                    border: `1px solid ${accent}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: accent,
                  }}
                >
                  {phase.id}
                </span>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 600,
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontStyle: "italic",
                      color: "var(--text)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {phase.name}
                  </h3>

                  {/* Gate badge — T15: use color-mix tokens instead of hardcoded rgba */}
                  {phase.isGate && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--warning, #f59e0b)",
                        background: "color-mix(in srgb, var(--warning, #f59e0b) 12%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--warning, #f59e0b) 30%, transparent)",
                        borderRadius: 6,
                        padding: "2px 8px",
                      }}
                    >
                      Gate
                    </span>
                  )}

                  {/* Status dot */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 11,
                      fontWeight: 600,
                      color: accent,
                      letterSpacing: "0.04em",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: accent,
                        animation: isActive ? "livePulse 2s ease-in-out infinite" : "none",
                      }}
                    />
                    {statusLabel(status)}
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {phase.description}
                </p>
              </div>

              {/* Expand chevron */}
              <div
                style={{
                  flexShrink: 0,
                  color: "var(--text-muted)",
                  transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)",
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  paddingTop: 2,
                }}
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Agent badges + skills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {phase.agents.map((agent) => (
                <span
                  key={agent}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--accent)",
                    background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
                    borderRadius: 6,
                    padding: "3px 10px",
                    letterSpacing: "0.02em",
                  }}
                >
                  {agent}
                </span>
              ))}
              {phase.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    padding: "3px 10px",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Teaching point */}
            <p
              style={{
                margin: "0 0 14px",
                fontSize: 13,
                fontStyle: "italic",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                borderLeft: `2px solid color-mix(in srgb, ${accent} 25%, transparent)`,
                paddingLeft: 12,
              }}
            >
              {phase.teachingPoint}
            </p>

            {/* Apple provenance */}
            {phase.appleOrigin && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    background: "color-mix(in srgb, var(--text-muted) 10%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--text-muted) 20%, transparent)",
                    borderRadius: 4,
                    padding: "2px 6px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Apple EPM
                </span>
                <span
                  style={{
                    width: 1,
                    height: 12,
                    background: "var(--border)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    fontStyle: "italic",
                    lineHeight: 1.4,
                  }}
                >
                  {phase.appleOrigin}
                </span>
              </div>
            )}
          </div>
        </button>

        {/* Collapsible tasks panel */}
        {expanded && (
          <PhaseTasks phaseId={phase.id} tasks={tasks} />
        )}
      </div>

      {/* Animated SVG connector between cards */}
      {!isLast && (
        <ConnectorLine status={status} nextStatus={nextStatus} />
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const { pipeline, tasks, isLive, lastUpdated } = useOps();

  // Build a lookup of phase status from live data
  const statusMap = new Map<number, PhaseStatus>(
    pipeline.phases.map((p) => [p.id, p.status])
  );

  const getStatus = (id: number): PhaseStatus =>
    statusMap.get(id) ?? "idle";

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 64px" }}>
      {/* Section header */}
      <div style={{ marginBottom: 40 }}>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          APEX Framework
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            The 7-Phase Pipeline
          </h1>
          <LiveBadge isLive={isLive} lastUpdated={lastUpdated} />
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            maxWidth: 560,
          }}
        >
          A state machine with 7 phases and 3 user gates. Modeled after Apple's EPM process —
          plan, validate, build, and ship with discipline.
        </p>
      </div>

      {/* Gate model legend */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 32,
          padding: "14px 16px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--warning, #f59e0b)",
            }}
          />
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--text)" }}>Gate</strong> — user decision required
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--accent)",
              animation: "livePulse 2s ease-in-out infinite",
            }}
          />
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--text)" }}>Active</strong> — currently running
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--success, #22c55e)",
            }}
          />
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--text)" }}>Complete</strong> — passed and done
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 5h8M6 2l4 3-4 3" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Click any phase to see its tasks
          </span>
        </div>
      </div>

      {/* Phase cards */}
      <div
        role="list"
        aria-label="Pipeline phases"
        aria-live="polite"
        aria-atomic="false"
        style={{ display: "flex", flexDirection: "column", gap: 0 }}
      >
        {PIPELINE_PHASES.map((phase, idx) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            status={getStatus(phase.id)}
            isLast={idx === PIPELINE_PHASES.length - 1}
            nextStatus={getStatus(PIPELINE_PHASES[idx + 1]?.id ?? phase.id)}
            tasks={tasks.tasks}
          />
        ))}
      </div>

      {/* Apple EPM attribution */}
      <div
        style={{
          marginTop: 40,
          padding: "20px 24px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--text-muted)",
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        >
          APEX adapts Apple's EPM faithfully where possible, and is transparent where it simplifies.
          "APEX addition" means we invented it. "Grounded in" means we adapted it. "Maps to" means it's a direct analog.
        </p>
      </div>

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        @keyframes phase-pulse {
          0%, 100% {
            box-shadow: 0 0 0 1px var(--accent), 0 8px 32px rgba(0,0,0,0.2);
          }
          50% {
            box-shadow: 0 0 20px 4px color-mix(in srgb, var(--accent) 15%, transparent), 0 8px 32px rgba(0,0,0,0.2);
          }
        }

        @keyframes flow-line {
          0%   { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }

        .connector-flow {
          animation: flow-line 0.8s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          /* The global foundation.css already zeroes animation-duration for *,
             but be explicit here so the SVG connector is definitely stopped. */
          .connector-flow {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
