import { type Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import type { Sector }               from "@/modules/sector/domain/sector"
import {
  genericEnsureSearch
}                                    from "@/modules/shared/utils/generic_ensure_search"
import { ZoneDAO }                   from "@/modules/zone/domain/zone_dao"
import { Zone }                      from "@/modules/zone/domain/zone"

export class ZoneSector {
  constructor( private readonly dao: ZoneDAO ) {
  }

  async execute( query: Record<string, any>, limit?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], Zone[]>> {
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
