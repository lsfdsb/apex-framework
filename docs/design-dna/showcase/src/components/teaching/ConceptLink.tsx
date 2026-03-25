import type { ReactNode } from "react";
import { TeachingTooltip } from "./TeachingTooltip";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ConceptLinkProps {
  term: string;
  definition: string;
  children: ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ConceptLink({ term, definition, children }: ConceptLinkProps) {
  return (
    <TeachingTooltip content={definition}>
      <span
        role="term"
        aria-label={`${term}: ${definition}`}
        tabIndex={0}
        style={{
          textDecoration: "underline",
          textDecorationStyle: "dashed",
          textDecorationColor: "var(--accent)",
          textUnderlineOffset: 3,
          cursor: "help",
          color: "inherit",
          display: "inline",
        }}
      >
        {children}
      </span>
    </TeachingTooltip>
  );
}
