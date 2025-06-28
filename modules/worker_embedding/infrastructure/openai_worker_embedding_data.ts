import {
  WorkerEmbeddingAI
}                              from "@/modules/worker_embedding/domain/worker_embedding_ai"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import { Either, left, right } from "fp-ts/Either"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import OpenAI                  from "openai"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"

export class OpenaiWorkerEmbeddingData implements WorkerEmbeddingAI {
  constructor(
    private readonly ai: OpenAI,
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
}