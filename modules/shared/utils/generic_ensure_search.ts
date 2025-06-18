import { wrapTypeDefault }          from "@/modules/shared/utils/wrap_type"
import {
  ValidInteger
}                                   from "@/modules/shared/domain/value_objects/valid_integer"
import {
  BaseException
}                                   from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidString
}                                   from "@/modules/shared/domain/value_objects/valid_string"
import { type Either, left, right } from "fp-ts/Either"

type GenericSearch = {
  validLimit?: ValidInteger,
  validSkip?: ValidString,
  validSortBy?: ValidString,
  validSortType?: ValidString
}
export const genericEnsureSearch = ( limit?: number,
  skip ?: string, sortBy ?: string,
  sortType ?: string ): Either<BaseException[], GenericSearch> => {
  const errors     = []
  const validLimit = wrapTypeDefault( undefined,
    ( limit ) => ValidInteger.from( limit ), limit )

  if ( validLimit instanceof BaseException ) {
    errors.push( validLimit )
  }

  const validSkip = wrapTypeDefault( undefined,
    ( value ) => ValidString.from( value ), skip )

  if ( validSkip instanceof BaseException ) {
    errors.push( validSkip )
  }

  const validSortBy = wrapTypeDefault( undefined,
    ( value ) => ValidString.from( value ), sortBy )

  if ( validSortBy instanceof BaseException ) {
    errors.push( validSortBy )
  }

  const validSortType = wrapTypeDefault( undefined,
    ( value ) => ValidString.from( value ), sortType )

  if ( validSortType instanceof BaseException ) {
    errors.push( validSortType )
  }

  if ( errors.length > 0 ) {
    return left( errors )
  }

  return right( {
    validLimit   : validLimit as ValidInteger | undefined,
    validSkip    : validSkip as ValidString | undefined,
    validSortBy  : validSortBy as ValidString | undefined,
    validSortType: validSortType as ValidString | undefined
  } )
}
