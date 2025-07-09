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
import {
  UUID
}                                   from "@/modules/shared/domain/value_objects/uuid"

export class PrismaSectorData implements SectorDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( sector: Sector ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.sector.create( {
        data: {
          id       : sector.id.value,
          name     : sector.name.value,
          regionId : sector.region.id.value,
          createdAt: sector.createdAt.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.sector.delete( {
        where: {
          id: id.value
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async update( sector: Sector ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.sector.update( {
        where: {
          id: sector.id.value
        },
        data: {
          name     : sector.name.value,
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
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
