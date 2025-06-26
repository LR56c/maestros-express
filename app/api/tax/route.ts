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
  PrismaWorkerTaxData
}                                    from "@/modules/worker_tax/infrastructure/persistance/prisma_worker_tax_data"
import {
  UpsertWorkerTax
}                                    from "@/modules/worker_tax/application/upsert_worker_tax"
import {
  GetByWorkerTax
}                                    from "@/modules/worker_tax/application/get_by_worker_tax"
import {
  workerTaxSchema
}                                    from "@/modules/worker_tax/application/worker_tax_dto"
import {
  WorkerTaxMapper
}                                    from "@/modules/worker_tax/application/worker_tax_mapper"

const dao    = new PrismaWorkerTaxData( prisma )
const upsert    = new UpsertWorkerTax( dao )
const getWorkerTax = new GetByWorkerTax( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( workerTaxSchema.extend({
    worker_id: z.string()
  }), body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const { worker_id, ...rest } = data.right
  const result = await upsert.execute( worker_id,rest )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( WorkerTaxMapper.toDTO( result.right ),
    { status: 201 } )
}

export async function GET( request: NextRequest ) {
  const { searchParams }                             = new URL( request.url )
  const paramsObject                                 = Object.fromEntries(
    searchParams.entries() )
  const { id } = paramsObject

  const data = parseData( z.object({
    worker_id: z.string()
  }), {
    worker_id: id
  } )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await getWorkerTax.execute(data.right.worker_id)

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( WorkerTaxMapper.toDTO ),
    { status: 200 } )
}
