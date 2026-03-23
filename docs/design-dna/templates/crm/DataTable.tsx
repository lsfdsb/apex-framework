import React, { useState } from "react";

type Filter = "All" | "Hot" | "Warm" | "Cold";

interface Lead {
  initials: string;
  name: string;
  email: string;
  company: string;
  score: number;
  status: "Hot" | "Warm" | "Cold";
}

const LEADS: Lead[] = [
  { initials: "ER", name: "Elena Rodriguez", email: "elena@seriesb.io",    company: "Series B Startup", score: 92, status: "Hot"  },
  { initials: "JO", name: "James Okafor",    email: "j.okafor@entcorp.com", company: "Enterprise Corp",  score: 72, status: "Warm" },
  { initials: "PP", name: "Priya Patel",     email: "priya@earlystage.co",  company: "Early Stage",      score: 45, status: "Warm" },
  { initials: "AS", name: "Ana Souza",       email: "ana@fintech.co",       company: "Fintech Co",       score: 88, status: "Hot"  },
  { initials: "TH", name: "Tom Hansen",      email: "tom@unknown.com",      company: "Unknown",          score: 15, status: "Cold" },
  { initials: "MC", name: "Marcus Chen",     email: "m.chen@globalb2b.com", company: "Global B2B",       score: 58, status: "Warm" },
];

const FILTER_COUNTS: Record<Filter, number> = { All: 248, Hot: 24, Warm: 89, Cold: 135 };

const scoreColor = (status: Lead["status"]) => {
  if (status === "Hot")  return "var(--crm-success)";
  if (status === "Warm") return "var(--crm-warning)";
  return "var(--crm-muted)";
};

export default function DataTable() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState(1);

  const visible = LEADS.filter((l) => {
    const matchFilter = activeFilter === "All" || l.status === activeFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.company.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div style={styles.container}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <label style={styles.search}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14, stroke: "var(--crm-muted)", flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </label>
        <div style={styles.filters}>
          {(["All", "Hot", "Warm", "Cold"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{ ...styles.filterBtn, ...(activeFilter === f ? styles.filterBtnActive : {}) }}
            >
              {f} <span style={{ color: "var(--crm-muted)", marginLeft: 2 }}>{FILTER_COUNTS[f]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.th, width: 40 }}><input type="checkbox" style={styles.check} /></th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Company</th>
            <th style={styles.th}>Score</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((lead) => (
            <LeadRow key={lead.email} lead={lead} />
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={styles.pagination}>
        <span style={styles.paginationLabel}>Showing 1–{visible.length} of 24 leads</span>
        <div style={styles.paginationBtns}>
          {(["«", "1", "2", "3", "…", "4", "»"] as const).map((label, i) => (
            <button
              key={i}
              onClick={() => typeof label === "string" && !isNaN(Number(label)) && setActivePage(Number(label))}
              style={{ ...styles.pageBtn, ...(String(activePage) === label ? styles.pageBtnActive : {}) }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ backgroundColor: hovered ? "var(--crm-surface)" : "transparent", transition: "background 0.15s" }}
    >
      <td style={styles.td}><input type="checkbox" style={styles.check} /></td>
      <td style={{ ...styles.td, display: "flex", alignItems: "center" }}>
        <span style={styles.avatar}>{lead.initials}</span>
        {lead.name}
      </td>
      <td style={{ ...styles.td, color: "var(--crm-secondary)" }}>{lead.email}</td>
      <td style={{ ...styles.td, color: "var(--crm-secondary)" }}>{lead.company}</td>
      <td style={{ ...styles.td, fontWeight: 600, color: scoreColor(lead.status) }}>{lead.score}</td>
      <td style={styles.td}><span style={{ ...styles.badge, ...badgeStyle(lead.status) }}>{lead.status}</span></td>
    </tr>
  );
}

const badgeStyle = (status: Lead["status"]): React.CSSProperties => {
  if (status === "Hot")  return { background: "rgba(248,113,113,0.1)",  color: "var(--crm-destructive)" };
  if (status === "Warm") return { background: "rgba(251,191,36,0.1)",   color: "var(--crm-warning)" };
  return                        { background: "rgba(96,165,250,0.1)",   color: "var(--crm-info)" };
};

const styles: Record<string, React.CSSProperties> = {
  container: { background: "var(--crm-elevated)", border: "1px solid var(--crm-border)", borderRadius: 12, overflow: "hidden", fontFamily: "var(--crm-font)" },
  toolbar:   { padding: "16px 20px", borderBottom: "1px solid var(--crm-border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  search:    { display: "flex", alignItems: "center", gap: 8, background: "var(--crm-bg)", border: "1px solid var(--crm-border)", borderRadius: 8, padding: "6px 12px", minWidth: 260 },
  searchInput: { border: "none", background: "none", color: "var(--crm-text)", fontSize: 13, outline: "none", width: "100%" },
  filters:   { display: "flex", gap: 8 },
  filterBtn: { fontSize: 12, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--crm-border)", background: "none", color: "var(--crm-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 0.2s" },
  filterBtnActive: { background: "var(--crm-accent-glow)", borderColor: "var(--crm-accent)", color: "var(--crm-accent)" },
  table:     { width: "100%", borderCollapse: "collapse" },
  th:        { padding: "10px 20px", textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--crm-muted)", fontWeight: 500, borderBottom: "1px solid var(--crm-border)", background: "var(--crm-surface)" },
  td:        { padding: "14px 20px", fontSize: 13, borderBottom: "1px solid var(--crm-border)" },
  avatar:    { width: 28, height: 28, borderRadius: "50%", background: "var(--crm-accent-glow)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "var(--crm-accent)", marginRight: 10, flexShrink: 0 },
  check:     { width: 16, height: 16, borderRadius: 4, cursor: "pointer", verticalAlign: "middle" },
  badge:     { fontSize: 11, padding: "2px 8px", borderRadius: 999, fontWeight: 500 },
  pagination:      { padding: "12px 20px", borderTop: "1px solid var(--crm-border)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  paginationLabel: { fontSize: 12, color: "var(--crm-muted)" },
  paginationBtns:  { display: "flex", gap: 4 },
  pageBtn:         { width: 32, height: 32, borderRadius: 8, border: "1px solid var(--crm-border)", background: "none", color: "var(--crm-secondary)", cursor: "pointer", fontSize: 12, transition: "all 0.15s" },
  pageBtnActive:   { background: "var(--crm-accent)", color: "white", borderColor: "var(--crm-accent)" },
};

/*
  Required CSS variables (add to your globals.css or parent scope):

  --crm-bg:           #08080a
  --crm-elevated:     #111114
  --crm-surface:      #19191d
  --crm-border:       #222228
  --crm-text:         #ececf0
  --crm-secondary:    #8a8a96
  --crm-muted:        #55555e
  --crm-accent:       #636bf0
  --crm-accent-glow:  rgba(99,107,240,0.12)
  --crm-success:      #34d399
  --crm-warning:      #fbbf24
  --crm-destructive:  #f87171
  --crm-info:         #60a5fa
  --crm-font:         'Inter', -apple-system, sans-serif
*/
