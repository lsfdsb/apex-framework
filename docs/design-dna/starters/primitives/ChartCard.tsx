'use client';

import React, { useState } from 'react';

interface ChartCardProps {
  title: string;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface BodyProps {
  children: React.ReactNode;
  className?: string;
}

/** Container for chart content with title and optional date-range tab switcher. */
export function ChartCard({
  title,
  tabs = [],
  activeTab,
  onTabChange,
  children,
  className = '',
}: ChartCardProps) {
  const [internalTab, setInternalTab] = useState(tabs[0] ?? '');
  const current = activeTab ?? internalTab;

  function handleTab(tab: string): void {
    setInternalTab(tab);
    onTabChange?.(tab);
  }

  return (
    <div
      className={`rounded-[var(--radius)] border overflow-hidden ${className}`}
      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
    >
      <div
        className="flex items-center justify-between gap-4 px-[var(--card-padding,16px)] py-3 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <p className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
          {title}
        </p>

        {tabs.length > 0 && (
          <div
            className="flex gap-0.5 rounded-lg p-0.5"
            role="tablist"
            aria-label={`${title} time range`}
            style={{ background: 'var(--bg-surface)' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={current === tab}
                onClick={() => handleTab(tab)}
                className="px-2.5 py-1 text-[11px] font-medium rounded-md transition-all duration-[var(--duration-fast,150ms)] ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]"
                style={{
                  background: current === tab ? 'var(--bg-elevated)' : 'transparent',
                  color: current === tab ? 'var(--text)' : 'var(--text-secondary)',
                  boxShadow: current === tab ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {children}
    </div>
  );
}

ChartCard.Body = function Body({ children, className = '' }: BodyProps) {
  return <div className={`p-[var(--card-padding,16px)] ${className}`}>{children}</div>;
};
