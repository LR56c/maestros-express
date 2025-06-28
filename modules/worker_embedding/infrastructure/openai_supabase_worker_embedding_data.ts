import {
  WorkerEmbeddingAI
}                                      from "@/modules/worker_embedding/domain/worker_embedding_ai"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  InfrastructureException
}                                      from "@/modules/shared/domain/exceptions/infrastructure_exception"
import OpenAI                          from "openai"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"
import { SupabaseClient }              from "@supabase/supabase-js"
import {
  ValidString
}                                      from "@/modules/shared/domain/value_objects/valid_string"
import {
  WorkerEmbedding
}                                      from "@/modules/worker_embedding/domain/worker_embedding"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"

export class OpenaiSupabaseWorkerEmbeddingData implements WorkerEmbeddingAI {
  constructor(
    private readonly client: SupabaseClient,
    private readonly ai: OpenAI
  )
  {
  }

  async generate( rawContent: ValidString ): Promise<Either<BaseException, number[]>> {
    try {
      const generateEmbedding = await this.ai.embeddings.create( {
        model: "text-embedding-3-small",
        input: rawContent.value
      } )
      return right( generateEmbedding.data[0].embedding )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async search( rawContent: ValidString,
    limit?: ValidInteger ): Promise<Either<BaseException[], WorkerEmbedding[]>> {
    const vector = await this.generate( rawContent )

    if ( isLeft( vector ) ) {
      return left( [vector.left] )
    }

    const { data, error } = await this.client.rpc( "match_worker_embedding", {
        query_embedding: vector.right,
        match_threshold: 0.55,
        match_count    : limit?.value ?? 5
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
        json.type.toUpperCase(),
        json.created_at,
      )
      if ( mapped instanceof Errors) {
        return left( mapped.values )
      }
      workerEmbeddings.push( mapped )
    }
    return right( workerEmbeddings )
  }
}