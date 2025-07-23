import {
  WorkerScheduleDAO
}                                      from "@/modules/worker_schedule/domain/worker_schedule_dao"
import {
  WorkerSchedule
}                                      from "@/modules/worker_schedule/domain/worker_schedule"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  WorkerScheduleDTO
}                                      from "@/modules/worker_schedule/application/worker_schedule_dto"
import {
  ensureWorkerScheduleExist
}                                      from "@/modules/worker_schedule/utils/ensure_worker_schedule_exist"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"

export class UpdateWorkerSchedule {
  constructor( private readonly dao: WorkerScheduleDAO ) {
  }

  async execute( schedule: WorkerScheduleDTO ): Promise<Either<BaseException[], WorkerSchedule>>{
    const existResult = await ensureWorkerScheduleExist(this.dao, schedule.id )

    if ( isLeft(existResult) ) {
      return left( existResult.left )
    }

    const oldSchedule = existResult.right

    const updatedSchedule = WorkerSchedule.fromPrimitives(
      oldSchedule.id.toString(),
      oldSchedule.workerId.toString(),
      schedule.week_day,
      schedule.status,
      schedule.start_date,
      schedule.end_date,
      oldSchedule.createdAt.toString(),
      schedule.recurrent_start_date,
      schedule.recurrent_end_date
    )

    if ( updatedSchedule instanceof Errors ) {
      return left(updatedSchedule.values)
    }

    const result = await this.dao.update(updatedSchedule)

    if ( isLeft(result) ) {
      return left([result.left])
    }

    return right(updatedSchedule)
  }

}