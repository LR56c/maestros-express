import { Notification } from "./notification"
import { ValidInteger } from "../../shared/domain/value_objects/valid_integer"
import { ValidString }  from "../../shared/domain/value_objects/valid_string"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import { type Either }  from "fp-ts/Either"

export abstract class NotificationRepository {
  abstract send( notification: Notification,
    tokens: string[] ): Promise<Either<BaseException, boolean>>

  abstract search( query: Record<string, any>, limit: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], Notification[]>>

  abstract update( notification: Notification ): Promise<Either<BaseException, boolean>>
}
