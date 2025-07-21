"use client"
import { Button }                      from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
}                                      from "@/components/ui/dialog"
import {
  FormProvider,
  useForm
}                                      from "react-hook-form"
import {
  zodResolver
}                                      from "@hookform/resolvers/zod"
import InputText                      from "@/components/form/input_text"
import React, { useEffect, useState } from "react"
import {
  useMutation
}                                     from "@tanstack/react-query"
import { toast }                       from "sonner"
import { Loader2Icon, MoreHorizontal } from "lucide-react"
import {
  quotationRequestSchema
}                                      from "@/modules/quotation/application/quotation_request"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"
import ListInput                       from "@/components/form/list_input"
import {
  QuotationDetailDialog
}                                      from "@/components/quotation_detail_dialog"
import { z }                           from "zod"


interface QuotationDialogProps {
  userId: string
  chatId: string
  workerId: string
  onCreated: ( content: string, type: string ) => void
}

export function QuotationDialog( {
  onCreated,
  workerId,
  chatId,
  userId
}: QuotationDialogProps )
{

  const [isOpen, setIsOpen] = useState( false )

  const methods = useForm( {
    resolver     : zodResolver( quotationRequestSchema.extend({
      same_format : z.boolean().refine( ( value ) => value, {
        message: "Todos los elementos deben tener el mismo formato de moneda"
      } ),
    }) ),
    defaultValues: {
      id       : UUID.create().toString(),
      user_id  : userId,
      chat_id  : chatId,
      worker_id: workerId,
      same_format: true,
    }
  } )

  const { handleSubmit, reset, watch, setValue, formState: {errors} } = methods
  const sameFormatError = errors.same_format
  const quotationDetails = watch( "details" )

  useEffect( () => {
    if( !quotationDetails || quotationDetails.length === 0 ) {
      return
    }
    const valueFormat = quotationDetails[0]?.value_format
    const allSameFormat = quotationDetails.every( ( item: any ) => item.value_format === valueFormat )
    setValue( "same_format", allSameFormat)
  }, [quotationDetails] )

  const { mutateAsync, status } = useMutation( {
    mutationFn: async ( values: any ) => {
      const response = await fetch( "/api/quotation", {
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
      toast.error( "Error al crear cotizacion" )
    }
  } )


  const onSubmit = async ( data: any ) => {
    console.log( "Quotation Data:", data )
    const quotationResult = await mutateAsync( data )
    if ( !quotationResult ) {
      return
    }

    const json = JSON.stringify({
      id: quotationResult.id,
      name: data.title,
    })
    onCreated( json, "QUOTATION" )
    setIsOpen( false )
    reset()
  }

  return (
    <FormProvider { ...methods } >
      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogTrigger>
          <MoreHorizontal/>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md w-full">
          <DialogTitle>Indica tu problema</DialogTitle>
          <InputText name="title" label="Asunto"
                     type="text"
                     placeholder="Ingrese el asunto del mensaje"/>
          <ListInput
            name="details"
            keyName="name"
            label="Detalle de la cotización"
            placeholder="No hay elementos añadidos aún. Haz clic en el botón de más para añadir un nuevo elemento"
            tooltip="Añade detalles de la cotización. Puedes añadir varios elementos."
            createTitle="Nueva cotización"
            editTitle="Editar cotización"
            customModal={ QuotationDetailDialog }
          />
          { quotationDetails && quotationDetails.length > 0 ?
            <div className="flex items-center justify-between">
              <p>Total</p>
              <p className="font-semibold">
                { quotationDetails[0]?.value_format }&nbsp;
                { quotationDetails.reduce( ( acc, item ) => (
                  acc + (
                    item.value || 0
                  )
                ), 0 ) }
              </p>
            </div>
            : null
          }
          { sameFormatError ?
            <p className="text-red-500 text-sm">
              { sameFormatError.message }
            </p>
            : null
          }
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
