"use server"

import { NextRequest, NextResponse } from "next/server"
import {
  querySchema
}                                    from "@/modules/shared/application/query_dto"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import {
  notificationConfigSchema
}                                    from "@/modules/notification_config/application/notification_config_dto"
import {
  NotificationConfigMapper
}                                    from "@/modules/notification_config/application/notification_config_mapper"
import {
  addNotificationConfig,
  removeNotificationConfig,
  searchNotificationConfig,
  updateNotificationConfig
}                                    from "@/app/api/dependencies"


export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( notificationConfigSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await (
    await addNotificationConfig()
  ).execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( NotificationConfigMapper.toDTO( result.right ),
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
    await searchNotificationConfig()
  ).execute(
    data.right.query,
    data.right.limit ?? 10,
    data.right.skip ?? undefined,
    data.right.sort_by ?? undefined,
    data.right.sort_type ?? undefined,
  )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( NotificationConfigMapper.toDTO ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( notificationConfigSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await (
    await updateNotificationConfig()
  ).execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( NotificationConfigMapper.toDTO( result.right ),
    { status: 200 } )
}

export async function DELETE( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const id               = searchParams.get( "id" )

  const result = await (
    await removeNotificationConfig()
  ).execute( id ?? "" )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( { status: 200 } )
}