import { Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                               from "@/modules/shared/domain/exceptions/base_exception"
import {
  genericEnsureSearch
}                               from "@/modules/shared/utils/generic_ensure_search"
import { CurrencyDAO }          from "@/modules/currency/domain/currency_dao"
import { Currency }             from "@/modules/currency/domain/currency"

export class SearchCurrency {

  constructor(
    private readonly dao: CurrencyDAO
  )
  {
  }

  async execute( query: Record<string, any>, limit?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], Currency[]>> {
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