'use client';

import { useState } from 'react';

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  active?: boolean;
}

interface SidebarProps {
  logo: React.ReactNode;
  sections: SidebarSection[];
  footer?: React.ReactNode;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

/** Universal sidebar for CRM, SaaS, LMS, and Backoffice layouts. */
export function Sidebar({ logo, sections, footer, collapsed = false, onCollapse }: SidebarProps) {
  return (
    <aside
      className={`
        hidden lg:flex flex-col h-screen sticky top-0
        border-r transition-all duration-300 ease-[var(--ease-out)]
        ${collapsed ? 'w-16' : 'w-[220px]'}
      `}
      style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
      aria-label="Sidebar navigation"
    >
      {/* Logo */}
      <div
        className="flex items-center h-16 px-4 border-b shrink-0"
        style={{ borderColor: 'var(--border)' }}
      >
        {logo}
        {onCollapse && (
          <button
            onClick={() => onCollapse(!collapsed)}
            className="ml-auto p-1 rounded-md transition-opacity"
            style={{ color: 'var(--text-muted)' }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {collapsed ? <path d="M6 4l4 4-4 4" /> : <path d="M10 4l-4 4 4 4" />}
            </svg>
          </button>
        )}
      </div>

      {/* Sections */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {sections.map((section, i) => (
          <div key={i}>
            {section.title && !collapsed && (
              <p
                className="text-[10px] uppercase tracking-[0.08em] font-medium px-3 mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium
                      transition-all duration-[var(--duration-fast)]
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    style={{
                      color: item.active ? 'var(--accent)' : 'var(--text-secondary)',
                      background: item.active ? 'var(--accent-glow)' : 'transparent',
                    }}
                    aria-current={item.active ? 'page' : undefined}
                  >
                    <span className="shrink-0 w-5 h-5">{item.icon}</span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && item.badge != null && (
                      <span
                        className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: 'var(--accent-glow)',
                          color: 'var(--accent)',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="p-4 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
          {footer}
        </div>
      )}
    </aside>
  );
}
