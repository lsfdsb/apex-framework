import { type ReactNode, useState, useEffect } from "react";
import { useHash } from "../router/Router";
import { OPS_ROUTES } from "../data/routes";
import { FolderOpen, ListTodo, Menu, X, ChevronsLeft, ChevronsRight } from "lucide-react";

const SIDEBAR_ICONS: Record<string, ReactNode> = {
  "/projects": <FolderOpen size={18} />,
  "/tasks": <ListTodo size={18} />,
};

const opsStyles = `
.ops-layout{display:grid;min-height:calc(100vh - 56px);position:relative;transition:grid-template-columns .3s cubic-bezier(0.22,1,0.36,1)}
.ops-layout.expanded{grid-template-columns:232px 1fr}
.ops-layout.collapsed{grid-template-columns:64px 1fr}
.ops-sidebar{position:sticky;top:68px;height:calc(100vh - 80px);
  margin:12px 0 12px 12px;padding:16px 8px;
  display:flex;flex-direction:column;gap:2px;overflow:hidden;
  border-radius:14px;transition:all .3s cubic-bezier(0.22,1,0.36,1);
  backdrop-filter:blur(20px) saturate(1.6);-webkit-backdrop-filter:blur(20px) saturate(1.6);
  background:color-mix(in srgb, var(--bg-elevated) 88%, transparent);
  border:1px solid color-mix(in srgb, var(--text-muted) 15%, transparent);
  box-shadow:0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)}
.ops-sidebar.expanded{padding:20px 12px}
.ops-sidebar-brand{padding:8px 12px 16px;margin-bottom:4px;border-bottom:1px solid var(--border);
  white-space:nowrap;overflow:hidden}
.ops-sidebar-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;
  font-size:13px;color:var(--text-secondary);cursor:pointer;transition:all .2s;text-decoration:none;
  font-family:'Inter',-apple-system,sans-serif;border:none;background:none;width:100%;text-align:left;
  white-space:nowrap;overflow:hidden}
.ops-sidebar-item:hover{background:var(--bg-elevated);color:var(--text)}
.ops-sidebar-item.active{background:var(--accent-glow);color:var(--accent);font-weight:600}
.ops-sidebar.collapsed .ops-sidebar-item{justify-content:center;padding:9px 0}
.ops-sidebar.collapsed .ops-sidebar-item span{display:none}
.ops-sidebar.collapsed .ops-sidebar-brand{text-align:center;padding:8px 4px 16px}
.ops-sidebar.collapsed .ops-sidebar-brand>span:last-child{display:none}
.ops-collapse-btn{display:flex;align-items:center;justify-content:center;background:none;border:none;
  cursor:pointer;color:var(--text-muted);padding:6px;border-radius:8px;transition:all .2s;margin-top:auto}
.ops-collapse-btn:hover{color:var(--text);background:var(--bg-elevated)}
.ops-sidebar-footer{padding:8px 12px 4px;border-top:1px solid var(--border);white-space:nowrap;overflow:hidden}
.ops-content{padding:32px 40px 80px;overflow-y:auto;min-height:0}
.ops-mobile-toggle{display:none;position:fixed;bottom:20px;right:20px;z-index:90;width:44px;height:44px;
  border-radius:12px;background:var(--accent);color:#fff;border:none;cursor:pointer;
  box-shadow:0 4px 20px rgba(0,0,0,0.3);align-items:center;justify-content:center}
.ops-mobile-overlay{display:none;position:fixed;inset:0;z-index:88;background:rgba(0,0,0,0.5)}
@media(max-width:768px){
  .ops-layout.expanded,.ops-layout.collapsed{grid-template-columns:1fr}
  .ops-sidebar{display:none;position:fixed;top:68px;left:12px;bottom:12px;z-index:89;width:240px;
    box-shadow:0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04);margin:0}
  .ops-sidebar.open{display:flex}
  .ops-sidebar.collapsed.open .ops-sidebar-item span{display:inline}
  .ops-sidebar.collapsed.open{padding:20px 12px}
  .ops-sidebar.collapsed.open .ops-sidebar-item{justify-content:flex-start;padding:9px 12px}
  .ops-mobile-toggle{display:flex}
  .ops-mobile-overlay.open{display:block}
  .ops-content{padding:24px 16px 80px}
  .ops-collapse-btn{display:none}
}
`;

export function OpsLayout({ children }: { children: ReactNode }) {
  const hash = useHash();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  // Close mobile sidebar on route change
  const [prevHash, setPrevHash] = useState(hash);
  if (prevHash !== hash) {
    setPrevHash(hash);
    if (mobileOpen) setMobileOpen(false);
  }

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <>
      <style>{opsStyles}</style>
      <div className={`ops-layout ${collapsed ? "collapsed" : "expanded"}`}>
        {/* Sidebar */}
        <nav
          className={`ops-sidebar ${collapsed ? "collapsed" : "expanded"}${mobileOpen ? " open" : ""}`}
          aria-label="OPS navigation"
        >
          <div className="ops-sidebar-brand">
            <span style={{ fontFamily: "'Inter',-apple-system,sans-serif", fontWeight: 700, fontSize: collapsed ? 16 : 14, color: "var(--text)", letterSpacing: "-0.02em" }}>
              {collapsed ? "A" : "APEX"}
            </span>
            {!collapsed && (
              <span style={{ color: "var(--text-muted)", fontWeight: 300, marginLeft: 5, fontSize: 12, letterSpacing: "0.04em" }}>
                OPS
              </span>
            )}
            {!collapsed && (
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                Pipeline Command Center
              </div>
            )}
          </div>

          {OPS_ROUTES.map((route) => (
            <a
              key={route.path}
              href={`#${route.path}`}
              className={`ops-sidebar-item${hash === route.path ? " active" : ""}`}
              aria-current={hash === route.path ? "page" : undefined}
            >
              {SIDEBAR_ICONS[route.path]}
              <span>{route.label}</span>
            </a>
          ))}

          {/* Collapse toggle */}
          <button
            className="ops-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>

          {/* Footer */}
          {!collapsed && (
            <div className="ops-sidebar-footer">
              <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>v5.22.0</span>
                <span style={{ margin: "0 6px" }}>·</span>
                5 agents online
              </div>
            </div>
          )}
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
