'use client'

import { supabaseClient } from '@/lib/supabase'
import { useCallback, useEffect, useState } from 'react'
import { MessageResponse } from "@/modules/message/application/message_response"
import { UUID } from "@/modules/shared/domain/value_objects/uuid"

interface RealtimeChatProps {
  roomName: string
  username: string
  senderId: string
}

export type ChatMessage = MessageResponse

const EVENT_MESSAGE_TYPE = 'message'

export function useRealtimeChat({ roomName, username,senderId }: RealtimeChatProps) {
  const supabase = supabaseClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const newChannel = supabase.channel(roomName)

    newChannel
      .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
        setMessages((current) => [...current, payload.payload as ChatMessage])
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
        }
      })

    setChannel(newChannel)

    return () => {
      supabase.removeChannel(newChannel)
    }
  }, [roomName, username, supabase])

  const sendMessage = useCallback(
    async (content: string, type : string) => {
      if (!channel || !isConnected) return

      const message: ChatMessage = {
        id: UUID.create().value,
        content,
        user_id: senderId,
        status: "SENT",
        type,
        created_at: new Date().toISOString(),
      }

      setMessages((current) => [...current, message])

      await channel.send({
        type: 'broadcast',
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      })
    },
    [channel, isConnected, username]
  )

  return { messages, sendMessage, isConnected }
}
