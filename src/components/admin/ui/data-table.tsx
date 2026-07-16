'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search, SlidersHorizontal, Download, ChevronLeft, ChevronRight,
  ChevronsUpDown, ArrowUp, ArrowDown, CheckSquare, Square,
  MoreHorizontal, X,
} from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  filters?: React.ReactNode;
  bulkActions?: React.ReactNode;
  pageSize?: number;
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchKeys,
  filters,
  bulkActions,
  pageSize = 10,
  getRowId,
  onRowClick,
  emptyMessage = 'No records found',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Filter
  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    const keys = searchKeys || (Object.keys(data[0] || {}) as (keyof T)[]);
    return data.filter((row) =>
      keys.some((k) => String(row[k] || '').toLowerCase().includes(q))
    );
  }, [data, search, searchKeys]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [filtered, sortKey, sortDir]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * pageSize;
  const pageData = sorted.slice(start, start + pageSize);

  const allOnPageSelected = pageData.length > 0 && pageData.every((r) => selected.has(getRowId(r)));
  const toggleAll = () => {
    const next = new Set(selected);
    if (allOnPageSelected) {
      pageData.forEach((r) => next.delete(getRowId(r)));
    } else {
      pageData.forEach((r) => next.add(getRowId(r)));
    }
    setSelected(next);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {searchable && (
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search…"
              className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-[13px] outline-none focus:border-brand"
            />
          </div>
        )}
        {filters && (
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[12.5px] font-medium transition-colors ${
              showFilters ? 'border-brand bg-brand-soft text-brand' : 'border-border bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </button>
        )}
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[12.5px] font-medium text-muted-foreground hover:text-foreground">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      {/* Filters row */}
      {showFilters && filters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="overflow-hidden"
        >
          <div className="rounded-xl border border-border bg-card p-3">
            {filters}
          </div>
        </motion.div>
      )}

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand/30 bg-brand-soft px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-[12.5px] font-semibold text-brand">{selected.size} selected</span>
            <button
              onClick={() => setSelected(new Set())}
              className="rounded p-0.5 text-brand hover:bg-brand/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {bulkActions}
          </div>
        </motion.div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="w-10 px-3 py-2.5">
                <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground">
                  {allOnPageSelected ? <CheckSquare className="h-4 w-4 text-brand" /> : <Square className="h-4 w-4" />}
                </button>
              </th>
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={{ width: c.width }}
                  className={`px-3 py-2.5 font-semibold text-muted-foreground ${
                    c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {c.sortable ? (
                    <button
                      onClick={() => handleSort(c.key)}
                      className={`inline-flex items-center gap-1 hover:text-foreground ${c.align === 'right' ? 'flex-row-reverse' : ''}`}
                    >
                      {c.header}
                      {sortKey === c.key ? (
                        sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              ))}
              <th className="w-10 px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-3 py-12 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageData.map((row, i) => {
                const id = getRowId(row);
                const isSel = selected.has(id);
                return (
                  <motion.tr
                    key={id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => onRowClick?.(row)}
                    className={`border-b border-border/60 last:border-0 ${isSel ? 'bg-brand-soft/40' : 'hover:bg-muted/30'} ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    <td className="px-3 py-2.5" onClick={(e) => { e.stopPropagation(); toggleRow(id); }}>
                      <button className="text-muted-foreground hover:text-foreground">
                        {isSel ? <CheckSquare className="h-4 w-4 text-brand" /> : <Square className="h-4 w-4" />}
                      </button>
                    </td>
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={`px-3 py-2.5 ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left'}`}
                      >
                        {c.render ? c.render(row) : String(row[c.key] ?? '')}
                      </td>
                    ))}
                    <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-muted-foreground">
        <div>
          Showing <span className="font-semibold text-foreground">{start + 1}</span> – <span className="font-semibold text-foreground">{Math.min(start + pageSize, sorted.length)}</span> of <span className="font-semibold text-foreground">{sorted.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current === 1}
            className="grid h-8 w-8 place-items-center rounded-lg border border-border disabled:opacity-50 hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-2 text-[12px]">
            Page <span className="font-semibold text-foreground">{current}</span> of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={current === totalPages}
            className="grid h-8 w-8 place-items-center rounded-lg border border-border disabled:opacity-50 hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
