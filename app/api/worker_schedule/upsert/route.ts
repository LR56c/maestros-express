import { NextRequest, NextResponse } from "next/server"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import {
  workerScheduleSchema
}                                    from "@/modules/worker_schedule/application/worker_schedule_dto"
import { z }                         from "zod"
import { isLeft }                    from "fp-ts/Either"
import {
  WorkerScheduleMapper
}                                    from "@/modules/worker_schedule/application/worker_schedule_mapper"
import { upsertSchedules }           from "@/app/api/dependencies"

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData(
    z.object( {
      worker_id: z.string(),
      schedules: z.array( workerScheduleSchema )
    } ), body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const { worker_id, schedules } = data.right

  const result = await (
    await upsertSchedules()
  ).execute( worker_id, schedules )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( WorkerScheduleMapper.toDTO ),
    { status: 201 } )
}
