import { Link } from "../router/Router";
import { TEMPLATE_ROUTES } from "../data/routes";

interface ShowcaseNavProps {
  activePath: string;
}

export function ShowcaseNav({ activePath }: ShowcaseNavProps) {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 32px",
        background: "var(--nav-bg, rgba(6,6,10,0.6))",
        backdropFilter: "blur(20px) saturate(1.4)",
        borderBottom: "1px solid var(--border)",
        transition: "background 0.4s, border-color 0.4s",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          height: 52,
          gap: 8,
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
            color: "var(--text)",
            letterSpacing: "-0.02em",
            flexShrink: 0,
            marginRight: 8,
          }}
        >
          APEX{" "}
          <span style={{ color: "var(--text-muted)", fontWeight: 300, marginLeft: 4, fontSize: 13 }}>
            DNA
          </span>
        </Link>

        <div
          style={{
            width: 1,
            height: 16,
            background: "var(--border)",
            flexShrink: 0,
            marginRight: 4,
          }}
        />

        <div
          style={{
            display: "flex",
            gap: 4,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            whiteSpace: "nowrap",
          }}
          className="scrollbar-none"
        >
          {TEMPLATE_ROUTES.map((route) => {
            const isActive = activePath === route.path;
            return (
              <Link
                key={route.path}
                to={route.path}
                style={{
                  fontFamily: "'Inter', -apple-system, sans-serif",
                  fontSize: 13,
                  color: isActive ? "var(--accent)" : "var(--text-muted)",
                  textDecoration: "none",
                  padding: "5px 10px",
                  borderRadius: 999,
                  transition: "all 0.25s",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  background: isActive ? "var(--accent-glow)" : "transparent",
                  fontWeight: isActive ? 500 : 400,
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
        </div>
      </div>
    </nav>
  );
}
