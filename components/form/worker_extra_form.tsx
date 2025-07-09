"use client"
import { z }                          from "zod"
import {
  SpecialityDTO,
  specialitySchema
}                                     from "@/modules/speciality/application/speciality_dto"
import {
  workerTaxSchema
}                                     from "@/modules/worker_tax/application/worker_tax_dto"
import {
  zoneSchema
}                                     from "@/modules/zone/application/zone_dto"
import {
  certificateSchema
}                                     from "@/modules/certificate/application/certificate_dto"
import {
  storySchema
}                                     from "@/modules/story/application/story_dto"
import {
  workerScheduleSchema
}                                     from "@/modules/worker_schedule/application/worker_schedule_dto"
import { useQuery }                   from "@tanstack/react-query"
import {
  useWorkerContext
}                                     from "@/app/context/worker_context"
import {
  useAuthContext
}                                     from "@/app/context/auth_context"
import { FormProvider, useForm }      from "react-hook-form"
import {
  zodResolver
}                                     from "@hookform/resolvers/zod"
import { Button }                     from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import MultiSelectInput, {
  MultiSelectInputValue
}                                     from "@/components/form/multi_select_input"
import {
  SectorDTO
}                                     from "@/modules/sector/application/sector_dto"
import { DropzoneOptions }            from "react-dropzone"
import FileUploadInput                from "@/components/form/file_upload_input"
import ListInput                      from "@/components/form/list_input"
import {
  TaxDialog
}                                     from "@/components/form/tax_dialog"
import { StoryDialog }                from "@/components/form/story_dialog"
import CalendarScheduleInput
                                      from "@/components/form/calendar_schedule/calendar_schedule_input"
import {
  DateTimePicker
}                                     from "@/components/form/calendar_schedule/date_time_picker"


const workerExtraFormSchema = z.object( {
  specialities: z.array( specialitySchema ),
  taxes       : z.array( workerTaxSchema ),
  zones       : z.array( zoneSchema ),
  certificates: z.array( certificateSchema ),
  stories     : z.array( storySchema ),
  schedules   : z.array( workerScheduleSchema )
} )

const specialitiesOption = {
  queryKey: ["specialities"],
  queryFn : async () => {
    const response = await fetch( "/api/speciality", { method: "GET" } )
    if ( !response.ok ) {
      throw new Error( "Error fetching countries" )
    }
    return await response.json() as SpecialityDTO[]
  }
}

const parseSpecialities = ( data: SpecialityDTO[] ): MultiSelectInputValue[] => data.map(
  ( speciality ) => (
    {
      label: speciality.name,
      value: speciality
    }
  ) )


const parseSectors = ( data: SectorDTO[] ): MultiSelectInputValue[] =>
  data.map( ( sector ) => (
    {
      label: sector.name,
      group: sector.region.name,
      value: sector
    }
  ) )


const sectorsOption = {
  queryKey: ["sectors"],
  queryFn : async () => {
    const response = await fetch( "/api/sector", { method: "GET" } )
    if ( !response.ok ) {
      throw new Error( "Error fetching countries" )
    }
    return await response.json() as SectorDTO[]
  }
}

export default function WorkerExtraForm() {
  const { isPending: specialityPending, data: specialityData } = useQuery(
    specialitiesOption )
  const { isPending: sectorPending, data: sectorData }         = useQuery(
    sectorsOption )
  const { updateWorker }                                       = useWorkerContext()
  const { user }                                               = useAuthContext()

  const methods = useForm( {
    resolver     : zodResolver( workerExtraFormSchema ),
  } )

  const { handleSubmit, setValue, watch, control } = methods

  const formValues = watch()

  const onSubmit = async ( data: any ) => {
    console.log( "Form submitted with data:", data )
  }

  const [sectorValues, setSectorValues] = useState<MultiSelectInputValue[]>(
    [] )

  const [specialityValues, setSpecialityValues] = useState<MultiSelectInputValue[]>(
    [] )

  const dropzone = {
    accept  : {
      "image/*": [".jpg", ".jpeg", ".png"]
    },
    multiple: true,
    maxFiles: 4,
    maxSize : 1 * 1024 * 1024
  } satisfies DropzoneOptions

  useEffect( () => {
    setSectorValues( parseSectors( sectorData ?? [] ) )
  }, [sectorData] )

  useEffect( () => {
    setSpecialityValues( parseSpecialities( specialityData ?? [] ) )
  }, [specialityData] )

  const [openAddTax, setOpenAddTax]       = useState( false )
  const [openUpdateTax, setOpenUpdateTax] = useState( false )
  return (
    <>
      <FormProvider { ...methods } >
        <div className="w-full max-w-lg flex flex-col gap-4">
          <MultiSelectInput values={ specialityValues }
                            loading={ specialityPending }
                            label="Especialidades"
                            helperText="Selecciona las especialidades que deseas ofrecer"
                            placeholder="Seleccione Especialidades"
                            searchPlaceholder="Buscar Especialidad"
                            name="specialities"
                            placeholderLoader="Cargando..."
          />
          <MultiSelectInput values={ sectorValues }
                            loading={ sectorPending }
                            helperText="Selecciona los sectores en los que deseas trabajar"
                            label="Sector"
                            placeholder="Seleccione Sectores"
                            searchPlaceholder="Buscar sectore"
                            name="zones"
                            placeholderLoader="Cargando..."
          />
          <FileUploadInput
            helperText="Certificado de Trabajo, Licencia de Conducir, documento que demuestre tu experiencia"
            placeholder="Suelta los archivos aquí o haz click para subir"
            name="" label="Certificados" dropzone={ dropzone }/>
          <ListInput
            name="taxes"
            keyName="name"
            label="Tarifas"
            placeholder="No hay elementos añadidos aún. Haz clic en el botón de más para añadir un nuevo elemento"
            tooltip="Añade las tarifas que deseas cobrar por tus servicios"
            createTitle="Nueva tarifa"
            editTitle="Editar tarifa"
            customModal={TaxDialog}
          />
          <ListInput
            name="stories"
            keyName="name"
            label="Trabajos"
            placeholder="No hay elementos añadidos aún. Haz clic en el botón de más para añadir un nuevo elemento"
            tooltip="Añade los trabajos que has realizado"
            createTitle="Nuevo trabajo"
            editTitle="Editar trabajo"
            customModal={StoryDialog}
          />
          <CalendarScheduleInput
            name="schedules"
            label="Gestionar mi horario"
            placeholder="Gestionar mi horario"
            tooltip="Configura tus horarios de trabajo"
            visibleDays={3}
          />
          <Button onClick={ handleSubmit( onSubmit ) }>Finish</Button>
          <pre>{ JSON.stringify( formValues, null, 2 ) }</pre>
        </div>
      </FormProvider>
    </>
  )
}