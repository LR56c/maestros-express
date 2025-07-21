"use client"
import { Button }          from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
}                          from "@/components/ui/dialog"
import {
  FormProvider,
  useForm
}                          from "react-hook-form"
import {
  zodResolver
}                          from "@hookform/resolvers/zod"
import InputText           from "@/components/form/input_text"
import React, { useState } from "react"
import {
  useMutation
}                          from "@tanstack/react-query"
import { z }               from "zod"
import InputTextArea       from "@/components/form/input_text_area"
import { toast }           from "sonner"
import { Loader2Icon }     from "lucide-react"
import { useRouter }       from "next/navigation"


interface RequestChatDialogProps {
  workerId: string
  clientId: string
}

export function RequestChatDialog( {
  clientId,
  workerId
}: RequestChatDialogProps )
{

  const [isOpen, setIsOpen] = useState( false )

  const methods = useForm( {
    resolver: zodResolver( z.object( {
      subject: z.string().min( 1, "El asunto es requerido" ),
      message: z.string().min( 1, "El mensaje es requerido" )
    } ) )
  } )

  const router = useRouter()
  const { handleSubmit, reset } = methods

  const { mutateAsync, status } = useMutation( {
    mutationFn: async ( values: any ) => {
      const response = await fetch( "/api/o/chat", {
        method : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body   : JSON.stringify( values )
      } )
      if ( !response.ok ) {
        return undefined
      }
      return await response.json()
    },
    onError   : ( error, variables, context ) => {
      toast.error( "Error al crear chat" )
    }
  } )


  const onSubmit = async ( data: any ) => {
    const chatResult = await mutateAsync( {
      subject  : data.subject,
      message  : data.message,
      client_id: clientId,
      worker_id: workerId
    } )
    if ( !chatResult ) {
      return
    }
    setIsOpen( false )
    router.push( `/chat/${chatResult}` )
    reset()
  }

  return (
    <FormProvider { ...methods } >
      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogTrigger>
          <Button variant="outline" className="w-full">
            Contactar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md w-full">
          <DialogTitle>Indica tu problema</DialogTitle>
          <InputText name="subject" label="Asunto"
                     type="text"
                     placeholder="Ingrese el asunto del mensaje"
          />
          <InputTextArea name="message" label="Mensaje"
                         placeholder="Ingrese el mensaje"/>
          <Button type="button"
                  disabled={ status === "pending" }
                  onClick={ handleSubmit( onSubmit ) }>
            {
              status === "pending" ?
                <>
                  <Loader2Icon className="animate-spin"/>
                  Enviando...
                </>
                : "Enviar"
            }
          </Button>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}
