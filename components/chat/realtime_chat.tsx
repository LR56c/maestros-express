"use client"

import { cn }                                        from "@/lib/utils"
import {
  Button
}                                                    from "@/components/ui/button"
import {
  Input
}                                                    from "@/components/ui/input"
import { Send }                                      from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ChatMessage,
  useRealtimeChat
}                                                    from "@/app/hooks/use_realtime_chat"
import {
  useChatScroll
}                                                    from "@/app/hooks/use_chat_scroll"
import {
  UserResponse
}                                                    from "@/modules/user/application/models/user_response"
import {
  ChatMessageItem
}                                                    from "@/components/chat/chat_message"
import {
  UUID
}                                                    from "@/modules/shared/domain/value_objects/uuid"
import {
  useMutation
}                                                    from "@tanstack/react-query"
import { toast }                                     from "sonner"
import {
  MessageRequest
}                                                    from "@/modules/message/application/message_request"
import {
  QuotationDialog
}                                                    from "@/components/quotation_dialog"
import {
  ChatQuotationMessageItem
}                                                    from "@/components/chat/chat_quotation_message"

interface RealtimeChatProps {
  roomName: string
  ownerUser: UserResponse
  otherUser: UserResponse
  onMessage?: ( messages: ChatMessage[] ) => void
  messages?: ChatMessage[]
}

const EVENT_MESSAGE_TYPE  = "payment"
export const RealtimeChat = ( {
  roomName,
  ownerUser,
  onMessage,
  otherUser,
  messages: initialMessages = []
}: RealtimeChatProps ) => {
  const { containerRef, scrollToBottom } = useChatScroll()

  const { mutateAsync: paymentMutateAsync } = useMutation( {
    mutationFn: async ( values: any ) => {
      const response = await fetch( "/api/o/payment", {
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
      toast.error( "Error. Por favor, intenta de nuevo." )
    }
  } )


  const { mutateAsync } = useMutation( {
    mutationFn: async ( values: any ) => {
      const response = await fetch( "/api/message", {
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
      toast.error( "Error. Por favor, intenta de nuevo." )
    }
  } )

  const workerId = ownerUser.role === "WORKER"
    ? ownerUser.user_id
    : otherUser.user_id

  const {
          messages: realtimeMessages,
          sendMessage,
          sendPayment,
          isConnected
        }                                 = useRealtimeChat( {
    roomName,
    username: ownerUser.full_name,
    senderId: ownerUser.user_id
  } )
  const [newMessage, setNewMessage]       = useState( "" )
  const [typeMessage, setTypeMessage]     = useState( "TEXT" )
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>( [] )

  const allMessages = useMemo( () => {
    const mergedMessages = [
      ...initialMessages, ...realtimeMessages, ...localMessages
    ]
    const uniqueMessages = mergedMessages.filter(
      ( message, index, self ) => index ===
        self.findIndex( ( m ) => m.id === message.id )
    )
    const sortedMessages = uniqueMessages.sort(
      ( a, b ) => a.created_at.localeCompare( b.created_at ) )
    return sortedMessages
  }, [initialMessages, realtimeMessages, localMessages] )

  useEffect( () => {
    if ( onMessage ) {
      onMessage( allMessages )
    }
  }, [allMessages, onMessage] )

  useEffect( () => {
    scrollToBottom()
  }, [allMessages, scrollToBottom] )

  const handleSendMessage = useCallback(
    async (
      e?: React.FormEvent,
      contentOverride?: string,
      typeOverride?: string
    ) => {
      console.log( "handleSendMessage", e, contentOverride, typeOverride )
      if ( e ) e.preventDefault()
      const content = contentOverride ?? newMessage
      const type    = typeOverride ?? typeMessage
      if ( !content.trim() || !isConnected ) return

      const tempMessage: ChatMessage = {
        id        : UUID.create().value,
        content   : content,
        user_id   : ownerUser.user_id,
        status    : "SENDING",
        type      : type,
        created_at: new Date().toISOString()
      }
      setLocalMessages( ( msgs ) => [...msgs, tempMessage] )
      if ( !contentOverride ) setNewMessage( "" )

      const messageRequest: MessageRequest = {
        id        : tempMessage.id,
        chat_id   : roomName,
        content   : tempMessage.content,
        type      : tempMessage.type,
        user_id   : tempMessage.user_id,
        created_at: tempMessage.created_at
      }
      const result                         = await mutateAsync( messageRequest )
      if ( result ) {
        setLocalMessages( ( msgs ) =>
          msgs.map( ( m ) => m.id === tempMessage.id
            ? { ...result, status: "SENT" }
            : m )
        )
        await sendMessage( { ...result, status: "SENT" } )
      }
      else {
        setLocalMessages( ( msgs ) =>
          msgs.map(
            ( m ) => m.id === tempMessage.id ? { ...m, status: "ERROR" } : m )
        )
      }
    },
    [
      newMessage, isConnected, sendMessage, typeMessage, ownerUser.user_id,
      roomName
    ]
  )

  return (
    <div
      className="flex flex-col h-full w-full bg-background text-foreground antialiased">
      {/* Messages */ }
      <div ref={ containerRef }
           className="flex-1 h-full overflow-y-auto p-4 space-y-4">
        { allMessages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground">
            No hay mensajes en esta conversación.
          </div>
        ) : null }
        <div className="space-y-1">
          { allMessages.map( ( message, index ) => {
            const prevMessage = index > 0 ? allMessages[index - 1] : null
            const showHeader  = !prevMessage || prevMessage.user_id !==
              message.user_id

            return (
              <div
                key={ message.id }
                className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                { message.type === "QUOTATION" ?
                  <ChatQuotationMessageItem
                    onPayment={ async ( quotation ) => {
                      const result = await paymentMutateAsync( {
                        worker_id   : workerId,
                        chat_id     : roomName,
                        quotation_id: quotation.id,
                        message_id  : message.id,
                        total       : quotation.total,
                        value_format: quotation.value_format
                      } )
                      if( !result ) return
                      await sendPayment(roomName)
                    } }
                    user={ message.user_id === ownerUser.user_id
                      ? ownerUser
                      : otherUser }
                    message={ message }
                    isOwnMessage={ message.user_id === ownerUser.user_id }
                    showHeader={ showHeader }
                  /> :
                  <ChatMessageItem
                    user={ message.user_id === ownerUser.user_id
                      ? ownerUser
                      : otherUser }
                    message={ message }
                    isOwnMessage={ message.user_id === ownerUser.user_id }
                    showHeader={ showHeader }
                  />
                }
              </div>
            )
          } ) }
        </div>
      </div>

      <form onSubmit={ handleSendMessage }
            className="flex w-full gap-2 border-t border-border p-4 pb-24">
        <Input
          className={ cn(
            "rounded-full bg-background text-sm transition-all duration-300",
            isConnected && newMessage.trim()
              ? "w-[calc(100%-36px)]"
              : "w-full"
          ) }
          type="text"
          value={ newMessage }
          onChange={ ( e ) => setNewMessage( e.target.value ) }
          placeholder="Escribe un mensaje..."
          disabled={ !isConnected }
        />
        <Button
          className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
          type="submit"
          disabled={ !isConnected }
        >
          <Send className="size-4"/>
        </Button>
        { isConnected && ownerUser.role === "WORKER" ?
          <Button
            className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
            type="button"
            disabled={ !isConnected }
          >
            <QuotationDialog userId={ otherUser.user_id } chatId={ roomName }
                             workerId={ ownerUser.user_id }
                             onCreated={ ( content,
                               type ) => handleSendMessage(
                               undefined, content, type ) }/>
          </Button> : null
        }
      </form>
    </div>
  )
}
