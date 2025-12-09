import { type Either }   from "fp-ts/lib/Either"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import {
  ValidInteger
} from "@/modules/shared/domain/value_objects/valid_integer"
import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"
import {
  Notification
}                                   from "@/modules/notification/domain/notification"
import {
  NotificationContent
} from "@/modules/notification/domain/notification_content"

export abstract class NotificationRepository {
  abstract addBulk(notification : NotificationContent, ids : string[]): Promise<Either<BaseException, boolean>>

  abstract search( query: Record<string, any>, limit: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], Notification[]>>

  abstract update( notification: Notification ): Promise<Either<BaseException, boolean>>
}
