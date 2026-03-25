import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";

// ── QualityScore ───────────────────────────────────────────────────────────────
// Large score display centered in a card with an accent-colored top bar.
// Color coding: green (>90), yellow (70–90), red (<70).

interface QualityScoreProps {
  /** Score 0–100 */
  score: number;
  /** Optional summary line shown beneath the score */
  summary?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

type ScoreTier = "pass" | "warn" | "fail";

function getTier(score: number): ScoreTier {
  if (score > 90) return "pass";
  if (score > 70) return "warn";
  return "fail";
}

const TIER_CONFIG: Record<
  ScoreTier,
  { color: string; label: string; Icon: React.ComponentType<{ size?: number; color?: string; "aria-hidden"?: "true" }> }
> = {
  pass: { color: "var(--success)", label: "All gates passed", Icon: ShieldCheck },
  warn: { color: "var(--warning, #e8a020)", label: "Some gates need attention", Icon: Shield },
  fail: { color: "var(--error, #e05050)", label: "Gates require fixes before shipping", Icon: ShieldAlert },
};

// ── Component ──────────────────────────────────────────────────────────────────

export function QualityScore({ score, summary }: QualityScoreProps) {
  const tier = getTier(score);
  const { color, label, Icon } = TIER_CONFIG[tier];

  const defaultSummary =
    score > 90
      ? "All 7 phases passed. Security and accessibility gates cleared. Ready to ship."
      : score > 70
      ? "Most gates passed. Review flagged items before shipping."
      : "Critical gates failed. Fix issues and re-run before shipping.";

  return (
    <div
      role="region"
      aria-label={`Quality score: ${score} out of 100`}
      style={{
        padding: "32px",
        background: "var(--bg-elevated)",
        border: `1px solid var(--border)`,
        borderRadius: 16,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent bar — color-coded by tier */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: color,
          borderRadius: "16px 16px 0 0",
        }}
      />

      {/* Icon + label row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <Icon size={20} color={color} aria-hidden="true" />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color,
          }}
        >
          Quality Score
        </span>
      </div>

      {/* Score ring */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 160,
          height: 160,
          borderRadius: "50%",
          border: `3px solid ${color}`,
          background: "var(--bg-surface)",
          boxShadow: `0 0 32px ${color}33`,
          marginBottom: 20,
        }}
        aria-hidden="true"
      >
        {/* Large score number */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            lineHeight: 1,
            display: "flex",
            alignItems: "baseline",
            gap: 2,
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.04em",
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: "var(--text-muted)",
              letterSpacing: 0,
              alignSelf: "flex-end",
              paddingBottom: 8,
            }}
          >
            /100
          </span>
        </div>
      </div>

      {/* Tier label */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color,
          marginBottom: 8,
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </div>

      {/* Summary */}
      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          margin: "0 auto",
          maxWidth: 320,
          lineHeight: 1.55,
          fontFamily: "var(--font-body)",
        }}
      >
        {summary ?? defaultSummary}
      </p>
    </div>
  );
}
