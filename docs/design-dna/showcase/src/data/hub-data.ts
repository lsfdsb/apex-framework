/**
 * APEX Visual Pipeline HUB — Static Data
 * Pipeline phases and agent roster definitions.
 */

import type { PipelinePhaseDefinition, AgentDefinition } from "./hub-types";

// ── 7-Phase Pipeline ───────────────────────────────────────────────────────────

export const PIPELINE_PHASES: PipelinePhaseDefinition[] = [
  {
    id: 1,
    name: "Plan",
    description: "PRD generated from the user's description. The contract is sacred.",
    icon: "clipboard-list",
    isGate: true,
    agents: ["Lead"],
    skills: ["/prd"],
    teachingPoint: "Every great product starts with a spec. A PRD forces you to think about what you're building and why — before writing a single line of code.",
    simulationDuration: 2000,
  },
  {
    id: 2,
    name: "Architect",
    description: "System design: stack, schema, API contracts, component tree.",
    icon: "building",
    isGate: true,
    agents: ["Lead"],
    skills: ["/architecture"],
    teachingPoint: "Architecture is the skeleton of your app. Get it wrong and every feature fights the structure. Get it right and features fall into place.",
    simulationDuration: 2000,
  },
  {
    id: 3,
    name: "Decompose",
    description: "PM agent breaks the plan into phased tasks with DRI assignments.",
    icon: "kanban",
    isGate: false,
    agents: ["PM"],
    skills: ["/teams"],
    teachingPoint: "Apple's EPM methodology: no story points, no sprints. Concrete tasks with acceptance criteria, a single DRI (Directly Responsible Individual), and phased delivery — P0 ships first.",
    simulationDuration: 1500,
  },
  {
    id: 4,
    name: "Verify",
    description: "External APIs verified against live docs. Design DNA recipe loaded.",
    icon: "search-check",
    isGate: false,
    agents: ["Lead"],
    skills: ["/verify-api", "/verify-lib"],
    teachingPoint: "APIs change. SDKs deprecate keys. Blog posts go stale. APEX verifies every external dependency against live official documentation before a single integration line is written.",
    simulationDuration: 1000,
  },
  {
    id: 5,
    name: "Build",
    description: "Builders implement tasks. Watcher monitors. The Breathing Loop runs.",
    icon: "hammer",
    isGate: false,
    agents: ["Builder", "Watcher"],
    skills: ["/teams"],
    teachingPoint: "Multi-agent building means specialization. The Builder writes code. The Watcher catches errors in real-time. They form a continuous feedback loop — the Breathing Loop.",
    simulationDuration: 3000,
  },
  {
    id: 6,
    name: "Quality",
    description: "7-phase QA gate. Security scan. Accessibility audit. CX review.",
    icon: "shield-check",
    isGate: false,
    agents: ["QA", "Lead"],
    skills: ["/qa", "/security", "/a11y", "/cx-review"],
    teachingPoint: "Quality is not a phase you bolt on at the end — it's 7 phases of verification. Dependencies, code quality, logic, design, performance, security, and polish. If any gate fails, auto-fix and re-run.",
    simulationDuration: 2000,
  },
  {
    id: 7,
    name: "Ship",
    description: "Docs updated. PR created. User approves the merge.",
    icon: "rocket",
    isGate: true,
    agents: ["Technical Writer", "Lead"],
    skills: ["/ship", "/changelog"],
    teachingPoint: "Shipping is not pushing code — it's a ceremony. The Technical Writer updates CHANGELOG and README. A PR is created with full context. The user reviews and says 'merge.' Only then does it ship.",
    simulationDuration: 1500,
  },
];

// ── Agent Roster ───────────────────────────────────────────────────────────────

export const AGENT_ROSTER: AgentDefinition[] = [
  {
    name: "Lead",
    role: "Orchestrator",
    model: "opus",
    icon: "crown",
    tagline: "The architect. Orchestrates the team, makes final calls.",
    teachingPoint: "Every team needs a decision-maker. The Lead sees the full picture — PRD, architecture, code, and quality. They delegate work but own the outcome.",
    responsibilities: ["Architecture decisions", "Gate approvals", "Team coordination", "Final review"],
  },
  {
    name: "PM",
    role: "Project Manager",
    model: "sonnet",
    icon: "clipboard-list",
    tagline: "The Tim Cook. Turns vision into executable tasks.",
    teachingPoint: "Planning is not overhead — it's leverage. A PM who decomposes well means builders never wonder what to do next. Apple's DRI model ensures every task has one owner.",
    responsibilities: ["Task decomposition", "DRI assignment", "Dependency mapping", "Phase gating"],
  },
  {
    name: "Builder",
    role: "Implementation",
    model: "sonnet",
    icon: "hammer",
    tagline: "The craftsman. Writes the code, respects the architecture.",
    teachingPoint: "Great builders don't just make things work — they make things right. They follow the architecture, verify APIs before integrating, and write code that the next person can read.",
    responsibilities: ["Feature implementation", "API integration", "Component creation", "Bug fixes"],
  },
  {
    name: "QA",
    role: "Quality Assurance",
    model: "sonnet",
    icon: "shield-check",
    tagline: "The Steve Kerr. Nothing ships without approval.",
    teachingPoint: "QA is not finding bugs — it's preventing them from reaching users. The 7-phase gate catches issues in dependencies, code quality, logic, design, performance, security, and polish.",
    responsibilities: ["7-phase quality gate", "Security scanning", "Accessibility audit", "Performance benchmarks"],
  },
  {
    name: "Watcher",
    role: "Monitor",
    model: "haiku",
    icon: "eye",
    tagline: "The sentinel. Catches errors before they compound.",
    teachingPoint: "Continuous monitoring is cheaper than debugging. The Watcher runs in the background, catching TypeScript errors, lint violations, and build failures the moment they appear — before they cascade.",
    responsibilities: ["Error detection", "Build monitoring", "Lint watching", "Type checking"],
  },
  {
    name: "Technical Writer",
    role: "Documentation",
    model: "haiku",
    icon: "pen-tool",
    tagline: "The chronicler. Every change documented, every decision recorded.",
    teachingPoint: "Documentation is not an afterthought — it's architecture that humans read. The Technical Writer owns CHANGELOG, README, and PRD status. Nothing ships undocumented.",
    responsibilities: ["CHANGELOG ownership", "README updates", "PRD status tracking", "API documentation"],
  },
  {
    name: "Design Reviewer",
    role: "Design Compliance",
    model: "sonnet",
    icon: "palette",
    tagline: "The Jony Ive. DNA compliance — no generic AI UI ships.",
    teachingPoint: "Design review is not subjective. The DNA template is the spec. Font sizes within ±1px, padding within ±2px, same border radius, same transition curves. If it doesn't match, it doesn't ship.",
    responsibilities: ["DNA extraction", "Visual compliance audit", "Palette verification", "Typography check"],
  },
];

// ── Framework Stats ────────────────────────────────────────────────────────────

export const FRAMEWORK_STATS = [
  { label: "Agents", value: 6 },
  { label: "Skills", value: 22 },
  { label: "Hooks", value: 15 },
  { label: "Phases", value: 7 },
  { label: "Templates", value: 14 },
] as const;
