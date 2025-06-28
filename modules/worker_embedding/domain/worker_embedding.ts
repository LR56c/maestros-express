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
    readonly workerId: UUID,
    readonly content: ValidString,
    readonly type: WorkerEmbeddingType,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    workerId: string,
    content: string,
    type: string,
  ): WorkerEmbedding | Errors {
    return WorkerEmbedding.fromPrimitives(
      id,workerId, content,type, ValidDate.nowUTC()
    )
  }

  static fromPrimitives(
    id: string,
    workerId: string,
    content: string,
    type: string,
    createdAt: Date | string
  ): WorkerEmbedding | Errors {
    const errors = []

    const idVO = wrapType<UUID, InvalidUUIDException>(
      () => UUID.from( id ) )

    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const workerIdVO = wrapType<UUID, InvalidUUIDException>(
      () => UUID.from( workerId ) )

    if ( workerIdVO instanceof BaseException ) {
      errors.push( workerIdVO )
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
      workerIdVO as UUID,
      contentVO as ValidString,
      typeVO as WorkerEmbeddingType,
      createdAtVO as ValidDate
    )
  }

  static fromPrimitivesThrow(
    id: string,
    workerId: string,
    content: string,
    type: string,
    createdAt: Date
  ): WorkerEmbedding {
    return new WorkerEmbedding(
      UUID.from( id ),
      UUID.from( workerId ),
      ValidString.from( content ),
      WorkerEmbeddingType.from( type ),
      ValidDate.from( createdAt )
    )
  }
}