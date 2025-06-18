import { type Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import type { SectorDAO }            from "@/modules/sector/domain/sector_dao"
import type { Sector }               from "@/modules/sector/domain/sector"
import {
  genericEnsureSearch
}                                    from "@/modules/shared/utils/generic_ensure_search"

export class SearchSector {
  constructor( private readonly dao: SectorDAO ) {
  }

  async execute( query: Record<string, any>, limit?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], Sector[]>> {
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
