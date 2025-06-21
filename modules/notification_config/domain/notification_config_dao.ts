import { NotificationConfig } from "./notification_config"
import {
  ValidInteger
}                             from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                             from "../../shared/domain/value_objects/valid_string"
import {
  BaseException
}                             from "@/modules/shared/domain/exceptions/base_exception"
import { type Either }        from "fp-ts/Either"
import { UUID }               from "@/modules/shared/domain/value_objects/uuid"

export abstract class NotificationConfigDAO {
  abstract add( notificationConfig: NotificationConfig ): Promise<Either<BaseException, boolean>>

  abstract update( notificationConfig: NotificationConfig ): Promise<Either<BaseException, boolean>>

  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>

  abstract search( query: Record<string, any>, limit: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], NotificationConfig[]>>

}
