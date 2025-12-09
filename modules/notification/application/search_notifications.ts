import { type Either }     from "fp-ts/lib/Either"
import { isLeft, left }    from "fp-ts/lib/Either"
import {
  BaseException
}                          from "../../shared/domain/exceptions/base_exception"
import {
  genericEnsureSearch
}                          from "../../shared/utils/generic_ensure_search"
import { Notification }    from "../domain/notification"
import {
  NotificationRepository
} from "@/modules/notification/domain/notification_repository"

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
