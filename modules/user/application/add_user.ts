import { UserDAO }                          from "@/modules/user/domain/user_dao"
import { type Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                           from "@/modules/shared/domain/exceptions/base_exception"
import { User }                             from "@/modules/user/domain/user"
import {
  DataAlreadyExistException
}                                           from "@/modules/shared/domain/exceptions/data_already_exist_exception"
import type {
  SearchRole
}                                           from "@/modules/role/application/search_role"
import type {
  UserRequest
}                                           from "@/modules/user/application/user_request"
import {
  Errors
}                                           from "@/modules/shared/domain/exceptions/errors"
import {
  wrapType
}                                           from "@/modules/shared/utils/wrap_type"
import {
  UUID
}                                           from "@/modules/shared/domain/value_objects/uuid"
import {
  DataNotFoundException
}                                           from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  ensureRoles
}                                           from "@/modules/user/utils/ensure_roles"

export class AddUser {
  constructor(
    private readonly dao: UserDAO,
    private readonly searchRole: SearchRole
  )
  {
  }

  private async ensureUserNotExist( id: string ): Promise<Either<BaseException[], boolean>> {
    const vid = wrapType( () => UUID.from( id ) )

    if ( vid instanceof BaseException ) {
      return left( [vid] )
    }

    const existResult = await this.dao.getById( vid as UUID )

    if ( isLeft( existResult ) ) {
      const notFound = existResult.left.some(
        error => error instanceof DataNotFoundException )
      return notFound ? right( true ) : left( existResult.left )
    }

    if ( existResult.right.userId.toString() === id )
    {
      return left( [new DataAlreadyExistException()] )
    }
    return right( true )
  }

  async execute( request: UserRequest ): Promise<Either<BaseException[], User>> {

    const userNotExist = await this.ensureUserNotExist( request.user_id )

    if ( isLeft( userNotExist ) ) {
      return left( userNotExist.left )
    }

    const roleResult = await ensureRoles( this.searchRole, request.roles )

    if ( isLeft( roleResult ) ) {
      return left( roleResult.left )
    }

    const user = User.create(
      request.user_id, request.email, request.name, request.surname,
      roleResult.right, request.avatar ? request.avatar : null )

    if ( user instanceof Errors ) {
      return left( user.values )
    }

    const result = await this.dao.add( user )
    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( user )
  }
}
