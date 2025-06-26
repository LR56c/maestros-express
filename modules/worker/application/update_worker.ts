import { WorkerDAO }                   from "@/modules/worker/domain/worker_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                         from "@/modules/shared/domain/exceptions/base_exception"
import {
  ensureWorkerExist
} from "@/modules/worker/utils/ensure_worker_exist"
import {
  WorkerUpdateDTO
}                                      from "@/modules/worker/application/worker_update_dto"
import { Worker } from "@/modules/worker/domain/worker"
import { Errors } from "@/modules/shared/domain/exceptions/errors"
import { wrapTypeDefault } from "@/modules/shared/utils/wrap_type"
import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"
import { WorkerStatus } from "@/modules/worker/domain/worker_status"
import {
  ValidDecimal
} from "@/modules/shared/domain/value_objects/valid_decimal"
import {
  ValidBool
}                                      from "@/modules/shared/domain/value_objects/valid_bool"

export class UpdateWorker {
  constructor(
    private readonly dao: WorkerDAO,
  ) {
  }

  async execute( worker: WorkerUpdateDTO ): Promise<Either<BaseException[], Worker>> {
    const errors = []
    const exist = await ensureWorkerExist(this.dao, worker.user.user_id)

    if ( isLeft(exist) ) {
      return left(exist.left)
    }


    const oldWorker = exist.right
    const updatedDescription = wrapTypeDefault(oldWorker.description, (value)=>ValidString.from(value),worker.description)

    if ( updatedDescription instanceof BaseException) {
      errors.push(updatedDescription)
    }

    const updatedLocation = wrapTypeDefault(oldWorker.location, (value)=>ValidString.from(value),worker.location)

    if ( updatedLocation instanceof BaseException) {
      errors.push(updatedLocation)
    }

    const updatedStatus = wrapTypeDefault(oldWorker.status, (value)=>WorkerStatus.from(value),worker.status)

    if ( updatedStatus instanceof BaseException) {
      errors.push(updatedStatus)
    }

    const updatedReviewCount = wrapTypeDefault(oldWorker.reviewCount, (value)=>ValidDecimal.from(value),worker.review_count)

    if ( updatedReviewCount instanceof BaseException) {
      errors.push(updatedReviewCount)
    }

    const updatedReviewAverage = wrapTypeDefault(oldWorker.reviewAverage, (value)=>ValidDecimal.from(value),worker.review_average)

    if ( updatedReviewAverage instanceof BaseException) {
      errors.push(updatedReviewAverage)
    }

    const updatedVerified = wrapTypeDefault(undefined, (value)=>ValidBool.from(value),worker.verified)

    if ( updatedVerified instanceof BaseException ) {
      errors.push(updatedVerified)
    }

    if ( errors.length > 0 ) {
      return left(errors)
    }

    const updatedWorker = Worker.fromPrimitives(
      oldWorker.user,
      oldWorker.nationalIdentity,
      oldWorker.birthDate.value,
      (updatedReviewCount as ValidDecimal).value,
      (updatedReviewAverage as ValidDecimal).value,
      (updatedLocation as ValidString).value,
      (updatedStatus as WorkerStatus).value,
      oldWorker.specialities,
      oldWorker.taxes,
      oldWorker.createdAt.value,
      updatedVerified instanceof ValidBool ? new Date() : oldWorker.verifiedAt?.value,
      updatedDescription instanceof ValidString ? updatedDescription.value : undefined
    )

    if ( updatedWorker instanceof Errors ) {
      return left(updatedWorker.values)
    }

    const updated = await this.dao.update(updatedWorker)

    if ( isLeft(updated) ) {
      return left([updated.left])
    }

    return right( updatedWorker )
  }

}