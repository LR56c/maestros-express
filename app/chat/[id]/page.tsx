"use client"
import { useParams }       from "next/navigation"
import { useAuthContext }  from "@/app/context/auth_context"
import { useQuery }        from "@tanstack/react-query"
import { RealtimeChat }    from "@/components/chat/realtime_chat"
import { ChatResponse }    from "@/modules/chat/application/chat_response"
import { MessageResponse } from "@/modules/message/application/message_response"

interface MessagePageProps {
}

const chatMessageOptions = ( id: string ) => (
  {
    queryKey: ["chat_message", id],
    queryFn : async () => {
      const params = new URLSearchParams()
      params.append( "id", id )
      const [response1, response2] = await Promise.all( [
        fetch( `/api/chat?${ params.toString() }`, { method: "GET" } ),
        fetch( `/api/message?${ params.toString() }`, { method: "GET" } )
      ] )
      if ( !response1.ok || !response2.ok ) {
        throw new Error( "Error fetching chat or message" )
      }
      return {
        chat    : await response1.json(),
        messages: await response2.json()
      }
    }
  }
)


export default function MessagePage( {}: MessagePageProps )
{
  const { id }              = useParams()
  const { user }            = useAuthContext()
  const { isPending, data } = useQuery( chatMessageOptions( id as string ) )

  if ( isPending || !data ) {
    return <div
      className="flex-1 flex items-center justify-center text-muted-foreground">
      Cargando…
    </div>
  }

  const chat     = data.chat as ChatResponse
  const messages = data.messages as MessageResponse[]

  const otherUser = user?.user_id === chat.worker.user_id
    ? chat.client
    : chat.worker

  return (
    <RealtimeChat
      roomName={ id! }
      ownerUser={ user! }
      otherUser={ otherUser }
      messages={ messages }/>
  )
}