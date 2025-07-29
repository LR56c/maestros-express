"use client"
import * as React                from "react"
import { ColumnDef }             from "@tanstack/react-table"

import {
  DataTablePaginated
}                           from "@/components/data_table/data_table_paginated"
import { usePagedResource } from "@/components/data_table/usePagedQuery"
import { Loader2Icon, MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button }           from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
}                           from "@/components/ui/dropdown-menu"
import {
  UserResponse
} from "@/modules/user/application/models/user_response"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { UserAdminDialog } from "@/components/admin/user_admin_dialog"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { CountryDTO } from "@/modules/country/application/country_dto"
import {
  CountryAdminDialog
} from "@/components/admin/country_admin_dialog"

interface UserFilters{
  name?: string
}

export default function UsersPage() {
  const {
          items,
          total,
          pageIndex,
          pageSize,
          refetch,
          setPageIndex,
          setPageSize,
          makeHref,
          filters,
          setFilters,
          prefetchPage,
          loadingInitial,
          isFetching,
          isError,
          error
        } = usePagedResource<UserResponse, UserFilters>( {
    endpoint       : "/api/user",
    defaultPageSize: 10
  } )


  const [searchName, setSearchName] = useState( filters?.name ?? "" )

  const applyFilterForm = () => {
    const newFilters: UserFilters = {}
    if ( searchName.trim() ) newFilters.name = searchName.trim()
    setFilters( Object.keys( newFilters ).length ? newFilters : undefined )
  }
  const clearFilters    = () => setFilters( undefined )


  const {
          mutateAsync: removeMutateAsync,
          status     : removeStatus
        } = useMutation(
    {
      mutationFn: async ( id: string ) => {
        const param = new URLSearchParams()
        param.set( "id", id )
        const response = await fetch(
          `/api/user/?${ param.toString() }`,
          {
            method : "DELETE",
            headers: {
              "Content-Type": "application/json"
            }
          } )
        if ( !response.ok ) {
          return undefined
        }
        return await response.json()
      },
      onError   : () => {
        toast.error( "Error al eliminar" )
      },
      onSuccess : async () => {
        await refetch()
        toast.success( "Pais eliminado correctamente" )
      }
    } )

  const {
          mutateAsync: updateMutateAsync,
          status     : updateStatus
        } = useMutation(
    {
      mutationFn: async ( values: UserResponse ) => {
        const response = await fetch( "/api/user", {
          method : "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body   : JSON.stringify( values )
        } )
        if ( !response.ok ) {
          return undefined
        }
        return await response.json()
      },
      onError   : () => {
        toast.error( "Error al actualizar" )
      },
      onSuccess : async () => {
        await refetch()
        toast.success( "Pais actualizado correctamente" )
      }
    } )

  const [updating, setUpdating]         = useState( false )
  const [selectedItem, setSelectedItem] = useState<UserResponse | null>( null  )

  const handleUpdateUser = async ( data: UserResponse ) => {
    const result = await  updateMutateAsync(data)
    if ( !result ) {
      toast.error( "Error al actualizar el usuario" )
      return
    }
    setUpdating( false )
    setSelectedItem( null )
  }

  const handleDeleteUser = async ( user: UserResponse ) => {
    const result = await removeMutateAsync( user.user_id )
    if ( !result ) {
      toast.error( "Error al eliminar el usuario" )
      return
    }
    setSelectedItem( null )
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
      cell: ( { row } ) => {
        const user = row.original
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <MoreHorizontal/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={ () => {
                  setSelectedItem( user )
                  setUpdating( true )
                } }>Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={ () => handleDeleteUser( user ) }>Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      }
    }
  ]


  if ( isError ) {
    return (
      <div className="p-4 text-sm text-destructive">
        Error: { (
        error as Error
      )?.message ?? "Escondido" }
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
      <UserAdminDialog
        isOpen={updating}
        isLoading={updateStatus === "pending"}
        onOpenChange={setUpdating}
        title="Editar usuario"
        user={selectedItem}
        onSave={handleUpdateUser}
      />
      <Dialog onOpenChange={ () => {
      } } open={ removeStatus === "pending" }>
        <DialogContent
          className="sm:max-w-md w-full flex items-center justify-center gap-4 [&>button]:hidden">
          <Loader2Icon className="animate-spin"/>
          Eliminando...
        </DialogContent>
      </Dialog>
    </div>
  )
}
