/**
 * OpsContext — Shared state provider for all APEX OPS pages.
 * Centralizes useApexState polling so each .apex/state/ file is polled
 * exactly once, regardless of how many pages consume it.
 */

import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import { useApexState } from "../hooks/useApexState";
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

// ── Derived agent entry type ──────────────────────────────────────────────────

export interface DerivedAgentEntry {
  status: AgentStatus;
  currentTask?: string;
  tasks: TaskItem[];
}

// ── Context Shape ────────────────────────────────────────────────────────────

interface OpsContextValue {
  // Live state from .apex/state/ polling
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

  // Selected project for cross-page navigation
  selectedProject: string | null;
  setSelectedProject: (id: string | null) => void;
}

const OpsContext = createContext<OpsContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export function OpsProvider({ children }: { children: ReactNode }) {
  const tasksState = useApexState<TaskBoardState>("tasks.json", MOCK_TASK_BOARD);
  const agentsState = useApexState<AgentState>("agents.json", DEFAULT_AGENTS);
  const pipelineState = useApexState<PipelineState>("pipeline.json", DEFAULT_PIPELINE);
  const qualityState = useApexState<QualityState>("quality.json", DEFAULT_QUALITY);
  const sessionState = useApexState<SessionState>("session.json", DEFAULT_SESSION);

  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Derive agent activity from tasks — more reliable than agents.json
  // which can be overwritten by a new session before the previous one ends.
  const derivedAgents = useMemo((): Map<string, DerivedAgentEntry> => {
    const map = new Map<string, DerivedAgentEntry>();

    // Seed from live agents.json so status/currentTask from hooks is respected
    for (const agent of agentsState.data.agents) {
      map.set(agent.name, {
        status: agent.status,
        currentTask: agent.currentTask,
        tasks: [],
      });
    }

    // Overlay with task-derived activity — tasks.json is the ground truth
    for (const task of tasksState.data.tasks) {
      const dri = task.dri ?? "builder";
      if (!map.has(dri)) {
        map.set(dri, { status: "idle", tasks: [] });
      }
      const entry = map.get(dri)!;
      entry.tasks.push(task);

      // An in-progress task makes the DRI active; take the first one found
      if (task.column === "in-progress" && entry.status !== "active") {
        entry.status = "active";
        entry.currentTask = task.title;
      }
    }

    return map;
  }, [agentsState.data, tasksState.data]);

  // Consider "live" if ANY state file is successfully fetched
  const isLive =
    tasksState.isLive ||
    agentsState.isLive ||
    pipelineState.isLive ||
    qualityState.isLive ||
    sessionState.isLive;

  // Latest update across all state files
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
