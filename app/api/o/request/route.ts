import { NextRequest, NextResponse } from "next/server"
import { isLeft }                    from "fp-ts/Either"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import {
  searchEmbedding,
  uploadRequestWorkerEmbedding
}                                    from "@/app/api/dependencies"
import { z }                         from "zod"
import {
  UploadRequestTypeEnum
}                                    from "@/modules/worker_embedding/domain/upload_request_type"
import {
  TransformWorkerProfile
}                                    from "@/modules/worker/application/transform_worker_profile"

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( z.object( {
    image   : z.string().optional(),
    input   : z.string().optional(),
    location: z.string(),
    radius  : z.number().int()
  } )
                           .refine( data =>
                               data.image || data.input,
                             {
                               message: "Debe proporcionar al menos una imagen o un texto de entrada"
                             }
                           ), body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }
  const resultRequest = await (
    await uploadRequestWorkerEmbedding()
  ).execute(
    data.right.image,
    data.right.input
  )
  if ( isLeft( resultRequest ) ) {
    return NextResponse.json( { status: 500 } )
  }

  const uploadRequest = resultRequest.right
  if ( uploadRequest.status.value !== UploadRequestTypeEnum.VALID ) {
    return NextResponse.json( { status: 500 } )
  }

  const queryResult = await (
    await searchEmbedding()
  ).execute(
    {
      input   : uploadRequest.processInput!.value,
      location: data.right.location,
      radius  : data.right.radius,
      status  : "VERIFIED"
    }
  )
  if ( isLeft( queryResult ) ) {
    return NextResponse.json( { status: 500 } )
  }

  const transformProfile = new TransformWorkerProfile()
  const { location }     = data.right
  const profiles         = await transformProfile.execute(
    queryResult.right.items, location )

  if ( isLeft( profiles ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( {
      info   : uploadRequest.infoText!.value,
      workers: profiles.right,
      total  : queryResult.right.total
    }
    , { status: 200 } )
}
