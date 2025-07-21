"use client"

import {
  keepPreviousData,
  QueryKey,
  useQuery,
  useQueryClient,
  UseQueryResult
}                                           from "@tanstack/react-query"
import { useCallback, useEffect, useState } from "react"

export type SortDir = "asc" | "desc"

export interface PageParams<TFilters = Record<string, any>> {
  page: number
  size: number
  filters?: TFilters
  sortBy?: string
  sortType?: SortDir
}

export interface PageResult<TItem> {
  items: TItem[]
  total: number
}

export interface UsePagedResourceOptions<TItem, TFilters> {
  endpoint: string
  defaultPageSize?: number
}

const RESERVED_SET = new Set( ["page", "size", "sort_by", "sort_type"] )

function readSearchParams(): URLSearchParams {
  if ( typeof window === "undefined" ) return new URLSearchParams()
  return new URLSearchParams( window.location.search )
}

function shallowReplaceSearch( sp: URLSearchParams ) {
  if ( typeof window === "undefined" ) return
  const u  = new URL( window.location.href )
  u.search = sp.toString()
  window.history.pushState( {}, "", u.toString() )
}

function parseSortType( v: string | null ): SortDir | undefined {
  if ( !v ) return
  const lc = v.toLowerCase()
  return lc === "asc" || lc === "desc" ? (
    lc as SortDir
  ) : undefined
}

function parseFiltersSpread<TFilters>( sp: URLSearchParams ): TFilters | undefined {
  const obj: Record<string, any> = {}
  sp.forEach( ( v, k ) => {
    if ( !RESERVED_SET.has( k ) ) obj[k] = v
  } )
  return Object.keys( obj ).length ? (
    obj as TFilters
  ) : undefined
}

function clearNonReserved( sp: URLSearchParams ) {
  const toDel: string[] = []
  sp.forEach( ( _v, k ) => {
    if ( !RESERVED_SET.has( k ) ) toDel.push( k )
  } )
  toDel.forEach( ( k ) => sp.delete( k ) )
}

function applyFiltersSpread<TFilters>( sp: URLSearchParams,
  filters: TFilters | undefined )
{
  clearNonReserved( sp )
  if ( filters ) {
    Object.entries( filters as Record<string, any> ).forEach( ( [k, v] ) => {
      if ( v == null ) return
      sp.set( k, String( v ) )
    } )
  }
}

function buildFetchURL<TFilters>(
  endpoint: string,
  params: PageParams<TFilters>
): string {
  const { page, size, filters, sortBy, sortType } = params
  const qs                                        = new URLSearchParams()
  qs.set( "limit", String( size ) )
  qs.set( "skip", String( page * size ) )
  if ( sortBy ) qs.set( "sort_by", sortBy )
  if ( sortType ) qs.set( "sort_type", sortType )
  if ( filters ) {
    Object.entries( filters as Record<string, any> ).forEach( ( [k, v] ) => {
      if ( v == null ) return
      qs.set( k, String( v ) )
    } )
  }
  return `${ endpoint }?${ qs.toString() }`
}

async function defaultFetch<TItem, TFilters>(
  endpoint: string,
  params: PageParams<TFilters>
): Promise<PageResult<TItem>> {
  const url = buildFetchURL( endpoint, params )
  console.log( `Fetching paged resource from: ${ url }` )
  const res = await fetch( url )
  if ( !res.ok ) throw new Error( `Fetch error ${ res.status }` )
  return res.json()
}


export interface UsePagedResourceReturn<TItem, TFilters> {
  items: TItem[]
  total: number
  data?: PageResult<TItem>
  pageIndex: number
  pageSize: number
  filters?: TFilters
  sortBy?: string
  sortType?: SortDir
  refetch: UseQueryResult<PageResult<TItem>, unknown>["refetch"]
  setPageIndex: ( n: number ) => void
  setPageSize: ( n: number ) => void
  setFilters: ( f?: TFilters ) => void
  setSort: ( field?: string, dir?: SortDir ) => void
  makeHref: ( page1: number ) => string
  prefetchPage: ( pageIndex: number ) => void
  isPending: boolean
  isFetching: boolean
  isError: boolean
  error: unknown
  loadingInitial: boolean
}


export function usePagedResource<TItem, TFilters = Record<string, any>>(
  opts: UsePagedResourceOptions<TItem, TFilters>
): UsePagedResourceReturn<TItem, TFilters> {
  const { endpoint, defaultPageSize = 10 } = opts

  const init = useCallback( () => {
    const sp      = readSearchParams()
    let pageIndex = Number( sp.get( "page" ) )
    if ( !Number.isFinite( pageIndex ) || pageIndex < 0 ) pageIndex = 0
    let pageSize = Number( sp.get( "size" ) )
    if ( !Number.isFinite( pageSize ) || pageSize < 1 ) {
      pageSize =
        defaultPageSize
    }
    const filters  = parseFiltersSpread<TFilters>( sp )
    const sortBy   = sp.get( "sort_by" ) ?? undefined
    const sortType = parseSortType( sp.get( "sort_type" ) )
    return { pageIndex, pageSize, filters, sortBy, sortType }
  }, [defaultPageSize] )

  const [state, setState] = useState( init )

  useEffect( () => {
    const onPop = () => setState( init() )
    window.addEventListener( "popstate", onPop )
    return () => window.removeEventListener( "popstate", onPop )
  }, [init] )

  const updateUrl = ( updater: ( sp: URLSearchParams ) => void ) => {
    const sp = readSearchParams()
    updater( sp )
    shallowReplaceSearch( sp )
  }

  const setPageIndex = ( n: number ) => {
    updateUrl( ( sp ) => {
      sp.set( "page", String( Math.max( 0, n ) ) )
      sp.set( "size", String( Math.max( 1, state.pageSize ) ) )
      applyFiltersSpread( sp, state.filters )
      state.sortBy ? sp.set( "sort_by", state.sortBy ) : sp.delete( "sort_by" )
      state.sortType ? sp.set( "sort_type", state.sortType ) : sp.delete(
        "sort_type" )
    } )
    setState( ( s ) => (
      { ...s, pageIndex: Math.max( 0, n ) }
    ) )
  }

  const setPageSize = ( n: number ) => {
    const size = Math.max( 1, n )
    updateUrl( ( sp ) => {
      sp.set( "page", "0" )
      sp.set( "size", String( size ) )
      applyFiltersSpread( sp, state.filters )
      state.sortBy ? sp.set( "sort_by", state.sortBy ) : sp.delete( "sort_by" )
      state.sortType ? sp.set( "sort_type", state.sortType ) : sp.delete(
        "sort_type" )
    } )
    setState( ( s ) => (
      { ...s, pageIndex: 0, pageSize: size }
    ) )
  }

  const setFilters = ( f?: TFilters ) => {
    updateUrl( ( sp ) => {
      sp.set( "page", "0" )
      sp.set( "size", String( Math.max( 1, state.pageSize ) ) )
      applyFiltersSpread( sp, f )
      state.sortBy ? sp.set( "sort_by", state.sortBy ) : sp.delete( "sort_by" )
      state.sortType ? sp.set( "sort_type", state.sortType ) : sp.delete(
        "sort_type" )
    } )
    setState( ( s ) => (
      { ...s, pageIndex: 0, filters: f }
    ) )
  }

  const setSort = ( field?: string, dir?: SortDir ) => {
    updateUrl( ( sp ) => {
      sp.set( "page", "0" )
      sp.set( "size", String( Math.max( 1, state.pageSize ) ) )
      applyFiltersSpread( sp, state.filters )
      field ? sp.set( "sort_by", field ) : sp.delete( "sort_by" )
      dir ? sp.set( "sort_type", dir ) : sp.delete( "sort_type" )
    } )
    setState( ( s ) => (
      { ...s, pageIndex: 0, sortBy: field, sortType: dir }
    ) )
  }

  const makeHref = ( page1: number ) => {
    const idx = Math.max( 0, page1 - 1 )
    const sp  = readSearchParams()
    sp.set( "page", String( idx ) )
    sp.set( "size", String( state.pageSize ) )
    applyFiltersSpread( sp, state.filters )
    state.sortBy ? sp.set( "sort_by", state.sortBy ) : sp.delete( "sort_by" )
    state.sortType ? sp.set( "sort_type", state.sortType ) : sp.delete(
      "sort_type" )
    return (
      typeof window === "undefined" ? "" : window.location.pathname
    ) + "?" + sp.toString()
  }

  const params: PageParams<TFilters> = {
    page    : state.pageIndex,
    size    : state.pageSize,
    filters : state.filters,
    sortBy  : state.sortBy,
    sortType: state.sortType
  }

  const queryKey: QueryKey = [
    "paged",
    endpoint,
    params.page,
    params.size,
    params.filters ?? {},
    params.sortBy ?? "",
    params.sortType ?? ""
  ]

  const query = useQuery<PageResult<TItem>>( {
    queryKey,
    queryFn        : () => defaultFetch<TItem, TFilters>( endpoint, params ),
    placeholderData: keepPreviousData
  } )

  const {
          data,
          isPending,
          isFetching,
          refetch,
          isError,
          error
        } = query

  const items = data?.items ?? []
  const total = data?.total ?? 0

  const queryClient  = useQueryClient()
  const prefetchPage = ( pIdx: number ) => {
    const nextParams: PageParams<TFilters> = { ...params, page: pIdx }
    const nextKey: QueryKey                = [
      "paged",
      endpoint,
      pIdx,
      params.size,
      params.filters ?? {},
      params.sortBy ?? "",
      params.sortType ?? ""
    ]
    queryClient.prefetchQuery( {
      queryKey : nextKey,
      queryFn  : () => defaultFetch<TItem, TFilters>( endpoint, nextParams ),
      staleTime: 30_000
    } )
  }

  const loadingInitial = isPending && !data

  return {
    items,
    total,
    data,
    refetch,
    pageIndex: state.pageIndex,
    pageSize : state.pageSize,
    filters  : state.filters,
    sortBy   : state.sortBy,
    sortType : state.sortType,
    setPageIndex,
    setPageSize,
    setFilters,
    setSort,
    makeHref,
    prefetchPage,
    isPending,
    isFetching,
    isError,
    error,
    loadingInitial,
  }
}

// function exampleClearStatusOnly() {
//   if (!filters) return
//   const { status, ...rest } = filters
//   setFilters(Object.keys(rest).length ? (rest as TFilters) : undefined)
// }