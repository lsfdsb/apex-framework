import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "../router/Router";
import { TEMPLATE_ROUTES, OPS_ROUTES, NAV_ROUTES } from "../data/routes";

interface ShowcaseNavProps {
  activePath: string;
}

const navStyles = `
.apex-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:8px 20px;display:flex;justify-content:center}
.apex-nav.scrolled{padding:8px 20px}
.apex-nav-inner{display:inline-flex;align-items:center;height:42px;padding:0 16px;
  border-radius:14px;backdrop-filter:blur(20px) saturate(1.6);-webkit-backdrop-filter:blur(20px) saturate(1.6)}
.apex-nav-links{display:flex;gap:1px;padding:0 6px;align-items:center}
.apex-nav-link{font-family:'Inter',-apple-system,sans-serif;font-size:11px;color:var(--text-muted);
  text-decoration:none;padding:5px 9px;border-radius:8px;transition:all .25s cubic-bezier(0.22,1,0.36,1);
  flex-shrink:0;white-space:nowrap;letter-spacing:0.01em}
.apex-nav-link:hover{color:var(--text);background:rgba(255,255,255,0.06)}
[data-theme="light"] .apex-nav-link:hover{background:rgba(0,0,0,0.04)}
.apex-nav-link.active{color:var(--accent);background:var(--accent-glow);font-weight:600}
.apex-nav-dropdown{position:relative}
.apex-nav-dropdown-btn{font-family:'Inter',-apple-system,sans-serif;font-size:11px;color:var(--text-muted);
  background:none;border:none;padding:5px 9px;border-radius:8px;cursor:pointer;
  transition:all .25s cubic-bezier(0.22,1,0.36,1);white-space:nowrap;letter-spacing:0.01em;
  display:flex;align-items:center;gap:4px}
.apex-nav-dropdown-btn:hover{color:var(--text);background:rgba(255,255,255,0.06)}
[data-theme="light"] .apex-nav-dropdown-btn:hover{background:rgba(0,0,0,0.04)}
.apex-nav-dropdown-btn.active{color:var(--accent);background:var(--accent-glow);font-weight:600}
.apex-nav-dropdown-menu{position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);
  min-width:160px;padding:6px;border-radius:12px;
  backdrop-filter:blur(20px) saturate(1.6);-webkit-backdrop-filter:blur(20px) saturate(1.6);
  animation:navDropIn .2s cubic-bezier(0.22,1,0.36,1);
  display:flex;flex-direction:column;gap:2px}
.apex-nav-dropdown-menu a{font-family:'Inter',-apple-system,sans-serif;font-size:12px;color:var(--text-muted);
  text-decoration:none;padding:7px 12px;border-radius:8px;transition:all .2s;display:block}
.apex-nav-dropdown-menu a:hover{color:var(--text);background:rgba(255,255,255,0.06)}
[data-theme="light"] .apex-nav-dropdown-menu a:hover{background:rgba(0,0,0,0.04)}
.apex-nav-dropdown-menu a.active{color:var(--accent);font-weight:600}
@keyframes navDropIn{from{opacity:0;transform:translateX(-50%) translateY(-4px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.apex-nav-burger{display:none;background:none;border:none;cursor:pointer;padding:6px;margin-left:4px;flex-shrink:0}
.apex-nav-burger span{display:block;width:16px;height:1.5px;background:var(--text-muted);margin:3px 0;
  transition:all .3s cubic-bezier(0.22,1,0.36,1);border-radius:1px}
.apex-nav-burger.open span:nth-child(1){transform:rotate(45deg) translate(3px,3px)}
.apex-nav-burger.open span:nth-child(2){opacity:0}
.apex-nav-burger.open span:nth-child(3){transform:rotate(-45deg) translate(3px,-3px)}
.apex-nav-mobile{display:none;position:fixed;top:56px;left:10px;right:10px;z-index:99;
  border-radius:14px;padding:12px 8px;
  backdrop-filter:blur(20px) saturate(1.6);-webkit-backdrop-filter:blur(20px) saturate(1.6);
  flex-direction:column;gap:2px;
  animation:navSlideIn .25s cubic-bezier(0.22,1,0.36,1);
  pointer-events:auto}
.apex-nav-mobile.closing{animation:navSlideOut .2s cubic-bezier(0.22,1,0.36,1) forwards}
@keyframes navSlideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes navSlideOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-8px)}}
.apex-nav-mobile .apex-nav-link{font-size:12px;padding:8px 12px}
.apex-nav-mobile-label{font-size:10px;font-weight:600;color:var(--text-muted);text-transform:uppercase;
  letter-spacing:0.06em;padding:8px 12px 4px;font-family:'Inter',-apple-system,sans-serif}
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

/* ── Dropdown Component ───────────────────────────────────────────────────── */

function NavDropdown({ label, isActive, children, glassBackground, glassBorder }: {
  label: string;
  isActive: boolean;
  children: React.ReactNode;
  glassBackground: string;
  glassBorder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="apex-nav-dropdown" ref={ref}>
      <button
        className={`apex-nav-dropdown-btn${isActive ? " active" : ""}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {label}
        <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{ opacity: 0.5, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "" }}>
          <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          className="apex-nav-dropdown-menu"
          style={{
            background: glassBackground,
            border: glassBorder,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Main Nav ─────────────────────────────────────────────────────────────── */

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

  const [prevPath, setPrevPath] = useState(activePath);
  if (prevPath !== activePath) {
    setPrevPath(activePath);
    if (mobileOpen) setMobileOpen(false);
    if (closing) setClosing(false);
  }

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMobile(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMobile]);

  const glassBackground = "color-mix(in srgb, var(--bg-elevated) 92%, transparent)";
  const glassBorder = "1px solid color-mix(in srgb, var(--text-muted) 15%, transparent)";
  const glassShadow = "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)";

  const opsActive = OPS_ROUTES.some(r => r.path === activePath);
  const dnaActive = activePath === "/dna" || TEMPLATE_ROUTES.some(r => r.path === activePath);

  return (
    <>
      <style>{navStyles}</style>
      <div className={`apex-nav${scrolled ? " scrolled" : ""}`}>
        <div
          className="apex-nav-inner"
          style={{ background: glassBackground, border: glassBorder, boxShadow: glassShadow, borderRadius: 14 }}
        >
          {/* Logo */}
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
              HUB
            </span>
          </a>

          <div style={{ width: 1, height: 14, background: "color-mix(in srgb, var(--text-muted) 25%, transparent)", flexShrink: 0, margin: "0 6px" }} />

          {/* Desktop dropdowns */}
          <div className="apex-nav-links">
            <NavDropdown label="OPS" isActive={opsActive} glassBackground={glassBackground} glassBorder={glassBorder}>
              {OPS_ROUTES.map((route) => (
                <a key={route.path} href={`#${route.path}`} className={activePath === route.path ? "active" : ""}>
                  {route.label}
                </a>
              ))}
            </NavDropdown>

            <NavDropdown label="DNA" isActive={dnaActive} glassBackground={glassBackground} glassBorder={glassBorder}>
              <a href="#/dna" className={activePath === "/dna" ? "active" : ""} style={{ fontWeight: 600 }}>
                DNA Home
              </a>
              <div style={{ height: 1, background: "color-mix(in srgb, var(--text-muted) 15%, transparent)", margin: "2px 0" }} />
              {TEMPLATE_ROUTES.map((route) => (
                <a key={route.path} href={`#${route.path}`} className={activePath === route.path ? "active" : ""}>
                  {route.label}
                </a>
              ))}
            </NavDropdown>

            <div style={{ width: 1, height: 14, background: "color-mix(in srgb, var(--text-muted) 20%, transparent)", flexShrink: 0, margin: "0 2px", alignSelf: "center" }} />

            {NAV_ROUTES.map((route) => (
              <a
                key={route.path}
                href={`#${route.path}`}
                className={`apex-nav-link${activePath === route.path ? " active" : ""}`}
              >
                {route.label}
              </a>
            ))}

            <div style={{ width: 1, height: 14, background: "color-mix(in srgb, var(--text-muted) 20%, transparent)", flexShrink: 0, margin: "0 6px", alignSelf: "center" }} />

            <button
              style={{
                background: "var(--accent)",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                fontWeight: 600,
                borderRadius: 8,
                padding: "5px 14px",
                fontSize: 11,
                fontFamily: "'Inter', -apple-system, sans-serif",
                letterSpacing: "0.01em",
                marginLeft: 4,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              onClick={() => alert("Authentication coming soon")}
            >
              Sign In
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className={`apex-nav-burger${mobileOpen && !closing ? " open" : ""}`}
            onClick={() => mobileOpen ? closeMobile() : setMobileOpen(true)}
            aria-label="Toggle navigation"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile backdrop */}
      <div
        className={`apex-nav-backdrop${mobileOpen ? " open" : ""}`}
        onClick={closeMobile}
      />

      {/* Mobile menu */}
      <div
        ref={menuRef}
        className={`apex-nav-mobile${mobileOpen ? " open" : ""}${closing ? " closing" : ""}`}
        style={{
          background: "color-mix(in srgb, var(--bg-elevated) 95%, transparent)",
          border: glassBorder,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div className="apex-nav-mobile-label">OPS</div>
        {OPS_ROUTES.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className={`apex-nav-link${activePath === route.path ? " active" : ""}`}
          >
            {route.label}
          </Link>
        ))}
        <div style={{ height: 1, background: "color-mix(in srgb, var(--text-muted) 15%, transparent)", margin: "4px 8px" }} />
        <div className="apex-nav-mobile-label">DNA</div>
        <Link
          to="/dna"
          className={`apex-nav-link${activePath === "/dna" ? " active" : ""}`}
          style={{ fontWeight: 600 }}
        >
          DNA Home
        </Link>
        {TEMPLATE_ROUTES.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className={`apex-nav-link${activePath === route.path ? " active" : ""}`}
          >
            {route.label}
          </Link>
        ))}
        <div style={{ height: 1, background: "color-mix(in srgb, var(--text-muted) 15%, transparent)", margin: "4px 8px" }} />
        {NAV_ROUTES.map((route) => (
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
