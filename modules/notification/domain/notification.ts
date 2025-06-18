import { ValidBool }                 from "../../shared/domain/value_objects/valid_bool"
import {
  ValidDate
}                                    from "../../shared/domain/value_objects/valid_date"
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
}                                    from "@/modules/shared/domain/value_objects/uuid"
import {
  InvalidUUIDException
}                                    from "@/modules/shared/domain/exceptions/invalid_uuid_exception"

export class Notification {
  private constructor(
    readonly id: UUID,
    readonly userId: UUID,
    readonly data: Record<string, any>,
    // readonly title : ValidString,
    // readonly relevance : NotificationRelevance,
    // readonly notificationFrom : ValidString,
    // readonly contentFrom : ValidString,
    // readonly redirectUrl : ValidString,
    readonly isEnabled: ValidBool,
    readonly createdAt: ValidDate,
    readonly viewedAt ?: ValidDate
  )
  {
  }

  static from(
    id: UUID,
    userId: UUID,
    data: Record<string, any>,
    isEnabled: ValidBool,
    createdAt: ValidDate,
    viewedAt ?: ValidDate
  ): Notification
  {
    return new Notification( id, userId, data, isEnabled, createdAt, viewedAt )
  }

  static create(
    id: string,
    userId: string,
    data: Record<string, any>
  ): Notification | Errors {
    return Notification.fromPrimitives( id, userId, data, true,
      ValidDate.nowUTC(),
      null )
  }

  static fromPrimitivesThrow(
    id: string,
    userId: string,
    data: Record<string, any>,
    isEnabled: boolean,
    createdAt: Date,
    viewedAt ?: Date
  ): Notification {
    return new Notification(
      UUID.from( id ),
      UUID.from( userId ),
      data,
      ValidBool.from( isEnabled ),
      ValidDate.from( createdAt ),
      viewedAt ? ValidDate.from( viewedAt ) : undefined
    )
  }

  static fromPrimitives(
    id: string,
    userId: string,
    data: Record<string, any>,
    isEnabled: boolean,
    createdAt: Date | string,
    viewedAt: Date | string | null
  ): Notification | Errors {
    const errors = []

    const vid = wrapType<UUID, InvalidUUIDException>(
      () => UUID.from( id ) )

    if ( vid instanceof BaseException ) {
      errors.push( vid )
    }

    const vuserId = wrapType(
      () => UUID.from( userId ) )

    if ( vuserId instanceof BaseException ) {
      errors.push( vuserId )
    }

    const visEnabled = wrapType( () => ValidBool.from( isEnabled ) )

    if ( visEnabled instanceof BaseException ) {
      errors.push( visEnabled )
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
      visEnabled as ValidBool,
      vcreatedAt as ValidDate,
      vviewedAt as ValidDate | undefined
    )

  }
}
