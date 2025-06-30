import {
  WorkerEmbeddingRepository
} from "@/modules/worker_embedding/domain/worker_embedding_repository"

import {
  WorkerEmbedding
}                                      from "@/modules/worker_embedding/domain/worker_embedding"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                                      from "@/modules/shared/domain/value_objects/valid_string"
import {
  InfrastructureException
}                                      from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  WorkerEmbeddingAI
}                                      from "@/modules/worker_embedding/domain/worker_embedding_ai"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import { SupabaseClient }              from "@supabase/supabase-js"
import {
  Position
}                                      from "@/modules/shared/domain/value_objects/position"

export class SupabaseWorkerEmbeddingData
  implements WorkerEmbeddingRepository {
  constructor(
    private readonly ai: WorkerEmbeddingAI,
    private readonly client: SupabaseClient
  )
  {
  }

  async getById( embedId: UUID ): Promise<Either<BaseException[], WorkerEmbedding>> {
    return left( [new InfrastructureException()] )
  }

  async upsert( embed: WorkerEmbedding ): Promise<Either<BaseException, boolean>> {
    return left( new InfrastructureException() )
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    return left( new InfrastructureException() )
  }

  async search( rawContent: ValidString, targetLocation: Position,
    radius: ValidInteger,
    limit?: ValidInteger ): Promise<Either<BaseException[], WorkerEmbedding[]>> {
    const vector = await this.ai.generateText( rawContent )

    if ( isLeft( vector ) ) {
      return left( [vector.left] )
    }

    const { data, error } = await this.client.rpc( "match_worker_vector", {
      query_embedding     : vector.right,
      match_threshold     : 0.55,
      match_count         : limit?.value ?? 5,
      target_location     : targetLocation.toPoint(),
      search_radius_meters: radius.value
    } )

    if ( error ) {
      return left( [new InfrastructureException()] )
    }

    const workerEmbeddings: WorkerEmbedding[] = []
    for ( const json of data ) {
      const mapped = WorkerEmbedding.fromPrimitives(
        json.id,
        json.worker_id,
        json.content,
        `(${ json.latitude },${ json.longitude })`,
        json.type.toUpperCase(),
        json.created_at
      )
      if ( mapped instanceof Errors ) {
        return left( mapped.values )
      }
      workerEmbeddings.push( mapped )
    }
    return right( workerEmbeddings )
  }
}