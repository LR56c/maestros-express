import { CountryMapper } from "@/modules/country/application/country_mapper"
import { Errors }                    from "@/modules/shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "@/modules/shared/utils/wrap_type"
import { UUID }                      from "@/modules/shared/domain/value_objects/uuid"
import {
  BaseException
}                        from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidString
}                        from "@/modules/shared/domain/value_objects/valid_string"
import { CountryDTO }    from "@/modules/country/application/country_dto"
import { PhoneFormat }   from "@/modules/phone_format/domain/phone_format"
import {
  PhoneFormatDTO
} from "@/modules/phone_format/application/phone_format_dto"

export class PhoneFormatMapper {
  static toDTO( nationalIdentity: PhoneFormat ): PhoneFormatDTO {
    return {
      id        : nationalIdentity.id.toString(),
      example: nationalIdentity.example?.value,
      regex      : nationalIdentity.regex.value,
      prefix      : nationalIdentity.prefix.value,
      country   : CountryMapper.toDTO( nationalIdentity.country )
    }
  }

  static toJSON( nationalIdentity: PhoneFormatDTO ): Record<string, any> {
    return {
      id        : nationalIdentity.id,
      example: nationalIdentity.example,
      regex      : nationalIdentity.regex,
      prefix      : nationalIdentity.prefix,
      country   : CountryMapper.toJSON( nationalIdentity.country )
    }
  }

  static fromJSON( phone: Record<string, any> ): PhoneFormatDTO | Errors {
    const errors = []

    const id = wrapType( () => UUID.from( phone.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const example = wrapTypeDefault(undefined,
      (value) => ValidString.from( value ),phone.example )

    if ( example instanceof BaseException ) {
      errors.push( example )
    }

    const regex = wrapType( () => ValidString.from( phone.regex ) )

    if ( regex instanceof BaseException ) {
      errors.push( regex )
    }

    const prefix = wrapType( () => ValidString.from( phone.prefix ) )

    if ( prefix instanceof BaseException ) {
      errors.push( prefix )
    }

    const country = CountryMapper.fromJSON( phone.country )

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
      example: example instanceof ValidString ? example.value : undefined,
      regex      : (
        regex as ValidString
      ).value,
      prefix      : (
        prefix as ValidString
      ).value,
      country   : country as CountryDTO
    }
  }

  static toDomain( json: Record<string, any> ): PhoneFormat | Errors {
    const country = CountryMapper.toDomain( json.country )

    if ( country instanceof Errors ) {
      return country
    }

    return PhoneFormat.fromPrimitives(
      json.id,
      json.prefix,
      json.regex,
      country,
      json.created_at,
      json.example
    )
  }
}