"use client"
import { z }                             from "zod"
import { zodResolver }                   from "@hookform/resolvers/zod"
import { FormProvider, useForm }         from "react-hook-form"
import InputText                         from "@/components/form/input_text"
import { Button }                        from "@/components/ui/button"
import {
  workerRequestSchema
}                                        from "@/modules/worker/application/worker_request"
import { DateInput }                     from "@/components/form/date_input"
import NationalIdentityInput
                                         from "@/components/form/national_identity_input"
import InputTextArea
                                         from "@/components/form/input_text_area"
import SelectInput, { SelectInputValue } from "@/components/form/select_input"
import { useQuery }                      from "@tanstack/react-query"
import React, { useEffect, useState }    from "react"
import {
  CountryDTO
}                                        from "@/modules/country/application/country_dto"
import InputLocationDetector
                                         from "@/components/form/input_location_detector"
import {
  NationalIdentityFormatDTO
}                                        from "@/modules/national_identity_format/application/national_identity_format_dto"
import { useWorkerContext }              from "@/app/context/worker_context"
import { useAuthContext }                from "@/app/context/auth_context"

const workerFormSchema = workerRequestSchema.extend( {
  confirm   : z.string(),
  country_id: z.string()
} ).refine( ( data ) => data.user.password === data.confirm, {
  path   : ["confirm"],
  message: "Las contraseñas no coinciden"
} )

const countriesOption = {
  queryKey: ["countries"],
  queryFn : async () => {
    const response = await fetch( "/api/country", { method: "GET" } )
    if ( !response.ok ) {
      throw new Error( "Error fetching countries" )
    }
    return await response.json()
  }
}

export default function WorkerApplyForm() {

  const { isPending, data } = useQuery( countriesOption )
  const { login, user }        = useAuthContext()
  const { createWorker }    = useWorkerContext()

  const [inputCountries, setInputCountries] = useState<SelectInputValue[]>( [] )
  useEffect( () => {
    if ( !data ) return
    const countries: CountryDTO[] = data as CountryDTO[]
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
    const result = await createWorker( {
      user: data.user,
      national_identity_id: data.national_identity_id,
      national_identity_value: data.national_identity_value,
      birth_date: data.birth_date,
      description: data.description,
      location: data.location,
    } )
    if( !result ) {
      console.error( "Failed to create worker" )
      return
    }
    await login({
      email   : data.user.email,
      password: data.user.password
    })
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
      const format = formatData[0] as NationalIdentityFormatDTO
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
        <InputText name="user.email" label="Email" type="email"
                   placeholder="Ingrese su email"/>
        <InputText name="user.password" label="Contraseña" type="password"
                   placeholder="Ingrese su contraseña"/>
        <InputText name="confirm" label="Confirmar Contraseña" type="password"
                   placeholder="Confirme su contraseña"/>
        <InputText name="user.full_name" label="Nombre" type="text"
                   placeholder="Ingrese su nombre completo"/>
        <SelectInput
          placeholder="Seleccione su nacionalidad"
          loading={ isPending }
          onChange={ ( value ) => {
            const c = value as CountryDTO
            setSelectedCountry( c )
            setValue( "country_id", c.id )
          } }
          name="country_id" values={ inputCountries } label="Nacionalidad"/>
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
        <Button onClick={ handleSubmit( onSubmit ) }>Send</Button>
      </div>
    </FormProvider>
  </>
}