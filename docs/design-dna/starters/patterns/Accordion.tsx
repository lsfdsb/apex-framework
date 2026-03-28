'use client';

import { useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  badge?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string[];
  multiple?: boolean;
}

export function Accordion({ items, defaultOpen = [], multiple = false }: AccordionProps) {
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
      {items.map((item) => {
        const isOpen = open.has(item.id);
        return (
          <div key={item.id}>
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between py-4 text-left transition-colors"
              style={{ color: 'var(--text)' }}
              aria-expanded={isOpen}
              aria-controls={`accordion-${item.id}`}
            >
              <span className="text-[14px] font-medium">{item.title}</span>
              <div className="flex items-center gap-2">
                {item.badge}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  style={{ color: 'var(--text-muted)' }}
                >
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </div>
            </button>
            <div
              id={`accordion-${item.id}`}
              className={`overflow-hidden transition-all duration-300 ease-[var(--ease-out)] ${isOpen ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
            >
              <div className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
