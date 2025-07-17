"use client";

import * as React from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient
} from "@tanstack/react-query"

import { DataTablePaginated } from "@/components/data_table/data_table_paginated";
import { ColumnDef }          from "@tanstack/react-table"
import {
  SpecialityDTO
}                             from "@/modules/speciality/application/speciality_dto"
import {
  readSearchParams,
  updateSearchParamsShallow
} from "@/components/data_table/codec"
const columns: ColumnDef<SpecialityDTO>[] = [
  {
    accessorKey: "name",
    header     : "Nombre"
  }
]


interface WorkerApiResponse { items: SpecialityDTO[]; total: number; }

const DEFAULT_PAGE_SIZE = 10;
const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 1000;

function parseNum(v: string | null, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}
function clampSize(n: number) {
  if (n < MIN_PAGE_SIZE) return DEFAULT_PAGE_SIZE;
  if (n > MAX_PAGE_SIZE) return MAX_PAGE_SIZE;
  return Math.floor(n);
}

/* server fetch */
async function fetchWorkersAPI(page: number, size: number): Promise<WorkerApiResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(size));
  params.set("skip", String(page * size));
  const res = await fetch(`/api/speciality?${params.toString()}`);
  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return res.json();
}

export default function WorkersPage() {
  // init from URL
  const [pageIndex, setPageIndex] = React.useState(() => {
    const sp = readSearchParams();
    return parseNum(sp.get("page"), 0);
  });
  const [pageSize, setPageSize] = React.useState(() => {
    const sp = readSearchParams();
    return clampSize(parseNum(sp.get("size"), DEFAULT_PAGE_SIZE));
  });

  // sync back/forward
  React.useEffect(() => {
    const onPop = () => {
      const sp = readSearchParams();
      setPageIndex(parseNum(sp.get("page"), 0));
      setPageSize(clampSize(parseNum(sp.get("size"), DEFAULT_PAGE_SIZE)));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const queryClient = useQueryClient();

  const {
          data,
          isPending,
          isFetching,
          isError,
          error,
        } = useQuery<WorkerApiResponse>({
    queryKey: ["workers", pageIndex, pageSize],
    queryFn: () => fetchWorkersAPI(pageIndex, pageSize),
    placeholderData: keepPreviousData
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  // push to URL shallow + update state
  const pushUrl = (newPage: number, newSize: number = pageSize) => {
    updateSearchParamsShallow((sp) => {
      sp.set("page", String(newPage));
      sp.set("size", String(newSize));
    });
    setPageIndex(newPage);
    setPageSize(newSize);
  };

  const handlePageSizeChange = (s: number) => {
    const safe = clampSize(s);
    if (safe === pageSize) return;
    pushUrl(0, safe);
  };

  const handlePageChange = (pIdx: number) => {
    if (pIdx === pageIndex) return;
    pushUrl(pIdx);
  };

  const makeHref = (page1: number) => {
    const u = new URL(window.location.href);
    const pIdx = page1 - 1;
    u.searchParams.set("page", String(pIdx));
    u.searchParams.set("size", String(pageSize));
    return u.pathname + "?" + u.searchParams.toString();
  };

  const handlePageHover = (page1: number) => {
    const pIdx = page1 - 1;
    if (pIdx === pageIndex) return;
    queryClient.prefetchQuery({
      queryKey: ["workers", pIdx, pageSize],
      queryFn: () => fetchWorkersAPI(pIdx, pageSize),
      staleTime: 30_000,
    });
  };

  // estado de error
  if (isError) {
    return (
      <div className="p-4 text-sm text-destructive">
        Error: {(error as Error)?.message ?? "desconocido"}
      </div>
    );
  }

  // skeleton sólo en primer render (sin data aún)
  if (isPending && !data) {
    return (
      <div className="p-4">
        <div className="h-8 w-full animate-pulse bg-muted/50 mb-2" />
        <div className="h-8 w-full animate-pulse bg-muted/50 mb-2" />
        <div className="h-8 w-full animate-pulse bg-muted/50" />
      </div>
    );
  }

  // loading inline (no cortar render)
  const loading = isFetching && !isPending;

  return (
    <div className="p-4">
      <DataTablePaginated
        columns={columns}
        data={items}
        total={total}
        pageIndex={pageIndex}
        pageSize={pageSize}
        makeHref={makeHref}
        onPageChange={handlePageChange}
        onPageHover={handlePageHover}
        onPageSizeChange={handlePageSizeChange}
        boundaries={1}
        siblings={1}
        emptyMessage="Sin resultados."
        loading={loading}
      />
    </div>
  );
}
