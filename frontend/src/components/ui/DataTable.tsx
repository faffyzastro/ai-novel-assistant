import React, { useState } from 'react';

interface DataTableProps {
  columns: { label: string; key: string }[];
  data: Record<string, any>[];
}

// DataTable component for displaying tabular data, accessible and responsive
export const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleSelectRow = (idx: number) => {
    setSelectedRows((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) setSelectedRows([]);
    else setSelectedRows(data.map((_, i) => i));
  };

  return (
    <div className="w-full">
      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-4">
        {data.length === 0 ? (
          <div className="py-12 text-center text-blue-400 dark:text-blue-300 text-base font-semibold animate-fadeIn">
            <span role="img" aria-label="No stories">📚</span> No stories found.
          </div>
        ) : (
          data.map((row, i) => (
            <div key={i} className={`rounded-xl shadow-lg border-2 border-blue-200 dark:border-orange-700 bg-white/95 dark:bg-blue-950/95 p-4 flex flex-col gap-2 animate-fadeIn ${selectedRows.includes(i) ? 'ring-2 ring-blue-400 dark:ring-orange-400' : ''}`}
                 tabIndex={0} aria-selected={selectedRows.includes(i)}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-700 dark:text-orange-200">{row.title}</span>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(i)}
                  onChange={() => handleSelectRow(i)}
                  aria-label={`Select row ${i + 1}`}
                  className="accent-blue-500 dark:accent-orange-400 focus:ring-2 focus:ring-blue-400 dark:focus:ring-orange-400 rounded transition-all duration-200"
                />
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-200"><b>Author:</b> {row.author}</div>
              <div className="text-sm text-gray-700 dark:text-gray-200"><b>Status:</b> {row.status}</div>
              <div className="text-sm text-gray-700 dark:text-gray-200"><b>Last Updated:</b> {row.updated}</div>
              <div className="mt-2">{row.actions}</div>
            </div>
          ))
        )}
      </div>
      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto rounded-xl shadow-lg border-2 border-blue-200 dark:border-orange-700 bg-white/95 dark:bg-blue-950/95 transition-all duration-300">
        {/* Batch actions bar */}
        {selectedRows.length > 0 && (
          <div className="sticky top-0 z-20 flex items-center gap-4 px-4 py-2 bg-blue-50 dark:bg-blue-900 border-b-2 border-blue-200 dark:border-orange-700 animate-fadeIn">
            <span className="font-semibold text-blue-700 dark:text-orange-200">{selectedRows.length} selected</span>
            <button className="text-blue-600 dark:text-orange-400 hover:underline" onClick={() => setSelectedRows([])}>Clear</button>
            <button className="text-red-600 dark:text-pink-400 hover:underline">Delete</button>
            <button className="text-blue-600 dark:text-orange-400 hover:underline">Export</button>
          </div>
        )}
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="px-2 py-1 border-b-2 bg-blue-100 dark:bg-blue-900 text-left font-bold text-blue-900 dark:text-orange-200 uppercase tracking-wider whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                  className="accent-blue-500 dark:accent-orange-400 focus:ring-2 focus:ring-blue-400 dark:focus:ring-orange-400 rounded transition-all duration-200"
                />
              </th>
              {columns.map((col) => {
                // Hide 'Author' and 'Last Updated' on mobile
                const hideOnMobile = col.key === 'author' || col.key === 'updated';
                return (
                  <th
                    key={col.key}
                    className={`px-2 py-1 border-b-2 bg-blue-100 dark:bg-blue-900 text-left font-bold text-blue-900 dark:text-orange-200 uppercase tracking-wider whitespace-nowrap ${hideOnMobile ? 'hidden md:table-cell' : ''}`}
                  >
                    {col.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-12 text-center text-blue-400 dark:text-blue-300 text-base font-semibold animate-fadeIn">
                  <span role="img" aria-label="No stories">📚</span> No stories found.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  className={`even:bg-gray-50 dark:even:bg-blue-900 hover:bg-blue-50 dark:hover:bg-blue-800 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-400 dark:focus-within:ring-orange-400 ${selectedRows.includes(i) ? 'ring-2 ring-blue-400 dark:ring-orange-400' : ''}`}
                  tabIndex={0}
                  aria-selected={selectedRows.includes(i)}
                >
                  <td className="px-2 py-1 border-b border-blue-50 dark:border-blue-900">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(i)}
                      onChange={() => handleSelectRow(i)}
                      aria-label={`Select row ${i + 1}`}
                      className="accent-blue-500 dark:accent-orange-400 focus:ring-2 focus:ring-blue-400 dark:focus:ring-orange-400 rounded transition-all duration-200"
                    />
                  </td>
                  {columns.map((col) => {
                    // Hide 'Author' and 'Last Updated' on mobile
                    const hideOnMobile = col.key === 'author' || col.key === 'updated';
                    return (
                      <td
                        key={col.key}
                        className={`px-2 py-1 border-b border-blue-50 dark:border-blue-900 truncate ${hideOnMobile ? 'hidden md:table-cell' : ''}`}
                        style={{ maxWidth: 120 }}
                      >
                        {row[col.key]}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 