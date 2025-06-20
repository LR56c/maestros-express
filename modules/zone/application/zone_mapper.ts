import { ZoneDTO }   from "@/modules/zone/application/zone_dto"
import { Zone }      from "@/modules/zone/domain/zone"
import { Errors }    from "@/modules/shared/domain/exceptions/errors"
import { wrapType }  from "@/modules/shared/utils/wrap_type"
import {
  UUID
}                    from "@/modules/shared/domain/value_objects/uuid"
import {
  InvalidUUIDException
}                    from "@/modules/shared/domain/exceptions/invalid_uuid_exception"
import {
  BaseException
}                    from "@/modules/shared/domain/exceptions/base_exception"
import {
  SectorMapper
}                    from "@/modules/sector/application/sector_mapper"
import { SectorDTO } from "@/modules/sector/application/sector_dto"

export class ZoneMapper {
  static toDTO( zone: Zone ): ZoneDTO {
    return {
      id    : zone.id.toString(),
      sector: SectorMapper.toDTO( zone.sector )
    }
  }

  static toJSON( zone: ZoneDTO ): Record<string, any> {
    return {
      id    : zone.id.toString(),
      sector: SectorMapper.toJSON( zone.sector )
    }
  }

  static fromJSON( zone: Record<string, any> ): ZoneDTO | Errors {
    const errors = []

    const id = wrapType(
      () => UUID.from( zone.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const sector = SectorMapper.fromJSON( zone.region )

    if ( sector instanceof Errors ) {
      errors.push( ...sector.values )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id    : (
        id as UUID
      ).toString(),
      sector: (
        sector as SectorDTO
      )
    }
  }

  static toDomain( json: Record<string, any> ): Zone | Errors {
    const sector = SectorMapper.toDomain( json.sector )

    if ( sector instanceof Errors ) {
      return sector
    }

    return Zone.fromPrimitives(
      json.id,
      json.worker_id,
      sector,
      json.created_at
    )
  }
}