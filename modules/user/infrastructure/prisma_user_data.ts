import { PrismaClient }        from "@/lib/generated/prisma"
import { UserDAO }             from "@/modules/user/domain/user_dao"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidInteger
}                              from "@/modules/shared/domain/value_objects/valid_integer"
import {
  PaginatedResult
}                              from "@/modules/shared/domain/paginated_result"
import { User, UserAuth }      from "@/modules/user/domain/user"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import { Either, left, right } from "fp-ts/Either"
import * as changeCase         from "change-case"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"

export class PrismaUserData  implements  UserDAO{
  constructor( private readonly db: PrismaClient ) {
  }

  async search( query: Record<string, any>, limit?: ValidInteger, skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<User>>> {
    try {
      const where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals: query.id
        }
      }
      if ( query.email ) {
        // @ts-ignore
        where["email"] = {
          equals: query.email
        }
      }
      if ( query.username ) {
        // @ts-ignore
        where["username"] = {
          equals: query.username
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
      const users: User[]   = []
      for ( const user of response ) {
        const mapped = UserAuth.fromPrimitives(
          user.id.toString(),
          user.email,
          user.username,
          user.name,
          user.createdAt,
          user.role,
          user.status,
          user.avatar,
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        users.push( mapped )
      }
      return right( {
        items: users,
        total: totalCount
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }

  }

}