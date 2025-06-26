import {
  WorkerEmbedding
}                       from "@/modules/worker_embedding/domain/worker_embedding"
import {
  WorkerEmbeddingDTO
}                       from "@/modules/worker_embedding/application/worker_embedding_dto"
import { WorkerMapper } from "@/modules/worker/application/worker_mapper"
import { StoryMapper }  from "@/modules/story/application/story_mapper"
import { Errors }       from "@/modules/shared/domain/exceptions/errors"
import { wrapType }     from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import { UUID }         from "@/modules/shared/domain/value_objects/uuid"
import {
  WorkerEmbeddingType
} from "@/modules/worker_embedding/domain/worker_embedding_type"
import { Worker }       from "@/modules/worker/domain/worker"
import { Story }        from "@/modules/story/domain/story"

export class WorkerEmbeddingMapper {
  static toDTO( embed: WorkerEmbedding ): WorkerEmbeddingDTO {
    let data: any
    if ( embed.type.value === "WORKER" ) {
      data = {
        ...embed.data,
        type: "WORKER"
      }
    }
    else {
      data = {
        ...embed.data,
        type: "STORY"
      }
    }
    return {
      id  : embed.id.value,
      data: data
    }
  }

  static toJSON( dto: WorkerEmbeddingDTO ): Record<string, any> {
    let data: any
    if ( dto.data.type === "WORKER" ) {
      data = WorkerMapper.toJSON( dto.data )
    }
    else {
      data = StoryMapper.toJSON( dto.data )
    }
    return {
      id: dto.id,
      data
    }
  }

  static fromJSON( json: Record<string, any> ): WorkerEmbeddingDTO | Errors {
    const errors = []
    const vId    = wrapType( () => UUID.from( json.id ) )

    if ( vId instanceof BaseException ) {
      errors.push( vId )
    }

    const data = json.data
    let embedData: any
    if ( data.type === "WORKER" ) {
      const mapped = WorkerMapper.fromJSON( data )

      if ( mapped instanceof Errors ) {
        errors.push( ...mapped.values )
      }
      else {
        embedData = mapped
      }
    }
    else {
      const mapped = StoryMapper.fromJSON( data )
      if ( mapped instanceof Errors ) {
        errors.push( ...mapped.values )
      }
      else {
        embedData = mapped
      }
    }

    if ( errors.length ) {
      return new Errors( errors )
    }

    return {
      id  : json.id,
      data: {
        type: data.type,
        ...embedData
      }
    }
  }

  static toDomain( json: Record<string, any> ): WorkerEmbedding | Errors {

    const type = wrapType(()=>WorkerEmbeddingType.from( json.data.type ))

    if ( type instanceof BaseException ) {
      return new Errors( [type] )
    }

    let data : Worker | Story

    if( type.value === "WORKER" ) {
      const worker = WorkerMapper.toDomain( json.data )
      if ( worker instanceof Errors ) {
        return worker
      }
      data = worker
    }
    else{
      const story = StoryMapper.toDomain( json.data )
      if ( story instanceof Errors ) {
        return story
      }
      data = story
    }

    return WorkerEmbedding.fromPrimitives(
      json.id,
      json.content,
      type as WorkerEmbeddingType,
      data,
      json.created_at
    )
  }
}