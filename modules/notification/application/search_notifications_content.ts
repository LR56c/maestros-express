import { type Either }            from "fp-ts/lib/Either"
import { isLeft, left }           from "fp-ts/lib/Either"
import {
  BaseException
}                                 from "../../shared/domain/exceptions/base_exception"
import {
  genericEnsureSearch
}                                 from "../../shared/utils/generic_ensure_search"
import { type PaginatedResult }        from "../../shared/domain/paginated_result"
import { NotificationContentDAO } from "../domain/notification_content_dao"
import { NotificationContent }    from "../domain/notification_content"

export class SearchNotificationContents {
  constructor( private readonly repo: NotificationContentDAO ) {
  }

  async execute( query: Record<string, any>, limit: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<NotificationContent>>> {
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
