import {
  NationalIdentityFormat
}                   from "@/modules/national_identity_format/domain/national_identity_format"
import {
  NationalIdentityFormatDTO
}                   from "@/modules/national_identity_format/application/national_identity_format_dto"
import {
  CountryMapper
}                   from "@/modules/country/application/country_mapper"
import {
  Errors
}                   from "@/modules/shared/domain/exceptions/errors"
import { wrapType } from "@/modules/shared/utils/wrap_type"
import {
  UUID
}                   from "@/modules/shared/domain/value_objects/uuid"
import {
  BaseException
}                   from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidString
}                   from "@/modules/shared/domain/value_objects/valid_string"
import {
  CountryDTO
}                   from "@/modules/country/application/country_dto"

export class NationalIdentityFormatMapper {
  static toDTO( nationalIdentity: NationalIdentityFormat ): NationalIdentityFormatDTO {
    return {
      id        : nationalIdentity.id.toString(),
      name: nationalIdentity.name.value,
      regex      : nationalIdentity.regex.value,
      country   : CountryMapper.toDTO( nationalIdentity.country )
    }
  }

  static toJSON( nationalIdentity: NationalIdentityFormatDTO ): Record<string, any> {
    return {
      id        : nationalIdentity.id,
      name: nationalIdentity.name,
      regex      : nationalIdentity.regex,
      country   : CountryMapper.toJSON( nationalIdentity.country )
    }
  }

  static fromJSON( nationalIdentity: Record<string, any> ): NationalIdentityFormatDTO | Errors {
    const errors = []

    const id = wrapType( () => UUID.from( nationalIdentity.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const name = wrapType(
      () => ValidString.from( nationalIdentity.name ) )

    if ( name instanceof BaseException ) {
      errors.push( name )
    }

    const regex = wrapType( () => ValidString.from( nationalIdentity.regex ) )

    if ( regex instanceof BaseException ) {
      errors.push( regex )
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
      name: (
        name as ValidString
      ).value,
      regex      : (
        regex as ValidString
      ).value,
      country   : country as CountryDTO
    }
  }

  static toDomain( json: Record<string, any> ): NationalIdentityFormat | Errors {
    const country = CountryMapper.toDomain( json.country )

    if ( country instanceof Errors ) {
      return country
    }

    return NationalIdentityFormat.fromPrimitives(
      json.id,
      json.name,
      json.regex,
      country,
      json.created_at
    )
  }
}