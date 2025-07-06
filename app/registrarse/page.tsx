"use client"
import { useAuthContext }        from "@/app/context/auth_context"
import { z }                     from "zod"
import {
  userRegisterRequestSchema
}                                from "@/modules/user/application/models/user_register_request"

import { FormProvider, useForm } from "react-hook-form"
import { zodResolver }           from "@hookform/resolvers/zod"
import InputText                 from "@/components/form/input_text"
import React                     from "react"
import { Button }                from "@/components/ui/button"

const registerFormSchema = userRegisterRequestSchema.extend( {
  confirm: z.string()
} ).refine( ( data ) => data.password === data.confirm, {
  path   : ["confirm"],
  message: "Las contraseñas no coinciden"
} )

export default function Registrarse() {
  const { user, register } = useAuthContext()

  const methods = useForm( {
    resolver: zodResolver( registerFormSchema )
  } )

  const { handleSubmit } = methods


  const onSubmit = async ( values: any ) => {
    await register( {
      email    : values.email,
      full_name: values.full_name,
      password : values.password,
    } )
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <FormProvider { ...methods } >
        <form className="w-full max-w-lg flex flex-col gap-4">
          <InputText name="email" label="Email" type="email"
                     placeholder="Ingrese su email"/>
          <InputText name="password" label="Contraseña" type="password"
                     placeholder="Ingrese su contraseña"/>
          <InputText name="confirm" label="Confirmar Contraseña" type="password"
                     placeholder="Confirme su contraseña"/>
          <InputText name="full_name" label="Nombre" type="text"
                     placeholder="Ingrese su nombre completo"/>
          <Button type="button"
                  onClick={ handleSubmit( onSubmit ) }>Registrarse</Button>
        </form>
      </FormProvider>
    </div>
  )
}