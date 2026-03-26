/**
 * AgentsPage — APEX agent roster.
 * Shows all 7 agents with model badges, responsibilities, status from OpsContext,
 * and thought stream placeholders.
 */

import { useOps } from "../context/OpsContext";
import { AGENT_ROSTER } from "../data/hub-data";
import { LucideIcon } from "../components/hub/LucideIcon";
import { LiveBadge } from "../components/hub/LiveBadge";
import type { AgentModel, AgentStatus } from "../data/hub-types";

// ── Model badge colors ────────────────────────────────────────────────────────

function modelStyle(model: AgentModel): { bg: string; border: string; text: string; label: string } {
  switch (model) {
    case "opus":
      return {
        bg: "rgba(168,85,247,0.12)",
        border: "rgba(168,85,247,0.3)",
        text: "#a855f7",
        label: "Opus",
      };
    case "haiku":
      return {
        bg: "rgba(6,182,212,0.12)",
        border: "rgba(6,182,212,0.3)",
        text: "#06b6d4",
        label: "Haiku",
      };
    default: // sonnet
      return {
        bg: "rgba(99,102,241,0.12)",
        border: "rgba(99,102,241,0.3)",
        text: "var(--accent)",
        label: "Sonnet",
      };
  }
}

// ── Status dot ────────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: AgentStatus }) {
  const color =
    status === "active" ? "var(--success, #22c55e)"
    : status === "failed" ? "var(--destructive, #ef4444)"
    : status === "completed" ? "var(--success, #22c55e)"
    : "var(--text-muted)";

  return (
    <span
      title={status}
      aria-label={`Status: ${status}`}
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
        animation: status === "active" ? "livePulse 2s ease-in-out infinite" : "none",
      }}
    />
  );
}

// ── Agent Card ────────────────────────────────────────────────────────────────

interface AgentCardProps {
  agent: typeof AGENT_ROSTER[number];
  liveStatus: AgentStatus;
  currentTask?: string;
  thoughtStream: Array<{ timestamp: string; action: string; explanation: string }>;
}

function AgentCard({ agent, liveStatus, currentTask, thoughtStream }: AgentCardProps) {
  const badge = modelStyle(agent.model);
  const isActive = liveStatus === "active";

  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: isActive ? "0 0 0 1px var(--accent), 0 8px 24px rgba(0,0,0,0.15)" : undefined,
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 3,
          background: badge.text,
        }}
      />

      <div style={{ padding: "24px 20px 20px", paddingTop: 28 }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
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

        {/* Current task (live mode) */}
        {isActive && currentTask && (
          <div
            style={{
              marginBottom: 12,
              padding: "8px 12px",
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--text-secondary)",
            }}
          >
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>Working: </span>
            {currentTask}
          </div>
        )}

        {/* Thought stream */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: 12,
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Thought Stream
          </p>

          {thoughtStream.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {thoughtStream.slice(0, 2).map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--text-muted)",
                      fontFamily: "'JetBrains Mono', monospace",
                      whiteSpace: "nowrap",
                      paddingTop: 1,
                    }}
                  >
                    {new Date(t.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>
                      {t.action}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 6 }}>
                      {t.explanation}
                    </span>
                  </div>
                </div>
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
              No active session — thoughts appear here during a live build.
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

  // Build a lookup from live agent data
  const liveMap = new Map(
    agents.agents.map((a) => [a.name, a])
  );

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
          padding: "28px 28px",
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
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
