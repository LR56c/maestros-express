import { Errors }   from "../../shared/domain/exceptions/errors"
import {
  ValidString
}                   from "../../shared/domain/value_objects/valid_string"
import {
  InvalidStringException
}                   from "../../shared/domain/exceptions/invalid_string_exception"
import { wrapType } from "../../shared/utils/wrap_type"
import {
  BaseException
}                   from "../../shared/domain/exceptions/base_exception"
import { Sector }   from "@/modules/sector/domain/sector"
import type {
  SectorDTO
}                   from "@/modules/sector/application/sector_dto"
import { RegionMapper } from "@/modules/region/application/region_mapper"
import { UUID } from "@/modules/shared/domain/value_objects/uuid"
import {
  InvalidUUIDException
} from "@/modules/shared/domain/exceptions/invalid_uuid_exception"
import { RegionDTO } from "@/modules/region/application/region_dto"

export class SectorMapper {
  static toDTO( sector: Sector ): SectorDTO {
    return {
      id          : sector.id.toString(),
      name        : sector.name.value,
      region: RegionMapper.toDTO( sector.region )
    }
  }

  static toJSON( sector: SectorDTO ): Record<string, any> {
    return {
      id          : sector.id.toString(),
      name        : sector.name,
      region: RegionMapper.toJSON( sector.region )
    }
  }

  static fromJSON( sector: Record<string, any> ): SectorDTO | Errors {
    const errors = []

    const id = wrapType<UUID, InvalidUUIDException>(
      () => UUID.from( sector.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const name = wrapType<ValidString, InvalidStringException>(
      () => ValidString.from( sector.name ) )

    if ( name instanceof BaseException ) {
      errors.push( name )
    }

    const region = RegionMapper.fromJSON( sector.region )

    if ( region instanceof Errors ) {
      errors.push( ...region.values )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id          : (
        id as UUID
      ).toString(),
      name        : (
        name as ValidString
      ).value,
      region: (
        region as RegionDTO
      )
    }
  }

  static toDomain( json: Record<string, any> ): Sector | Errors {
    const region = RegionMapper.toDomain( json.region )

    if ( region instanceof Errors ) {
      return region
    }

    return Sector.fromPrimitives(
      json.id,
      json.name,
      region,
      json.created_at
    )
  }
}
