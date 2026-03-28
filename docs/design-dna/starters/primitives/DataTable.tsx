import React from 'react';

interface Column<T> {
  key: keyof T & string;
  label: string;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: keyof T & string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  onRowClick,
}: DataTableProps<T>) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTableRowElement>, row: T) {
    if ((e.key === 'Enter' || e.key === ' ') && onRowClick) {
      e.preventDefault();
      onRowClick(row);
    }
  }

  return (
    <div
      className="w-full overflow-x-auto rounded-[var(--radius)] border"
      style={{ borderColor: 'var(--border)' }}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ background: 'var(--bg-surface)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left text-[11px] uppercase tracking-[0.06em] font-medium px-4 py-3"
                style={{ color: 'var(--text-muted)', width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={String(row[rowKey])}
              className={`border-t transition-colors duration-[var(--duration-fast)] hover:bg-[var(--bg-surface)] ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
              style={{ borderColor: 'var(--border)' }}
              onClick={() => onRowClick?.(row)}
              {...(onRowClick
                ? {
                    tabIndex: 0,
                    onKeyDown: (e: React.KeyboardEvent<HTMLTableRowElement>) =>
                      handleKeyDown(e, row),
                  }
                : {})}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-[13px]"
                  style={{ color: 'var(--text)' }}
                >
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
