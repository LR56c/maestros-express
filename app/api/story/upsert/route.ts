import { NextRequest, NextResponse } from "next/server"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import {
  storySchema
}                                    from "@/modules/story/application/story_dto"
import { z }                         from "zod"
import { isLeft }                    from "fp-ts/Either"
import {
  StoryMapper
}                                    from "@/modules/story/application/story_mapper"
import { upsertStories }             from "@/app/api/dependencies"

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( z.object( {
    worker_id: z.string(),
    stories  : z.array( storySchema )
  } ), body )
  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const { worker_id, stories } = data.right

  const result = await (
    await upsertStories()
  ).execute( worker_id, stories )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( StoryMapper.toDTO ),
    { status: 201 } )
}
