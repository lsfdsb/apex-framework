import { useState, useEffect, useRef } from "react";
import { PIPELINE_PHASES } from "../../data/hub-data";
import { PhaseNode } from "./PhaseNode";
import { PhaseDetail } from "./PhaseDetail";

interface PipelineFlowProps {
  /** Currently active phase (1-7) from live session, or null in demo mode */
  activePhase?: number | null;
}

// Dashed connector between phase nodes
function Connector({ isDesktop }: { isDesktop: boolean }) {
  if (isDesktop) {
    return (
      <div
        aria-hidden="true"
        style={{
          flex: "0 0 24px",
          height: 1,
          borderTop: "2px dashed var(--accent)",
          opacity: 0.35,
          alignSelf: "center",
          marginTop: -16, // align with icon center
        }}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      style={{
        width: 1,
        height: 20,
        borderLeft: "2px dashed var(--accent)",
        opacity: 0.35,
        margin: "0 auto",
      }}
    />
  );
}

export function PipelineFlow({ activePhase = null }: PipelineFlowProps) {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const detailRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // Track viewport width for responsive layout
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Scroll to detail panel when it opens
  useEffect(() => {
    if (expandedPhase !== null && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [expandedPhase]);

  // Reveal animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    revealRef.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handlePhaseClick = (phaseId: number) => {
    setExpandedPhase((prev) => (prev === phaseId ? null : phaseId));
  };

  const expandedPhaseData = PIPELINE_PHASES.find((p) => p.id === expandedPhase) ?? null;

  return (
    <div ref={revealRef} style={{ width: "100%" }}>
      {/* Flow container */}
      <div
        className="reveal visible"
        role="list"
        aria-label="APEX 7-phase pipeline"
        style={{
          display: "flex",
          flexDirection: isDesktop ? "row" : "column",
          alignItems: isDesktop ? "flex-start" : "stretch",
          gap: isDesktop ? 0 : 0,
          width: "100%",
          overflowX: isDesktop ? "auto" : "visible",
          paddingBottom: isDesktop ? 8 : 0,
        }}
      >
        {PIPELINE_PHASES.map((phase, index) => (
          <div
            key={phase.id}
            role="listitem"
            style={{
              display: "flex",
              flexDirection: isDesktop ? "row" : "column",
              alignItems: isDesktop ? "flex-start" : "stretch",
              flex: isDesktop ? "1 1 0" : "none",
              minWidth: isDesktop ? 0 : "auto",
            }}
          >
            <PhaseNode
              phase={phase}
              isActive={activePhase === phase.id}
              isExpanded={expandedPhase === phase.id}
              onClick={() => handlePhaseClick(phase.id)}
            />
            {index < PIPELINE_PHASES.length - 1 && (
              <Connector isDesktop={isDesktop} />
            )}
          </div>
        ))}
      </div>

      {/* Phase detail panel */}
      {expandedPhaseData && (
        <div ref={detailRef}>
          <PhaseDetail phase={expandedPhaseData} />
        </div>
      )}

      {/* Hint text */}
      {expandedPhase === null && (
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "var(--text-muted)",
            marginTop: 16,
            letterSpacing: "0.04em",
          }}
        >
          Click any phase to learn what happens inside
        </p>
      )}

      {/* CSS animation keyframes */}
      <style>{`
        @keyframes phaseDetailIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
