import {
  ValidInteger
}                          from "../../shared/domain/value_objects/valid_integer.js"
import {
  ValidString
}                          from "../../shared/domain/value_objects/valid_string.js"
import { type Either }     from "fp-ts/lib/Either.js"
import {
  BaseException
}                          from "../../shared/domain/exceptions/base_exception.js"
import { type PaginatedResult } from "../../shared/domain/paginated_result"
import { NotificationContent } from "./notification_content"

export abstract class NotificationContentDAO {
  abstract search( query: Record<string, any>, limit: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], PaginatedResult<NotificationContent>>>
}
