import {
  WorkerSchedule
}                                    from "@/modules/worker_schedule/domain/worker_schedule"
import {
  WorkerScheduleDTO
}                                    from "@/modules/worker_schedule/application/worker_schedule_dto"
import {
  Errors
}                                    from "@/modules/shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "@/modules/shared/utils/wrap_type"
import {
  UUID
}                                    from "@/modules/shared/domain/value_objects/uuid"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                                    from "@/modules/shared/domain/value_objects/valid_integer"
import {
  WorkerScheduleStatus
}                                    from "@/modules/worker_schedule/domain/worker_schedule_status"
import {
  ValidDate
}                                    from "@/modules/shared/domain/value_objects/valid_date"

export class WorkerScheduleMapper {
  static toDTO( workerSchedule: WorkerSchedule ): WorkerScheduleDTO {
    return {
      id                  : workerSchedule.id.toString(),
      week_day            : workerSchedule.weekDay.value,
      status              : workerSchedule.status.value,
      start_date          : workerSchedule.startDate.value,
      end_date            : workerSchedule.endDate.value,
      recurrent_start_date: workerSchedule.recurrentStartDate?.value,
      recurrent_end_date  : workerSchedule.recurrentEndDate?.value
    }
  }

  static toJSON( workerSchedule: WorkerScheduleDTO ): Record<string, any> {
    return {
      id                  : workerSchedule.id,
      week_day            : workerSchedule.week_day,
      status              : workerSchedule.status,
      start_date          : workerSchedule.start_date,
      end_date            : workerSchedule.end_date,
      recurrent_start_date: workerSchedule.recurrent_start_date,
      recurrent_end_date  : workerSchedule.recurrent_end_date
    }
  }

  static fromJSON( json: Record<string, any> ): WorkerScheduleDTO | Errors {
    const errors = []

    const id = wrapType(
      () => UUID.from( json.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const weekDay = wrapType(
      () => ValidInteger.from( json.week_day ) )

    if ( weekDay instanceof BaseException ) {
      errors.push( weekDay )
    }

    const status = wrapType(
      () => WorkerScheduleStatus.from( json.status ) )

    if ( status instanceof BaseException ) {
      errors.push( status )
    }

    const startDate = wrapType(
      () => ValidDate.from( json.start_date ) )

    if ( startDate instanceof BaseException ) {
      errors.push( startDate )
    }

    const endDate = wrapType(
      () => ValidDate.from( json.end_date ) )

    if ( endDate instanceof BaseException ) {
      errors.push( endDate )
    }

    const recurrentStartDate = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), json.recurrent_start_date )

    if ( recurrentStartDate instanceof BaseException ) {
      errors.push( recurrentStartDate )
    }

    const recurrentEndDate = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), json.recurrent_end_date )

    if ( recurrentEndDate instanceof BaseException ) {
      errors.push( recurrentEndDate )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id                  : (
        id as UUID
      ).toString(),
      week_day            : (
        weekDay as ValidInteger
      ).value,
      status              : (
        status as WorkerScheduleStatus
      ).value,
      start_date          : (
        startDate as ValidDate
      ).value,
      end_date            : (
        endDate as ValidDate
      ).value,
      recurrent_start_date: (
        recurrentStartDate as ValidDate | undefined
      )?.value,
      recurrent_end_date  : (
        recurrentEndDate as ValidDate | undefined
      )?.value
    }
  }

  static toDomain( json: Record<string, any> ): WorkerSchedule | Errors {
    return WorkerSchedule.fromPrimitives(
      json.id,
      json.worker_id,
      json.week_day,
      json.status,
      json.start_date,
      json.end_date,
      json.created_at,
      json.recurrent_start_date,
      json.recurrent_end_date
    )
  }
}