/**
 * AgentNode — custom React Flow node for each APEX agent.
 * Must be defined outside render (or memoized) per React Flow requirements.
 */

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { modelStyle } from "../hub/AgentCard";
import { LucideIcon } from "../hub/LucideIcon";
import type { AgentModel, AgentStatus } from "../../data/hub-types";

// ── Status dot ────────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: AgentStatus }) {
  const color =
    status === "active"
      ? "var(--success)"
      : status === "failed"
        ? "var(--destructive)"
        : status === "completed"
          ? "var(--accent)"
          : "var(--text-muted)";

  return (
    <span
      aria-label={`Status: ${status}`}
      title={status}
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
        animation: status === "active" ? "nodeStatusPulse 2s ease-in-out infinite" : "none",
      }}
    />
  );
}

// ── Thought entry ─────────────────────────────────────────────────────────────

interface ThoughtProps {
  timestamp: string;
  action: string;
  explanation: string;
}

function ThoughtLine({ timestamp, action, explanation }: ThoughtProps) {
  const time = new Date(timestamp).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  });

  return (
    <div style={{ display: "flex", gap: 6, fontSize: 10 }}>
      <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap", flexShrink: 0 }}>
        {time}
      </span>
      <span style={{ color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        <span style={{ fontWeight: 600, color: "var(--text)" }}>{action}</span>
        {explanation ? ` — ${explanation}` : ""}
      </span>
    </div>
  );
}

// ── AgentNode ─────────────────────────────────────────────────────────────────

interface AgentNodeData {
  name: string;
  role: string;
  model: AgentModel;
  icon: string;
  status: AgentStatus;
  currentTask?: string;
  thoughtStream: Array<{ timestamp: string; action: string; explanation: string }>;
  taskCount: number;
  isLead: boolean;
}

export const AgentNode = memo(function AgentNode({ data }: NodeProps) {
  const nodeData = data as unknown as AgentNodeData;
  const { name, role, model, icon, status, currentTask, thoughtStream, taskCount, isLead } = nodeData;
  const badge = modelStyle(model);
  const isActive = status === "active";
  const width = isLead ? 240 : 200;

  return (
    <>
      <style>{`
        @keyframes nodeStatusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes nodeBreathing {
          0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 0%, transparent); }
          50% { box-shadow: 0 0 16px 4px color-mix(in srgb, var(--accent) 20%, transparent); }
        }
      `}</style>

      {/* Target handle — top (receives edges from Lead) */}
      {!isLead && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: "var(--border)", width: 8, height: 8, border: "2px solid var(--bg-elevated)" }}
        />
      )}

      <div
        role="article"
        aria-label={`${name} — ${status}`}
        style={{
          width,
          background: "var(--bg-elevated)",
          border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 14,
          overflow: "hidden",
          position: "relative",
          animation: isActive ? "nodeBreathing 3s ease-in-out infinite" : "none",
          transition: "border-color 0.3s ease",
        }}
      >
        {/* Accent bar */}
        <div style={{ height: 3, background: badge.text, position: "absolute", top: 0, left: 0, right: 0 }} />

        <div style={{ padding: isLead ? "18px 14px 12px" : "16px 12px 10px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: badge.bg,
                border: `1px solid ${badge.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: badge.text,
                flexShrink: 0,
              }}
            >
              <LucideIcon name={icon} size={16} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>
                  {name}
                </span>
                <StatusDot status={status} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: badge.text, background: badge.bg, border: `1px solid ${badge.border}`, borderRadius: 4, padding: "1px 5px" }}>
                  {badge.label}
                </span>
                {taskCount > 0 && (
                  <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    {taskCount}t
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Role */}
          <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)" }}>
            {role}
          </p>

          {/* Active task */}
          {isActive && currentTask && (
            <div style={{
              marginBottom: 8,
              padding: "6px 8px",
              background: "color-mix(in srgb, var(--accent) 6%, transparent)",
              border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
              borderRadius: 8,
              fontSize: 11,
              color: "var(--text-secondary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>Working: </span>
              {currentTask}
            </div>
          )}

          {/* Thought stream */}
          {thoughtStream.length > 0 ? (
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
              {thoughtStream.map((t, i) => (
                <ThoughtLine key={`${t.timestamp}-${i}`} timestamp={t.timestamp} action={t.action} explanation={t.explanation} />
              ))}
            </div>
          ) : (
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 6 }}>
              <p style={{ margin: 0, fontSize: 10, color: "var(--text-muted)", fontStyle: "italic" }}>
                {status === "idle" ? "Available" : "Active..."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Source handle — bottom (Lead sends edges to others) */}
      {isLead && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: "var(--accent)", width: 8, height: 8, border: "2px solid var(--bg-elevated)" }}
        />
      )}
    </>
  );
});
