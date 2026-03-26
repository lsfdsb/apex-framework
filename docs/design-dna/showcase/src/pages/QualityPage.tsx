/**
 * QualityPage — APEX quality gate dashboard.
 * Shows a score circle, 7 QA phases, and additional gates (security, a11y, CX).
 * Falls back to demo data when no live session is active.
 *
 * Upgrades (T9):
 * - Animated score ring: CSS @keyframes score-fill from 0 to actual score on mount
 * - Color-coded score tiers: green ≥90, yellow ≥70, red <70
 * - Phase timing: shows duration when startedAt + completedAt are present
 * - Running phase shimmer animation on card background
 * - Live vs demo indicator via LiveBadge (already present)
 */

import { useEffect, useRef } from "react";
import { useOps } from "../context/OpsContext";
import { LiveBadge } from "../components/hub/LiveBadge";
import type { GateStatus, AdditionalGateStatus, QualityState } from "../data/hub-types";

// ── Demo data ─────────────────────────────────────────────────────────────────

const DEMO_QUALITY: QualityState = {
  score: 94,
  phases: [
    { name: "Dependencies",    status: "passed",  details: "0 critical CVEs, all packages current" },
    { name: "Code Quality",    status: "passed",  details: "ESLint clean, TypeScript strict, no any" },
    { name: "Logic & Tests",   status: "passed",  details: "All tests pass, 87% coverage" },
    { name: "Design Fidelity", status: "passed",  details: "DNA tokens matched, no hardcoded colors" },
    { name: "Performance",     status: "passed",  details: "LCP 1.2s, bundle +38KB gzip" },
    { name: "Security",        status: "passed",  details: "OWASP Top 10 clean, no secrets exposed" },
    { name: "Polish",          status: "passed",  details: "No truncations, consistent tokens, accessible" },
  ],
  additionalGates: {
    security:      "passed",
    accessibility: "passed",
    cxReview:      "passed",
  },
};

// ── Duration formatter ────────────────────────────────────────────────────────

function formatDuration(startedAt?: string, completedAt?: string): string | null {
  if (!startedAt || !completedAt) return null;
  const start = new Date(startedAt).getTime();
  const end = new Date(completedAt).getTime();
  if (isNaN(start) || isNaN(end) || end < start) return null;
  const ms = end - start;
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  const mins = Math.floor(ms / 60_000);
  const secs = Math.floor((ms % 60_000) / 1000);
  return `${mins}m ${secs}s`;
}

// ── Score circle (SVG arc) — animated on mount ────────────────────────────────

function ScoreCircle({ score }: { score: number }) {
  const r = 54;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;
  const gap = circumference - filled;
  // Arc starts at top (−π/2), offset by circumference/4 so dashoffset positions correctly
  const dashOffset = circumference / 4;
  // Animation target offset: full circumference = empty, dashOffset = fully filled to score
  const targetOffset = circumference - filled + dashOffset;

  const color =
    score >= 90 ? "var(--success, #22c55e)"
    : score >= 70 ? "var(--warning, #f59e0b)"
    : "var(--destructive, #ef4444)";

  // Use a unique animation name per score so re-mounts replay correctly
  const animName = `score-fill-${score}`;

  const arcRef = useRef<SVGCircleElement>(null);

  // Force animation replay when score changes
  useEffect(() => {
    const el = arcRef.current;
    if (!el) return;
    el.style.animation = "none";
    void el.getBoundingClientRect(); // flush
    el.style.animation = `${animName} 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards`;
  }, [score, animName]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <svg
        width={140}
        height={140}
        viewBox="0 0 140 140"
        aria-label={`Quality score: ${score} out of 100`}
        role="img"
      >
        {/* Keyframes injected inline via <style> in parent; arc refs animName */}
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={10}
        />
        {/* Filled arc — animates from empty to score on mount */}
        <circle
          ref={arcRef}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${gap}`}
          strokeDashoffset={circumference + dashOffset}
          style={{
            animation: `${animName} 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
          }}
        />
        {/* Score text */}
        <text
          x={cx}
          y={cy + 6}
          textAnchor="middle"
          fontSize={28}
          fontWeight={700}
          fill={color}
          fontFamily="'JetBrains Mono', monospace"
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          fontSize={11}
          fill="var(--text-muted)"
          fontFamily="system-ui, sans-serif"
          fontWeight={600}
          letterSpacing={2}
        >
          / 100
        </text>
      </svg>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color,
          letterSpacing: "0.04em",
        }}
      >
        {score >= 90 ? "Excellent" : score >= 70 ? "Acceptable" : "Needs Work"}
      </span>
      {/* Dynamic keyframes for this score value */}
      <style>{`
        @keyframes ${animName} {
          from { stroke-dashoffset: ${circumference + dashOffset}; }
          to   { stroke-dashoffset: ${targetOffset}; }
        }
      `}</style>
    </div>
  );
}

// ── Gate status helpers ───────────────────────────────────────────────────────

function gateColor(status: GateStatus): string {
  switch (status) {
    case "passed":  return "var(--success, #22c55e)";
    case "failed":  return "var(--destructive, #ef4444)";
    case "running": return "var(--accent)";
    default:        return "var(--text-muted)";
  }
}

function additionalGateColor(status: AdditionalGateStatus): string {
  switch (status) {
    case "passed":  return "var(--success, #22c55e)";
    case "failed":  return "var(--destructive, #ef4444)";
    case "skipped": return "var(--text-muted)";
    default:        return "var(--warning, #f59e0b)";
  }
}

// ── Phase Gate Card ───────────────────────────────────────────────────────────

function PhaseGateCard({
  name,
  status,
  details,
  index,
  startedAt,
  completedAt,
}: {
  name: string;
  status: GateStatus;
  details?: string;
  index: number;
  startedAt?: string;
  completedAt?: string;
}) {
  const color = gateColor(status);
  const isRunning = status === "running";
  const duration = formatDuration(startedAt, completedAt);

  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: `1px solid ${status === "failed" ? "var(--destructive, #ef4444)" : "var(--border)"}`,
        borderRadius: 12,
        padding: "16px 18px",
        position: "relative",
        overflow: "hidden",
        animation: isRunning ? "gate-shimmer 1.8s ease-in-out infinite" : "none",
      }}
    >
      {/* Left accent */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, bottom: 0,
          width: 3,
          background: color,
          opacity: status === "pending" ? 0.3 : 1,
        }}
      />

      <div style={{ paddingLeft: 12, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-muted)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              P{index + 1}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text)",
              }}
            >
              {name}
            </span>
            {duration && (
              <span
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {duration}
              </span>
            )}
          </div>
          {details && (
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "var(--text-muted)",
                lineHeight: 1.5,
                fontStyle: "italic",
              }}
            >
              {details}
            </p>
          )}
        </div>

        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color,
            background: `${color}18`,
            border: `1px solid ${color}40`,
            borderRadius: 6,
            padding: "3px 10px",
            whiteSpace: "nowrap",
            animation: isRunning ? "livePulse 1.5s ease-in-out infinite" : "none",
          }}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

// ── Additional Gate Pill ──────────────────────────────────────────────────────

function AdditionalGatePill({
  label,
  status,
}: {
  label: string;
  status: AdditionalGateStatus;
}) {
  const color = additionalGateColor(status);

  return (
    <div
      style={{
        flex: "1 1 160px",
        padding: "16px 18px",
        background: "var(--bg-elevated)",
        border: `1px solid ${color}40`,
        borderRadius: 12,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: color,
          margin: "0 auto 10px",
        }}
      />
      <p
        style={{
          margin: "0 0 4px",
          fontSize: 13,
          fontWeight: 700,
          color: "var(--text)",
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color,
        }}
      >
        {status}
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function QualityPage() {
  const { quality: liveQuality, isLive, lastUpdated } = useOps();

  // Use live data if available, otherwise demo
  const quality = isLive && liveQuality.phases.length > 0 ? liveQuality : DEMO_QUALITY;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 64px" }}>
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
            Quality Gates
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
          Seven verification phases modeled after Apple's Seven Elements exit criteria.
          Nothing ships without passing all gates.
        </p>
      </div>

      {/* Score + summary row */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 32,
          flexWrap: "wrap",
          alignItems: "stretch",
        }}
      >
        {/* Score circle card */}
        <div
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "28px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            minWidth: 200,
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Overall Score
          </p>
          <ScoreCircle score={quality.score} />
        </div>

        {/* Summary stats */}
        <div
          style={{
            flex: 1,
            minWidth: 240,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {[
            {
              label: "Passed",
              value: quality.phases.filter((p) => p.status === "passed").length,
              color: "var(--success, #22c55e)",
            },
            {
              label: "Running",
              value: quality.phases.filter((p) => p.status === "running").length,
              color: "var(--accent)",
            },
            {
              label: "Failed",
              value: quality.phases.filter((p) => p.status === "failed").length,
              color: "var(--destructive, #ef4444)",
            },
            {
              label: "Pending",
              value: quality.phases.filter((p) => p.status === "pending").length,
              color: "var(--text-muted)",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "16px 18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: stat.color,
                  fontFamily: "'JetBrains Mono', monospace",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  letterSpacing: "0.04em",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 7 QA phases */}
      <div style={{ marginBottom: 32 }}>
        <p
          style={{
            margin: "0 0 14px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          Seven Verification Phases
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {quality.phases.map((phase, i) => (
            <PhaseGateCard
              key={phase.name}
              name={phase.name}
              status={phase.status}
              details={phase.details}
              index={i}
              startedAt={phase.startedAt}
              completedAt={phase.completedAt}
            />
          ))}
          {quality.phases.length === 0 && (
            <div
              style={{
                padding: "24px",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 14,
                fontStyle: "italic",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: 12,
              }}
            >
              No QA phases recorded yet. Start a build to see results here.
            </div>
          )}
        </div>
      </div>

      {/* Additional gates */}
      <div>
        <p
          style={{
            margin: "0 0 14px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          Additional Gates
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <AdditionalGatePill label="Security" status={quality.additionalGates.security} />
          <AdditionalGatePill label="Accessibility" status={quality.additionalGates.accessibility} />
          <AdditionalGatePill label="CX Review" status={quality.additionalGates.cxReview} />
        </div>
      </div>

      {/* Apple EPM note */}
      <div
        style={{
          marginTop: 40,
          padding: "20px 24px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 12,
        }}
      >
        <p
          style={{
            margin: "0 0 6px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          Apple EPM
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--text-secondary)",
            fontStyle: "italic",
            lineHeight: 1.6,
          }}
        >
          Maps to Apple's Seven Elements exit criteria. At Apple, quality is built into every phase —
          not bolted on at the end. APEX enforces this by running QA as a mandatory gate before any
          task is marked complete. If any phase fails, auto-fix and re-run — never ship around a failure.
        </p>
      </div>

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes gate-shimmer {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
