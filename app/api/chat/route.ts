"use server"

import { NextRequest, NextResponse } from "next/server"
import prisma                        from "@/lib/prisma"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import {
  PrismaChatData
}                                    from "@/modules/chat/infrastructure/prisma_chat_data"
import { AddChat }                   from "@/modules/chat/application/add_chat"
import {
  UpdateChat
}                                    from "@/modules/chat/application/update_chat"
import {
  GetChatByUser
}                                    from "@/modules/chat/application/get_chat_by_user"
import {
  ChatMapper
}                                    from "@/modules/chat/application/chat_mapper"
import {
  chatRequestSchema
}                                    from "@/modules/chat/application/chat_request"
import {
  chatUpdateSchema
}                                    from "@/modules/chat/application/chat_update_dto"

const dao    = new PrismaChatData( prisma )
const add    = new AddChat( dao )
const update = new UpdateChat( dao )
const search = new GetChatByUser( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( chatRequestSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }


  const result = await add.execute(data.right)

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( ChatMapper.toDTO( result.right ),
    { status: 201 } )
}

export async function GET( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const id               = searchParams.get( "id" )

  const result = await search.execute( id ?? '' )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( ChatMapper.toDTO ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( chatUpdateSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await update.execute( data.right )
  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( ChatMapper.toDTO( result.right ),
    { status: 200 } )
}
