"use server"

import { NextRequest, NextResponse } from "next/server"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import {
  phoneFormatSchema
}                                    from "@/modules/phone_format/application/phone_format_dto"
import { isLeft }                    from "fp-ts/Either"
import {
  PhoneFormatMapper
}                                    from "@/modules/phone_format/application/phone_format_mapper"
import {
  querySchema
}                                    from "@/modules/shared/application/query_dto"
import {
  addPhoneFormat,
  removePhoneFormat,
  searchPhoneFormat,
  updatePhoneFormat
}                                    from "@/app/api/dependencies"


export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( phoneFormatSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await (
    await addPhoneFormat()
  ).execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( PhoneFormatMapper.toDTO( result.right ),
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
    await searchPhoneFormat()
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

  return NextResponse.json( {
      items: result.right.items.map( PhoneFormatMapper.toDTO ),
      total: result.right.total
    },
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( phoneFormatSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await (
    await updatePhoneFormat()
  ).execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( PhoneFormatMapper.toDTO( result.right ),
    { status: 200 } )
}

export async function DELETE( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const id               = searchParams.get( "id" )

  const result = await (
    await removePhoneFormat()
  ).execute( id ?? "" )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( { status: 200 } )
}