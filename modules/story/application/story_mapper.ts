import { Story }       from "@/modules/story/domain/story"
import { StoryDTO }    from "@/modules/story/application/story_dto"
import {
  StoryDocumentMapper
}                      from "@/modules/story/modules/story_document/application/story_document_mapper"
import { Errors }      from "@/modules/shared/domain/exceptions/errors"
import {
  StoryDocument
}                      from "@/modules/story/modules/story_document/domain/story_document"
import { wrapType }    from "@/modules/shared/utils/wrap_type"
import { UUID }        from "@/modules/shared/domain/value_objects/uuid"
import {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"
import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"
import {
  StoryDocumentDTO
}                      from "@/modules/story/modules/story_document/application/story_document_dto"

export class StoryMapper {
  static toDTO( story: Story ): StoryDTO {
    return {
      id         : story.id.toString(),
      name       : story.name.value,
      description: story.description.value,
      documents  : story.documents.map( StoryDocumentMapper.toDTO )
    }
  }

  static toJSON( story: StoryDTO ): Record<string, any> {
    return {
      id         : story.id,
      name       : story.name,
      description: story.description,
      documents  : story.documents.map( StoryDocumentMapper.toJSON )
    }
  }

  static fromJSON( json: Record<string, any> ): StoryDTO | Errors {
    const errors = []

    const id = wrapType(
      () => UUID.from( json.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const name = wrapType(
      () => ValidString.from( json.name ) )

    if ( name instanceof BaseException ) {
      errors.push( name )
    }

    const description = wrapType(
      () => ValidString.from( json.description ) )

    if ( description instanceof BaseException ) {
      errors.push( description )
    }

    const documents: StoryDocumentDTO[] = []

    for ( const doc of json.documents ) {
      const docErrors = StoryDocumentMapper.fromJSON( doc )
      if ( docErrors instanceof Errors ) {
        return docErrors
      }
      documents.push( docErrors )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id         : (
        id as UUID
      ).toString(),
      name       : (
        name as ValidString
      ).value,
      description: (
        description as ValidString
      ).value,
      documents
    }
  }

  static toDomain( json: Record<string, any> ): Story | Errors {

    const docs: StoryDocument[] = []
    for ( const doc of json.documents ) {
      const docErrors = StoryDocumentMapper.toDomain( doc )
      if ( docErrors instanceof Errors ) {
        return docErrors
      }
      docs.push( docErrors )
    }

    return Story.fromPrimitives(
      json.id,
      json.worker_id,
      json.name,
      json.description,
      docs,
      json.created_at,
      json.updated_at
    )
  }
}