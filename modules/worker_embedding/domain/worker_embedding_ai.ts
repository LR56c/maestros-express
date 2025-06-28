import { Either } from "fp-ts/Either"
import {
  BaseException
}                 from "@/modules/shared/domain/exceptions/base_exception"
import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"

export abstract class WorkerEmbeddingAI {
  abstract generate( rawContent : ValidString ): Promise<Either<BaseException, number[]>>
  // abstract search( rawContent : ValidString, limit?: ValidInteger): Promise<Either<BaseException[], WorkerEmbedding[]>>
}
