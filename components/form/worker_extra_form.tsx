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
  CertificateDTO, certificateSchema
} from "@/modules/certificate/application/certificate_dto"
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
import {
  Button
}                                     from "@/components/ui/button"
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
import {
  StoryDialog, storyFormSchema
} from "@/components/form/story_dialog"
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

const certificateFormSchema = z.instanceof( File ).refine(
  ( file ) => {
    const typePart = file.type.split( "/" )[ 0 ]
    const type = wrapType( () => CertificateType.from( typePart.toUpperCase() ) )
    return !(
      type instanceof BaseException
    )
  },
  {
    message: `Solo se aceptan archivos de tipo: ${ Object.values(
      CertificateTypeEnum ).join(', ') }`
  }
)
export type CertificateForm = z.infer<typeof certificateFormSchema>


const workerExtraFormSchema = z.object( {
  specialities: z.array( specialitySchema ).min(1, "Debe seleccionar al menos una especialidad" ),
  taxes       : z.array( workerTaxSchema ).min(1, "Debe agregar al menos una tarifa" ),
  zones       : z.array( zoneSchema ).min(1, "Debe seleccionar al menos un sector" ),
  certificates: z.array( certificateFormSchema ).min(1, "Debe agregar al menos un certificado" ),
  stories     : z.array( storyFormSchema ),
  schedules   : z.array( workerScheduleSchema ).min(1, "Debe agregar al menos un horario" ),
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
    resolver: zodResolver( workerExtraFormSchema )
  } )

  const { handleSubmit, setValue, watch, formState:{errors}, reset } = methods


  const formValues = watch()

  const onSubmit = async ( data: any ) => {
    console.log( "Form submitted with data:", data )
    const result = await updateWorker(data)
    if(!result){
      console.log("Error updating worker data")
    }
    reset()
  }

  const [sectorValues, setSectorValues] = useState<MultiSelectInputValue[]>(
    [] )

  const [specialityValues, setSpecialityValues] = useState<MultiSelectInputValue[]>(
    [] )

  const dropzone = {
    accept  : {
      "image/*": [".jpg", ".jpeg", ".png"],
      "pdf"   : [".pdf"],
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
    if( !files || files.length === 0 ) {
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
                            searchPlaceholder="Buscar sectore"
                            name="zones"
                            placeholderLoader="Cargando..."
          />
          <FileUploadInput
            onChange={ parseFileCertificates }
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