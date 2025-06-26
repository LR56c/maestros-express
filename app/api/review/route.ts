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
import {
  PrismaReviewData
}                                    from "@/modules/review/infrastructure/persistance/prisma_review_data"
import {
  AddReview
}                                    from "@/modules/review/application/add_review"
import {
  GetReviewByUser
}                                    from "@/modules/review/application/get_review_by_user"
import {
  ReviewMapper
}                                    from "@/modules/review/application/review_mapper"
import {
  reviewSchema
}                                    from "@/modules/review/application/review_dto"

const dao    = new PrismaReviewData( prisma )
const add    = new AddReview( dao )
const search = new GetReviewByUser( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( reviewSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await add.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( ReviewMapper.toDTO( result.right ),
    { status: 201 } )
}

export async function GET( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const id               = searchParams.get( "id" )

  const result = await search.execute(id ?? '')

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( ReviewMapper.toDTO ),
    { status: 200 } )
}

