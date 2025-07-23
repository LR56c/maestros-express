import { UUID }                      from "@/modules/shared/domain/value_objects/uuid"
import {
  ValidDate
}                                    from "@/modules/shared/domain/value_objects/valid_date"
import {
  ValidInteger
}                                    from "@/modules/shared/domain/value_objects/valid_integer"
import {
  WorkerScheduleStatus
}                                    from "@/modules/worker_schedule/domain/worker_schedule_status"
import {
  Errors
}                                    from "@/modules/shared/domain/exceptions/errors"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType, wrapTypeDefault } from "@/modules/shared/utils/wrap_type"

export class WorkerSchedule {
  private constructor(
    readonly id: UUID,
    readonly workerId: UUID,
    readonly weekDay: ValidInteger,
    readonly status: WorkerScheduleStatus,
    readonly startDate: ValidDate,
    readonly endDate: ValidDate,
    readonly createdAt: ValidDate,
    readonly recurrentStartDate?: ValidDate,
    readonly recurrentEndDate?: ValidDate
  )
  {
  }

  static create(
    id: string,
    workerId: string,
    weekDay: number,
    status: string,
    startDate: Date | string,
    endDate: Date | string,
    recurrentStartDate?: Date | string,
    recurrentEndDate?: Date | string
  ): WorkerSchedule | Errors {
    return WorkerSchedule.fromPrimitives(
      id, workerId, weekDay, status, startDate, endDate,
      ValidDate.nowUTC(), recurrentStartDate, recurrentEndDate
    )
  }

  static fromPrimitivesThrow(
    id: string,
    workerId: string,
    weekDay: number,
    status: string,
    startDate: Date | string,
    endDate: Date | string,
    createdAt: Date | string,
    recurrentStartDate?: Date | string,
    recurrentEndDate?: Date | string
  ): WorkerSchedule {
    return new WorkerSchedule(
      UUID.from( id ),
      UUID.from( workerId ),
      ValidInteger.from( weekDay ),
      WorkerScheduleStatus.from( status ),
      ValidDate.from( startDate ),
      ValidDate.from( endDate ),
      ValidDate.from( createdAt ),
      recurrentStartDate ? ValidDate.from( recurrentStartDate ) : undefined,
      recurrentEndDate ? ValidDate.from( recurrentEndDate ) : undefined
    )
  }

  static fromPrimitives(
    id: string,
    workerId: string,
    weekDay: number,
    status: string,
    startDate: Date | string,
    endDate: Date | string,
    createdAt: Date | string,
    recurrentStartDate: Date | string | undefined,
    recurrentEndDate: Date | string | undefined,
  ): WorkerSchedule | Errors {
    const errors = []

    const idVO = wrapType( () => UUID.from( id ) )
    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const workerIdVO = wrapType( () => UUID.from( workerId ) )
    if ( workerIdVO instanceof BaseException ) {
      errors.push( workerIdVO )
    }

    const weekDayVO = wrapType( () => ValidInteger.from( weekDay ) )
    if ( weekDayVO instanceof BaseException ) {
      errors.push( weekDayVO )
    }

    const statusVO = wrapType( () => WorkerScheduleStatus.from( status.toUpperCase() ) )
    if ( statusVO instanceof BaseException ) {
      errors.push( statusVO )
    }

    const startDateVO = wrapType( () => ValidDate.from( startDate ) )
    if ( startDateVO instanceof BaseException ) {
      errors.push( startDateVO )
    }

    const endDateVO = wrapType( () => ValidDate.from( endDate ) )
    if ( endDateVO instanceof BaseException ) {
      errors.push( endDateVO )
    }

    const createdAtVO = wrapType( () => ValidDate.from( createdAt ) )
    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    const recurrentStartDateVO = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), recurrentStartDate )

    if ( recurrentStartDateVO instanceof BaseException ) {
      errors.push( recurrentStartDateVO )
    }

    const recurrentEndDateVO = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), recurrentEndDate )

    if ( recurrentEndDateVO instanceof BaseException ) {
      errors.push( recurrentEndDateVO )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new WorkerSchedule(
      idVO as UUID,
      workerIdVO as UUID,
      weekDayVO as ValidInteger,
      statusVO as WorkerScheduleStatus,
      startDateVO as ValidDate,
      endDateVO as ValidDate,
      createdAtVO as ValidDate,
      recurrentStartDateVO ? (
        recurrentStartDateVO as ValidDate
      ) : undefined,
      recurrentEndDateVO ? (
        recurrentEndDateVO as ValidDate
      ) : undefined
    )
  }
}