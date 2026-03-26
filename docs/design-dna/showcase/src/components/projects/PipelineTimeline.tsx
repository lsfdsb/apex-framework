/**
 * PipelineTimeline — Horizontal 7-phase APEX pipeline timeline.
 * Each node is clickable to filter sub-projects by phase.
 */

import { Lock } from "lucide-react";
import { PIPELINE_PHASES } from "../../data/projects-data";
import type { SubProject } from "../../data/projects-data";

// ── Pipeline Phase Node ────────────────────────────────────────────────────────

interface PipelineNodeProps {
  phase: (typeof PIPELINE_PHASES)[number];
  isLast: boolean;
  isSelected: boolean;
  subCount: number;
  completedCount: number;
  onClick: () => void;
}

function PipelineNode({ phase, isLast, isSelected, subCount, completedCount, onClick }: PipelineNodeProps) {
  const Icon = phase.icon;
  const allDone = subCount > 0 && completedCount === subCount;
  const hasWork = subCount > 0;
  const dotColor = allDone ? "var(--success)" : hasWork ? "var(--accent)" : "var(--text-muted)";

  return (
    <div style={{ display: "flex", alignItems: "center", flex: isLast ? "0 0 auto" : 1 }}>
      <button
        onClick={onClick}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          background: "none", border: "none", cursor: "pointer", padding: "6px 2px",
          minWidth: 80, transition: "transform 0.2s",
          transform: isSelected ? "scale(1.08)" : "scale(1)",
          opacity: hasWork || isSelected ? 1 : 0.5,
        }}
        aria-label={`${phase.name} — ${subCount} sub-projects`}
      >
        {/* Phase icon circle */}
        <div style={{
          width: isSelected ? 36 : 28,
          height: isSelected ? 36 : 28,
          borderRadius: "50%",
          background: isSelected ? dotColor : allDone ? dotColor : "var(--bg)",
          border: `2px solid ${dotColor}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: isSelected ? `0 0 0 4px color-mix(in srgb, ${dotColor} 20%, transparent)` : "none",
          transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          position: "relative",
        }}>
          <Icon size={isSelected ? 16 : 12} style={{
            color: (isSelected || allDone) ? "var(--bg)" : dotColor,
          }} />
          {phase.isGate && (
            <Lock size={7} style={{
              position: "absolute", bottom: -2, right: -2,
              color: "var(--warning)", background: "var(--bg-elevated)",
              borderRadius: "50%", padding: 1,
            }} />
          )}
        </div>

        {/* Phase label + agents */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: isSelected ? 12 : 10, fontWeight: isSelected ? 700 : 600,
            color: isSelected ? "var(--text)" : hasWork ? "var(--text-secondary)" : "var(--text-muted)",
            fontFamily: "var(--font-body)", letterSpacing: "-0.01em",
          }}>
            {phase.name}
          </div>

          <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 3, flexWrap: "wrap" }}>
            {phase.agents.map((agent) => (
              <span key={agent} style={{
                fontSize: 8, fontWeight: 600, padding: "1px 5px", borderRadius: 8,
                background: isSelected
                  ? "color-mix(in srgb, var(--accent) 15%, transparent)"
                  : "color-mix(in srgb, var(--text-muted) 8%, transparent)",
                color: isSelected ? "var(--accent)" : "var(--text-muted)",
                letterSpacing: "0.02em", transition: "all 0.3s",
              }}>
                {agent}
              </span>
            ))}
          </div>

          {isSelected && (
            <div style={{ display: "flex", gap: 2, justifyContent: "center", marginTop: 3, flexWrap: "wrap" }}>
              {phase.skills.map((skill) => (
                <span key={skill} style={{
                  fontSize: 7, fontWeight: 500, padding: "1px 4px", borderRadius: 4,
                  background: "var(--bg-surface, var(--bg))", color: "var(--text-muted)",
                  border: "1px solid var(--border)", fontFamily: "var(--font-mono, monospace)",
                }}>
                  {skill}
                </span>
              ))}
            </div>
          )}

          {hasWork && (
            <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>
              {completedCount}/{subCount}
            </div>
          )}
        </div>
      </button>

      {/* Connector line */}
      {!isLast && (
        <div style={{
          flex: 1, height: 2, minWidth: 12,
          background: allDone && subCount > 0 ? "var(--success)" : "var(--border)",
          marginTop: -20, position: "relative",
        }}>
          {allDone && subCount > 0 && (
            <div style={{
              position: "absolute", right: -1, top: -3, width: 0, height: 0,
              borderTop: "4px solid transparent", borderBottom: "4px solid transparent",
              borderLeft: "5px solid var(--success)",
            }} />
          )}
        </div>
      )}
    </div>
  );
}

// ── Pipeline Timeline ──────────────────────────────────────────────────────────

interface PipelineTimelineProps {
  selectedPhase: number | null;
  onSelectPhase: (phaseId: number) => void;
  /** Returns sub-projects at a given phase id */
  subsByPhase: (phaseId: number) => SubProject[];
}

export function PipelineTimeline({ selectedPhase, onSelectPhase, subsByPhase }: PipelineTimelineProps) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", overflowX: "auto", scrollbarWidth: "none" }}>
      {PIPELINE_PHASES.map((phase, i) => {
        const subs = subsByPhase(phase.id);
        const completed = subs.filter(s => s.status === "shipped").length;
        return (
          <PipelineNode
            key={phase.id}
            phase={phase}
            isLast={i === PIPELINE_PHASES.length - 1}
            isSelected={selectedPhase === phase.id}
            subCount={subs.length}
            completedCount={completed}
            onClick={() => onSelectPhase(phase.id)}
          />
        );
      })}
    </div>
  );
}
