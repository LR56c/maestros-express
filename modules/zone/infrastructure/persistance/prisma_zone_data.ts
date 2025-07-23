import { PrismaClient }             from "@/lib/generated/prisma"
import { ZoneDAO }                  from "@/modules/zone/domain/zone_dao"
import { type Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                                   from "@/modules/shared/domain/exceptions/base_exception"
import { Zone }                     from "@/modules/zone/domain/zone"
import {
  InfrastructureException
}                                   from "@/modules/shared/domain/exceptions/infrastructure_exception"
import { Sector }                   from "@/modules/sector/domain/sector"
import { Country }                  from "@/modules/country/domain/country"
import { Region }                   from "@/modules/region/domain/region"
import {
  Errors
}                                   from "@/modules/shared/domain/exceptions/errors"
import {
  UUID
}                                   from "@/modules/shared/domain/value_objects/uuid"

export class PrismaZoneData implements ZoneDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async upsert( workerId: UUID,
    zones: Zone[] ): Promise<Either<BaseException, boolean>> {
    try{
      await this.db.$transaction([
        this.db.zone.deleteMany( {
          where: {
            workerId: workerId.value
          }
        }),
        this.db.zone.createMany( {
          data: zones.map( z => {
            return {
              id       : z.id.toString(),
              workerId : workerId.toString(),
              sectorId : z.sector.id.toString(),
              createdAt: z.createdAt.toString()
            }
          } )
        })
      ])
      return right(true)
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }


  async getByWorker( workerId: UUID ): Promise<Either<BaseException[], Zone[]>> {
    try {
      const response = await this.db.zone.findMany( {
        where  : { workerId: workerId.value },
        include: {
          sector: {
            include: {
              region: {
                include: {
                  country: true
                }
              }
            }
          }
        }
      } )

      const result: Zone[] = []
      for ( const e of response ) {
        const country_db = e.sector.region.country
        const region_db  = e.sector.region
        const sector_db  = e.sector
        const c          = Country.fromPrimitivesThrow(
          country_db.id.toString(), country_db.name, country_db.code,
          country_db.createdAt )
        const r          = Region.fromPrimitivesThrow( region_db.id.toString(),
          region_db.name, c as Country, region_db.createdAt )
        const s          = Sector.fromPrimitives( e.id.toString(),
          sector_db.name,
          r as Region, sector_db.createdAt )
        const mapped     = Zone.fromPrimitives( e.id.toString(), e.workerId,
          s as Sector, e.createdAt )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        result.push( mapped )
      }
      return right( result )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }
}