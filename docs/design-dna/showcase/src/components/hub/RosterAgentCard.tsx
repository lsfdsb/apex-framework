/**
 * RosterAgentCard — static agent card for the Home / About roster.
 * Distinct from AgentCard (OPS live version with status, tasks, thought stream).
 * Shows: icon, name, model badge, role, tagline, responsibilities only.
 */

import { LucideIcon } from "./LucideIcon";
import { AGENT_ROSTER } from "../../data/hub-data";
import type { AgentModel } from "../../data/hub-types";

// ── Model badge ────────────────────────────────────────────────────────────────

function ModelBadge({ model }: { model: AgentModel }) {
  const colors: Record<string, { bg: string; text: string }> = {
    opus: {
      bg: "color-mix(in srgb, var(--accent) 18%, transparent)",
      text: "var(--accent)",
    },
    sonnet: {
      bg: "color-mix(in srgb, var(--text-muted) 12%, transparent)",
      text: "var(--text-muted)",
    },
    haiku: {
      bg: "color-mix(in srgb, var(--text-muted) 8%, transparent)",
      text: "var(--text-muted)",
    },
  };
  const style = colors[model] ?? colors.sonnet;
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 20,
      background: style.bg, color: style.text,
      fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
      textTransform: "uppercase", fontFamily: "var(--font-mono, monospace)",
    }}>
      {model}
    </span>
  );
}

// ── RosterAgentCard ────────────────────────────────────────────────────────────

export function RosterAgentCard({ agent }: { agent: (typeof AGENT_ROSTER)[number] }) {
  return (
    <div style={{
      background: "var(--bg-elevated)", border: "1px solid var(--border)",
      borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      <div style={{ height: 3, background: "var(--accent)" }} />
      <div style={{ padding: "24px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Icon + model badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "color-mix(in srgb, var(--accent) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--accent)", flexShrink: 0,
          }}>
            <LucideIcon name={agent.icon} size={18} />
          </div>
          <ModelBadge model={agent.model} />
        </div>

        {/* Name + role */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
            {agent.name}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{agent.role}</div>
        </div>

        {/* Tagline */}
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
          {agent.tagline}
        </p>

        {/* Responsibilities */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {agent.responsibilities.map((r) => (
            <span key={r} style={{
              padding: "2px 8px", borderRadius: 20,
              background: "var(--bg-surface, var(--bg))", border: "1px solid var(--border)",
              color: "var(--text-muted)", fontSize: 11, fontWeight: 500,
            }}>
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
