import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import { Sector }                      from "@/modules/sector/domain/sector"
import {
  NotificationConfig
}                                      from "@/modules/notification_config/domain/notification_config"
import {
  NotificationConfigDAO
}                                      from "@/modules/notification_config/domain/notification_config_dao"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"

export const ensureNotificationConfigExist = async ( dao : NotificationConfigDAO, notificationConfigId: string) : Promise<Either<BaseException[], NotificationConfig>> => {
  const sector = await dao.search( {
    id: notificationConfigId
  }, ValidInteger.from( 1 ) )

  if ( isLeft( sector ) ) {
    return left( sector.left )
  }

  if ( sector.right.length > 0 && sector.right[0]!.id.value !== notificationConfigId ) {
    return left( [new DataNotFoundException()] )
  }

  return right( sector.right[0] )
}