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

export class UpdateWorker {
  constructor(
    private readonly dao: WorkerDAO,
  ) {
  }

  async execute( worker: WorkerUpdateDTO ): Promise<Either<BaseException[], Worker>> {
    const exist = await ensureWorkerExist(this.dao, worker.user.user_id)

    if ( isLeft(exist) ) {
      return left(exist.left)
    }

    const oldWorker = exist.right

    const updatedWorker = Worker.fromPrimitives(
      oldWorker.user,
      oldWorker.nationalIdentity,
      oldWorker.birthDate.value,
      worker.description,
      worker.review_count,
      worker.review_average,
      worker.location,
      worker.status,
      oldWorker.specialities,
      oldWorker.certificates,
      oldWorker.workZones,
      oldWorker.taxes,
      oldWorker.stories,
      oldWorker.bookings,
      oldWorker.schedule,
      oldWorker.packages,
      oldWorker.reviews,
      oldWorker.createdAt.value,
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