import { NextRequest, NextResponse } from "next/server"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import { updateAuth, updateWorker }  from "@/app/api/dependencies"
import { workerExtraSchema }         from "@/utils/worker_extra"
import {
  UserUpdateDTO
}                                    from "@/modules/user/application/models/user_update_dto"

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( workerExtraSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await (
    await updateWorker()
  ).execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }
  console.log( "worker result", result.right )

  const dto: UserUpdateDTO = {
    email : result.right.user.email.value,
    status: "VERIFIED"
  }
  console.log( "update dto", dto )

  const user = await (
    await updateAuth()
  ).execute( dto )
  console.log( "user", user )

  if ( isLeft( user ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( { status: 201 } )
}
