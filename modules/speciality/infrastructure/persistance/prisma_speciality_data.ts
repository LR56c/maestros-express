import { PrismaClient } from "@/lib/generated/prisma"
import { SpecialityDAO } from "@/modules/speciality/domain/speciality_dao"
import { Speciality }          from "@/modules/speciality/domain/speciality"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import { UUID } from "@/modules/shared/domain/value_objects/uuid"
import {
  ValidInteger
} from "@/modules/shared/domain/value_objects/valid_integer"
import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"
import {
  InfrastructureException
} from "@/modules/shared/domain/exceptions/infrastructure_exception"
import * as changeCase         from "change-case"
import {
  NotificationConfig
}                              from "@/modules/notification_config/domain/notification_config"
import { Errors }              from "@/modules/shared/domain/exceptions/errors"

export class PrismaSpecialityData implements SpecialityDAO{
  constructor( private readonly db: PrismaClient ) {
  }

  async add( speciality: Speciality ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.speciality.create( {
        data: {
          id                : speciality.id.toString(),
          name              : speciality.name.value,
          createdAt         : speciality.createdAt.toString()
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

  async search( query: Record<string, any>, limit?: ValidInteger, skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], Speciality[]>> {
    try {
      const where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals:  query.id
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }

      const offset   = skip ? parseInt( skip.value ) : 0
      const response = await this.db.speciality.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value
      } )

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
      return right( result )
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
          name     : speciality.name.value,
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }
}