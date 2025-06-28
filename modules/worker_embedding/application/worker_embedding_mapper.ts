import {
  WorkerEmbedding
}                   from "@/modules/worker_embedding/domain/worker_embedding"
import {
  Errors
}                   from "@/modules/shared/domain/exceptions/errors"
import { wrapType } from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                   from "@/modules/shared/domain/exceptions/base_exception"
import {
  UUID
}                   from "@/modules/shared/domain/value_objects/uuid"
import {
  WorkerEmbeddingType
}                   from "@/modules/worker_embedding/domain/worker_embedding_type"
import {
  WorkerEmbeddingResponse
}                   from "@/modules/worker_embedding/application/worker_embedding_response"

export class WorkerEmbeddingMapper {
  static toDTO( embed: WorkerEmbedding ): WorkerEmbeddingResponse {
    return {
      id  : embed.id.value,
      type  : embed.type.value,
      worker_id  : embed.workerId.value,
    }
  }

  static toJSON( dto: WorkerEmbeddingResponse ): Record<string, any> {
    return {
      id: dto.id,
      type: dto.type,
      worker_id: dto.worker_id,
    }
  }

  static fromJSON( json: Record<string, any> ): WorkerEmbeddingResponse | Errors {
    const errors = []
    const vId    = wrapType( () => UUID.from( json.id ) )

    if ( vId instanceof BaseException ) {
      errors.push( vId )
    }

    const type = wrapType( () => WorkerEmbeddingType.from( json.type ) )

    if ( type instanceof BaseException ) {
      errors.push( type )
    }

    const vWorkerId = wrapType( () => UUID.from( json.worker_id ) )

    if ( vWorkerId instanceof BaseException ) {
      errors.push( vWorkerId )
    }

    if ( errors.length ) {
      return new Errors( errors )
    }

    return {
      id: (vId as UUID).value,
      type: (type as WorkerEmbeddingType).value,
      worker_id: (vWorkerId as UUID).value,
    }
  }

  static toDomain( json: Record<string, any> ): WorkerEmbedding | Errors {

    const type = wrapType( () => WorkerEmbeddingType.from( json.data.type ) )

    if ( type instanceof BaseException ) {
      return new Errors( [type] )
    }

    return WorkerEmbedding.fromPrimitives(
      json.id,
      json.worker_id,
      json.content,
      json.position,
      type.value,
      json.created_at
    )
  }
}