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
  PrismaNotificationConfigData
}                                    from "@/modules/notification_config/infrastructure/persistance/prisma_notification_config_data"
import {
  AddNotificationConfig
}                                    from "@/modules/notification_config/application/add_notification_config"
import {
  RemoveNotificationConfig
}                                    from "@/modules/notification_config/application/remove_notification_config"
import {
  UpdateNotificationConfig
}                                    from "@/modules/notification_config/application/update_notification_config"
import {
  SearchNotificationConfig
}                                    from "@/modules/notification_config/application/search_notification_config"
import {
  notificationConfigSchema
}                                    from "@/modules/notification_config/application/notification_config_dto"
import {
  NotificationConfigMapper
}                                    from "@/modules/notification_config/application/notification_config_mapper"

const dao    = new PrismaNotificationConfigData( prisma )
const add    = new AddNotificationConfig( dao )
const remove = new RemoveNotificationConfig( dao )
const update = new UpdateNotificationConfig( dao )
const search = new SearchNotificationConfig( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( notificationConfigSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await add.execute( data.right )

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

  const result = await search.execute(
    data.right.query,
    data.right.limit ?? 10,
    data.right.skip,
    data.right.sort_by,
    data.right.sort_type
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

  const result = await update.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( NotificationConfigMapper.toDTO( result.right ),
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