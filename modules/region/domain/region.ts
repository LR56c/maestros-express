import { ValidString } from "../../shared/domain/value_objects/valid_string"
import { Country }     from "../../country/domain/country"
import {
  ValidDate
}                      from "../../shared/domain/value_objects/valid_date"
import { Errors }      from "../../shared/domain/exceptions/errors"
import {
  BaseException
}                      from "../../shared/domain/exceptions/base_exception"
import { wrapType }    from "../../shared/utils/wrap_type"
import { UUID }        from "@/modules/shared/domain/value_objects/uuid"
import {
  InvalidUUIDException
} from "@/modules/shared/domain/exceptions/invalid_uuid_exception"

export class Region {
  private constructor(
    readonly id: UUID,
    readonly name: ValidString,
    private readonly _country: Country,
    readonly createdAt: ValidDate
  )
  {
  }

  get country(): Country {
    return this._country
  }

  static create(
    id: string,
    name: string,
    country: Country
  ): Region | Errors {
    return Region.fromPrimitives( id, name, country, ValidDate.nowUTC() )
  }

  static fromPrimitivesThrow(
    id: string,
    name: string,
    country: Country,
    createdAt: Date
  ): Region {
    return new Region(
      UUID.from( id ),
      ValidString.from( name ),
      country,
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    name: string,
    country: Country,
    createdAt: Date | string
  ): Region | Errors {
    const errors = []

    const idVO = wrapType<UUID, InvalidUUIDException>(
      () => UUID.from( id ) )

    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const nameVO = wrapType( () => ValidString.from( name ) )

    if ( nameVO instanceof BaseException ) {
      errors.push( nameVO )
    }

    const createdAtVO = wrapType( () => ValidDate.from( createdAt ) )

    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Region(
      idVO as UUID,
      nameVO as ValidString,
      country,
      createdAtVO as ValidDate
    )
  }
}
