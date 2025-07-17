import { PrismaClient }        from "@/lib/generated/prisma"
import {
  SpecialityDAO
}                              from "@/modules/speciality/domain/speciality_dao"
import { Speciality }          from "@/modules/speciality/domain/speciality"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  UUID
}                              from "@/modules/shared/domain/value_objects/uuid"
import {
  ValidInteger
}                              from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import * as changeCase         from "change-case"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"
import { PaginatedResult }     from "@/modules/shared/domain/paginated_result"

export class PrismaSpecialityData implements SpecialityDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( speciality: Speciality ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.speciality.create( {
        data: {
          id       : speciality.id.toString(),
          name     : speciality.name.value,
          createdAt: speciality.createdAt.toString()
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
      await this.db.speciality.delete( {
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

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[],PaginatedResult<Speciality>>> {
    try {
      let idsCount : number | undefined = undefined
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
          contains: query.name,
          mode    : "insensitive"
        }
      }
      if ( query.ids ) {
        const arr: string[] = query.ids.split( "," )
        const ids           = arr.map( i => UUID.from( i ).toString() )
        idsCount = ids.length
        // @ts-ignore
        where["id"]         = {
          in: ids
        }
      }

      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }

      const offset   = skip ? parseInt( skip.value ) : 0
      const results = await this.db.$transaction([
        this.db.speciality.findMany( {
          where  : where,
          orderBy: orderBy,
          skip   : offset,
          take   : limit?.value
        } ),
        this.db.speciality.count( {
          where: where
        })
      ])

      const [ response, total ] = results
      if( idsCount && response.length !== idsCount ) {
        return left( [new InfrastructureException( "Not all specialities found" )] )
      }

      const result: Speciality[] = []
      for ( const e of response ) {
        const mapped = Speciality.fromPrimitives( e.id.toString(),
          e.name,
          e.createdAt )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        result.push( mapped )
      }
      return right( {
        items: result,
        total: total
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async update( speciality: Speciality ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.speciality.update( {
        where: {
          id: speciality.id.toString()
        },
        data : {
          name: speciality.name.value
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }
}