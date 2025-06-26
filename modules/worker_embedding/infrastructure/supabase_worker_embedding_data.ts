import {
  WorkerEmbeddingAI
}                              from "@/modules/worker_embedding/domain/worker_embedding_ai"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  WorkerEmbedding
}                              from "@/modules/worker_embedding/domain/worker_embedding"
import { Either, left, right } from "fp-ts/Either"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import { pipeline }            from "@xenova/transformers"

export class SupabaseWorkerEmbeddingData implements WorkerEmbeddingAI {
  async generate( embed: WorkerEmbedding ): Promise<Either<BaseException, number[]>> {
    try {
      const generateEmbedding = await pipeline( "feature-extraction", "Supabase/gte-small" )
      const output            = await generateEmbedding( embed.content.value, { pooling: "mean", normalize: true } )
      return right( Array.from( output.data ) )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }
}