import { useState, useEffect } from "react";
import { Link } from "../router/Router";
import { TEMPLATE_ROUTES } from "../data/routes";

interface ShowcaseNavProps {
  activePath: string;
}

const navStyles = `
.apex-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:8px 16px;transition:padding .3s}
.apex-nav-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;height:40px;padding:0 12px;
  border-radius:12px;backdrop-filter:blur(24px) saturate(1.8);-webkit-backdrop-filter:blur(24px) saturate(1.8);
  transition:background .4s,border-color .4s,box-shadow .4s,border-radius .3s}
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
      <div className="apex-nav" style={scrolled ? { padding: "4px 16px" } : undefined}>
        <div
          className="apex-nav-inner"
          style={{
            background: scrolled
              ? "color-mix(in srgb, var(--bg-elevated) 90%, transparent)"
              : "color-mix(in srgb, var(--bg-elevated) 50%, transparent)",
            border: scrolled
              ? "1px solid color-mix(in srgb, var(--text-muted) 18%, transparent)"
              : "1px solid color-mix(in srgb, var(--text-muted) 8%, transparent)",
            boxShadow: scrolled
              ? "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.03)"
              : "0 2px 12px rgba(0,0,0,0.06)",
            borderRadius: scrolled ? 12 : 16,
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
            <span style={{ color: "var(--text-muted)", fontWeight: 300, marginLeft: 3, fontSize: 10, letterSpacing: "0.04em" }}>
              DNA
            </span>
          </Link>

          <div style={{ width: 1, height: 12, background: "var(--border)", flexShrink: 0, margin: "0 4px", opacity: 0.4 }} />

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
