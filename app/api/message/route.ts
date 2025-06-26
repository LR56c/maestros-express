import { NextRequest, NextResponse } from "next/server"
import prisma                        from "@/lib/prisma"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import {
  PrismaMessageData
}                                    from "@/modules/message/infrastructure/prisma_message_data"
import {
  AddMessage
} from "@/modules/message/application/add_message"
import {
  GetMessageByChat
} from "@/modules/message/application/get_message_by_chat"
import {
  UpdateMessage
} from "@/modules/message/application/update_message"
import {
  messageRequestSchema
}                                    from "@/modules/message/application/message_request"
import {
  MessageMapper
}                                    from "@/modules/message/application/message_mapper"
import {
  messageUpdateSchema
}                                    from "@/modules/message/application/message_update_dto"

const dao    = new PrismaMessageData( prisma )
const add    = new AddMessage( dao )
const update = new UpdateMessage( dao )
const get    = new GetMessageByChat( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( messageRequestSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await add.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( MessageMapper.toDTO( result.right ),
    { status: 201 } )
}

export async function GET( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const id               = searchParams.get( "id" )

  const result = await get.execute(id ?? '')

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( MessageMapper.toDTO ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( messageUpdateSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await update.execute( data.right)

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( MessageMapper.toDTO( result.right ),
    { status: 200 } )
}
