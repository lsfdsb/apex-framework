interface HeaderLink {
  label: string;
  href: string;
  active?: boolean;
}

interface HeaderProps {
  logo: React.ReactNode;
  links: HeaderLink[];
  actions?: React.ReactNode;
}

/** Sticky app header for landing, blog, and portfolio layouts. */
export function Header({ logo, links, actions }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        background: "rgba(var(--bg-rgb, 0,0,0), 0.8)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          {logo}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors duration-[var(--duration-fast)]"
                style={{
                  color: link.active ? "var(--text)" : "var(--text-secondary)",
                  background: link.active ? "var(--bg-surface)" : "transparent",
                }}
                aria-current={link.active ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        {actions && (
          <div className="flex items-center gap-3">{actions}</div>
        )}
      </div>
    </header>
  );
}
