/**
 * useCanvasData — transforms OpsContext data into React Flow nodes and edges.
 * Radial layout: Lead at top-center, 6 agents arranged below.
 */

import { useMemo } from "react";
import { useOps } from "../context/OpsContext";
import type { Node, Edge } from "@xyflow/react";
import { AGENT_ROSTER } from "../data/hub-data";
import type { TaskItem, TaskColumn } from "../data/hub-types";

// DRI name → canvas node id (lowercase, hyphenated)
const ROSTER_TO_DRI: Record<string, string> = {
  Lead: "lead",
  PM: "project-manager",
  Builder: "builder",
  QA: "qa",
  "Design Reviewer": "design-reviewer",
  Watcher: "watcher",
  "Technical Writer": "technical-writer",
};

// Fixed radial positions — Lead at top, others in two rows
const AGENT_POSITIONS: Record<string, { x: number; y: number }> = {
  lead: { x: 400, y: 50 },
  "project-manager": { x: 150, y: 220 },
  builder: { x: 400, y: 220 },
  qa: { x: 650, y: 220 },
  "design-reviewer": { x: 150, y: 440 },
  watcher: { x: 400, y: 440 },
  "technical-writer": { x: 650, y: 440 },
};

export interface TaskSummary {
  backlog: TaskItem[];
  todo: TaskItem[];
  inProgress: TaskItem[];
  review: TaskItem[];
  done: TaskItem[];
}

export function useCanvasData(): {
  nodes: Node[];
  edges: Edge[];
  taskSummary: TaskSummary;
} {
  const { agents, derivedAgents, tasks } = useOps();

  const nodes: Node[] = useMemo(() => {
    return AGENT_ROSTER.map((agentDef) => {
      const driKey = ROSTER_TO_DRI[agentDef.name] ?? agentDef.name.toLowerCase();
      const derived = derivedAgents.get(driKey);
      const liveAgent = agents.agents.find((a) => a.name === agentDef.name);
      const isLead = driKey === "lead";

      return {
        id: driKey,
        type: "agent",
        position: AGENT_POSITIONS[driKey] ?? { x: 400, y: 300 },
        data: {
          name: agentDef.name,
          role: agentDef.role,
          model: agentDef.model,
          icon: agentDef.icon,
          status: derived?.status ?? "idle",
          currentTask: derived?.currentTask,
          thoughtStream: liveAgent?.thoughtStream?.slice(0, 3) ?? [],
          taskCount: derived?.tasks?.length ?? 0,
          isLead,
        },
      };
    });
  }, [agents, derivedAgents]);

  const edges: Edge[] = useMemo(() => {
    const leadId = "lead";
    const others = AGENT_ROSTER
      .map((a) => ROSTER_TO_DRI[a.name] ?? a.name.toLowerCase())
      .filter((id) => id !== leadId);

    return others.map((targetId) => {
      const targetDerived = derivedAgents.get(targetId);
      const leadDerived = derivedAgents.get(leadId);
      const bothActive =
        (leadDerived?.status ?? "idle") === "active" &&
        (targetDerived?.status ?? "idle") === "active";
      const targetActive = (targetDerived?.status ?? "idle") === "active";

      return {
        id: `${leadId}-${targetId}`,
        source: leadId,
        target: targetId,
        type: "smoothstep",
        animated: bothActive || targetActive,
        style: {
          stroke: targetActive
            ? "var(--accent)"
            : "var(--border)",
          strokeWidth: targetActive ? 2 : 1.5,
        },
      };
    });
  }, [derivedAgents]);

  const taskSummary: TaskSummary = useMemo(() => {
    const groups: Record<TaskColumn, TaskItem[]> = {
      backlog: [],
      todo: [],
      "in-progress": [],
      review: [],
      done: [],
    };
    for (const task of tasks.tasks) {
      groups[task.column]?.push(task);
    }
    return {
      backlog: groups.backlog,
      todo: groups.todo,
      inProgress: groups["in-progress"],
      review: groups.review,
      done: groups.done,
    };
  }, [tasks]);

  return { nodes, edges, taskSummary };
}
