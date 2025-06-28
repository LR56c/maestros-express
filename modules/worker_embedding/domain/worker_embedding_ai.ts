import { Either } from "fp-ts/Either"
import {
  BaseException
}                 from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
} from "@/modules/shared/domain/value_objects/valid_integer"
import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"
import {
  WorkerEmbedding
} from "@/modules/worker_embedding/domain/worker_embedding"

export abstract class WorkerEmbeddingAI {
  abstract generate( rawContent : ValidString ): Promise<Either<BaseException, number[]>>
  abstract search( rawContent : ValidString, limit?: ValidInteger): Promise<Either<BaseException[], WorkerEmbedding[]>>
}
