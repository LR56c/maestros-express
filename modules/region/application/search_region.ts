import { RegionDAO }                 from "@/modules/region/domain/region_dao"
import { type Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import { Region }                    from "@/modules/region/domain/region"
import {
  genericEnsureSearch
}                                    from "@/modules/shared/utils/generic_ensure_search"
import {
  PaginatedResult
}                                    from "@/modules/shared/domain/paginated_result"

export class SearchRegion {
  constructor( private readonly dao: RegionDAO ) {
  }

  async execute( query: Record<string, any>, limit?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<Region>>> {
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
