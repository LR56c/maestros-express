import { Errors }                    from "../../shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import {
  Email
}                                    from "../../shared/domain/value_objects/email"
import {
  BaseException
}                   from "../../shared/domain/exceptions/base_exception"
import { UserAuth } from "@/modules/user/domain/user"
import {
  UserResponse
}                   from "@/modules/user/application/models/user_response"
import {
  ValidString
}                                    from "@/modules/shared/domain/value_objects/valid_string"
import { AuthMethod }                from "@/modules/user/domain/auth_method"

export class UserMapper {
  static toDTO( user: UserAuth ): UserResponse {
    return {
      user_id  : user.userId.toString(),
      email    : user.email.value,
      avatar   : user.avatar?.value,
      full_name: user.fullName.value
    }
  }

  static toJSON( auth: UserResponse ): Record<string, any> {
    return {
      user_id  : auth.user_id,
      email    : auth.email,
      avatar   : auth.avatar,
      full_name: auth.full_name
    }
  }

  static fromJSON( json: Record<string, any> ): UserResponse | Errors {
    const errors = []
    const id     = wrapType(
      () => ValidString.from( json.user_id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const email = wrapType(
      () => Email.from( json.email ) )

    if ( email instanceof BaseException ) {
      errors.push( email )
    }

    const vname = wrapType(
      () => ValidString.from( json.full_name ) )

    if ( vname instanceof BaseException ) {
      errors.push( vname )
    }

    const avatar = wrapTypeDefault( undefined,
      ( value ) => ValidString.from( value ), json.avatar )

    if ( avatar instanceof BaseException ) {
      errors.push( avatar )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      user_id  : (
        id as ValidString
      ).value,
      email    : (
        email as Email
      ).value,
      full_name: (
        vname as ValidString
      ).value,
      avatar   : avatar instanceof ValidString ? avatar.value : undefined
    }
  }

  static toDomain( json: Record<string, any> ): UserAuth | Errors {
    return UserAuth.fromPrimitives(
      json.user_id,
      json.email,
      json.full_name,
      json.created_at,
      json.role,
      json.avatar,
    )
  }
}
