import {
  WorkerScheduleDAO
}                                      from "@/modules/worker_schedule/domain/worker_schedule_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ensureWorkerScheduleExist
}                                      from "@/modules/worker_schedule/utils/ensure_worker_schedule_exist"

export class RemoveWorkerSchedule {
  constructor( private readonly dao: WorkerScheduleDAO ) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>>{
    const exist = await ensureWorkerScheduleExist(this.dao, id)

    if ( isLeft(exist) ) {
      return left(exist.left)
    }

    const result = await this.dao.remove(exist.right.id)

    if ( isLeft(result) ) {
      return left([result.left])
    }

    return right(true)
  }

}