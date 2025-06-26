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
  PrismaSectorData
}                                    from "@/modules/sector/infrastructure/persistance/prisma_sector_data"
import {
  AddSector
}                                    from "@/modules/sector/application/add_sector"
import {
  RemoveSector
}                                    from "@/modules/sector/application/remove_sector"
import {
  UpdateSector
}                                    from "@/modules/sector/application/update_sector"
import {
  SearchSector
}                                    from "@/modules/sector/application/search_sector"
import { searchRegion }              from "@/app/api/region/route"
import {
  sectorSchema
}                                    from "@/modules/sector/application/sector_dto"
import {
  SectorMapper
}                                    from "@/modules/sector/application/sector_mapper"

const dao    = new PrismaSectorData( prisma )
const add    = new AddSector( dao, searchRegion )
const remove = new RemoveSector( dao )
const update = new UpdateSector( dao )
const search = new SearchSector( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( sectorSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await add.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( SectorMapper.toDTO( result.right ),
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

  const result = await search.execute(     data.right.query,
    data.right.limit,
    data.right.skip,
    data.right.sort_by,
    data.right.sort_type, )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( SectorMapper.toDTO ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( sectorSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await update.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( SectorMapper.toDTO( result.right ),
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