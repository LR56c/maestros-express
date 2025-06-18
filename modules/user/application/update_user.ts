import { UserDAO }                          from "@/modules/user/domain/user_dao"
import { type Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                           from "@/modules/shared/domain/exceptions/base_exception"
import {
  wrapType,
  wrapTypeDefault
}                                           from "@/modules/shared/utils/wrap_type"
import { User }                             from "@/modules/user/domain/user"
import type {
  SearchRole
}                                           from "@/modules/role/application/search_role"
import type {
  UserUpdateDTO
}                                           from "@/modules/user/application/user_update_dto"
import type { Role }                        from "@/modules/role/domain/role"
import {
  ValidString
}                                           from "@/modules/shared/domain/value_objects/valid_string"
import {
  UUID
}                                           from "@/modules/shared/domain/value_objects/uuid"
import {
  DataNotFoundException
}                                           from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  ensureRoles
}                                           from "@/modules/user/utils/ensure_roles"

export class UpdateUser {
  constructor(
    private readonly dao: UserDAO,
    private readonly searchRole: SearchRole
  )
  {
  }


  private async ensureUserExist( id: string ): Promise<Either<BaseException[], User>> {
    const vid = wrapType( () => UUID.from( id ) )

    if ( vid instanceof BaseException ) {
      return left( [vid] )
    }

    const existResult = await this.dao.getById( vid as UUID )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    if ( existResult.right.userId.toString() !== id )
    {
      return left( [new DataNotFoundException()] )
    }
    return right( existResult.right )
  }


  async execute( id: string,
    dto: UserUpdateDTO ): Promise<Either<BaseException[], User>> {
    const userResult = await this.ensureUserExist( id )

    if ( isLeft( userResult ) ) {
      return left( userResult.left )
    }

    const errors = []

    const prevUser = userResult.right

    let newRoles: Role[] = []
    if ( dto.roles ) {
      const roles = await ensureRoles( this.searchRole, dto.roles )

      if ( isLeft( roles ) ) {
        errors.push( ...roles.left )
      }
      else {
        newRoles.push( ...roles.right )
      }
    }
    else if ( dto.roles === null ) {
      newRoles = []
    }
    else {
      newRoles.push( ...prevUser.roles )
    }

    const updatedAvatar = wrapTypeDefault( prevUser.avatar,
      ( value ) => ValidString.from( value ), dto.avatar )

    if ( updatedAvatar instanceof BaseException ) {
      errors.push( updatedAvatar )
    }

    if ( errors.length ) {
      return left( errors )
    }

    const newUser = User.from(
      prevUser.userId,
      prevUser.email,
      prevUser.name,
      prevUser.surname,
      newRoles,
      prevUser.createdAt,
      updatedAvatar as ValidString | undefined
    )

    const result = await this.dao.update( newUser )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( newUser )
  }

}
