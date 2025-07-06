"use server"

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
  PrismaWorkerData
}                                    from "@/modules/worker/infrastructure/prisma_worker_data"
import {
  AddWorker
}                                    from "@/modules/worker/application/add_worker"
import {
  UpdateWorker
}                                    from "@/modules/worker/application/update_worker"
import {
  SearchWorker
}                                    from "@/modules/worker/application/search_worker"
import {
  workerRequestSchema
}                                    from "@/modules/worker/application/worker_request"
import {
  WorkerMapper
}                                    from "@/modules/worker/application/worker_mapper"
import {
  workerUpdateSchema
}                                    from "@/modules/worker/application/worker_update_dto"
import { searchSpeciality } from "@/app/api/speciality/route"
import {
  RegisterAuth
}                           from "@/modules/user/application/auth_use_cases/register_auth"
import {
  SupabaseAdminUserData
}                           from "@/modules/user/infrastructure/supabase_admin_user_data"
import { createClient }              from "@/utils/supabase/server"
import { upsertEmbedding }           from "@/app/api/worker_embedding/route"
import {
  searchNationalIdentityFormat
}                                    from "@/app/api/national_identity_format/route"

const authDao  = new SupabaseAdminUserData( await createClient() )
const register = new RegisterAuth( authDao )

function dao() {
  return new PrismaWorkerData( prisma )
}

const add    = new AddWorker( dao(),
  await searchNationalIdentityFormat(), register,
  await upsertEmbedding() )
const update = new UpdateWorker( dao(), await searchSpeciality() )

export async function searchWorker() {
  return new SearchWorker( dao() )
}

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( workerRequestSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await add.execute( data.right )
  console.log( "Worker route POST result", result )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( WorkerMapper.toDTO( result.right ),
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
    await searchWorker()
  ).execute( data.right.query,
    data.right.limit,
    data.right.skip,
    data.right.sort_by,
    data.right.sort_type )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right,
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( workerUpdateSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await update.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( WorkerMapper.toDTO( result.right ),
    { status: 200 } )
}
