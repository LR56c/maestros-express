import { CountryDAO }                from "@/modules/country/domain/country_dao"
import { type Either, isLeft, left } from "fp-ts/Either"
import { Country }                   from "@/modules/country/domain/country"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import {
  genericEnsureSearch
}                                    from "@/modules/shared/utils/generic_ensure_search"

export class SearchCountry {
  constructor( private readonly dao: CountryDAO ) {
  }

  async execute( query: Record<string, any>, limit ?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], Country[]>> {
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
