"use client"


import { Button }                         from "@/components/ui/button"
import { useAuthContext }                 from "@/app/context/auth_context"
import { FormProvider, useForm }          from "react-hook-form"
import { zodResolver }                    from "@hookform/resolvers/zod"
import InputText                          from "@/components/form/input_text"
import React, { useState, useTransition } from "react"
import {
  userLoginRequestSchema
}                                         from "@/modules/user/application/models/user_login_request"
import { Loader2Icon }                    from "lucide-react"
import {
  wrapTypeAsync
}                                         from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                                         from "@/modules/shared/domain/exceptions/base_exception"

export default function Ingresar() {
  const { login }                     = useAuthContext()
  const [submitting, startTransition] = useTransition()
  const methods                       = useForm( {
    resolver: zodResolver( userLoginRequestSchema )
  } )

  const [isError, setIsError] = useState( false )
  const { handleSubmit }      = methods


  const onSubmit = async ( values: any ) => {
    setIsError(false)
    startTransition( async () => {
      const result = await wrapTypeAsync( () => login( {
        email   : values.email,
        password: values.password
      } ) )
      if ( result instanceof BaseException ) {
        setIsError( true )
      }
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
          { isError ?
            <div className="text-red-500 text-sm">
              Credenciales incorrectas. Por favor, intente de nuevo.
            </div> : null
          }
          <Button type="button"
                  onClick={ handleSubmit( onSubmit ) }>
            { submitting ?
              <>
                <Loader2Icon className="animate-spin"/>
                Cargando...
              </>
              : "Ingresar" }
          </Button>
        </form>
      </FormProvider>
    </div>
  )
}