"use client"
import { z }                                         from "zod"
import {
  zodResolver
}                                                    from "@hookform/resolvers/zod"
import { FormProvider, useForm }                     from "react-hook-form"
import InputText
                                                     from "@/components/form/input_text"
import {
  Button
}                                                    from "@/components/ui/button"
import {
  workerRequestSchema
}                                                    from "@/modules/worker/application/worker_request"
import {
  DateInput
}                                                    from "@/components/form/date_input"
import NationalIdentityInput
                                                     from "@/components/form/national_identity_input"
import InputTextArea
                                                     from "@/components/form/input_text_area"
import SelectInput, {
  SelectInputValue
}                                                    from "@/components/form/select_input"
import {
  useQuery
}                                                    from "@tanstack/react-query"
import React, { useEffect, useState, useTransition } from "react"
import {
  CountryDTO
}                                                    from "@/modules/country/application/country_dto"
import InputLocationDetector
                                                     from "@/components/form/input_location_detector"
import {
  NationalIdentityFormatDTO
}                                                    from "@/modules/national_identity_format/application/national_identity_format_dto"
import {
  useWorkerContext
}                                                    from "@/app/context/worker_context"
import {
  useAuthContext
}                                                    from "@/app/context/auth_context"
import { useRouter }                                 from "next/navigation"
import { Loader2Icon }                               from "lucide-react"
import {
  countriesOption
}                                                    from "@/utils/tanstack_catalog"
import ProfilePhotoHover
                                                     from "@/components/profile_photo_hover"

const workerFormSchema = workerRequestSchema.extend( {
  confirm: z.string(),
  country: z.string()
} ).refine( ( data ) => data.user.password === data.confirm, {
  path   : ["confirm"],
  message: "Las contraseñas no coinciden"
} )

export default function WorkerApplyForm() {

  const { isPending, data } = useQuery( countriesOption )
  const { login, user }     = useAuthContext()
  const { createWorker }    = useWorkerContext()

  const [submitting, startTransition] = useTransition()
  const router                        = useRouter()

  const [inputCountries, setInputCountries] = useState<SelectInputValue[]>( [] )
  useEffect( () => {
    if ( !data ) return
    const countries: CountryDTO[] = data.items as CountryDTO[]
    setInputCountries( countries.map( c => (
      {
        label: c.name,
        value: c
      }
    ) ) )
  }, [data] )

  const methods = useForm( {
    resolver: zodResolver( workerFormSchema )
  } )

  const { handleSubmit, setValue } = methods

  const onSubmit = async ( data: any ) => {
    startTransition( async () => {
      const result = await createWorker( {
        user                   : data.user,
        avatar                 : data.avatar,
        national_identity_id   : data.national_identity_id,
        national_identity_value: data.national_identity_value,
        birth_date             : data.birth_date,
        description            : data.description,
        location               : data.location
      } )
      if ( !result ) {
        console.error( "Failed to create worker" )
        return
      }
      await login( {
        email   : data.user.email,
        password: data.user.password
      } )
      await router.replace( "/trabajador/aplicar" )
    } )
  }

  const [selectedCountry, setSelectedCountry] = useState<CountryDTO | null>(
    null )
  const [identityFormat, setIdentityFormat]   = useState<NationalIdentityFormatDTO | null>(
    null )

  const { data: formatData, isFetching: isFormatLoading } = useQuery( {
    queryKey: ["national_identity_format", selectedCountry?.id],
    queryFn : async () => {
      if ( !selectedCountry ) return null
      const response = await fetch(
        `/api/national_identity_format?country_id=${ selectedCountry.id }` )
      if ( !response.ok ) throw new Error( "Error fetching format" )
      return await response.json()
    },
    enabled : Boolean( selectedCountry )
  } )

  useEffect( () => {
    if ( formatData ) {
      const format = formatData.items[0] as NationalIdentityFormatDTO
      setIdentityFormat( format )
      setValue( "national_identity_id", format.id )
    }
    else {
      setIdentityFormat( null )
    }
  }, [formatData] )

  return <>
    <FormProvider { ...methods } >
      <div className="w-full max-w-lg flex flex-col gap-4">
        <div className="flex justify-center">
        <ProfilePhotoHover onChange={(file, imageString) => setValue('avatar', imageString)}/>
        </div>
        <InputText name="user.email" label="Email" type="email"
                   placeholder="Ingrese su email"/>
        <InputText name="user.password" label="Contraseña" type="password"
                   placeholder="Ingrese su contraseña"/>
        <InputText name="confirm" label="Confirmar Contraseña" type="password"
                   placeholder="Confirme su contraseña"/>
        <InputText name="user.full_name" label="Nombre" type="text"
                   placeholder="Ingrese su nombre completo"/>
        <SelectInput
          placeholder="Seleccione su pais de origen"
          loading={ isPending }
          onChange={ ( value ) => {
            const c = value as CountryDTO
            setSelectedCountry( c )
            setValue( "country", c.name )
          } }
          name="country" values={ inputCountries } label="Pais origen"/>
        <NationalIdentityInput name="national_identity_value"
                               label="Identificador" format={ identityFormat }
                               disabled={ !selectedCountry || isFormatLoading ||
                                 !identityFormat }
                               placeholder="Ingrese su identificador"
                               loaderPlaceholder="Ingrese nacionalidad para cargar formato"
                               loading={ isFormatLoading }/>
        <DateInput name="birth_date" label="Fecha Nacimiento"
                   placeholder="Ingrese su fecha de nacimiento"/>
        <InputTextArea name="description" label="Descripcion"
                       placeholder="Ingrese una breve descripcion"/>
        <InputLocationDetector name="location" label="Ubicacion"/>
        <Button disabled={ submitting } onClick={ handleSubmit( onSubmit ) }>
          { submitting ?
            <>
              <Loader2Icon className="animate-spin"/>
              Cargando...
            </>
            : "Continuar" }
        </Button>
      </div>
    </FormProvider>
  </>
}