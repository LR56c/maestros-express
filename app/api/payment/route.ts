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
  PrismaPaymentData
}                                    from "@/modules/payment/infrastructure/prisma_payment_data"
import {
  AddPayment
}                                    from "@/modules/payment/application/add_payment"
import {
  SearchPayment
}                                    from "@/modules/payment/application/search_payment"
import {
  paymentRequestSchema
}                                    from "@/modules/payment/application/payment_request"
import {
  PaymentMapper
}                                    from "@/modules/payment/application/payment_mapper"
import {
  UpdatePayment
}                                    from "@/modules/payment/application/update_payment"
import {
  paymentUpdateSchema
}                                    from "@/modules/payment/application/payment_update_dto"

const dao    = new PrismaPaymentData( prisma )
const add    = new AddPayment( dao )
const update = new UpdatePayment( dao )
const search = new SearchPayment( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( paymentRequestSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await add.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( PaymentMapper.toDTO( result.right ),
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

  return NextResponse.json( result.right.map( PaymentMapper.toDTO ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( paymentUpdateSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await update.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( PaymentMapper.toDTO( result.right ),
    { status: 200 } )
}

