import { cn }                             from "@/lib/utils"
import { Dialog, DialogContent }          from "@/components/ui/dialog"
import { ChatMessage }                    from "@/app/hooks/use_realtime_chat"
import {
  UserResponse
}                                         from "@/modules/user/application/models/user_response"
import { Button }                         from "@/components/ui/button"
import React, { useState, useTransition } from "react"
import { useQuery }                       from "@tanstack/react-query"
import ListViewDisplay
                                          from "@/components/form/list_view_display"
import {
  QuotationDetailViewDialog
}                                         from "@/components/quotation_detail_view_dialog"
import { toast }                          from "sonner"
import { useAuthContext }                 from "@/app/context/auth_context"
import { Loader2Icon }                    from "lucide-react"
import {
  QuotationResponse
}                                         from "@/modules/quotation/application/quotation_response"

interface ChatQuotationMessageItemProps {
  user: UserResponse
  message: ChatMessage
  isOwnMessage: boolean
  showHeader: boolean
  onPayment: ( quotation: QuotationResponse ) => Promise<void>
}


export const ChatQuotationMessageItem = ( {
  message,
  isOwnMessage,
  showHeader,
  onPayment
}: ChatQuotationMessageItemProps ) => {
  const [isOpen, setIsOpen]          = useState( false )
  const parseMessage                 = JSON.parse( message.content )
  const name                         = parseMessage.name
  const { user }                     = useAuthContext()
  const id                           = parseMessage.id
  const [isPayment, startTransition] = useTransition()
  const { isPending, data }          = useQuery( {
      enabled : isOpen,
      queryKey: ["stories_worker", id],
      queryFn : async () => {
        const params = new URLSearchParams()
        params.append( "id", id )
        const response = await fetch( `/api/quotation?${ params.toString() }`,
          { method: "GET" } )
        if ( !response.ok ) {
          throw new Error( "Error fetching quotation" )
        }
        const result = await response.json()
        return result[0]
      }
    }
  )

  const handlePayment = async () => {
    await startTransition( async () => {
      await onPayment( data )
      toast( "Funcionalidad simulada" )
      setIsOpen( false )
    } )
  }


  return (
    <>
      <div className={ `flex mt-2 ${ isOwnMessage
        ? "justify-end"
        : "justify-start" }` }>
        <div
          className={ cn( "max-w-[75%] w-fit flex flex-col gap-1", {
            "items-end": isOwnMessage
          } ) }
        >
          { showHeader && (
            <div
              className={ cn( "flex items-center gap-2 text-xs px-3", {
                "justify-end flex-row-reverse": isOwnMessage
              } ) }
            >
            <span className="text-foreground/50 text-xs">
              { new Date( message.created_at ).toLocaleTimeString( "en-US", {
                hour  : "2-digit",
                minute: "2-digit",
                hour12: true
              } ) }
            </span>
            </div>
          ) }
          <Button
            onClick={ () => setIsOpen( true ) }
            className={ cn(
              "bg-blue-400 hover:bg-blue-500 h-16 flex flex-col py-2 px-3 rounded-xl text-sm w-fit transition-colors duration-300",
              { "bg-red-400 hover:bg-red-500": message.status === "CANCELED" },
              { "bg-green-400 hover:bg-green-500": message.status === "ACCEPTED" }
            ) }
          >
            <p>Ver detalle presupuesto</p>
            <p className="line-clamp-1 break-words">{ name }</p>
          </Button>
          <div className={ cn( "text-xs text-muted-foreground",
            isOwnMessage ? "text-right" : "text-left"
          ) }>
            { message.status === "SENDING" && "Enviando..." }
            { message.status === "SENT" && "Enviado" }
            { message.status === "ERROR" && "Error al enviar" }
          </div>
        </div>
      </div>
      <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
        <DialogContent>
          <div className="flex flex-col gap-4">
            { isPending ? (
              <p>Cargando...</p>
            ) : (
              data && (
                <>
                  <div className="space-y-2 mb-2">
                    <p><strong>Presupuesto:</strong> { data.title }</p>
                  </div>
                  <ListViewDisplay
                    items={ data.details || [] }
                    keyName="name"
                    label="Detalle de la cotización"
                    viewTitle="Detalles"
                    customModal={ QuotationDetailViewDialog }
                  />
                  <div className="flex items-center justify-between mt-4">
                    <p>Total</p>
                    <p className="font-semibold">
                      { data.total } { data.value_format }
                    </p>
                  </div>
                  {
                    user && user.role !== "WORKER" ? <Button
                      disabled={ isPayment }
                      onClick={ handlePayment }>
                      {
                        isPayment ?
                          <>
                            <Loader2Icon className="animate-spin"/>
                            Procesando pago...
                          </>
                          : "Pagar"
                      }

                    </Button> : null
                  }
                </>
              )
            ) }
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
