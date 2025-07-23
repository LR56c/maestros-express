"use client"

import { useCallback, useEffect, useState } from "react"
import {
  MessageResponse
}                                           from "@/modules/message/application/message_response"
import { createClient }                     from "@/utils/supabase/client"
import { useQueryClient }                   from "@tanstack/react-query"

interface RealtimeChatProps {
  roomName: string
  username: string
  senderId: string
}

export type ChatMessage = MessageResponse

const EVENT_MESSAGE_TYPE = "messages"
const EVENT_PAYMENT_TYPE = "payment"

export function useRealtimeChat( {
  roomName,
  username,
  // senderId
}: RealtimeChatProps )
{
  const supabase                      = createClient()
  const [messages, setMessages]       = useState<ChatMessage[]>( [] )
  const [channel, setChannel]         = useState<ReturnType<typeof supabase.channel> | null>(
    null )
  const queryClient  = useQueryClient()
  const [isConnected, setIsConnected] = useState( false )

  useEffect( () => {
    const newChannel = supabase.channel( roomName,{  config: {    broadcast: { self: true },  },})

    newChannel

      .on( "broadcast", { event: EVENT_MESSAGE_TYPE }, ( payload ) => {
        setMessages(
          ( current ) => [...current, payload.payload as ChatMessage] )
      } )
      .subscribe( async ( status ) => {
        if ( status === "SUBSCRIBED" ) {
          setIsConnected( true )
        }
      } )

    newChannel

      .on( "broadcast", { event: EVENT_PAYMENT_TYPE }, async ( payload ) => {
        await queryClient.invalidateQueries({ queryKey: ["chat_message", payload] })
        console.log("Payment event received:", payload)
      } )

    setChannel( newChannel )

    return () => {
      supabase.removeChannel( newChannel )
    }
  }, [roomName, username, supabase] )

  const sendMessage = useCallback(
    async ( message: ChatMessage ) => {
      if ( !channel || !isConnected ) return
      setMessages( ( current ) => {
        if ( current.some( ( m ) => m.id === message.id ) ) return current
        return [...current, message]
      } )
      await channel.send( {
        type   : "broadcast",
        event  : EVENT_MESSAGE_TYPE,
        payload: message
      } )
    },
    [channel, isConnected]
  )

  const sendPayment = useCallback(
    async ( chatId : string ) => {
      if ( !channel || !isConnected ) return
      await channel.send( {
        type   : "broadcast",
        event  : EVENT_PAYMENT_TYPE,
        payload: chatId
      } )
    },
    [channel, isConnected]
  )

  return { messages, sendMessage, isConnected, sendPayment }
}
