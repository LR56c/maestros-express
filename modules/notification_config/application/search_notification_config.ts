import {
  NotificationConfigDAO
}                       from "@/modules/notification_config/domain/notification_config_dao"
import type { Either }  from "fp-ts/Either"
import { isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import {
  NotificationConfig
}                       from "@/modules/notification_config/domain/notification_config"
import {
  genericEnsureSearch
}                       from "@/modules/shared/utils/generic_ensure_search"

export class SearchNotificationConfig {
  constructor( private readonly dao: NotificationConfigDAO ) {
  }

  async execute( query: Record<string, any>, limit: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], NotificationConfig[]>> {
    const searchParamsResult = genericEnsureSearch( limit, skip, sortBy,
      sortType )

    if ( isLeft( searchParamsResult ) ) {
      return left( searchParamsResult.left )
    }

    const {
            validLimit,
            validSkip,
            validSortBy,
            validSortType
          } = searchParamsResult.right

    return this.dao.search( query, validLimit!, validSkip, validSortBy,
      validSortType )
  }
}
