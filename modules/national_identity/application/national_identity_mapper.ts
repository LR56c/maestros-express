import {
  NationalIdentity
}                        from "@/modules/national_identity/domain/national_identity"
import {
  NationalIdentifierDTO
}                        from "@/modules/national_identity/application/national_identity_dto"
import { CountryMapper } from "@/modules/country/application/country_mapper"
import { Errors }        from "@/modules/shared/domain/exceptions/errors"
import { wrapType }      from "@/modules/shared/utils/wrap_type"
import { UUID }          from "@/modules/shared/domain/value_objects/uuid"
import {
  InvalidUUIDException
}                        from "@/modules/shared/domain/exceptions/invalid_uuid_exception"
import {
  BaseException
}                        from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidString
}                        from "@/modules/shared/domain/value_objects/valid_string"
import { CountryDTO }    from "@/modules/country/application/country_dto"

export class NationalIdentityMapper {
  static toDTO( nationalIdentity: NationalIdentity ): NationalIdentifierDTO {
    return {
      id        : nationalIdentity.id.toString(),
      identifier: nationalIdentity.identifier.value,
      type      : nationalIdentity.type.value,
      country   : CountryMapper.toDTO( nationalIdentity.country )
    }
  }

  static toJSON( nationalIdentity: NationalIdentifierDTO ): Record<string, any> {
    return {
      id        : nationalIdentity.id,
      identifier: nationalIdentity.identifier,
      type      : nationalIdentity.type,
      country   : CountryMapper.toJSON( nationalIdentity.country )
    }
  }

  static fromJSON( nationalIdentity: Record<string, any> ): NationalIdentifierDTO | Errors {
    const errors = []

    const id = wrapType( () => UUID.from( nationalIdentity.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const identifier = wrapType(
      () => ValidString.from( nationalIdentity.identifier ) )

    if ( identifier instanceof BaseException ) {
      errors.push( identifier )
    }

    const type = wrapType( () => ValidString.from( nationalIdentity.type ) )

    if ( type instanceof BaseException ) {
      errors.push( type )
    }

    const country = CountryMapper.fromJSON( nationalIdentity.country )

    if ( country instanceof Errors ) {
      errors.push( ...country.values )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id        : (
        id as UUID
      ).toString(),
      identifier: (
        identifier as ValidString
      ).value,
      type      : (
        type as ValidString
      ).value,
      country   : country as CountryDTO
    }
  }

  static toDomain( json: Record<string, any> ): NationalIdentity | Errors {
    const country = CountryMapper.toDomain( json.country )

    if ( country instanceof Errors ) {
      return country
    }

    return NationalIdentity.fromPrimitives(
      json.id,
      json.identifier,
      json.type,
      country,
      json.created_at
    )
  }
}