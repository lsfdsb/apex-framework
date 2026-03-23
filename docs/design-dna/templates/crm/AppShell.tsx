// App Shell — floating sidebar + content area
// Logo: initial letter + accent dot (e.g. "P." when collapsed)
// Zero external dependencies

import React, { useState } from "react";

type NavId = "dashboard" | "contacts" | "deals" | "analytics" | "messages" | "settings";

interface AppShellProps {
  children: React.ReactNode;
  activeItem?: NavId;
  messageBadge?: number;
  appInitial?: string;
}

const ICONS: Record<NavId, React.ReactNode> = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
  contacts: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>,
  deals: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>,
  analytics: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  messages: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.2.65.77 1.09 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>,
};

function NavBtn({ id, active, badge, onClick }: { id: NavId; active: boolean; badge?: number; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={id} style={{
      position: "relative", width: 40, height: 40, borderRadius: 10, border: "none", margin: "1px auto",
      background: active ? "var(--accent-glow)" : "transparent",
      color: active ? "var(--accent)" : "var(--text-muted)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", transition: "all .25s cubic-bezier(.22,1,.36,1)",
    }}>
      {active && <span style={{ position: "absolute", left: -8, top: "25%", bottom: "25%", width: 3, borderRadius: "0 3px 3px 0", background: "var(--accent)" }} />}
      <span style={{ width: 18, height: 18, display: "flex" }}>{ICONS[id]}</span>
      {badge != null && badge > 0 && (
        <span style={{ position: "absolute", top: 2, right: 2, fontSize: 9, padding: "1px 4px", borderRadius: 999, background: "var(--destructive)", color: "white", fontWeight: 600, minWidth: 16, textAlign: "center", lineHeight: 1.4 }}>{badge > 99 ? "99+" : badge}</span>
      )}
    </button>
  );
}

export default function AppShell({ children, activeItem = "dashboard", messageBadge = 3, appInitial = "P" }: AppShellProps) {
  const [active, setActive] = useState<NavId>(activeItem);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
      <aside style={{
        position: "fixed", left: 12, top: 12, bottom: 12, width: 56, borderRadius: 16, zIndex: 100,
        background: "var(--nav-bg, rgba(8,8,10,.75))",
        backdropFilter: "blur(20px) saturate(1.4)", WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        border: "1px solid var(--border)",
        display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0", gap: 2,
      }}>
        {/* Logo: initial + accent dot */}
        <div style={{ marginBottom: 16, flexShrink: 0, textAlign: "center", cursor: "pointer" }}>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>{appInitial}</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>.</span>
        </div>

        {(["dashboard", "contacts", "deals", "analytics"] as NavId[]).map((id) => (
          <NavBtn key={id} id={id} active={active === id} onClick={() => setActive(id)} />
        ))}

        <div style={{ width: 24, height: 1, background: "var(--border)", margin: "6px 0", flexShrink: 0 }} />

        <NavBtn id="messages" active={active === "messages"} badge={messageBadge} onClick={() => setActive("messages")} />
        <NavBtn id="settings" active={active === "settings"} onClick={() => setActive("settings")} />
      </aside>

      <main style={{ marginLeft: 80, minHeight: "100vh", padding: "12px 12px 12px 0" }}>
        {children}
      </main>
    </div>
  );
}
