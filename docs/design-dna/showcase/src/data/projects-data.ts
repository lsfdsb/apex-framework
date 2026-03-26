/**
 * APEX Projects Page — Static Data & Types
 * All project/sub-project data, types, and pipeline phase definitions
 * that use Lucide icon components (vs. hub-data.ts which uses string icon names).
 */

import {
  CheckCircle2, AlertCircle, Clock, Layers,
  ClipboardList, Building, Kanban, SearchCheck, Hammer,
  ShieldCheck, Rocket, Paintbrush, Bug,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

export type SubProjectStatus = "building" | "shipped" | "paused" | "planned";
export type TeamStage = "design-review" | "build" | "quality" | "security";
export type TaskDRI = "Lead" | "PM" | "Designer" | "Builder" | "Watcher" | "QA" | "Writer";

export interface TeamTask {
  id: string;
  title: string;
  stage: TeamStage;
  dri: TaskDRI;
  done: boolean;
}

export interface SubProject {
  id: string;
  name: string;
  description: string;
  branch: string;
  pr?: string;
  prStatus?: "merged" | "open" | "closed";
  prUrl?: string;
  lastActive: string;
  status: SubProjectStatus;
  currentPhase: number;
  teamTasks: TeamTask[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  collapsed: boolean;
  subProjects: SubProject[];
}

export interface PullRequest {
  number: number;
  title: string;
  status: "merged" | "open" | "closed";
  date: string;
  branch: string;
}

// ── The 7 APEX Pipeline Phases (with Lucide icon components) ──────────────────
// Note: hub-data.ts uses string icon names for the simulation engine.
// This version uses Lucide React components for direct rendering in ProjectsPage.

export const PIPELINE_PHASES = [
  { id: 1, name: "Plan",      icon: ClipboardList, isGate: true,  description: "PRD from user description",            agents: ["Lead"] as const,                    skills: ["/prd"] },
  { id: 2, name: "Architect", icon: Building,      isGate: true,  description: "System design + stack",                agents: ["Lead"] as const,                    skills: ["/architecture", "/verify-api"] },
  { id: 3, name: "Decompose", icon: Kanban,        isGate: false, description: "PM breaks into tasks",                 agents: ["PM"] as const,                      skills: ["/teams"] },
  { id: 4, name: "Verify",    icon: SearchCheck,   isGate: false, description: "APIs + libs + DNA verified",           agents: ["Lead", "Designer"] as const,        skills: ["/verify-api", "/verify-lib", "/design-system"] },
  { id: 5, name: "Build",     icon: Hammer,        isGate: false, description: "Builders implement",                   agents: ["Builder", "Watcher"] as const,      skills: ["/teams", "/design-system"] },
  { id: 6, name: "Quality",   icon: ShieldCheck,   isGate: false, description: "QA + Design Review",                   agents: ["QA", "Designer"] as const,          skills: ["/qa", "/security", "/a11y", "/cx-review"] },
  { id: 7, name: "Ship",      icon: Rocket,        isGate: true,  description: "PR + merge approval",                  agents: ["Tech Writer", "Lead"] as const,     skills: ["/ship", "/changelog"] },
] as const;

// ── Team Stages (Kanban Columns) ───────────────────────────────────────────────

export const TEAM_STAGES: { id: TeamStage; label: string; icon: typeof Paintbrush; color: string }[] = [
  { id: "design-review", label: "Design Review", icon: Paintbrush,  color: "var(--accent)" },
  { id: "build",         label: "Build",         icon: Hammer,      color: "var(--warning)" },
  { id: "quality",       label: "Quality",       icon: Bug,         color: "var(--success)" },
  { id: "security",      label: "Security",      icon: ShieldCheck, color: "var(--info, #60a5fa)" },
];

// ── DRI Color Map ──────────────────────────────────────────────────────────────

export const DRI_COLORS: Record<TaskDRI, string> = {
  Lead:     "var(--accent)",
  PM:       "var(--success)",
  Designer: "var(--warning)",
  Builder:  "var(--accent)",
  Watcher:  "var(--text-muted)",
  QA:       "var(--warning)",
  Writer:   "var(--info, #60a5fa)",
};

// ── Status Config ──────────────────────────────────────────────────────────────

export const STATUS_CFG: Record<SubProjectStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  building: { label: "Building", color: "var(--accent)",     icon: AlertCircle },
  shipped:  { label: "Shipped",  color: "var(--success)",    icon: CheckCircle2 },
  paused:   { label: "Paused",   color: "var(--text-muted)", icon: Clock },
  planned:  { label: "Planned",  color: "var(--warning)",    icon: Layers },
};

// ── Project Data ───────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: "apex-framework",
    name: "APEX Framework",
    description: "7-phase autonomous pipeline, Apple EPM agents, Design DNA, and visual command center.",
    collapsed: true,
    subProjects: [
      {
        id: "v520-production", name: "v5.20 — Production Readiness",
        description: "41 files: hooks, Oscar animations, DnaBackground, E2E tests.",
        branch: "feat/v5.20-production-readiness",
        pr: "#187", prStatus: "merged", prUrl: "https://github.com/lsfdsb/apex-framework/pull/187",
        lastActive: "Mar 23", status: "shipped", currentPhase: 7,
        teamTasks: [
          { id: "F-1", title: "Hook architecture design", stage: "design-review", dri: "Designer", done: true },
          { id: "F-2", title: "14 hook implementations", stage: "build", dri: "Builder", done: true },
          { id: "F-3", title: "Oscar animation keyframes", stage: "build", dri: "Builder", done: true },
          { id: "F-4", title: "E2E test framework", stage: "quality", dri: "QA", done: true },
          { id: "F-5", title: "Hook security audit", stage: "security", dri: "QA", done: true },
        ],
      },
      {
        id: "v521-quality", name: "v5.21 — Quality Gates",
        description: "81 Apple-audit fixes, dynamic counts, portable shell, batch-reads rule.",
        branch: "feat/apple-grade-audit-fixes",
        pr: "#194", prStatus: "merged", prUrl: "https://github.com/lsfdsb/apex-framework/pull/194",
        lastActive: "Mar 24", status: "shipped", currentPhase: 7,
        teamTasks: [
          { id: "Q-1", title: "Apple audit checklist", stage: "design-review", dri: "Designer", done: true },
          { id: "Q-2", title: "81 audit fixes (20 files)", stage: "build", dri: "Builder", done: true },
          { id: "Q-3", title: "Dynamic counts", stage: "build", dri: "Builder", done: true },
          { id: "Q-4", title: "QA pass on all fixes", stage: "quality", dri: "QA", done: true },
          { id: "Q-5", title: "Safe process management", stage: "security", dri: "QA", done: true },
        ],
      },
      {
        id: "v522-apple", name: "v5.22 — The Apple Release",
        description: "PM agent, 7-phase pipeline, Bueno rebrand, CI fixes, Node.js 22 LTS.",
        branch: "feat/v522-apple-audit",
        pr: "#202", prStatus: "merged", prUrl: "https://github.com/lsfdsb/apex-framework/pull/202",
        lastActive: "Mar 25", status: "shipped", currentPhase: 7,
        teamTasks: [
          { id: "A-1", title: "PM agent architecture", stage: "design-review", dri: "Lead", done: true },
          { id: "A-2", title: "Project Manager agent", stage: "build", dri: "Builder", done: true },
          { id: "A-3", title: "7-phase pipeline rewire", stage: "build", dri: "Builder", done: true },
          { id: "A-4", title: "Bueno rebrand (36 files)", stage: "build", dri: "Builder", done: true },
          { id: "A-5", title: "Full QA gate pass", stage: "quality", dri: "QA", done: true },
          { id: "A-6", title: "CI security review", stage: "security", dri: "QA", done: true },
        ],
      },
      {
        id: "v523-pipeline", name: "v5.23 — Pipeline Autonomy",
        description: "State machine pipeline, Apple EPM agents, honest audit, ANPP/RoR separation.",
        branch: "feat/v523-pipeline-autonomy",
        pr: "#215", prStatus: "merged", prUrl: "https://github.com/lsfdsb/apex-framework/pull/215",
        lastActive: "Mar 26", status: "shipped", currentPhase: 7,
        teamTasks: [
          { id: "P-1", title: "Pipeline state machine design", stage: "design-review", dri: "Lead", done: true },
          { id: "P-2", title: "Apple EPM agent integration", stage: "build", dri: "Builder", done: true },
          { id: "P-3", title: "ANPP/RoR separation", stage: "build", dri: "Builder", done: true },
          { id: "P-4", title: "Seven Elements exit criteria", stage: "quality", dri: "QA", done: true },
          { id: "P-5", title: "ET Review protocol audit", stage: "security", dri: "QA", done: true },
        ],
      },
      {
        id: "perf-bundle", name: "Bundle Optimization",
        description: "544KB to 210KB (61% smaller). Lazy loading, code splitting, tree shaking.",
        branch: "perf/bundle-optimization",
        pr: "#185", prStatus: "merged", prUrl: "https://github.com/lsfdsb/apex-framework/pull/185",
        lastActive: "Mar 22", status: "shipped", currentPhase: 7,
        teamTasks: [
          { id: "B-1", title: "Bundle analysis report", stage: "design-review", dri: "Lead", done: true },
          { id: "B-2", title: "Lazy route loading", stage: "build", dri: "Builder", done: true },
          { id: "B-3", title: "Tree shaking config", stage: "build", dri: "Builder", done: true },
          { id: "B-4", title: "Performance benchmarks", stage: "quality", dri: "QA", done: true },
          { id: "B-5", title: "No sensitive code in bundle", stage: "security", dri: "QA", done: true },
        ],
      },
      {
        id: "visual-hub", name: "Visual Pipeline HUB",
        description: "Web command center with OPS dashboard, task board, agent roster, and quality gates.",
        branch: "feat/visual-pipeline-hub",
        pr: "#203", prStatus: "merged", prUrl: "https://github.com/lsfdsb/apex-framework/pull/203",
        lastActive: "Mar 25", status: "shipped", currentPhase: 7,
        teamTasks: [
          { id: "H-1", title: "HUB PRD + architecture", stage: "design-review", dri: "Lead", done: true },
          { id: "H-2", title: "7 OPS pages + components", stage: "build", dri: "Builder", done: true },
          { id: "H-3", title: "Live sync (useApexState)", stage: "build", dri: "Builder", done: true },
          { id: "H-4", title: "Teaching layer", stage: "build", dri: "Builder", done: true },
          { id: "H-5", title: "TypeScript strict + build", stage: "quality", dri: "QA", done: true },
          { id: "H-6", title: "Path traversal guard", stage: "security", dri: "QA", done: true },
        ],
      },
      {
        id: "dna-showcase", name: "Design DNA Showcase",
        description: "14 premium UI templates, 33 starters, 39 components.",
        branch: "main",
        pr: "#187", prStatus: "merged", prUrl: "https://github.com/lsfdsb/apex-framework/pull/187",
        lastActive: "Mar 23", status: "shipped", currentPhase: 7,
        teamTasks: [
          { id: "D-1", title: "14 template designs", stage: "design-review", dri: "Designer", done: true },
          { id: "D-2", title: "Template implementations", stage: "build", dri: "Builder", done: true },
          { id: "D-3", title: "CRM/Helpdesk components", stage: "build", dri: "Builder", done: true },
          { id: "D-4", title: "Accessibility audit", stage: "quality", dri: "QA", done: true },
          { id: "D-5", title: "No credentials in templates", stage: "security", dri: "QA", done: true },
        ],
      },
      {
        id: "ops-timeline", name: "OPS Phase Timeline",
        description: "Horizontal 7-phase timeline with team kanban per subproject.",
        branch: "feat/ops-phase-timeline",
        lastActive: "Mar 26", status: "shipped", currentPhase: 7,
        pr: "#215", prStatus: "merged", prUrl: "https://github.com/lsfdsb/apex-framework/pull/215",
        teamTasks: [
          { id: "T-1", title: "Timeline UX design", stage: "design-review", dri: "Designer", done: true },
          { id: "T-2", title: "Phase timeline component", stage: "build", dri: "Builder", done: true },
          { id: "T-3", title: "Team kanban per subproject", stage: "build", dri: "Builder", done: true },
          { id: "T-4", title: "QA pass", stage: "quality", dri: "QA", done: true },
          { id: "T-5", title: "Security review", stage: "security", dri: "QA", done: true },
        ],
      },
    ],
  },
  {
    id: "supabase-rag",
    name: "Supabase RAG",
    description: "AI-powered documentation search with vector embeddings, hybrid intelligence, and auto-sync.",
    collapsed: true,
    subProjects: [
      {
        id: "supabase-rag-pipeline", name: "Supabase RAG Pipeline",
        description: "AI-powered documentation search with vector embeddings, hybrid intelligence, and auto-sync.",
        branch: "feat/rag-v2",
        pr: "#215", prStatus: "merged", prUrl: "https://github.com/lsfdsb/apex-framework/pull/215",
        lastActive: "Mar 26", status: "shipped", currentPhase: 7,
        teamTasks: [
          { id: "R-1", title: "RAG architecture + schema", stage: "design-review", dri: "Lead", done: true },
          { id: "R-2", title: "Vector embeddings pipeline", stage: "build", dri: "Builder", done: true },
          { id: "R-3", title: "Edge function endpoints", stage: "build", dri: "Builder", done: true },
          { id: "R-4", title: "Hybrid intelligence (all agents)", stage: "build", dri: "Builder", done: true },
          { id: "R-5", title: "Auto-sync on every edit", stage: "quality", dri: "QA", done: true },
          { id: "R-6", title: "API key rotation + RLS", stage: "security", dri: "QA", done: true },
        ],
      },
    ],
  },
];

// ── Derived flat list ──────────────────────────────────────────────────────────

export const ALL_SUB_PROJECTS: SubProject[] = PROJECTS.flatMap(p => p.subProjects);

// ── Recent PRs ─────────────────────────────────────────────────────────────────

export const RECENT_PRS: PullRequest[] = [
  { number: 215, title: "fix(audit): ET Review — 5-agent audit fixes", status: "merged", date: "Mar 26", branch: "fix/et-review-audit" },
  { number: 214, title: "feat(rag): auto-sync — RAG updates on every edit", status: "merged", date: "Mar 26", branch: "feat/rag-auto-sync" },
  { number: 213, title: "fix(rag): CREATE POLICY syntax fix", status: "merged", date: "Mar 26", branch: "fix/rag-policy-syntax" },
  { number: 212, title: "feat(rag): hybrid intelligence — every agent gets RAG", status: "merged", date: "Mar 26", branch: "feat/rag-hybrid" },
  { number: 211, title: "feat(rag): functional Supabase RAG pipeline", status: "merged", date: "Mar 26", branch: "feat/rag-pipeline" },
];
