import React, { useState } from "react";

const styles: Record<string, React.CSSProperties> = {
  profile: {
    background: "var(--bg-elevated)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    maxWidth: 880,
    margin: "0 auto",
  },
  profileTop: {
    padding: 32,
    display: "flex",
    gap: 24,
    alignItems: "flex-start",
    borderBottom: "1px solid var(--border)",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "var(--accent-glow)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: 700,
    color: "var(--accent)",
    flexShrink: 0,
    border: "2px solid var(--border)",
  },
  info: { flex: 1 },
  name: { fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 2 },
  role: { fontSize: 14, color: "var(--text-secondary)", marginBottom: 12 },
  meta: { display: "flex", gap: 24 },
  metaItem: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)" },
  tabs: { display: "flex", borderBottom: "1px solid var(--border)" },
  tab: {
    padding: "12px 20px",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text-muted)",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: { color: "var(--accent)", borderBottomColor: "var(--accent)" },
  content: { padding: "24px 32px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  statCard: { background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", padding: 20 },
  statLabel: { fontSize: 12, color: "var(--text-muted)", marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em" },
  statChange: { fontSize: 12, marginTop: 4 },
  statUp: { color: "var(--success)" },
  statDown: { color: "var(--destructive)" },
};

const EmailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const TABS = ["Overview", "Deals (12)", "Activity", "Emails", "Notes"];

const STATS = [
  { label: "Total Revenue", value: "$184k", change: "↑ 23% vs last quarter", up: true },
  { label: "Win Rate", value: "94%", change: "↑ 8% improvement", up: true },
  { label: "Avg. Deal Size", value: "$15.3k", change: "↑ 12% growth", up: true },
  { label: "Avg. Close Time", value: "18 days", change: "↓ 3 days faster", up: false },
];

export default function ContactProfile() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={styles.profile}>
      <div style={styles.profileTop}>
        <div style={styles.avatar}>AS</div>
        <div style={styles.info}>
          <div style={styles.name}>Ana Souza</div>
          <div style={styles.role}>Product Lead at Fintech Co</div>
          <div style={styles.meta}>
            <span style={styles.metaItem}><EmailIcon />ana@fintechco.com</span>
            <span style={styles.metaItem}><PhoneIcon />+55 11 9876-5432</span>
            <span style={styles.metaItem}><LocationIcon />São Paulo, BR</span>
          </div>
        </div>
      </div>

      <div style={styles.tabs}>
        {TABS.map((tab, i) => (
          <div
            key={tab}
            style={{ ...styles.tab, ...(activeTab === i ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div style={styles.content}>
        <div style={styles.grid}>
          {STATS.map((s) => (
            <div key={s.label} style={styles.statCard}>
              <div style={styles.statLabel}>{s.label}</div>
              <div style={styles.statValue}>{s.value}</div>
              <div style={{ ...styles.statChange, ...(s.up ? styles.statUp : styles.statDown) }}>
                {s.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
