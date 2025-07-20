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
import { Position } from "@/modules/shared/domain/value_objects/position"

export abstract class WorkerEmbeddingRepository {
  abstract upsert( embed : WorkerEmbedding ): Promise<Either<BaseException, boolean>>

  abstract remove( ids: UUID[] ): Promise<Either<BaseException, boolean>>

  abstract getById( embedId : UUID): Promise<Either<BaseException[], WorkerEmbedding[]>>

  abstract search( rawContent : ValidString, targetLocation : Position, radius : ValidInteger, limit?: ValidInteger ): Promise<Either<BaseException[], WorkerEmbedding[]>>
}
