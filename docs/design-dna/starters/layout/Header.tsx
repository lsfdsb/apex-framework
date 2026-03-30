interface HeaderLink {
  label: string;
  href: string;
  active?: boolean;
}

interface HeaderProps {
  logo: React.ReactNode;
  links: HeaderLink[];
  actions?: React.ReactNode;
  skipTo?: string;
}

/** Sticky app header for landing, blog, and portfolio layouts. */
export function Header({ logo, links, actions, skipTo = '#main-content' }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
        borderColor: 'var(--border)',
      }}
    >
      <a
        href={skipTo}
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:text-sm"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        Skip to content
      </a>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          {logo}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors duration-[var(--duration-fast)]"
                style={{
                  color: link.active ? 'var(--text)' : 'var(--text-secondary)',
                  background: link.active ? 'var(--bg-surface)' : 'transparent',
                }}
                aria-current={link.active ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}
