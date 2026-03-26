/**
 * APEX Visual Pipeline HUB — Type Definitions
 * State interfaces for live sync between Claude Code and the HUB.
 * Matches PRD §7.1 exactly.
 */

// ── Session State ──────────────────────────────────────────────────────────────

export interface SessionState {
  active: boolean;
  startedAt: string;
  branch: string;
  model: string;
  contextUsed: number;
  contextMax: number;
}

// ── Pipeline State ─────────────────────────────────────────────────────────────

export type PhaseStatus = "idle" | "active" | "complete" | "failed";

export interface PipelinePhaseState {
  id: number;
  name: string;
  status: PhaseStatus;
  startedAt?: string;
  completedAt?: string;
  gateApproved?: boolean;
}

export interface PipelineState {
  currentPhase: number;
  phases: PipelinePhaseState[];
}

// ── Task Board State ───────────────────────────────────────────────────────────

export type TaskColumn = "backlog" | "todo" | "in-progress" | "review" | "done";
export type TaskPhase = "P0" | "P1" | "P2";
export type TaskDRI = "builder" | "qa" | "technical-writer" | "pm";

export interface Iteration {
  id: number;
  label: string;
  startedAt: string;
  shippedAt?: string;
  prUrl?: string;
  feedback?: string;
}

export interface AcceptanceCriterion {
  text: string;
  met: boolean;
}

export interface ReviewGate {
  name: string;
  status: "pending" | "passed" | "failed";
}

export type TaskTag = "feat" | "fix" | "refactor" | "docs" | "chore" | "perf" | "a11y" | "security" | "test";

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  tag?: TaskTag;
  column: TaskColumn;
  phase: TaskPhase;
  dri: TaskDRI;
  acceptanceCriteria: AcceptanceCriterion[];
  files: string[];
  blockedBy: string[];
  blocks: string[];
  createdAt: string;
  updatedAt: string;
  reviewGates?: ReviewGate[];
  /** Optional: links this task to an iteration/ship. */
  iteration?: number;
}

export interface TaskBoardMeta {
  p0Count: number;
  p1Count: number;
  p2Count: number;
  completedCount: number;
  velocity: number;
}

export interface TaskBoardState {
  projectName: string;
  tasks: TaskItem[];
  meta: TaskBoardMeta;
  iterations?: Iteration[];
}

// ── Agent State ────────────────────────────────────────────────────────────────

export type AgentStatus = "idle" | "active" | "completed" | "failed";

export interface ThoughtEntry {
  timestamp: string;
  action: string;
  explanation: string;
}

export interface AgentInstance {
  name: string;
  status: AgentStatus;
  model: string;
  currentTask?: string;
  thoughtStream: ThoughtEntry[];
  startedAt?: string;
  completedAt?: string;
}

export interface AgentState {
  agents: AgentInstance[];
}

// ── Quality State ──────────────────────────────────────────────────────────────

export type GateStatus = "pending" | "running" | "passed" | "failed";
export type AdditionalGateStatus = "pending" | "passed" | "failed" | "skipped";

export interface QualityPhaseResult {
  name: string;
  status: GateStatus;
  details?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface QualityState {
  score: number;
  phases: QualityPhaseResult[];
  additionalGates: {
    security: AdditionalGateStatus;
    accessibility: AdditionalGateStatus;
    cxReview: AdditionalGateStatus;
  };
}

// ── Static Data Types (for pipeline.ts, agents.ts, etc.) ──────────────────────

export interface PipelinePhaseDefinition {
  id: number;
  name: string;
  description: string;
  icon: string;
  isGate: boolean;
  agents: string[];
  skills: string[];
  teachingPoint: string;
  simulationDuration: number;
  /** Honest annotation: which Apple EPM concept this phase maps to (if any). */
  appleOrigin?: string;
}

export type AgentModel = "opus" | "sonnet" | "haiku";

export interface AgentDefinition {
  name: string;
  role: string;
  model: AgentModel;
  icon: string;
  tagline: string;
  teachingPoint: string;
  responsibilities: string[];
}

export interface QualityGateDefinition {
  name: string;
  icon: string;
  description: string;
  teachingPoint: string;
  checks: string[];
}
