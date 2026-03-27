/**
 * CanvasPage — APEX Agent Canvas.
 * n8n-style live visualization of the agent network and task pipeline.
 * Requires OpsProvider (already wrapped by App.tsx OPS route handler).
 */

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
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
  .react-flow__minimap-node {
    stroke: none !important;
  }
  @keyframes nodeStatusPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  @keyframes nodeBreathing {
    0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 0%, transparent); }
    50% { box-shadow: 0 0 16px 4px color-mix(in srgb, var(--accent) 20%, transparent); }
  }
  @media (prefers-reduced-motion: reduce) {
    .react-flow__node * {
      animation: none !important;
    }
  }
`;

// ── CanvasPage ────────────────────────────────────────────────────────────────

export default function CanvasPage() {
  const { isLive, lastUpdated } = useOps();
  const { nodes, edges, taskSummary } = useCanvasData();

  // TaskLane height reservation (56px bar + up to 204px expanded)
  const TASK_LANE_HEIGHT = 56;

  // MiniMap renders in SVG — CSS variables don't resolve in SVG fill attributes.
  // Resolve computed colors once from DOM, then use in the node color callback.
  const { nodeColor, maskColor } = useMemo(() => {
    const root = typeof document !== "undefined" ? getComputedStyle(document.documentElement) : null;
    const success = root?.getPropertyValue("--success")?.trim() || "#22c55e";
    const muted = root?.getPropertyValue("--text-muted")?.trim() || "#6b7280";
    const accent = root?.getPropertyValue("--accent")?.trim() || "#e87b35";
    return {
      nodeColor: (node: { data?: Record<string, unknown> }) => {
        const status = node.data?.status as string | undefined;
        return status === "active" ? success : muted;
      },
      maskColor: `${accent}18`, // ~10% opacity via hex alpha
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
        fitViewOptions={{ padding: 0.3, minZoom: 0.4, maxZoom: 1.2 }}
        minZoom={0.4}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        style={{ paddingBottom: TASK_LANE_HEIGHT }}
        aria-label="APEX agent network canvas"
      >
        <Background
          color="color-mix(in srgb, var(--text-muted) 30%, transparent)"
          gap={20}
          size={1.5}
          variant={BackgroundVariant.Dots}
        />
        <MiniMap
          nodeColor={nodeColor}
          nodeStrokeWidth={0}
          maskColor={maskColor}
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
