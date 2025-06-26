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
  PrismaWorkerData
}                                    from "@/modules/worker/infrastructure/prisma_worker_data"
import {
  AddWorker
}                                    from "@/modules/worker/application/add_worker"
import { searchUser }                from "@/app/api/user/route"
import { searchCountry }             from "@/app/api/country/route"
import {
  UpdateWorker
}                                    from "@/modules/worker/application/update_worker"
import {
  SearchWorker
}                                    from "@/modules/worker/application/search_worker"
import {
  workerRequestSchema
}                                    from "@/modules/worker/application/worker_request"
import {
  WorkerMapper
}                                    from "@/modules/worker/application/worker_mapper"
import {
  workerUpdateSchema
}                                    from "@/modules/worker/application/worker_update_dto"

const dao    = new PrismaWorkerData( prisma )
const add    = new AddWorker( dao, searchUser, searchCountry )
const update = new UpdateWorker( dao )
const search = new SearchWorker( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( workerRequestSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await add.execute( data.right )
  // console.log("Worker add result:", result)

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( WorkerMapper.toDTO( result.right ),
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

  const result = await search.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( WorkerMapper.toDTO ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( workerUpdateSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await update.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( WorkerMapper.toDTO( result.right ),
    { status: 200 } )
}
