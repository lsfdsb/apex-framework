/**
 * AgentsPage — APEX agent roster.
 * Shows all 7 agents with model badges, responsibilities, status from OpsContext,
 * and live thought streams with staggered animations.
 */

import { useOps } from "../context/OpsContext";
import { AGENT_ROSTER } from "../data/hub-data";
import { LucideIcon } from "../components/hub/LucideIcon";
import { LiveBadge } from "../components/hub/LiveBadge";
import type { AgentModel, AgentStatus, AgentState } from "../data/hub-types";

// ── Demo fallback data ────────────────────────────────────────────────────────

// Demo fallback: all agents idle, no fake activity.
// Live data from .apex/state/agents.json replaces this when a session is active.
const DEMO_AGENTS: AgentState = {
  agents: [],
};

// ── Model badge colors ────────────────────────────────────────────────────────
// T15: Use color-mix tokens instead of hardcoded rgba so both light and dark
//      themes get correct tinting derived from CSS custom properties.

function modelStyle(model: AgentModel): {
  bg: string;
  border: string;
  text: string;
  label: string;
} {
  switch (model) {
    case "opus":
      // Purple-tinted accent — distinct from the SaaS blue accent
      return {
        bg: "color-mix(in srgb, color-mix(in srgb, var(--accent) 80%, #a855f7) 12%, transparent)",
        border: "color-mix(in srgb, color-mix(in srgb, var(--accent) 80%, #a855f7) 30%, transparent)",
        text: "color-mix(in srgb, var(--accent) 80%, #a855f7)",
        label: "Opus",
      };
    case "haiku":
      // Teal-tinted success — fast / lightweight feel
      return {
        bg: "color-mix(in srgb, color-mix(in srgb, var(--success) 80%, #06b6d4) 12%, transparent)",
        border: "color-mix(in srgb, color-mix(in srgb, var(--success) 80%, #06b6d4) 30%, transparent)",
        text: "color-mix(in srgb, var(--success) 80%, #06b6d4)",
        label: "Haiku",
      };
    default: // sonnet
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
    // Wrapper provides position:relative for the ::after ripple pseudo-element
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
  // T12: Apply typewriter effect only to the newest (first) entry.
  // CSS-only: overflow:hidden + white-space:nowrap + width animation from 0 → 100%.
  const isNewest = index === 0;

  return (
    <div
      className="thought-entry"
      style={{
        display: "flex",
        gap: 10,
        animationDelay: `${index * 100}ms`,
      }}
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

// ── Agent Card ────────────────────────────────────────────────────────────────

interface AgentCardProps {
  agent: (typeof AGENT_ROSTER)[number];
  liveStatus: AgentStatus;
  currentTask?: string;
  thoughtStream: Array<{ timestamp: string; action: string; explanation: string }>;
}

function AgentCard({ agent, liveStatus, currentTask, thoughtStream }: AgentCardProps) {
  const badge = modelStyle(agent.model);
  const isActive = liveStatus === "active";
  const entries = thoughtStream.slice(0, 5);

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
          {/* Icon */}
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
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--text)",
                  letterSpacing: "-0.01em",
                }}
              >
                {agent.name}
              </span>

              {/* Model badge */}
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

              {/* Status */}
              <StatusDot status={liveStatus} />
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  textTransform: "capitalize",
                }}
              >
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
        <p
          style={{
            margin: "0 0 14px",
            fontSize: 13,
            fontStyle: "italic",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}
        >
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

        {/* T12: Connection line + current task badge — clickable */}
        {isActive && currentTask && (
          <div style={{ marginBottom: 12 }}>
            {/* Dashed connector SVG from agent card down to the task badge */}
            <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 16, marginBottom: 4 }}>
              <svg
                width="2"
                height="20"
                viewBox="0 0 2 20"
                fill="none"
                aria-hidden="true"
                className="task-connector-line"
              >
                <line
                  x1="1"
                  y1="0"
                  x2="1"
                  y2="20"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            {/* Task badge */}
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
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "color-mix(in srgb, var(--accent) 12%, transparent)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "color-mix(in srgb, var(--accent) 40%, transparent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "color-mix(in srgb, var(--accent) 6%, transparent)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "color-mix(in srgb, var(--accent) 20%, transparent)";
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>Working on: </span>
                {currentTask}
              </span>
            </a>
          </div>
        )}

        {/* Thought stream */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <p
            id={`thought-label-${agent.name}`}
            style={{
              margin: "0 0 10px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
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
                <ThoughtEntry
                  key={`${t.timestamp}-${i}`}
                  timestamp={t.timestamp}
                  action={t.action}
                  explanation={t.explanation}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "var(--text-muted)",
                fontStyle: "italic",
              }}
            >
              Waiting for agent activity...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AgentsPage() {
  const { agents, isLive, lastUpdated } = useOps();

  // Use live data if available, otherwise show demo data so the page looks alive
  const effectiveAgents = agents.agents.length > 0 ? agents : DEMO_AGENTS;

  // Build a lookup from effective agent data
  const liveMap = new Map(effectiveAgents.agents.map((a) => [a.name, a]));

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px 64px" }}>
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
            Agent Roster
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
          Seven specialist agents built on Apple's functional organization model.
          Each is a DRI — Directly Responsible Individual — for their domain.
        </p>
      </div>

      {/* Model legend */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 32,
          padding: "12px 16px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          flexWrap: "wrap",
        }}
      >
        {(["opus", "sonnet", "haiku"] as AgentModel[]).map((m) => {
          const s = modelStyle(m);
          return (
            <div key={m} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: s.text,
                }}
              />
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                <strong style={{ color: s.text }}>{s.label}</strong>
                {m === "opus" && " — Orchestration, complex reasoning"}
                {m === "sonnet" && " — Implementation, balanced speed/quality"}
                {m === "haiku" && " — Fast monitoring, lightweight tasks"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Agent grid */}
      <div
        role="list"
        aria-label="Agent roster"
        aria-live="polite"
        aria-atomic="false"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 20,
        }}
      >
        {AGENT_ROSTER.map((agent) => {
          const live = liveMap.get(agent.name);
          return (
            <AgentCard
              key={agent.name}
              agent={agent}
              liveStatus={live?.status ?? "idle"}
              currentTask={live?.currentTask}
              thoughtStream={live?.thoughtStream ?? []}
            />
          );
        })}
      </div>

      {/* Teaching section */}
      <div
        style={{
          marginTop: 48,
          padding: "28px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 16,
        }}
      >
        <p
          style={{
            margin: "0 0 6px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          Why Multi-Agent?
        </p>
        <h2
          style={{
            margin: "0 0 14px",
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: 22,
            fontWeight: 400,
            color: "var(--text)",
          }}
        >
          Specialists outperform generalists
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            maxWidth: 640,
          }}
        >
          Apple's functional organization puts experts in charge of their domain.
          APEX mirrors this — the QA agent holds the quality bar so the Builder agent
          can focus on implementation. The Watcher catches errors immediately so
          the Builder doesn't have to context-switch to debugging. Specialization
          is how you get both speed and quality.
        </p>
      </div>

      <style>{`
        /* ── Breathing pulse on active agent card ─────────────────────────── */
        @keyframes agent-breathe {
          0%, 100% {
            box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 40%, transparent);
          }
          50% {
            box-shadow: 0 0 0 8px color-mix(in srgb, var(--accent) 0%, transparent);
          }
        }

        /* ── Status dot opacity pulse ─────────────────────────────────────── */
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        /* ── T12: One-shot ripple expanding from the status dot ──────────── */
        @keyframes agent-ripple {
          0%   { transform: scale(1);   opacity: 0.3; }
          100% { transform: scale(2.5); opacity: 0;   }
        }

        /* ── T12: Thought entry slide-in ─────────────────────────────────── */
        @keyframes thoughtSlideIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ── T12: Typewriter — width expands left→right, text reveals ────── */
        @keyframes typewriter {
          from { width: 0; }
          to   { width: 100%; }
        }

        /* ── T12: Flowing dashes on connector line ───────────────────────── */
        @keyframes connector-flow {
          0%   { stroke-dashoffset: 12; }
          100% { stroke-dashoffset: 0;  }
        }

        /* ── Active agent card breathe ───────────────────────────────────── */
        .agent-card--active {
          animation: agent-breathe 3s ease-in-out infinite;
        }

        /* ── Status dot pulse + ripple ::after ──────────────────────────── */
        .agent-status-dot--active {
          animation: livePulse 2s ease-in-out infinite;
        }
        .agent-status-dot--active::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: var(--success, #22c55e);
          animation: agent-ripple 2s ease-out infinite;
        }

        /* ── Thought entry slide-in ──────────────────────────────────────── */
        .thought-entry {
          animation: thoughtSlideIn 0.3s ease-out both;
        }

        /* ── Typewriter on newest thought entry ──────────────────────────── */
        .thought-typewriter {
          overflow: hidden;
          white-space: nowrap;
          width: 0;
          animation: typewriter 0.6s steps(40, end) 0.1s both;
        }

        /* ── Connector line flowing dashes ───────────────────────────────── */
        .task-connector-line line {
          animation: connector-flow 0.6s linear infinite;
        }

        /* ── T12 + T15: prefers-reduced-motion — disable ALL animations ─── */
        @media (prefers-reduced-motion: reduce) {
          .agent-card--active,
          .agent-status-dot--active,
          .agent-status-dot--active::after,
          .thought-entry,
          .thought-typewriter,
          .task-connector-line line {
            animation: none !important;
          }
          /* Ensure typewriter text is fully visible without animation */
          .thought-typewriter {
            width: auto;
            overflow: visible;
            white-space: normal;
          }
        }
      `}</style>
    </div>
  );
}
