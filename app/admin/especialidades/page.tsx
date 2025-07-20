"use client"
import * as React                from "react"
import { useCallback, useState } from "react"
import { ColumnDef }             from "@tanstack/react-table"

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
  SpecialityDTO
}                                      from "@/modules/speciality/application/speciality_dto"
import { Input }                       from "@/components/ui/input"
import { useMutation }                 from "@tanstack/react-query"
import { toast }                       from "sonner"
import {
  SpecialityAdminDialog
}                                      from "@/components/admin/speciality_admin_dialog"
import { Dialog, DialogContent }       from "@/components/ui/dialog"

interface SpecialityFilters {
  name?: string
}


function getColumns(
  onItemSelected: ( item: SpecialityDTO ) => void,
  onItemDeleted: ( id: string ) => void
): ColumnDef<SpecialityDTO>[] {
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
              <DropdownMenuItem onClick={ () => onItemSelected(
                speciality ) }>Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={ () => onItemDeleted(
                speciality.id ) }>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]
}

export default function SpecialityPage() {
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
        } = usePagedResource<SpecialityDTO, SpecialityFilters>( {
    endpoint       : "/api/speciality",
    defaultPageSize: 10
  } )

  const [selecteds, setSelecteds]   = useState<SpecialityDTO[]>( [] )
  const [searchName, setSearchName] = useState( filters?.name ?? "" )

  const applyFilterForm = () => {
    const newFilters: SpecialityFilters = {}
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
          `/api/speciality/?${ param.toString() }`,
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
      onError   : ( error, variables, context ) => {
        toast.error( "Error al eliminar" )
      },
      onSuccess : async ( data, variables, context ) => {
        await refetch()
        toast.success( "Especialidad eliminada correctamente" )
      }
    } )


  const {
          mutateAsync: updateMutateAsync,
          status     : updateStatus
        } = useMutation(
    {
      mutationFn: async ( values: any ) => {
        const response = await fetch( "/api/speciality", {
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
      onError   : ( error, variables, context ) => {
        toast.error( "Error al actualizar" )
      },
      onSuccess : async ( data, variables, context ) => {
        await refetch()
        toast.success( "Especialidad actualizada correctamente" )
      }
    } )


  const {
          mutateAsync: createMutateAsync,
          status     : createStatus
        } = useMutation(
    {
      mutationFn: async ( values: any ) => {
        const response = await fetch( "/api/speciality", {
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
      onError   : ( error, variables, context ) => {
        toast.error( "Error al crear" )
      },
      onSuccess : async ( data, variables, context ) => {
        await refetch()
        toast.success( "Especialidad creada correctamente" )
      }
    } )

  const handleSelectionChange = useCallback(
    ( rows: SpecialityDTO[] ) => {
      setSelecteds( rows )
    },
    []
  )

  const [creating, setCreating]         = useState( false )
  const [updating, setUpdating]         = useState( false )
  const [selectedItem, setSelectedItem] = useState<any>( {} )

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

  const handleUpdateSpeciality = async ( speciality: SpecialityDTO ) => {
    const result = await updateMutateAsync( speciality )
    if ( !result ) {
      toast.error( "Error al actualizar la especialidad" )
      return
    }
    setUpdating( false )
    setSelectedItem( {} )
  }
  const handleNewSpeciality    = async ( speciality: SpecialityDTO ) => {
    const result = await createMutateAsync( speciality )
    if ( !result ) {
      toast.error( "Error al crear la especialidad" )
      return
    }
    setCreating( false )
    setSelectedItem( {} )
  }

  const handleDeleteSpeciality = async ( id: string ) => {
    const result = await removeMutateAsync( id )
    if ( !result ) {
      toast.error( "Error al eliminar la especialidad" )
      return
    }
    setSelectedItem( {} )
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
                } }>Nueva
          especialidad</Button>
      </div>
      <DataTablePaginated
        columns={ getColumns( item => {
          setSelectedItem( item )
          setUpdating( true )
        }, handleDeleteSpeciality ) }
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
      <SpecialityAdminDialog
        isOpen={ creating }
        onOpenChange={ setCreating }
        isLoading={ createStatus === "pending" }
        title="Crear nueva especialidad"
        formData={ selectedItem }
        onSave={ handleNewSpeciality }/>

      <SpecialityAdminDialog
        isOpen={ updating }
        isLoading={ updateStatus === "pending" }
        onOpenChange={ setUpdating }
        title="Actualizar especialidad"
        formData={ selectedItem }
        onSave={ handleUpdateSpeciality }/>
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
