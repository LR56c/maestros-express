import { AuthRepository }  from "@/modules/user/domain/auth_repository"
import {
  ValidInteger
}                          from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                          from "@/modules/shared/domain/value_objects/valid_string"
import {
  BaseException
}                          from "@/modules/shared/domain/exceptions/base_exception"
import { PaginatedResult }      from "@/modules/shared/domain/paginated_result"
import { Either, isLeft, left } from "fp-ts/Either"
import { User }                 from "@/modules/user/domain/user"
import {
  genericEnsureSearch
}                          from "@/modules/shared/utils/generic_ensure_search"
import { UserDAO } from "@/modules/user/domain/user_dao"

export class SearchUsers {
  constructor( private readonly dao: UserDAO ) {
  }

  async execute( query: Record<string, any>, limit ?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<User>>>{
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