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
import { CountryDTO }       from "@/modules/country/application/country_dto"

interface CountryFilters {
}


const columns: ColumnDef<CountryDTO>[] = [
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
    accessorKey: "name",
    header     : "Nombre"
  },
  {
    accessorKey: "code",
    header     : "Codigo"
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
      const country = row.original
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

export default function CountryPage() {
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
        } = usePagedResource<CountryDTO, CountryFilters>( {
    endpoint       : "/api/country",
    defaultPageSize: 10
  } )

  const [selecteds, setSelecteds] = useState<CountryDTO[]>( [] )

  const handleSelectionChange = useCallback(
    ( rows: CountryDTO[] ) => {
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
