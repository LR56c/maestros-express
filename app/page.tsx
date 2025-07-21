"use client"
import React, { useState } from "react"
import {
  Textarea
}                          from "@/components/ui/textarea"
import {
  Loader2Icon,
  Search
}                          from "lucide-react"
import {
  DropzoneOptions
}                          from "react-dropzone"
import {
  Button
}                          from "@/components/ui/button"
import {
  QuickFilter
}                          from "@/components/quick_filter"
import {
  useMutation
}                          from "@tanstack/react-query"
import {
  toast
}                          from "sonner"
import FileUploadSingle    from "@/components/form/file_upload_single"
import {
  WorkerCard
}                          from "@/components/worker_card"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle
}                          from "@/components/ui/card"
import {
  MoreFilter
}                          from "@/components/more_filters"
import Link                from "next/link"
import {
  usePagedResource
}                          from "@/components/data_table/usePagedQuery"
import {
  WorkerProfileDTO
}                          from "@/modules/worker/application/worker_profile_dto"

interface WorkerFilters {
  specialities?: string
}

export default function Home() {

  const {
          items,
          setFilters,
          loadingInitial
        }            = usePagedResource<WorkerProfileDTO, WorkerFilters>( {
    endpoint       : "/api/worker",
    defaultPageSize: 10
  } )
  const clearFilters = () => {
    setFilters( undefined )
    reset()
  }


  const applyFilterForm = ( values: Record<string, any> ) => {
    const newFilters: WorkerFilters = {}
    if ( values.specialities ) newFilters.specialities = values.specialities
    setFilters( Object.keys( newFilters ).length ? newFilters : undefined )
    reset()
  }

  const { data, mutateAsync, status, reset } = useMutation( {
    mutationFn: async ( values: any ) => {
      const response = await fetch( "/api/o/request", {
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
      toast.error( "Error. Por favor, intenta de nuevo." )
    }
  } )
  const [base64File, setbase64File]          = useState<string | null>(
    null )
  const [text, setText]                      = useState<string | null>(
    null )

  const dropzone = {
    accept  : {
      "image/*": [".jpg", ".jpeg", ".png"]
    },
    multiple: true,
    maxFiles: 1,
    maxSize : 1 * 1024 * 1024
  } satisfies DropzoneOptions

  const handleSubmit = async () => {
    if ( !base64File && !text ) {
      return
    }
    if ( navigator.geolocation ) {
      navigator.geolocation.getCurrentPosition( async ( position ) => {
        const result = await mutateAsync( {
          image   : base64File,
          input   : text ? text : undefined,
          location: `(${ position.coords.latitude },${ position.coords.longitude })`,
          radius  : 100_000
        } )
        if ( !result ) {
          toast.error(
            "Error al buscar servicios. Por favor, intenta de nuevo." )
        }
      }, ( error ) => {
        toast( "Debe permitir el acceso a la ubicación para buscar servicios." )
      }, {
        enableHighAccuracy: true,
        timeout           : 5000,
        maximumAge        : 0
      } )
    }
    else {
      toast( "La geolocalización no está disponible en este navegador." )
    }
  }

  const handleFile = ( value: File[] | null ) => {
    if ( !value || value.length !== 1 ) {
      setbase64File( null )
      return
    }
    const file       = value[0]
    const reader     = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setbase64File( base64String )
    }
    reader.onerror   = ( error ) => {
      console.error( "Error reading file:", error )
      setbase64File( null )
    }
    reader.readAsDataURL( file )
  }

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full gap-2">
      <div className="w-full max-w-xl flex flex-col gap-2">
        <div className="w-full max-w-xl flex h-16 gap-2">
          <div className="w-full h-full relative">
            <Search
              className="absolute left-2.5 top-5 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
            <Textarea
              onClick={ e => e.stopPropagation() }
              placeholder="Describe tu problema"
              rows={ 2 }
              className="resize-none pl-10 h-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              onChange={ ( value ) =>
                setText( value.target.value ) }
            />
          </div>
          <FileUploadSingle
            fileClass="w-48"
            inputClass="h-16 w-full"
            placeholder="o sube una imagen aqui"
            onChange={ handleFile }
            dropzone={ dropzone }/>
        </div>
        <Button
          disabled={ status === "pending" || !base64File && !text }
          type="button" onClick={ handleSubmit } className="w-full">
          {
            status === "pending" ?
              <>
                <Loader2Icon className="animate-spin"/>
                Buscando...
              </>
              : "Buscar servicio"
          }
        </Button>
      </div>
      {
        data ?
          <>
            <Card className="w-full max-w-xl">
              <CardHeader>
                <CardTitle>Como solucionarlo</CardTitle>
                <CardDescription>{ data.info }</CardDescription>
                <CardAction className="flex flex-col gap-2">
                  <MoreFilter
                    onFilter={ ( values ) => applyFilterForm( values ) }/>
                  <Button variant="secondary" className="rounded-full"
                    onClick={ clearFilters }>
                    Limpiar filtros
                  </Button>
                </CardAction>
              </CardHeader>
            </Card>
            {
              data.workers.length === 0 ?
                <p className="text-center text-gray-500">No se encontraron
                  trabajadores
                  disponibles para tu problema.</p>
                :
                <>
                  <p className="text-center text-gray-500">Se
                    encontraron { data.workers.length } trabajadores
                    disponibles para tu problema.</p>
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {
                      data.workers.map( ( worker: any ) => (
                        <Link href={ `/trabajador/${ worker.user_id }` }>
                          <WorkerCard key={ worker.user_id } worker={ worker }/>
                        </Link>
                      ) )
                    }
                  </div>
                </>
            }
          </>
          :
          <>
            <QuickFilter
              onClear={ clearFilters }
              onFilter={
                ( values ) => applyFilterForm( values ) }/>
            {
              loadingInitial ?
                <div className="p-4">
                  <div className="h-8 w-full animate-pulse bg-muted/50 mb-2"/>
                  <div className="h-8 w-full animate-pulse bg-muted/50 mb-2"/>
                  <div className="h-8 w-full animate-pulse bg-muted/50"/>
                </div> :
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {
                    items.map( ( worker: any ) => (
                      <Link href={ `/trabajador/${ worker.user_id }` }>
                        <WorkerCard key={ worker.user_id } worker={ worker }/>
                      </Link>
                    ) )
                  }
                </div>
            }
          </> }
    </div>
  )
}
