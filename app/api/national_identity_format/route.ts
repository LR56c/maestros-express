"use server"

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
  PrismaNationalIdentityFormatData
}                                    from "@/modules/national_identity_format/infrastructure/prisma_national_identity_format_data"
import {
  AddNationalIdentityFormat
}                                    from "@/modules/national_identity_format/application/add_national_identity_format"
import {
  RemoveNationalIdentityFormat
}                                    from "@/modules/national_identity_format/application/remove_national_identity_format"
import {
  UpdateNationalIdentityFormat
}                                    from "@/modules/national_identity_format/application/update_national_identity_format"
import {
  SearchNationalIdentityFormat
}                                    from "@/modules/national_identity_format/application/search_national_identity_format"
import { searchCountry }             from "@/app/api/country/route"
import {
  nationalIdentityFormatSchema
}                                    from "@/modules/national_identity_format/application/national_identity_format_dto"
import {
  NationalIdentityFormatMapper
}                                    from "@/modules/national_identity_format/application/national_identity_format_mapper"
import {
  addNationalIdentity, removeNationalIdentity,
  searchNationalIdentityFormat, updateNationalIdentity
} from "@/app/api/dependencies"

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( nationalIdentityFormatSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await (await addNationalIdentity()).execute( data.right )

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

  const result = await (await searchNationalIdentityFormat()).execute(
    data.right.query,
    data.right.limit,
    data.right.skip,
    data.right.sort_by,
    data.right.sort_type
  )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json(
    result.right.map( NationalIdentityFormatMapper.toDTO ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( nationalIdentityFormatSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await (await updateNationalIdentity()).execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( NationalIdentityFormatMapper.toDTO( result.right ),
    { status: 200 } )
}

export async function DELETE( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const id               = searchParams.get( "id" )

  const result = await (await removeNationalIdentity()).execute( id ?? "" )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( { status: 200 } )
}