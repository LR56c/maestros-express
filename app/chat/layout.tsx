"use server"
import { ReactNode }          from "react"
import { chatByUser }         from "@/app/api/dependencies"
import { createClientServer } from "@/utils/supabase/server"
import { redirect }           from "next/navigation"
import { isLeft }             from "fp-ts/Either"
import { ChatMapper }         from "@/modules/chat/application/chat_mapper"
import { ChatLink }           from "@/components/chat_link"

export default async function ChatLayout( {
  children
}: {
  children: ReactNode
} )
{
  const sup                = await createClientServer()
  const { data: { user } } = await sup.auth.getUser()

  if ( !user ) {
    return redirect( "/" )
  }

  const isWorker = user?.user_metadata.role === "WORKER"

  const chatsResult = await (
    await chatByUser()
  ).execute( user.id )

  if ( isLeft( chatsResult ) ) {
    return redirect( "/404" )
  }

  const chat = chatsResult.right.map( ChatMapper.toDTO )

  return (
    <div className="flex h-full">
      <div className="flex flex-col p-3 gap-3 border-r border-border">
        <h1 className="text-2xl font-bold">
          { isWorker ? "Chats Clientes" : "Mis Chats" }
        </h1>
        <div className="w-56 overflow-y-auto">
          { chat.map( ( c ) => (
            <ChatLink
              key={ c.id }
              id={ c.id }>
              <h3
                className="line-clamp-1 break-words text-lg font-semibold">{ isWorker
                ? c.client.full_name
                : c.worker.full_name }</h3>
              <p
                className="line-clamp-1 break-words text-sm text-gray-500">{ c.subject }</p>
            </ChatLink>
          ) ) }
        </div>
      </div>
      <div className="flex-1">{ children }</div>
    </div>
  )
}