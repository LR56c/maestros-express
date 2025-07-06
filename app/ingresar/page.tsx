"use client"


import { Button }                from "@/components/ui/button"
import { useAuthContext }        from "@/app/context/auth_context"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver }           from "@hookform/resolvers/zod"
import InputText                 from "@/components/form/input_text"
import React                     from "react"
import {
  userLoginRequestSchema
} from "@/modules/user/application/models/user_login_request"

export default function Ingresar() {
  const { login } = useAuthContext()

  const methods = useForm( {
    resolver: zodResolver( userLoginRequestSchema )
  } )

  const { handleSubmit } = methods


  const onSubmit = async ( values: any ) => {
    await login( {
      email    : values.email,
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
          <Button type="button"
                  onClick={ handleSubmit( onSubmit ) }>Ingresar</Button>
        </form>
      </FormProvider>
    </div>
  )
}