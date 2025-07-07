"use server"

import { NextRequest, NextResponse } from "next/server"
import prisma                        from "@/lib/prisma"
import {
  parseData
}                                    from "@/modules/shared/application/parse_handlers"
import { isLeft }                    from "fp-ts/Either"
import { z }                         from "zod"
import {
  PrismaStoryData
}                                    from "@/modules/story/infrastructure/persistance/prisma_story_data"
import {
  AddStory
}                                    from "@/modules/story/application/add_story"
import {
  RemoveStory
}                                    from "@/modules/story/application/remove_story"
import {
  UpdateStory
}                                    from "@/modules/story/application/update_story"
import {
  GetStoryByWorker
}                                    from "@/modules/story/application/get_story_by_worker"
import {
  storySchema
}                                    from "@/modules/story/application/story_dto"
import {
  StoryMapper
}                                    from "@/modules/story/application/story_mapper"
import {
  GetStoryById
}                                    from "@/modules/story/application/get_story_by_id"

const dao    = new PrismaStoryData( prisma )
const add    = new AddStory( dao )
const remove = new RemoveStory( dao )
const update = new UpdateStory( dao )
const getStories = new GetStoryByWorker( dao )
export async function getStory(){
  return new GetStoryById(dao)
}
export async function POST( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( storySchema.extend( {
    worker_id: z.string()
  } ), body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const { worker_id, ...rest } = data.right

  const result = await add.execute( worker_id, rest )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( StoryMapper.toDTO( result.right ),
    { status: 201 } )
}

export async function GET( request: NextRequest ) {
  const { searchParams } = new URL( request.url )
  const id               = searchParams.get( "id" )

  const result = await getStories.execute( id ?? "" )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( result.right.map( StoryMapper.toDTO ),
    { status: 200 } )
}

export async function PUT( request: NextRequest ) {
  const body = await request.json()
  const data = parseData( storySchema, body )

  if ( isLeft( data ) ) {
    return NextResponse.json( { error: data.left.message }, { status: 400 } )
  }

  const result = await update.execute( data.right )

  if ( isLeft( result ) ) {
    return NextResponse.json( { status: 500 } )
  }

  return NextResponse.json( StoryMapper.toDTO( result.right ),
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