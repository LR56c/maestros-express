import { Region }          from "../domain/region"
import { type RegionDTO }  from "./region_dto"
import {
  CountryMapper
}                          from "../../country/application/country_mapper"
import { Errors }          from "../../shared/domain/exceptions/errors"
import {
  ValidString
}                          from "../../shared/domain/value_objects/valid_string"
import {
  InvalidStringException
}                          from "../../shared/domain/exceptions/invalid_string_exception"
import { wrapType }        from "../../shared/utils/wrap_type"
import {
  BaseException
}                          from "../../shared/domain/exceptions/base_exception"
import { type CountryDTO } from "../../country/application/country_dto"
import { UUID }            from "@/modules/shared/domain/value_objects/uuid"
import {
  InvalidUUIDException
} from "@/modules/shared/domain/exceptions/invalid_uuid_exception"

export class RegionMapper {
  static toDTO( region: Region ): RegionDTO {
    return {
      id     : region.id.toString(),
      name   : region.name.value,
      country: CountryMapper.toDTO( region.country )
    }
  }

  static toJSON( region: RegionDTO ): Record<string, any> {
    return {
      id     : region.id.toString(),
      name   : region.name,
      country: CountryMapper.toJSON( region.country )
    }
  }

  static fromJSON( region: Record<string, any> ): RegionDTO | Errors {
    const errors = []

    const id = wrapType<UUID, InvalidUUIDException>(
      () => UUID.from( region.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const name = wrapType<ValidString, InvalidStringException>(
      () => ValidString.from( region.name ) )

    if ( name instanceof BaseException ) {
      errors.push( name )
    }

    const country = CountryMapper.fromJSON( region.country )

    if ( country instanceof Errors ) {
      errors.push( ...country.values )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id     : (
        id as UUID
      ).toString(),
      name   : (
        name as ValidString
      ).value,
      country: (
        country as CountryDTO
      )
    }
  }

  static toDomain( json: Record<string, any> ): Region | Errors {
    const country = CountryMapper.toDomain( json.country )

    if ( country instanceof Errors ) {
      return country
    }

    return Region.fromPrimitives(
      json.id,
      json.name,
      country,
      json.created_at
    )
  }
}
