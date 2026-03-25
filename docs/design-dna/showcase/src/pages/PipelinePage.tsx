import { PipelineFlow } from "../components/pipeline/PipelineFlow";
import { PIPELINE_PHASES } from "../data/hub-data";

// ── Gate legend item ─────────────────────────────────────────────────────────

function GateItem({
  phase,
  description,
}: {
  phase: string;
  description: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        padding: "20px 24px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--accent)",
        borderRadius: 12,
        flex: "1 1 220px",
        minWidth: 0,
      }}
    >
      {/* Lock icon */}
      <span
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "var(--accent-glow)",
          border: "1px solid var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent)",
        }}
        aria-hidden="true"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </span>
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--accent)",
            marginBottom: 6,
          }}
        >
          {phase}
        </div>
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: "var(--text-secondary)",
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}

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
  const gateCount = PIPELINE_PHASES.filter((p) => p.isGate).length;
  const autonomousCount = PIPELINE_PHASES.filter((p) => !p.isGate).length;

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
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--accent)",
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            marginBottom: 12,
          }}
        >
          APEX Framework
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
        <PipelineFlow />
      </section>

      {/* ── 3-Gate model ── */}
      <section
        aria-labelledby="gate-model-heading"
        style={{
          marginBottom: 64,
          padding: "36px 32px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent bar */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "var(--accent)",
            borderRadius: "16px 16px 0 0",
          }}
        />

        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: "var(--accent)",
            marginBottom: 8,
          }}
        >
          The 3-Gate Model
        </div>
        <h2
          id="gate-model-heading"
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          You decide three times. APEX decides everything else.
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            marginBottom: 28,
            maxWidth: 640,
          }}
        >
          Most AI tools ask you to approve every step. APEX inverts this. You
          set the direction at three explicit gates — PRD, architecture, and
          final merge. Between gates, APEX works autonomously: building,
          testing, fixing, and documenting. You get the result of 5 agents
          working in parallel without micromanaging a single one.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <GateItem
            phase="Gate 1 — Plan"
            description="You describe what to build. APEX generates a PRD. You approve the spec or request changes before any code is written."
          />
          <GateItem
            phase="Gate 2 — Architecture"
            description="APEX designs the system: stack, schema, API contracts, component tree. You approve the blueprint before builders start."
          />
          <GateItem
            phase="Gate 3 — Ship"
            description="Code is written, tested, and documented. A PR is ready. You review the diff and say 'merge.' That's it."
          />
        </div>
      </section>

      {/* ── Autonomy teaching section ── */}
      <section
        aria-labelledby="autonomy-heading"
        style={{ marginBottom: 64 }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: "var(--text-muted)",
            marginBottom: 8,
          }}
        >
          Between Gates
        </div>
        <h2
          id="autonomy-heading"
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          Autonomous execution, not autopilot
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            marginBottom: 32,
            maxWidth: 640,
          }}
        >
          APEX is autonomous, not blind. Between gates, the system enforces its
          own quality standards — API verification, Design DNA loading, 7-phase
          QA, security scans, accessibility audits. If a quality gate fails,
          APEX auto-fixes and re-runs. You're only interrupted when the system
          genuinely needs a human decision.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              label: "Phase 3 — Decompose",
              detail:
                "The PM agent reads PRD + architecture and breaks the project into phased tasks (P0/P1/P2) with DRI assignments and dependencies. Apple EPM methodology — one owner per task, no ambiguity.",
            },
            {
              label: "Phase 4 — Verify",
              detail:
                "Every external API is verified against live official documentation. No blog posts, no memory. Design DNA recipe loaded for the UI type. Dependencies audited for known CVEs.",
            },
            {
              label: "Phase 5 — Build",
              detail:
                "Builder agents implement tasks in parallel. The Watcher monitors TypeScript errors, lint violations, and build failures in real-time. The Breathing Loop — continuous build-check-fix cycles.",
            },
            {
              label: "Phase 6 — Quality",
              detail:
                "7-phase QA gate: dependencies, code quality, logic, design, performance, security, polish. Auto-fix on failure. Security scan. Accessibility audit. CX review. Nothing ships broken.",
            },
          ].map(({ label, detail }) => (
            <div
              key={label}
              style={{
                padding: "20px 24px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text)",
                  marginBottom: 8,
                }}
              >
                {label}
              </div>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                {detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Simulate placeholder ── */}
      <section
        aria-labelledby="simulate-heading"
        style={{
          padding: "36px 32px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: "var(--text-muted)",
            marginBottom: 8,
          }}
        >
          Coming in Phase 2
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
          12 seconds.
        </p>
        <button
          disabled
          aria-label="Simulate Pipeline — coming soon"
          style={{
            padding: "12px 28px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--bg-surface)",
            color: "var(--text-muted)",
            fontSize: 14,
            fontWeight: 600,
            cursor: "not-allowed",
            opacity: 0.6,
          }}
        >
          Run Pipeline Simulation
        </button>
      </section>
    </div>
  );
}
