"use server"

import { NextRequest, NextResponse } from "next/server"
import {
  specialitySchema
}                                    from "@/modules/speciality/application/speciality_dto"
import {
  AddSpeciality
}                                    from "@/modules/speciality/application/add_speciality"
import {
  PrismaSpecialityData
}                                    from "@/modules/speciality/infrastructure/persistance/prisma_speciality_data"
import prisma                        from "@/lib/prisma"
import {
  RemoveSpeciality
}                                    from "@/modules/speciality/application/remove_speciality"
import {
  UpdateSpeciality
}                                    from "@/modules/speciality/application/update_speciality"
import {
  SearchSpeciality
}                                    from "@/modules/speciality/application/search_speciality"
import {
  querySchema
}                                    from "@/modules/shared/application/query_dto"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import {
  SpecialityMapper
}                                    from "@/modules/speciality/application/speciality_mapper"
import { z }                         from "zod"

const dao    = new PrismaSpecialityData( prisma )
const add    = new AddSpeciality( dao )
const remove = new RemoveSpeciality( dao )
const update = new UpdateSpeciality( dao )

export async function searchSpeciality() {
  return new SearchSpeciality( dao )
}

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( specialitySchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await add.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( SpecialityMapper.toDTO( result.right ),
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
    await searchSpeciality()
  ).execute(
    data.right.query,
    data.right.limit,
    data.right.skip,
    data.right.sort_by,
    data.right.sort_type
  )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( SpecialityMapper.toDTO ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( z.object( {
    prev_name: z.string(),
    new_name : z.string()
  } ), body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await update.execute(
    data.right.prev_name,
    data.right.new_name
  )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( SpecialityMapper.toDTO( result.right ),
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