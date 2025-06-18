import { RegionDAO }                from "@/modules/region/domain/region_dao"
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
import { Region }                   from "@/modules/region/domain/region"
import * as changeCase              from "change-case"
import {
  Errors
}                                   from "@/modules/shared/domain/exceptions/errors"
import {
  InfrastructureException
}                                   from "@/modules/shared/domain/exceptions/infrastructure_exception"
import { Country }                  from "@/modules/country/domain/country"
import { PrismaClient }             from "@/lib/generated/prisma"

export class PrismaRegionData implements RegionDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], Region[]>> {
    try {
      const where = {}
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
        // @ts-ignore
        where["country"] = {
          id: query.country_id
        }
      }
      if ( query.country_name ) {
        // @ts-ignore
        where["country"] = {
          name: query.country_name
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }

      const offset   = skip ? parseInt( skip.value ) : 0
      const response = await this.db.region.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value,
        include: {
          country: true
        }
      } )

      const result: Region[] = []
      for ( const e of response ) {
        const c      = Country.fromPrimitivesThrow( e.country.id.toString(),
          e.country.name, e.country.code, e.country.createdAt )
        const mapped = Region.fromPrimitives( e.id.toString(), e.name,
          c as Country,
          e.createdAt )
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
