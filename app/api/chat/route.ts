"use server"

import { NextRequest, NextResponse }       from "next/server"
import {
  parseData
}                                          from "@/modules/shared/application/parse_handlers"
import { isLeft }                          from "fp-ts/Either"
import {
  ChatMapper
}                                          from "@/modules/chat/application/chat_mapper"
import {
  chatRequestSchema
}                                          from "@/modules/chat/application/chat_request"
import {
  chatUpdateSchema
}                                          from "@/modules/chat/application/chat_update_dto"
import { addChat, chatByUser, updateChat } from "@/app/api/dependencies"

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( chatRequestSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }


  const result = await (
    await addChat()
  ).execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( ChatMapper.toDTO( result.right ),
    { status: 201 } )
}

export async function GET( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const id               = searchParams.get( "id" )

  const result = await (
    await chatByUser()
  ).execute( id ?? "" )

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

  const result = await (
    await updateChat()
  ).execute( data.right )
  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( ChatMapper.toDTO( result.right ),
    { status: 200 } )
}
