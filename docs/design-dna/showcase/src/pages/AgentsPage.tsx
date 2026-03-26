/**
 * AgentsPage — APEX agent roster.
 * Agent status is derived from tasks (reliable) via derivedAgents from OpsContext.
 * Thought streams come from agents.json (live hook data).
 */

import { useOps } from "../context/OpsContext";
import { AGENT_ROSTER } from "../data/hub-data";
import { AgentCard, modelStyle } from "../components/hub/AgentCard";
import { LiveBadge } from "../components/hub/LiveBadge";
import type { AgentModel } from "../data/hub-types";

// ── DRI name mapping ──────────────────────────────────────────────────────────
// Maps AGENT_ROSTER display names to the dri field values written by hooks.

const ROSTER_TO_DRI: Record<string, string> = {
  Lead: "lead",
  Builder: "builder",
  QA: "qa",
  "Design Reviewer": "design-reviewer",
  PM: "project-manager",
  Watcher: "watcher",
  "Technical Writer": "technical-writer",
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AgentsPage() {
  const { agents, derivedAgents, isLive, lastUpdated } = useOps();

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
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.text }} />
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
          const driKey = ROSTER_TO_DRI[agent.name] ?? agent.name.toLowerCase();
          const derived = derivedAgents.get(driKey);

          // Thought stream comes from agents.json (live hook data)
          const liveInstance = agents.agents.find(
            (a) => a.name === agent.name || a.name.toLowerCase() === driKey,
          );

          return (
            <AgentCard
              key={agent.name}
              agent={agent}
              derived={derived}
              thoughtStream={liveInstance?.thoughtStream ?? []}
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
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
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

        .agent-card--active {
          animation: agent-breathe 3s ease-in-out infinite;
        }

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

        .thought-entry {
          animation: thoughtSlideIn 0.3s ease-out both;
        }

        .thought-typewriter {
          overflow: hidden;
          white-space: nowrap;
          width: 0;
          animation: typewriter 0.6s steps(40, end) 0.1s both;
        }

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
