import { type ReactNode, useState, useEffect, useRef } from "react";
import { useHash } from "../router/Router";
import { OPS_ROUTES } from "../data/routes";
import { useOps } from "../context/OpsContext";
import {
  FolderOpen,
  ListTodo,
  Workflow,
  Users,
  ShieldCheck,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const SIDEBAR_ICONS: Record<string, ReactNode> = {
  "/projects": <FolderOpen size={18} />,
  "/tasks": <ListTodo size={18} />,
  "/pipeline": <Workflow size={18} />,
  "/agents": <Users size={18} />,
  "/quality": <ShieldCheck size={18} />,
};

const opsStyles = `
.ops-layout{display:grid;min-height:calc(100vh - 56px);position:relative;transition:grid-template-columns .3s cubic-bezier(0.22,1,0.36,1)}
.ops-layout.expanded{grid-template-columns:232px 1fr}
.ops-layout.collapsed{grid-template-columns:64px 1fr}
.ops-sidebar{position:sticky;top:68px;height:calc(100vh - 80px);
  margin:12px 0 12px 12px;padding:16px 8px;
  display:flex;flex-direction:column;gap:2px;overflow:hidden;
  border-radius:14px;transition:all .3s cubic-bezier(0.22,1,0.36,1);
  backdrop-filter:blur(24px) saturate(1.8);-webkit-backdrop-filter:blur(24px) saturate(1.8);
  background:color-mix(in srgb, var(--bg-elevated) 88%, transparent);
  border:1px solid color-mix(in srgb, var(--text-muted) 15%, transparent);
  box-shadow:0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)}
.ops-sidebar::after{content:'';position:absolute;bottom:0;left:0;right:0;height:48px;
  background:linear-gradient(to bottom, transparent, color-mix(in srgb, var(--bg-elevated) 40%, transparent));
  border-radius:0 0 14px 14px;pointer-events:none}
.ops-sidebar.expanded{padding:20px 12px}
.ops-sidebar-brand{padding:8px 12px 16px;margin-bottom:4px;border-bottom:1px solid var(--border);
  white-space:nowrap;overflow:hidden}
.ops-sidebar-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;
  font-size:13px;color:var(--text-secondary);cursor:pointer;transition:all .2s;text-decoration:none;
  font-family:'Inter',-apple-system,sans-serif;border:none;background:none;width:100%;text-align:left;
  white-space:nowrap;overflow:hidden}
.ops-sidebar-item:hover{background:var(--bg-elevated);color:var(--text)}
.ops-sidebar-item.active{background:var(--accent-glow);color:var(--accent);font-weight:600;
  box-shadow:inset 0 0 12px color-mix(in srgb, var(--accent) 8%, transparent)}
.ops-sidebar.collapsed .ops-sidebar-item{justify-content:center;padding:9px 0}
.ops-sidebar.collapsed .ops-sidebar-item span{display:none}
.ops-sidebar.collapsed .ops-sidebar-brand{text-align:center;padding:8px 4px 16px}
.ops-sidebar.collapsed .ops-sidebar-brand>span:last-child{display:none}
.ops-collapse-btn{display:flex;align-items:center;justify-content:center;background:none;border:none;
  cursor:pointer;color:var(--text-muted);padding:6px;border-radius:8px;transition:all .2s;margin-top:auto}
.ops-collapse-btn:hover{color:var(--text);background:var(--bg-elevated)}
.ops-sidebar-footer{padding:8px 12px 4px;border-top:1px solid var(--border);white-space:nowrap;overflow:hidden;margin-top:auto}
.ops-sidebar-footer-collapsed{display:flex;flex-direction:column;align-items:center;gap:6px;
  padding:8px 0 4px;border-top:1px solid var(--border);margin-top:auto}
.ops-content{padding:32px 40px 32px;overflow-y:auto;min-height:calc(100vh - 56px)}
.ops-mobile-toggle{display:none;position:fixed;bottom:20px;right:20px;z-index:90;width:44px;height:44px;
  border-radius:12px;background:var(--accent);color:#fff;border:none;cursor:pointer;
  box-shadow:0 4px 20px rgba(0,0,0,0.3);align-items:center;justify-content:center}
.ops-mobile-overlay{display:none;position:fixed;inset:0;z-index:88;background:rgba(0,0,0,0.5)}
.ops-agent-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.ops-agent-dot.active{background:var(--success, #22c55e)}
.ops-agent-dot.idle{background:color-mix(in srgb, var(--text-muted) 60%, transparent)}
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
  .ops-content{padding:24px 16px 32px}
  .ops-collapse-btn{display:none}
}
`;

export function OpsLayout({ children }: { children: ReactNode }) {
  const hash = useHash();
  const { agents, isLive } = useOps();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [pinned, setPinned] = useState(false);

  const expandTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeCount = agents.agents.filter((a) => a.status === "active").length;
  const totalCount = agents.agents.length;
  const agentLabel = activeCount > 0 ? `${activeCount} active` : `${totalCount || 7} agents`;
  const hasActiveAgents = activeCount > 0;

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

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (expandTimer.current) clearTimeout(expandTimer.current);
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
    };
  }, []);

  const handleMouseEnter = () => {
    // Skip auto-expand on mobile or when pinned
    if (mobileOpen || pinned) return;
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }
    expandTimer.current = setTimeout(() => setCollapsed(false), 300);
  };

  const handleMouseLeave = () => {
    // Skip auto-collapse on mobile or when pinned
    if (mobileOpen || pinned) return;
    if (expandTimer.current) {
      clearTimeout(expandTimer.current);
      expandTimer.current = null;
    }
    collapseTimer.current = setTimeout(() => setCollapsed(true), 200);
  };

  const handleCollapseClick = () => {
    const next = !collapsed;
    setCollapsed(next);
    // Pin the state so hover doesn't override it
    setPinned(true);
    // Clear any pending timers
    if (expandTimer.current) { clearTimeout(expandTimer.current); expandTimer.current = null; }
    if (collapseTimer.current) { clearTimeout(collapseTimer.current); collapseTimer.current = null; }
  };

  return (
    <>
      <style>{opsStyles}</style>
      <div className={`ops-layout ${collapsed ? "collapsed" : "expanded"}`}>
        {/* Sidebar */}
        <nav
          className={`ops-sidebar ${collapsed ? "collapsed" : "expanded"}${mobileOpen ? " open" : ""}`}
          aria-label="OPS navigation"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Brand */}
          <div className="ops-sidebar-brand">
            {collapsed ? (
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--accent)", fontWeight: 800, fontSize: 14,
                fontFamily: "var(--font-body)",
              }}>
                A
              </div>
            ) : (
              <>
                <span style={{ fontFamily: "'Inter',-apple-system,sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text)", letterSpacing: "-0.02em" }}>
                  APEX
                </span>
                <span style={{ color: "var(--text-muted)", fontWeight: 300, marginLeft: 5, fontSize: 12, letterSpacing: "0.04em" }}>
                  OPS
                </span>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                  Pipeline Command Center
                </div>
              </>
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
            onClick={handleCollapseClick}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>

          {/* Footer */}
          {collapsed ? (
            <div className="ops-sidebar-footer-collapsed">
              <div
                className={`ops-agent-dot ${hasActiveAgents || isLive ? "active" : "idle"}`}
                title={isLive ? `${agentLabel} online` : "No live agents"}
              />
              <div style={{ fontSize: 9, color: "var(--text-muted)", writingMode: "vertical-rl", letterSpacing: "0.05em" }}>
                v5.23
              </div>
            </div>
          ) : (
            <div className="ops-sidebar-footer">
              <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>v5.23.0</span>
                <span style={{ margin: "0 6px" }}>·</span>
                {agentLabel} {isLive ? "online" : "offline"}
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
