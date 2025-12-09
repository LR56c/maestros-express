"use server"

import { NextRequest, NextResponse } from "next/server"
import {
  querySchema
}                                    from "@/modules/shared/application/query_dto"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import { searchWorker }              from "@/app/api/dependencies"
import {
  WorkerMapper
}                                    from "@/modules/worker/application/worker_mapper"

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
    data.right.limit ?? undefined,
    data.right.skip ?? undefined,
    data.right.sort_by ?? undefined,
    data.right.sort_type ?? undefined,
    )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  const { items, total } = result.right
  return NextResponse.json( {
      items: items.map( WorkerMapper.toDTO ),
      total: total
    },
    { status: 200 } )
}

