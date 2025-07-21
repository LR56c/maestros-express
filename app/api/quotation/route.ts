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
  PrismaQuotationData
}                                    from "@/modules/quotation/infrastructure/prisma_quotation_data"
import {
  AddQuotation
}                                    from "@/modules/quotation/application/add_quotation"
import {
  SearchQuotation
}                                    from "@/modules/quotation/application/search_quotation"
import {
  UpdateQuotation
}                                    from "@/modules/quotation/application/update_quotation"
import {
  quotationRequestSchema
}                                    from "@/modules/quotation/application/quotation_request"
import {
  QuotationMapper
}                                    from "@/modules/quotation/application/quotation_mapper"
import {
  quotationUpdateSchema
}                                        from "@/modules/quotation/application/quotation_update_dto"
import {
  addQuotation,
  searchQuotation,
  updateQuotation
} from "@/app/api/dependencies"



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
    data.right.limit,
    data.right.skip,
    data.right.sort_by,
    data.right.sort_type
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
