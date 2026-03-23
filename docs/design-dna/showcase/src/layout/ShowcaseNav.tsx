import { useState, useEffect } from "react";
import { Link } from "../router/Router";
import { TEMPLATE_ROUTES } from "../data/routes";

interface ShowcaseNavProps {
  activePath: string;
}

const navStyles = `
.apex-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:10px 20px;transition:padding .4s cubic-bezier(0.22,1,0.36,1);display:flex;justify-content:center}
.apex-nav.scrolled{padding:6px 20px}
.apex-nav-inner{display:inline-flex;align-items:center;height:42px;padding:0 16px;
  border-radius:14px;backdrop-filter:blur(20px) saturate(1.6);-webkit-backdrop-filter:blur(20px) saturate(1.6);
  transition:all .4s cubic-bezier(0.22,1,0.36,1)}
.apex-nav-links{display:flex;gap:1px;overflow-x:auto;-webkit-overflow-scrolling:touch;
  scrollbar-width:none;mask-image:linear-gradient(90deg,transparent,#000 12px,#000 calc(100% - 12px),transparent);
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 12px,#000 calc(100% - 12px),transparent);
  padding:0 6px}
.apex-nav-links::-webkit-scrollbar{display:none}
.apex-nav-link{font-family:'Inter',-apple-system,sans-serif;font-size:11px;color:var(--text-muted);
  text-decoration:none;padding:5px 9px;border-radius:8px;transition:all .25s cubic-bezier(0.22,1,0.36,1);
  flex-shrink:0;white-space:nowrap;letter-spacing:0.01em}
.apex-nav-link:hover{color:var(--text);background:rgba(255,255,255,0.06)}
[data-theme="light"] .apex-nav-link:hover{background:rgba(0,0,0,0.04)}
.apex-nav-link.active{color:var(--accent);background:var(--accent-glow);font-weight:600}
@media(max-width:768px){.apex-nav{padding:6px 10px}.apex-nav-inner{height:38px;padding:0 10px}
  .apex-nav-link{font-size:10px;padding:4px 7px}}
`;

export function ShowcaseNav({ activePath }: ShowcaseNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{navStyles}</style>
      <div className={`apex-nav${scrolled ? " scrolled" : ""}`}>
        <div
          className="apex-nav-inner"
          style={{
            background: scrolled
              ? "color-mix(in srgb, var(--bg-elevated) 92%, transparent)"
              : "color-mix(in srgb, var(--bg-elevated) 80%, transparent)",
            border: "1px solid color-mix(in srgb, var(--text-muted) 15%, transparent)",
            boxShadow: scrolled
              ? "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)"
              : "0 2px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
            borderRadius: scrolled ? 12 : 14,
          }}
        >
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
            <span style={{ color: "var(--text-muted)", fontWeight: 300, marginLeft: 4, fontSize: 10, letterSpacing: "0.04em" }}>
              DNA
            </span>
          </Link>

          <div style={{ width: 1, height: 14, background: "color-mix(in srgb, var(--text-muted) 25%, transparent)", flexShrink: 0, margin: "0 6px" }} />

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
