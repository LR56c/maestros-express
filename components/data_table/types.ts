export type SortDir = "asc" | "desc";

export interface PageParams<TFilters = Record<string, any>> {
  page: number;        // 0-based
  size: number;
  filters?: TFilters;
  sortBy?: string;
  sortType?: SortDir;
}

export interface PageResult<TItem> {
  items: TItem[];
  total: number;
}
