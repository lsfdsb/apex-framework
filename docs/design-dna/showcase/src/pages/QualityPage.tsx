import { QA_GATES, ADDITIONAL_GATES } from "../data/hub-quality";
import { GatePhase } from "../components/quality/GatePhase";
import { AdditionalGatePill } from "../components/quality/AdditionalGatePill";
import { QualityScore } from "../components/quality/QualityScore";
import { useApexState } from "../hooks/useApexState";
import { LiveBadge } from "../components/hub/LiveBadge";
import type { QualityState } from "../data/hub-types";

const DEFAULT_QUALITY: QualityState = {
  score: 94,
  phases: [],
  additionalGates: {
    security: "pending",
    accessibility: "pending",
    cxReview: "pending",
  },
};

// ── Quality Page ───────────────────────────────────────────────────────────────
// The 7-Phase QA gate — educates users on every quality check APEX runs.

export default function QualityPage() {
  const { data: qualityState, isLive, lastUpdated } = useApexState<QualityState>(
    "quality.json",
    DEFAULT_QUALITY
  );

  // Use live score when connected, otherwise the default demo score
  const displayScore = isLive ? qualityState.score : DEFAULT_QUALITY.score;

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "48px 24px 80px",
        minHeight: "calc(100vh - 120px)",
      }}
    >
      {/* ── Page header ── */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--accent)",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              flex: 1,
            }}
          >
            Quality Assurance
          </div>
          <LiveBadge isLive={isLive} lastUpdated={lastUpdated} />
        </div>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 700,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: 16,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
          }}
        >
          The 7-Phase Gate
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "var(--text-secondary)",
            maxWidth: 600,
            lineHeight: 1.6,
          }}
        >
          Every build runs through 7 quality gates before shipping. Not optional
          — automatic. Gates fail, APEX auto-fixes and re-runs. Nothing ships
          broken.
        </p>
      </div>

      {/* ── Quality Score ── */}
      <div style={{ marginBottom: 48 }}>
        <QualityScore score={displayScore} />
      </div>

      {/* ── 7-Phase Gates ── */}
      <section aria-labelledby="qa-gates-heading" style={{ marginBottom: 56 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "var(--text-muted)",
            marginBottom: 8,
          }}
        >
          The Phases
        </div>
        <h2
          id="qa-gates-heading"
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            marginBottom: 24,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
          }}
        >
          7 gates, every build
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {QA_GATES.map((gate, i) => (
            <GatePhase key={gate.name} gate={gate} index={i} />
          ))}
        </div>
      </section>

      {/* ── Additional Gates ── */}
      <section
        aria-labelledby="additional-gates-heading"
        style={{ marginBottom: 56 }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "var(--text-muted)",
            marginBottom: 8,
          }}
        >
          Additional Gates
        </div>
        <h2
          id="additional-gates-heading"
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            marginBottom: 8,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
          }}
        >
          Context-aware checks
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            marginBottom: 24,
            maxWidth: 580,
          }}
        >
          These gates run when the context warrants it — not on every build, but
          on every build that matters.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {ADDITIONAL_GATES.map((gate) => (
            <AdditionalGatePill
              key={gate.name}
              name={gate.name}
              icon={gate.icon}
              description={gate.description}
              teachingPoint={gate.teachingPoint}
            />
          ))}
        </div>
      </section>

      {/* ── Philosophy callout ── */}
      <section
        aria-labelledby="qa-philosophy-heading"
        style={{
          padding: "32px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
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
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "var(--accent)",
            marginBottom: 8,
          }}
        >
          Philosophy
        </div>
        <h2
          id="qa-philosophy-heading"
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            marginBottom: 12,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
          }}
        >
          QA is a gate, not a suggestion
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            maxWidth: 620,
            margin: 0,
          }}
        >
          Most teams treat QA as the last step before shipping — a checklist you
          run once and hope passes. APEX treats QA as a hard gate. If the gate
          fails, the build does not ship. Period. The system auto-fixes and
          re-runs until all 7 phases pass. You review the output, not the
          process.
        </p>
      </section>
    </div>
  );
}
