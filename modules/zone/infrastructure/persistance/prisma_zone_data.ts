import { PrismaClient }   from "@/lib/generated/prisma"
import { ZoneDAO }        from "@/modules/zone/domain/zone_dao"
import {
  ValidInteger
}                         from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import { type Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import { Zone }           from "@/modules/zone/domain/zone"
import {
  InfrastructureException
} from "@/modules/shared/domain/exceptions/infrastructure_exception"
import * as changeCase from "change-case"
import { Sector } from "@/modules/sector/domain/sector"
import { Country } from "@/modules/country/domain/country"
import { Region } from "@/modules/region/domain/region"
import { Errors } from "@/modules/shared/domain/exceptions/errors"

export class PrismaZoneData implements ZoneDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async search( query: Record<string, any>, limit?: ValidInteger, skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], Zone[]>> {
    try{
      const where = {}
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }

      const offset   = skip ? parseInt( skip.value ) : 0
      const response = await this.db.zone.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value,
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
        const s     = Sector.fromPrimitives( e.id.toString(), sector_db.name,
          r as Region, sector_db.createdAt )
        const mapped = Zone.fromPrimitives( e.id.toString(), e.workerId,
          s as Sector, e.createdAt)
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        result.push( mapped )
      }
      return right(result
      )
    }
    catch ( e ) {
      return left([ new  InfrastructureException()])
    }
  }


}