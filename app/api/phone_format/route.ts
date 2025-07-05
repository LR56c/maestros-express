"use server"

import { searchCountry }             from "@/app/api/country/route"
import {
  PrismaPhoneFormatData
}                                    from "@/modules/phone_format/infrastructure/prisma_phone_format_data"
import prisma                        from "@/lib/prisma"
import {
  AddPhoneFormat
}                                    from "@/modules/phone_format/application/add_phone_format"
import {
  RemovePhoneFormat
} from "@/modules/phone_format/application/remove_phone_format"
import {
  UpdatePhoneFormat
}                                    from "@/modules/phone_format/application/update_phone_format"
import {
  SearchPhoneFormat
}                                    from "@/modules/phone_format/application/search_phone_format"
import { NextRequest, NextResponse } from "next/server"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import {
  phoneFormatSchema
} from "@/modules/phone_format/application/phone_format_dto"
import { isLeft }                    from "fp-ts/Either"
import {
  PhoneFormatMapper
}                                    from "@/modules/phone_format/application/phone_format_mapper"
import {
  querySchema
}                                    from "@/modules/shared/application/query_dto"

const dao    = new PrismaPhoneFormatData( prisma )
const add    = new AddPhoneFormat( dao, await searchCountry() )
const remove = new RemovePhoneFormat( dao )
const update = new UpdatePhoneFormat( dao, await searchCountry() )
const search = new SearchPhoneFormat( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( phoneFormatSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await add.execute( data.right )

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

  return NextResponse.json( result.right.map( PhoneFormatMapper.toDTO ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( phoneFormatSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await update.execute( data.right)

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( PhoneFormatMapper.toDTO( result.right ),
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