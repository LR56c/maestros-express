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
  StoryDocument
}                                      from "@/modules/story/modules/story_document/domain/story_document"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"
import { wrapType }                    from "@/modules/shared/utils/wrap_type"
import {
  containError
}                                      from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"

export class AddStory {
  constructor( private readonly dao: StoryDAO ) {
  }

  async execute( workerId: string,
    dto: StoryDTO ): Promise<Either<BaseException[], Story>> {
    const vWorkerId = wrapType( () => UUID.from( workerId ) )

    if ( vWorkerId instanceof BaseException ) {
      return left( [vWorkerId] )
    }

    const exist = await ensureStoryExist( this.dao, dto.id )

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const storyDocuments: StoryDocument[] = []

    for ( const el of dto.documents ) {
      const doc = StoryDocument.create(
        el.id,
        dto.id,
        el.url,
        el.name,
        el.type
      )

      if ( doc instanceof Errors ) {
        return left( doc.values )
      }
      storyDocuments.push( doc )
    }

    const story = Story.create(
      dto.id,
      vWorkerId.value,
      dto.name,
      dto.description,
      storyDocuments
    )

    if ( story instanceof Errors ) {
      return left( story.values )
    }


    const result = await this.dao.add( vWorkerId, story )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( story )
  }
}