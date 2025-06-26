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
  PrismaRoleData
}                                    from "@/modules/role/infrastructure/persistance/prisma_role_data"
import { AddRole }                   from "@/modules/role/application/add_role"
import {
  RemoveRole
}                                    from "@/modules/role/application/remove_role"
import {
  UpdateRole
}                                    from "@/modules/role/application/update_role"
import {
  SearchRole
}                                    from "@/modules/role/application/search_role"
import { roleSchema }                from "@/modules/role/application/role_dto"
import {
  RoleMapper
}                                    from "@/modules/role/application/role_mapper"
import { z }                         from "zod"

const dao               = new PrismaRoleData( prisma )
const add               = new AddRole( dao )
const remove            = new RemoveRole( dao )
const update            = new UpdateRole( dao )
export const searchRole = new SearchRole( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( roleSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await add.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( { status: 201 } )
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

  const result = await searchRole.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( RoleMapper.toDTO ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( z.object( {
    prev_name: z.string(),
    new_name : z.string()
  } ), body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await update.execute(
    data.right.prev_name,
    data.right.new_name
  )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( { status: 200 } )
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