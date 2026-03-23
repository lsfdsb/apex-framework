import { Link } from "../router/Router";
import { TEMPLATE_ROUTES } from "../data/routes";

interface ShowcaseNavProps {
  activePath: string;
}

const navStyles = `
.apex-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:8px 16px}
.apex-nav-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;height:40px;padding:0 12px;
  border-radius:12px;background:color-mix(in srgb, var(--bg-elevated) 80%, transparent);
  backdrop-filter:blur(24px) saturate(1.8);-webkit-backdrop-filter:blur(24px) saturate(1.8);
  border:1px solid color-mix(in srgb, var(--text-muted) 12%, transparent);
  box-shadow:0 2px 16px rgba(0,0,0,0.12),inset 0 1px 0 rgba(255,255,255,0.02);
  transition:background .4s,border-color .4s}
.apex-nav-links{display:flex;gap:1px;overflow-x:auto;-webkit-overflow-scrolling:touch;
  scrollbar-width:none;mask-image:linear-gradient(90deg,transparent,#000 8px,#000 calc(100% - 8px),transparent);
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 8px,#000 calc(100% - 8px),transparent);
  padding:0 4px}
.apex-nav-links::-webkit-scrollbar{display:none}
.apex-nav-link{font-family:'Inter',-apple-system,sans-serif;font-size:11px;color:var(--text-muted);
  text-decoration:none;padding:5px 8px;border-radius:8px;transition:all .25s cubic-bezier(0.22,1,0.36,1);
  flex-shrink:0;white-space:nowrap;letter-spacing:0.01em}
.apex-nav-link:hover{color:var(--text);background:color-mix(in srgb, var(--accent-glow) 60%, transparent)}
.apex-nav-link.active{color:var(--accent);background:var(--accent-glow);font-weight:600}
@media(max-width:768px){.apex-nav{padding:6px 8px}.apex-nav-link{font-size:10px;padding:4px 6px}}
`;

export function ShowcaseNav({ activePath }: ShowcaseNavProps) {
  return (
    <>
      <style>{navStyles}</style>
      <div className="apex-nav">
        <div className="apex-nav-inner">
          <Link
            to="/"
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontWeight: 700,
              fontSize: 12,
              textDecoration: "none",
              color: activePath === "/" ? "var(--accent)" : "var(--text)",
              letterSpacing: "-0.02em",
              flexShrink: 0,
              padding: "5px 10px 5px 4px",
              whiteSpace: "nowrap",
            }}
          >
            APEX
            <span style={{ color: "var(--text-muted)", fontWeight: 300, marginLeft: 3, fontSize: 10, letterSpacing: "0.04em" }}>
              DNA
            </span>
          </Link>

          <div
            style={{
              width: 1,
              height: 12,
              background: "var(--border)",
              flexShrink: 0,
              margin: "0 4px",
              opacity: 0.4,
            }}
          />

          <div className="apex-nav-links">
            {TEMPLATE_ROUTES.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={`apex-nav-link${activePath === route.path ? " active" : ""}`}
              >
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
