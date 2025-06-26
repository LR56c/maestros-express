import { NextRequest, NextResponse } from "next/server"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import {
  SpecialityMapper
}                                    from "@/modules/speciality/application/speciality_mapper"
import {
  PrismaCertificateData
}                                    from "@/modules/certificate/infrastructure/persistance/prisma_certificate_data"
import prisma                        from "@/lib/prisma"
import {
  AddCertificate
}                                    from "@/modules/certificate/application/add_certificate"
import {
  RemoveCertificate
}                                    from "@/modules/certificate/application/remove_certificate"
import {
  GetCertificateByWorker
}                                    from "@/modules/certificate/application/get_certificate_by_worker"
import {
  certificateSchema
}                                    from "@/modules/certificate/application/certificate_dto"
import {
  CertificateMapper
}                                    from "@/modules/certificate/application/certificate_mapper"

const dao    = new PrismaCertificateData( prisma )
const add    = new AddCertificate( dao )
const remove = new RemoveCertificate( dao )
const get    = new GetCertificateByWorker( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( certificateSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await add.execute( data.right )
  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( CertificateMapper.toDTO( result.right ),
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

export async function DELETE( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const id               = searchParams.get( "id" )

  const result = await remove.execute( id ?? "" )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( { status: 200 } )
}