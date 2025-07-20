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
import {
  UserResponse
}                           from "@/modules/user/application/models/user_response"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
}                           from "@/components/ui/dialog"
import { UserAdminDialog }  from "@/components/admin/user_admin_dialog"

interface SpecialityFilters {
}


const columns: ColumnDef<UserResponse>[] = [
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
    accessorKey: "full_name",
    header     : "Nombre"
  },
  {
    accessorKey: "role",
    header     : "Rol"
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
      const user = row.original
      const [open, setOpen] = useState(false)
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <MoreHorizontal/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={()=> setOpen(true)}>
                Ver
              </DropdownMenuItem>
              <DropdownMenuItem>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-3/4 overflow-y-auto">
              <UserAdminDialog user={ user }/>
            </DialogContent>
          </Dialog>
        </>
      )
    }
  }
]

export default function UsersPage() {
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
        } = usePagedResource<UserResponse, SpecialityFilters>( {
    endpoint       : "/api/user",
    defaultPageSize: 10
  } )

  const [selecteds, setSelecteds] = useState<UserResponse[]>( [] )

  const handleSelectionChange = useCallback(
    ( rows: UserResponse[] ) => {
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
        getRowId={ ( row ) => row.user_id }
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
