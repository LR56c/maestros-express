import { Email }                     from "../../shared/domain/value_objects/email"
import {
  ValidString
}                                    from "../../shared/domain/value_objects/valid_string"
import { AuthMethod }                from "./auth_method"
import {
  ValidDate
}                                    from "../../shared/domain/value_objects/valid_date"
import {
  ValidBool
}                                    from "../../shared/domain/value_objects/valid_bool"
import {
  Errors
}                                    from "../../shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import {
  EmailException
}                                    from "../../shared/domain/exceptions/email_exception"
import {
  InvalidStringException
}                                    from "../../shared/domain/exceptions/invalid_string_exception"
import {
  InvalidDateException
}                                    from "../../shared/domain/exceptions/invalid_date_exception"
import {
  InvalidBooleanException
}                                    from "../../shared/domain/exceptions/invalid_boolean_exception"
import {
  InvalidAuthMethodException
}                                    from "./exceptions/invalid_auth_method_exception"
import {
  UUID
}                                    from "@/modules/shared/domain/value_objects/uuid"
import {
  InvalidUUIDException
}                                    from "@/modules/shared/domain/exceptions/invalid_uuid_exception"

export class Auth {
  private constructor(
    readonly userId: UUID,
    readonly email: Email,
    readonly name: ValidString,
    readonly authMethod: AuthMethod,
    readonly createdAt: ValidDate,
    readonly isActive: ValidBool,
    readonly updatedAt ?: ValidDate,
    readonly lastLogin ?: ValidDate
  )
  {
  }

  static create(
    userId: string,
    email: string,
    name: string,
    authMethod: string
  ): Auth | Errors {
    return Auth.fromPrimitives( userId, email, name, authMethod,
      ValidDate.nowUTC(),
      true, undefined, undefined )
  }

  static from(
    userId: UUID,
    email: Email,
    name: ValidString,
    authMethod: AuthMethod,
    createdAt: ValidDate,
    isActive: ValidBool,
    updatedAt ?: ValidDate,
    lastLogin ?: ValidDate
  ): Auth
  {
    return new Auth( userId, email, name, authMethod, createdAt, isActive,
      updatedAt, lastLogin )
  }

  static fromPrimitivesThrow(
    userId: string,
    email: string,
    name: string,
    authMethod: string,
    createdAt: Date,
    isActive: boolean,
    updatedAt ?: Date,
    lastLogin ?: Date
  ): Auth {
    return new Auth(
      UUID.from( userId ),
      Email.from( email ),
      ValidString.from( name ),
      AuthMethod.from( authMethod ),
      ValidDate.from( createdAt ),
      ValidBool.from( isActive ),
      updatedAt ? ValidDate.from( updatedAt ) : undefined,
      lastLogin ? ValidDate.from( lastLogin ) : undefined
    )
  }

  static fromPrimitives(
    userId: string,
    email: string,
    name: string,
    authMethod: string,
    createdAt: Date | string,
    isActive: boolean,
    updatedAt ?: Date | string,
    lastLogin ?: Date | string
  ): Auth | Errors {
    const errors  = []
    const vuserId = wrapType<UUID, InvalidUUIDException>(
      () => UUID.from( userId ) )
    if ( vuserId instanceof BaseException ) {
      errors.push( vuserId )
    }

    const vemail = wrapType<Email, EmailException>( () => Email.from( email ) )

    if ( vemail instanceof BaseException ) {
      errors.push( vemail )
    }

    const vname = wrapType<ValidString, InvalidStringException>(
      () => ValidString.from( name ) )

    if ( vname instanceof BaseException ) {
      errors.push( vname )
    }

    const vcreatedAt = wrapType<ValidDate, InvalidDateException>(
      () => ValidDate.from( createdAt ) )

    if ( vcreatedAt instanceof BaseException ) {
      errors.push( vcreatedAt )
    }

    const vupdatedAt = wrapTypeDefault(
      undefined,
      ( value ) => ValidDate.from( value ),
      updatedAt
    )

    if ( vupdatedAt instanceof BaseException ) {
      errors.push( vupdatedAt )
    }

    const vlastLogin = wrapTypeDefault(
      undefined,
      ( value ) => ValidDate.from( value ),
      lastLogin )

    if ( vlastLogin instanceof BaseException ) {
      errors.push( vlastLogin )
    }

    const visActive = wrapType<ValidBool, InvalidBooleanException>(
      () => ValidBool.from( isActive ) )

    if ( visActive instanceof BaseException ) {
      errors.push( visActive )
    }

    const vauthMethod = wrapType<AuthMethod, InvalidAuthMethodException>(
      () => AuthMethod.from( authMethod ) )

    if ( vauthMethod instanceof BaseException ) {
      errors.push( vauthMethod )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Auth(
      vuserId as UUID,
      vemail as Email,
      vname as ValidString,
      vauthMethod as AuthMethod,
      vcreatedAt as ValidDate,
      visActive as ValidBool,
      vupdatedAt as ValidDate | undefined,
      vlastLogin as ValidDate | undefined
    )

  }
}
