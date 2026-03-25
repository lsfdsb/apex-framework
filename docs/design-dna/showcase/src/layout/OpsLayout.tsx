import { type ReactNode, useState, useEffect } from "react";
import { useHash } from "../router/Router";
import { OPS_ROUTES } from "../data/routes";
import { Workflow, ListTodo, Users, ShieldCheck, Menu, X } from "lucide-react";

const SIDEBAR_ICONS: Record<string, ReactNode> = {
  "/pipeline": <Workflow size={18} />,
  "/tasks": <ListTodo size={18} />,
  "/agents": <Users size={18} />,
  "/quality": <ShieldCheck size={18} />,
};

const opsStyles = `
.ops-layout{display:grid;grid-template-columns:220px 1fr;min-height:calc(100vh - 56px);position:relative}
.ops-sidebar{position:sticky;top:56px;height:calc(100vh - 56px);border-right:1px solid var(--border);
  padding:20px 12px;display:flex;flex-direction:column;gap:2px;overflow-y:auto;background:var(--bg)}
.ops-sidebar-brand{padding:8px 12px 16px;margin-bottom:4px;border-bottom:1px solid var(--border)}
.ops-sidebar-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;
  font-size:13px;color:var(--text-secondary);cursor:pointer;transition:all .2s;text-decoration:none;
  font-family:'Inter',-apple-system,sans-serif;border:none;background:none;width:100%;text-align:left}
.ops-sidebar-item:hover{background:var(--bg-elevated);color:var(--text)}
.ops-sidebar-item.active{background:var(--accent-glow);color:var(--accent);font-weight:600}
.ops-content{padding:32px 40px 80px;overflow-y:auto;min-height:0}
.ops-mobile-toggle{display:none;position:fixed;bottom:20px;right:20px;z-index:90;width:44px;height:44px;
  border-radius:12px;background:var(--accent);color:#fff;border:none;cursor:pointer;
  box-shadow:0 4px 20px rgba(0,0,0,0.3);align-items:center;justify-content:center}
.ops-mobile-overlay{display:none;position:fixed;inset:0;z-index:88;background:rgba(0,0,0,0.5)}
@media(max-width:768px){
  .ops-layout{grid-template-columns:1fr}
  .ops-sidebar{display:none;position:fixed;top:56px;left:0;bottom:0;z-index:89;width:240px;
    box-shadow:4px 0 24px rgba(0,0,0,0.3)}
  .ops-sidebar.open{display:flex}
  .ops-mobile-toggle{display:flex}
  .ops-mobile-overlay.open{display:block}
  .ops-content{padding:24px 16px 80px}
}
`;

export function OpsLayout({ children }: { children: ReactNode }) {
  const hash = useHash();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on route change
  const [prevHash, setPrevHash] = useState(hash);
  if (prevHash !== hash) {
    setPrevHash(hash);
    if (mobileOpen) setMobileOpen(false);
  }

  // Close on escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <>
      <style>{opsStyles}</style>
      <div className="ops-layout">
        {/* Sidebar */}
        <nav className={`ops-sidebar${mobileOpen ? " open" : ""}`} aria-label="OPS navigation">
          <div className="ops-sidebar-brand">
            <span style={{ fontFamily: "'Inter',-apple-system,sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text)", letterSpacing: "-0.02em" }}>
              APEX
              <span style={{ color: "var(--text-muted)", fontWeight: 300, marginLeft: 5, fontSize: 12, letterSpacing: "0.04em" }}>
                OPS
              </span>
            </span>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
              Pipeline Command Center
            </div>
          </div>

          {OPS_ROUTES.map((route) => (
            <a
              key={route.path}
              href={`#${route.path}`}
              className={`ops-sidebar-item${hash === route.path ? " active" : ""}`}
            >
              {SIDEBAR_ICONS[route.path]}
              {route.label}
            </a>
          ))}

          {/* Bottom section */}
          <div style={{ marginTop: "auto", padding: "16px 12px 4px", borderTop: "1px solid var(--border)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>v5.22.0</span>
              <span style={{ margin: "0 6px" }}>·</span>
              5 agents online
            </div>
          </div>
        </nav>

        {/* Mobile overlay */}
        <div
          className={`ops-mobile-overlay${mobileOpen ? " open" : ""}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Mobile toggle */}
        <button
          className="ops-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle sidebar"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Content */}
        <main className="ops-content">
          {children}
        </main>
      </div>
    </>
  );
}
