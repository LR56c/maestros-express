"use server"

import { NextRequest, NextResponse } from "next/server"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import { z }                         from "zod"
import { zoneSchema }                from "@/modules/zone/application/zone_dto"
import {
  ZoneMapper
}                                    from "@/modules/zone/application/zone_mapper"
import { getZonesWorker, upsertZones } from "@/app/api/dependencies"


export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( z.object( {
    worker_id: z.string(),
    zones    : z.array( zoneSchema )
  } ), body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await (await upsertZones()).execute(
    data.right.worker_id,
    data.right.zones
  )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( ZoneMapper.toDTO ),
    { status: 201 } )
}

export async function GET( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const id               = searchParams.get( "id" )

  const result = await (await getZonesWorker()).execute( id ?? "" )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( ZoneMapper.toDTO ),
    { status: 200 } )
}
