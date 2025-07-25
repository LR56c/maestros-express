import { StoryDAO }                    from "@/modules/story/domain/story_dao"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"
import { Story }                       from "@/modules/story/domain/story"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  StoryDTO
}                                      from "@/modules/story/application/story_dto"
import {
  GetStoryByWorker
}                                      from "@/modules/story/application/get_story_by_worker"
import {
  StoryDocument
}                                      from "@/modules/story/modules/story_document/domain/story_document"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import { wrapType }                    from "@/modules/shared/utils/wrap_type"
import {
  StoryDocumentDTO
}                                      from "@/modules/story/modules/story_document/application/story_document_dto"

export class UpsertStories {
  constructor(
    private readonly dao: StoryDAO,
    private readonly getStories: GetStoryByWorker
  )
  {
  }

  private async ensureDocuments( storyId: string,
    oldDocuments: StoryDocument[],
    newDocuments: StoryDocumentDTO[] ): Promise<Either<BaseException[], StoryDocument[]>> {
    const existMap = new Map<string, StoryDocument>(
      oldDocuments.map( d => [d.id.toString(), d] ) )

    const result: StoryDocument[] = []
    for ( const document of newDocuments ) {
      const documentExist = existMap.get( document.id.toString() )
      if ( documentExist ) {
        const updatedDocument = StoryDocument.fromPrimitives(
          document.id.toString(),
          storyId,
          document.url,
          document.name,
          document.type,
          documentExist.createdAt.toString()
        )

        if ( updatedDocument instanceof Errors ) {
          return left( updatedDocument.values )
        }

        result.push( updatedDocument )
      }
      else {
        const newDocument = StoryDocument.create(
          document.id.toString(),
          storyId,
          document.url,
          document.name,
          document.type
        )

        if ( newDocument instanceof Errors ) {
          return left( newDocument.values )
        }

        result.push( newDocument )
      }
    }
    return right( result )
  }

  private async ensureStories( workerId: string,
    stories: StoryDTO[] ): Promise<Either<BaseException[], { updated: Story[], created: Story[] }>> {
    const exist = await this.getStories.execute( workerId )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const existMap = new Map<string, Story>(
      exist.right.map( s => [s.id.toString(), s] ) )
    const updated: Story[] = []
    const created: Story[] = []

    for ( const story of stories ) {
      const storyExist = existMap.get( story.id.toString() )
      const documents  = await this.ensureDocuments(
        story.id.toString(),
        storyExist?.documents ?? [],
        story.documents
      )

      if ( isLeft( documents ) ) {
        return left( documents.left )
      }

      if ( storyExist ) {
        const updatedStory = Story.fromPrimitives(
          story.id.toString(),
          workerId,
          story.name,
          story.description,
          documents.right,
          storyExist.createdAt.toString(),
          storyExist.updatedAt?.toString()
        )
        if ( updatedStory instanceof Errors ) {
          return left( updatedStory.values )
        }
        updated.push( updatedStory )
      }
      else {
        const newStory = Story.create(
          story.id.toString(),
          workerId,
          story.name,
          story.description,
          documents.right
        )
        if ( newStory instanceof Errors ) {
          return left( newStory.values )
        }
        created.push( newStory )
      }
    }
    return right( { updated: [...updated, ...created], created } )
  }

  async execute( workerId: string,
    stories: StoryDTO[] ): Promise<Either<BaseException[], { updated: Story[], created: Story[] }>> {

    const wId = wrapType( () => UUID.from( workerId ) )

    if ( wId instanceof BaseException ) {
      return left( [wId] )
    }

    const storiesResult = await this.ensureStories( wId.toString(), stories )
    if ( isLeft( storiesResult ) ) {
      return left( storiesResult.left )
    }

    const result = await this.dao.upsert( wId, storiesResult.right.updated )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( storiesResult.right )
  }
}