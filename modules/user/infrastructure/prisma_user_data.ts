import * as changeCase              from "change-case"
import { UserDAO }                  from "@/modules/user/domain/user_dao"
import { PrismaClient }             from "@/lib/generated/prisma"
import {
  ValidString
}                                   from "@/modules/shared/domain/value_objects/valid_string"
import { Either, left, right }      from "fp-ts/Either"
import {
  BaseException
}                                   from "@/modules/shared/domain/exceptions/base_exception"
import {
  InfrastructureException
}                                   from "@/modules/shared/domain/exceptions/infrastructure_exception"
import { User, UserAnon, UserAuth } from "@/modules/user/domain/user"
import {
  ValidInteger
}                                   from "@/modules/shared/domain/value_objects/valid_integer"
import {
  Errors
}                                   from "@/modules/shared/domain/exceptions/errors"

export class PrismaUserData implements UserDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  private queryWhere( query: Record<string, any> ): Record<string, any> {
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
        contains: query.name,
        mode    : "insensitive"
      }
    }
    if ( query.email ) {
      // @ts-ignore
      where["email"] = {
        contains: query.email,
        mode    : "insensitive"
      }
    }
    if ( query.role_id ) {
      // @ts-ignore
      where["usersRoles"] = {
        some: {
          roleId: query.role_id
        }
      }
    }
    if ( query.dates ) {
      const [start, end] = query.dates.split( ";" )
      // @ts-ignore
      where["createdAt"] = {
        gte: new Date( start ),
        lte: new Date( end )
      }
    }
    if ( query.roles_names ) {
      const arr: string[] = query.roles_names.split( "," )
      const names         = arr.map( i => ValidString.from( i ).value )
      // @ts-ignore
      where["usersRoles"] = {
        some: {
          role: {
            name: {
              in: names
            }
          }
        }
      }
    }
    return where
  }

  async count( query: Record<string, any> ): Promise<Either<BaseException[], ValidInteger>> {
    try {
      let where = this.queryWhere( query )
      const num = await this.db.user.count( {
        where: where
      } )
      return right( ValidInteger.from( num ) )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  private parseUser( e: any ): User | Errors {
    if ( e.isAnonymous === true ) {
      return UserAnon.fromPrimitives(
        e.id.toString(),
        e.email,
        e.name,
        e.createdAt
      )
    }
    else {
      return UserAuth.fromPrimitives(
        e.id.toString(),
        e.email,
        e.name,
        e.createdAt,
        e.role as "admin" | "client" | "worker",
        e.image
      )
    }
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], User[]>> {
    try {
      let where     = this.queryWhere( query )
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const offset   = skip ? parseInt( skip.value ) : 0
      const response = await this.db.user.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value
      } )
      // if ( !response || response.length === 0 ) {
      //   return left( [new DataNotFoundException()] )
      // }
      const users: User[] = []
      for ( const e of response ) {
        const user = this.parseUser(e)
        if( user instanceof Errors ) {
          return left( user.values )
        }
        users.push( user )
      }
      return right( users )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }
}