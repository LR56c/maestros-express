import { NextRequest, NextResponse } from "next/server"
import { isLeft }                    from "fp-ts/Either"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { workerExtraSchema }         from "@/utils/worker_extra"
import {
  updateAuth,
  updateWorker,
  upsertCertificates,
  upsertSchedules,
  upsertStories,
  upsertWorkerTax,
  upsertZones
}                                    from "@/app/api/dependencies"
import {
  UserUpdateDTO
}                                    from "@/modules/user/application/models/user_update_dto"
import {
  WorkerUpdateDTO
}                                    from "@/modules/worker/application/worker_update_dto"


export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( workerExtraSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const updatedStatus = "PENDING"
  const workDto: WorkerUpdateDTO = {
    user        : data.right.user,
    status      : updatedStatus,
    specialities: data.right.specialities
  }
  const result                   = await (
    await updateWorker()
  ).execute( workDto )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }
  const taxResult = await (
    await upsertWorkerTax()
  ).execute( result.right.user.userId.toString(), data.right.taxes )
  if ( isLeft( taxResult ) ) {
    return NextResponse.json( { status: 500 } )
  }
  const zoneResult = await (
    await upsertZones()
  ).execute(
    result.right.user.userId.toString(),
    data.right.zones
  )
  if ( isLeft( zoneResult ) ) {
    return NextResponse.json( { status: 500 } )
  }
  const certificateResult = await (
    await upsertCertificates()
  ).execute(
    result.right.user.userId.toString(),
    data.right.certificates
  )
  if ( isLeft( certificateResult ) ) {
    return NextResponse.json( { status: 500 } )
  }
  const storyResult = await (
    await upsertStories()
  ).execute(
    result.right.user.userId.toString(),
    data.right.stories
  )
  if ( isLeft( storyResult ) ) {
    return NextResponse.json( { status: 500 } )
  }
  const scheduleResult = await (
    await upsertSchedules()
  ).execute(
    result.right.user.userId.toString(),
    data.right.schedules
  )
  if ( isLeft( scheduleResult ) ) {
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

  return NextResponse.json( { status: 201 } )
}
