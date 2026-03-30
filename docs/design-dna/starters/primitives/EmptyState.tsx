import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Empty state placeholder for tables, lists, and sections. */
export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
    >
      {icon && (
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      <p className="text-[15px] font-semibold mb-1" style={{ color: 'var(--text)' }}>
        {title}
      </p>

      {description && (
        <p
          className="text-[13px] font-light max-w-[280px] leading-relaxed mb-5"
          style={{ color: 'var(--text-secondary)' }}
        >
          {description}
        </p>
      )}

      {action && <div className={description ? '' : 'mt-5'}>{action}</div>}
    </div>
  );
}
