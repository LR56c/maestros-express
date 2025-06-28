import { PaymentDAO } from "@/modules/payment/domain/payment_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import { Payment } from "@/modules/payment/domain/payment"
import {
  ValidInteger
} from "@/modules/shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  WorkerEmbeddingRepository
}                                      from "@/modules/worker_embedding/domain/worker_embedding_repository"
import {
  WorkerEmbedding
} from "@/modules/worker_embedding/domain/worker_embedding"
import { wrapType } from "@/modules/shared/utils/wrap_type"
import { UUID } from "@/modules/shared/domain/value_objects/uuid"

export const ensureWorkerEmbeddingExist = async ( repo: WorkerEmbeddingRepository,
  embedId: string ): Promise<Either<BaseException[], WorkerEmbedding>> => {

  const vEmbedId = wrapType(()=>UUID.from(embedId))

  if ( vEmbedId instanceof  BaseException) {
    return left([vEmbedId])
  }

  const embed = await repo.getById(vEmbedId)

  if ( isLeft(embed) ) {
    return left(embed.left)
  }

  if ( embed.right.id.value !== embedId ) {
    return left( [new DataNotFoundException()] )
  }

  return right(embed.right)
}