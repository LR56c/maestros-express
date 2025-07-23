"use server"

import { NextRequest, NextResponse } from "next/server"
import { isLeft }                    from "fp-ts/Either"
import {
  StoryMapper
}                                    from "@/modules/story/application/story_mapper"
import { getStories }                from "@/app/api/dependencies"


export async function GET( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const id               = searchParams.get( "id" )

  const result = await (
    await getStories()
  ).execute( id ?? "" )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( StoryMapper.toDTO ),
    { status: 200 } )
}

