import { Either } from "fp-ts/Either"
import {
  BaseException
}                 from "@/modules/shared/domain/exceptions/base_exception"
import {
  WorkerEmbedding
}                 from "@/modules/worker_embedding/domain/worker_embedding"

export abstract class WorkerEmbeddingAI {
  abstract generate( embed : WorkerEmbedding ): Promise<Either<BaseException, number[]>>
}
