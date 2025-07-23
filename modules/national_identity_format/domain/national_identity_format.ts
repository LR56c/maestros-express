import { UUID }      from "@/modules/shared/domain/value_objects/uuid"
import {
  ValidString
}                    from "@/modules/shared/domain/value_objects/valid_string"
import { ValidDate } from "@/modules/shared/domain/value_objects/valid_date"
import { Country }   from "@/modules/country/domain/country"
import { wrapType }  from "@/modules/shared/utils/wrap_type"
import { Errors }    from "@/modules/shared/domain/exceptions/errors"
import {
  BaseException
}                    from "@/modules/shared/domain/exceptions/base_exception"

export class NationalIdentityFormat {
  private constructor(
    readonly id: UUID,
    readonly name: ValidString,
    readonly regex: ValidString,
    readonly country: Country,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    name: string,
    regex: string,
    country: Country
  ): NationalIdentityFormat | Errors {
    return NationalIdentityFormat.fromPrimitives( id, name, regex, country,
      ValidDate.nowUTC() )
  }

  static fromPrimitivesThrow(
    id: string,
    name: string,
    regex: string,
    country: Country,
    createdAt: Date | string
  ): NationalIdentityFormat {
    return new NationalIdentityFormat(
      UUID.from( id ),
      ValidString.from( name ),
      ValidString.from( regex ),
      country,
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    name: string,
    regex: string,
    country: Country,
    createdAt: Date | string
  ): NationalIdentityFormat | Errors {
    const errors = []

    const idVO = wrapType(
      () => UUID.from( id )
    )

    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const nameVO = wrapType(
      () => ValidString.from( name )
    )

    if ( nameVO instanceof BaseException ) {
      errors.push( nameVO )
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

    return new NationalIdentityFormat(
      idVO as UUID,
      nameVO as ValidString,
      regexVO as ValidString,
      country,
      created as ValidDate
    )
  }
}