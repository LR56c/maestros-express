import { ValidDate } from "../../shared/domain/value_objects/valid_date.js"
import { Errors }    from "../../shared/domain/exceptions/errors.js"
import { wrapType }  from "../../shared/utils/wrap_type.js"
import {
  InvalidDateException
}                    from "../../shared/domain/exceptions/invalid_date_exception.js"
import {
  BaseException
}                    from "../../shared/domain/exceptions/base_exception.js"
import { UUID }      from "../../shared/domain/value_objects/uuid.js"

export class NotificationContent {
  private constructor(
    readonly id: UUID,
    readonly data: Record<string, any>,
    readonly createdAt: ValidDate
  )
  {
  }

  static from(
    id: UUID,
    data: Record<string, any>,
    createdAt: ValidDate
  ): NotificationContent
  {
    return new NotificationContent( id, data, createdAt )
  }

  static create(
    id: string,
    data: Record<string, any>
  ): NotificationContent | Errors {
    return NotificationContent.fromPrimitives( id, data,
      ValidDate.nowUTC() )
  }

  static fromPrimitivesThrow(
    id: string,
    data: Record<string, any>,
    createdAt: Date
  ): NotificationContent {
    return new NotificationContent(
      UUID.from( id ),
      data,
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    data: Record<string, any>,
    createdAt: Date | string
  ): NotificationContent | Errors {
    const errors = []

    const vid = wrapType(
      () => UUID.from( id ) )

    if ( vid instanceof BaseException ) {
      errors.push( vid )
    }

    const vcreatedAt = wrapType<ValidDate, InvalidDateException>(
      () => ValidDate.from( createdAt ) )

    if ( vcreatedAt instanceof BaseException ) {
      errors.push( vcreatedAt )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new NotificationContent(
      vid as UUID,
      data,
      vcreatedAt as ValidDate
    )

  }
}
