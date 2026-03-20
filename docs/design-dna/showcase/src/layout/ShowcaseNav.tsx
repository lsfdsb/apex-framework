import { Link } from "../router/Router";
import { TEMPLATE_ROUTES } from "../data/routes";

interface ShowcaseNavProps {
  activePath: string;
}

export function ShowcaseNav({ activePath }: ShowcaseNavProps) {
  return (
    <nav className="nav-glass sticky top-0 z-40">
      <div className="max-w-screen-xl mx-auto flex items-center gap-1 px-6 overflow-x-auto scrollbar-none">
        <Link
          to="/"
          className="shrink-0 py-4 px-3 text-sm font-bold tracking-wider"
          style={{ color: activePath === "/" ? "var(--accent)" : "var(--text)", fontFamily: "Inter, sans-serif" }}
        >
          APEX DNA
        </Link>
        <div className="w-px h-4 mx-2 shrink-0" style={{ background: "var(--border)" }} />
        {TEMPLATE_ROUTES.map((route) => {
          const isActive = activePath === route.path;
          return (
            <Link
              key={route.path}
              to={route.path}
              className="shrink-0 py-4 px-2.5 text-xs font-medium transition-all relative"
              style={{ color: isActive ? "var(--accent)" : "var(--text-muted)" }}
            >
              {route.label}
              {isActive && (
                <span
                  className="absolute bottom-0 left-2.5 right-2.5 h-0.5 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
