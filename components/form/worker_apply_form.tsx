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
import { useEffect, useState }           from "react"
import {
  CountryDTO
}                                        from "@/modules/country/application/country_dto"
import InputLocationDetector
                                         from "@/components/form/input_location_detector"

const workerFormSchema = workerRequestSchema.extend( {
  confirm: z.string()
} ).refine( ( data ) => data.user.password === data.confirm, {
  path   : ["confirm"],
  message: "Las contraseñas no coinciden"
} )
export default function WorkerApplyForm() {

  const { isPending, data } = useQuery( {
    queryKey: ["countries"],
    queryFn : async () => {
      const response = await fetch( "/api/country", { method: "GET" } )
      return await response.json()
    }
  } )

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

  const {
          handleSubmit,
          setValue,
          control,
          formState: { errors },
          watch
        } = methods


  const formValues = watch()

  const onSubmit = async ( data ) => {
    console.log( "Form submitted with data:", data )
  }

  return <>
    <FormProvider { ...methods } >
      <div>
        <InputText name="user.email" label="Email" type="email"/>
        <InputText name="user.password" label="Contraseña" type="password"/>
        <InputText name="confirm" label="Confirmar Contraseña" type="password"/>
        <InputText name="user.full_name" label="Nombre" type="text"/>
        <SelectInput
          loading={ isPending }
          onChange={ ( value ) => setValue( "user.full_name", value.name ) }
          name="user.full_name" values={ inputCountries } label="Nacionalidad"/>
        <NationalIdentityInput name="national_identity.identifier"
                               label="Identification" type="rut"/>
        <DateInput name="birth_date" label="Fecha Nacimiento"/>
        <InputTextArea name="description" label="Descripcion"/>
        <InputLocationDetector name="location" label="Ubicacion"/>
        <Button onClick={ handleSubmit( onSubmit ) }>Send</Button>
      </div>
      <pre>        { JSON.stringify( formValues, null, 2 ) }</pre>
    </FormProvider>
  </>
}