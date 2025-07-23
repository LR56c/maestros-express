import { NextRequest, NextResponse }      from "next/server"
import {
  parseData
}                                         from "@/modules/shared/application/parse_handlers"
import {
  storySchema
}                                         from "@/modules/story/application/story_dto"
import { z }                              from "zod"
import { isLeft }                         from "fp-ts/Either"
import {
  StoryMapper
}                                         from "@/modules/story/application/story_mapper"
import { upsertEmbedding, upsertStories } from "@/app/api/dependencies"
import {
  UUID
}                                         from "@/modules/shared/domain/value_objects/uuid"
import {
  WorkerEmbeddingTypeEnum
}                                         from "@/modules/worker_embedding/domain/worker_embedding_type"

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( z.object( {
    worker_id: z.string(),
    worker_location: z.string(),
    stories  : z.array( storySchema )
  } ), body )
  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const { worker_id, worker_location, stories } = data.right

  const result = await (
    await upsertStories()
  ).execute( worker_id, stories )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  for ( const story of result.right.created ) {
    const mapped = StoryMapper.toDTO( story )
    const embeddingResult = await (
      await upsertEmbedding()).execute(worker_id,{
      id      : UUID.create().toString(),
      location: worker_location,
      data    : {
        type: WorkerEmbeddingTypeEnum.STORY,
        ...mapped
      }
    })

    if ( isLeft( embeddingResult ) ) {
      return NextResponse.json( { status: 500 } )
    }
  }


  return NextResponse.json( result.right.updated.map( StoryMapper.toDTO ),
    { status: 201 } )
}
