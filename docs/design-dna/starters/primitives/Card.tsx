import React from 'react';

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'article' | 'a';
  href?: string;
  onClick?: () => void;
}

export function Card({
  children,
  hover = true,
  className = '',
  style,
  as: Tag = 'div',
  href,
  onClick,
}: CardProps) {
  const props = {
    className: `
      rounded-[var(--radius)] border overflow-hidden
      transition-all duration-300 ease-[var(--ease-out)]
      ${hover ? 'hover:border-[var(--border-hover)] hover:-translate-y-0.5' : ''}
      ${className}
    `.trim(),
    style: {
      background: 'var(--bg-elevated)',
      borderColor: 'var(--border)',
      ...style,
    },
    ...(href ? { href } : {}),
    ...(onClick ? { onClick, role: 'button' as const, tabIndex: 0 } : {}),
  };

  return <Tag {...(props as React.HTMLAttributes<HTMLElement>)}>{children}</Tag>;
}

interface SlotProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

Card.Thumbnail = function Thumbnail({ children, className = '' }: SlotProps) {
  return (
    <div
      className={`relative aspect-video overflow-hidden ${className}`}
      style={{ background: 'var(--bg-surface)' }}
    >
      {children}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent 60%, var(--bg-elevated))' }}
        aria-hidden="true"
      />
    </div>
  );
};

Card.Body = function Body({ children, className = '', style }: SlotProps) {
  return (
    <div className={`p-[var(--card-padding,16px)] ${className}`} style={style}>
      {children}
    </div>
  );
};

Card.Footer = function Footer({ children, className = '', style }: SlotProps) {
  return (
    <div
      className={`px-[var(--card-padding,16px)] pb-[var(--card-padding,16px)] pt-0 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
