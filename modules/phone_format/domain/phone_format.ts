import { UUID }                      from "@/modules/shared/domain/value_objects/uuid"
import {
  ValidString
}                                    from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidDate
}                                    from "@/modules/shared/domain/value_objects/valid_date"
import { Country }                   from "@/modules/country/domain/country"
import { wrapType, wrapTypeDefault } from "@/modules/shared/utils/wrap_type"
import {
  Errors
}                                    from "@/modules/shared/domain/exceptions/errors"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"

export class PhoneFormat {
  private constructor(
    readonly id: UUID,
    readonly prefix: ValidString,
    readonly regex: ValidString,
    readonly country: Country,
    readonly createdAt: ValidDate,
    readonly example ?: ValidString
  )
  {
  }

  static create(
    id: string,
    prefix: string,
    regex: string,
    country: Country,
    example?: string
  ): PhoneFormat | Errors {
    return PhoneFormat.fromPrimitives( id, prefix,regex, country,
      ValidDate.nowUTC(), example )
  }

  static fromPrimitivesThrow(
    id: string,
    prefix: string,
    regex: string,
    country: Country,
    createdAt: Date | string,
    example?: string
  ): PhoneFormat {
    return new PhoneFormat(
      UUID.from( id ),
      ValidString.from( prefix ),
      ValidString.from( regex ),
      country,
      ValidDate.from( createdAt ),
      example ? ValidString.from( example ) : undefined
    )
  }

  static fromPrimitives(
    id: string,
    prefix: string,
    regex: string,
    country: Country,
    createdAt: Date | string,
    example?: string
  ): PhoneFormat | Errors {
    const errors = []

    const idVO = wrapType(
      () => UUID.from( id )
    )

    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const prefixVO = wrapType(
      () => ValidString.from( prefix )
    )

    if ( prefixVO instanceof BaseException ) {
      errors.push( prefixVO )
    }

    const exampleVO = wrapTypeDefault( undefined,
      ( value ) => ValidString.from( value ), example
    )

    if ( exampleVO instanceof BaseException ) {
      errors.push( exampleVO )
    }

    const regexVO = wrapType(
      () => ValidString.from( regex )
    )

    if ( regexVO instanceof BaseException ) {
      errors.push( regexVO )
    }

    const created = wrapType(
      () => ValidDate.from( createdAt )
    )

    if ( created instanceof BaseException ) {
      errors.push( created )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new PhoneFormat(
      idVO as UUID,
      prefixVO as ValidString,
      regexVO as ValidString,
      country,
      created as ValidDate,
      exampleVO as ValidString | undefined
    )
  }
}