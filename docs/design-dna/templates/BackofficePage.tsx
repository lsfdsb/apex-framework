// Copy this file into your app and customize
// Visual reference: docs/design-dna/backoffice.html
// DNA palette: bg=var(--bg), accent=var(--accent), data-dense layout with sidebar

"use client";

import React, { useState } from "react";
import { PageShell, Sidebar } from "../starters/layout";
import { SectionHeader, Badge, Button, Input, DataTable } from "../starters/primitives";

// ── Types ─────────────────────────────────────────────────────
type UserRole = "admin" | "editor" | "viewer";
type UserStatus = "active" | "suspended" | "pending";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
  lastSeen: string;
}

// ── Sample data ───────────────────────────────────────────────
const sampleUsers: UserRow[] = [
  { id: "u1", name: "Ana Souza", email: "ana@forma.io", role: "admin", status: "active", joined: "Jan 12, 2026", lastSeen: "Today" },
  { id: "u2", name: "Marcus Chen", email: "m@relay.com", role: "editor", status: "active", joined: "Feb 3, 2026", lastSeen: "Yesterday" },
  { id: "u3", name: "Priya Nair", email: "priya@inkline.co", role: "viewer", status: "pending", joined: "Mar 1, 2026", lastSeen: "Never" },
  { id: "u4", name: "James Obi", email: "james@beacon.io", role: "editor", status: "suspended", joined: "Nov 20, 2025", lastSeen: "Mar 5" },
  { id: "u5", name: "Sara Lima", email: "sara@drift.app", role: "admin", status: "active", joined: "Dec 8, 2025", lastSeen: "Today" },
  { id: "u6", name: "Tom Park", email: "tom@arc.studio", role: "viewer", status: "active", joined: "Mar 15, 2026", lastSeen: "Today" },
];

const roleVariant: Record<UserRole, "accent" | "info" | "default"> = {
  admin: "accent",
  editor: "info",
  viewer: "default",
};

const statusVariant: Record<UserStatus, "success" | "warning" | "error"> = {
  active: "success",
  pending: "warning",
  suspended: "error",
};

// ── Sidebar config ────────────────────────────────────────────
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
    title: "Management",
    items: [
      {
        label: "Users",
        href: "#users",
        active: true,
        badge: sampleUsers.length,
        icon: (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <circle cx="8" cy="5" r="3" />
            <path d="M1 14c0-3.314 3.134-6 7-6s7 2.686 7 6" />
          </svg>
        ),
      },
      {
        label: "Roles",
        href: "#roles",
        icon: (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <circle cx="8" cy="8" r="6" />
            <path d="M8 5v3l2 1" />
          </svg>
        ),
      },
      {
        label: "Activity log",
        href: "#activity",
        icon: (
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <path d="M3 4h10M3 8h7M3 12h5" />
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
    title: "System",
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

// ── Table columns ─────────────────────────────────────────────
const tableColumns = [
  {
    key: "name" as const,
    label: "User",
    render: (_: unknown, row: UserRow) => (
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
          style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
        >
          {row.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-[13px] font-medium" style={{ color: "var(--text)" }}>
            {row.name}
          </p>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {row.email}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "role" as const,
    label: "Role",
    render: (_: unknown, row: UserRow) => (
      <Badge variant={roleVariant[row.role]}>{row.role}</Badge>
    ),
  },
  {
    key: "status" as const,
    label: "Status",
    render: (_: unknown, row: UserRow) => (
      <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
    ),
  },
  { key: "joined" as const, label: "Joined" },
  { key: "lastSeen" as const, label: "Last seen" },
  {
    key: "id" as const,
    label: "Actions",
    render: () => (
      <div className="flex gap-1">
        <button
          className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors"
          style={{ color: "var(--text-secondary)", background: "var(--bg-surface)" }}
        >
          Edit
        </button>
        <button
          className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors"
          style={{ color: "var(--destructive)", background: "transparent" }}
        >
          Remove
        </button>
      </div>
    ),
  },
];

// ── Page ──────────────────────────────────────────────────────
export default function BackofficePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const sidebarWidth = collapsed ? 64 : 220;

  const filtered = sampleUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  function toggleAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((u) => u.id)));
    }
  }

  const sidebar = (
    <Sidebar
      logo={
        !collapsed ? (
          <span className="text-[14px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text)" }}>
            Backoffice
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
              SA
            </div>
            <div>
              <p className="text-[13px] font-medium" style={{ color: "var(--text)" }}>
                Sara Lima
              </p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Super admin
              </p>
            </div>
          </div>
        ) : null
      }
    />
  );

  return (
    <PageShell sidebar={sidebar} sidebarWidth={sidebarWidth}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SectionHeader
            label="Management"
            title="Users"
            subtitle={`${sampleUsers.length} total · ${sampleUsers.filter((u) => u.status === "active").length} active`}
          />
          <Button variant="primary" size="sm">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <line x1="8" y1="2" x2="8" y2="14" />
              <line x1="2" y1="8" x2="14" y2="8" />
            </svg>
            Invite user
          </Button>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-sm"
            aria-label="Search users"
          />
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">All roles</Button>
            <Button variant="ghost" size="sm">All statuses</Button>
          </div>
        </div>

        {/* Bulk action bar */}
        {selectedIds.size > 0 && (
          <div
            className="flex items-center gap-4 px-4 py-3 rounded-[var(--radius-sm)] border"
            style={{ background: "var(--accent-glow)", borderColor: "var(--accent)" }}
          >
            <span className="text-[13px] font-medium" style={{ color: "var(--accent)" }}>
              {selectedIds.size} selected
            </span>
            <Button variant="ghost" size="sm">Suspend</Button>
            <Button variant="ghost" size="sm">Export</Button>
            <button
              className="ml-auto text-[12px]"
              style={{ color: "var(--text-muted)" }}
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </button>
          </div>
        )}

        {/* Selection header */}
        <div className="flex items-center gap-3 px-1">
          <input
            type="checkbox"
            checked={selectedIds.size === filtered.length && filtered.length > 0}
            onChange={toggleAll}
            aria-label="Select all users"
            className="w-4 h-4 rounded"
          />
          <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            Select all ({filtered.length})
          </span>
        </div>

        {/* Data table */}
        <DataTable<UserRow>
          columns={tableColumns}
          rows={filtered}
          rowKey="id"
          onRowClick={(row) => {
            const next = new Set(selectedIds);
            if (next.has(row.id)) next.delete(row.id);
            else next.add(row.id);
            setSelectedIds(next);
          }}
        />

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
              No users match &ldquo;{search}&rdquo;
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
