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
  quotationRequestSchema
}                                    from "@/modules/quotation/application/quotation_request"
import {
  QuotationMapper
}                                    from "@/modules/quotation/application/quotation_mapper"
import {
  quotationUpdateSchema
}                                    from "@/modules/quotation/application/quotation_update_dto"
import {
  addQuotation,
  searchQuotation,
  updateQuotation
}                                    from "@/app/api/dependencies"


export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( quotationRequestSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await (await addQuotation()).execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( QuotationMapper.toDTO( result.right ),
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

  const result = await (await searchQuotation()).execute(
    data.right.query,
    data.right.limit ?? undefined,
    data.right.skip ?? undefined,
    data.right.sort_by ?? undefined,
    data.right.sort_type ?? undefined,
  )
  console.log( "Quotation Search Result:", result )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( QuotationMapper.toDTO ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( quotationUpdateSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await (await updateQuotation()).execute( data.right)

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( QuotationMapper.toDTO( result.right ),
    { status: 200 } )
}
