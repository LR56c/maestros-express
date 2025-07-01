import { Email }                     from "../../shared/domain/value_objects/email"
import {
  ValidString
}                                    from "../../shared/domain/value_objects/valid_string"
import { AuthMethod }                from "./auth_method"
import {
  ValidDate
}                                    from "../../shared/domain/value_objects/valid_date"
import {
  Errors
}                                    from "../../shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import {
  UUID
}                                    from "@/modules/shared/domain/value_objects/uuid"

export class Auth {
  private constructor(
    readonly userId: UUID,
    readonly email: Email,
    readonly metadata: Record<string, any>,
    readonly authMethod: AuthMethod,
    readonly createdAt: ValidDate,
    readonly name ?: ValidString,
    readonly updatedAt ?: ValidDate,
    readonly lastLogin ?: ValidDate
  )
  {
  }

  static create(
    userId: string,
    email: string,
    metadata: Record<string, any>,
    authMethod: string,
    name?: string
  ): Auth | Errors {
    return Auth.fromPrimitives( userId, email, metadata, authMethod,
      ValidDate.nowUTC(), name, undefined, undefined )
  }

  static fromPrimitivesThrow(
    userId: string,
    email: string,
    metadata: Record<string, any>,
    authMethod: string,
    createdAt: Date | string,
    name?: string,
    updatedAt ?: Date | string,
    lastLogin ?: Date | string
  ): Auth {
    return new Auth(
      UUID.from( userId ),
      Email.from( email ),
      metadata,
      AuthMethod.from( authMethod ),
      ValidDate.from( createdAt ),
      name ? ValidString.from( name ) : undefined,
      updatedAt ? ValidDate.from( updatedAt ) : undefined,
      lastLogin ? ValidDate.from( lastLogin ) : undefined
    )
  }

  static fromPrimitives(
    userId: string,
    email: string,
    metadata: Record<string, any>,
    authMethod: string,
    createdAt: Date | string,
    name?: string,
    updatedAt ?: Date | string,
    lastLogin ?: Date | string
  ): Auth | Errors {
    const errors  = []
    const vuserId = wrapType(
      () => UUID.from( userId ) )
    if ( vuserId instanceof BaseException ) {
      errors.push( vuserId )
    }

    const vemail = wrapType( () => Email.from( email ) )

    if ( vemail instanceof BaseException ) {
      errors.push( vemail )
    }

    const vname = wrapTypeDefault( undefined, ( value ) =>
      ValidString.from( value ), name )

    if ( vname instanceof BaseException ) {
      errors.push( vname )
    }

    const vmethod = wrapType(
      () => AuthMethod.from( authMethod ) )

    if ( vmethod instanceof BaseException ) {
      errors.push( vmethod )
    }

    const vcreatedAt = wrapType(
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

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Auth(
      vuserId as UUID,
      vemail as Email,
      metadata,
      vmethod as AuthMethod,
      vcreatedAt as ValidDate,
      vname as ValidString | undefined,
      vupdatedAt as ValidDate | undefined,
      vlastLogin as ValidDate | undefined
    )

  }
}
