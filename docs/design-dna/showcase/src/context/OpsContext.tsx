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

function transformSession(rows: Record<string, unknown>[]): SessionState {
  const active = rows.find((r) => r.active === true);
  if (!active) return DEFAULT_SESSION;
  return {
    active: true,
    startedAt: (active.started_at as string) ?? "",
    branch: (active.branch as string) ?? "",
    model: (active.model as string) ?? "opus",
    contextUsed: (active.context_used as number) ?? 0,
    contextMax: (active.context_max as number) ?? 1000000,
  };
}

function transformTasks(rows: Record<string, unknown>[]): TaskBoardState {
  const tasks: TaskItem[] = rows.map((r) => ({
    id: (r.task_id as string) ?? (r.id as string),
    title: (r.title as string) ?? "",
    description: (r.description as string) ?? "",
    tag: (r.tag as string) ?? null,
    column: (r.column as string) ?? "todo",
    phase: (r.phase as string) ?? "P0",
    dri: (r.dri as string) ?? "builder",
    acceptanceCriteria: (r.acceptance_criteria as TaskItem["acceptanceCriteria"]) ?? [],
    files: (r.files as string[]) ?? [],
    blockedBy: (r.blocked_by as string[]) ?? [],
    blocks: (r.blocks as string[]) ?? [],
    createdAt: (r.created_at as string) ?? "",
    updatedAt: (r.updated_at as string) ?? "",
  }));
  const done = tasks.filter((t) => t.column === "done").length;
  return {
    projectName: "APEX Session",
    tasks,
    meta: { p0Count: 0, p1Count: 0, p2Count: 0, completedCount: done, velocity: 0 },
  };
}

function transformAgents(rows: Record<string, unknown>[]): AgentState {
  return {
    agents: rows.map((r) => ({
      name: (r.name as string) ?? "agent",
      status: (r.status as AgentStatus) ?? "idle",
      model: (r.model as string) ?? "sonnet",
      currentTask: r.current_task as string | undefined,
      thoughtStream: (r.thought_stream as AgentState["agents"][0]["thoughtStream"]) ?? [],
      startedAt: r.started_at as string | undefined,
      completedAt: r.completed_at as string | undefined,
    })),
  };
}

function transformPipeline(rows: Record<string, unknown>[]): PipelineState {
  const sorted = [...rows].sort(
    (a, b) => ((a.phase_id as number) ?? 0) - ((b.phase_id as number) ?? 0),
  );
  const current = sorted.findLast((r) => r.status === "active");
  return {
    currentPhase: (current?.phase_id as number) ?? 0,
    phases: sorted.map((r) => ({
      id: (r.phase_id as number) ?? 0,
      name: (r.name as string) ?? "",
      status: (r.status as string) ?? "idle",
      startedAt: r.started_at as string | undefined,
      completedAt: r.completed_at as string | undefined,
      gateApproved: r.gate_approved as boolean | undefined,
    })),
  };
}

function transformQuality(rows: Record<string, unknown>[]): QualityState {
  const latest = rows[rows.length - 1];
  if (!latest) return DEFAULT_QUALITY;
  return {
    score: (latest.score as number) ?? 0,
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

    return map;
  }, [agentsState.data, tasksState.data]);

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
