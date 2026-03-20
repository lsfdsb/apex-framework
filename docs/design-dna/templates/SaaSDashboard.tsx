// Copy this file into your app and customize
// Visual reference: docs/design-dna/saas.html
// DNA palette: bg=#09090b, accent=#3b82f6, sidebar 220px, stats 4-col grid

"use client";

import React, { useState } from "react";
import { PageShell, Sidebar } from "../starters/layout";
import { SectionHeader, Card, Badge, DataTable } from "../starters/primitives";

// ── Types ─────────────────────────────────────────────────────
interface StatCard {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  sparkline: number[];
}

interface ActivityRow {
  id: string;
  user: string;
  email: string;
  plan: string;
  status: "active" | "inactive" | "pending";
  mrr: string;
}

// ── Sample data ───────────────────────────────────────────────
const sampleStats: StatCard[] = [
  { label: "MRR", value: "$48,320", delta: "+12.4%", trend: "up", sparkline: [4, 6, 5, 8, 7, 10, 9, 12] },
  { label: "Active users", value: "3,241", delta: "+8.1%", trend: "up", sparkline: [3, 4, 4, 5, 6, 5, 7, 8] },
  { label: "Churn rate", value: "1.8%", delta: "-0.4%", trend: "up", sparkline: [4, 3, 4, 3, 3, 2, 2, 2] },
  { label: "Avg session", value: "4m 12s", delta: "+23s", trend: "up", sparkline: [2, 3, 3, 4, 3, 4, 5, 5] },
];

const sampleActivity: ActivityRow[] = [
  { id: "1", user: "Ana Souza", email: "ana@forma.io", plan: "Pro", status: "active", mrr: "$99" },
  { id: "2", user: "Marcus Chen", email: "m@relay.com", plan: "Team", status: "active", mrr: "$299" },
  { id: "3", user: "Priya Nair", email: "priya@inkline.co", plan: "Starter", status: "pending", mrr: "$29" },
  { id: "4", user: "James Obi", email: "james@beacon.io", plan: "Pro", status: "inactive", mrr: "$99" },
  { id: "5", user: "Sara Lima", email: "sara@drift.app", plan: "Enterprise", status: "active", mrr: "$999" },
];

const chartBars = [40, 55, 48, 70, 62, 85, 78, 90, 72, 95, 88, 100];
const chartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ── Sub-components ────────────────────────────────────────────
function StatItem({ stat }: { stat: StatCard }) {
  const max = Math.max(...stat.sparkline);
  return (
    <Card hover className="p-5">
      <Card.Body>
        <p className="text-[11px] uppercase tracking-[0.05em] mb-2" style={{ color: "var(--text-muted)" }}>
          {stat.label}
        </p>
        <p className="text-[28px] font-bold tracking-[-0.03em]" style={{ color: "var(--text)" }}>
          {stat.value}
        </p>
        <p
          className="text-[12px] mt-1.5"
          style={{ color: stat.trend === "up" ? "var(--success)" : "var(--destructive)" }}
        >
          {stat.delta} vs last month
        </p>
        <div className="flex items-end gap-0.5 mt-3 h-6">
          {stat.sparkline.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm transition-colors"
              style={{
                height: `${(v / max) * 100}%`,
                minHeight: 3,
                background: "var(--accent-glow)",
              }}
            />
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}

const sidebarSections = [
  {
    items: [
      {
        label: "Overview",
        href: "#overview",
        active: true,
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
    title: "Product",
    items: [
      {
        label: "Users",
        href: "#users",
        badge: 3241,
        icon: (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <circle cx="8" cy="5" r="3" />
            <path d="M1 14c0-3.314 3.134-6 7-6s7 2.686 7 6" />
          </svg>
        ),
      },
      {
        label: "Analytics",
        href: "#analytics",
        icon: (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <polyline points="1,12 5,7 9,9 15,3" />
          </svg>
        ),
      },
      {
        label: "Billing",
        href: "#billing",
        icon: (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <rect x="1" y="3" width="14" height="10" rx="2" />
            <line x1="1" y1="7" x2="15" y2="7" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        label: "Settings",
        href: "#settings",
        icon: (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <circle cx="8" cy="8" r="2.5" />
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5 13 13M3 13l1.5-1.5M11.5 4.5 13 3" />
          </svg>
        ),
      },
    ],
  },
];

const statusVariant: Record<ActivityRow["status"], "success" | "default" | "warning"> = {
  active: "success",
  inactive: "default",
  pending: "warning",
};

const tableColumns = [
  {
    key: "user" as const,
    label: "User",
    render: (v: unknown, row: ActivityRow) => (
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
          style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
        >
          {row.user.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-[13px] font-medium" style={{ color: "var(--text)" }}>
            {row.user}
          </p>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {row.email}
          </p>
        </div>
      </div>
    ),
  },
  { key: "plan" as const, label: "Plan" },
  {
    key: "status" as const,
    label: "Status",
    render: (v: unknown, row: ActivityRow) => (
      <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
    ),
  },
  { key: "mrr" as const, label: "MRR" },
];

// ── Page ──────────────────────────────────────────────────────
export default function SaaSDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 64 : 220;

  const sidebar = (
    <Sidebar
      logo={
        <span className="text-[14px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text)" }}>
          {!collapsed && "Acme"}
        </span>
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
              JD
            </div>
            <div>
              <p className="text-[13px] font-medium" style={{ color: "var(--text)" }}>
                Jane Doe
              </p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Admin
              </p>
            </div>
          </div>
        ) : null
      }
    />
  );

  return (
    <PageShell sidebar={sidebar} sidebarWidth={sidebarWidth}>
      <div className="space-y-8">
        <SectionHeader label="Dashboard" title="Overview" subtitle="Your product at a glance." />

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {sampleStats.map((s) => (
            <StatItem key={s.label} stat={s} />
          ))}
        </div>

        {/* Revenue chart */}
        <Card hover={false}>
          <Card.Body>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>
                Revenue
              </h3>
              <Badge variant="accent">This year</Badge>
            </div>
            <div className="flex items-end gap-1.5 h-40">
              {chartBars.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t transition-colors hover:opacity-80"
                    style={{ height: `${h}%`, background: "var(--accent-glow)" }}
                    title={`${chartLabels[i]}: ${h}%`}
                  />
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {chartLabels[i]}
                  </span>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Recent users table */}
        <div>
          <SectionHeader title="Recent users" subtitle="Latest signups and activity." />
          <DataTable<ActivityRow>
            columns={tableColumns}
            rows={sampleActivity}
            rowKey="id"
          />
        </div>
      </div>
    </PageShell>
  );
}
