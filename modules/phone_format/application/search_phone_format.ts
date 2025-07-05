import { type Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import {
  genericEnsureSearch
}                                    from "@/modules/shared/utils/generic_ensure_search"
import {
  PhoneFormatDAO
}                                    from "@/modules/phone_format/domain/phone_format_dao"
import {
  PhoneFormat
}                                    from "@/modules/phone_format/domain/phone_format"

export class SearchPhoneFormat {
  constructor( private readonly dao: PhoneFormatDAO ) {
  }

  async execute( query: Record<string, any>, limit ?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PhoneFormat[]>> {
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
