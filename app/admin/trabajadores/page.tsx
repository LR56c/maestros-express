"use client"
import * as React                from "react"
import { ColumnDef }             from "@tanstack/react-table"

import {
  DataTablePaginated
}                                               from "@/components/data_table/data_table_paginated"
import {
  usePagedResource
}                                               from "@/components/data_table/usePagedQuery"
import { Eye }                                  from "lucide-react"
import { Checkbox }                             from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button }                               from "@/components/ui/button"
import {
  WorkerAdminDialog
}                                               from "@/components/admin/worker_admin_dialog"
import {
  WorkerResponse
}                                               from "@/modules/worker/application/worker_response"

interface WorkerFilters {
}

function getColumns( invalidateTable: () => void ): ColumnDef<WorkerResponse>[] {
  return [
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
      accessorKey: "user.full_name",
      header     : "Nombre"
    },
    {
      accessorKey: "user.status",
      header     : "Estado"
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
        const worker = row.original
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Eye/>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-3/4 overflow-y-auto">
              <WorkerAdminDialog worker={ worker } onUpdate={ invalidateTable }/>
            </DialogContent>
          </Dialog>
          // <DropdownMenu>
          //   <DropdownMenuTrigger asChild>
          //     <Button variant="ghost">
          //       <MoreHorizontal/>
          //     </Button>
          //   </DropdownMenuTrigger>
          //   <DropdownMenuContent align="end">
          //     <DropdownMenuItem>Editar</DropdownMenuItem>
          //     <DropdownMenuItem>Eliminar</DropdownMenuItem>
          //   </DropdownMenuContent>
          // </DropdownMenu>
        )
      }
    }
  ]
}

export default function WorkersPage() {
  const {
          items,
          total,
          pageIndex,
          pageSize,
          setPageIndex,
          setPageSize,
          refetch,
          makeHref,
          prefetchPage,
          loadingInitial,
          isFetching,
          isError,
          error
        } = usePagedResource<WorkerResponse, WorkerFilters>( {
    endpoint       : "/api/worker/admin",
    defaultPageSize: 10
  } )

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
        columns={ getColumns( async () => {
          await refetch()
        } ) }
        data={ items }
        total={ total }
        pageIndex={ pageIndex }
        pageSize={ pageSize }
        getRowId={ ( row ) => row.user.user_id }
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
