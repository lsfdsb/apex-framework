/**
 * CanvasPage — APEX Agent Canvas.
 * n8n-style live visualization of the agent network and task pipeline.
 * Requires OpsProvider (already wrapped by App.tsx OPS route handler).
 */

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  MiniMap,
  Controls,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useOps } from "../context/OpsContext";
import { useCanvasData } from "../hooks/useCanvasData";
import { AgentNode } from "../components/canvas/AgentNode";
import { TaskLane } from "../components/canvas/TaskLane";
import { LiveBadge } from "../components/hub/LiveBadge";

// ── Node types — defined outside render for React Flow stability ──────────────

const nodeTypes: NodeTypes = { agent: AgentNode };

// ── Canvas styles injected inline — scoped to this page ──────────────────────

const canvasStyles = `
  .react-flow__controls {
    background: var(--bg-elevated) !important;
    border: 1px solid var(--border) !important;
    border-radius: 10px !important;
    overflow: hidden;
  }
  .react-flow__controls-button {
    background: var(--bg-elevated) !important;
    border-bottom: 1px solid var(--border) !important;
    color: var(--text) !important;
    fill: var(--text) !important;
  }
  .react-flow__controls-button:hover {
    background: color-mix(in srgb, var(--accent) 10%, var(--bg-elevated)) !important;
  }
  .react-flow__minimap {
    background: var(--bg-elevated) !important;
    border: 1px solid var(--border) !important;
    border-radius: 10px !important;
    overflow: hidden;
  }
  .react-flow__minimap-mask {
    fill: color-mix(in srgb, var(--accent) 10%, transparent) !important;
  }
`;

// ── CanvasPage ────────────────────────────────────────────────────────────────

export default function CanvasPage() {
  const { isLive, lastUpdated } = useOps();
  const { nodes, edges, taskSummary } = useCanvasData();

  // TaskLane height reservation (56px bar + up to 204px expanded)
  const TASK_LANE_HEIGHT = 56;

  const miniMapNodeColor = useMemo(() => {
    return (node: { data?: Record<string, unknown> }) => {
      const status = node.data?.status as string | undefined;
      return status === "active" ? "var(--success)" : "var(--text-muted)";
    };
  }, []);

  return (
    <div
      style={{
        height: `calc(100vh - 56px)`,
        width: "100%",
        position: "relative",
        background: "var(--bg)",
      }}
    >
      <style>{canvasStyles}</style>

      {/* Live badge — top left (top-right reserved for palette switcher) */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 8,
        }}
      >
        <LiveBadge isLive={isLive} lastUpdated={lastUpdated} />
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Agent Canvas</span>
      </div>

      {/* React Flow canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.4}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
        proOptions={{ hideAttribution: true }}
        style={{ paddingBottom: TASK_LANE_HEIGHT }}
        aria-label="APEX agent network canvas"
      >
        <Background
          color="var(--border)"
          gap={24}
          size={1}
        />
        <MiniMap
          nodeColor={miniMapNodeColor}
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            bottom: TASK_LANE_HEIGHT + 16,
          }}
          zoomable
          pannable
        />
        <Controls
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            bottom: TASK_LANE_HEIGHT + 100,
          }}
        />
      </ReactFlow>

      {/* Task pipeline bar — fixed at bottom */}
      <TaskLane
        backlog={taskSummary.backlog}
        todo={taskSummary.todo}
        inProgress={taskSummary.inProgress}
        review={taskSummary.review}
        done={taskSummary.done}
      />
    </div>
  );
}
