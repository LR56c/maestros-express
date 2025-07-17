// components/data_table/paginator-shallow.tsx
"use client"

import * as React                    from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
}                                    from "@/components/ui/pagination"

type SortableReactNode = React.ReactNode;

export interface PaginatorShallowProps {
  currentPage: number;                         // 1-based
  totalPages: number;
  makeHref: ( page1: number ) => string;         // for display / open in new tab
  onNavigate: ( page1: number ) => void;         // shallow nav callback
  onPageHover?: ( page1: number ) => void;
  showPreviousNext?: boolean;
  boundaries?: number;
  siblings?: number;
  prevLabel?: SortableReactNode;
  nextLabel?: SortableReactNode;
}

const baseLinkCls =
        "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm " +
        "transition-colors hover:bg-accent hover:text-accent-foreground"
const activeCls   =
        "bg-primary text-primary-foreground border-primary pointer-events-none"

function handleAnchorClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  page1: number,
  onNavigate: ( p: number ) => void
)
{
  // dejar pasar si usuario quiere nueva pestaña/descarga/navegación especial
  if (
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey ||
    e.button === 1 // middle click
  )
  {
    return
  }
  e.preventDefault()
  onNavigate( page1 )
}

/* ---------- Página numérica ---------- */
function PageNumber( {
  pageNum,
  isCurrent,
  href,
  onNavigate,
  onPageHover
}: {
  pageNum: number;
  isCurrent: boolean;
  href: string;
  onNavigate: ( p: number ) => void;
  onPageHover?: ( p: number ) => void;
} )
{
  if ( isCurrent ) {
    return (
      <PaginationItem>
        <PaginationLink className={ `${ baseLinkCls } ${ activeCls }` }
                        aria-current="page">
          { pageNum }
        </PaginationLink>
      </PaginationItem>
    )
  }

  return (
    <PaginationItem>
      <PaginationLink
        href={ href }
        onClick={ ( e ) => handleAnchorClick( e, pageNum, onNavigate ) }
        onMouseEnter={ () => onPageHover?.( pageNum ) }
        className={ baseLinkCls }>
        { pageNum }
      </PaginationLink>
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
  onNavigate,
  onPageHover
}: {
  icon: "prev" | "next";
  label: SortableReactNode;
  targetPage: number;
  disabled: boolean;
  href: string;
  onNavigate: ( p: number ) => void;
  onPageHover?: ( p: number ) => void;
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
      <PaginationLink
        href={ href }
        onClick={ ( e ) => handleAnchorClick( e, targetPage, onNavigate ) }
        onMouseEnter={ () => onPageHover?.( targetPage ) }
        className={ baseLinkCls }>
        { content }
      </PaginationLink>
    </PaginationItem>
  )
}

/* ---------- tokens (boundaries + siblings) ---------- */
function getRange(
  current: number,
  total: number,
  boundaries: number,
  siblings: number
): ( number | "ellipsis-left" | "ellipsis-right" )[] {
  const range: ( number | "ellipsis-left" | "ellipsis-right" )[] = []

  const startPages = []
  for ( let i = 1; i <= Math.min( boundaries, total ); i++ ) startPages.push(
    i )

  const endPages = []
  for ( let i = Math.max( total - boundaries + 1, boundaries + 1 ); i <=
  total; i++ )
    endPages.push( i )

  const middleStart = Math.max( boundaries + 1, current - siblings )
  const middleEnd   = Math.min( total - boundaries, current + siblings )

  range.push( ...startPages )
  if ( middleStart > startPages[startPages.length - 1]! + 1 ) {
    range.push(
      "ellipsis-left" )
  }
  for ( let p = middleStart; p <= middleEnd; p++ ) range.push( p )
  if ( middleEnd < endPages[0]! - 1 ) range.push( "ellipsis-right" )
  range.push( ...endPages )

  // dedupe
  const deduped: typeof range = []
  let last: any
  for ( const token of range ) {
    if ( token === last ) continue
    deduped.push( token )
    last = token
  }
  return deduped
}

/* ---------- Root ---------- */
export default function PaginatorShallow( {
  currentPage,
  totalPages,
  makeHref,
  onNavigate,
  onPageHover,
  showPreviousNext = true,
  boundaries = 1,
  siblings = 1,
  prevLabel = "Previous",
  nextLabel = "Next"
}: PaginatorShallowProps )
{
  if ( totalPages < 1 ) return null

  const prev   = currentPage - 1
  const next   = currentPage + 1
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
            onNavigate={ onNavigate }
            onPageHover={ onPageHover }
          />
        ) }

        { tokens.map( ( t ) =>
          typeof t === "number" ? (
            <PageNumber
              key={ t }
              pageNum={ t }
              isCurrent={ t === currentPage }
              href={ makeHref( t ) }
              onNavigate={ onNavigate }
              onPageHover={ onPageHover }
            />
          ) : (
            <PaginationEllipsis key={ t }/>
          )
        ) }

        { showPreviousNext && (
          <NavLink
            icon="next"
            label={ nextLabel }
            targetPage={ next }
            disabled={ currentPage >= totalPages }
            href={ makeHref( next ) }
            onNavigate={ onNavigate }
            onPageHover={ onPageHover }
          />
        ) }
      </PaginationContent>
    </Pagination>
  )
}
