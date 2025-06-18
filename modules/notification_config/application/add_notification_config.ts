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
import {
  ValidInteger
}                              from "@/modules/shared/domain/value_objects/valid_integer"
import {
  DataAlreadyExistException
}                              from "@/modules/shared/domain/exceptions/data_already_exist_exception"
import type {
  NotificationConfigDTO
}                              from "@/modules/notification_config/application/notification_config_dto"

export class AddNotificationConfig {
  constructor( private readonly dao: NotificationConfigDAO ) {
  }

  private async ensureConfigExist( id: string ): Promise<Either<BaseException[], boolean>> {
    const existResult = await this.dao.search( {
      id: id
    }, ValidInteger.from( 1 ) )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    if ( existResult.right.length > 0 &&
      existResult.right[0]!.id.toString() === id )
    {
      return left( [new DataAlreadyExistException()] )
    }
    return right( true )
  }


  async execute( dto: NotificationConfigDTO ): Promise<Either<BaseException[], boolean>> {

    const notificationNotExist = await this.ensureConfigExist( dto.id )

    if ( isLeft( notificationNotExist ) ) {
      return left( notificationNotExist.left )
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
