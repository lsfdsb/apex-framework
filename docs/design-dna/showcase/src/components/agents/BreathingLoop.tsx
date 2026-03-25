import { useEffect, useRef } from "react";

// Node definitions for the Breathing Loop cycle
const NODES = [
  { id: "watcher", label: "Watcher",  sublabel: "detect",  icon: "👁️",  cx: 110, cy: 90  },
  { id: "builder", label: "Builder",  sublabel: "fix",     icon: "⚒️",  cx: 370, cy: 90  },
  { id: "qa",      label: "QA",       sublabel: "verify",  icon: "🛡️",  cx: 370, cy: 210 },
  { id: "writer",  label: "Writer",   sublabel: "docs",    icon: "✍️",  cx: 110, cy: 210 },
] as const;

// Arrow path definitions (from center of source node to center of target node)
// Each arrow goes between adjacent nodes in the cycle: W→B→QA→Wr→W
const ARROWS = [
  { id: "wb",   d: "M 185 90  L 295 90",   label: "error detected"  },
  { id: "bq",   d: "M 370 115 L 370 185",  label: "code written"    },
  { id: "qw",   d: "M 295 210 L 185 210",  label: "verified"        },
  { id: "ww",   d: "M 110 185 L 110 115",  label: "monitoring"      },
] as const;

// Ship path — exits from QA to the right
const SHIP_ARROW = "M 430 197 Q 490 197 490 165 Q 490 133 470 133";

export function BreathingLoop() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    // Stagger the dash-offset animation on each arrow path
    const arrows = svgRef.current?.querySelectorAll(".bl-arrow-path");
    arrows?.forEach((el, i) => {
      (el as SVGPathElement).style.animationDelay = `${i * 0.4}s`;
    });
  }, []);

  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Header */}
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--accent)",
            marginBottom: 6,
          }}
        >
          Coordination Pattern
        </div>
        <div
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 20,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}
        >
          The Breathing Loop
        </div>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          Watcher detects errors the moment they appear. Builder fixes them. QA
          verifies the fix. Writer documents. The loop never stops.
        </p>
      </div>

      {/* SVG Diagram */}
      <svg
        ref={svgRef}
        viewBox="0 0 520 300"
        width="100%"
        aria-label="The Breathing Loop: Watcher detects, Builder fixes, QA verifies, Writer documents"
        role="img"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Arrow marker */}
          <marker
            id="bl-arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L8,3 z" fill="var(--accent)" />
          </marker>
          <marker
            id="bl-arrowhead-ship"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L8,3 z" fill="var(--text-muted)" />
          </marker>

          {/* Glow filter for active nodes */}
          <filter id="bl-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <style>{`
            @keyframes bl-flow {
              0%   { stroke-dashoffset: 48; }
              100% { stroke-dashoffset: 0;  }
            }
            @keyframes bl-pulse {
              0%, 100% { opacity: 0.6; }
              50%       { opacity: 1;   }
            }
            .bl-arrow-path {
              stroke-dasharray: 6 6;
              stroke-dashoffset: 48;
              animation: bl-flow 1.6s linear infinite;
            }
            .bl-node-ring {
              animation: bl-pulse 2.4s ease-in-out infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .bl-arrow-path { animation: none; stroke-dashoffset: 0; }
              .bl-node-ring  { animation: none; opacity: 1; }
            }
          `}</style>
        </defs>

        {/* ── Loop label (center) ── */}
        <text
          x="240"
          y="158"
          textAnchor="middle"
          style={{
            fill: "var(--text-muted)",
            fontSize: 11,
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Breathing Loop
        </text>

        {/* ── Arrows ── */}
        {ARROWS.map((arrow, i) => (
          <path
            key={arrow.id}
            className="bl-arrow-path"
            d={arrow.d}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            markerEnd="url(#bl-arrowhead)"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}

        {/* Ship arrow — from QA rightward */}
        <path
          d={SHIP_ARROW}
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          markerEnd="url(#bl-arrowhead-ship)"
          opacity={0.6}
        />
        <text
          x="496"
          y="128"
          textAnchor="middle"
          style={{
            fill: "var(--text-muted)",
            fontSize: 9,
            fontFamily: "Inter, sans-serif",
          }}
        >
          SHIP
        </text>

        {/* ── Nodes ── */}
        {NODES.map((node) => (
          <g key={node.id} transform={`translate(${node.cx}, ${node.cy})`}>
            {/* Outer glow ring */}
            <rect
              className="bl-node-ring"
              x={-44}
              y={-30}
              width={88}
              height={60}
              rx={10}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1"
              opacity={0.3}
            />
            {/* Card background */}
            <rect
              x={-40}
              y={-26}
              width={80}
              height={52}
              rx={8}
              fill="var(--bg-surface)"
              stroke="var(--border)"
              strokeWidth="1"
            />
            {/* Icon */}
            <text
              x={0}
              y={-6}
              textAnchor="middle"
              style={{ fontSize: 18 }}
            >
              {node.icon}
            </text>
            {/* Agent name */}
            <text
              x={0}
              y={10}
              textAnchor="middle"
              style={{
                fill: "var(--text)",
                fontSize: 11,
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
              }}
            >
              {node.label}
            </text>
            {/* Sub-label */}
            <text
              x={0}
              y={22}
              textAnchor="middle"
              style={{
                fill: "var(--accent)",
                fontSize: 9,
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                letterSpacing: "0.06em",
              }}
            >
              {node.sublabel}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
