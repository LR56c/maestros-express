"use server"

import { NextRequest, NextResponse } from "next/server"
import prisma                        from "@/lib/prisma"
import {
  querySchema
}                                    from "@/modules/shared/application/query_dto"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import { z }                         from "zod"
import {
  PrismaWorkerBookingData
}                                    from "@/modules/worker_booking/infrastructure/prisma_worker_booking_data"
import {
  RequestWorkerBooking
}                                    from "@/modules/worker_booking/application/request_worker_booking"
import {
  CancelWorkerBooking
}                                    from "@/modules/worker_booking/application/cancel_worker_booking"
import {
  UpdateWorkerBooking
}                                    from "@/modules/worker_booking/application/update_worker_booking"
import {
  SearchWorkerBooking
}                                    from "@/modules/worker_booking/application/search_worker_booking"
import {
  WorkerBookingMapper
}                                    from "@/modules/worker_booking/application/worker_booking_mapper"
import {
  workerBookingSchema
}                                    from "@/modules/worker_booking/application/worker_booking_dto"

const dao    = new PrismaWorkerBookingData( prisma )
const add    = new RequestWorkerBooking( dao )
const cancel = new CancelWorkerBooking( dao )
const update                  = new UpdateWorkerBooking( dao )
const search = new SearchWorkerBooking( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( workerBookingSchema.extend({
    worker_id : z.string(),
    client_id : z.string(),
  }), body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const {worker_id,client_id,...rest} = data.right

  const result = await add.execute( client_id, worker_id, rest )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( WorkerBookingMapper.toDTO( result.right ),
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
    data.right.sort_type,
  )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( WorkerBookingMapper.toDTO ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( workerBookingSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await update.execute( data.right)

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( WorkerBookingMapper.toDTO( result.right ),
    { status: 200 } )
}

export async function DELETE( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const id               = searchParams.get( "id" )

  const result = await cancel.execute( id ?? "" )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( { status: 200 } )
}