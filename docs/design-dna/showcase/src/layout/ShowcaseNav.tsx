import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "../router/Router";
import { TEMPLATE_ROUTES } from "../data/routes";

interface ShowcaseNavProps {
  activePath: string;
}

const navStyles = `
.apex-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:8px 20px;display:flex;justify-content:center}
.apex-nav.scrolled{padding:8px 20px}
.apex-nav-inner{display:inline-flex;align-items:center;height:42px;padding:0 16px;
  border-radius:14px;backdrop-filter:blur(20px) saturate(1.6);-webkit-backdrop-filter:blur(20px) saturate(1.6)}
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
.apex-nav-burger{display:none;background:none;border:none;cursor:pointer;padding:6px;margin-left:4px;flex-shrink:0}
.apex-nav-burger span{display:block;width:16px;height:1.5px;background:var(--text-muted);margin:3px 0;
  transition:all .3s cubic-bezier(0.22,1,0.36,1);border-radius:1px}
.apex-nav-burger.open span:nth-child(1){transform:rotate(45deg) translate(3px,3px)}
.apex-nav-burger.open span:nth-child(2){opacity:0}
.apex-nav-burger.open span:nth-child(3){transform:rotate(-45deg) translate(3px,-3px)}
.apex-nav-mobile{display:none;position:fixed;top:56px;left:10px;right:10px;z-index:99;
  border-radius:14px;padding:12px 8px;
  backdrop-filter:blur(20px) saturate(1.6);-webkit-backdrop-filter:blur(20px) saturate(1.6);
  flex-wrap:wrap;gap:4px;justify-content:center;
  animation:navSlideIn .25s cubic-bezier(0.22,1,0.36,1);
  pointer-events:auto}
.apex-nav-mobile.closing{animation:navSlideOut .2s cubic-bezier(0.22,1,0.36,1) forwards}
@keyframes navSlideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes navSlideOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-8px)}}
.apex-nav-mobile .apex-nav-link{font-size:12px;padding:8px 12px}
.apex-nav-backdrop{display:none;position:fixed;inset:0;z-index:98}
@media(max-width:640px){
  .apex-nav{padding:6px 10px}
  .apex-nav-inner{height:38px;padding:0 10px}
  .apex-nav-links{display:none}
  .apex-nav-burger{display:block}
  .apex-nav-mobile.open,.apex-nav-mobile.closing{display:flex}
  .apex-nav-backdrop.open{display:block}
}
`;

export function ShowcaseNav({ activePath }: ShowcaseNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMobile = useCallback(() => {
    if (!mobileOpen || closing) return;
    setClosing(true);
    setTimeout(() => {
      setMobileOpen(false);
      setClosing(false);
    }, 200);
  }, [mobileOpen, closing]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change (derived state, no effect needed)
  const [prevPath, setPrevPath] = useState(activePath);
  if (prevPath !== activePath) {
    setPrevPath(activePath);
    if (mobileOpen) setMobileOpen(false);
    if (closing) setClosing(false);
  }

  // Escape key closes menu
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMobile(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMobile]);

  const glassBackground = "color-mix(in srgb, var(--bg-elevated) 88%, transparent)";
  const glassBorder = "1px solid color-mix(in srgb, var(--text-muted) 15%, transparent)";
  const glassShadow = "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)";

  return (
    <>
      <style>{navStyles}</style>
      <div className={`apex-nav${scrolled ? " scrolled" : ""}`}>
        <div
          className="apex-nav-inner"
          style={{
            background: glassBackground,
            border: glassBorder,
            boxShadow: glassShadow,
            borderRadius: 14,
          }}
        >
          <a
            href="#/"
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
          </a>

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

          <button
            className={`apex-nav-burger${mobileOpen && !closing ? " open" : ""}`}
            onClick={() => mobileOpen ? closeMobile() : setMobileOpen(true)}
            aria-label="Toggle navigation"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Backdrop — closes menu on outside tap */}
      <div
        className={`apex-nav-backdrop${mobileOpen ? " open" : ""}`}
        onClick={closeMobile}
      />

      <div
        ref={menuRef}
        className={`apex-nav-mobile${mobileOpen ? " open" : ""}${closing ? " closing" : ""}`}
        style={{
          background: "color-mix(in srgb, var(--bg-elevated) 95%, transparent)",
          border: glassBorder,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
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
    </>
  );
}
