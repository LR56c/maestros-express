import { NextRequest, NextResponse } from "next/server"
import { isLeft }                    from "fp-ts/Either"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { updateAuth, updateWorker }  from "@/app/api/dependencies"
import {
  UserUpdateDTO
}                                    from "@/modules/user/application/models/user_update_dto"
import {
  WorkerUpdateDTO,
  workerUpdateSchema
}                                    from "@/modules/worker/application/worker_update_dto"


export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( workerUpdateSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const updatedStatus            = "VERIFIED"
  const workDto: WorkerUpdateDTO = {
    user     : data.right.user,
    status   : updatedStatus,
    embedding: true,
    verified : true
  }
  const result                   = await (
    await updateWorker()
  ).execute( workDto )
  if ( isLeft( result ) ) {
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
