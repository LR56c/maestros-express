import { NextRequest, NextResponse } from "next/server"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { z }                         from "zod"
import { isLeft }                    from "fp-ts/Either"
import { addChat, addMessage }       from "@/app/api/dependencies"
import {
  ChatRequest
}                                    from "@/modules/chat/application/chat_request"
import {
  UUID
}                                    from "@/modules/shared/domain/value_objects/uuid"
import {
  MessageRequest
}                                    from "@/modules/message/application/message_request"

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( z.object( {
    worker_id: z.string(),
    client_id: z.string(),
    subject  : z.string(),
    message  : z.string()
  } ), body )

  console.log("Chat Request Data:", data)
  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }
  const { worker_id, client_id, subject, message } = data.right
  const chatRequest: ChatRequest                   = {
    id       : UUID.create().toString(),
    worker_id: worker_id,
    client_id: client_id,
    subject  : subject
  }

  const chatResult = await (
    await addChat()
  ).execute( chatRequest )
  console.log( "Chat Result:", chatResult )
  if ( isLeft( chatResult ) ) {
    return NextResponse.json( { status: 500 } )
  }

  const chatId = chatResult.right.id.toString()

  const messageRequest: MessageRequest = {
    id        : UUID.create().toString(),
    chat_id   : chatId,
    content   : message,
    type      : "TEXT",
    user_id   : client_id,
    created_at: new Date().toISOString()
  }

  const messageResult = await (
    await addMessage()
  ).execute( messageRequest )

  console.log( "Message Result:", messageResult )
  if ( isLeft( messageResult ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( chatId, { status: 200 } )
}
