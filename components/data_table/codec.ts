import { SortDir } from "@/components/data_table/types"

export interface ParamCodec<TFilters = Record<string, any>> {
  parse(sp: URLSearchParams): {
    filters?: TFilters;
    sortBy?: string;
    sortType?: SortDir;
  };
  apply(
    sp: URLSearchParams,
    filters?: TFilters,
    sortBy?: string,
    sortType?: SortDir
  ): void;
}

export interface SpreadCodecOpts<TFilters> {
  reservedKeys?: string[];                    // default
  coerce?: (key: string, raw: string) => any; // opcional tipado
}

export function createSpreadCodec<TFilters = Record<string, any>>(
  opts: SpreadCodecOpts<TFilters> = {}
): ParamCodec<TFilters> {
  const reserved = new Set(opts.reservedKeys ?? ["page", "size", "sort_by", "sort_type"]);
  const coerce = opts.coerce;

  return {
    parse(sp) {
      const filters: Record<string, any> = {};
      sp.forEach((v, k) => {
        if (!reserved.has(k)) {
          filters[k] = coerce ? coerce(k, v) : v;
        }
      });
      const sortBy = sp.get("sort_by") ?? undefined;
      const st = sp.get("sort_type");
      const sortType: SortDir | undefined =
              st && (st.toLowerCase() === "asc" || st.toLowerCase() === "desc")
                ? (st.toLowerCase() as SortDir)
                : undefined;

      return {
        filters: Object.keys(filters).length ? (filters as TFilters) : undefined,
        sortBy,
        sortType,
      };
    },

    apply(sp, filters, sortBy, sortType) {
      // limpia no reservados
      const toDel: string[] = [];
      sp.forEach((_v, k) => {
        if (!reserved.has(k)) toDel.push(k);
      });
      toDel.forEach((k) => sp.delete(k));

      // filtra
      if (filters) {
        Object.entries(filters as Record<string, any>).forEach(([k, v]) => {
          if (v == null) return;
          Array.isArray(v)
            ? v.forEach((vv) => sp.append(k, String(vv)))
            : sp.set(k, String(v));
        });
      }

      // sort
      sortBy ? sp.set("sort_by", sortBy) : sp.delete("sort_by");
      sortType ? sp.set("sort_type", sortType) : sp.delete("sort_type");
    },
  };
}

export function readSearchParams(): URLSearchParams {
  // safe in client components; guard for SSR
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

export function updateSearchParamsShallow(
  updater: (sp: URLSearchParams) => void
) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const sp = url.searchParams;
  updater(sp);
  // Actualiza URL sin navegación
  url.search = sp.toString();
  window.history.pushState({}, "", url.toString());
}
