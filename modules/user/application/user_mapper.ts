import { User }                      from "@/modules/user/domain/user"
import {
  Errors
}                                    from "@/modules/shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import type {
  UserResponse
}                                    from "@/modules/user/application/user_response"
import type { RoleDTO }              from "@/modules/role/application/role_dto"
import {
  RoleMapper
}                                    from "@/modules/role/application/role_mapper"
import {
  ValidString
}                                    from "@/modules/shared/domain/value_objects/valid_string"
import type { Role }                 from "@/modules/role/domain/role"
import {
  Email
}                                    from "@/modules/shared/domain/value_objects/email"
import {
  UUID
}                                    from "@/modules/shared/domain/value_objects/uuid"

export class UserMapper {
  static toDTO( user: User ): UserResponse {
    return {
      user_id   : user.userId.toString(),
      email     : user.email.value,
      name      : user.name.value,
      surname   : user.surname.value,
      avatar    : user.avatar?.value,
      roles     : user.roles.map( ( role ) => RoleMapper.toDTO( role ) )
    }
  }

  static toJSON( user: UserResponse ): Record<string, any> {
    return {
      user_id   : user.user_id,
      email     : user.email,
      name      : user.name,
      surname   : user.surname,
      avatar    : user.avatar,
      roles     : user.roles.map( ( role ) => role.name )
    }
  }

  static toDomain( json: Record<string, any> ): User | Errors {
    const roles: Role[] = []

    if ( json.roles && Array.isArray( json.roles ) ) {
      for ( const role of json.roles ) {
        const r = RoleMapper.toDomain( role )
        if ( r instanceof Errors ) {
          return r
        }
        roles.push( r )
      }
    }

    return User.fromPrimitive(
      json.user_id,
      json.email,
      json.name,
      json.surname,
      roles,
      json.created_at,
      json.avatar
    )
  }

  static fromJSON( user: Record<string, any> ): UserResponse | Errors {
    const errors = []

    const userId = wrapType( () => UUID.from( user.user_id ) )

    if ( userId instanceof BaseException ) {
      errors.push( userId )
    }

    const roles: RoleDTO[] = []
    for ( const role of user.roles ) {
      const r = RoleMapper.fromJSON( role )
      if ( r instanceof Errors ) {
        errors.push( ...r.values )
        break
      }
      roles.push( r )
    }

    const avatar = wrapTypeDefault( undefined,
      ( value ) => ValidString.from( value ), user.avatar )

    if ( avatar instanceof BaseException ) {
      errors.push( avatar )
    }

    const email = wrapType( () => Email.from( user.email ) )

    if ( email instanceof BaseException ) {
      errors.push( email )
    }

    const name = wrapType( () => ValidString.from( user.name ) )

    if ( name instanceof BaseException ) {
      errors.push( name )
    }

    const surname = wrapType( () => ValidString.from( user.surname ) )

    if ( surname instanceof BaseException ) {
      errors.push( surname )
    }

    if ( errors.length ) {
      return new Errors( errors )
    }

    return {
      user_id: (
        userId as UUID
      ).toString(),
      email  : (
        email as Email
      ).value,
      name   : (
        name as ValidString
      ).value,
      surname: (
        surname as ValidString
      ).value,
      avatar   : avatar instanceof ValidString ? avatar.value : undefined,
      roles  : roles
    }
  }
}
