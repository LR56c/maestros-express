import { UUID }     from "@/modules/shared/domain/value_objects/uuid"
import {
  ValidDate
}                   from "@/modules/shared/domain/value_objects/valid_date"
import {
  ValidString
}                   from "@/modules/shared/domain/value_objects/valid_string"
import {
  StoryDocumentType
}                   from "@/modules/story/modules/story_document/domain/story_document_type"
import { Errors }   from "@/modules/shared/domain/exceptions/errors"
import { wrapType } from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                   from "@/modules/shared/domain/exceptions/base_exception"

export class StoryDocument {
  private constructor(
    readonly id: UUID,
    readonly storyId: UUID,
    readonly url: ValidString,
    readonly name: ValidString,
    readonly type: StoryDocumentType,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    storyId: string,
    url: string,
    name: string,
    type: string
  ): StoryDocument  | Errors {
    return StoryDocument.fromPrimitives(
      id,
      storyId,
      url,
      name,
      type,
      ValidDate.nowUTC()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    storyId: string,
    url: string,
    name: string,
    type: string,
    createdAt: Date | string
  ): StoryDocument {
    return new StoryDocument(
      UUID.from( id ),
      UUID.from( storyId ),
      ValidString.from( url ),
      ValidString.from( name ),
      StoryDocumentType.from( type ),
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    storyId: string,
    url: string,
    name: string,
    type: string,
    createdAt: Date | string
  ): StoryDocument | Errors {
    const errors = []

    const idVO = wrapType(
      () => UUID.from( id ) )

    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const storyIdVO = wrapType(
      () => UUID.from( storyId ) )

    if ( storyIdVO instanceof BaseException ) {
      errors.push( storyIdVO )
    }

    const urlVO = wrapType(
      () => ValidString.from( url ) )

    if ( urlVO instanceof BaseException ) {
      errors.push( urlVO )
    }

    const nameVO = wrapType(
      () => ValidString.from( name ) )

    if ( nameVO instanceof BaseException ) {
      errors.push( nameVO )
    }

    const typeVO = wrapType(
      () => StoryDocumentType.from( type.toUpperCase() ) )

    if ( typeVO instanceof BaseException ) {
      errors.push( typeVO )
    }

    const createdAtVO = wrapType(
      () => ValidDate.from( createdAt ) )

    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new StoryDocument(
      idVO as UUID,
      storyIdVO as UUID,
      urlVO as ValidString,
      nameVO as ValidString,
      typeVO as StoryDocumentType,
      createdAtVO as ValidDate
    )
  }
}