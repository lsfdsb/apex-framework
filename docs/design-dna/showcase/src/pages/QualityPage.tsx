import { useState } from "react";
import { Shield, ChevronDown, CheckCircle2 } from "lucide-react";
import { QA_GATES, ADDITIONAL_GATES } from "../data/hub-quality";
import type { QualityGateDefinition } from "../data/hub-types";

// ── Gate Card ─────────────────────────────────────────────────────────────────

interface GateCardProps {
  gate: QualityGateDefinition;
  index: number;
}

function GateCard({ gate, index }: GateCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.2s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Card header */}
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "18px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Phase number */}
        <span
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "var(--accent-glow)",
            border: "1px solid var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--accent)",
          }}
          aria-hidden="true"
        >
          {index + 1}
        </span>

        {/* Gate name + description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 3,
            }}
          >
            {gate.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              lineHeight: 1.4,
            }}
          >
            {gate.description}
          </div>
        </div>

        {/* Check count pill */}
        <span
          style={{
            flexShrink: 0,
            fontSize: 10,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "var(--radius-full)",
            background: "var(--bg-surface)",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            whiteSpace: "nowrap",
          }}
        >
          {gate.checks.length} checks
        </span>

        {/* Chevron */}
        <ChevronDown
          size={14}
          color="var(--text-muted)"
          aria-hidden="true"
          style={{
            flexShrink: 0,
            transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "20px 20px 24px",
          }}
        >
          {/* Teaching point */}
          <div
            style={{
              padding: "14px 16px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--accent)",
              borderRadius: "0 8px 8px 0",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 6,
              }}
            >
              Why this matters
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {gate.teachingPoint}
            </p>
          </div>

          {/* Checklist */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {gate.checks.map((check) => (
              <div
                key={check}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <CheckCircle2
                  size={14}
                  color="var(--success)"
                  aria-hidden="true"
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {check}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Additional Gate Pill ───────────────────────────────────────────────────────

interface AdditionalGatePillProps {
  name: string;
  icon: string;
  description: string;
  teachingPoint: string;
}

function AdditionalGatePill({ name, icon, description, teachingPoint }: AdditionalGatePillProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        padding: "20px 24px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        flex: "1 1 260px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 20, lineHeight: 1 }} aria-hidden="true">
          {icon}
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--text)",
          }}
        >
          {name}
        </span>
      </div>
      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.5,
          margin: "0 0 12px",
        }}
      >
        {description}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 12,
          color: "var(--accent)",
          fontWeight: 600,
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
        aria-expanded={expanded}
      >
        {expanded ? "Hide" : "Why this matters"}
        <ChevronDown
          size={12}
          aria-hidden="true"
          style={{
            transition: "transform 0.2s",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {expanded && (
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            margin: "12px 0 0",
            paddingTop: 12,
            borderTop: "1px solid var(--border)",
          }}
        >
          {teachingPoint}
        </p>
      )}
    </div>
  );
}

// ── Quality Score Display ──────────────────────────────────────────────────────

function QualityScore() {
  return (
    <div
      style={{
        padding: "32px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent bar */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "var(--success)",
          borderRadius: "16px 16px 0 0",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <Shield size={20} color="var(--success)" aria-hidden="true" />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--success)",
          }}
        >
          Quality Score
        </span>
      </div>

      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: "var(--text)",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginBottom: 8,
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
        }}
      >
        94
        <span
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: "var(--text-muted)",
            verticalAlign: "super",
            letterSpacing: 0,
          }}
        >
          /100
        </span>
      </div>

      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          margin: "0 auto",
          maxWidth: 320,
          lineHeight: 1.5,
        }}
      >
        All 7 phases passed. Security and accessibility gates cleared. Ready to
        ship.
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function QualityPage() {
  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "48px 24px 80px",
      }}
    >
      {/* ── Page header ── */}
      <div style={{ marginBottom: 48 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--accent)",
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            marginBottom: 12,
          }}
        >
          Quality Assurance
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
        <QualityScore />
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {QA_GATES.map((gate, i) => (
            <GateCard key={gate.name} gate={gate} index={i} />
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

        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
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
