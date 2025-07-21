"use server"

import { NextRequest, NextResponse } from "next/server"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import { z }                         from "zod"
import {
  storySchema
}                                    from "@/modules/story/application/story_dto"
import {
  StoryMapper
}                                    from "@/modules/story/application/story_mapper"
import {
  addStory,
  getStories,
  removeStory,
  updateStory
}                                    from "@/app/api/dependencies"



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

