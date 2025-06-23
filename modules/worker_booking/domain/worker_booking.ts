import { UUID }      from "@/modules/shared/domain/value_objects/uuid"
import { ValidDate } from "@/modules/shared/domain/value_objects/valid_date"
import {
  WorkingBookingStatus
} from "@/modules/worker_booking/domain/worker_booking_status"
import { Errors }    from "@/modules/shared/domain/exceptions/errors"
import { wrapType }  from "@/modules/shared/utils/wrap_type"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"

export class WorkerBooking {
  private constructor(
    readonly id: UUID,
    readonly workerId: UUID,
    readonly clientId: UUID,
    readonly status: WorkingBookingStatus,
    readonly date: ValidDate,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    workerId: string,
    clientId: string,
    status: string,
    date: Date | string
  ): WorkerBooking | Errors {
    return WorkerBooking.fromPrimitives(
      id, workerId, clientId, status, date, ValidDate.nowUTC()
    )
  }

  static fromPrimitives(
    id: string,
    workerId: string,
    clientId: string,
    status: string,
    date: Date | string,
    createdAt: Date | string
  ): WorkerBooking | Errors {
    const errors = []

    const idVO = wrapType( () => UUID.from( id ) )
    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const workerIdVO = wrapType( () => UUID.from( workerId ) )
    if ( workerIdVO instanceof BaseException ) {
      errors.push( workerIdVO )
    }

    const clientIdVO = wrapType( () => UUID.from( clientId ) )
    if ( clientIdVO instanceof BaseException ) {
      errors.push( clientIdVO )
    }

    const statusVO = wrapType( () => WorkingBookingStatus.from( status ) )
    if ( statusVO instanceof BaseException ) {
      errors.push( statusVO )
    }

    const dateVO = wrapType( () => ValidDate.from( date ) )
    if ( dateVO instanceof BaseException ) {
      errors.push( dateVO )
    }

    const createdAtVO = wrapType( () => ValidDate.from( createdAt ) )
    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new WorkerBooking(
      idVO as UUID,
      workerIdVO as UUID,
      clientIdVO as UUID,
      statusVO as WorkingBookingStatus,
      dateVO as ValidDate,
      createdAtVO as ValidDate
    )
  }

  static fromPrimitivesThrow(
    id: string,
    workerId: string,
    clientId: string,
    status: string,
    date: Date | string,
    createdAt: Date | string
  ): WorkerBooking {
    return new WorkerBooking(
      UUID.from( id ),
      UUID.from( workerId ),
      UUID.from( clientId ),
      WorkingBookingStatus.from( status ),
      ValidDate.from( date ),
      ValidDate.from( createdAt )
    )
  }

}