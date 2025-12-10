import { NotificationConfig }     from "../domain/notification_config"
import {
  Errors
}                                 from "../../shared/domain/exceptions/errors"
import { wrapType }               from "../../shared/utils/wrap_type"
import {
  BaseException
}                                 from "../../shared/domain/exceptions/base_exception"
import {
  ValidString
}                                 from "../../shared/domain/value_objects/valid_string"
import { NotificationSourceType } from "../domain/notification_source_type"
import type {
  NotificationConfigDTO
}                                 from "@/modules/notification_config/application/notification_config_dto"
import {
  UUID
}                                 from "@/modules/shared/domain/value_objects/uuid"

export class NotificationConfigMapper {
  static toDTO( notificationConfig: NotificationConfig ): NotificationConfigDTO {
    return {
      id                 : notificationConfig.id.toString(),
      user_id            : notificationConfig.userId.toString(),
      device_data        : notificationConfig.deviceData,
      device_token       : notificationConfig.deviceToken.value,
      notification_source: notificationConfig.notificationSource.value
    }
  }

  static toJSON( notificationConfig: NotificationConfigDTO ): Record<string, any> {
    return {
      id                 : notificationConfig.id,
      user_id            : notificationConfig.user_id,
      device_data        : notificationConfig.device_data,
      device_token       : notificationConfig.device_token,
      notification_source: notificationConfig.notification_source
    }
  }

  static fromJSON( json: Record<string, any> ): NotificationConfigDTO | Errors {
    const errors = []

    const id = wrapType( () => UUID.from( json.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const userId = wrapType( () => UUID.from( json.user_id ) )

    if ( userId instanceof BaseException ) {
      errors.push( userId )
    }

    const deviceToken = wrapType( () => ValidString.from( json.device_token ) )

    if ( deviceToken instanceof BaseException ) {
      errors.push( deviceToken )
    }

    const notificationSource = wrapType(
      () => NotificationSourceType.from( json.notification_source ) )

    if ( notificationSource instanceof BaseException ) {
      errors.push( notificationSource )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id                 : (
        id as UUID
      ).toString(),
      user_id            : (
        userId as UUID
      ).toString(),
      device_data        : json.device_data,
      device_token       : (
        deviceToken as ValidString
      ).value,
      notification_source: (
        notificationSource as NotificationSourceType
      ).value
    }
  }
}
