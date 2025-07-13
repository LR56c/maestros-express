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
import { DropzoneOptions }            from "react-dropzone"
import FileUploadInput                from "@/components/form/file_upload_input"
import ListInput                      from "@/components/form/list_input"
import {
  TaxDialog
}                                     from "@/components/form/tax_dialog"
import {
  StoryDialog,
  storyFormSchema
}                                     from "@/components/form/story_dialog"
import CalendarScheduleInput
                                      from "@/components/form/calendar_schedule/calendar_schedule_input"
import {
  parseData
}                                     from "@/modules/shared/application/parse_handlers"
import {
  CertificateType,
  CertificateTypeEnum
}                                     from "@/modules/certificate/domain/certificate_type"
import {
  wrapType
}                                     from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                                     from "@/modules/shared/domain/exceptions/base_exception"
import { isLeft }                     from "fp-ts/Either"
import {
  sectorsOption
}                                     from "@/utils/tanstack_catalog"
import {
  parseSectors
}                                     from "@/utils/multi_select_parser"
import {
  UUID
}                                     from "@/modules/shared/domain/value_objects/uuid"

const certificateFormSchema = z.instanceof( File ).refine(
  ( file ) => {
    const typePart = file.type.split( "/" )[0]
    const type     = wrapType(
      () => CertificateType.from( typePart.toUpperCase() ) )
    return !(
      type instanceof BaseException
    )
  },
  {
    message: `Solo se aceptan archivos de tipo: ${ Object.values(
      CertificateTypeEnum ).join( ", " ) }`
  }
)
export type CertificateForm = z.infer<typeof certificateFormSchema>


const workerExtraFormSchema = z.object( {
  specialities: z.array( specialitySchema )
                 .min( 1, "Debe seleccionar al menos una especialidad" ),
  taxes       : z.array( workerTaxSchema )
                 .min( 1, "Debe agregar al menos una tarifa" ),
  zones       : z.array( zoneSchema )
                 .min( 1, "Debe seleccionar al menos un sector" ),
  certificates: z.array( certificateFormSchema )
                 .min( 1, "Debe agregar al menos un certificado" ),
  stories     : z.array( storyFormSchema ),
  schedules   : z.array( workerScheduleSchema )
                 .min( 1, "Debe agregar al menos un horario" )
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

export default function WorkerExtraForm() {
  const { isPending: specialityPending, data: specialityData } = useQuery(
    specialitiesOption )
  const { isPending: sectorPending, data: sectorData }         = useQuery(
    sectorsOption )
  const { updateWorker }                                       = useWorkerContext()
  const { user, revalidate }                                               = useAuthContext()

  const methods = useForm( {
    resolver: zodResolver( workerExtraFormSchema )
  } )

  const {
          handleSubmit,
          setValue,
          watch,
          formState: { errors },
          reset
        } = methods


  useEffect( () => {
    console.log( "errors", errors )
  }, [errors] )

  const formValues = watch()

  const onSubmit = async ( data: any ) => {
    if ( !user ) return
    const result = await updateWorker( user, data )
    if ( !result ) {
      console.log( "Error updating worker data" )
    }
    reset()
    await revalidate()
  }

  const [sectorValues, setSectorValues] = useState<MultiSelectInputValue[]>(
    [] )

  const [specialityValues, setSpecialityValues] = useState<MultiSelectInputValue[]>(
    [] )

  const dropzone = {
    accept  : {
      "image/*": [".jpg", ".jpeg", ".png"],
      "pdf"    : [".pdf"]
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

  const parseFileCertificates = ( files: File[] | null ) => {
    if ( !files || files.length === 0 ) {
      setValue( "certificates", [] )
      return
    }
    let certificates: CertificateForm[] = []
    for ( const file of files ) {
      const parsedFileResult = parseData( certificateFormSchema, file )
      if ( isLeft( parsedFileResult ) ) {
        certificates = []
        break
      }
      certificates.push( parsedFileResult.right )
    }
    setValue( "certificates", certificates )
  }
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
                            searchPlaceholder="Buscar sector"
                            onChange={ ( values ) => setValue( "zones",
                              values.map( value => (
                                {
                                  id    : UUID.create().toString(),
                                  sector: value
                                }
                              ) ) ) }
                            name="zones"
                            placeholderLoader="Cargando..."
          />
          <FileUploadInput
            onChange={ parseFileCertificates }
            helperText="Certificado de Trabajo, Licencia de Conducir, documento que demuestre tu experiencia"
            placeholder="Suelta los archivos aquí o haz click para subir"
            name="certificates" label="Certificados" dropzone={ dropzone }/>
          <ListInput
            name="taxes"
            keyName="name"
            label="Tarifas"
            placeholder="No hay elementos añadidos aún. Haz clic en el botón de más para añadir un nuevo elemento"
            tooltip="Añade las tarifas que deseas cobrar por tus servicios"
            createTitle="Nueva tarifa"
            editTitle="Editar tarifa"
            customModal={ TaxDialog }
          />
          <ListInput
            name="stories"
            keyName="name"
            label="Trabajos"
            placeholder="No hay elementos añadidos aún. Haz clic en el botón de más para añadir un nuevo elemento"
            tooltip="Añade los trabajos que has realizado"
            createTitle="Nuevo trabajo"
            editTitle="Editar trabajo"
            customModal={ StoryDialog }
          />
          <CalendarScheduleInput
            name="schedules"
            label="Horarios"
            placeholder="Ajustar mi horario"
            tooltip="Indique sus horarios de trabajo"
            visibleDays={ 5 }
          />
          <Button onClick={ handleSubmit( onSubmit ) }>Finish</Button>
          <pre>{ JSON.stringify( formValues, null, 2 ) }</pre>
        </div>
      </FormProvider>
    </>
  )
}