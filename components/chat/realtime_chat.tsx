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

interface RealtimeChatProps {
  roomName: string
  ownerUser: UserResponse
  otherUser: UserResponse
  onMessage?: ( messages: ChatMessage[] ) => void
  messages?: ChatMessage[]
}
export const RealtimeChat = ( {
  roomName,
  ownerUser,
  onMessage,
  otherUser,
  messages: initialMessages = []
}: RealtimeChatProps ) => {
  const { containerRef, scrollToBottom } = useChatScroll()

  const {
          messages: realtimeMessages,
          sendMessage,
          isConnected
        }                             = useRealtimeChat( {
    roomName,
    username: ownerUser.full_name,
    senderId: ownerUser.user_id
  } )
  const [newMessage, setNewMessage]   = useState( "" )
  const [typeMessage, setTypeMessage] = useState( "TEXT" )

  const allMessages = useMemo( () => {
    const mergedMessages = [...initialMessages, ...realtimeMessages]
    const uniqueMessages = mergedMessages.filter(
      ( message, index, self ) => index ===
        self.findIndex( ( m ) => m.id === message.id )
    )
    const sortedMessages = uniqueMessages.sort(
      ( a, b ) => a.created_at.localeCompare( b.created_at ) )
    return sortedMessages
  }, [initialMessages, realtimeMessages] )

  useEffect( () => {
    if ( onMessage ) {
      onMessage( allMessages )
    }
  }, [allMessages, onMessage] )

  useEffect( () => {
    scrollToBottom()
  }, [allMessages, scrollToBottom] )

  const handleSendMessage = useCallback(
    ( e: React.FormEvent ) => {
      e.preventDefault()
      if ( !newMessage.trim() || !isConnected ) return

      sendMessage( newMessage, typeMessage )
      setNewMessage( "" )
    },
    [newMessage, isConnected, sendMessage]
  )

  return (
    <div
      className="flex flex-col h-full w-full bg-background text-foreground antialiased">
      {/* Messages */ }
      <div ref={ containerRef }
           className="flex-1 overflow-y-auto p-4 space-y-4">
        { allMessages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground">
            No messages yet. Start the conversation!
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
                <ChatMessageItem
                  user={ message.user_id === ownerUser.user_id
                    ? ownerUser
                    : otherUser }
                  message={ message }
                  isOwnMessage={ message.user_id === ownerUser.user_id }
                  showHeader={ showHeader }
                />
              </div>
            )
          } ) }
        </div>
      </div>

      <form onSubmit={ handleSendMessage }
            className="flex w-full gap-2 border-t border-border p-4">
        <Input
          className={ cn(
            "rounded-full bg-background text-sm transition-all duration-300",
            isConnected && newMessage.trim() ? "w-[calc(100%-36px)]" : "w-full"
          ) }
          type="text"
          value={ newMessage }
          onChange={ ( e ) => setNewMessage( e.target.value ) }
          placeholder="Type a message..."
          disabled={ !isConnected }
        />
        { isConnected && newMessage.trim() && (
          <Button
            className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
            type="submit"
            disabled={ !isConnected }
          >
            <Send className="size-4"/>
          </Button>
        ) }
      </form>
    </div>
  )
}
