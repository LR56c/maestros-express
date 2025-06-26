import { StoryDAO }                    from "@/modules/story/domain/story_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  StoryDTO
}                                      from "@/modules/story/application/story_dto"
import {
  ensureStoryExist
}                                      from "@/modules/story/utils/ensure_story_exist"
import { Story }                       from "@/modules/story/domain/story"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  StoryDocument
}                                      from "@/modules/story/modules/story_document/domain/story_document"
import {
  StoryDocumentDTO
}                                      from "@/modules/story/modules/story_document/application/story_document_dto"

export class UpdateStory {
  constructor( private readonly dao: StoryDAO ) {
  }

  private async combineStoriesDocuments(
    storyId: string,
    oldDocuments: StoryDocument[],
    newDocuments: StoryDocumentDTO[]
  ): Promise<Either<BaseException[], StoryDocument[]>> {
    const combinedDocuments = new Map<string, StoryDocument>(
      oldDocuments.map( doc => [doc.id.toString(), doc] )
    )

    for ( const newDoc of newDocuments ) {
      const existingDocIndex = combinedDocuments.get(newDoc.id.toString() )

      if ( !existingDocIndex  ) {
        const newStoryDocument = StoryDocument.create(
          newDoc.id,
          storyId,
          newDoc.url,
          newDoc.type
        )

        if ( newStoryDocument instanceof Errors ) {
          return left( newStoryDocument.values )
        }

        combinedDocuments.set( newDoc.id.toString(), newStoryDocument )
      }
    }

    return right( Array.from(combinedDocuments.values()) )
  }

  async execute( dto: StoryDTO ): Promise<Either<BaseException[], Story>> {
    const exist = await ensureStoryExist( this.dao, dto.id )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const oldStory = exist.right

    const docs = await this.combineStoriesDocuments(
      oldStory.id.toString(),
      oldStory.documents,
      dto.documents
    )

    if ( isLeft( docs ) ) {
      return left( docs.left )
    }

    const updatedStory = Story.fromPrimitives(
      oldStory.id.toString(),
      oldStory.workerId.toString(),
      dto.name,
      dto.description,
      docs.right,
      oldStory.createdAt.value,
      oldStory.updatedAt?.value
    )

    if ( updatedStory instanceof Errors ) {
      return left( updatedStory.values )
    }

    const result = await this.dao.update( oldStory.workerId, updatedStory )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( updatedStory )
  }
}