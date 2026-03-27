import { GitCommit, Tag } from "lucide-react";

const RELEASES = [
  {
    version: "5.23.0",
    date: "2026-03-25",
    title: "The Honest Audit",
    changes: [
      { type: "feat", text: "Apple EPM honest alignment — document what we implement vs. what Apple does" },
      { type: "feat", text: "ANPP separated from Rules of the Road — two distinct Apple documents" },
      { type: "feat", text: "Seven Elements as real exit criteria in QA, not decorative labels" },
      { type: "feat", text: "3→1 design exploration (honest adaptation of Apple's 10→3→1)" },
      { type: "feat", text: "Builder quality-during-build + demo-first protocol" },
      { type: "feat", text: "Tech Writer owns Rules of the Road (launch checklist) in Phase 7" },
      { type: "feat", text: "DRI decision ownership — DRI owns decisions, not just task execution" },
      { type: "feat", text: "Paired design review — brainstorm pass + production pass" },
      { type: "changed", text: "CLAUDE.md Apple EPM section with honest alignment tables" },
      { type: "changed", text: "Pipeline phases mapped to Apple analogs (EVT/DVT/PVT)" },
      { type: "changed", text: "PM ANPP template uses Apple milestone terminology (M0-M3)" },
      { type: "fix", text: "Removed dead health-check.sh refs from README, CONTRIBUTING, watcher" },
      { type: "fix", text: "Fixed stale 'plain HTML/CSS' reference in builder (templates are React)" },
      { type: "fix", text: "Memory cleanup — deleted 3 stale files, updated index" },
    ],
  },
  {
    version: "5.22.0",
    date: "2026-03-25",
    title: "The Apple Release",
    changes: [
      { type: "feat", text: "Project Manager Agent — Apple EPM methodology (Kanban + DRI + Milestones)" },
      { type: "feat", text: "7-phase autonomous pipeline with Decompose phase and 3 user gates" },
      { type: "feat", text: "Visual Pipeline HUB — command center dashboard (#203)" },
      { type: "feat", text: "SubagentStart, PreCompact, PostCompact hooks" },
      { type: "feat", text: "Builder API Verification Protocol" },
      { type: "feat", text: "Session log rotation (keep last 10)" },
      { type: "changed", text: "Builder maxTurns 40 → 50" },
      { type: "changed", text: "Watcher labels: emoji → text ([CLEAN], [WARNINGS], [CRITICAL])" },
      { type: "changed", text: "CLAUDE.md reorganized: Principles / Practices / Lessons from the Forge" },
      { type: "changed", text: "Rebranded L.B. → Bueno across 36 files" },
      { type: "changed", text: "GitHub Actions v4 → v6, Node.js 20 → 22 LTS" },
      { type: "fix", text: "health-check.sh CI failure (removed erroneous set -e)" },
      { type: "fix", text: "APEX logo alignment in output style" },
      { type: "fix", text: "README stale counts (14 hooks/12 groups, 33 starters, 39 templates)" },
    ],
  },
  {
    version: "5.21.0",
    date: "2026-03-24",
    title: "Quality Gates & Safe Processes",
    changes: [
      { type: "feat", text: "81 Apple-audit fixes across the framework" },
      { type: "feat", text: "Dynamic hook/agent/skill counts in README" },
      { type: "feat", text: "Portable shell scripts (macOS + Linux)" },
      { type: "changed", text: "Batch-reads-before-edits rule added to output style" },
    ],
  },
  {
    version: "5.20.0",
    date: "2026-03-23",
    title: "Production Readiness",
    changes: [
      { type: "feat", text: "41 files: hooks complete, Oscar animations, DnaBackground" },
      { type: "feat", text: "E2E + performance test framework" },
      { type: "feat", text: "Design DNA Oscar — 10 animation keyframes, 5 new primitives" },
    ],
  },
] as const;

const TYPE_STYLES: Record<string, { bg: string; label: string }> = {
  feat: { bg: "var(--accent)", label: "NEW" },
  changed: { bg: "var(--warning)", label: "CHANGED" },
  fix: { bg: "var(--success)", label: "FIXED" },
};

export default function ChangelogPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px", minHeight: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
          APEX Framework
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 36, fontWeight: 400, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 12 }}>
          Changelog
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Every release, every fix, every improvement — documented.
        </p>
      </div>

      {/* Releases */}
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {RELEASES.map((release) => (
          <div key={release.version} style={{ position: "relative" }}>
            {/* Version header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "var(--accent)", color: "var(--bg)",
                padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700,
              }}>
                <Tag size={12} />
                v{release.version}
              </div>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{release.date}</span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>{release.title}</span>
            </div>

            {/* Changes */}
            <div style={{
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              borderRadius: 12, padding: "16px 20px",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              {release.changes.map((change, i) => {
                const style = TYPE_STYLES[change.type] ?? { bg: "var(--text-muted)", label: change.type.toUpperCase() };
                return (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em",
                      padding: "2px 6px", borderRadius: 4, background: style.bg, color: "var(--bg)",
                      flexShrink: 0, marginTop: 2,
                    }}>
                      {style.label}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      {change.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 48, color: "var(--text-muted)", fontSize: 13 }}>
        <GitCommit size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
        Full history on <a href="https://github.com/lsfdsb/apex-framework" style={{ color: "var(--accent)", textDecoration: "none" }}>GitHub</a>
      </div>
    </div>
  );
}
