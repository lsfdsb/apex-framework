import { Link } from "../router/Router";
import { TEMPLATE_ROUTES } from "../data/routes";

interface ShowcaseNavProps {
  activePath: string;
}

export function ShowcaseNav({ activePath }: ShowcaseNavProps) {
  return (
    <nav
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--bg) 85%, transparent)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-screen-xl mx-auto flex items-center gap-1 px-4 overflow-x-auto">
        <Link to="/" className="shrink-0 py-3 px-3 text-sm font-semibold tracking-wide" style={{ color: "var(--accent)" }}>
          APEX DNA
        </Link>
        <div className="w-px h-5 mx-1 shrink-0" style={{ background: "var(--border)" }} />
        {TEMPLATE_ROUTES.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className="shrink-0 py-3 px-2 text-xs font-medium transition-colors"
            style={{
              color: activePath === route.path ? "var(--accent)" : "var(--text-muted)",
              borderBottom: activePath === route.path ? "2px solid var(--accent)" : "2px solid transparent",
            }}
          >
            {route.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
