/* PageShell — Root layout that composes Sidebar + Content + MobileNav.

   IMPORTANT for Tailwind v4:
   - Do NOT use arbitrary values like pl-[56px] — they may not generate CSS
   - Use inline styles for sidebar offset (style={{ paddingLeft }})
   - Use standard Tailwind classes for everything else
   - Content is centered with max-width + auto margins
   - Sidebar offset is ONLY on md+ (hidden on mobile) */

interface PageShellProps {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  mobileNav?: React.ReactNode;
  children: React.ReactNode;
  sidebarWidth?: number;
}

export function PageShell({
  sidebar,
  header,
  mobileNav,
  children,
  sidebarWidth = 56,
}: PageShellProps) {
  return (
    <div className="min-h-screen relative" style={{ color: "var(--text)" }}>
      {sidebar}
      <div className="flex-1 flex flex-col min-w-0">
        {header}
        <main
          className="flex-1 pb-24 md:pb-8"
          style={{
            /* Inline style for sidebar offset — Tailwind arbitrary values
               break in v4. This is the reliable approach. */
            paddingLeft: sidebar ? sidebarWidth : 0,
          }}
        >
          <div className="max-w-4xl mx-auto px-6 py-8 sm:px-10 lg:px-16 lg:py-12 apex-enter">
            {children}
          </div>
        </main>
      </div>
      {mobileNav}
    </div>
  );
}
