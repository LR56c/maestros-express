import {
  NotificationConfigDAO
}                              from "@/modules/notification_config/domain/notification_config_dao"
import type { Either }         from "fp-ts/Either"
import { isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  NotificationConfig
}                              from "@/modules/notification_config/domain/notification_config"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"
import type {
  NotificationConfigDTO
}                              from "@/modules/notification_config/application/notification_config_dto"
import {
  ensureNotificationConfigExist
}                              from "@/modules/notification_config/utils/ensure_notification_config_exist"
import {
  containError
}                              from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
}                              from "@/modules/shared/domain/exceptions/data_not_found_exception"

export class AddNotificationConfig {
  constructor( private readonly dao: NotificationConfigDAO ) {
  }

  async execute( dto: NotificationConfigDTO ): Promise<Either<BaseException[], boolean>> {

    const exist = await ensureNotificationConfigExist(this.dao, dto.id)

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
      return left( exist.left )
    }

    const notificationConfig = NotificationConfig.create(
      dto.id,
      dto.user_id,
      dto.device_data as Record<string, any>,
      dto.device_token,
      dto.notification_source
    )

    if ( notificationConfig instanceof Errors ) {
      return left( notificationConfig.values )
    }

    const result = await this.dao.add( notificationConfig )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}
