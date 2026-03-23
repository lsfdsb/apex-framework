import React from "react";

const TrendUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
  </svg>
);

const TrendDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
  </svg>
);

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

function MetricCard({ label, value, change, trend }: MetricCardProps) {
  const changeColor = trend === "up"
    ? "var(--success, #34d399)"
    : "var(--destructive, #f87171)";

  return (
    <div style={{
      background: "var(--bg-elevated, #1e1e2e)",
      border: "1px solid var(--border, rgba(255,255,255,0.08))",
      borderRadius: "var(--radius, 12px)",
      padding: "24px",
    }}>
      <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, marginTop: 8, display: "flex", alignItems: "center", gap: 4, color: changeColor }}>
        {trend === "up" ? <TrendUp /> : <TrendDown />}
        {change}
      </div>
    </div>
  );
}

interface FunnelStageProps {
  label: string;
  count: number;
  width: string;
  color: string;
}

function FunnelStage({ label, count, width, color }: FunnelStageProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
      <span style={{ fontSize: 13, color: "var(--text-secondary, #a0a0b8)", width: 80, textAlign: "right", flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ flex: 1, position: "relative" }}>
        <div style={{
          width,
          height: 40,
          borderRadius: "var(--radius-sm, 6px)",
          background: color,
          display: "flex",
          alignItems: "center",
          paddingLeft: 16,
          transition: "width 1.5s cubic-bezier(0.22,1,0.36,1)",
          overflow: "hidden",
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "white", position: "relative", zIndex: 1 }}>
            {count}
          </span>
        </div>
      </div>
    </div>
  );
}

interface ConversionArrowProps {
  pct: string;
}

function ConversionArrow({ pct }: ConversionArrowProps) {
  return (
    <div style={{ textAlign: "center", padding: "4px 0" }}>
      <span style={{
        fontSize: 11,
        color: "var(--text-muted, #666680)",
        background: "var(--bg-surface, #16161e)",
        padding: "2px 10px",
        borderRadius: 999,
      }}>
        ↓ {pct}
      </span>
    </div>
  );
}

export function PipelineAnalytics() {
  return (
    <section style={{ padding: "80px 0" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent, #a78bfa)", marginBottom: 12 }}>
            Analytics
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0 }}>
            Numbers that<br />drive decisions.
          </h2>
        </div>

        {/* 4-column KPI grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 48 }}>
          <MetricCard label="Pipeline Value" value="$284k" change="+18% this month" trend="up" />
          <MetricCard label="Win Rate" value="68%" change="+5% vs Q4" trend="up" />
          <MetricCard label="Avg. Deal Size" value="$32k" change="-3% vs Q4" trend="down" />
          <MetricCard label="Time to Close" value="24d" change="6 days faster" trend="up" />
        </div>

        {/* Pipeline funnel */}
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <FunnelStage label="New Leads" count={248} width="100%" color="var(--pipeline-lead, #60a5fa)" />
          <ConversionArrow pct="52%" />
          <FunnelStage label="Qualified" count={129} width="52%" color="var(--pipeline-qualified, #a78bfa)" />
          <ConversionArrow pct="64%" />
          <FunnelStage label="Proposal" count={83} width="33%" color="var(--pipeline-proposal, #fbbf24)" />
          <ConversionArrow pct="78%" />
          <FunnelStage label="Won" count={65} width="26%" color="var(--pipeline-won, #34d399)" />
        </div>
      </div>
    </section>
  );
}

export default PipelineAnalytics;
