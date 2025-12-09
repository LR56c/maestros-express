"use server"
import { NextRequest, NextResponse } from "next/server"
import {
  querySchema
}                                    from "@/modules/shared/application/query_dto"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import {
  WorkerEmbeddingMapper
}                                    from "@/modules/worker_embedding/application/worker_embedding_mapper"
import {
  workerEmbeddingRequestSchema
}                                    from "@/modules/worker_embedding/application/worker_embedding_request"
import {
  removeEmbedding,
  searchEmbedding,
  upsertEmbedding
}                                    from "@/app/api/dependencies"
import { z }                         from "zod"
import {
  TransformWorkerProfile
}                                    from "@/modules/worker/application/transform_worker_profile"


export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( workerEmbeddingRequestSchema.extend({
    worker_id : z.string()
  }), body )
  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const { worker_id, ...rest } = data.right

  const result = await (
    await upsertEmbedding()
  ).execute( worker_id, rest )
  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( WorkerEmbeddingMapper.toDTO( result.right ),
    { status: 201 } )
}

export async function GET( request: NextRequest ) {
  const { searchParams }                             = new URL( request.url )
  const paramsObject                                 = Object.fromEntries(
    searchParams.entries() )
  const { limit, skip, sort_by, sort_type, ...rest } = paramsObject

  const data = parseData( querySchema, {
    limit    : limit ? parseInt( limit as string ) : 10,
    skip     : skip ?? undefined,
    sort_by  : sort_by ?? undefined,
    sort_type: sort_type ?? undefined,
    ...rest
  } )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await (
    await searchEmbedding()
  ).execute(
    data.right.query,
    data.right.limit ?? undefined,
    data.right.skip ?? undefined,
    data.right.sort_by ?? undefined,
    data.right.sort_type ?? undefined,
  )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  const transformProfile = new TransformWorkerProfile()
  const profiles = await transformProfile.execute(result.right.items)

  if( isLeft( profiles ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( {
      total: result.right.total,
      items: profiles.right
    },
    { status: 200 } )
}

export async function DELETE( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const id               = searchParams.get( "id" )

  const split = id?.split( "," )
  const result = await (
    await removeEmbedding()
  ).execute( split ?? [] )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( { status: 200 } )
}