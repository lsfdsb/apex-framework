import { useState, useEffect, useRef, useCallback } from "react";
import { PipelineFlow } from "../components/pipeline/PipelineFlow";
import type { SimPhaseStatus } from "../components/pipeline/PipelineFlow";
import { SimulateButton } from "../components/pipeline/SimulateButton";
import { PIPELINE_PHASES } from "../data/hub-data";
import { useApexState } from "../hooks/useApexState";
import { LiveBadge } from "../components/hub/LiveBadge";
import type { PipelineState } from "../data/hub-types";

const DEFAULT_PIPELINE: PipelineState = {
  currentPhase: 0,
  phases: [],
};

// ── Autonomy stat pill ───────────────────────────────────────────────────────

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px 28px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        flex: "1 1 120px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: "var(--text)",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          color: "var(--text-muted)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const { data: pipelineState, isLive, lastUpdated } = useApexState<PipelineState>(
    "pipeline.json",
    DEFAULT_PIPELINE
  );

  const gateCount = PIPELINE_PHASES.filter((p) => p.isGate).length;
  const autonomousCount = PIPELINE_PHASES.filter((p) => !p.isGate).length;

  // Derive activePhase from live data (0 means nothing active)
  const activePhase = isLive && pipelineState.currentPhase > 0 ? pipelineState.currentPhase : null;

  // ── Simulation state ──────────────────────────────────────────────────────
  const [simStatus, setSimStatus] = useState<Record<number, SimPhaseStatus>>({});
  const [simRunning, setSimRunning] = useState(false);
  const [simComplete, setSimComplete] = useState(false);
  const simAbortRef = useRef(false);

  // Respect prefers-reduced-motion: skip all delays
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const runSimulation = useCallback(async () => {
    if (simRunning) return;

    // Reset state
    simAbortRef.current = false;
    setSimStatus({});
    setSimRunning(true);
    setSimComplete(false);

    const delay = (ms: number) =>
      new Promise<void>((resolve) => {
        if (prefersReducedMotion) { resolve(); return; }
        const t = setTimeout(resolve, ms);
        // Attach abort check
        const check = setInterval(() => {
          if (simAbortRef.current) { clearTimeout(t); clearInterval(check); resolve(); }
        }, 50);
        setTimeout(() => clearInterval(check), ms + 100);
      });

    for (const phase of PIPELINE_PHASES) {
      if (simAbortRef.current) break;

      // Mark active
      setSimStatus((prev) => ({ ...prev, [phase.id]: "active" }));
      await delay(phase.simulationDuration);

      if (simAbortRef.current) break;

      // Gate phases: pause briefly with gate-pause state
      if (phase.isGate) {
        setSimStatus((prev) => ({ ...prev, [phase.id]: "gate-pause" }));
        await delay(prefersReducedMotion ? 0 : 500);
      }

      if (simAbortRef.current) break;

      // Mark complete
      setSimStatus((prev) => ({ ...prev, [phase.id]: "complete" }));
    }

    setSimRunning(false);
    if (!simAbortRef.current) {
      setSimComplete(true);
      // Reset button label after 3 seconds
      setTimeout(() => setSimComplete(false), 3000);
    }
  }, [simRunning, prefersReducedMotion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { simAbortRef.current = true; };
  }, []);

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "48px 24px 80px",
      }}
    >
      {/* ── Page header ── */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--accent)",
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              flex: 1,
            }}
          >
            APEX Framework
          </div>
          <LiveBadge isLive={isLive} lastUpdated={lastUpdated} />
        </div>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 400,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: 16,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
          }}
        >
          The 7-Phase Pipeline
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "var(--text-secondary)",
            maxWidth: 600,
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          From idea to production code — autonomously. APEX orchestrates 5
          specialized agents across 7 phases. You make 3 decisions. APEX does
          the rest.
        </p>

        {/* Quick stats */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <StatPill value="7" label="Phases" />
          <StatPill value="5" label="Agents" />
          <StatPill value={String(gateCount)} label="User gates" />
          <StatPill value={String(autonomousCount)} label="Autonomous" />
        </div>
      </div>

      {/* ── Pipeline flow ── */}
      <section
        aria-labelledby="pipeline-flow-heading"
        style={{ marginBottom: 64 }}
      >
        <h2
          id="pipeline-flow-heading"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            marginBottom: 24,
          }}
        >
          Interactive Pipeline — Click any phase to explore
        </h2>
        <PipelineFlow activePhase={activePhase} simStatus={simStatus} />
      </section>

      {/* ── Simulate section ── */}
      <section
        aria-labelledby="simulate-heading"
        style={{
          padding: "36px 32px",
          background: "var(--bg-elevated)",
          border: `1px solid ${simComplete ? "var(--success)" : "var(--border)"}`,
          borderRadius: 16,
          textAlign: "center",
          transition: "border-color 0.4s ease",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent bar — turns green on complete */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: simComplete ? "var(--success)" : "var(--accent)",
            borderRadius: "16px 16px 0 0",
            transition: "background 0.4s ease",
          }}
        />

        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: simComplete ? "var(--success)" : "var(--accent)",
            marginBottom: 8,
            transition: "color 0.4s ease",
          }}
        >
          {simComplete ? "Pipeline Complete" : "Interactive Demo"}
        </div>
        <h2
          id="simulate-heading"
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          Simulate the Pipeline
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            maxWidth: 480,
            margin: "0 auto 24px",
          }}
        >
          Watch all 7 phases execute sequentially with realistic timing. Gates
          pause. Agents activate. Quality checks fire. The full pipeline — in
          about 13 seconds.
        </p>
        <SimulateButton
          onSimulate={runSimulation}
          isRunning={simRunning}
          isComplete={simComplete}
        />
      </section>
    </div>
  );
}
