import {
  ValidInteger
}                      from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                      from "@/modules/shared/domain/value_objects/valid_string"
import type { Either } from "fp-ts/Either"
import {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"
import { UUID }        from "@/modules/shared/domain/value_objects/uuid"
import {
  WorkerSchedule
}                      from "@/modules/worker_schedule/domain/worker_schedule"

export abstract class WorkerScheduleDAO {
  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], WorkerSchedule[]>>
  abstract upsert( workerId : UUID, schedules: WorkerSchedule[] ): Promise<Either<BaseException, boolean>>
  abstract add( schedule: WorkerSchedule ): Promise<Either<BaseException, boolean>>
  abstract update( schedule: WorkerSchedule ): Promise<Either<BaseException, boolean>>
  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>
}
