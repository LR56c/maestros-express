import { UUID }                      from "@/modules/shared/domain/value_objects/uuid"
import {
  ValidDate
}                                    from "@/modules/shared/domain/value_objects/valid_date"
import {
  ValidString
}                                    from "@/modules/shared/domain/value_objects/valid_string"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType, wrapTypeDefault } from "@/modules/shared/utils/wrap_type"
import {
  Errors
}                                    from "@/modules/shared/domain/exceptions/errors"
import {
  StoryDocument
}                                    from "@/modules/story/modules/story_document/domain/story_document"

export class Story {
  private constructor(
    readonly id: UUID,
    readonly workerId: UUID,
    readonly name: ValidString,
    readonly description: ValidString,
    readonly documents: StoryDocument[],
    readonly createdAt: ValidDate,
    readonly updatedAt?: ValidDate,
  )
  {
  }


  static create(
    id: string,
    workerId: string,
    name: string,
    description: string,
    documents: StoryDocument[]
  ): Story | Errors {
    return Story.fromPrimitives(
      id,
      workerId,
      name,
      description,
      documents,
      ValidDate.nowUTC(),
      undefined
    )
  }

  static fromPrimitivesThrow(
    id: string,
    workerId: string,
    name: string,
    description: string,
    documents: StoryDocument[],
    createdAt: Date | string,
    updatedAt?: Date | string
  ): Story {
    return new Story(
      UUID.from( id ),
      UUID.from( workerId ),
      ValidString.from( name ),
      ValidString.from( description ),
      documents,
      ValidDate.from( createdAt ),
      updatedAt ? ValidDate.from( updatedAt ) : undefined
    )
  }

  static fromPrimitives(
    id: string,
    workerId: string,
    name: string,
    description: string,
    documents: StoryDocument[],
    createdAt: Date | string,
    updatedAt?: Date | string
  ): Story | Errors {
    const errors = []

    const idVO = wrapType(
      () => UUID.from( id ) )

    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const workerIdVO = wrapType(
      () => UUID.from( workerId ) )

    if ( workerIdVO instanceof BaseException ) {
      errors.push( workerIdVO )
    }

    const nameVO = wrapType(
      () => ValidString.from( name ) )

    if ( nameVO instanceof BaseException ) {
      errors.push( nameVO )
    }

    const descriptionVO = wrapType(
      () => ValidString.from( description ) )

    if ( descriptionVO instanceof BaseException ) {
      errors.push( descriptionVO )
    }

    const createdAtVO = wrapType( () => ValidDate.from( createdAt ) )

    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    const updatedAtVO = wrapTypeDefault(undefined, (value)=> ValidDate.from(value), updatedAt)

    if ( updatedAtVO instanceof BaseException ) {
      errors.push( updatedAtVO )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Story(
      idVO as UUID,
      workerIdVO as UUID,
      nameVO as ValidString,
      descriptionVO as ValidString,
      documents,
      createdAtVO as ValidDate,
      updatedAtVO as ValidDate | undefined
    )
  }
}