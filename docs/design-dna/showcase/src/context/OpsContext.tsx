/**
 * OpsContext — Shared state provider for all APEX OPS pages.
 *
 * Data source priority:
 *   1. Supabase Realtime (if VITE_SUPABASE_URL is set) — near-instant
 *   2. Local file polling (.apex/state/*.json every 2s) — always works
 *
 * Both paths produce the same shape. Consumers use `useOps()` and
 * never care which source is active.
 */

import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import { useApexState } from "../hooks/useApexState";
import { useSupabaseState } from "../hooks/useSupabaseState";
import { isSupabaseConfigured } from "../lib/supabase/client";
import type {
  TaskBoardState,
  AgentState,
  AgentStatus,
  TaskItem,
  PipelineState,
  QualityState,
  SessionState,
} from "../data/hub-types";
import { MOCK_TASK_BOARD } from "../data/hub-mock";
import type { Database } from "../lib/supabase/types";

// ── Supabase Row Types ───────────────────────────────────────────────────────
type SessionRow = Database["public"]["Tables"]["sessions"]["Row"];
type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
type AgentRow = Database["public"]["Tables"]["agents"]["Row"];
type PipelineRow = Database["public"]["Tables"]["pipeline_phases"]["Row"];
type QualityRow = Database["public"]["Tables"]["quality_gates"]["Row"];

// ── Default Fallbacks ────────────────────────────────────────────────────────

const DEFAULT_SESSION: SessionState = {
  active: false,
  startedAt: "",
  branch: "",
  model: "",
  contextUsed: 0,
  contextMax: 200000,
};

const DEFAULT_AGENTS: AgentState = {
  agents: [],
};

const DEFAULT_PIPELINE: PipelineState = {
  currentPhase: 0,
  phases: [],
};

const DEFAULT_QUALITY: QualityState = {
  score: 0,
  phases: [],
  additionalGates: {
    security: "pending",
    accessibility: "pending",
    cxReview: "pending",
  },
};

// ── Supabase → App State Transformers ────────────────────────────────────────
// These convert raw Supabase rows into the shapes the OPS pages expect.

function transformSession(rows: SessionRow[]): SessionState {
  const active = rows.find((r) => r.active === true);
  if (!active) return DEFAULT_SESSION;
  return {
    active: true,
    startedAt: active.started_at ?? "",
    branch: active.branch ?? "",
    model: active.model ?? "opus",
    contextUsed: active.context_used ?? 0,
    contextMax: active.context_max ?? 1000000,
  };
}

function transformTasks(rows: TaskRow[]): TaskBoardState {
  const tasks: TaskItem[] = rows.map((r) => ({
    id: r.task_id ?? r.id,
    title: r.title ?? "",
    description: r.description ?? "",
    tag: r.tag as TaskItem["tag"],
    column: (r.column ?? "todo") as TaskItem["column"],
    phase: (r.phase ?? "P0") as TaskItem["phase"],
    dri: (r.dri ?? "builder") as TaskItem["dri"],
    acceptanceCriteria: (r.acceptance_criteria as TaskItem["acceptanceCriteria"]) ?? [],
    files: r.files ?? [],
    blockedBy: r.blocked_by ?? [],
    blocks: r.blocks ?? [],
    createdAt: r.created_at ?? "",
    updatedAt: r.updated_at ?? "",
  }));
  const done = tasks.filter((t) => t.column === "done").length;
  return {
    projectName: "APEX Session",
    tasks,
    meta: { p0Count: 0, p1Count: 0, p2Count: 0, completedCount: done, velocity: 0 },
  };
}

function transformAgents(rows: AgentRow[]): AgentState {
  return {
    agents: rows.map((r) => ({
      name: r.name ?? "agent",
      status: (r.status as AgentStatus) ?? "idle",
      model: r.model ?? "sonnet",
      currentTask: r.current_task ?? undefined,
      thoughtStream: (r.thought_stream as AgentState["agents"][0]["thoughtStream"]) ?? [],
      startedAt: r.started_at ?? undefined,
      completedAt: r.completed_at ?? undefined,
    })),
  };
}

function transformPipeline(rows: PipelineRow[]): PipelineState {
  const sorted = [...rows].sort((a, b) => a.phase_id - b.phase_id);
  const current = sorted.findLast((r) => r.status === "active");
  return {
    currentPhase: current?.phase_id ?? 0,
    phases: sorted.map((r) => ({
      id: r.phase_id,
      name: r.name,
      status: r.status ?? "idle",
      startedAt: r.started_at ?? undefined,
      completedAt: r.completed_at ?? undefined,
      gateApproved: r.gate_approved ?? undefined,
    })),
  };
}

function transformQuality(rows: QualityRow[]): QualityState {
  const latest = rows[rows.length - 1];
  if (!latest) return DEFAULT_QUALITY;
  return {
    score: latest.score ?? 0,
    phases: (latest.phases as QualityState["phases"]) ?? [],
    additionalGates: (latest.additional_gates as QualityState["additionalGates"]) ?? {
      security: "pending",
      accessibility: "pending",
      cxReview: "pending",
    },
  };
}

// ── Derived agent entry type ──────────────────────────────────────────────────

export interface DerivedAgentEntry {
  status: AgentStatus;
  currentTask?: string;
  tasks: TaskItem[];
}

// ── Context Shape ────────────────────────────────────────────────────────────

interface OpsContextValue {
  tasks: TaskBoardState;
  agents: AgentState;
  pipeline: PipelineState;
  quality: QualityState;
  session: SessionState;

  // Agent activity derived from tasks (reliable — written by hooks)
  derivedAgents: Map<string, DerivedAgentEntry>;

  // Connection status
  isLive: boolean;
  lastUpdated: Date | null;

  // Data source indicator
  source: "supabase" | "local";

  // Selected project for cross-page navigation
  selectedProject: string | null;
  setSelectedProject: (id: string | null) => void;
}

const OpsContext = createContext<OpsContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export function OpsProvider({ children }: { children: ReactNode }) {
  // ── Data source: Supabase Realtime (when configured) ────────────────────
  const sbSession = useSupabaseState("sessions", DEFAULT_SESSION, transformSession);
  const sbTasks = useSupabaseState("tasks", MOCK_TASK_BOARD, transformTasks);
  const sbAgents = useSupabaseState("agents", DEFAULT_AGENTS, transformAgents);
  const sbPipeline = useSupabaseState("pipeline_phases", DEFAULT_PIPELINE, transformPipeline);
  const sbQuality = useSupabaseState("quality_gates", DEFAULT_QUALITY, transformQuality);

  // ── Data source: Local file polling (always runs as fallback) ───────────
  const localSession = useApexState<SessionState>("session.json", DEFAULT_SESSION);
  const localTasks = useApexState<TaskBoardState>("tasks.json", MOCK_TASK_BOARD);
  const localAgents = useApexState<AgentState>("agents.json", DEFAULT_AGENTS);
  const localPipeline = useApexState<PipelineState>("pipeline.json", DEFAULT_PIPELINE);
  const localQuality = useApexState<QualityState>("quality.json", DEFAULT_QUALITY);

  // ── Pick the active source ──────────────────────────────────────────────
  // Supabase wins when configured AND live. Otherwise fall back to local.
  const useSupabase = isSupabaseConfigured && sbSession.isLive;

  const tasksState = useSupabase ? sbTasks : localTasks;
  const agentsState = useSupabase ? sbAgents : localAgents;
  const pipelineState = useSupabase ? sbPipeline : localPipeline;
  const qualityState = useSupabase ? sbQuality : localQuality;
  const sessionState = useSupabase ? sbSession : localSession;

  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Derive agent activity from tasks — more reliable than agents.json
  const derivedAgents = useMemo((): Map<string, DerivedAgentEntry> => {
    const map = new Map<string, DerivedAgentEntry>();

    for (const agent of agentsState.data.agents) {
      map.set(agent.name, {
        status: agent.status,
        currentTask: agent.currentTask,
        tasks: [],
      });
    }

    for (const task of tasksState.data.tasks) {
      const dri = task.dri ?? "builder";
      if (!map.has(dri)) {
        map.set(dri, { status: "idle", tasks: [] });
      }
      const entry = map.get(dri)!;
      entry.tasks.push(task);

      if (task.column === "in-progress" && entry.status !== "active") {
        entry.status = "active";
        entry.currentTask = task.title;
      }
    }

    // Lead is active whenever the session is active (Claude is responding)
    const sessionActive = sessionState.data.active;
    const leadEntry = map.get("lead");
    if (leadEntry && sessionActive && leadEntry.status !== "active") {
      leadEntry.status = "active";
      leadEntry.currentTask = leadEntry.currentTask ?? "Session active";
    }

    return map;
  }, [agentsState.data, tasksState.data, sessionState.data]);

  const isLive =
    tasksState.isLive ||
    agentsState.isLive ||
    pipelineState.isLive ||
    qualityState.isLive ||
    sessionState.isLive;

  const timestamps = [
    tasksState.lastUpdated,
    agentsState.lastUpdated,
    pipelineState.lastUpdated,
    qualityState.lastUpdated,
    sessionState.lastUpdated,
  ].filter((t): t is Date => t !== null);

  const lastUpdated = timestamps.length > 0
    ? new Date(Math.max(...timestamps.map((t) => t.getTime())))
    : null;

  return (
    <OpsContext.Provider
      value={{
        tasks: tasksState.data,
        agents: agentsState.data,
        pipeline: pipelineState.data,
        quality: qualityState.data,
        session: sessionState.data,
        derivedAgents,
        isLive,
        lastUpdated,
        source: useSupabase ? "supabase" : "local",
        selectedProject,
        setSelectedProject,
      }}
    >
      {children}
    </OpsContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useOps(): OpsContextValue {
  const ctx = useContext(OpsContext);
  if (!ctx) {
    throw new Error("useOps must be used within an OpsProvider");
  }
  return ctx;
}
