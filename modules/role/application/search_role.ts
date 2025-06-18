import { type Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import type { Role }                 from "@/modules/role/domain/role"
import type { RoleDAO }              from "@/modules/role/domain/role_dao"
import {
  genericEnsureSearch
}                                    from "@/modules/shared/utils/generic_ensure_search"

export class SearchRole {
  constructor( private readonly dao: RoleDAO ) {
  }

  async execute( query: Record<string, any>, limit ?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], Role[]>> {
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
