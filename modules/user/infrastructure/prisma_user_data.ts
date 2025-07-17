import * as changeCase         from "change-case"
import { UserDAO }             from "@/modules/user/domain/user_dao"
import { PrismaClient }        from "@/lib/generated/prisma"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import { User, UserAuth }      from "@/modules/user/domain/user"
import {
  ValidInteger
}                              from "@/modules/shared/domain/value_objects/valid_integer"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"
import {
  UUID
}                              from "@/modules/shared/domain/value_objects/uuid"
import {
  DataNotFoundException
}                              from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  PaginatedResult
}                              from "@/modules/shared/domain/paginated_result"

export class PrismaUserData implements UserDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( user: User ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.user.create( {
        data: {
          id       : user.userId.toString(),
          email    : user.email.value,
          name     : user.fullName.value,
          createdAt: user.createdAt.toString(),
          role     : user.role.toString(),
          status   : user.status.value,
          avatar   : user.avatar ? user.avatar.value : null
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
      await this.db.user.delete( {
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

  async update( user: User ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.user.update( {
        where: {
          id: user.userId.toString()
        },
        data : {
          role  : user.role.toString(),
          avatar: user.avatar ? user.avatar.value : null,
          status: user.status.value
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
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

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<User>>> {
    try {
      let where     = this.queryWhere( query )
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const offset = skip ? parseInt( skip.value ) : 0

      const results                = await this.db.$transaction( [
        this.db.user.findMany( {
          where  : where,
          orderBy: orderBy,
          skip   : offset,
          take   : limit?.value
        } ),
        this.db.user.count( {
          where: where
        } )
      ] )
      const [response, totalCount] = results
      if ( !response || response.length === 0 ) {
        return left( [new DataNotFoundException()] )
      }
      const users: User[] = []
      for ( const e of response ) {
        const user = UserAuth.fromPrimitives(
          e.id,
          e.email,
          e.name,
          e.createdAt,
          e.role,
          e.status,
          e.avatar ? e.avatar : null
        )
        if ( user instanceof Errors ) {
          return left( user.values )
        }
        users.push( user )
      }
      return right( {
        items: users,
        total  : totalCount
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }
}