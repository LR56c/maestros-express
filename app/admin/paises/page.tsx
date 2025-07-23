"use client"
import * as React    from "react"
import { useState }  from "react"
import { ColumnDef } from "@tanstack/react-table"

import {
  DataTablePaginated
}                                      from "@/components/data_table/data_table_paginated"
import {
  usePagedResource
}                                      from "@/components/data_table/usePagedQuery"
import { Loader2Icon, MoreHorizontal } from "lucide-react"
import { Checkbox }                    from "@/components/ui/checkbox"
import { Button }                      from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
}                                      from "@/components/ui/dropdown-menu"
import {
  CountryDTO
}                                      from "@/modules/country/application/country_dto"
import {
  CountryAdminDialog
}                                      from "@/components/admin/country_admin_dialog"
import { Input }                       from "@/components/ui/input"
import { Dialog, DialogContent }       from "@/components/ui/dialog"
import { useMutation }                 from "@tanstack/react-query"
import { toast }                       from "sonner"

interface CountryFilters {
  name?: string
}


export default function CountryPage() {
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
        } = usePagedResource<CountryDTO, CountryFilters>( {
    endpoint       : "/api/country",
    defaultPageSize: 10
  } )

  const [searchName, setSearchName] = useState( filters?.name ?? "" )

  const applyFilterForm = () => {
    const newFilters: CountryFilters = {}
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
          `/api/country/?${ param.toString() }`,
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
      mutationFn: async ( values: any ) => {
        const response = await fetch( "/api/country", {
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



  const {
          mutateAsync: createMutateAsync,
          status     : createStatus
        } = useMutation(
    {
      mutationFn: async ( values: any ) => {
        const response = await fetch( "/api/country", {
          method : "POST",
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
        toast.error( "Error al crear" )
      },
      onSuccess : async () => {
        await refetch()
        toast.success( "Pais creado correctamente" )
      }
    } )

  const [creating, setCreating]         = useState( false )
  const [updating, setUpdating]         = useState( false )
  const [selectedItem, setSelectedItem] = useState<any>( {} )

  const handleUpdateCountry = async ( data: CountryDTO ) => {
    console.log( "handleUpdateCountry", data )
    const result = await  updateMutateAsync(data)
    if ( !result ) {
      toast.error( "Error al actualizar el país" )
      return
    }
    setUpdating( false )
    setSelectedItem( {} )
  }

  const handleNewCountry = async ( data: CountryDTO ) => {
    const result = await createMutateAsync( data )
    if ( !result ) {
      toast.error( "Error al crear el país" )
      return
    }
    setCreating( false )
    setSelectedItem( {} )
  }

  const handleDeleteCountry = async ( country: CountryDTO ) => {
    const result = await removeMutateAsync( country.id )
    if ( !result ) {
      toast.error( "Error al eliminar el país" )
      return
    }
    setSelectedItem( {} )
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
              <DropdownMenuItem onClick={ () => {
                setSelectedItem( country )
                setUpdating( true )
              } }>Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={ () => handleDeleteCountry( country ) }>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input value={ searchName }
                 onChange={ ( e ) => setSearchName( e.target.value ) }
                 placeholder="Buscar por nombre"
          />
          <Button size="sm" onClick={ applyFilterForm }>
            Buscar
          </Button>
          <Button size="sm" variant="outline" onClick={ clearFilters }>
            Limpiar
          </Button>
        </div>
        <Button disabled={ createStatus === "pending" }
                onClick={ () => {
                  setSelectedItem( {} )
                  setCreating( true )
                } }>Nuevo pais</Button>
      </div>
        <DataTablePaginated
          columns={ columns }
          data={ items }
          total={ total }
          pageIndex={ pageIndex }
          pageSize={ pageSize }
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
      <CountryAdminDialog
        isOpen={creating}
        onOpenChange={setCreating}
        isLoading={createStatus === "pending"}
        title="Crear país"
        formData={selectedItem}
        onSave={handleNewCountry}
      />
      <CountryAdminDialog
        isOpen={updating}
        isLoading={updateStatus === "pending"}
        onOpenChange={setUpdating}
        title="Editar país"
        formData={selectedItem}
        onSave={handleUpdateCountry}
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
