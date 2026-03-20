import React from "react";

interface Column<T> {
  key: keyof T & string;
  label: string;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  onRowClick,
}: DataTableProps<T>) {
  function handleRowHover(e: React.MouseEvent<HTMLTableRowElement>, enter: boolean) {
    e.currentTarget.style.background = enter ? "var(--bg-surface)" : "transparent";
  }

  return (
    <div
      className="w-full overflow-x-auto rounded-[var(--radius)] border"
      style={{ borderColor: "var(--border)" }}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ background: "var(--bg-surface)" }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left text-[11px] uppercase tracking-[0.06em] font-medium px-4 py-3"
                style={{ color: "var(--text-muted)", width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-t transition-colors duration-[var(--duration-fast)] ${
                onRowClick ? "cursor-pointer" : ""
              }`}
              style={{ borderColor: "var(--border)" }}
              onMouseEnter={(e) => handleRowHover(e, true)}
              onMouseLeave={(e) => handleRowHover(e, false)}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-[13px]" style={{ color: "var(--text)" }}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
