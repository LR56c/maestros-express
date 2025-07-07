"use server"

import { NextRequest, NextResponse } from "next/server"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import {
  PrismaCertificateData
}                                    from "@/modules/certificate/infrastructure/persistance/prisma_certificate_data"
import prisma                        from "@/lib/prisma"
import {
  GetCertificateByWorker
}                                    from "@/modules/certificate/application/get_certificate_by_worker"
import {
  certificateSchema
}                                    from "@/modules/certificate/application/certificate_dto"
import {
  CertificateMapper
}                                    from "@/modules/certificate/application/certificate_mapper"
import {
  UpsertCertificates
}                                    from "@/modules/certificate/application/upsert_certificates"
import { z }                         from "zod"

const dao    = new PrismaCertificateData( prisma )
const get    = new GetCertificateByWorker( dao )
const upsert = new UpsertCertificates( dao, get )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( z.object( {
    worker_id   : z.string(),
    certificates: z.array( certificateSchema )
  } ), body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }
  const { worker_id, certificates } = data.right
  const result                      = await upsert.execute( worker_id,
    certificates )
  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( CertificateMapper.toDTO ),
    { status: 201 } )
}

export async function GET( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const id               = searchParams.get( "id" )


  const result = await get.execute( id ?? "" )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( CertificateMapper.toDTO ),
    { status: 200 } )
}
