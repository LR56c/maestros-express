import { ValidString }            from "../../shared/domain/value_objects/valid_string"
import {
  ValidDate
}                                 from "../../shared/domain/value_objects/valid_date"
import { NotificationSourceType } from "./notification_source_type"
import { Errors }                 from "../../shared/domain/exceptions/errors"
import { wrapType }               from "../../shared/utils/wrap_type"
import {
  BaseException
}                                 from "../../shared/domain/exceptions/base_exception"
import {
  UUID
}                                 from "@/modules/shared/domain/value_objects/uuid"
import {
  InvalidUUIDException
}                                 from "@/modules/shared/domain/exceptions/invalid_uuid_exception"

export class NotificationConfig {
  private constructor(
    readonly id: UUID,
    readonly userId: UUID,
    readonly deviceData: Record<string, any>,
    readonly deviceToken: ValidString,
    readonly notificationSource: NotificationSourceType,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    userId: string,
    data: Record<string, any>,
    deviceToken: string,
    notificationSource: string
  ): NotificationConfig | Errors {
    return NotificationConfig.fromPrimitives( id, userId, data, deviceToken,
      notificationSource, ValidDate.nowUTC() )
  }

  static fromPrimitivesThrow(
    id: string,
    userId: string,
    data: Record<string, any>,
    deviceToken: string,
    notificationSource: string,
    createdAt: Date
  ): NotificationConfig {
    return new NotificationConfig(
      UUID.from( id ),
      UUID.from( userId ),
      data,
      ValidString.from( deviceToken ),
      NotificationSourceType.from( notificationSource ),
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    userId: string,
    data: Record<string, any>,
    deviceToken: string,
    notificationSource: string,
    createdAt: Date | string
  ): NotificationConfig | Errors {
    const errors = []
    const idVO   = wrapType<UUID, InvalidUUIDException>(
      () => UUID.from( id ) )

    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const userIdVO = wrapType(
      () => UUID.from( userId ) )

    if ( userIdVO instanceof BaseException ) {
      errors.push( userIdVO )
    }

    const deviceTokenVO = wrapType( () => ValidString.from( deviceToken ) )

    if ( deviceTokenVO instanceof BaseException ) {
      errors.push( deviceTokenVO )
    }

    const notificationSourceVO = wrapType(
      () => NotificationSourceType.from( notificationSource ) )

    if ( notificationSourceVO instanceof BaseException ) {
      errors.push( notificationSourceVO )
    }

    const createdAtVO = wrapType( () => ValidDate.from( createdAt ) )

    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new NotificationConfig(
      idVO as UUID,
      userIdVO as UUID,
      data,
      deviceTokenVO as ValidString,
      notificationSourceVO as NotificationSourceType,
      createdAtVO as ValidDate
    )
  }
}
