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
  PrismaRegionData
}                                    from "@/modules/region/infrastructure/persistance/prisma_region_data"
import {
  AddRegion
}                                    from "@/modules/region/application/add_region"
import {
  RemoveRegion
}                                    from "@/modules/region/application/remove_region"
import {
  UpdateRegion
}                                    from "@/modules/region/application/update_region"
import {
  SearchRegion
}                                    from "@/modules/region/application/search_region"
import { searchCountry }             from "@/app/api/country/route"
import {
  regionSchema
}                                    from "@/modules/region/application/region_dto"
import {
  RegionMapper
}                                    from "@/modules/region/application/region_mapper"

const dao                 = new PrismaRegionData( prisma )
const add                 = new AddRegion( dao, searchCountry )
const remove              = new RemoveRegion( dao )
const update              = new UpdateRegion( dao )
export const searchRegion = new SearchRegion( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( regionSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await add.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( RegionMapper.toDTO( result.right ),
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

  const result = await searchRegion.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( RegionMapper.toDTO ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( regionSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await update.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( RegionMapper.toDTO( result.right ),
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