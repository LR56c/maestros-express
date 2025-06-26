import { UUID }      from "@/modules/shared/domain/value_objects/uuid"
import {
  WorkerEmbeddingType
}                    from "@/modules/worker_embedding/domain/worker_embedding_type"
import { ValidDate } from "@/modules/shared/domain/value_objects/valid_date"
import { Worker }    from "@/modules/worker/domain/worker"
import { Story }     from "@/modules/story/domain/story"
import { Errors }    from "@/modules/shared/domain/exceptions/errors"
import { wrapType }  from "@/modules/shared/utils/wrap_type"
import {
  InvalidUUIDException
}                    from "@/modules/shared/domain/exceptions/invalid_uuid_exception"
import {
  BaseException
}                    from "@/modules/shared/domain/exceptions/base_exception"
import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"

export class WorkerEmbedding {
  private constructor(
    readonly id: UUID,
    readonly content: ValidString,
    readonly type: WorkerEmbeddingType,
    readonly data: Worker | Story,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    content: string,
    type: string,
    data: Worker | Story
  ): WorkerEmbedding | Errors {
    return WorkerEmbedding.fromPrimitives(
      id, content,type, data, ValidDate.nowUTC()
    )
  }

  static fromPrimitives(
    id: string,
    content: string,
    type: string,
    data: Worker | Story,
    createdAt: Date | string
  ): WorkerEmbedding | Errors {
    const errors = []

    const idVO = wrapType<UUID, InvalidUUIDException>(
      () => UUID.from( id ) )

    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const contentVO = wrapType<ValidString, InvalidUUIDException>(
      () => ValidString.from( content ) )

    if ( contentVO instanceof BaseException ) {
      errors.push( contentVO )
    }

    const typeVO = wrapType(
      () => WorkerEmbeddingType.from( type ) )

    if ( typeVO instanceof BaseException ) {
      errors.push( typeVO )
    }

    const createdAtVO = wrapType( () => ValidDate.from( createdAt ) )

    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    if ( errors.length ) {
      return new Errors( errors )
    }

    return new WorkerEmbedding(
      idVO as UUID,
      contentVO as ValidString,
      typeVO as WorkerEmbeddingType,
      data,
      createdAtVO as ValidDate
    )
  }

  static fromPrimitivesThrow(
    id: string,
    content: string,
    type: string,
    data: Worker | Story,
    createdAt: Date
  ): WorkerEmbedding {
    return new WorkerEmbedding(
      UUID.from( id ),
      ValidString.from( content ),
      WorkerEmbeddingType.from( type ),
      data,
      ValidDate.from( createdAt )
    )
  }
}