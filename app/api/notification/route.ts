"use server"

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
  PrismaNotificationData
}                                    from "@/modules/notification/infrastructure/persistance/prisma_notification_data"
import {
  SendNotification
}                                    from "@/modules/notification/application/send_notification"
import {
  UpdateNotification
}                                    from "@/modules/notification/application/update_notification"
import {
  SearchNotifications
}                                    from "@/modules/notification/application/search_notifications"
import {
  notificationRequestSchema
}                                    from "@/modules/notification/application/notification_request"
import {
  NotificationMapper
}                                    from "@/modules/notification/application/notification_mapper"
import {
  notificationUpdateSchema
}                                    from "@/modules/notification/application/notification_update_dto"

const dao    = new PrismaNotificationData( prisma )
const send    = new SendNotification( dao )
const update                  = new UpdateNotification( dao )
const search = new SearchNotifications( dao )

export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( notificationRequestSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await send.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( NotificationMapper.toResponse( result.right ),
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
    data.right.sort_type,
  )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( NotificationMapper.toResponse ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( notificationUpdateSchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await update.execute( data.right  )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( NotificationMapper.toResponse( result.right ),
    { status: 200 } )
}
