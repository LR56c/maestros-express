import { NextRequest, NextResponse } from "next/server"
import prisma                        from "@/lib/prisma"
import {
  querySchema
}                                    from "@/modules/shared/application/query_dto"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import {
  PrismaWorkerEmbeddingData
} from "@/modules/worker_embedding/infrastructure/prisma_worker_embedding_data"
import {
  UpsertWorkerEmbedding
} from "@/modules/worker_embedding/application/upsert_worker_embedding"
import {
  RemoveWorkerEmbedding
} from "@/modules/worker_embedding/application/remove_worker_embedding"
import {
  SearchWorkerEmbedding
}                                    from "@/modules/worker_embedding/application/search_worker_embedding"
import {
  WorkerEmbeddingMapper
} from "@/modules/worker_embedding/application/worker_embedding_mapper"
import {
  OpenaiSupabaseWorkerEmbeddingData
} from "@/modules/worker_embedding/infrastructure/openai_supabase_worker_embedding_data"
import { getStory } from "@/app/api/story/route"
import { searchWorker }              from "@/app/api/worker/route"
import OpenAI                        from "openai"
import { createClient } from '@supabase/supabase-js'
import {
  workerEmbeddingRequestSchema
} from "@/modules/worker_embedding/application/worker_embedding_request"
import { WorkerMapper } from "@/modules/worker/application/worker_mapper"

const ai     = new OpenaiSupabaseWorkerEmbeddingData(createClient( process.env.SUPABASE_URL ?? "", process.env.SUPABASE_ANON_KEY ?? "" ),new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}))
const dao    = new PrismaWorkerEmbeddingData( prisma, ai )
const add    = new UpsertWorkerEmbedding( dao, searchWorker, getStory )
const remove = new RemoveWorkerEmbedding( dao )
const search = new SearchWorkerEmbedding( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( workerEmbeddingRequestSchema, body )
  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await add.execute( data.right )

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

  const result = await search.execute(
    data.right.query,
    data.right.limit,
    data.right.skip,
    data.right.sort_by,
    data.right.sort_type
  )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( WorkerMapper.toDTO ),
    { status: 200 } )
}

export async function DELETE( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const id               = searchParams.get( "id" )

  const result = await remove.execute( id ?? "" )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( { status: 200 } )
}