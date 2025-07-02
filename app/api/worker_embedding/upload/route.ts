"use server"

import { NextRequest, NextResponse } from "next/server"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import {
  UploadRequestWorkerEmbedding
}                 from "@/modules/worker_embedding/application/upload_request_worker_embedding"
import { aiRepo } from "@/app/api/worker_embedding/route"
import { z }      from "zod"
import {
  UploadRequestMapper

}                                    from "@/modules/worker_embedding/application/upload_request_mapper"

const upload = new UploadRequestWorkerEmbedding( await aiRepo() )

export async function POST( request: NextRequest ) {
  // const body = await request.json()
  const form = await request.formData()
  const body = {
    base64Image: form.get( "image" ) ?? undefined,
    input      : form.get( "input" ) ?? undefined
  }
  const data = parseData( z.object( {
    base64Image: z.string().optional(),
    input      : z.string().optional()
  } ).refine( data =>
      Object.values( data ).some( value => value !== undefined ),
    {
      message: "At least one field must be present"
    }
  ), body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await upload.execute(
    data.right.base64Image,
    data.right.input
  )
  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( UploadRequestMapper.toDTO(result.right), { status: 201 } )
}
