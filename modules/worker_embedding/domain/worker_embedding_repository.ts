import { UUID }   from "@/modules/shared/domain/value_objects/uuid"
import { Either } from "fp-ts/Either"
import {
  BaseException
}                 from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                 from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                 from "@/modules/shared/domain/value_objects/valid_string"
import {
  WorkerEmbedding
}                 from "@/modules/worker_embedding/domain/worker_embedding"

export abstract class WorkerEmbeddingRepository {
  abstract add( embed : WorkerEmbedding ): Promise<Either<BaseException, boolean>>

  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>

  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], WorkerEmbedding[]>>
}
