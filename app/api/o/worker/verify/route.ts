import { NextRequest, NextResponse } from "next/server"
import {
  isLeft
}                                    from "fp-ts/Either"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import {
  getStories,
  updateAuth,
  updateWorker,
  upsertEmbedding
}                                    from "@/app/api/dependencies"
import {
  UserUpdateDTO
}                                    from "@/modules/user/application/models/user_update_dto"
import {
  WorkerUpdateDTO,
  workerUpdateSchema
}                                    from "@/modules/worker/application/worker_update_dto"
import {
  StoryMapper
}                                    from "@/modules/story/application/story_mapper"
import {
  UUID
}                                    from "@/modules/shared/domain/value_objects/uuid"
import {
  WorkerEmbeddingTypeEnum
}                                    from "@/modules/worker_embedding/domain/worker_embedding_type"


export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( workerUpdateSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const updatedStatus            = "VERIFIED"
  const workDto: WorkerUpdateDTO = {
    user     : data.right.user,
    status   : updatedStatus,
    embedding: true,
    verified : true
  }
  const result                   = await (
    await updateWorker()
  ).execute( workDto )
  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  const authDto: UserUpdateDTO = {
    email : result.right.user.email.value,
    status: updatedStatus
  }
  const user                   = await (
    await updateAuth()
  ).execute( authDto )
  if ( isLeft( user ) ) {
    return NextResponse.json( { status: 500 } )
  }

  const workerId = result.right.user.userId.toString()
  const stories = await (await getStories()).execute(workerId)

  if ( isLeft( stories ) ) {
    return NextResponse.json( { status: 500 } )
  }

  const location = result.right.location.toString()
  for ( const story of stories.right ) {
    const mapped = StoryMapper.toDTO( story )
    const embeddingResult = await (
      await upsertEmbedding()).execute(workerId,{
      id      : UUID.create().toString(),
      location: location,
      data    : {
        type: WorkerEmbeddingTypeEnum.STORY,
        ...mapped
      }
    })

    if ( isLeft( embeddingResult ) ) {
      return NextResponse.json( { status: 500 } )
    }
  }

  return NextResponse.json( { status: 201 } )
}
