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
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  containError
}                                      from "@/modules/shared/utils/contain_error"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"

export class AddWorkerSchedule {
  constructor( private readonly dao: WorkerScheduleDAO ) {
  }

  async execute(
    workerId: string,
    dto: WorkerScheduleDTO ): Promise<Either<BaseException[], WorkerSchedule>> {
    const exist = await ensureWorkerScheduleExist( this.dao, dto.id )

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const newSchedule = WorkerSchedule.create(
      dto.id,
      workerId,
      dto.week_day,
      dto.status,
      dto.start_date,
      dto.end_date,
      dto.recurrent_start_date ?? undefined,
      dto.recurrent_end_date ?? undefined,
    )

    if ( newSchedule instanceof Errors ) {
      return left( newSchedule.values )
    }

    const result = await this.dao.add( newSchedule )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( newSchedule )
  }
}