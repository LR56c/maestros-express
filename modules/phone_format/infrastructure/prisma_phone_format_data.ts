import { PrismaClient }        from "@/lib/generated/prisma"
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
  PhoneFormat
}                              from "@/modules/phone_format/domain/phone_format"
import {
  PhoneFormatDAO
}                              from "@/modules/phone_format/domain/phone_format_dao"
import {
  PaginatedResult
}                              from "@/modules/shared/domain/paginated_result"

export class PrismaPhoneFormatData
  implements PhoneFormatDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( format: PhoneFormat ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.phoneFormat.create( {
        data: {
          id       : format.id.toString(),
          example     : format.example?.value,
          regex    : format.regex.value,
          prefix    : format.prefix.value,
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
      await this.db.phoneFormat.delete( {
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
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<PhoneFormat>>> {
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
      const offset               = skip ? parseInt( skip.value ) : 0
      const results = await this.db.$transaction([
        this.db.phoneFormat.findMany( {
          where  : where,
          orderBy: orderBy,
          skip   : offset,
          take   : limit?.value,
          include:{
            country: true
          }
        } ),
        this.db.phoneFormat.count( {
          where: where
        } )
      ])
      const [response, count] = results
      const formats: PhoneFormat[] = []
      for ( const f of response ) {
        const country = f.country
        const countryMapped = Country.fromPrimitives(
          country.id.toString(),
          country.name,
          country.code,
          country.createdAt
        )

        if ( countryMapped instanceof Errors ) {
          return left( countryMapped.values )
        }

        const mapped = PhoneFormat.fromPrimitives(
          f.id.toString(),
          f.prefix,
          f.regex,
          countryMapped,
          f.createdAt,
          f.example ? f.example  : undefined
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        formats.push( mapped )
      }
      return right( {
        items: formats,
        total: count
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async update( format: PhoneFormat ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.phoneFormat.update( {
        where: { id: format.id.toString() },
        data : {
          example     : format.example?.value,
          regex    : format.regex.value,
          prefix    : format.prefix.value,
          countryId: format.country.id.toString(),
        }
      } )
      return right( true )
    }
    catch ( error ) {
      return left( new InfrastructureException() )
    }
  }

}