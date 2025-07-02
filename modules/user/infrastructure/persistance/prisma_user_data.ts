import { UserDAO }                  from "../../domain/user_dao"
import { PrismaClient }             from "@/lib/generated/prisma"
import { type Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                                   from "@/modules/shared/domain/exceptions/base_exception"
import { User }                     from "@/modules/user/domain/user"
import {
  InfrastructureException
}                                   from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  Errors
}                                   from "@/modules/shared/domain/exceptions/errors"
import {
  DataNotFoundException
}                                   from "@/modules/shared/domain/exceptions/data_not_found_exception"
import { Role }                     from "@/modules/role/domain/role"
import {
  ValidInteger
}                                   from "@/modules/shared/domain/value_objects/valid_integer"
import {
  ValidString
}                                   from "@/modules/shared/domain/value_objects/valid_string"
import * as changeCase              from "change-case"
import type {
  UUID
}                                   from "@/modules/shared/domain/value_objects/uuid"

export class PrismaUserData implements UserDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.myUser.delete( {
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
      await this.db.$transaction( [
        this.db.myUser.update( {
          where: {
            id: user.userId.value
          },
          data : {
            avatar: user.avatar ? user.avatar.value : null
          }
        } ),
        this.db.usersRoles.deleteMany( {
          where: {
            userId: user.userId.value
          }
        } ),
        this.db.usersRoles.createMany( {
          data: user.roles.map( e => {
            return {
              userId: user.userId.value,
              roleId: e.id.toString()
            }
          } )
        } )
      ] )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async add( user: User ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.myUser.create( {
          data: {
            id       : user.userId.value,
            email    : user.email.value,
            name     : user.name.value,
            surname  : user.surname.value,
            createdAt: user.createdAt.toString(),
            avatar   : user.avatar ? user.avatar.value : null
          }
        } ),
        this.db.usersRoles.createMany( {
          data: user.roles.map( e => {
            return {
              userId: user.userId.value,
              roleId: e.id.toString()
            }
          } )
        } )
      ] )
      return right( true )
    }
    catch ( e )
    {
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
          roleId:  query.role_id
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
      const num = await this.db.myUser.count( {
        where: where
      } )
      return right( ValidInteger.from( num ) )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
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
      const response = await this.db.myUser.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value,
        include: {
          usersRoles: {
            include: {
              role: true
            }
          }
        }
      } )

      // if ( !response || response.length === 0 ) {
      //   return left( [new DataNotFoundException()] )
      // }
      const users: User[] = []
      for ( const e of response ) {
        const roles: Role[] = []
        e.usersRoles.forEach( ur => {
          const r = Role.fromPrimitivesThrow(
            ur.role.id.toString(),
            ur.role.name,
            ur.role.createdAt,
            ur.role.updatedAt
          )
          roles.push( r )
        } )
        const result = User.fromPrimitive(
          e.id.toString(),
          e.email,
          e.name,
          e.surname,
          roles,
          e.createdAt,
          e.avatar
        )

        if ( result instanceof Errors ) {
          return left( result.values )
        }
        users.push( result )
      }
      return right( users )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async getById( id: UUID ):
    Promise<Either<BaseException[], User>> {
    try {
      const response = await this.db.myUser.findUnique( {
        where  : {
          id: id.toString()
        },
        include: {
          usersRoles: {
            include: {
              role: true
            }
          }
        }
      } )
      if ( !response ) {
        return left( [new DataNotFoundException()] )
      }
      const roles: Role[] = []
      response.usersRoles.forEach( ur => {
        const r = Role.fromPrimitivesThrow(
          ur.role.id.toString(),
          ur.role.name,
          ur.role.createdAt,
          ur.role.updatedAt
        )
        roles.push( r )
      } )
      const result = User.fromPrimitive(
        response.id.toString(),
        response.email,
        response.name,
        response.surname,
        roles,
        response.createdAt,
        response.avatar
      )

      if ( result instanceof Errors ) {
        return left( result.values )
      }
      return right( result )
    }
    catch ( e )
    {
      return left( [new InfrastructureException()] )
    }
  }
}
