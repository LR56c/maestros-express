"use server"

import { NextRequest, NextResponse } from "next/server"
import prisma                        from "@/lib/prisma"
import {
  querySchema
}                                    from "@/modules/shared/application/query_dto"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import {
  PrismaWorkerScheduleData
}                                    from "@/modules/worker_schedule/infrastructure/prisma_worker_schedule_data"
import {
  AddWorkerSchedule
}                                    from "@/modules/worker_schedule/application/add_worker_schedule"
import {
  RemoveWorkerSchedule
}                                    from "@/modules/worker_schedule/application/remove_worker_schedule"
import {
  UpdateWorkerSchedule
}                                    from "@/modules/worker_schedule/application/update_worker_schedule"
import {
  SearchWorkerSchedule
}                                    from "@/modules/worker_schedule/application/search_worker_schedule"
import {
  workerScheduleSchema
}                                    from "@/modules/worker_schedule/application/worker_schedule_dto"
import {
  WorkerScheduleMapper
}                                    from "@/modules/worker_schedule/application/worker_schedule_mapper"
import { isLeft }                    from "fp-ts/Either"
import { z }                         from "zod"
import {
  UpsertSchedules
}                                    from "@/modules/worker_schedule/application/upsert_schedules"

const dao    = new PrismaWorkerScheduleData( prisma )
const add    = new AddWorkerSchedule( dao )
const remove = new RemoveWorkerSchedule( dao )
const update = new UpdateWorkerSchedule( dao )
const search = new SearchWorkerSchedule( dao )

export async function upsertSchedules() {
  return new UpsertSchedules( dao, search )
}

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( workerScheduleSchema.extend( {
    worker_id: z.string()
  } ), body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const { worker_id, ...rest } = data.right

  const result = await add.execute( worker_id, rest )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( WorkerScheduleMapper.toDTO( result.right ),
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

  return NextResponse.json( result.right.map( WorkerScheduleMapper.toDTO ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( workerScheduleSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await update.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( WorkerScheduleMapper.toDTO( result.right ),
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