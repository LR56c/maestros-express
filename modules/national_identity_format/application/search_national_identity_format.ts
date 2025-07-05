import { type Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import {
  genericEnsureSearch
} from "@/modules/shared/utils/generic_ensure_search"
import {
  NationalIdentityFormatDAO
} from "@/modules/national_identity_format/domain/national_identity_format_dao"
import {
  NationalIdentityFormat
} from "@/modules/national_identity_format/domain/national_identity_format"

export class SearchNationalIdentityFormat {
  constructor( private readonly dao: NationalIdentityFormatDAO ) {
  }

  async execute( query: Record<string, any>, limit ?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], NationalIdentityFormat[]>> {
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
