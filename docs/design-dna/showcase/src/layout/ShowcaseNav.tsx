import { Link } from "../router/Router";
import { TEMPLATE_ROUTES } from "../data/routes";

interface ShowcaseNavProps {
  activePath: string;
}

export function ShowcaseNav({ activePath }: ShowcaseNavProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        width: "calc(100% - 48px)",
        maxWidth: 1200,
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 20px",
          height: 44,
          borderRadius: 999,
          background: "color-mix(in srgb, var(--bg-elevated) 75%, transparent)",
          backdropFilter: "blur(24px) saturate(1.8)",
          WebkitBackdropFilter: "blur(24px) saturate(1.8)",
          border: "1px solid color-mix(in srgb, var(--text-muted) 20%, transparent)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.03)",
          transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
        className="scrollbar-none"
      >
        <Link
          to="/"
          style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            textDecoration: "none",
            color: "var(--text)",
            letterSpacing: "-0.02em",
            flexShrink: 0,
            padding: "4px 0",
          }}
        >
          APEX
          <span style={{ color: "var(--text-muted)", fontWeight: 300, marginLeft: 4, fontSize: 12 }}>
            DNA
          </span>
        </Link>

        <div
          style={{
            width: 1,
            height: 14,
            background: "var(--border)",
            flexShrink: 0,
            margin: "0 6px",
            opacity: 0.5,
          }}
        />

        {TEMPLATE_ROUTES.map((route) => {
          const isActive = activePath === route.path;
          return (
            <Link
              key={route.path}
              to={route.path}
              style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontSize: 12,
                color: isActive ? "var(--accent)" : "var(--text-muted)",
                textDecoration: "none",
                padding: "4px 8px",
                borderRadius: 999,
                transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                flexShrink: 0,
                whiteSpace: "nowrap",
                background: isActive ? "var(--accent-glow)" : "transparent",
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--text)";
                  e.currentTarget.style.background = "var(--accent-glow)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--text-muted)";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "none";
                }
              }}
            >
              {route.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
