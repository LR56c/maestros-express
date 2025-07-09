import { ValidDate } from "@/modules/shared/domain/value_objects/valid_date"
import {
  ValidString
}                    from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidInteger
}                    from "@/modules/shared/domain/value_objects/valid_integer"
import { Errors }    from "@/modules/shared/domain/exceptions/errors"
import { wrapType }  from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                    from "@/modules/shared/domain/exceptions/base_exception"

export class Currency {
  private constructor(
    readonly codeId: ValidString,
    readonly symbol: ValidString,
    readonly name: ValidString,
    readonly countryCode: ValidString,
    readonly decimals: ValidInteger,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    codeId: string,
    symbol: string,
    name: string,
    countryCode: string,
    decimals: number
  ): Currency | Errors {
    return Currency.fromPrimitives(
      codeId,
      symbol,
      name,
      countryCode,
      decimals,
      ValidDate.nowUTC()
    )
  }

  static fromPrimitivesThrow(
    codeId: string,
    symbol: string,
    name: string,
    countryCode: string,
    decimals: number,
    createdAt: Date | string
  ): Currency {
    return new Currency(
      ValidString.from( codeId ),
      ValidString.from( symbol ),
      ValidString.from( name ),
      ValidString.from( countryCode ),
      ValidInteger.from( decimals ),
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    codeId: string,
    symbol: string,
    name: string,
    countryCode: string,
    decimals: number,
    createdAt: Date | string
  ): Currency | Errors {
    const errors = []

    const vCodeId = wrapType( () => ValidString.from( codeId ) )

    if ( vCodeId instanceof BaseException ) {
      errors.push( vCodeId )
    }

    const vSymbol = wrapType( () => ValidString.from( symbol ) )
    if ( vSymbol instanceof BaseException ) {
      errors.push( vSymbol )
    }

    const vName = wrapType( () => ValidString.from( name ) )
    if ( vName instanceof BaseException ) {
      errors.push( vName )
    }

    const vCountryCode = wrapType( () => ValidString.from( countryCode ) )
    if ( vCountryCode instanceof BaseException ) {
      errors.push( vCountryCode )
    }

    const vDecimals = wrapType( () => ValidInteger.from( decimals ) )
    if ( vDecimals instanceof BaseException ) {
      errors.push( vDecimals )
    }
    const vCreatedAt = wrapType( () => ValidDate.from( createdAt ) )
    if ( vCreatedAt instanceof BaseException ) {
      errors.push( vCreatedAt )
    }
    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Currency(
      vCodeId as ValidString,
      vSymbol as ValidString,
      vName as ValidString,
      vCountryCode as ValidString,
      vDecimals as ValidInteger,
      vCreatedAt as ValidDate
    )
  }
}