import {
  ValidInteger
}                          from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                          from "../../shared/domain/value_objects/valid_string"
import { type Either }     from "fp-ts/lib/Either"
import {
  BaseException
}                          from "../../shared/domain/exceptions/base_exception"
import { type PaginatedResult } from "../../shared/domain/paginated_result"
import { NotificationContent } from "./notification_content"

export abstract class NotificationContentDAO {
  abstract search( query: Record<string, any>, limit: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], PaginatedResult<NotificationContent>>>
}
