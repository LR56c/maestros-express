import { ValidString } from "../../shared/domain/value_objects/valid_string"
import {
  ValidDate
}                      from "../../shared/domain/value_objects/valid_date"
import { Errors }      from "../../shared/domain/exceptions/errors"
import {
  BaseException
}                      from "../../shared/domain/exceptions/base_exception"
import { wrapType }    from "../../shared/utils/wrap_type"
import type { Region } from "@/modules/region/domain/region"
import { Country }     from "@/modules/country/domain/country"
import {
  UUID
}                      from "@/modules/shared/domain/value_objects/uuid"
import {
  InvalidUUIDException
}                      from "@/modules/shared/domain/exceptions/invalid_uuid_exception"

export class Sector {
  private constructor(
    readonly id: UUID,
    readonly name: ValidString,
    private readonly _region: Region,
    readonly createdAt: ValidDate
  )
  {
  }

  get country(): Country {
    return this.region.country
  }

  get region(): Region {
    return this._region
  }

  static create(
    id: string,
    name: string,
    region: Region
  ): Sector | Errors {
    return Sector.fromPrimitives( id, name, region, ValidDate.nowUTC() )
  }

  static fromPrimitivesThrow(
    id: string,
    name: string,
    region: Region,
    createdAt: Date
  ): Sector {
    return new Sector(
      UUID.from( id ),
      ValidString.from( name ),
      region,
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    name: string,
    region: Region,
    createdAt: Date | string
  ): Sector | Errors {
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

    return new Sector(
      idVO as UUID,
      nameVO as ValidString,
      region,
      createdAtVO as ValidDate
    )
  }
}
