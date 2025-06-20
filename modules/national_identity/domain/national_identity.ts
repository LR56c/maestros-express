import { UUID }        from "@/modules/shared/domain/value_objects/uuid"
import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"
import { ValidDate }   from "@/modules/shared/domain/value_objects/valid_date"
import { Country }     from "@/modules/country/domain/country"
import { wrapType }    from "@/modules/shared/utils/wrap_type"
import { Errors }      from "@/modules/shared/domain/exceptions/errors"
import {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"

export class NationalIdentity {
  private constructor(
    readonly id: UUID,
    readonly identifier: ValidString,
    readonly type: ValidString,
    readonly country: Country,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    identifier: string,
    type: string,
    country: Country
  ): NationalIdentity | Errors {
    return NationalIdentity.fromPrimitives( id, identifier, type, country,
      ValidDate.nowUTC() )
  }

  static fromPrimitivesThrow(
    id: string,
    identifier: string,
    type: string,
    country: Country,
    createdAt: Date | string
  ): NationalIdentity {
    return new NationalIdentity(
      UUID.from( id ),
      ValidString.from( identifier ),
      ValidString.from( type ),
      country,
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    identifier: string,
    type: string,
    country: Country,
    createdAt: Date | string
  ): NationalIdentity | Errors {
    const errors = []

    const idVO = wrapType(
      () => UUID.from( id )
    )

    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const identifierVO = wrapType(
      () => ValidString.from( identifier )
    )

    if ( identifierVO instanceof BaseException ) {
      errors.push( identifierVO )
    }

    const typeVO = wrapType(
      () => ValidString.from( type )
    )

    if ( typeVO instanceof BaseException ) {
      errors.push( typeVO )
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

    return new NationalIdentity(
      idVO as UUID,
      identifierVO as ValidString,
      typeVO as ValidString,
      country,
      created as ValidDate
    )
  }
}