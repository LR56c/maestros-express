import {
  WorkerSchedule
}                                      from "@/modules/worker_schedule/domain/worker_schedule"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  WorkerScheduleDAO
}                      from "@/modules/worker_schedule/domain/worker_schedule_dao"
import {
  WorkerScheduleDTO
}                      from "@/modules/worker_schedule/application/worker_schedule_dto"
import {
  SearchWorkerSchedule
} from "@/modules/worker_schedule/application/search_worker_schedule"
import { wrapType }             from "@/modules/shared/utils/wrap_type"
import {
  UUID
}                               from "@/modules/shared/domain/value_objects/uuid"
import { Errors } from "@/modules/shared/domain/exceptions/errors"

export class UpsertSchedules {
  constructor(
    private readonly dao: WorkerScheduleDAO,
    private readonly searchSchedule: SearchWorkerSchedule,
  ) {
  }

  async execute( workerId: string,
    schedules: WorkerScheduleDTO[] ): Promise<Either<BaseException[], WorkerSchedule[]>> {

    const wId = wrapType(()=>UUID.from(workerId))

    if ( wId instanceof BaseException ) {
      return left( [wId] )
    }

    const exist = await this.searchSchedule.execute( {
      worker_id: workerId,
    } )

    if ( isLeft(exist) ) {
      return left(exist.left)
    }

    const schedulesMap = new Map<string, WorkerSchedule>( exist.right.map( ( s ) => [s.id.toString(), s] ) )

    const upserted: WorkerSchedule[] = []

    for ( const schedule of schedules ) {
      const existingSchedule = schedulesMap.get( schedule.id.toString() )
      if ( existingSchedule ) {
        const updatedSchedule = WorkerSchedule.fromPrimitives(
          existingSchedule.id.toString(),
          workerId,
          schedule.week_day,
          schedule.status,
          schedule.start_date,
          schedule.end_date,
          existingSchedule.createdAt.toString(),
          schedule.recurrent_start_date,
          schedule.recurrent_end_date,
        )
        if ( updatedSchedule instanceof Errors ) {
          return left( updatedSchedule.values )
        }
        upserted.push( updatedSchedule )
      }
      else {
        const newSchedule = WorkerSchedule.create(
          schedule.id,
          workerId,
          schedule.week_day,
          schedule.status,
          schedule.start_date,
          schedule.end_date,
          schedule.recurrent_start_date,
          schedule.recurrent_end_date,
        )
        if ( newSchedule instanceof Errors ) {
          return left( newSchedule.values )
        }
        upserted.push( newSchedule )
      }
    }

    const result = await this.dao.upsert( wId, upserted )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right(upserted)
  }
}