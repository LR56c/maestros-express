import {
  NotificationConfigDAO
}                                      from "@/modules/notification_config/domain/notification_config_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  NotificationConfigDTO
}                               from "@/modules/notification_config/application/notification_config_dto"
import {
  ensureNotificationConfigExist
}                               from "@/modules/notification_config/utils/ensure_notification_config_exist"
import {
  NotificationConfig
}                               from "@/modules/notification_config/domain/notification_config"
import { Errors }               from "@/modules/shared/domain/exceptions/errors"

export class UpdateNotificationConfig {
  constructor( private readonly dao: NotificationConfigDAO ) {
  }

  async execute( dto: NotificationConfigDTO ): Promise<Either<BaseException[], NotificationConfig>>{
    const existResult = await ensureNotificationConfigExist(this.dao, dto.id )

    if ( isLeft(existResult) ) {
      return left( existResult.left )
    }

    const newConfig = NotificationConfig.fromPrimitives(
      dto.id,
      dto.user_id,
      dto.device_data as Record<string, any>,
      dto.device_token,
      dto.notification_source,
      existResult.right.createdAt.toString()
    )

    if( newConfig instanceof Errors ) {
      return left( newConfig.values )
    }

    const result = await this.dao.update( newConfig )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right(newConfig)
  }

}