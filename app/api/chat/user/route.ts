"use server"

import { NextRequest, NextResponse } from "next/server"
import { isLeft }                    from "fp-ts/Either"
import {
  ChatMapper
}                                    from "@/modules/chat/application/chat_mapper"
import { chatByUser }                from "@/app/api/dependencies"


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

