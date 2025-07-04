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

// const workerFormSchema = z.object( {
//   content: z.string()
// } )

export default function WorkerApply() {
  const methods = useForm( {
    resolver: zodResolver( workerRequestSchema.extend( {
      confirm: z.string()
    } ).refine( ( data ) => data.user.password === data.confirm, {
      path   : ["confirm"],
      message: "Las contraseñas no coinciden"
    } ) )
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

  const m: SelectInputValue[] = [
    {
      value   : {
        id : "uno",
        mas: 1
      }, label: "Uno"
    },
    {
      value   : {
        id : "dos",
        mas: 2
      }, label: "Dos"
    }
  ]

  return <>
    <FormProvider { ...methods } >
      <div>
        <InputText name="user.email" label="Email" type="email"/>
        <InputText name="user.password" label="Contraseña" type="password"/>
        <InputText name="confirm" label="Confirmar Contraseña" type="password"/>
        <InputText name="user.full_name" label="Nombre" type="text"/>
        <SelectInput
          onChange={ ( value ) => setValue( "user.full_name", value.id ) }
          name="user.full_name" values={ m } label="Nacionalidad"/>
        <NationalIdentityInput name="national_identity.identifier"
                               label="Identification" type="rut"/>
        <DateInput name="birth_date" label="Fecha Nacimiento"/>
        <InputTextArea name="description" label="Descripcion"/>
        <Button onClick={ handleSubmit( onSubmit ) }>Send</Button>
      </div>
      <pre>        { JSON.stringify( formValues, null, 2 ) }</pre>
    </FormProvider>
  </>
}