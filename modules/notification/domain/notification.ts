import { ValidDate }                 from "../../shared/domain/value_objects/valid_date"
import {
  Errors
}                                    from "../../shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import {
  InvalidDateException
}                                    from "../../shared/domain/exceptions/invalid_date_exception"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import {
  UUID
}                                    from "../../shared/domain/value_objects/uuid"
import {
  ValidString
}                                    from "../../shared/domain/value_objects/valid_string"

export class Notification {
  private constructor(
    readonly id: UUID,
    readonly userId: ValidString,
    readonly data: Record<string, any>,
    readonly createdAt: ValidDate,
    readonly viewedAt ?: ValidDate
  )
  {
  }

  static from(
    id: UUID,
    userId: ValidString,
    data: Record<string, any>,
    createdAt: ValidDate,
    viewedAt ?: ValidDate
  ): Notification
  {
    return new Notification( id, userId, data, createdAt, viewedAt )
  }

  static create(
    id: string,
    userId: string,
    data: Record<string, any>
  ): Notification | Errors {
    return Notification.fromPrimitives( id, userId, data,
      ValidDate.nowUTC(),
      null )
  }

  static fromPrimitivesThrow(
    id: string,
    userId: string,
    data: Record<string, any>,
    createdAt: Date,
    viewedAt ?: Date
  ): Notification {
    return new Notification(
      UUID.from( id ),
      ValidString.from( userId ),
      data,
      ValidDate.from( createdAt ),
      viewedAt ? ValidDate.from( viewedAt ) : undefined
    )
  }

  static fromPrimitives(
    id: string,
    userId: string,
    data: Record<string, any>,
    createdAt: Date | string,
    viewedAt: Date | string | null
  ): Notification | Errors {
    const errors = []

    const vid = wrapType(
      () => UUID.from( id ) )

    if ( vid instanceof BaseException ) {
      errors.push( vid )
    }

    const vuserId = wrapType(
      () => ValidString.from( userId ) )

    if ( vuserId instanceof BaseException ) {
      errors.push( vuserId )
    }

    const vviewedAt = wrapTypeDefault(
      undefined,
      ( value ) => ValidDate.from( value ),
      viewedAt )

    if ( vviewedAt instanceof BaseException ) {
      errors.push( vviewedAt )
    }

    const vcreatedAt = wrapType<ValidDate, InvalidDateException>(
      () => ValidDate.from( createdAt ) )

    if ( vcreatedAt instanceof BaseException ) {
      errors.push( vcreatedAt )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Notification(
      vid as UUID,
      vuserId as UUID,
      data,
      vcreatedAt as ValidDate,
      vviewedAt as ValidDate | undefined
    )

  }
}
