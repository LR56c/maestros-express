"use server"

import { NextRequest, NextResponse } from "next/server"
import {
  querySchema
}                                    from "@/modules/shared/application/query_dto"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import { searchUser, updateAuth }    from "@/app/api/dependencies"
import {
  UserMapper
}                                    from "@/modules/user/application/user_mapper"
import {
  userUpdateSchema
}                                    from "@/modules/user/application/models/user_update_dto"
import { createClientServer }        from "@/utils/supabase/server"

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
    await searchUser()
  ).execute( data.right.query,
    data.right.limit,
    data.right.skip,
    data.right.sort_by,
    data.right.sort_type )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( {
      items: result.right.items.map( UserMapper.toDTO ),
      total: result.right.total
    },
    { status: 200 } )
}


export async function PUT( request: NextRequest ) {
  const sup                = await createClientServer()
  const { data: { user } } = await sup.auth.getUser()
  if ( !user ) {
    return NextResponse.json( { status: 401 } )
  }

  const body = {
    ...await request.json(),
    email: user.email,
  }
  const data = parseData( userUpdateSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await (
    await updateAuth()
  ).execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( { status: 200 } )
}
