"use server"

import { NextRequest, NextResponse } from "next/server"
import {
  querySchema
}                                    from "@/modules/shared/application/query_dto"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import {
  nationalIdentityFormatSchema
}                                    from "@/modules/national_identity_format/application/national_identity_format_dto"
import {
  NationalIdentityFormatMapper
}                                    from "@/modules/national_identity_format/application/national_identity_format_mapper"
import {
  addNationalIdentity,
  removeNationalIdentity,
  searchNationalIdentityFormat,
  updateNationalIdentity
}                                    from "@/app/api/dependencies"

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( nationalIdentityFormatSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await (
    await addNationalIdentity()
  ).execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( NationalIdentityFormatMapper.toDTO( result.right ),
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

  const result = await (
    await searchNationalIdentityFormat()
  ).execute(
    data.right.query,
    data.right.limit ?? undefined,
    data.right.skip ?? undefined,
    data.right.sort_by ?? undefined,
    data.right.sort_type ?? undefined,
  )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json(
    {
      items: result.right.items.map( NationalIdentityFormatMapper.toDTO ),
      total: result.right.total
    },
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( nationalIdentityFormatSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await (
    await updateNationalIdentity()
  ).execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( NationalIdentityFormatMapper.toDTO( result.right ),
    { status: 200 } )
}

export async function DELETE( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const id               = searchParams.get( "id" )

  const result = await (
    await removeNationalIdentity()
  ).execute( id ?? "" )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( { status: 200 } )
}