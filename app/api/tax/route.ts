"use server"

import { NextRequest, NextResponse }     from "next/server"
import {
  parseData
}                                        from "@/modules/shared/application/parse_handlers"
import { isLeft }                        from "fp-ts/Either"
import { z }                             from "zod"
import {
  workerTaxSchema
}                                        from "@/modules/worker_tax/application/worker_tax_dto"
import {
  WorkerTaxMapper
}                                        from "@/modules/worker_tax/application/worker_tax_mapper"
import { getWorkerTax, upsertWorkerTax } from "@/app/api/dependencies"


export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( z.object( {
    worker_id: z.string(),
    taxes    : z.array( workerTaxSchema )
  } ), body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const { worker_id, taxes } = data.right
  const result               = await (
    await upsertWorkerTax()
  ).execute( worker_id, taxes )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( WorkerTaxMapper.toDTO ),
    { status: 201 } )
}

export async function GET( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const paramsObject     = Object.fromEntries(
    searchParams.entries() )
  const { id }           = paramsObject

  const data = parseData( z.object( {
    worker_id: z.string()
  } ), {
    worker_id: id
  } )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await (
    await getWorkerTax()
  ).execute( data.right.worker_id )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( WorkerTaxMapper.toDTO ),
    { status: 200 } )
}
