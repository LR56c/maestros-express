import { StoryDAO }            from "@/modules/story/domain/story_dao"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import { PrismaClient }        from "@/lib/generated/prisma"
import { Either, left, right } from "fp-ts/Either"
import { UUID }                from "@/modules/shared/domain/value_objects/uuid"
import { Story }               from "@/modules/story/domain/story"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import { Errors }              from "@/modules/shared/domain/exceptions/errors"
import {
  StoryDocument
}                              from "@/modules/story/modules/story_document/domain/story_document"

export class PrismaStoryData implements StoryDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( workerId: UUID,
    story: Story ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.story.create( {
          data: {
            id         : story.id.value,
            workerId   : workerId.value,
            name       : story.name.value,
            description: story.description.value,
            createdAt  : story.createdAt.toString(),
            updatedAt  : story.updatedAt?.toString()
          }
        } ),
        this.db.storyDocument.createMany( {
          data: story.documents.map( doc => (
            {
              id       : doc.id.value,
              storyId  : story.id.value,
              url      : doc.url.value,
              type     : doc.type.value,
              createdAt: doc.createdAt.toString()
            }
          ) )
        } )
      ] )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async getById( id: UUID ): Promise<Either<BaseException[], Story>> {
    try {
      const response = await this.db.story.findUniqueOrThrow( {
        where: {
          id: id.value
        },
        include: {
          StoryDocument: true
        }
      } )

      const documents: StoryDocument[] = []
      // for ( const doc of response.StoryDocument ) {
      //   const document = StoryDocument.fromPrimitives(
      //     doc.id,
      //     response.id,
      //     doc.url,
      //     doc.type,
      //     doc.createdAt
      //   )
      //
      //   if ( document instanceof Errors ) {
      //     return left( document.values )
      //   }
      //
      //   documents.push( document )
      // }

      const story = Story.fromPrimitives(
        response.id,
        response.workerId,
        response.name,
        response.description,
        documents,
        response.createdAt,
        response.updatedAt ? response.updatedAt : undefined
      )

      if ( story instanceof Errors ) {
        return left( story.values )
      }

      return right( story )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async getByWorker( workerId: UUID ): Promise<Either<BaseException[], Story[]>> {
    try {
      const response = await this.db.story.findMany( {
        where  : {
          workerId: workerId.value
        },
        include: {
          StoryDocument: true
        }
      } )

      const stories: Story[] = []
      for ( const story of response ) {
        const documents: StoryDocument[] = []
        // for ( const doc of story.StoryDocument ) {
        //   const document = StoryDocument.fromPrimitives(
        //     doc.id,
        //     story.id,
        //     doc.url,
        //     doc.type,
        //     doc.createdAt
        //   )
        //
        //   if ( document instanceof Errors ) {
        //     return left( document.values )
        //   }
        //
        //   documents.push( document )
        // }

        const newStory = Story.fromPrimitives(
          story.id,
          story.workerId,
          story.name,
          story.description,
          documents,
          story.createdAt,
          story.updatedAt ? story.updatedAt : undefined
        )

        if ( newStory instanceof Errors ) {
          return left( newStory.values )
        }

        stories.push( newStory )
      }
      return right( stories )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.story.delete( {
          where: {
            id: id.value
          }
        } ),
        this.db.storyDocument.deleteMany( {
          where: {
            storyId: id.value
          }
        } )
      ] )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async update( workerId: UUID,
    story: Story ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.story.update( {
          where: {
            id: story.id.value
          },
          data : {
            name       : story.name.value,
            description: story.description.value,
            updatedAt  : story.updatedAt?.toString()
          }
        } ),
        this.db.storyDocument.deleteMany( {
          where: {
            storyId: story.id.value
          }
        } ),
        this.db.storyDocument.createMany( {
          data: story.documents.map( doc => (
            {
              id       : doc.id.value,
              storyId  : story.id.value,
              url      : doc.url.value,
              type     : doc.type.value,
              createdAt: doc.createdAt.toString()
            }
          ) )
        } )
      ] )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }
}