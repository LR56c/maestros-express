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
  workerRequestSchema
}                                    from "@/modules/worker/application/worker_request"
import { addWorker, searchWorker }   from "@/app/api/dependencies"
import {
  TransformWorkerProfile
}                                    from "@/modules/worker/application/transform_worker_profile"


export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( workerRequestSchema, body )
  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await (
    await addWorker()
  ).execute( data.right )
  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( { status: 201 } )
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
    await searchWorker()
  ).execute( data.right.query,
    data.right.limit,
    data.right.skip,
    data.right.sort_by,
    data.right.sort_type )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  const { query } = data.right
  const { items, total } = result.right
  const transformProfile = new TransformWorkerProfile()
  const profiles = await transformProfile.execute(items, query.location as string)

  if( isLeft( profiles ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( {
      items: profiles.right,
      total: total
    },
    { status: 200 } )
}

// export async function PUT( request: NextRequest ) {
//   const body = await request.json()
//   const data = parseData( workerUpdateSchema, body )
//
//   if ( isLeft( data ) ) {
//     return NextResponse.json( { error: data.left.message }, { status: 400 } )
//   }
//
//   const result = await (
//     await updateWorker()
//   ).execute( data.right )
//
//   if ( isLeft( result ) ) {
//     return NextResponse.json( { status: 500 } )
//   }
//
//   return NextResponse.json( { status: 200 } )
// }
