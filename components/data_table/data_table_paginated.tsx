// components/data_table/data_table_paginated.tsx
"use client";

import * as React from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTable } from "@/components/data_table/base_data_table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaginatorShallow from "@/components/data_table/shallow_paginator"

export interface DataTablePaginatedProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: number;
  pageIndex: number;        // 0-based
  pageSize: number;
  makeHref: (page1: number) => string;
  onPageChange?: (pageIndex: number) => void;
  onPageHover?: (page1: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showPreviousNext?: boolean;
  boundaries?: number;
  siblings?: number;
  pageSizeOptions?: number[];
  emptyMessage?: React.ReactNode;
  loading?: boolean;        // muestra "Cargando…"
}

export function DataTablePaginated<TData, TValue>({
  columns,
  data,
  total,
  pageIndex,
  pageSize,
  makeHref,
  onPageChange,
  onPageHover,
  onPageSizeChange,
  showPreviousNext = true,
  boundaries = 1,
  siblings = 1,
  pageSizeOptions = [10, 20, 50],
  emptyMessage = "Sin resultados.",
  loading = false,
}: DataTablePaginatedProps<TData, TValue>) {
  const safeSize = pageSize > 0 ? pageSize : 1;
  const pageCount = total > 0 ? Math.max(1, Math.ceil(total / safeSize)) : 1;

  const table = useReactTable({
    data,
    columns,
    state: { pagination: { pageIndex, pageSize } },
    manualPagination: true,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
  });

  const start = total === 0 ? 0 : pageIndex * pageSize + 1;
  const end = total === 0 ? 0 : start + data.length - 1;

  const effectivePageSizeOptions = React.useMemo(() => {
    const set = new Set<number>(pageSizeOptions);
    set.add(pageSize);
    return Array.from(set).sort((a, b) => a - b);
  }, [pageSizeOptions, pageSize]);

  const handlePageSizeSelect = (val: string) => {
    const newSize = Number(val);
    if (!Number.isFinite(newSize) || newSize <= 0) return;
    onPageSizeChange?.(newSize);
  };

  return (
    <div className="space-y-4">
      <DataTable columns={columns} table={table} emptyMessage={emptyMessage} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-4">
        <div className="text-sm text-muted-foreground">
          {total === 0
            ? emptyMessage
            : `Mostrando ${start}-${end} de ${total} resultados.`}
          {loading ? " Cargando…" : null}
        </div>

        <div className="flex items-center gap-4">
          {onPageSizeChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Filas por página
              </span>
              <Select value={String(pageSize)} onValueChange={handlePageSizeSelect}>
                <SelectTrigger className="h-8 w-[80px]">
                  <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent side="top">
                  {effectivePageSizeOptions.map((opt) => (
                    <SelectItem key={opt} value={String(opt)}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <PaginatorShallow
            currentPage={pageIndex + 1}
            totalPages={pageCount}
            makeHref={makeHref}
            onNavigate={(p1) => onPageChange?.(p1 - 1)}
            onPageHover={onPageHover}
            showPreviousNext={showPreviousNext}
            boundaries={boundaries}
            siblings={siblings}
          />
        </div>
      </div>
    </div>
  );
}
