/**
 * AgentCard — individual agent display in the Agent Roster.
 * Shows model badge, status (derived from tasks), responsibilities,
 * the active task connector, mini task cards, and thought stream.
 */

import { AGENT_ROSTER } from "../../data/hub-data";
import { LucideIcon } from "./LucideIcon";
import { AgentTaskCard } from "./AgentTaskCard";
import type { AgentModel, AgentStatus } from "../../data/hub-types";
import type { DerivedAgentEntry } from "../../context/OpsContext";

// ── Model badge colors ────────────────────────────────────────────────────────
// T15: Use color-mix tokens so both light and dark themes tint from CSS vars.

export function modelStyle(model: AgentModel): {
  bg: string;
  border: string;
  text: string;
  label: string;
} {
  switch (model) {
    case "opus":
      return {
        bg: "color-mix(in srgb, color-mix(in srgb, var(--accent) 80%, #a855f7) 12%, transparent)",
        border: "color-mix(in srgb, color-mix(in srgb, var(--accent) 80%, #a855f7) 30%, transparent)",
        text: "color-mix(in srgb, var(--accent) 80%, #a855f7)",
        label: "Opus",
      };
    case "haiku":
      return {
        bg: "color-mix(in srgb, color-mix(in srgb, var(--success) 80%, #06b6d4) 12%, transparent)",
        border: "color-mix(in srgb, color-mix(in srgb, var(--success) 80%, #06b6d4) 30%, transparent)",
        text: "color-mix(in srgb, var(--success) 80%, #06b6d4)",
        label: "Haiku",
      };
    default:
      return {
        bg: "color-mix(in srgb, var(--accent) 12%, transparent)",
        border: "color-mix(in srgb, var(--accent) 30%, transparent)",
        text: "var(--accent)",
        label: "Sonnet",
      };
  }
}

// ── Status dot with breathing pulse + ripple on active ───────────────────────

function StatusDot({ status }: { status: AgentStatus }) {
  const color =
    status === "active"
      ? "var(--success, #22c55e)"
      : status === "failed"
        ? "var(--destructive, #ef4444)"
        : status === "completed"
          ? "var(--success, #22c55e)"
          : "var(--text-muted)";

  return (
    <span
      title={status}
      aria-label={`Status: ${status}`}
      className={status === "active" ? "agent-status-dot--active" : undefined}
      style={{
        display: "inline-block",
        position: "relative",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

// ── Thought Stream Entry ──────────────────────────────────────────────────────

interface ThoughtEntryProps {
  timestamp: string;
  action: string;
  explanation: string;
  index: number;
}

function ThoughtEntry({ timestamp, action, explanation, index }: ThoughtEntryProps) {
  const isNewest = index === 0;

  return (
    <div
      className="thought-entry"
      style={{ display: "flex", gap: 10, animationDelay: `${index * 100}ms` }}
    >
      <span
        style={{
          fontSize: 10,
          color: "var(--text-muted)",
          fontFamily: "'JetBrains Mono', monospace",
          whiteSpace: "nowrap",
          paddingTop: 2,
          flexShrink: 0,
        }}
      >
        {new Date(timestamp).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "America/Sao_Paulo",
        })}
      </span>
      <div style={{ minWidth: 0 }}>
        <span
          className={isNewest ? "thought-typewriter" : undefined}
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--text)",
            display: "block",
            lineHeight: 1.3,
          }}
        >
          {action}
        </span>
        <span
          style={{
            fontSize: 11,
            color: "var(--text-secondary)",
            lineHeight: 1.4,
            display: "block",
            marginTop: 1,
          }}
        >
          {explanation}
        </span>
      </div>
    </div>
  );
}

// ── AgentCard ─────────────────────────────────────────────────────────────────

export interface AgentCardProps {
  agent: (typeof AGENT_ROSTER)[number];
  derived: DerivedAgentEntry | undefined;
  thoughtStream: Array<{ timestamp: string; action: string; explanation: string }>;
}

export function AgentCard({ agent, derived, thoughtStream }: AgentCardProps) {
  const liveStatus = derived?.status ?? "idle";
  const currentTask = derived?.currentTask;
  const badge = modelStyle(agent.model);
  const isActive = liveStatus === "active";
  const entries = thoughtStream.slice(0, 5);

  const inProgressTasks = (derived?.tasks ?? []).filter((t) => t.column === "in-progress");
  const doneTasks = (derived?.tasks ?? []).filter((t) => t.column === "done").slice(0, 3);

  return (
    <div
      role="listitem"
      className={isActive ? "agent-card agent-card--active" : "agent-card"}
      style={{
        background: "var(--bg-elevated)",
        border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: badge.text,
        }}
      />

      <div style={{ padding: "28px 20px 20px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: badge.bg,
              border: `1px solid ${badge.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: badge.text,
              flexShrink: 0,
            }}
          >
            <LucideIcon name={agent.icon} size={20} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 3,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>
                {agent.name}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: badge.text,
                  background: badge.bg,
                  border: `1px solid ${badge.border}`,
                  borderRadius: 6,
                  padding: "2px 7px",
                }}
              >
                {badge.label}
              </span>
              <StatusDot status={liveStatus} />
              <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "capitalize" }}>
                {liveStatus}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "var(--text-muted)",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {agent.role}
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p style={{ margin: "0 0 14px", fontSize: 13, fontStyle: "italic", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {agent.tagline}
        </p>

        {/* Responsibilities */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {agent.responsibilities.map((r) => (
            <span
              key={r}
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "var(--text-secondary)",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                padding: "3px 10px",
              }}
            >
              {r}
            </span>
          ))}
        </div>

        {/* Active task — headline connector badge */}
        {isActive && currentTask && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 16, marginBottom: 4 }}>
              <svg width="2" height="20" viewBox="0 0 2 20" fill="none" aria-hidden="true" className="task-connector-line">
                <line x1="1" y1="0" x2="1" y2="20" stroke="var(--accent)" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
              </svg>
            </div>
            <a
              href={`#/tasks?task=${encodeURIComponent(currentTask)}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                background: "color-mix(in srgb, var(--accent) 6%, transparent)",
                border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "background 0.15s ease, border-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "color-mix(in srgb, var(--accent) 12%, transparent)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "color-mix(in srgb, var(--accent) 40%, transparent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "color-mix(in srgb, var(--accent) 6%, transparent)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "color-mix(in srgb, var(--accent) 20%, transparent)";
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, flex: 1 }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>Working on: </span>
                {currentTask}
              </span>
            </a>
          </div>
        )}

        {/* Additional in-progress tasks beyond the headline */}
        {inProgressTasks.length > 1 && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)" }}>
              In Progress
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {inProgressTasks.slice(1).map((task) => (
                <AgentTaskCard key={task.id} task={task} variant="active" />
              ))}
            </div>
          </div>
        )}

        {/* Recently completed tasks — only when no in-progress work */}
        {inProgressTasks.length === 0 && doneTasks.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Recently Completed
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {doneTasks.map((task) => (
                <AgentTaskCard key={task.id} task={task} variant="done" />
              ))}
            </div>
          </div>
        )}

        {/* Thought stream */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <p
            id={`thought-label-${agent.name}`}
            style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}
          >
            Thought Stream
          </p>

          {entries.length > 0 ? (
            <div
              aria-live="polite"
              aria-atomic="false"
              aria-labelledby={`thought-label-${agent.name}`}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              {entries.map((t, i) => (
                <ThoughtEntry key={`${t.timestamp}-${i}`} timestamp={t.timestamp} action={t.action} explanation={t.explanation} index={i} />
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
              {liveStatus === "idle" ? "Available" : "Waiting for agent activity..."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
