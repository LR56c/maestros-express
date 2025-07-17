// components/data_table/paginator.tsx
"use client"

import * as React                    from "react"
import Link                          from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from "@/components/ui/pagination"

type SortableReactNode = React.ReactNode;

export type PaginatorProps = {
  currentPage: number;                         // 1-based
  totalPages: number;
  makeHref: ( page1: number ) => string;
  onPageHover?: ( page1: number ) => void;
  onPageClick?: ( page1: number ) => void;       // side-effects solo (Link navega)
  showPreviousNext?: boolean;
  /** # páginas SIEMPRE visibles al inicio y al final (default 1). */
  boundaries?: number;
  /** # páginas a cada lado de la actual (default 1). */
  siblings?: number;
  prevLabel?: SortableReactNode;
  nextLabel?: SortableReactNode;
};

/* ---------- estilos ---------- */
const baseLinkCls =
        "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm " +
        "transition-colors hover:bg-accent hover:text-accent-foreground"
const activeCls   =
        "bg-primary text-primary-foreground border-primary pointer-events-none"

/* ---------- Página numérica ---------- */
function PageNumber( {
  pageNum,
  isCurrent,
  href,
  onPageHover,
  onPageClick
}: {
  pageNum: number;
  isCurrent: boolean;
  href: string;
  onPageHover?: ( p: number ) => void;
  onPageClick?: ( p: number ) => void;
} )
{
  if ( isCurrent ) {
    return (
      <PaginationItem>
        <PaginationLink
          className={ `${ baseLinkCls } ${ activeCls }` }
          aria-current="page"
        >
          { pageNum }
        </PaginationLink>
      </PaginationItem>
    )
  }

  return (
    <PaginationItem>
      <Link
        className={ baseLinkCls }
        href={ href }
        scroll={ false }
        onMouseEnter={ () => onPageHover?.( pageNum ) }
        onClick={ () => onPageClick?.( pageNum ) }
      >
        { pageNum }
      </Link>
    </PaginationItem>
  )
}

/* ---------- Prev / Next ---------- */
function NavLink( {
  icon,
  label,
  targetPage,
  disabled,
  href,
  onPageHover,
  onPageClick
}: {
  icon: "prev" | "next";
  label: SortableReactNode;
  targetPage: number;
  disabled: boolean;
  href: string;
  onPageHover?: ( p: number ) => void;
  onPageClick?: ( p: number ) => void;
} )
{
  const content =
          icon === "prev" ? (
            <>
              <ChevronLeft className="mr-1 h-4 w-4"/>
              { label }
            </>
          ) : (
            <>
              { label }
              <ChevronRight className="ml-1 h-4 w-4"/>
            </>
          )

  if ( disabled ) {
    return (
      <PaginationItem>
        <span
          className={ `${ baseLinkCls } opacity-50 pointer-events-none select-none` }
        >
          { content }
        </span>
      </PaginationItem>
    )
  }

  return (
    <PaginationItem>
      <Link
        href={ href }
        className={ baseLinkCls }
        scroll={ false }
        onMouseEnter={ () => onPageHover?.( targetPage ) }
        onClick={ () => onPageClick?.( targetPage ) }
      >
        { content }
      </Link>
    </PaginationItem>
  )
}

/* ---------- Construir rango (boundaries + siblings) ---------- */
function getRange(
  current: number,
  total: number,
  boundaries: number,
  siblings: number
): ( number | "ellipsis-left" | "ellipsis-right" )[] {
  const range: ( number | "ellipsis-left" | "ellipsis-right" )[] = []

  const startPages = []
  for ( let i = 1; i <= Math.min( boundaries, total ); i++ ) {
    startPages.push( i )
  }

  const endPages = []
  for ( let i = Math.max( total - boundaries + 1, boundaries + 1 ); i <=
  total; i++ )
  {
    if ( i >= 1 ) endPages.push( i )
  }

  const middleStart = Math.max(
    boundaries + 1,
    current - siblings
  )
  const middleEnd   = Math.min(
    total - boundaries,
    current + siblings
  )

  // merge start
  range.push( ...startPages )

  // gap start?
  if ( middleStart > (
    startPages[startPages.length - 1] ?? 0
  ) + 1 )
  {
    range.push( "ellipsis-left" )
  }

  // middle pages
  for ( let p = middleStart; p <= middleEnd; p++ ) {
    if ( p >= 1 && p <= total ) range.push( p )
  }

  // gap end?
  const firstEnd = endPages[0]
  if ( firstEnd != null && middleEnd < firstEnd - 1 ) {
    range.push( "ellipsis-right" )
  }

  // merge end
  range.push( ...endPages )

  // dedupe accidental overlaps
  const deduped: typeof range = []
  let last: number | string | undefined
  for ( const token of range ) {
    if ( token === last ) continue
    deduped.push( token )
    last = token
  }

  return deduped
}

/* ---------- Paginator root ---------- */
export default function Paginator( {
  currentPage,
  totalPages,
  makeHref,
  onPageHover,
  onPageClick,
  showPreviousNext = true,
  boundaries = 1,
  siblings = 1,
  prevLabel = "Previous",
  nextLabel = "Next"
}: PaginatorProps )
{
  if ( totalPages < 1 ) return null

  const prev = currentPage - 1
  const next = currentPage + 1

  const tokens = getRange( currentPage, totalPages, boundaries, siblings )

  return (
    <Pagination>
      <PaginationContent className="gap-1">
        { showPreviousNext && (
          <NavLink
            icon="prev"
            label={ prevLabel }
            targetPage={ prev }
            disabled={ currentPage <= 1 }
            href={ makeHref( prev ) }
            onPageHover={ onPageHover }
            onPageClick={ onPageClick }
          />
        ) }

        { tokens.map( ( t ) => {
          if ( typeof t === "number" ) {
            return (
              <PageNumber
                key={ t }
                pageNum={ t }
                isCurrent={ t === currentPage }
                href={ makeHref( t ) }
                onPageHover={ onPageHover }
                onPageClick={ onPageClick }
              />
            )
          }
          // ellipsis tokens
          return <PaginationEllipsis key={ t }/>
        } ) }

        { showPreviousNext && (
          <NavLink
            icon="next"
            label={ nextLabel }
            targetPage={ next }
            disabled={ currentPage >= totalPages }
            href={ makeHref( next ) }
            onPageHover={ onPageHover }
            onPageClick={ onPageClick }
          />
        ) }
      </PaginationContent>
    </Pagination>
  )
}
