/**
 * OpsContext — Shared state provider for all APEX OPS pages.
 * Centralizes useApexState polling so each .apex/state/ file is polled
 * exactly once, regardless of how many pages consume it.
 */

import { createContext, useContext, useState, type ReactNode } from "react";
import { useApexState } from "../hooks/useApexState";
import type {
  TaskBoardState,
  AgentState,
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

// ── Context Shape ────────────────────────────────────────────────────────────

interface OpsContextValue {
  // Live state from .apex/state/ polling
  tasks: TaskBoardState;
  agents: AgentState;
  pipeline: PipelineState;
  quality: QualityState;
  session: SessionState;

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
