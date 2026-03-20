interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface MobileNavProps {
  items: MobileNavItem[];
}

/** Bottom tab bar for mobile — mirrors sidebar links. Max 5 items displayed. */
export function MobileNav({ items }: MobileNavProps) {
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t backdrop-blur-md"
      style={{
        background: "color-mix(in srgb, var(--bg) 90%, transparent)",
        borderColor: "var(--border)",
      }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.slice(0, 5).map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors"
            style={{
              color: item.active ? "var(--accent)" : "var(--text-muted)",
            }}
            aria-current={item.active ? "page" : undefined}
          >
            <span className="w-5 h-5">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
