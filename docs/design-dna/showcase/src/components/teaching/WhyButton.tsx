import { useState, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface WhyButtonProps {
  question: string;
  answer: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function WhyButton({ question, answer }: WhyButtonProps) {
  const [open, setOpen] = useState(false);
  const panelId = `why-panel-${question.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`;

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Why: ${question}`}
        title={question}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: "1.5px solid var(--accent)",
          background: open ? "var(--accent-glow)" : "transparent",
          color: "var(--accent)",
          fontSize: 11,
          fontWeight: 700,
          cursor: "pointer",
          padding: 0,
          lineHeight: 1,
          transition: "background 200ms ease, transform 200ms ease",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-glow)";
        }}
        onMouseLeave={(e) => {
          if (!open) {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }
        }}
      >
        ?
      </button>

      {/* Explanation panel */}
      {open && (
        <span
          id={panelId}
          role="region"
          aria-label={question}
          style={{
            display: "block",
            padding: "10px 14px",
            borderLeft: "2px solid var(--accent)",
            background: "var(--bg-elevated)",
            borderRadius: "0 6px 6px 0",
            fontSize: 13,
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            maxWidth: 320,
            animation: "teaching-fade-in 200ms ease forwards",
          }}
        >
          {answer}
        </span>
      )}

      <style>{`
        @keyframes teaching-fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </span>
  );
}
