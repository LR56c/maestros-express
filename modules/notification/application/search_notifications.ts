import {
  NotificationRepository
}                       from "@/modules/notification/domain/notification_repository"
import type { Either }  from "fp-ts/Either"
import { isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import { Notification } from "@/modules/notification/domain/notification"
import {
  genericEnsureSearch
}                       from "@/modules/shared/utils/generic_ensure_search"

export class SearchNotifications {
  constructor( private readonly repo: NotificationRepository ) {
  }

  async execute( query: Record<string, any>, limit: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], Notification[]>> {
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

    return this.repo.search( query, validLimit!, validSkip, validSortBy,
      validSortType )
  }

}
