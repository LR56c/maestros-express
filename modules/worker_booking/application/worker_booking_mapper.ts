import { WorkerBooking } from "@/modules/worker_booking/domain/worker_booking"
import {
  WorkerBookingDTO
}                        from "@/modules/worker_booking/application/worker_booking_dto"
import { Errors }        from "@/modules/shared/domain/exceptions/errors"
import { wrapType }      from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                        from "@/modules/shared/domain/exceptions/base_exception"
import {
  UUID
}                        from "@/modules/shared/domain/value_objects/uuid"
import {
  WorkingBookingStatus
}                        from "@/modules/worker_booking/domain/worker_booking_status"
import {
  ValidDate
}                        from "@/modules/shared/domain/value_objects/valid_date"

export class WorkerBookingMapper {
  static toDTO( book: WorkerBooking ): WorkerBookingDTO {
    return {
      id    : book.id.toString(),
      status: book.status.value,
      date  : book.date.toString()
    }
  }

  static toJSON( book: WorkerBookingDTO ): Record<string, any> {
    return {
      id    : book.id,
      status: book.status,
      date  : book.date
    }
  }

  static fromJSON( json: Record<string, any> ): WorkerBookingDTO | Errors {
    const errors = []

    const id = wrapType( () => UUID.from( json.id ) )
    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const status = wrapType( () => WorkingBookingStatus.from( json.status ) )
    if ( status instanceof BaseException ) {
      errors.push( status )
    }

    const date = wrapType( () => ValidDate.from( json.date ) )
    if ( date instanceof BaseException ) {
      errors.push( date )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id    : (
        id as UUID
      ).toString(),
      status: (
        status as WorkingBookingStatus
      ).value,
      date  : (
        date as ValidDate
      ).toString()
    }
  }

  static toDomain( json: Record<string, any> ): WorkerBooking | Errors {
    return WorkerBooking.fromPrimitives(
      json.id,
      json.worker_id,
      json.client_id,
      json.status,
      json.date,
      json.created_at
    )
  }
}