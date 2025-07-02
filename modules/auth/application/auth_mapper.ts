import { type AuthResponse }         from "./auth_response"
import { Auth }                      from "../domain/auth"
import {
  Errors
}                                    from "../../shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import {
  Email
}                                    from "../../shared/domain/value_objects/email"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import {
  UUID
}                                    from "@/modules/shared/domain/value_objects/uuid"
import { AuthMethod }                from "@/modules/auth/domain/auth_method"
import {
  ValidString
}                                    from "@/modules/shared/domain/value_objects/valid_string"

export class AuthMapper {
  static toDTO( auth: Auth ): AuthResponse {
    return {
      user_id : auth.userId.toString(),
      email   : auth.email.value,
      method  : auth.authMethod.value,
      metadata: auth.metadata
    }
  }

  static toJSON( auth: AuthResponse ): Record<string, any> {
    return {
      user_id : auth.user_id,
      email   : auth.email,
      method  : auth.method,
      metadata: auth.metadata
    }
  }

  static fromJSON( json: Record<string, any> ): AuthResponse | Errors {
    const errors = []
    const id     = wrapType(
      () => UUID.from( json.user_id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const email = wrapType(
      () => Email.from( json.email ) )

    if ( email instanceof BaseException ) {
      errors.push( email )
    }

    const method = wrapType( () => AuthMethod.from( json.method ) )

    if ( method instanceof BaseException ) {
      errors.push( method )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      user_id : (
        id as UUID
      ).toString(),
      email   : (
        email as Email
      ).value,
      method  : (
        method as AuthMethod
      ).value,
      metadata: json.metadata ?? {}
    }
  }

  static toDomain( json: Record<string, any> ): Auth | Errors {
    return Auth.fromPrimitives(
      json.user_id,
      json.email,
      json.metadata,
      json.method,
      json.created_at,
      json.updated_at,
    )
  }
}
