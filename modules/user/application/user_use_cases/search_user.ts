import { type Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import { User }                      from "@/modules/user/domain/user"
import { UserDAO }                   from "@/modules/user/domain/user_dao"
import {
  genericEnsureSearch
}                                    from "@/modules/shared/utils/generic_ensure_search"

export class SearchUser {
  constructor( private readonly dao: UserDAO ) {
  }

  async execute( query: Record<string, any>, limit?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], User[]>> {
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

    return this.dao.search( query, validLimit, validSkip, validSortBy,
      validSortType )
  }
}
