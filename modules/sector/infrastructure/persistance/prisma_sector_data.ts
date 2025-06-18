import { PrismaClient }             from "@/lib/generated/prisma"
import {
  ValidInteger
}                                   from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                                   from "@/modules/shared/domain/value_objects/valid_string"
import { type Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                                   from "@/modules/shared/domain/exceptions/base_exception"
import * as changeCase              from "change-case"
import {
  InfrastructureException
}                                   from "@/modules/shared/domain/exceptions/infrastructure_exception"
import type { SectorDAO }           from "@/modules/sector/domain/sector_dao"
import { Sector }                   from "@/modules/sector/domain/sector"
import { Country }                  from "@/modules/country/domain/country"
import { Region }                   from "@/modules/region/domain/region"
import {
  Errors
}                                   from "@/modules/shared/domain/exceptions/errors"
import {
  queryMerger
}                                   from "@/modules/shared/infrastructure/prisma_query_utils"

export class PrismaSectorData implements SectorDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], Sector[]>> {
    try {
      let where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals: query.id
        }
      }
      if ( query.name ) {
        // @ts-ignore
        where["name"] = {
          contains: query.name
        }
      }
      if ( query.country_id ) {
        where = queryMerger( where, {
          municipality: {
            province: {
              region: {
                country: {
                  id: query.country_id
                }
              }
            }
          }
        } )
      }
      if ( query.country_name ) {
        where = queryMerger( where, {
          municipality: {
            province: {
              region: {
                country: {
                  name: query.country_name
                }
              }
            }
          }
        } )
      }
      if ( query.region_id ) {
        where = queryMerger( where, {
          municipality: {
            province: {
              region: {
                id: query.region_id
              }
            }
          }
        } )
      }
      if ( query.region_name ) {
        where = queryMerger( where, {
          municipality: {
            province: {
              region: {
                name: query.region_name
              }
            }
          }
        } )
      }
      if ( query.province_id ) {
        where = queryMerger( where, {
          municipality: {
            province: {
              id: query.province_id
            }
          }
        } )
      }
      if ( query.province_name ) {
        where = queryMerger( where, {
          municipality: {
            province: {
              name: query.province_name
            }
          }
        } )
      }
      if ( query.municipality_id ) {
        where = queryMerger( where, {
          municipality: {
            id: query.municipality_id
          }
        } )
      }
      if ( query.municipality_name ) {
        where = queryMerger( where, {
          municipality: {
            name: query.municipality_name
          }
        } )
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }

      const offset   = skip ? parseInt( skip.value ) : 0
      const response = await this.db.sector.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value,
        include: {
          region: {
            include: {
              country: true
            }
          }
        }
      } )

      const result: Sector[] = []
      for ( const e of response ) {
        const country_db = e.region.country
        const region_db  = e.region
        const c          = Country.fromPrimitivesThrow(
          country_db.id.toString(), country_db.name, country_db.code,
          country_db.createdAt )
        const r          = Region.fromPrimitivesThrow( region_db.id.toString(),
          region_db.name, c as Country, region_db.createdAt )
        const mapped     = Sector.fromPrimitives( e.id.toString(), e.name,
          r as Region, e.createdAt )
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
