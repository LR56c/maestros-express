import { type AuthResponse } from "./auth_response"
import { Auth }              from "../domain/auth"
import {
  Errors
}                            from "../../shared/domain/exceptions/errors"
import { wrapType }          from "../../shared/utils/wrap_type"
import {
  EmailException
}                            from "../../shared/domain/exceptions/email_exception"
import {
  Email
}                            from "../../shared/domain/value_objects/email"
import {
  BaseException
}                            from "../../shared/domain/exceptions/base_exception"
import { UUID }              from "@/modules/shared/domain/value_objects/uuid"
import {
  InvalidUUIDException
} from "@/modules/shared/domain/exceptions/invalid_uuid_exception"

export class AuthMapper {
  static toDTO( auth: Auth ): AuthResponse {
    return {
      user_id: auth.userId.toString(),
      email  : auth.email.value
    }
  }

  static toJSON( auth: AuthResponse ): Record<string, any> {
    return {
      user_id: auth.user_id,
      email  : auth.email
    }
  }

  static fromJSON( json: Record<string, any> ): AuthResponse | Errors {
    const errors = []
    const id     = wrapType<UUID, InvalidUUIDException>(
      () => UUID.from( json.user_id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const email = wrapType<Email, EmailException>(
      () => Email.from( json.email ) )

    if ( email instanceof BaseException ) {
      errors.push( email )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      user_id: (
        id as UUID
      ).toString(),
      email  : (
        email as Email
      ).value
    }
  }
}
