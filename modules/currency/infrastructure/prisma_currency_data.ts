import { PrismaClient }        from "@/lib/generated/prisma"
import { CurrencyDAO }         from "@/modules/currency/domain/currency_dao"
import { Currency }            from "@/modules/currency/domain/currency"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import * as changeCase         from "change-case"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"
import {
  ValidInteger
}                              from "@/modules/shared/domain/value_objects/valid_integer"
import {
  PaginatedResult
}                              from "@/modules/shared/domain/paginated_result"

export class PrismaCurrencyData implements CurrencyDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( currency: Currency ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.currency.create( {
        data: {
          code       : currency.codeId.value,
          symbol     : currency.symbol.value,
          name       : currency.name.value,
          countryCode: currency.countryCode.value,
          decimals   : currency.decimals.value,
          createdAt  : currency.createdAt.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async remove( id: ValidString ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.currency.delete( {
        where: {
          code: id.value
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
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Currency>>> {
    try {
      let where = {}
      if ( query.code ) {
        // @ts-ignore
        where["code"] = {
          equals: query.code
        }
      }
      if ( query.name ) {
        // @ts-ignore
        where["name"] = {
          contains: query.name
        }
      }
      if ( query.country_code ) {
        // @ts-ignore
        where["countryCode"] = {
          contains: query.country_code
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }

      const offset                 = skip ? parseInt( skip.value ) : 0
      const results                = await this.db.$transaction( [
        this.db.currency.findMany( {
          where  : where,
          orderBy: orderBy,
          skip   : offset,
          take   : limit?.value
        } ),
        this.db.currency.count( {
          where: where
        } )
      ] )
      const [response, totalCount] = results
      const result: Currency[]     = []
      for ( const e of response ) {
        const mapped = Currency.fromPrimitives(
          e.code,
          e.symbol,
          e.name,
          e.countryCode,
          e.decimals,
          e.createdAt
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        result.push( mapped )
      }
      return right( {
        items: result,
        total: totalCount
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }

  }

  async update( currency: Currency ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.currency.update( {
        where: {
          code: currency.codeId.value
        },
        data : {
          symbol     : currency.symbol.value,
          name       : currency.name.value,
          countryCode: currency.countryCode.value,
          decimals   : currency.decimals.value
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

}