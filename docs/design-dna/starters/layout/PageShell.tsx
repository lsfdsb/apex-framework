interface PageShellProps {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  mobileNav?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Root layout shell that composes Sidebar, Header, main content, and MobileNav.
 * Wraps content in apex-enter for entrance animation.
 */
export function PageShell({
  sidebar,
  header,
  mobileNav,
  children,
}: PageShellProps) {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      {sidebar}
      <div className="flex-1 flex flex-col min-w-0">
        {header}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <div className="max-w-7xl mx-auto apex-enter">{children}</div>
        </main>
      </div>
      {mobileNav}
    </div>
  );
}
