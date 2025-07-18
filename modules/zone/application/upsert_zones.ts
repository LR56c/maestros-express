import { ZoneDAO }                     from "@/modules/zone/domain/zone_dao"
import { Zone }                        from "@/modules/zone/domain/zone"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ZoneDTO
}                                      from "@/modules/zone/application/zone_dto"
import {
  SearchSector
}                                      from "@/modules/sector/application/search_sector"
import { wrapType }                    from "@/modules/shared/utils/wrap_type"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"

export class UpsertZones
{
  constructor(
    private readonly dao: ZoneDAO,
    private readonly searchSectors: SearchSector
  )
  {
  }

  async execute( workerId: string,
    zones: ZoneDTO[] ): Promise<Either<BaseException[], Zone[]>> {

    const vWorkerId = wrapType( () => UUID.from( workerId ) )

    if ( vWorkerId instanceof BaseException ) {
      return left( [vWorkerId] )
    }

    const savedNewZones = new Map<string, ZoneDTO>(
      zones.map( z => [z.sector.id, z] ) )

    const sectorsResult = await this.searchSectors.execute( {
      ids: zones.map( z => z.sector.id ).join( "," )
    } )

    if ( isLeft( sectorsResult ) ) {
      return left( sectorsResult.left )
    }

    const verifiedNewZones = new Map<string, Zone>()
    for ( const sector of sectorsResult.right.items ) {
      const newZone = savedNewZones.get( sector.id.value )
      if ( newZone ) {
        const zone = Zone.create(
          newZone.id,
          vWorkerId.toString(),
          sector
        )
        if ( zone instanceof Errors ) {
          return left( zone.values )
        }
        verifiedNewZones.set( sector.id.value, zone )
      }
    }
    const zonesExistsResult = await this.dao.getByWorker( vWorkerId )

    if ( isLeft( zonesExistsResult ) ) {
      return left( zonesExistsResult.left )
    }

    const finalZonesMap = new Map<string, Zone>(
      zonesExistsResult.right.map( z => [z.sector.id.value, z] ) )

    for ( const [key, value] of verifiedNewZones.entries() ) {
      if ( !finalZonesMap.has( key ) ) {
        finalZonesMap.set( key, value )
      }
    }
    const finalZones = Array.from( finalZonesMap.values() )

    const result = await this.dao.upsert(vWorkerId, finalZones )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right(finalZones)
  }
}