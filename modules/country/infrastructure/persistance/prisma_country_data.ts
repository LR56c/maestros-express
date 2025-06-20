import { type Either, left, right } from "fp-ts/Either"
import { Country }                  from "@/modules/country/domain/country"
import {
  BaseException
}                                   from "@/modules/shared/domain/exceptions/base_exception"
import {
  Errors
}                                   from "@/modules/shared/domain/exceptions/errors"
import {
  InfrastructureException
}                                   from "@/modules/shared/domain/exceptions/infrastructure_exception"
import { CountryDAO }               from "@/modules/country/domain/country_dao"
import {
  ValidInteger
}                                   from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                                   from "@/modules/shared/domain/value_objects/valid_string"
import * as changeCase              from "change-case"
import {
  ValidTSID
}                                   from "@/modules/shared/domain/value_objects/valid_TSID"
import { PrismaClient }             from "@/lib/generated/prisma"
import {
  UUID
}                                   from "@/modules/shared/domain/value_objects/uuid"


export class PrismaCountryData implements CountryDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( country: Country ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.country.create( {
        data: {
          id       : country.id.toString(),
          name     : country.name.value,
          code     : country.code.value,
          createdAt: country.createdAt.toString()
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
      await this.db.country.delete( {
        where: {
          id: id.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async update( country: Country ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.country.update( {
        where: {
          id: country.id.toString()
        },
        data : {
          name: country.name.value,
          code: country.code.value
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
    sortType?: ValidString ): Promise<Either<BaseException[], Country[]>> {
    try {
      const where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals: ValidTSID.from( query.id ).toString( "bigint" )
        }
      }
      if ( query.name ) {
        // @ts-ignore
        where["name"] = {
          contains: query.name
        }
      }
      if ( query.code ) {
        // @ts-ignore
        where["code"] = {
          equals: query.code
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const offset               = skip ? parseInt( skip.value ) : 0
      const response             = await this.db.country.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value
      } )
      const countries: Country[] = []
      for ( const country of response ) {
        const mapped = Country.fromPrimitives(
          country.id.toString(),
          country.name,
          country.code,
          country.createdAt
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        countries.push( mapped )
      }
      return right( countries )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

}
