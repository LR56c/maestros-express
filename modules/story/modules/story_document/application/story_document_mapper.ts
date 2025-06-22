import {
  StoryDocument
} from "@/modules/story/modules/story_document/domain/story_document"
import {
  StoryDocumentDTO
} from "@/modules/story/modules/story_document/application/story_document_dto"
import { Errors } from "@/modules/shared/domain/exceptions/errors"
import {
  StoryDocumentType
} from "@/modules/story/modules/story_document/domain/story_document_type"
import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"
import { UUID } from "@/modules/shared/domain/value_objects/uuid"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType } from "@/modules/shared/utils/wrap_type"

export class StoryDocumentMapper {
  static toDTO( storyDocument : StoryDocument ): StoryDocumentDTO {
    return {
      id    : storyDocument.id.toString(),
      url: storyDocument.url.value,
      type: storyDocument.type.value,
    }
  }

  static toJSON( storyDocument: StoryDocumentDTO ): Record<string, any> {
    return {
      id    : storyDocument.id,
      url   : storyDocument.url,
      type  : storyDocument.type,
    }
  }

  static fromJSON( storyDocument: Record<string, any> ): StoryDocumentDTO | Errors {
    const errors = []
    const id = wrapType(
      () => UUID.from( storyDocument.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const url = wrapType(
      () => ValidString.from( storyDocument.url ) )

    if ( url instanceof BaseException ) {
      errors.push( url )
    }

    const type = wrapType(
      () => StoryDocumentType.from( storyDocument.type ) )

    if ( type instanceof BaseException ) {
      errors.push( type )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id: (id as UUID).toString(),
      url: (url as ValidString).value,
      type: (type as StoryDocumentType).value,
    }
  }

  static toDomain(json: Record<string, any>) : StoryDocument | Errors{
    return StoryDocument.fromPrimitives(
      json.id,
      json.story_id,
      json.url,
      json.type,
      json.created_at
    )
  }
}