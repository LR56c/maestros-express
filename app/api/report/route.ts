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
  PrismaReportData
}                                    from "@/modules/report/infrastructure/persistance/prisma_report_data"
import {
  AddReport
}                                    from "@/modules/report/application/add_report"
import {
  SearchReport
}                                    from "@/modules/report/application/search_report"
import {
  ReportMapper
}                                    from "@/modules/report/application/report_mapper"
import {
  reportSchema
}                                    from "@/modules/report/application/report_dto"
import { searchUser }                from "@/app/api/user/route"

const dao    = new PrismaReportData( prisma )
const add    = new AddReport( dao, await searchUser() )
const search = new SearchReport( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( reportSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await add.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( ReportMapper.toDTO( result.right ),
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

  return NextResponse.json( result.right.map( ReportMapper.toDTO ),
    { status: 200 } )
}
