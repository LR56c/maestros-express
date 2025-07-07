import { upsertPackages }            from "@/app/api/package/route"
import { NextRequest, NextResponse } from "next/server"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import {
  packageRequestSchema
}                                    from "@/modules/package/application/package_request"
import { isLeft }                    from "fp-ts/Either"
import {
  PackageMapper
}                                    from "@/modules/package/application/package_mapper"
import { z }                         from "zod"


export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( z.object( {
    worker_id: z.string(),
    packages : z.array( packageRequestSchema )
  } ), body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const { worker_id, packages } = data.right

  const result = await (
    await upsertPackages()
  ).execute( worker_id,packages )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map(PackageMapper.toDTO),
    { status: 201 } )
}
