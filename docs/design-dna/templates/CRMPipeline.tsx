// Copy this file into your app and customize
// Visual reference: docs/design-dna/crm.html
// DNA palette: bg=#08080a, accent=#636bf0, pipeline stage colors per column

"use client";

import React, { useState } from "react";
import { PageShell, Sidebar } from "../starters/layout";
import { SectionHeader, Card, Badge } from "../starters/primitives";

// ── Types ─────────────────────────────────────────────────────
type DealStage = "lead" | "qualified" | "proposal" | "won" | "lost";

interface Deal {
  id: string;
  name: string;
  company: string;
  amount: string;
  owner: string;
  daysAgo: number;
}

interface PipelineColumn {
  id: DealStage;
  label: string;
  color: string;
  deals: Deal[];
}

// ── Sample data ───────────────────────────────────────────────
const samplePipeline: PipelineColumn[] = [
  {
    id: "lead",
    label: "Lead",
    color: "var(--info, #60a5fa)",
    deals: [
      { id: "d1", name: "Forma redesign", company: "Forma Inc.", amount: "$12,000", owner: "AS", daysAgo: 2 },
      { id: "d2", name: "API integration", company: "Relay Labs", amount: "$8,500", owner: "MC", daysAgo: 4 },
    ],
  },
  {
    id: "qualified",
    label: "Qualified",
    color: "#a78bfa",
    deals: [
      { id: "d3", name: "Platform audit", company: "Beacon Co.", amount: "$21,000", owner: "PN", daysAgo: 1 },
    ],
  },
  {
    id: "proposal",
    label: "Proposal",
    color: "var(--warning, #fbbf24)",
    deals: [
      { id: "d4", name: "Full rewrite", company: "Drift App", amount: "$45,000", owner: "JO", daysAgo: 3 },
      { id: "d5", name: "Design system", company: "Arc Studio", amount: "$18,000", owner: "SL", daysAgo: 7 },
    ],
  },
  {
    id: "won",
    label: "Won",
    color: "var(--success, #34d399)",
    deals: [
      { id: "d6", name: "MVP build", company: "Inkline", amount: "$32,000", owner: "AS", daysAgo: 0 },
    ],
  },
  {
    id: "lost",
    label: "Lost",
    color: "var(--destructive, #f87171)",
    deals: [
      { id: "d7", name: "Legacy migration", company: "OldCorp", amount: "$9,000", owner: "MC", daysAgo: 10 },
    ],
  },
];

const stageVariant: Record<DealStage, "info" | "accent" | "warning" | "success" | "error"> = {
  lead: "info",
  qualified: "accent",
  proposal: "warning",
  won: "success",
  lost: "error",
};

// ── Sub-components ────────────────────────────────────────────
function DealCard({ deal }: { deal: Deal }) {
  return (
    <Card hover className="mb-2 cursor-grab">
      <Card.Body>
        <p className="text-[14px] font-medium mb-0.5" style={{ color: "var(--text)" }}>
          {deal.name}
        </p>
        <p className="text-[12px] mb-3" style={{ color: "var(--text-muted)" }}>
          {deal.company}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>
            {deal.amount}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {deal.daysAgo === 0 ? "Today" : `${deal.daysAgo}d ago`}
            </span>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
            >
              {deal.owner}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function PipelineCol({ col }: { col: PipelineColumn }) {
  const total = col.deals.reduce((acc, d) => {
    const n = parseFloat(d.amount.replace(/[$,]/g, ""));
    return acc + n;
  }, 0);

  return (
    <div
      className="rounded-[var(--radius)] border p-4 min-h-[400px] shrink-0 w-[220px]"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
    >
      <div
        className="flex items-center justify-between mb-4 pb-3 border-b-2"
        style={{ borderColor: col.color }}
      >
        <h4 className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
          {col.label}
        </h4>
        <span
          className="text-[11px] px-2 py-0.5 rounded-full"
          style={{ background: "var(--bg-surface)", color: "var(--text-muted)" }}
        >
          {col.deals.length}
        </span>
      </div>
      <p className="text-[11px] mb-3" style={{ color: "var(--text-muted)" }}>
        ${(total / 1000).toFixed(1)}k pipeline
      </p>
      {col.deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
}

const sidebarSections = [
  {
    items: [
      {
        label: "Dashboard",
        href: "#",
        icon: (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <rect x="1" y="1" width="6" height="6" rx="1.5" />
            <rect x="9" y="1" width="6" height="6" rx="1.5" />
            <rect x="1" y="9" width="6" height="6" rx="1.5" />
            <rect x="9" y="9" width="6" height="6" rx="1.5" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Sales",
    items: [
      {
        label: "Pipeline",
        href: "#pipeline",
        active: true,
        badge: 7,
        icon: (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <path d="M2 4h12M4 8h8M6 12h4" />
          </svg>
        ),
      },
      {
        label: "Contacts",
        href: "#contacts",
        badge: 142,
        icon: (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <circle cx="8" cy="5" r="3" />
            <path d="M1 14c0-3.314 3.134-6 7-6s7 2.686 7 6" />
          </svg>
        ),
      },
      {
        label: "Companies",
        href: "#companies",
        icon: (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <rect x="2" y="5" width="12" height="9" rx="1" />
            <path d="M5 5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        ),
      },
      {
        label: "Activities",
        href: "#activities",
        icon: (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <circle cx="8" cy="8" r="6" />
            <polyline points="8,4 8,8 11,10" />
          </svg>
        ),
      },
    ],
  },
];

// ── Page ──────────────────────────────────────────────────────
export default function CRMPipeline() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 64 : 220;

  const sidebar = (
    <Sidebar
      logo={
        !collapsed ? (
          <span className="text-[14px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text)" }}>
            CRM
          </span>
        ) : null
      }
      sections={sidebarSections}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      footer={
        !collapsed ? (
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold"
              style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
            >
              AS
            </div>
            <div>
              <p className="text-[13px] font-medium" style={{ color: "var(--text)" }}>Ana Souza</p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Sales lead</p>
            </div>
          </div>
        ) : null
      }
    />
  );

  const totalPipeline = samplePipeline
    .flatMap((col) => col.deals)
    .reduce((acc, d) => acc + parseFloat(d.amount.replace(/[$,]/g, "")), 0);

  return (
    <PageShell sidebar={sidebar} sidebarWidth={sidebarWidth}>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <SectionHeader
            label="Pipeline"
            title="Deals"
            subtitle={`$${(totalPipeline / 1000).toFixed(0)}k total pipeline · ${samplePipeline.flatMap((c) => c.deals).length} deals`}
          />
          <div className="flex gap-2 flex-wrap">
            {samplePipeline.map((col) => (
              <Badge key={col.id} variant={stageVariant[col.id]}>
                {col.label}: {col.deals.length}
              </Badge>
            ))}
          </div>
        </div>

        {/* Kanban — horizontal scroll on mobile */}
        <div className="overflow-x-auto pb-4 -mx-6 px-6">
          <div className="flex gap-3 min-w-max">
            {samplePipeline.map((col) => (
              <PipelineCol key={col.id} col={col} />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
