import { SpecialityDAO } from "@/modules/speciality/domain/speciality_dao"
import {
  ValidInteger
}                         from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                               from "@/modules/shared/domain/value_objects/valid_string"
import { Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                               from "@/modules/shared/domain/exceptions/base_exception"
import { Speciality }     from "@/modules/speciality/domain/speciality"
import { Zone }           from "@/modules/zone/domain/zone"
import {
  genericEnsureSearch
}                         from "@/modules/shared/utils/generic_ensure_search"

export class SearchSpeciality {
  constructor( private readonly dao: SpecialityDAO ) {
  }

  async execute( query: Record<string, any>, limit?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], Speciality[]>> {
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