"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient, QueryKey } from "@tanstack/react-query";
import {
  PageParams,
  PageResult,
  SortDir
} from "@/components/data_table/types"
import {
  ParamCodec
}                                                  from "@/components/data_table/codec"

interface UseServerPagedQueryOpts<TItem, TFilters> {
  /** Base de la cache key React Query, ej: "workers" o ["workers"] */
  queryKeyBase: string;
  /** Fetcher server-side. */
  fetchFn: (params: PageParams<TFilters>) => Promise<PageResult<TItem>>;
  /** Param codec (spread/json/custom). */
  codec: ParamCodec<TFilters>;
  /** Defaults. */
  defaultPageSize?: number;
  minPageSize?: number;
  maxPageSize?: number;
}

interface UseServerPagedQueryReturn<TItem, TFilters> {
  items: TItem[];
  total: number;
  pageIndex: number;
  pageSize: number;
  filters?: TFilters;
  sortBy?: string;
  sortType?: SortDir;
  isPending: boolean;
  isFetching: boolean;
  error: unknown;
  /* Mutators */
  setPageIndex: (n: number) => void;
  setPageSize: (n: number) => void;
  setFilters: (f?: TFilters) => void;    // reset page
  setSort: (field?: string, dir?: SortDir) => void; // reset page
  /* Helpers for paginator/DataTable */
  makeHref: (page1: number) => string;
  prefetchPage: (pageIndex: number) => void;
}

export function usePagedQuery<TItem, TFilters = Record<string, any>>(
  opts: UseServerPagedQueryOpts<TItem, TFilters>
): UseServerPagedQueryReturn<TItem, TFilters> {
  const {
          queryKeyBase,
          fetchFn,
          codec,
          defaultPageSize = 10,
          minPageSize = 1,
          maxPageSize = 1000,
        } = opts;

  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // read basics
  const rawPage = sp.get("page");
  const rawSize = sp.get("size");
  let pageIndex = Number(rawPage);
  if (!Number.isFinite(pageIndex) || pageIndex < 0) pageIndex = 0;
  let pageSize = Number(rawSize);
  if (!Number.isFinite(pageSize) || pageSize < minPageSize) pageSize = defaultPageSize;
  if (pageSize > maxPageSize) pageSize = maxPageSize;

  // parse filters & sort
  const { filters, sortBy, sortType } = codec.parse(sp);

  // React Query
  const queryKey: QueryKey = [
    ...Array.isArray(queryKeyBase) ? queryKeyBase : [queryKeyBase],
    pageIndex,
    pageSize,
    filters,
    sortBy,
    sortType,
  ];

  const query = useQuery<PageResult<TItem>>({
    queryKey,
    queryFn: () =>
      fetchFn({ page: pageIndex, size: pageSize, filters, sortBy, sortType }),
  });

  const { data, isPending, isFetching, error } = query;
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  // URL write helper
  const pushUrl = (params: {
    page?: number;
    size?: number;
    filters?: TFilters;
    sortBy?: string;
    sortType?: SortDir;
    resetPage?: boolean;
  }) => {
    const next = new URLSearchParams(sp.toString());

    const nextSize = params.size ?? pageSize;
    const nextPage = params.resetPage ? 0 : (params.page ?? pageIndex);

    next.set("page", String(Math.max(0, nextPage)));
    next.set(
      "size",
      String(Math.min(Math.max(nextSize, minPageSize), maxPageSize))
    );

    codec.apply(next, params.filters ?? filters, params.sortBy ?? sortBy, params.sortType ?? sortType);

    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  // mutators
  const setPageIndex = (n: number) => pushUrl({ page: n });
  const setPageSize = (n: number) => pushUrl({ size: n, resetPage: true });
  const setFilters = (f?: TFilters) => pushUrl({ filters: f, resetPage: true });
  const setSort = (field?: string, dir?: SortDir) =>
    pushUrl({ sortBy: field, sortType: dir, resetPage: true });

  // makeHref for Paginator
  const makeHref = (page1: number) => {
    const next = new URLSearchParams(sp.toString());
    const idx = Math.max(0, page1 - 1);
    next.set("page", String(idx));
    next.set("size", String(pageSize));
    codec.apply(next, filters, sortBy, sortType);
    return `${pathname}?${next.toString()}`;
  };

  // prefetch
  const prefetchPage = (pIdx: number) => {
    if (pIdx === pageIndex) return;
    const key: QueryKey = [
      queryKeyBase,
      pIdx,
      pageSize,
      filters,
      sortBy,
      sortType,
    ];
    queryClient.prefetchQuery({
      queryKey: key,
      queryFn: () =>
        fetchFn({ page: pIdx, size: pageSize, filters, sortBy, sortType }),
      staleTime: 30_000,
    });
  };

  return {
    items,
    total,
    pageIndex,
    pageSize,
    filters,
    sortBy,
    sortType,
    isPending,
    isFetching,
    error,
    setPageIndex,
    setPageSize,
    setFilters,
    setSort,
    makeHref,
    prefetchPage,
  };
}
