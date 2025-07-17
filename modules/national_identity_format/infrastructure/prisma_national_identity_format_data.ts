import {
  NationalIdentityFormatDAO
}                              from "@/modules/national_identity_format/domain/national_identity_format_dao"
import { PrismaClient }        from "@/lib/generated/prisma"
import {
  NationalIdentityFormat
}                              from "@/modules/national_identity_format/domain/national_identity_format"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                              from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import {
  UUID
}                              from "@/modules/shared/domain/value_objects/uuid"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import * as changeCase         from "change-case"
import { Country }             from "@/modules/country/domain/country"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"
import {
  PaginatedResult
}                              from "@/modules/shared/domain/paginated_result"

export class PrismaNationalIdentityFormatData
  implements NationalIdentityFormatDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( format: NationalIdentityFormat ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.nationalIdentityFormat.create( {
        data: {
          id       : format.id.toString(),
          name     : format.name.value,
          regex    : format.regex.value,
          countryId: format.country.id.toString(),
          createdAt: format.createdAt.toString()
        }
      } )
      return right( true )
    }
    catch ( error ) {
      return left( new InfrastructureException() )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.nationalIdentityFormat.delete( {
        where: { id: id.toString() }
      } )
      return right( true )
    }
    catch ( error ) {
      return left( new InfrastructureException() )
    }
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<NationalIdentityFormat>>> {
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
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const offset = skip ? parseInt( skip.value ) : 0

      const results                           = await this.db.$transaction( [
        this.db.nationalIdentityFormat.findMany( {
          where  : where,
          orderBy: orderBy,
          skip   : offset,
          take   : limit?.value,
          include: {
            country: true
          }
        } ),
        this.db.nationalIdentityFormat.count( {
          where: where
        } )
      ] )
      const [response, totalCount]            = results
      const formats: NationalIdentityFormat[] = []
      for ( const f of response ) {
        const country       = f.country
        const countryMapped = Country.fromPrimitives(
          country.id.toString(),
          country.name,
          country.code,
          country.createdAt
        )

        if ( countryMapped instanceof Errors ) {
          return left( countryMapped.values )
        }

        const mapped = NationalIdentityFormat.fromPrimitives(
          f.id.toString(),
          f.name,
          f.regex,
          countryMapped,
          f.createdAt
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        formats.push( mapped )
      }
      return right( {
        items: formats,
        total: totalCount
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async update( format: NationalIdentityFormat ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.nationalIdentityFormat.update( {
        where: { id: format.id.toString() },
        data : {
          name     : format.name.value,
          regex    : format.regex.value,
          countryId: format.country.id.toString()
        }
      } )
      return right( true )
    }
    catch ( error ) {
      return left( new InfrastructureException() )
    }
  }

}