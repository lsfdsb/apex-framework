import {
  BookOpen,
  Code2,
  Database,
  FileText,
  GitBranch,
  Heart,
  Key,
  Lock,
  MapPin,
  Palette,
  Play,
  RefreshCw,
  Shield,
  Sparkles,
  Terminal,
  TestTube,
  Workflow,
  Zap,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { PIPELINE_PHASES, AGENT_ROSTER } from "../data/hub-data";
import { LucideIcon } from "../components/hub/LucideIcon";
import { Link } from "../router/Router";

// ── Skill Arsenal Data ────────────────────────────────────────────────────────

type SkillEntry = { name: string; description: string };
type SkillCategory = { label: string; count: number; skills: SkillEntry[] };

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    label: "Planning",
    count: 2,
    skills: [
      { name: "/prd", description: "Generate a Product Requirements Document from a plain-language description" },
      { name: "/architecture", description: "Design the system stack, schema, API contracts, and component tree" },
    ],
  },
  {
    label: "Quality",
    count: 6,
    skills: [
      { name: "/qa", description: "7-phase quality gate — the mandatory blocker before any code ships" },
      { name: "/security", description: "OWASP Top 10 scan, secret detection, auth-flow audit" },
      { name: "/a11y", description: "Accessibility audit — WCAG 2.2 AA compliance check" },
      { name: "/cx-review", description: "Customer experience review of user-facing flows" },
      { name: "/performance", description: "Bundle size, Core Web Vitals, N+1 query detection" },
      { name: "/e2e", description: "End-to-end test generation and execution via Playwright" },
    ],
  },
  {
    label: "Build",
    count: 4,
    skills: [
      { name: "/teams", description: "Spawn and orchestrate the multi-agent builder team" },
      { name: "/dev", description: "Scaffold new projects with the full APEX stack" },
      { name: "/ship", description: "Create PR, update docs, hand off for user approval" },
      { name: "/simplify", description: "Refactor: reduce complexity, remove duplication" },
    ],
  },
  {
    label: "Verification",
    count: 2,
    skills: [
      { name: "/verify-api", description: "Verify external API patterns against live official docs before integration" },
      { name: "/verify-lib", description: "Audit npm packages: publisher, CVEs, bundle size, license" },
    ],
  },
  {
    label: "Integration",
    count: 3,
    skills: [
      { name: "/supabase", description: "Supabase setup: auth, RLS policies, realtime, RAG pipeline" },
      { name: "/cicd", description: "GitHub Actions workflow for lint, test, build, deploy" },
      { name: "/claude-api", description: "Anthropic SDK integration with streaming and rate-limit handling" },
    ],
  },
  {
    label: "Documentation",
    count: 3,
    skills: [
      { name: "/changelog", description: "Generate and update CHANGELOG from git history" },
      { name: "/teach", description: "Explain what was built and why — educational layer" },
      { name: "/about", description: "Display this page — the definitive APEX overview" },
    ],
  },
  {
    label: "Design",
    count: 1,
    skills: [
      { name: "/frontend-design", description: "Extract Design DNA, apply tokens, verify visual compliance" },
    ],
  },
  {
    label: "Review",
    count: 1,
    skills: [
      { name: "/code-review", description: "Deep code review: patterns, tech debt, security posture" },
    ],
  },
];

// ── Hook System Data ───────────────────────────────────────────────────────────

type HookEntry = { event: string; name: string; description: string };
type HookGroup = { label: string; hooks: HookEntry[] };

const HOOK_GROUPS: HookGroup[] = [
  {
    label: "Session Start",
    hooks: [
      { event: "SessionStart", name: "auto-update-check", description: "Check for APEX framework updates and notify if behind" },
      { event: "SessionStart", name: "dna-server-start", description: "Start the Design DNA preview server at localhost:3001" },
      { event: "SessionStart", name: "dev-server-start", description: "Start the project dev server if not already running" },
    ],
  },
  {
    label: "Pre Tool Use",
    hooks: [
      { event: "PreToolUse", name: "verify-api-trigger", description: "Auto-invoke /verify-api when external API imports are detected" },
      { event: "PreToolUse", name: "verify-lib-trigger", description: "Auto-invoke /verify-lib before any npm install runs" },
    ],
  },
  {
    label: "Post Tool Use",
    hooks: [
      { event: "PostToolUse", name: "auto-changelog", description: "Update CHANGELOG automatically after every git commit" },
      { event: "PostToolUse", name: "rag-sync", description: "Sync project knowledge to Supabase RAG after every file edit" },
    ],
  },
  {
    label: "Commit Msg",
    hooks: [
      { event: "CommitMsg", name: "72-char-enforcer", description: "Block commits with subject lines longer than 72 characters" },
    ],
  },
  {
    label: "Other",
    hooks: [
      { event: "PostToolUse", name: "lint-on-save", description: "Run ESLint on changed files after every write" },
      { event: "PostToolUse", name: "type-check", description: "Run TypeScript type-check after component changes" },
      { event: "SessionStart", name: "memory-load", description: "Load agent memory for context-aware behavior" },
      { event: "PostToolUse", name: "secret-scanner", description: "Detect hardcoded secrets in newly written files" },
    ],
  },
];

// ── Design DNA Data ────────────────────────────────────────────────────────────

const DNA_TEMPLATES = [
  "Landing Page", "SaaS Dashboard", "CRM Pipeline", "E-commerce",
  "Blog Layout", "Portfolio", "Social Feed", "LMS Dashboard",
  "Email Template", "Presentation", "Backoffice", "Design System",
  "SVG Patterns", "Animations",
];

const DNA_PALETTES = [
  { name: "startup-mono", accent: "#e0e0e0", bg: "#0a0a0a" },
  { name: "saas-blue", accent: "#4f8ef7", bg: "#0d0f1a" },
  { name: "fintech-teal", accent: "#00b8a9", bg: "#06151a" },
  { name: "editorial-warm", accent: "#c87941", bg: "#1a1410" },
  { name: "creative-warm", accent: "#e07850", bg: "#130e0c" },
];

// ── Tech Stack Data ────────────────────────────────────────────────────────────

type StackEntry = { name: string; version: string; role: string; icon: React.ReactNode };

const TECH_STACK: StackEntry[] = [
  { name: "React", version: "19", role: "UI framework with Server Components", icon: <Code2 size={16} /> },
  { name: "TypeScript", version: "5.7 strict", role: "Zero-tolerance type safety", icon: <FileText size={16} /> },
  { name: "Vite", version: "6", role: "Instant HMR, lightning builds", icon: <Zap size={16} /> },
  { name: "Tailwind CSS", version: "4", role: "Utility-first with design tokens", icon: <Palette size={16} /> },
  { name: "Supabase", version: "latest", role: "RAG, auth, realtime, RLS", icon: <Database size={16} /> },
  { name: "Claude Code", version: "Opus/Sonnet/Haiku", role: "The agent engine — all 7 agents", icon: <Sparkles size={16} /> },
  { name: "Lucide Icons", version: "latest", role: "1000+ consistent SVG icons", icon: <Play size={16} /> },
  { name: "Playwright", version: "latest", role: "End-to-end test suite", icon: <TestTube size={16} /> },
  { name: "GitHub Actions", version: "latest", role: "CI/CD pipeline automation", icon: <GitBranch size={16} /> },
];

// ── Security Model Data ───────────────────────────────────────────────────────

const SECURITY_ITEMS = [
  { icon: <Shield size={16} />, title: "RLS on Every Table", body: "Row Level Security enabled by default. No table ships without policies — enforced by the Supabase skill." },
  { icon: <Key size={16} />, title: "API Key Rotation", body: "verify-api checks key formats against live docs. Old JWT patterns blocked automatically." },
  { icon: <Lock size={16} />, title: "No Secrets in Code", body: "CommitMsg hook scans every commit for hardcoded secrets. Violation = blocked commit." },
  { icon: <CheckCircle size={16} />, title: "Dependency Verification", body: "verify-lib checks CVEs and license before any npm install. Critical vulnerabilities = install blocked." },
  { icon: <AlertTriangle size={16} />, title: "OWASP Top 10 Aware", body: "The /security skill audits injection, auth, IDOR, data exposure, and input validation in every review." },
];

// ── Framework Stats Data ──────────────────────────────────────────────────────

const FRAMEWORK_STATS = [
  { value: "22+", label: "Skills" },
  { value: "7", label: "Agents" },
  { value: "14", label: "Hooks" },
  { value: "7", label: "Pipeline Phases" },
  { value: "14", label: "DNA Templates" },
  { value: "33", label: "Starter Components" },
  { value: "5", label: "Color Palettes" },
  { value: "215+", label: "PRs Merged" },
];

// ── Values Data ───────────────────────────────────────────────────────────────

const VALUES = [
  { icon: <Shield size={20} />, title: "Quality is Non-Negotiable", text: "7-phase QA gate. Security scanning. Accessibility audits. CX reviews. Nothing ships without passing every gate." },
  { icon: <BookOpen size={20} />, title: "The Framework Teaches", text: "Every action explains what and why. Users don't just build — they learn software engineering principles along the way." },
  { icon: <RefreshCw size={20} />, title: "Autonomous by Default", text: "3 user decisions. Everything else is autonomous. Agents coordinate, quality gates auto-fix, documentation writes itself." },
  { icon: <Sparkles size={20} />, title: "Apple-Grade Polish", text: "The last 10% is the other 90%. Truncated text, stale versions, dead references — these are quality failures, not nitpicks." },
] as const;

// ── Apple EPM Principles Data ─────────────────────────────────────────────────

const EPM_PRINCIPLES = [
  { heading: "No Story Points", body: "Concrete tasks with explicit acceptance criteria. Done means all criteria are met — not 'mostly done'." },
  { heading: "DRI Ownership", body: "Every task has one Directly Responsible Individual. One owner, no ambiguity, no diffused accountability." },
  { heading: "Phases, Not Sprints", body: "P0 ships first. P1 follows. P2 is polish. Under pressure, you know exactly what to cut." },
  { heading: "WIP Limits", body: "In-Progress capped at 2. Review capped at 1. Focus beats context-switching every time." },
  { heading: "Quality Gates", body: "Each phase ends at a gate. Gates enforce the standard. Nothing slips through by accident." },
];

// ── Model Badge ───────────────────────────────────────────────────────────────

function ModelBadge({ model }: { model: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    opus: { bg: "color-mix(in srgb, var(--accent) 18%, transparent)", text: "var(--accent)" },
    sonnet: { bg: "color-mix(in srgb, var(--text-muted) 12%, transparent)", text: "var(--text-muted)" },
    haiku: { bg: "color-mix(in srgb, var(--text-muted) 8%, transparent)", text: "var(--text-muted)" },
  };
  const style = colors[model] ?? colors.sonnet;
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 20,
      background: style.bg,
      color: style.text,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontFamily: "var(--font-mono, monospace)",
    }}>
      {model}
    </span>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
        {label}
      </div>
      <h2 style={{
        fontFamily: "var(--font-display)", fontStyle: "italic",
        fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 400,
        color: "var(--text)", letterSpacing: "-0.02em",
        lineHeight: 1.15, marginBottom: subtitle ? 12 : 0,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 580 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Phase Timeline Card ───────────────────────────────────────────────────────

function PhaseCard({ phase, index }: { phase: (typeof PIPELINE_PHASES)[number]; index: number }) {
  const num = String(phase.id).padStart(2, "0");

  return (
    <div style={{ display: "flex", gap: 0, position: "relative" }}>
      {/* Timeline column */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 56, flexShrink: 0 }}>
        <div
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: phase.isGate ? "var(--accent)" : "var(--bg-elevated)",
            border: `2px solid ${phase.isGate ? "var(--accent)" : "var(--border)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: phase.isGate ? "var(--bg)" : "var(--accent)",
            flexShrink: 0, zIndex: 1, position: "relative",
          }}
          aria-hidden="true"
        >
          <LucideIcon name={phase.icon} size={18} />
        </div>
        {index < PIPELINE_PHASES.length - 1 && (
          <div aria-hidden="true" style={{ flex: 1, width: 2, borderLeft: "2px dashed var(--border)", marginTop: 4, minHeight: 40 }} />
        )}
      </div>

      {/* Card content */}
      <div style={{
        flex: 1, marginLeft: 20,
        marginBottom: index < PIPELINE_PHASES.length - 1 ? 24 : 0,
        background: "var(--bg-elevated)",
        border: phase.isGate ? "1px solid var(--accent)" : "1px solid var(--border)",
        borderLeft: phase.isGate ? "3px solid var(--accent)" : "1px solid var(--border)",
        borderRadius: 14, padding: "24px 24px 20px",
        position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden="true" style={{
          position: "absolute", top: -8, right: 16,
          fontSize: 72, fontWeight: 900, color: "var(--accent)", opacity: 0.06,
          lineHeight: 1, fontFamily: "var(--font-display)", userSelect: "none",
        }}>
          {num}
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--accent)", letterSpacing: "0.06em", fontVariantNumeric: "tabular-nums" }}>
            {num}
          </span>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.2, fontFamily: "var(--font-display)", fontStyle: "italic", margin: 0 }}>
            {phase.name}
          </h3>
          {phase.isGate && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "2px 8px", borderRadius: 20,
              background: "var(--accent-glow, color-mix(in srgb, var(--accent) 15%, transparent))",
              border: "1px solid var(--accent)", color: "var(--accent)",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginLeft: 4,
            }}>
              <Lock size={10} />
              Gate
            </span>
          )}
        </div>

        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
          {phase.description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {phase.agents.map((agent) => (
            <span key={agent} style={{
              padding: "3px 10px", borderRadius: 20,
              background: "var(--bg-surface, var(--bg))", border: "1px solid var(--border)",
              color: "var(--text-secondary)", fontSize: 12, fontWeight: 600,
            }}>
              {agent}
            </span>
          ))}
          {phase.skills.map((skill) => (
            <span key={skill} style={{
              padding: "3px 10px", borderRadius: 20,
              background: "transparent", border: "1px solid var(--border)",
              color: "var(--text-muted)", fontSize: 11,
              fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.02em",
            }}>
              {skill}
            </span>
          ))}
        </div>

        <p style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6,
          margin: 0, paddingTop: 14, borderTop: "1px solid var(--border)",
        }}>
          "{phase.teachingPoint}"
        </p>
      </div>
    </div>
  );
}

// ── Agent Card ────────────────────────────────────────────────────────────────

function AgentCard({ agent }: { agent: (typeof AGENT_ROSTER)[number] }) {
  return (
    <div style={{
      background: "var(--bg-elevated)", border: "1px solid var(--border)",
      borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      <div style={{ height: 3, background: "var(--accent)" }} />
      <div style={{ padding: "24px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
        {/* Icon + name + model */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "color-mix(in srgb, var(--accent) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--accent)", flexShrink: 0,
          }}>
            <LucideIcon name={agent.icon} size={18} />
          </div>
          <ModelBadge model={agent.model} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
            {agent.name}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            {agent.role}
          </div>
        </div>

        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
          {agent.tagline}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {agent.responsibilities.map((r) => (
            <span key={r} style={{
              padding: "2px 8px", borderRadius: 20,
              background: "var(--bg-surface, var(--bg))", border: "1px solid var(--border)",
              color: "var(--text-muted)", fontSize: 11, fontWeight: 500,
            }}>
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px", minHeight: "calc(100vh - 120px)" }}>

      {/* ── 1. Hero ── */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
          The Story
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1.1 }}>
          About APEX Framework
        </h1>
        <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 560 }}>
          Agent-Powered EXcellence for Claude Code. A complete framework that turns "build me X" into shipped, tested, documented software.
        </p>
      </div>

      {/* ── 2. Origin Story ── */}
      <div style={{
        background: "var(--bg-elevated)", border: "1px solid var(--border)",
        borderRadius: 16, padding: "32px 28px", marginBottom: 56,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: "var(--text-muted)", fontSize: 13 }}>
          <MapPin size={14} />
          São Paulo, Brazil · 2026
        </div>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
          APEX started as a question: <em style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>"What if AI didn't just write code — but built software the way Apple builds products?"</em>
        </p>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
          Product vision like Jobs. Design like Ive. Code like Torvalds and Dean. Security like Ionescu and Rutkowska. Business like Amodei. Experience like Disney.
        </p>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8 }}>
          Built by <strong style={{ color: "var(--text)" }}>Bueno & Claude</strong>, APEX is a complete framework for Claude Code that enforces quality at every step — from PRD to production. 22 skills, 7 specialized agents, 14 hooks, and a 7-phase autonomous pipeline.
        </p>
      </div>

      {/* ── 3. The Two Apps ── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHeader
          label="The Products"
          title="The Two Apps"
          subtitle="APEX ships two complementary tools. One keeps you in command of every build. The other guarantees every screen looks world-class."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {/* OPS card */}
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ height: 3, background: "var(--accent)" }} />
            <div style={{ padding: "28px 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent)", flexShrink: 0,
                }}>
                  <Workflow size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                    <span style={{ fontWeight: 800 }}>APEX</span>{" "}<span style={{ fontWeight: 400 }}>OPS</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>The Command Center</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20 }}>
                A project management dashboard built into the framework. See what's being built, who's building it, and where it stands — all in real time.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                {["Projects with sub-projects, phases, and DRI ownership", "Apple EPM Kanban — WIP-limited, gate-enforced", "Live agent tracking — tasks move as agents work", "No manual updates — live sync by default"].map((item) => (
                  <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: 7 }} />
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: "auto" }}>
                <Link to="/projects" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--accent)", textDecoration: "none", letterSpacing: "0.01em" }}>
                  Explore OPS <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>&#8594;</span>
                </Link>
              </div>
            </div>
          </div>

          {/* DNA card */}
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ height: 3, background: "var(--accent)" }} />
            <div style={{ padding: "28px 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent)", flexShrink: 0,
                }}>
                  <Palette size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                    <span style={{ fontWeight: 800 }}>APEX</span>{" "}<span style={{ fontWeight: 400 }}>DNA</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 2 }}>The Design System</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20 }}>
                14 premium UI templates and 33 starter components. Every app built with APEX inherits world-class design automatically — builders write only business logic.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                {["14 template types: Landing, SaaS, CRM, Blog, Portfolio, and 9 more", "33 starter components — promote to src/components/ and customize", "Design tokens: palette, typography, spacing, motion", "Builders read the DNA recipe, copy starters, ship fast"].map((item) => (
                  <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: 7 }} />
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: "auto" }}>
                <Link to="/dna" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--accent)", textDecoration: "none", letterSpacing: "0.01em" }}>
                  Explore DNA <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>&#8594;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. The 7-Phase Pipeline ── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHeader
          label="How it works"
          title="The 7-Phase Pipeline"
          subtitle="From idea to production — autonomously. You make 3 decisions at gate phases. APEX handles everything between them."
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {PIPELINE_PHASES.map((phase, index) => (
            <PhaseCard key={phase.id} phase={phase} index={index} />
          ))}
        </div>
      </div>

      {/* ── 5. Agent Roster ── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHeader
          label="The Team"
          title="The Agent Roster"
          subtitle="7 specialized agents, each with a clear role. No ambiguity — every task has one DRI."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {AGENT_ROSTER.map((agent) => (
            <AgentCard key={agent.name} agent={agent} />
          ))}
        </div>
      </div>

      {/* ── 6. Skills Arsenal ── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHeader
          label="Capabilities"
          title="Skills Arsenal"
          subtitle="22+ skills invoked automatically by the pipeline — or on-demand via slash commands."
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {SKILL_CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {cat.label}
                </span>
                <span style={{
                  padding: "1px 7px", borderRadius: 20,
                  background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                  color: "var(--accent)", fontSize: 11, fontWeight: 700,
                }}>
                  {cat.count}
                </span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
                {cat.skills.map((skill) => (
                  <div key={skill.name} style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "12px 16px", borderRadius: 10,
                    background: "var(--bg-elevated)", border: "1px solid var(--border)",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-mono, monospace)", fontSize: 12, fontWeight: 600,
                      color: "var(--accent)", whiteSpace: "nowrap", flexShrink: 0, paddingTop: 1,
                    }}>
                      {skill.name}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                      {skill.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. Hook System ── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHeader
          label="Automation"
          title="The Hook System"
          subtitle="14 hooks that run automatically — quality without thinking about it."
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {HOOK_GROUPS.map((group) => (
            <div key={group.label} style={{
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              borderRadius: 14, overflow: "hidden",
            }}>
              <div style={{
                padding: "10px 16px",
                background: "color-mix(in srgb, var(--accent) 6%, transparent)",
                borderBottom: "1px solid var(--border)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <Terminal size={13} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", letterSpacing: "0.04em" }}>
                  {group.label}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {group.hooks.map((hook, idx) => (
                  <div key={hook.name} style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "12px 16px",
                    borderTop: idx > 0 ? "1px solid var(--border)" : "none",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-mono, monospace)", fontSize: 11, fontWeight: 600,
                      color: "var(--accent)", whiteSpace: "nowrap", flexShrink: 0,
                      background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                      padding: "2px 6px", borderRadius: 4, marginTop: 1,
                    }}>
                      {hook.name}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      {hook.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8. Design DNA ── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHeader
          label="Visual Quality"
          title="Design DNA"
          subtitle="The visual quality system. Every screen verified against spec before shipping."
        />

        {/* Templates grid */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
            14 Template Types
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {DNA_TEMPLATES.map((t) => (
              <span key={t} style={{
                padding: "4px 12px", borderRadius: 20,
                background: "var(--bg-elevated)", border: "1px solid var(--border)",
                fontSize: 13, color: "var(--text-secondary)", fontWeight: 500,
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Palettes */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
            5 Color Palettes
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {DNA_PALETTES.map((p) => (
              <div key={p.name} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 12px 6px 8px", borderRadius: 10,
                background: "var(--bg-elevated)", border: "1px solid var(--border)",
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6,
                  background: p.accent, flexShrink: 0,
                  boxShadow: `0 0 0 1px color-mix(in srgb, ${p.accent} 30%, transparent)`,
                }} />
                <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Design tokens */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12,
        }}>
          {[
            { label: "Display Font", value: "Instrument Serif" },
            { label: "Body Font", value: "Inter" },
            { label: "Mono Font", value: "JetBrains Mono" },
            { label: "Motion Curve", value: "cubic-bezier(0.22, 1, 0.36, 1)" },
            { label: "Border Radius", value: "12–16px cards" },
            { label: "Starter Components", value: "33 ready to promote" },
          ].map((token) => (
            <div key={token.label} style={{
              padding: "14px 16px", borderRadius: 10,
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
            }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                {token.label}
              </div>
              <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600, fontFamily: "var(--font-mono, monospace)" }}>
                {token.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 9. Tech Stack ── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHeader
          label="Foundation"
          title="The Tech Stack"
          subtitle="Modern, proven tools. No legacy cruft — every dependency verified before install."
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          {TECH_STACK.map((tech, idx) => (
            <div key={tech.name} style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "14px 20px",
              borderTop: idx > 0 ? "1px solid var(--border)" : "none",
              background: "var(--bg-elevated)",
            }}>
              <div style={{ color: "var(--accent)", flexShrink: 0, display: "flex" }}>{tech.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{tech.name}</span>
                  <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>{tech.version}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{tech.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 10. Security Model ── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHeader
          label="Trust Model"
          title="Security by Default"
          subtitle="Security is not a phase — it's architecture. Every layer is hardened from the start."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {SECURITY_ITEMS.map((item) => (
            <div key={item.title} style={{
              display: "flex", alignItems: "flex-start", gap: 14,
              padding: "18px 16px", borderRadius: 12,
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
            }}>
              <div style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1, display: "flex" }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{item.title}</div>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 11. Apple EPM Methodology ── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHeader
          label="Methodology"
          title="Apple EPM"
          subtitle="Engineering Project Management — the discipline that keeps APEX teams moving without letting quality slip. No sprints, no story points, no ambiguity."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {EPM_PRINCIPLES.map(({ heading, body }) => (
            <div key={heading} style={{
              padding: "20px", background: "var(--bg-elevated)",
              border: "1px solid var(--border)", borderRadius: 12,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>
                {heading}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 12. Values / The Creed ── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHeader label="Values" title="What we believe" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 40 }}>
          {VALUES.map((v) => (
            <div key={v.title} style={{
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              borderRadius: 12, padding: "24px 20px",
            }}>
              <div style={{ color: "var(--accent)", marginBottom: 12, display: "flex" }}>{v.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 8, fontFamily: "var(--font-body)" }}>
                {v.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{v.text}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", padding: "32px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18, color: "var(--text-muted)", lineHeight: 1.8, maxWidth: 500, margin: "0 auto 12px" }}>
            "Never ship untested code. Never skip the PRD. Never break the build. Weapons are part of my religion."
          </p>
          <p style={{ fontSize: 12, color: "var(--accent)", letterSpacing: "0.06em", fontWeight: 600 }}>
            This is the Way.
          </p>
        </div>
      </div>

      {/* ── 13. By the Numbers ── */}
      <div style={{ marginBottom: 56 }}>
        <SectionHeader
          label="At a Glance"
          title="By the Numbers"
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
          {FRAMEWORK_STATS.map((stat) => (
            <div key={stat.label} style={{
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              borderRadius: 14, padding: "20px 16px", textAlign: "center",
              overflow: "hidden", position: "relative",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: "var(--accent)",
              }} />
              <div style={{
                fontSize: 32, fontWeight: 800, color: "var(--accent)",
                fontFamily: "var(--font-display)", letterSpacing: "-0.03em", lineHeight: 1,
                marginBottom: 6,
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, lineHeight: 1.3 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 14. Footer ── */}
      <div style={{ textAlign: "center", paddingTop: 24, borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: 13 }}>
          <Heart size={14} style={{ color: "var(--destructive)" }} />
          Forged by Bueno & Claude · São Paulo · 2026
        </div>
      </div>

    </div>
  );
}
