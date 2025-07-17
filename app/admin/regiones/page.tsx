"use client"
import * as React                from "react"
import { useCallback, useState } from "react"
import { ColumnDef }             from "@tanstack/react-table"

import {
  DataTablePaginated
}                           from "@/components/data_table/data_table_paginated"
import { usePagedResource } from "@/components/data_table/usePagedQuery"
import { MoreHorizontal }   from "lucide-react"
import { Checkbox }         from "@/components/ui/checkbox"
import { Button }           from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
}                           from "@/components/ui/dropdown-menu"
import { RegionDTO }        from "@/modules/region/application/region_dto"

interface RegionFilters {
}


const columns: ColumnDef<RegionDTO>[] = [
  {
    id           : "select",
    header       : ( { table } ) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (
            table.getIsSomePageRowsSelected() && "indeterminate"
          )
        }
        onCheckedChange={ ( value ) => table.toggleAllPageRowsSelected(
          !!value ) }
        aria-label="Select all"
      />
    ),
    cell         : ( { row } ) => (
      <Checkbox
        checked={ row.getIsSelected() }
        onCheckedChange={ ( value ) => row.toggleSelected( !!value ) }
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding : false
  },
  {
    header     : "Pais",
    cell: ( { row } ) => {
      const region = row.original
      return (
        <span className="capitalize">{ region.country.name }</span>
      )
    }
  },
  {
    accessorKey: "name",
    header     : "Nombre"
  },
  {
    id: "actions",
    // header: () => {
    //   return (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger asChild>
    //         <Button variant="ghost">
    //           <MoreHorizontal/>
    //         </Button>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent align="end">
    //         <DropdownMenuItem>Eliminar seleccionados</DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   )
    // },
    cell: ( { row } ) => {
      const speciality = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MoreHorizontal/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

export default function RegionPage() {
  const {
          items,
          total,
          pageIndex,
          pageSize,
          setPageIndex,
          setPageSize,
          makeHref,
          prefetchPage,
          loadingInitial,
          isFetching,
          isError,
          error
        } = usePagedResource<RegionDTO, RegionFilters>( {
    endpoint       : "/api/region",
    defaultPageSize: 10
  } )

  const [selecteds, setSelecteds] = useState<RegionDTO[]>( [] )

  const handleSelectionChange = useCallback(
    ( rows: RegionDTO[] ) => {
      setSelecteds( rows )
    },
    []
  )

  if ( isError ) {
    return (
      <div className="p-4 text-sm text-destructive">
        Error: { (
        error as Error
      )?.message ?? "desconocido" }
      </div>
    )
  }

  if ( loadingInitial ) {
    return (
      <div className="p-4">
        <div className="h-8 w-full animate-pulse bg-muted/50 mb-2"/>
        <div className="h-8 w-full animate-pulse bg-muted/50 mb-2"/>
        <div className="h-8 w-full animate-pulse bg-muted/50"/>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <DataTablePaginated
        columns={ columns }
        data={ items }
        total={ total }
        pageIndex={ pageIndex }
        pageSize={ pageSize }
        onSelectionChange={ handleSelectionChange }
        getRowId={ ( row ) => row.id }
        makeHref={ makeHref }
        onPageChange={ setPageIndex }
        onPageHover={ ( p1 ) => prefetchPage( p1 - 1 ) }
        onPageSizeChange={ setPageSize }
        boundaries={ 1 }
        siblings={ 1 }
        emptyMessage="Sin resultados."
        loading={ isFetching }
      />
    </div>
  )
}
