import { NextRequest, NextResponse } from "next/server"
import prisma                        from "@/lib/prisma"
import {
  querySchema
}                                    from "@/modules/shared/application/query_dto"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import {
  PrismaUserData
}                                    from "@/modules/user/infrastructure/persistance/prisma_user_data"
import { AddUser }                   from "@/modules/user/application/add_user"
import {
  RemoveUser
}                                    from "@/modules/user/application/remove_user"
import {
  UpdateUser
}                                    from "@/modules/user/application/update_user"
import {
  SearchUser
}                                    from "@/modules/user/application/search_user"
import { searchRole }                from "@/app/api/role/route"
import {
  userRequestSchema
}                                    from "@/modules/user/application/user_request"
import {
  UserMapper
}                                    from "@/modules/user/application/user_mapper"
import {
  userUpdateSchema
}                                    from "@/modules/user/application/user_update_dto"

const dao               = new PrismaUserData( prisma )
const add               = new AddUser( dao, searchRole )
const remove            = new RemoveUser( dao )
const update            = new UpdateUser( dao, searchRole )
export const searchUser = new SearchUser( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( userRequestSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await add.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( UserMapper.toDTO( result.right ),
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

  const result = await searchUser.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( UserMapper.toDTO ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( userUpdateSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await update.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( UserMapper.toDTO( result.right ),
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